"use client";

/* Painting with the finger. While Highlight is on, a finger (or the mouse) run across the
   words paints them in the chosen colour; it snaps to whole words because each word is its own
   piece of the page. Lifting the finger keeps the highlight. With the eraser on, every
   highlight the finger touches is wiped. Pages do not turn meanwhile (Book is paused). */

import { useEffect, useRef } from "react";
import { addHighlight, eraseAt, paint, preview, type Colour, type Spot } from "@/lib/book/highlights";

type Opts = {
  on: boolean;
  colour: Colour;
  erase: boolean;
  allowed: (sec: string) => boolean;    // the laws are for buyers; the Preface is for everyone
  onBlocked: () => void;
};

const spotOf = (el: Element | null): { s: Spot; el: HTMLElement; sec: string } | null => {
  const w = el?.closest<HTMLElement>("[data-k]");
  if (!w) return null;
  const [seq, tok] = w.dataset.k!.split(":").map(Number);
  const sec = w.closest<HTMLElement>("[data-sec]")?.dataset.sec ?? "";
  return { s: { seq, tok }, el: w, sec };
};

export function useHighlighter({ on, colour, erase, allowed, onBlocked }: Opts) {
  const o = useRef({ colour, erase, allowed, onBlocked });
  o.current = { colour, erase, allowed, onBlocked };

  useEffect(() => {
    if (!on) return;
    document.body.classList.add("lor-painting");
    let start: { s: Spot; sec: string } | null = null;
    let id = -1;
    let live: HTMLElement[] = [];

    const clearLive = () => {
      document.querySelectorAll<HTMLElement>("[data-live]").forEach((el) => el.removeAttribute("data-live"));
      live = [];
    };

    // show the stroke under the finger before it is kept
    const show = (a: Spot, b: Spot) => { live = preview(document, a, b, o.current.colour); };

    const down = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      const hit = spotOf(e.target as Element);
      if (!hit) return;
      e.preventDefault();
      if (!o.current.allowed(hit.sec)) { o.current.onBlocked(); return; }
      id = e.pointerId;
      if (o.current.erase) { eraseAt(hit.s); return; }
      start = { s: hit.s, sec: hit.sec };
      show(hit.s, hit.s);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      const hit = spotOf(document.elementFromPoint(e.clientX, e.clientY));
      if (!hit) return;
      if (o.current.erase) { eraseAt(hit.s); return; }
      if (start) show(start.s, hit.s);
    };

    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      if (start && live.length) {
        const first = live[0].dataset.k!.split(":").map(Number);
        const last = live[live.length - 1].dataset.k!.split(":").map(Number);
        // keep the words, the section and the page with the highlight, for the list and the picture
        const text = live.map((el) => el.textContent?.trim() ?? "").filter(Boolean).join(" ");
        const page = live[0].closest<HTMLElement>("[data-head], [data-folio]");
        addHighlight({ seq: first[0], tok: first[1] }, { seq: last[0], tok: last[1] }, o.current.colour, start.sec, {
          text, head: page?.dataset.head ?? "", page: page?.dataset.folio ?? "",
        });
      }
      start = null;
      clearLive();
    };

    const cancel = () => { id = -1; start = null; clearLive(); };
    // no text selection or callout menu on a long press while painting
    const noMenu = (e: Event) => e.preventDefault();

    document.addEventListener("pointerdown", down, { passive: false });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    document.addEventListener("contextmenu", noMenu);
    document.addEventListener("selectstart", noMenu);
    return () => {
      document.body.classList.remove("lor-painting");
      clearLive();
      document.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      document.removeEventListener("contextmenu", noMenu);
      document.removeEventListener("selectstart", noMenu);
    };
  }, [on]);
}

export { paint };
