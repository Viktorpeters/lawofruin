/* The reader's bookmarks: folded page corners, kept on this device. Each one remembers where
   the page began (the paragraph and the word), not the page number, so it still finds the
   right page after the text size or the screen changes. */

export type Mark = { seq: number; tok: number };
export type Bookmark = { id: string; a: Mark; head: string; page: string; at: number };

const KEY = "lor-bookmarks";
let list: Bookmark[] | null = null;
const subs = new Set<() => void>();

const cmp = (x: Mark, y: Mark) => x.seq - y.seq || x.tok - y.tok;

function all(): Bookmark[] {
  if (list) return list;
  try { list = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { list = []; }
  return list!;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage full or private mode */ }
  subs.forEach((f) => f());
}

export function bookmarks(): Bookmark[] { return [...all()].sort((x, y) => cmp(x.a, y.a)); }
export function subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }

/* the bookmark on a page that runs from `start` up to (not including) `end` */
export function onPage(start: Mark, end: Mark | null): Bookmark | undefined {
  return all().find((b) => cmp(b.a, start) >= 0 && (!end || cmp(b.a, end) < 0));
}

/* one tap: fold this page's corner, or unfold it if it is already folded */
export function toggle(start: Mark, end: Mark | null, head: string, page: string): "added" | "removed" {
  const hit = onPage(start, end);
  if (hit) { list = all().filter((b) => b !== hit); save(); return "removed"; }
  list = [...all(), { id: Math.random().toString(36).slice(2, 10), a: start, head, page, at: Date.now() }];
  save();
  return "added";
}

export function remove(id: string) {
  list = all().filter((b) => b.id !== id);
  save();
}
