/* What keeps Ask affordable. Three checks before any AI call, one record after it.
   1. The reader's questions today, and (owners) this month.
   2. Everyone's AI spend today against the daily budget.
   3. After the call: the tokens it used and what they cost, so checks 1 and 2 stay true. */
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http";
import { ASK } from "../../config/sale";

const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => today().slice(0, 7);

/* counts the question, or refuses it; answers how many are left today */
export async function allow(userId: string, owner: boolean) {
  const day = today();
  const row = await prisma.askUsage.upsert({ where: { userId_day: { userId, day } }, update: { count: { increment: 1 } }, create: { userId, day, count: 1 } });
  const perDay = owner ? ASK.owner.perDay : ASK.member.perDay;
  if (row.count > perDay) throw new HttpError(429, "That is all the questions for today. Ask again tomorrow.", "day");

  if (owner) {
    const month = await prisma.askUsage.aggregate({ where: { userId, day: { startsWith: thisMonth() } }, _sum: { count: true } });
    if ((month._sum.count ?? 0) > ASK.owner.perMonth) throw new HttpError(429, "That is all the questions for this month. Ask again on the 1st.", "month");

    const spent = await prisma.askUsage.aggregate({ where: { day }, _sum: { cost: true } });
    if ((spent._sum.cost ?? 0) >= ASK.dailyBudgetUsd) throw new HttpError(503, "Ask is resting for today. Please ask again tomorrow.", "budget");
  }
  return perDay - row.count;
}

/* the cost of one answer, from the tokens the AI reports */
export function costOf(u: { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number | null; cache_read_input_tokens?: number | null }) {
  const write = u.cache_creation_input_tokens ?? 0;   // saving the fixed part of the prompt: 1.25x
  const read = u.cache_read_input_tokens ?? 0;        // reusing it: 0.1x
  const inCost = (u.input_tokens + write * 1.25 + read * 0.1) * ASK.priceInPerM;
  return (inCost + u.output_tokens * ASK.priceOutPerM) / 1_000_000;
}

export async function record(userId: string, tokensIn: number, tokensOut: number, cost: number) {
  await prisma.askUsage.update({
    where: { userId_day: { userId, day: today() } },
    data: { tokensIn: { increment: tokensIn }, tokensOut: { increment: tokensOut }, cost: { increment: cost } },
  });
}
