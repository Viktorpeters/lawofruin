/* The price a reader pays, decided here and only here. The app shows what this returns; checkout
   (Wave 3) charges what this returns, so nobody can lower the price from their browser. */
import { EARLY_BIRD_FROM, PRICES, STANDARD_FROM, type Currency } from "../../config/sale";

export function phase(now = new Date()): "before" | "early" | "standard" {
  if (now < EARLY_BIRD_FROM) return "before";
  return now < STANDARD_FROM ? "early" : "standard";
}

export function priceFor(currency: Currency, now = new Date()) {
  const p = phase(now);
  const table = p === "standard" ? PRICES.standard : PRICES.early;
  const amount = table[currency];
  const display = currency === "NGN" ? `₦${(amount / 100).toLocaleString("en-NG")}` : `$${amount / 100}`;
  return { currency, amount, display, phase: p };
}

/* Nigeria pays in naira by default; everyone else in dollars. The reader may switch. */
export function defaultCurrency(country: string | null): Currency {
  return country === "NG" ? "NGN" : "USD";
}
