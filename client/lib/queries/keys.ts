/* Every cached answer has a key. Keeping them in one place means a sign-in or a purchase can
   refresh exactly the right answers (the book, what the reader owns, their Earn numbers). */
import type { Lang } from "@/lib/i18n";
import type { Currency } from "@/lib/services/shop.service";

export const keys = {
  me: ["me"] as const,
  book: (lang: Lang) => ["book", lang] as const,
  bookAll: ["book"] as const,
  pricing: (currency?: Currency) => ["pricing", currency ?? "auto"] as const,
  purchases: ["purchases"] as const,
  earn: ["earn"] as const,
};
