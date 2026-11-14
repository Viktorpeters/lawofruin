/* Ask the book. Two modes, decided on the server:
   - owner (bought the investigation): questions about the book, its laws, its people and the
     history behind them, answered from the text the reader can open;
   - member (signed in, not bought): strict. Only release dates, the price, the languages, what
     the book is and how to buy. Anything else is politely declined.
   Each reader has a daily allowance, so one person cannot run up the bill. */
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http";
import { ASK_DAILY } from "../../config/sale";
import { bookFor, type Lang } from "../book/book.service";
import { priceFor } from "../pricing/pricing.service";

const LANG_NAME: Record<Lang, string> = { en: "English", fr: "French", es: "Spanish", pt: "Portuguese", de: "German" };

export type AskInput = {
  question: string;
  lang: Lang;
  history: { role: "user" | "assistant"; text: string }[];
  section?: string;   // the page the reader is on: a Preface section id, "part-2" ...
  law?: number;       // the law sheet they have open, if any
};

async function spend(userId: string, owner: boolean) {
  const day = new Date().toISOString().slice(0, 10);
  const row = await prisma.askUsage.upsert({ where: { userId_day: { userId, day } }, update: { count: { increment: 1 } }, create: { userId, day, count: 1 } });
  if (row.count > (owner ? ASK_DAILY.owner : ASK_DAILY.member)) {
    throw new HttpError(429, "That is all the questions for today. Ask again tomorrow.");
  }
}

function facts(lang: Lang, owner: boolean) {
  const b = bookFor(lang, owner);
  const usd = priceFor("USD");
  const ngn = priceFor("NGN");
  const dates = b.parts.map((p) => `Part ${p.n}, ${p.title}: opens ${p.opens}`).join("\n");
  return { b, sale:
`The Laws of Ruin, Investigation I: The Fall of Kings. A history book in a reading app, published by the Publications Team of Orion Learning Innovations, Lagos, Nigeria. It studies men who rose to great power and fell, and draws out the lessons of their rise and ruin. Written to teach, never to celebrate crimes.
30 laws in 6 parts. Release dates:
${dates}
Price: one payment buys the whole investigation, all six parts and every revised edition, for life. Early bird $7 (₦8,000 in Nigeria) from 17 November 2026 until 19 December 2026. From 20 December 2026: $10 (₦13,000). Current price: ${usd.display} or ${ngn.display}.
Pay by card (Visa, Mastercard, American Express, Verve), Apple Pay, UK and EU bank apps, or bank transfer in Nigeria. Languages: English, French, Spanish, Portuguese, German, all included. Works on phone, tablet and computer, offline too. Refunds: see lawofruin.io/refunds. Contact: lawofruin@gmail.com.` };
}

function ownerContext(b: ReturnType<typeof bookFor>, input: AskInput) {
  const laws = b.parts.flatMap((p) => p.laws.map((l) => `Law ${l.n} (Part ${p.n}): ${l.title}. Opens on ${l.opener}, ${l.place}.`)).join("\n");
  const blocks: string[] = [`THE THIRTY LAWS\n${laws}`];
  const sec = b.preface.find((s) => s.id === input.section);
  if (sec) blocks.push(`THE PAGE THE READER IS ON: Preface ${sec.num}, ${sec.title}\n${sec.blocks.map((x) => x.t).join("\n")}`);
  const lawN = input.law;
  if (lawN) {
    for (const p of b.parts) for (const l of p.laws) {
      if (l.n !== lawN) continue;
      if (!l.sections) { blocks.push(`Law ${l.n} is not open to this reader yet: its part opens ${p.opens}.`); continue; }
      blocks.push(`THE LAW THE READER HAS OPEN: Law ${l.n}, ${l.title}\nJudgment: ${l.judgment ?? ""}\n${l.story ?? ""}\nKey: ${l.key ?? ""}\n` +
        l.sections.map((x) => `${x.name}: ${x.text}`).join("\n"));
    }
  }
  return blocks.join("\n\n");
}

export async function ask(user: { id: string; email: string }, owner: boolean, input: AskInput) {
  if (!env.ANTHROPIC_API_KEY) throw new HttpError(503, "Ask is not switched on yet.");
  await spend(user.id, owner);

  const { b, sale } = facts(input.lang, owner);
  const language = LANG_NAME[input.lang];

  const system = owner
    ? `You are the guide inside The Laws of Ruin, a history book. The reader owns the book.
Answer questions about the book, its laws, its people, and the history behind them. Draw first on the book text given below; you may add well-established historical fact, but never invent quotations, dates or sources. When the answer comes from the book, say where: the law or the Preface section.
Do not reveal or summarise any law the reader cannot open yet; say when its part opens instead.
If the question has nothing to do with the book or its history, say briefly that you only answer questions about The Laws of Ruin.
The book exists to teach: never glorify crime or cruelty.
Answer in ${language}. Be clear and warm, under 180 words. No markdown headings.

ABOUT THE BOOK
${sale}

${ownerContext(b, input)}`
    : `You are the guide inside The Laws of Ruin, a history book app. This reader is signed in but has not bought the book yet.
You may answer ONLY these: release dates of the parts, the price and what it includes, how to buy and pay, languages, devices, refunds and contact, and what the book is about in general terms.
For any other question, including questions about the people, laws or history in the book, reply in one or two sentences that this opens once they own the book, and that it costs ${priceFor("USD").display} (or ${priceFor("NGN").display} in Nigeria) for every part, for life. Never answer the other question itself, even partly.
Answer in ${language}. Under 90 words. No markdown headings.

FACTS
${sale}`;

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const messages = [
    ...input.history.slice(-6).map((m) => ({ role: m.role, content: m.text })),
    { role: "user" as const, content: input.question },
  ];
  const res = await client.messages.create({ model: env.ASK_MODEL, max_tokens: owner ? 700 : 260, system, messages });
  const text = res.content.map((c) => (c.type === "text" ? c.text : "")).join("").trim();
  return { answer: text, mode: owner ? "owner" : "member" };
}
