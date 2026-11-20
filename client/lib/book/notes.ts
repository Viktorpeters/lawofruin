/* The reader's notes: a diary inside the book, kept on this device (they work offline).
   Two kinds:
   - a line note, written under a sentence: tied to that sentence's words (from a to b),
     so it stays on the right line at any text size or screen;
   - a page note, written on the page itself: tied to where the page began.
   Each note keeps the words it was written under, the section and the page, so the diary and
   the share picture can show them without the page being open.
   One list per language, like highlights. */

import type { Spot } from "./highlights";

export type Note = {
  id: string;
  kind: "line" | "page";
  a: Spot;              // a line note: the first word of its sentence; a page note: where its page began
  b?: Spot;             // a line note: the last word of its sentence
  quote: string;        // the sentence (line notes only)
  before: string;       // the sentence before it, for the picture (line notes only)
  sec: string;
  head: string;         // "Preface · Why Power Blinds"
  page: string;         // the page number when it was written
  text: string;
  at: number;           // written
  ed?: number;          // last edited
};

const cmp = (x: Spot, y: Spot) => x.seq - y.seq || x.tok - y.tok;
const key = (lang: string) => `lor-notes-${lang}`;
let lang = "en";
let list: Note[] = [];
let loaded = false;
const subs = new Set<() => void>();

function load() {
  try { list = JSON.parse(localStorage.getItem(key(lang)) || "[]"); } catch { list = []; }
  loaded = true;
}
function save() {
  try { localStorage.setItem(key(lang), JSON.stringify(list)); } catch { /* storage full or private mode */ }
  subs.forEach((f) => f());
}

export function setNotesLang(l: string) {
  if (l === lang && loaded) return;
  lang = l;
  load();
  subs.forEach((f) => f());
}

export function notes(): Note[] { if (!loaded) load(); return list; }
/* newest first, the way a diary is read back */
export function diary(): Note[] { return [...notes()].sort((x, y) => (y.ed ?? y.at) - (x.ed ?? x.at)); }
export function noteById(id: string) { return notes().find((n) => n.id === id); }
export function subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }

export function addNote(n: Omit<Note, "id" | "at">): Note {
  const note = { ...n, id: Math.random().toString(36).slice(2, 10), at: Date.now() };
  list = [...notes(), note];
  save();
  return note;
}
export function updateNote(id: string, text: string) {
  list = notes().map((n) => (n.id === id ? { ...n, text, ed: Date.now() } : n));
  save();
}
export function removeNote(id: string) {
  list = notes().filter((n) => n.id !== id);
  save();
}

/* the page notes on a page that runs from `start` up to (not including) `end` */
export function pageNotesOn(start: Spot, end: Spot | null): Note[] {
  return notes().filter((n) => n.kind === "page" && cmp(n.a, start) >= 0 && (!end || cmp(n.a, end) < 0));
}

const PEN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.4L16.6 4.2a1.8 1.8 0 0 1 2.6 0l.6.6a1.8 1.8 0 0 1 0 2.6L8.4 18.8zM14.5 6.3l3.2 3.2" /></svg>';

/* the pen marks in the margin: one beside the first word of every noted sentence. The mark sits
   in the line's own flow (absolutely placed to the left of the paragraph), so it lands on the
   right line without measuring anything. */
export function paintNotes(root: ParentNode | null, markClass: string) {
  if (!root) return;
  root.querySelectorAll(`.${markClass}`).forEach((m) => m.remove());
  const firsts = new Map<string, string>();
  for (const n of notes()) if (n.kind === "line" && !firsts.has(`${n.a.seq}:${n.a.tok}`)) firsts.set(`${n.a.seq}:${n.a.tok}`, n.id);
  if (!firsts.size) return;
  root.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => {
    const id = firsts.get(el.dataset.k!);
    if (!id) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = markClass;
    b.dataset.note = id;
    b.setAttribute("aria-label", "Note");
    b.innerHTML = PEN;
    el.before(b);
  });
}
