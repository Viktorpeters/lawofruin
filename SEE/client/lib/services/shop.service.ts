/* Prices and what the reader owns. Checkout joins this file in Wave 3. */
import { api } from "@/lib/api";

export type Currency = "NGN" | "USD";
export type Pricing = { currency: Currency; display: string; standard: string; phase: "before" | "early" | "standard"; detected: Currency };
export type Investigation = { n: number; title: string; owned: boolean };

export function getPricing(currency?: Currency) {
  return api<Pricing>(`/api/pricing${currency ? `?currency=${currency}` : ""}`);
}

export async function getPurchases() {
  return (await api<{ items: Investigation[] }>("/api/purchases")).items;
}
