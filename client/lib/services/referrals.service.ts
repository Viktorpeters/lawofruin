/* Earn: counting a click on a reader's link, and the reader's own numbers. */
import { api, visitorId } from "@/lib/api";

export type Money = { currency: string; amount: number }[];
export type EarnStats = { link: string; clicks: number; paid: number; pending: Money; available: Money; paidOut: Money };

export function countClick(code: string) {
  return api("/api/referrals/click", { method: "POST", body: { code, visitorId: visitorId() } });
}

export function getEarnStats() {
  return api<EarnStats>("/api/referrals/me");
}
