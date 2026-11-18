/* Ask the book.
   - A reader who has not bought gets one fixed answer (ask.member.ts). No AI call.
   - An owner gets an AI answer, built to be safe in production:
     GROUNDED   it may only use the text it is given: the page or law the reader has open and
                the list of the thirty laws. If the answer is not there, it says so and points
                to the law where it is. No answers from general knowledge.
     CHECKED    every quotation in the answer is looked up in that text. A quotation that is not
                in the book loses its quotation marks and the answer is flagged in AskLog.
     CHEAP      the fixed part of the prompt is cached by Anthropic (reused at a tenth of the
                price), answers are short, only the last four messages go along, and a repeated
                first question on the same page comes from our own cache for free.
     LIMITED    ask.guard.ts: per minute, per day, per month, and a daily budget for everyone.
     LOGGED     every answer is kept in AskLog, so you can read what readers ask and spot errors. */
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http";
import { ASK } from "../../config/sale";
import { bookFor, type Lang } from "../book/book.service";
import { answerMember } from "./ask.member";
import { allow, costOf, record } from "./ask.guard";

const LANG_NAME: Record<Lang, string> = { en: "English", fr: "French", es: "Spanish", pt: "Portuguese", de: "German" };

export type AskInput = {
  question: string;
  lang: Lang;
  history: { role: "user" | "assistant"; text: string }[];
  section?: string;   // the Preface section the reader is on
  law?: number;       // the law sheet they have open
};

/* the part of the prompt that is the same for every question: cached by Anthropic */
function fixedPrompt(b: ReturnType<typeof bookFor>, lang: Lang) {
  const laws = b.parts.flatMap((p) => p.laws.map((l) => `Law ${l.n} (Part ${p.n}, opens ${p.opens}): ${l.title}. Opens on ${l.opener}, ${l.place}.`)).join("\n");
  return `You are the guide inside The Laws of Ruin, a history book by the Publications Team of Orion Learning Innovations. The reader owns the book.

RULES
1. Answer only from the BOOK TEXT given to you: the list of laws below and the page or law the reader has open. Do not use outside knowledge, even if you know the answer.
2. If the answer is not in the BOOK TEXT, say so in one sentence, and name the law from the list where the reader will find it, so they can open it and ask again there.
3. Never invent a quotation, a date, a number or a name. Quote only words that appear exactly in the BOOK TEXT.
4. Say where your answer comes from: "Law 7" or "the Preface, section 3".
5. If the question is not about the book or its history, say you only answer questions about The Laws of Ruin.
6. The book exists to teach. Never glorify crime or cruelty.
7. Answer in ${LANG_NAME[lang]}, plainly, in under 150 words. No headings, no lists unless asked.

THE THIRTY LAWS
${laws}`;
}

/* the part that changes: the text the reader has open */
function openText(b: ReturnType<typeof bookFor>, input: AskInput) {
  const out: string[] = [];
  const sec = b.preface.find((s) => s.id === input.section);
  if (sec) out.push(`THE PAGE THE READER IS ON: the Preface, section ${sec.num}, ${sec.title}\n${sec.blocks.map((x) => x.t).join("\n")}`);
  if (input.law) {
    for (const p of b.parts) for (const l of p.laws) {
      if (l.n !== input.law) continue;
      out.push(l.sections
        ? `THE LAW THE READER HAS OPEN: Law ${l.n}, ${l.title}\nJudgment: ${l.judgment ?? ""}\n${l.story ?? ""}\nKey: ${l.key ?? ""}\n${l.sections.map((x) => `${x.name}: ${x.text}`).join("\n")}`
        : `Law ${l.n} is not open yet: Part ${p.n} opens ${p.opens}. Do not describe its content.`);
    }
  }
  return out.length ? `BOOK TEXT THE READER HAS OPEN\n${out.join("\n\n")}` : "The reader has no law or Preface page open. Answer from the list of laws only, and suggest which law to open.";
}

/* quotations that are not in the book lose their quotation marks; the answer is flagged */
function checkQuotes(answer: string, source: string) {
  const plain = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const book = plain(source);
  let flagged = false;
  const fixed = answer.replace(/[“"«„]([^”"»“]{20,})[”"»“]/g, (whole, inner: string) => {
    if (book.includes(plain(inner))) return whole;
    flagged = true;
    return inner;
  });
  return { text: fixed, flagged };
}

const answers = new Map<string, string>();

export async function ask(user: { id: string; email: string }, owner: boolean, input: AskInput) {
  const left = await allow(user.id, owner);

  if (!owner) return { answer: answerMember(input.lang), mode: "member" as const, left };

  if (!env.ANTHROPIC_API_KEY) throw new HttpError(503, "Ask is not switched on yet.");
  const b = bookFor(input.lang, true);

  const cacheKey = input.history.length === 0
    ? [input.lang, input.section ?? "", input.law ?? "", input.question.toLowerCase().replace(/\s+/g, " ").trim()].join("|")
    : "";
  const hit = cacheKey && answers.get(cacheKey);
  if (hit) {
    await prisma.askLog.create({ data: { userId: user.id, question: input.question, answer: hit, law: input.law, section: input.section, lang: input.lang, cached: true } });
    return { answer: hit, mode: "owner" as const, left };
  }

  const fixed = fixedPrompt(b, input.lang);
  const open = openText(b, input);
  // 30 seconds at most, one retry for a passing error: a slow AI never leaves a reader waiting long
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, timeout: 30_000, maxRetries: 1 });
  const res = await client.messages.create({
    model: env.ASK_MODEL,
    max_tokens: ASK.maxAnswerTokens,
    system: [
      { type: "text", text: fixed, cache_control: { type: "ephemeral" } },
      { type: "text", text: open },
    ],
    messages: [
      ...input.history.slice(-4).map((m) => ({ role: m.role, content: m.text })),
      { role: "user" as const, content: input.question },
    ],
  });

  const raw = res.content.map((c) => (c.type === "text" ? c.text : "")).join("").trim();
  const { text, flagged } = checkQuotes(raw, `${fixed}\n${open}`);
  const cost = costOf(res.usage);
  await record(user.id, res.usage.input_tokens + (res.usage.cache_read_input_tokens ?? 0) + (res.usage.cache_creation_input_tokens ?? 0), res.usage.output_tokens, cost);
  await prisma.askLog.create({ data: { userId: user.id, question: input.question, answer: text, law: input.law, section: input.section, lang: input.lang, flagged, cost } });

  if (cacheKey && !flagged) {
    if (answers.size > 3000) answers.clear();
    answers.set(cacheKey, text);
  }
  return { answer: text, mode: "owner" as const, left };
}
