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

/* On a phone the page's hinge is the screen's left edge, and out of the box the library only
   finishes a slow drag if the corner is pulled all the way past it. A real page goes over once
   it passes the middle, so a slow drag that lets go past the middle now finishes the turn
   (a quick swipe always turns). Reaches into the library's own turn controller; if a future
   version renames it, this quietly does nothing and the library's default stays. */
type TurnController = {
  calc: { getPosition(): { x: number; y: number }; getCorner(): string } | null;
  getBoundsRect(): { pageWidth: number; height: number };
  animateFlippingTo(from: object, to: object, done: boolean): void;
  stopMove(): void;
};
function finishHalfwayTurns(pf: PageFlip) {
  const fc = (pf as unknown as { flipController?: TurnController }).flipController;
  if (!fc || typeof fc.animateFlippingTo !== "function" || typeof fc.getBoundsRect !== "function") return;
  fc.stopMove = function (this: TurnController) {
    if (!this.calc) return;
    const pos = this.calc.getPosition();
    const rect = this.getBoundsRect();
    const y = this.calc.getCorner() === "bottom" ? rect.height : 0;
    const over = pos.x <= rect.pageWidth * 0.5;
    this.animateFlippingTo(pos, { x: over ? -rect.pageWidth : rect.pageWidth, y }, over);
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
        showPageCorners: true,
        disableFlipByClick: true,
        clickEventForward: true,
        useMouseEvents: true,
      });
      pf.loadFromHTML(els);
      if (!size.spread) finishHalfwayTurns(pf);
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
