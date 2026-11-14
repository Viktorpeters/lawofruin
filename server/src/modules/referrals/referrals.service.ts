/* Earn: each reader's link, how many clicked it, how many paid, and what they earned.
   An earning is created by the payment webhook (Wave 3) at 20% of what the buyer paid,
   and stays pending for 14 days (the refund window) before it becomes available. */
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { PAYOUT_MIN } from "../../config/sale";

export async function recordClick(code: string, visitorId: string) {
  const sharer = await prisma.user.findUnique({ where: { refCode: code }, select: { id: true } });
  if (!sharer) return false;
  await prisma.referralClick.upsert({ where: { code_visitorId: { code, visitorId } }, update: {}, create: { code, visitorId } });
  return true;
}

type Row = { currency: string; status: string; _sum: { amount: number | null } };

export async function statsFor(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { refCode: true } });

  // pending earnings whose refund window has closed become available
  await prisma.earning.updateMany({ where: { userId, status: "pending", availableAt: { lte: new Date() } }, data: { status: "available" } });

  const [clicks, joined, paid, earnings] = await Promise.all([
    prisma.referralClick.count({ where: { code: user.refCode } }),
    prisma.user.count({ where: { referredById: userId } }),
    prisma.purchase.count({ where: { status: "paid", user: { referredById: userId } } }),
    prisma.earning.groupBy({ by: ["currency", "status"], where: { userId, status: { in: ["pending", "available", "paid"] } }, _sum: { amount: true } }),
  ]);

  const sum = (status: string) =>
    earnings.filter((e: Row) => e.status === status).map((e: Row) => ({ currency: e.currency, amount: e._sum.amount ?? 0 }));

  return {
    link: `${env.APP_URL.replace(/\/$/, "")}/r/${user.refCode}`,
    clicks,
    joined,
    paid,
    pending: sum("pending"),
    available: sum("available"),
    paidOut: sum("paid"),
    payoutMin: PAYOUT_MIN,
  };
}
