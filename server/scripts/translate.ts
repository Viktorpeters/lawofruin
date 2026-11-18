/* Translates the whole book into French, Spanish, Portuguese and German with Claude.
   Run once:            npm run translate
   Only some languages: npm run translate -- fr es
   It saves as it goes into translations/<lang>.json, so if it stops, run it again and it carries
   on where it left off. Run it again after you change the English text, with --redo <unit>
   (for example --redo law-7) to translate that piece again.
   People's names, ids, dates and release dates are never translated. */
import "dotenv/config";
import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { ENGLISH } from "../src/modules/book/book.service";

const ALL = ["fr", "es", "pt", "de"] as const;
const NAME: Record<string, string> = { fr: "French", es: "Spanish", pt: "Portuguese (Brazil)", de: "German" };
const KEEP = ["id", "n", "k", "opens", "dates", "say", "status", "opener", "word"];   // never translated
const OUT = path.join(process.cwd(), "translations");
const MODEL = process.env.TRANSLATE_MODEL || "claude-sonnet-5-5";

const args = process.argv.slice(2);
const redo = new Set(args.flatMap((a, i) => (args[i - 1] === "--redo" ? [a] : [])));
const langs = args.filter((a) => (ALL as readonly string[]).includes(a));
const targets = langs.length ? langs : [...ALL];

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type Unit = { key: string; value: unknown; put: (doc: Doc, v: any) => void };
type Doc = { front?: any; preface: any[]; passLine?: string; parts: any[]; people: any[]; words: any[]; _done: string[] };

function units(): Unit[] {
  const E = ENGLISH;
  const list: Unit[] = [];
  list.push({ key: "front", value: E.front, put: (d, v) => { d.front = v; } });
  list.push({ key: "passLine", value: { passLine: E.passLine }, put: (d, v) => { d.passLine = v.passLine; } });
  E.preface.forEach((s, i) => list.push({ key: `preface-${i}`, value: s, put: (d, v) => { d.preface[i] = v; } }));
  E.parts.forEach((p, i) => {
    list.push({ key: `part-${p.n}`, value: { title: p.title, line: p.line }, put: (d, v) => { d.parts[i] = { ...(d.parts[i] ?? { laws: [] }), ...v }; } });
    p.laws.forEach((l, j) => list.push({
      key: `law-${l.n}`, value: l,
      put: (d, v) => { d.parts[i] ??= { laws: [] }; d.parts[i].laws ??= []; d.parts[i].laws[j] = v; },
    }));
  });
  for (let i = 0; i < E.people.length; i += 25) {
    const chunk = E.people.slice(i, i + 25);
    list.push({ key: `people-${i}`, value: chunk, put: (d, v) => { v.forEach((x: any) => { const k = d.people.findIndex((y) => y.id === x.id); if (k >= 0) d.people[k] = x; else d.people.push(x); }); } });
  }
  for (let i = 0; i < E.words.length; i += 30) {
    const chunk = E.words.slice(i, i + 30);
    list.push({ key: `words-${i}`, value: chunk, put: (d, v) => { v.forEach((x: any) => { const k = d.words.findIndex((y) => y.id === x.id); if (k >= 0) d.words[k] = x; else d.words.push(x); }); } });
  }
  return list;
}

/* same keys, same array lengths, untouched protected fields */
function sameShape(a: any, b: any): boolean {
  if (Array.isArray(a)) return Array.isArray(b) && a.length === b.length && a.every((x, i) => sameShape(x, b[i]));
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object") return false;
    return Object.keys(a).every((k) => k in b && (KEEP.includes(k) ? JSON.stringify(a[k]) === JSON.stringify(b[k]) : sameShape(a[k], b[k])));
  }
  return typeof a === typeof b;
}

async function translate(value: unknown, lang: string): Promise<unknown> {
  const prompt = `Translate every text value in this JSON from English into ${NAME[lang]}.
This is a published history book, The Laws of Ruin. Keep its voice: plain, grave, literary, clear for a general reader.
Rules:
- Return only the JSON, with exactly the same keys, the same structure and the same number of items.
- Never change the values of these keys: ${KEEP.join(", ")}.
- Keep every person's name exactly as written in English (Pablo Escobar, Ibn Khaldun, Louis XVI). Place names may take their usual ${NAME[lang]} form.
- Keep every [[ and ]] marker around the words that carry the same meaning, and keep the | in side notes ("Label|Text"): translate both sides of it.
- Keep quotation marks, numbers and dates accurate. Use the punctuation that is correct in ${NAME[lang]}.
- Do not add notes or explanations.

${JSON.stringify(value)}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await client.messages.create({ model: MODEL, max_tokens: 16000, messages: [{ role: "user", content: prompt }] });
    const text = res.content.map((c) => (c.type === "text" ? c.text : "")).join("");
    const json = text.slice(text.indexOf(text.trim().startsWith("[") ? "[" : "{"), Math.max(text.lastIndexOf("}"), text.lastIndexOf("]")) + 1);
    try {
      const out = JSON.parse(json);
      if (sameShape(value, out)) return out;
      console.warn(`    shape changed, trying again (${attempt}/3)`);
    } catch {
      console.warn(`    could not read the answer, trying again (${attempt}/3)`);
    }
  }
  throw new Error("Gave up after 3 tries");
}

async function run(lang: string) {
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, `${lang}.json`);
  const doc: Doc = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { preface: [], parts: [], people: [], words: [], _done: [] };
  doc._done ??= [];
  const todo = units().filter((u) => redo.has(u.key) || !doc._done.includes(u.key));
  console.log(`${NAME[lang]}: ${todo.length} pieces to translate`);
  let i = 0;
  for (const u of todo) {
    i++;
    process.stdout.write(`  [${i}/${todo.length}] ${u.key} ... `);
    try {
      const v = await translate(u.value, lang);
      u.put(doc, v);
      if (!doc._done.includes(u.key)) doc._done.push(u.key);
      fs.writeFileSync(file, JSON.stringify(doc));
      console.log("done");
    } catch (e) {
      console.log(`failed: ${(e as Error).message}. Run the script again later to retry.`);
    }
  }
  console.log(`${NAME[lang]}: saved to ${file}`);
}

(async () => {
  if (!process.env.ANTHROPIC_API_KEY) { console.error("Put ANTHROPIC_API_KEY in .env first."); process.exit(1); }
  // the languages run side by side; each one goes piece by piece
  await Promise.all(targets.map(run));
})();
