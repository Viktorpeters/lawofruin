/* The book's words, served to the app. The free pages (front matter, Preface, Who's Who, word
   cards, the list of laws) go to everyone. A law's own text (its Judgment, story, Key and twelve
   sections) goes only to a reader who owns the investigation, and only once its part is released.
   Translations are read from server/translations/<lang>.json, made by `npm run translate`. */
import fs from "fs";
import path from "path";
import * as FRONT from "../../content/en/front";
import { PREFACE } from "../../content/en/preface";
import { PARTS, PASS_LINE } from "../../content/en/content";
import { PEOPLE, NAMES } from "../../content/en/whoswho";
import { WORD_CARDS, WORDS } from "../../content/en/words";
import type { Law, Part } from "../../content/en/types";

export const LANGS = ["en", "fr", "es", "pt", "de"] as const;
export type Lang = (typeof LANGS)[number];

const EN = {
  front: { TITLE: FRONT.TITLE, COPYRIGHT: FRONT.COPYRIGHT, DEDICATION: FRONT.DEDICATION, EPIGRAPHS: FRONT.EPIGRAPHS, FOR_THOSE: FRONT.FOR_THOSE, WHICH: FRONT.WHICH, END: FRONT.END },
  preface: PREFACE,
  passLine: PASS_LINE,
  parts: PARTS,
  people: PEOPLE,
  words: WORD_CARDS,
};
export type BookText = typeof EN;
export const ENGLISH: BookText = EN;

const cache = new Map<Lang, BookText>();
const dir = path.join(process.cwd(), "translations");

/* a translation, or English for anything it does not cover yet */
export function textFor(lang: Lang): BookText {
  if (lang === "en") return EN;
  const hit = cache.get(lang);
  if (hit) return hit;
  let t: Partial<BookText> = {};
  try { t = JSON.parse(fs.readFileSync(path.join(dir, `${lang}.json`), "utf8")); } catch { /* not translated yet */ }
  const merged: BookText = {
    front: { ...EN.front, ...(t.front ?? {}) },
    preface: t.preface?.length === EN.preface.length ? t.preface : EN.preface,
    passLine: t.passLine ?? EN.passLine,
    parts: EN.parts.map((p, i) => mergePart(p, t.parts?.[i])),
    people: EN.people.map((p) => ({ ...p, ...(t.people?.find((x) => x.id === p.id) ?? {}) })),
    words: EN.words.map((w) => ({ ...w, ...(t.words?.find((x) => x.id === w.id) ?? {}) })),
  };
  cache.set(lang, merged);
  return merged;
}

function mergePart(en: Part, tr: Part | undefined): Part {
  if (!tr) return en;
  return { ...en, ...tr, n: en.n, opens: en.opens, laws: en.laws.map((l, i) => ({ ...l, ...(tr.laws?.[i] ?? {}), n: l.n })) };
}

/* "20 Dec 2026" means midnight in Lagos on that day */
export function releasedAt(part: Part) {
  return new Date(`${part.opens} 00:00:00 GMT+0100`);
}

export function bookFor(lang: Lang, owner: boolean, now = new Date()) {
  const t = textFor(lang);
  const parts = t.parts.map((p) => {
    const open = owner && now >= releasedAt(p);
    return {
      ...p,
      open,
      laws: open ? p.laws : p.laws.map((l): Law => ({ n: l.n, title: l.title, opener: l.opener, place: l.place })),
    };
  });
  return {
    lang,
    owner,
    front: t.front,
    preface: t.preface,
    passLine: t.passLine,
    parts,
    people: t.people,
    words: t.words,
    names: NAMES,      // how each name is written in the text: the same in every language
    wordKeys: WORDS,
  };
}
