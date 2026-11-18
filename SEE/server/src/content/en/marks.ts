/* Finds the Who's Who names and word-card words inside a paragraph and splits it into tokens,
   so the paginator can break a paragraph between any two words without breaking a name.
   A name is marked the first time it appears in a section; later mentions stay plain text. */
import { NAMES } from "./whoswho";
import { WORDS } from "./words";
import { PREFACE } from "./preface";
import { PARTS } from "./content";

export type Token =
  | { t: "text"; s: string }                        // one word with its trailing space, if any
  | { t: "who"; id: string; s: string; tail: string }
  | { t: "word"; id: string; s: string; tail: string };

const KEYS = [...Object.keys(NAMES), ...Object.keys(WORDS)].sort((a, b) => b.length - a.length);
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// a key must not touch other letters on either side ("Intel" must not match "intelligent").
// No lookbehind here: older iPhones (before iOS 16.4) cannot read it and the whole app would fail.
const FIND = new RegExp(`(^|[^\\p{L}\\p{N}])(${KEYS.map(esc).join("|")})(?![\\p{L}\\p{N}])`, "gu");

export function tokenize(text: string, seen: Set<string>): Token[] {
  const out: Token[] = [];
  const pushText = (chunk: string) => {
    // keep each word with the space after it, so joining tokens gives back the exact text
    for (const m of chunk.matchAll(/\S+\s*|\s+/g)) out.push({ t: "text", s: m[0] });
  };
  let last = 0;
  for (const m of text.matchAll(FIND)) {
    const key = m[2];
    const at = (m.index ?? 0) + m[1].length;
    const whoId = NAMES[key];
    const wordId = WORDS[key];
    const id = whoId ?? wordId;
    if (seen.has(id)) continue;
    seen.add(id);
    pushText(text.slice(last, at));
    // punctuation and the space right after the name ride with it
    const rest = text.slice(at + key.length);
    const tail = /^[^\s\p{L}\p{N}]*\s*/u.exec(rest)?.[0] ?? "";
    out.push(whoId ? { t: "who", id, s: key, tail } : { t: "word", id, s: key, tail });
    last = at + key.length + tail.length;
  }
  pushText(text.slice(last));
  return out;
}

/* Where each card appears (Preface sections and laws), for the "Appears in" chips on the card. */
export const APPEARS: Record<string, { id: string; label: string }[]> = (() => {
  const map: Record<string, { id: string; label: string }[]> = {};
  for (const sec of PREFACE) {
    const seen = new Set<string>();
    for (const b of sec.blocks) tokenize(b.t, seen);
    for (const id of seen) (map[id] ??= []).push({ id: sec.id, label: `Preface ${sec.num}` });
  }
  for (const part of PARTS) for (const law of part.laws) {
    const seen = new Set<string>();
    if (law.story) tokenize(law.story, seen);
    for (const sec of law.sections ?? []) tokenize(sec.text, seen);
    for (const id of seen) (map[id] ??= []).push({ id: `law-${law.n}`, label: `Law ${law.n}` });
  }
  return map;
})();
