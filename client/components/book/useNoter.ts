"use client";

/* Note mode: tapping a word picks its whole sentence. The sentence gets a thin red underline
   and its words, section and page are handed back so the note card can open on it.
   (A tap, not a drag: a finger that moves is left alone.) Pages do not turn meanwhile. */

import { useEffect, useRef } from "react";
import type { Spot } from "@/lib/book/highlights";

export type Picked = { a: Spot; b: Spot; quote: string; before: string; sec: string; head: string; page: string };

const ENDS = /[.!?…]["”’)\]]*$/;
const spot = (el: HTMLElement): Spot => { const [seq, tok] = el.dataset.k!.split(":").map(Number); return { seq, tok }; };

/* the words of one paragraph, in order, once each (a paragraph cut across two pages is in the
   page list twice over) */
function paragraph(seq: number): HTMLElement[] {
  const seen = new Set<string>();
  const out: HTMLElement[] = [];
  document.querySelectorAll<HTMLElement>(`[data-k^="${seq}:"]`).forEach((el) => {
    if (seen.has(el.dataset.k!)) return;
    seen.add(el.dataset.k!);
    out.push(el);
  });
  return out.sort((x, y) => spot(x).tok - spot(y).tok);
}

const words = (els: HTMLElement[]) => els.map((e) => e.textContent?.trim() ?? "").filter(Boolean).join(" ");

export function sentenceAt(el: HTMLElement): Picked | null {
  const s = spot(el);
  const para = paragraph(s.seq);
  const i = para.findIndex((e) => spot(e).tok === s.tok);
  if (i < 0) return null;
  let a = i;
  while (a > 0 && !ENDS.test(para[a - 1].textContent?.trim() ?? "")) a--;
  let b = i;
  while (b < para.length - 1 && !ENDS.test(para[b].textContent?.trim() ?? "")) b++;
  let pa = a - 1;
  while (pa > 0 && !ENDS.test(para[pa - 1].textContent?.trim() ?? "")) pa--;
  const page = el.closest<HTMLElement>("[data-head], [data-folio]");
  return {
    a: spot(para[a]),
    b: spot(para[b]),
    quote: words(para.slice(a, b + 1)),
    before: a > 0 ? words(para.slice(Math.max(0, pa), a)) : "",
    sec: el.closest<HTMLElement>("[data-sec]")?.dataset.sec ?? "",
    head: page?.dataset.head ?? "",
    page: page?.dataset.folio ?? "",
  };
}

/* the thin red underline under a sentence (and the spaces between its words) */
export function underline(a: Spot | null, b: Spot | null) {
  document.querySelectorAll("[data-nu]").forEach((e) => e.removeAttribute("data-nu"));
  if (!a || !b) return;
  document.querySelectorAll<HTMLElement>(`[data-k]`).forEach((el) => {
    const x = spot(el);
    if ((x.seq - a.seq || x.tok - a.tok) < 0 || (x.seq - b.seq || x.tok - b.tok) > 0) return;
    el.setAttribute("data-nu", "");
    const n = el.nextElementSibling as HTMLElement | null;
    if (n && el.nextSibling === n && n.hasAttribute("data-s") && (x.seq - b.seq || x.tok - b.tok) < 0) n.setAttribute("data-nu", "");
  });
}

type Opts = {
  on: boolean;                               // Note mode
  busy: boolean;                             // a note card is open: taps on the page do nothing
  allowed: (sec: string) => boolean;
  onBlocked: () => void;
  onPick: (p: Picked) => void;
  onOpen: (id: string) => void;              // a pen mark in the margin was tapped
};

export function useNoter({ on, busy, allowed, onBlocked, onPick, onOpen }: Opts) {
  const o = useRef({ busy, allowed, onBlocked, onPick, onOpen });
  o.current = { busy, allowed, onBlocked, onPick, onOpen };

  // the pen marks open their note whether Note mode is on or not
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const m = (e.target as Element).closest<HTMLElement>("[data-note]");
      if (!m) return;
      e.stopPropagation();
      e.preventDefault();
      o.current.onOpen(m.dataset.note!);
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, []);

  useEffect(() => {
    if (!on) return;
    document.body.classList.add("lor-noting");
    let start: { x: number; y: number; el: HTMLElement } | null = null;
    const down = (e: PointerEvent) => {
      if (!e.isPrimary || o.current.busy) return;
      const w = (e.target as Element).closest<HTMLElement>("[data-k]");
      start = w ? { x: e.clientX, y: e.clientY, el: w } : null;
    };
    const up = (e: PointerEvent) => {
      if (!start) return;
      const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10;
      const el = start.el;
      start = null;
      if (moved) return;
      const p = sentenceAt(el);
      if (!p) return;
      if (!o.current.allowed(p.sec)) { o.current.onBlocked(); return; }
      try { navigator.vibrate?.(6); } catch { /* not supported */ }
      underline(p.a, p.b);
      o.current.onPick(p);
    };
    const noMenu = (e: Event) => e.preventDefault();
    document.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("contextmenu", noMenu);
    document.addEventListener("selectstart", noMenu);
    return () => {
      document.body.classList.remove("lor-noting");
      document.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("contextmenu", noMenu);
      document.removeEventListener("selectstart", noMenu);
    };
  }, [on]);
}
