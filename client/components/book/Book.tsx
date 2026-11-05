"use client";

/* The book itself: cuts the text into pages that fit this screen, then hands them to the
   page-curl library (page-flip). On a phone it is one page filling the screen; on a wide
   screen it is an open two-page spread. The cover and the back are hard boards that swing
   open; every paper page curls from the corner you pull, with the shadow under the fold.

   The library owns the page elements, so React only owns the empty host <div>. Taps on a
   Who's Who name, a word, or a "Which are you?" option are caught here by one listener. */

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { PageFlip } from "page-flip";
import { buildBook, pageElement, pageClasses, type Anchor, type BuiltPage } from "./pages";
import s from "./book.module.css";

export type BookHandle = {
  flipTo: (index: number) => void;
  jumpTo: (sectionId: string) => void;
  next: () => void;
  prev: () => void;
  emblemRect: () => DOMRect | null;
};

export type PageInfo = { index: number; count: number; dark: boolean; secs: string[] };

type Props = {
  fontSize: number;                       // 15, 16 or 17.5
  visible: boolean;
  startFromPlace: boolean;                // returning reader: open where they stopped
  onReady: () => void;
  onPage: (info: PageInfo) => void;
  onWho: (id: string) => void;
  onWord: (id: string, rect: DOMRect) => void;
};

const PLACE_KEY = "lor-place";
const STANCE_KEY = "lor-stance";

type Place = { i: number; seq: number; tok: number; sec: string; w: number; h: number; fs: number };

function read<T>(key: string): T | null {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : null; } catch { return null; }
}
function write(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode: the place is simply not kept */ }
}
const cmp = (a: Anchor, b: Anchor) => a.seq - b.seq || a.tok - b.tok;

/* The page size for this screen. Phones: the full screen, one page. Wide screens: a spread. */
function measureScreen() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 760) return { w: vw, h: vh, spread: false };
  const h = Math.min(vh - 48, 920);
  return { w: Math.round(h / 1.5), h, spread: true };
}

/* When the reader lets go of a page mid-turn, does it go over or fall back?
   Out of the box the library only turns it if the corner was pulled all the way past the spine,
   which on a phone is the screen's left edge. A real page goes over once it passes the middle,
   so on a phone it now turns past the middle, and a quick flick always turns (`force`).
   Reaches into the library's own turn controller; if a future version renames it, this quietly
   does nothing and the library's default stays. */
type TurnController = {
  calc: { getPosition(): { x: number; y: number }; getCorner(): string } | null;
  getBoundsRect(): { pageWidth: number; height: number };
  animateFlippingTo(from: object, to: object, done: boolean): void;
  stopMove(): void;
  force?: boolean;
};
function turnController(pf: PageFlip): TurnController | null {
  const fc = (pf as unknown as { flipController?: TurnController }).flipController;
  if (!fc || typeof fc.animateFlippingTo !== "function" || typeof fc.getBoundsRect !== "function") return null;
  return fc;
}
function finishHalfwayTurns(pf: PageFlip, spread: boolean) {
  const fc = turnController(pf);
  if (!fc) return;
  fc.stopMove = function (this: TurnController) {
    if (!this.calc) return;
    const pos = this.calc.getPosition();
    const rect = this.getBoundsRect();
    const y = this.calc.getCorner() === "bottom" ? rect.height : 0;
    const over = this.force || pos.x <= (spread ? 0 : rect.pageWidth * 0.5);
    this.force = false;
    this.animateFlippingTo(pos, { x: over ? -rect.pageWidth : rect.pageWidth, y }, over);
  };
}

/* How a finger turns the page. The library's own handling picks the direction from WHERE the
   finger lands (left part of the page = back) and starts the curl from the nearest corner, so a
   finger that lands in the middle and moves right can pull the page forward. Here the direction
   comes from which way the finger MOVES, like a real book: move left and the page in front comes
   over; move right and the page behind comes back. The curl starts at the page's edge, at the
   height of the finger, and follows it. A tap on the outer third of the page turns it too;
   a tap in the middle never does, so reading and tapping names is safe. */
function attachGestures(pf: PageFlip, block: HTMLElement): () => void {
  type G = { id: number; x0: number; y0: number; fy0: number; t0: number; dir: "next" | "prev" | null; edgeX: number; x: number; y: number; h: number };
  let g: G | null = null;
  const local = (e: PointerEvent) => {
    const r = block.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
  };
  // the page's edge moves a little faster than the finger, so the curl keeps up with it;
  // up and down movement is damped, so the fold stays close to upright, like paper
  const at = (gg: G) => ({
    x: gg.edgeX + (gg.x - gg.x0) * 1.4,
    y: Math.min(Math.max(gg.y0 + (gg.y - gg.fy0) * 0.3, 1), gg.h - 1),
  });

  const down = (e: PointerEvent) => {
    if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
    const p = local(e);
    g = { id: e.pointerId, x0: p.x, y0: p.y, fy0: p.y, t0: performance.now(), dir: null, edgeX: 0, x: p.x, y: p.y, h: p.h };
  };

  const move = (e: PointerEvent) => {
    if (!g || e.pointerId !== g.id) return;
    const p = local(e);
    g.x = p.x;
    g.y = p.y;
    const dx = p.x - g.x0;
    const dy = p.y - g.y0;
    if (!g.dir) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 0.7) return;
      g.dir = dx < 0 ? "next" : "prev";
      // Grab the page by its outer edge. A finger near the top or bottom lifts that corner,
      // so the page curls diagonally from it. A finger anywhere in the middle pulls the whole
      // edge, so the fold stands upright and follows the finger across, never jumping to a corner.
      g.edgeX = g.dir === "next" ? p.w - 2 : 2;
      g.x0 = p.x;
      g.fy0 = p.y;
      const middle = p.y > p.h * 0.22 && p.y < p.h * 0.78;
      g.y0 = middle ? (p.y < p.h / 2 ? 1 : p.h - 1) : Math.min(Math.max(p.y, 12), p.h - 12);
      pf.startUserTouch({ x: g.edgeX, y: g.y0 });
      pf.userMove({ x: g.edgeX + (g.dir === "next" ? -6 : 6), y: g.y0 }, true);
      return;
    }
    pf.userMove(at(g), true);
  };

  const up = (e: PointerEvent) => {
    if (!g || e.pointerId !== g.id) return;
    const gg = g;
    g = null;
    const p = local(e);
    const ms = performance.now() - gg.t0;
    if (gg.dir) {
      // it turns on a quick flick, or once the finger has travelled a third of the page;
      // otherwise the page decides by how far it has come over
      const travel = (gg.dir === "next" ? gg.x0 - p.x : p.x - gg.x0);
      const flick = ms < 320 && travel > 24;
      const fc = turnController(pf);
      if (fc && (flick || travel > p.w * (p.w > 700 ? 0.18 : 0.33))) fc.force = true;
      gg.x = p.x;
      gg.y = p.y;
      pf.userStop(at(gg));
      return;
    }
    // a tap: only the outer thirds turn the page, and never a tap on a name, a word or a button
    if (ms > 450 || Math.abs(p.x - gg.x0) > 8 || Math.abs(p.y - gg.y0) > 8) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    const corner = p.y > p.h / 2 ? "bottom" : "top";
    if (p.x > p.w * 0.67) pf.flipNext(corner);
    else if (p.x < p.w * 0.33) pf.flipPrev(corner);
  };

  const cancel = (e: PointerEvent) => {
    if (!g || e.pointerId !== g.id) return;
    const gg = g;
    g = null;
    if (gg.dir) pf.userStop(at(gg));
  };

  block.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", cancel);
  return () => {
    block.removeEventListener("pointerdown", down);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", cancel);
  };
}

/* Wait for the book's fonts, so pages are measured in the real type, not a fallback. */
async function fontsReady() {
  const root = getComputedStyle(document.documentElement);
  const fams = ["--font-reading", "--font-display", "--font-accent", "--font-mono"].map((v) => root.getPropertyValue(v).trim()).filter(Boolean);
  const loads: Promise<unknown>[] = [];
  for (const f of fams) {
    loads.push(document.fonts.load(`16px ${f}`), document.fonts.load(`italic 16px ${f}`), document.fonts.load(`600 16px ${f}`));
  }
  await Promise.race([Promise.allSettled(loads), new Promise((r) => setTimeout(r, 2500))]);
  await document.fonts.ready;
}

const Book = forwardRef<BookHandle, Props>(function Book({ fontSize, visible, startFromPlace, onReady, onPage, onWho, onWord }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const flip = useRef<PageFlip | null>(null);
  const pages = useRef<BuiltPage[]>([]);
  const bookEl = useRef<HTMLDivElement | null>(null);
  // keep the latest callbacks without rebuilding the book when they change
  const cb = useRef({ onReady, onPage, onWho, onWord });
  cb.current = { onReady, onPage, onWho, onWord };
  const useSaved = useRef(startFromPlace);

  useImperativeHandle(ref, () => ({
    flipTo: (i) => {
      const pf = flip.current;
      if (!pf) return;
      const cur = pf.getCurrentPageIndex();
      // a near page turns with a curl; a far one opens straight there, as a reader would
      if (Math.abs(i - cur) <= 2) pf.flip(i); else pf.turnToPage(i);
      if (Math.abs(i - cur) > 2) report(i);
    },
    jumpTo: (sec) => {
      const i = pages.current.findIndex((p) => p.secs[0] === sec) >= 0
        ? pages.current.findIndex((p) => p.secs[0] === sec)
        : pages.current.findIndex((p) => p.secs.includes(sec));
      if (i >= 0 && flip.current) { flip.current.turnToPage(i); report(i); }
    },
    next: () => flip.current?.flipNext(),
    prev: () => flip.current?.flipPrev(),
    emblemRect: () => bookEl.current?.querySelector("[data-emblem] svg")?.getBoundingClientRect() ?? null,
  }));

  function report(i: number) {
    const p = pages.current[i];
    if (!p) return;
    const size = measureScreen();
    write(PLACE_KEY, { i, ...p.start, sec: p.secs[0], w: size.w, h: size.h, fs: fontSize } satisfies Place);
    cb.current.onPage({ index: i, count: pages.current.length, dark: !!p.dark, secs: p.secs });
  }

  // build (and rebuild on a new screen size or text size), keeping the reader's place
  useEffect(() => {
    let dead = false;
    let rebuildTimer = 0;
    let built = { w: 0, h: 0 };
    let detach = () => {};

    async function build() {
      const el = host.current;
      if (!el) return;
      const size = measureScreen();
      built = { w: size.w, h: size.h };

      // 1. a hidden page the same size as the real one, to measure text in
      const probe = document.createElement("div");
      probe.className = `${pageClasses.page} ${pageClasses.paper} ${pageClasses.measure}`;
      probe.style.width = `${size.w}px`;
      probe.style.height = `${size.h}px`;
      probe.style.setProperty("--fs", `${fontSize}px`);
      const box = document.createElement("div");
      box.className = pageClasses.inner;
      probe.appendChild(box);
      document.body.appendChild(probe);
      await fontsReady();
      if (dead) { probe.remove(); return; }

      // 2. cut the book into pages
      const before = flip.current ? pages.current[flip.current.getCurrentPageIndex()]?.start : null;
      let stance: string | null = null;
      try { stance = localStorage.getItem(STANCE_KEY); } catch { /* ignore */ }
      const built_ = buildBook(box, stance);
      probe.remove();
      pages.current = built_;

      // 3. where to open
      let start = 0;
      const saved = read<Place>(PLACE_KEY);
      const anchor = before ?? (useSaved.current && saved ? { seq: saved.seq, tok: saved.tok } : null);
      if (anchor) {
        if (!before && saved && saved.w === size.w && saved.h === size.h && saved.fs === fontSize && saved.i < built_.length) {
          start = saved.i; // same screen, same text size: the very same page
        } else {
          for (let i = 0; i < built_.length; i++) if (cmp(built_[i].start, anchor) <= 0 && built_[i].start.seq >= 0) start = i;
          if (start === 0 && saved && saved.i > 0) start = Math.min(saved.i, built_.length - 1);
        }
      }
      useSaved.current = false;

      // 4. hand the pages to the page-curl library
      detach();
      flip.current?.destroy();
      bookEl.current?.remove();
      const b = document.createElement("div");
      b.style.width = `${size.spread ? size.w * 2 : size.w}px`;
      b.style.height = `${size.h}px`;
      b.style.setProperty("--fs", `${fontSize}px`);
      el.appendChild(b);
      bookEl.current = b;

      let folio = 0;
      const els = built_.map((p) => pageElement(p, p.folio ? ++folio : null));
      const { PageFlip } = await import("page-flip");
      if (dead) { b.remove(); return; }
      const pf = new PageFlip(b, {
        width: size.w,
        height: size.h,
        size: "fixed",
        autoSize: false,
        showCover: true,
        usePortrait: true,
        startPage: start,
        drawShadow: true,
        maxShadowOpacity: 0.4,
        flippingTime: 850,
        mobileScrollSupport: false,
        swipeDistance: 24,
        showPageCorners: false,
        disableFlipByClick: false,  // the library never sees taps (useMouseEvents is off); this lets flipPrev work in one-page view
        useMouseEvents: false,      // fingers and the mouse are read by attachGestures below
      });
      pf.loadFromHTML(els);
      finishHalfwayTurns(pf, size.spread);
      detach = attachGestures(pf, b);
      pf.on("flip", (e) => report(e.data));
      flip.current = pf;
      report(start);
      cb.current.onReady();
    }

    build();

    // a new screen size (turning the phone) rebuilds; small height changes (browser bars) do not
    const onResize = () => {
      window.clearTimeout(rebuildTimer);
      rebuildTimer = window.setTimeout(() => {
        const n = measureScreen();
        if (Math.abs(n.w - built.w) > 2 || Math.abs(n.h - built.h) > 120) build();
      }, 250);
    };
    window.addEventListener("resize", onResize);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") flip.current?.flipNext();
      if (e.key === "ArrowLeft" || e.key === "PageUp") flip.current?.flipPrev();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      dead = true;
      detach();
      window.clearTimeout(rebuildTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      flip.current?.destroy();
      flip.current = null;
      bookEl.current?.remove();
      bookEl.current = null;
    };
    // rebuild only for a new text size; `report` reads the latest values through refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize]);

  // one listener for every tap inside the pages
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-who],[data-word],[data-stance]");
      if (!t) return;
      e.stopPropagation();
      if (t.dataset.who) cb.current.onWho(t.dataset.who);
      else if (t.dataset.word) cb.current.onWord(t.dataset.word, t.getBoundingClientRect());
      else if (t.dataset.stance) {
        const v = t.dataset.stance;
        try { localStorage.setItem(STANCE_KEY, v); } catch { /* ignore */ }
        el.querySelectorAll<HTMLElement>("[data-stance]").forEach((o) => o.setAttribute("aria-pressed", String(o.dataset.stance === v)));
      }
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, []);

  return (
    <div className={`${s.stage} ${visible ? "" : s.hidden}`}>
      <div ref={host} className={s.host} />
    </div>
  );
});

export default Book;
