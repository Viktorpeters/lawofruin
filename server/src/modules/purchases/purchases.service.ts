/* What each reader owns. A purchase row is written only by the payment webhook (Wave 3). */
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { INVESTIGATIONS } from "../../config/sale";

export async function owns(user: { id: string; email: string } | undefined, investigation: number) {
  if (!user) return false;
  if (env.PREVIEW_EMAILS.includes(user.email.toLowerCase())) return true;   // proofreaders
  const p = await prisma.purchase.findUnique({ where: { userId_investigation: { userId: user.id, investigation } } });
  return p?.status === "paid";
}

export async function library(userId: string) {
  const rows = await prisma.purchase.findMany({ where: { userId, status: "paid" } });
  return INVESTIGATIONS.map((inv) => {
    const p = rows.find((r: { investigation: number; createdAt: Date }) => r.investigation === inv.n);
    return { n: inv.n, title: inv.title, owned: !!p, boughtAt: p?.createdAt ?? null };
  });
}
