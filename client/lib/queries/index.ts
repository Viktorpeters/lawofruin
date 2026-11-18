/* Reads: hooks that fetch from the server, keep the answer, and share it across the app.
   A panel that opens twice does not fetch twice; a sign-in refreshes what depends on it. */
import { useQuery } from "@tanstack/react-query";
import { keys } from "./keys";
import { getMe } from "@/lib/services/auth.service";
import { getBook } from "@/lib/services/book.service";
import { getPricing, getPurchases, type Currency } from "@/lib/services/shop.service";
import { getEarnStats } from "@/lib/services/referrals.service";
import type { Lang } from "@/lib/i18n";

export function useMe() {
  return useQuery({ queryKey: keys.me, queryFn: getMe, staleTime: 5 * 60_000 });
}

/* the book changes rarely: keep it for an hour, and never retry so fast that offline readers wait */
export function useBook(lang: Lang, enabled = true) {
  return useQuery({ queryKey: keys.book(lang), queryFn: () => getBook(lang), enabled, staleTime: 60 * 60_000, retry: 1 });
}

export function usePricing(currency?: Currency) {
  return useQuery({ queryKey: keys.pricing(currency), queryFn: () => getPricing(currency), staleTime: 10 * 60_000 });
}

export function usePurchases() {
  return useQuery({ queryKey: keys.purchases, queryFn: getPurchases, staleTime: 60_000 });
}

export function useEarnStats(enabled: boolean) {
  return useQuery({ queryKey: keys.earn, queryFn: getEarnStats, enabled, staleTime: 30_000 });
}
