/* The book's words, as the server sent them for this reader and this language.
   Nothing is bundled into the app any more: the full text of a law reaches the device only
   when the reader owns it and its part is released. The values below are live: when a new
   book arrives (sign-in, purchase, another language) setBook replaces them and the reader
   rebuilds its pages. The old files (contents.ts, preface.ts, front.ts, whoswho.ts, words.ts)
   now pass these values on, so the rest of the app reads them exactly as before. */
import type { Part, Person, Section, Word } from "./types";
import type { Lang } from "@/lib/i18n";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Which = { kicker: string; title: string; lead: string; options: { id: string; name: string; line: string }[] };

export type BookPayload = {
  lang: Lang;
  owner: boolean;
  front: { TITLE: any; COPYRIGHT: string[]; DEDICATION: string[]; EPIGRAPHS: any[]; FOR_THOSE: any; WHICH: Which; END: any };
  preface: Section[];
  passLine: string;
  parts: Part[];
  people: Person[];
  words: Word[];
  names: Record<string, string>;
  wordKeys: Record<string, string>;
};

export let VERSION = 0;          // goes up each time a new book arrives
export let LANG: Lang = "en";
export let OWNER = false;

export let TITLE: any = {};
export let COPYRIGHT: string[] = [];
export let DEDICATION: string[] = [];
export let EPIGRAPHS: any[] = [];
export let FOR_THOSE: any = {};
export let WHICH: Which = { kicker: "", title: "", lead: "", options: [] };
export let END: any = {};
/* eslint-enable @typescript-eslint/no-explicit-any */

export let PREFACE: Section[] = [];
export let PASS_LINE = "";
export let PARTS: Part[] = [];
export let PEOPLE: Person[] = [];
export let BY_ID: Record<string, Person> = {};
export let NAMES: Record<string, string> = {};
export let WORD_CARDS: Word[] = [];
export let WORD_BY_ID: Record<string, Word> = {};
export let WORDS: Record<string, string> = {};

export function setBook(b: BookPayload) {
  LANG = b.lang;
  OWNER = b.owner;
  ({ TITLE, COPYRIGHT, DEDICATION, EPIGRAPHS, FOR_THOSE, WHICH, END } = b.front);
  PREFACE = b.preface;
  PASS_LINE = b.passLine;
  PARTS = b.parts;
  PEOPLE = b.people;
  BY_ID = Object.fromEntries(b.people.map((p) => [p.id, p]));
  NAMES = b.names;
  WORD_CARDS = b.words;
  WORD_BY_ID = Object.fromEntries(b.words.map((w) => [w.id, w]));
  WORDS = b.wordKeys;
  VERSION++;
}
