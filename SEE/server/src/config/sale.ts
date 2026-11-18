/* The sale: prices, dates and the referral share. Change a value here and the whole server follows. */

export const INVESTIGATIONS = [{ n: 1, title: "Investigation I: The Fall of Kings" }];

export const EARLY_BIRD_FROM = new Date("2026-11-17T00:00:00+01:00");
export const STANDARD_FROM = new Date("2026-12-20T00:00:00+01:00");

/* Prices in the smallest unit: cents and kobo. Naira prices are fixed, not converted. */
export const PRICES = {
  early: { USD: 700, NGN: 800_000 },       // $7, ₦8,000
  standard: { USD: 1000, NGN: 1_300_000 }, // $10, ₦13,000
} as const;

export type Currency = "USD" | "NGN";

export const REFERRAL_SHARE = 0.2;          // the sharer earns 20% of what the buyer paid
export const REFERRAL_WINDOW_DAYS = 30;     // the buyer must sign in within 30 days of the click
export const EARNING_HOLD_DAYS = 14;        // pending until the refund window closes
export const PAYOUT_MIN = { NGN: 500_000, USD: 500 } as const;   // ₦5,000 or $5 before a payout

/* Ask. Only owners ever reach the AI. These numbers are what keep the bill safe:
   - perMinute stops one person firing questions in a loop;
   - perDay and perMonth cap what one reader can cost (at about $0.006 a question, 150 a month
     is under $1, against the $7 or $10 they paid);
   - dailyBudgetUsd is the ceiling for everyone together: when today's AI spend reaches it,
     Ask rests until midnight (UTC) for every reader, so the Anthropic balance can never be drained.
   priceInPerM and priceOutPerM are the model's prices per million tokens: copy them from
   anthropic.com/pricing for the model in ASK_MODEL, so the spend counted here matches the bill. */
export const ASK = {
  member: { perDay: 30 },
  owner: { perDay: 20, perMonth: 150 },
  perMinute: 4,
  dailyBudgetUsd: 1,
  priceInPerM: 1,
  priceOutPerM: 5,
  maxAnswerTokens: 450,
};
