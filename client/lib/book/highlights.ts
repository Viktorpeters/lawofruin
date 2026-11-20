/* The reader's highlights, kept on this device (they work offline). Each highlight is tied to
   the words themselves, not to a page: from one word to another, each word named by its
   paragraph (seq) and its place in it (tok). Pages change with text size and screen; the
   words do not, so a highlight always lands on the same words.
   One list per language, because a French highlight is on French words. */

export type Spot = { seq: number; tok: number };
export type Colour = "y" | "r" | "g" | "b" | "p" | "v";
export type Highlight = {
  id: string; a: Spot; b: Spot; c: Colour; sec: string; at: number;
  text?: string;   // the highlighted words, kept so the list and the picture work with the page closed
  head?: string;   // "Preface · Why Power Blinds"
  page?: string;   // the page number when it was made
};

/* the six pencils */
export const COLOURS: { c: Colour; hex: string }[] = [
  { c: "y", hex: "#f2cf4a" },
  { c: "r", hex: "#e0574a" },
  { c: "g", hex: "#5fc287" },
  { c: "b", hex: "#5ea8ee" },
  { c: "p", hex: "#ef86b2" },
  { c: "v", hex: "#a785ee" },
];

const key = (lang: string) => `lor-hl-${lang}`;
let lang = "en";
let list: Highlight[] = [];
const subs = new Set<() => void>();

function load() {
  try { list = JSON.parse(localStorage.getItem(key(lang)) || "[]"); } catch { list = []; }
}
function save() {
  try { localStorage.setItem(key(lang), JSON.stringify(list)); } catch { /* storage full or private mode */ }
  subs.forEach((f) => f());
}

export const cmp = (x: Spot, y: Spot) => x.seq - y.seq || x.tok - y.tok;

export function setHighlightLang(l: string) {
  if (l === lang && list.length) return;
  lang = l;
  load();
  subs.forEach((f) => f());
}

export function highlights(): Highlight[] { return list; }

export function subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }

export function addHighlight(a: Spot, b: Spot, c: Colour, sec: string, extra: { text?: string; head?: string; page?: string } = {}) {
  const [from, to] = cmp(a, b) <= 0 ? [a, b] : [b, a];
  // a new stroke over an old one replaces the overlapping part of the old one
  list = list.filter((h) => cmp(h.b, from) < 0 || cmp(h.a, to) > 0);
  list.push({ id: Math.random().toString(36).slice(2, 10), a: from, b: to, c, sec, at: Date.now(), ...extra });
  list.sort((x, y) => cmp(x.a, y.a));
  save();
}

/* the eraser: every highlight the finger touches goes */
export function eraseAt(s: Spot) {
  const before = list.length;
  list = list.filter((h) => cmp(s, h.a) < 0 || cmp(s, h.b) > 0);
  if (list.length !== before) save();
}

/* the list in Contents: newest first */
export function highlightList(): Highlight[] { return [...list].sort((x, y) => y.at - x.at); }

export function removeHighlight(id: string) {
  list = list.filter((h) => h.id !== id);
  save();
}

export function recolour(id: string, c: Colour) {
  list = list.map((h) => (h.id === id ? { ...h, c } : h));
  save();
}

/* a moment's glow on a highlight, when the reader is taken to it from the list */
export function flash(h: Highlight) {
  document.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => {
    const [seq, tok] = el.dataset.k!.split(":").map(Number);
    if (cmp({ seq, tok }, h.a) >= 0 && cmp({ seq, tok }, h.b) <= 0) {
      el.setAttribute("data-flash", "");
      window.setTimeout(() => el.removeAttribute("data-flash"), 1600);
    }
  });
}

export function highlightAt(s: Spot): Highlight | undefined {
  return list.find((h) => cmp(s, h.a) >= 0 && cmp(s, h.b) <= 0);
}

/* the space after a word, if the page has one there */
const spaceAfter = (el: HTMLElement) => {
  const n = el.nextElementSibling as HTMLElement | null;
  return n && n.hasAttribute("data-s") && el.nextSibling === n ? n : null;
};

/* paint every highlight onto the words on the pages (and clear words no longer highlighted).
   A space between two highlighted words is painted too, so a run of words reads as one stroke;
   the space after the last word is not. */
export function paint(root: ParentNode | null) {
  if (!root) return;
  const words = root.querySelectorAll<HTMLElement>("[data-k]");
  let i = 0;
  words.forEach((el) => {
    const [seq, tok] = el.dataset.k!.split(":").map(Number);
    const s = { seq, tok };
    // highlights are sorted, and the words come in reading order, so one pass is enough
    while (i < list.length && cmp(list[i].b, s) < 0) i++;
    const h = list[i] && cmp(list[i].a, s) <= 0 ? list[i] : undefined;
    const sp = spaceAfter(el);
    if (h) el.dataset.c = h.c; else if (el.dataset.c) delete el.dataset.c;
    if (sp) {
      if (h && cmp(h.b, s) > 0) sp.dataset.c = h.c; else if (sp.dataset.c) delete sp.dataset.c;
    }
  });
}

/* the stroke under the finger, before it is kept */
export function preview(root: ParentNode, a: Spot, b: Spot, c: Colour): HTMLElement[] {
  const [from, to] = cmp(a, b) <= 0 ? [a, b] : [b, a];
  const lit: HTMLElement[] = [];
  root.querySelectorAll<HTMLElement>("[data-live]").forEach((el) => el.removeAttribute("data-live"));
  root.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => {
    const [seq, tok] = el.dataset.k!.split(":").map(Number);
    const s = { seq, tok };
    if (cmp(s, from) >= 0 && cmp(s, to) <= 0) {
      el.setAttribute("data-live", c);
      lit.push(el);
      const sp = spaceAfter(el);
      if (sp && cmp(s, to) < 0) sp.setAttribute("data-live", c);
    }
  });
  return lit;
}
