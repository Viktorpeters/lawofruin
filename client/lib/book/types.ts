/* Shapes shared by the book's content files and the reader. */

export type BlockKind = "p" | "sub" | "epi" | "sig" | "note";

export type Block = { k: BlockKind; t: string };

export type Section = {
  id: string;          // stable id, used for jumps and for saving the reader's place
  num: string;         // "I", "II", ... shown in the running head
  title: string;
  blocks: Block[];
  sources: string[];
};

export type Law = {
  n: number;
  title: string;
  opener: string;      // the figure the Transgression opens on
  place: string;       // "Shanghai, 2020"
  judgment?: string;   // written entries drop in here later
  eras?: [string, string, string];
  key?: string;
  story?: string;      // the short story under the law, about four lines
  sections?: { name: string; text: string }[];   // the twelve sections, each a short story of its own
};

export type Part = {
  n: number;
  title: string;
  opens: string;       // release date shown on the padlock
  laws: Law[];
};

export type Person = {
  id: string;          // also the photo name: /figures/<id>.jpg
  name: string;
  known?: string;      // "known as" line, in italics
  dates?: string;      // "1332 – 1406"
  role: string;        // short red line under the dates
  about: string;       // two or three sentences
  tipping?: string;    // the tipping point, one line
  status: "verified" | "disputed" | "personal" | "organisation";
};

export type Word = {
  id: string;
  word: string;
  say?: string;        // pronunciation
  tag: string;         // "Arabic · Noun", "Place", ...
  meaning: string;
  use?: string;        // one usage line
};
