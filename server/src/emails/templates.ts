/* Every email the server sends, each with a subject, the HTML and a plain-text version (some
   readers and spam filters only look at the text). Transactional emails (code, welcome, receipts)
   always go out; marketing emails carry an Unsubscribe link and a List-Unsubscribe header. */
import { env } from "../config/env";
import { code as codeBox, facts, label, layout, p } from "./layout";

export type Mail = { subject: string; html: string; text: string; unsubscribeUrl?: string };

const app = () => `${env.APP_URL.replace(/\/$/, "")}/app`;
const SIGNED_IN = "You are receiving this because this email address was used to sign in to The Laws of Ruin.";
const BOUGHT = "You are receiving this because you made a purchase on The Laws of Ruin. Keep it as your receipt.";

/* 1. the sign-in code */
export function otpMail(code: string, minutes: number): Mail {
  const spaced = `${code.slice(0, 3)} ${code.slice(3)}`;
  return {
    subject: `${spaced} is your Laws of Ruin code`,
    html: layout({
      preheader: `Your sign-in code is ${spaced}. It works for ${minutes} minutes.`,
      heading: "Your sign-in code",
      body: p("Type this code in the book to sign in.") + codeBox(spaced) + p(`It works for ${minutes} minutes. If you did not ask for it, you can ignore this email: nobody can sign in without the code.`),
      reason: "You are receiving this because someone asked to sign in to The Laws of Ruin with this email address.",
    }),
    text: `Your Laws of Ruin sign-in code is ${spaced}. It works for ${minutes} minutes. If you did not ask for it, ignore this email.`,
  };
}

/* 2. after the first sign-in */
export function welcomeMail(refLink: string): Mail {
  return {
    subject: "Welcome to The Laws of Ruin",
    html: layout({
      preheader: "Your account is ready. Part One opens on 20 December 2026.",
      heading: "Every empire leaves the same ruins.",
      image: "book",
      body:
        p("Welcome. Your account is ready.") +
        p("The Laws of Ruin studies men who rose to great power and then fell, and draws out the thirty laws behind their ruin, so you can recognise them in your own work and life.") +
        label("Investigation I · The Fall of Kings") +
        facts([["Part One opens", "20 December 2026"], ["Early bird", "$7 · ₦8,000"], ["From 20 December", "$10 · ₦13,000"], ["Includes", "All six parts, for life"]]) +
        label("Your link") +
        p(`Share it. When someone buys the book through it, you earn 20% of what they pay: <a href="${refLink}" style="color:#9a7430">${refLink.replace(/^https?:\/\//, "")}</a>`),
      cta: { label: "Open the book", url: app() },
      reason: SIGNED_IN,
    }),
    text: `Welcome to The Laws of Ruin. Your account is ready.\nPart One opens on 20 December 2026. Early bird $7 (₦8,000), from 20 December $10 (₦13,000). All six parts, for life.\nYour link (earn 20%): ${refLink}\nOpen the book: ${app()}`,
  };
}

/* 3. payment received: the receipt */
export function paymentSuccessMail(r: { title: string; amount: string; reference: string; date: string; method: string }): Mail {
  return {
    subject: `Receipt: ${r.title}`,
    html: layout({
      preheader: `Payment received. ${r.title} is yours.`,
      heading: "It is yours.",
      body:
        p(`Your payment was received, and <strong style="color:#1d1812">${r.title}</strong> now belongs to your account, with every part as it is released and every revised edition.`) +
        label("Receipt") +
        facts([["Investigation", r.title], ["Amount", r.amount], ["Paid with", r.method], ["Date", r.date], ["Reference", r.reference]]),
      cta: { label: "Open the book", url: app() },
      reason: BOUGHT,
    }),
    text: `Payment received. ${r.title} is yours.\nAmount: ${r.amount}\nPaid with: ${r.method}\nDate: ${r.date}\nReference: ${r.reference}\nOpen the book: ${app()}`,
  };
}

/* 4. payment did not go through */
export function paymentFailedMail(r: { title: string; amount: string; reason?: string }): Mail {
  return {
    subject: "Your payment did not go through",
    html: layout({
      preheader: "No money was taken. You can try again in a minute.",
      heading: "The payment did not go through.",
      body:
        p(`Your payment of ${r.amount} for ${r.title} was not completed${r.reason ? `: ${r.reason}` : ""}. If money left your account, it is returned automatically, usually within a few working days.`) +
        p("You can try again, with the same card, another card, or another way to pay."),
      cta: { label: "Try again", url: app() },
      reason: BOUGHT.replace("made a purchase", "tried to make a purchase").replace(" Keep it as your receipt.", ""),
    }),
    text: `Your payment of ${r.amount} for ${r.title} did not go through. If money left your account, it is returned automatically. Try again: ${app()}`,
  };
}

/* 5. earnings ready (Earn) */
export function earningMail(r: { amount: string; total: string }): Mail {
  return {
    subject: `You earned ${r.amount}`,
    html: layout({
      preheader: `A purchase through your link earned you ${r.amount}.`,
      heading: `You earned ${r.amount}.`,
      body: p("Someone bought The Laws of Ruin through your link.") + facts([["This sale", r.amount], ["Available to you", r.total]]) + p("It becomes available 14 days after the purchase, once the refund window closes. See everything under Earn in the book's menu."),
      cta: { label: "See your earnings", url: app() },
      reason: SIGNED_IN,
    }),
    text: `You earned ${r.amount} from a purchase through your link. Available to you: ${r.total}. ${app()}`,
  };
}

/* 6. marketing: one shape for every campaign, always with a way out */
export function marketingMail(m: { subject: string; preheader: string; heading: string; paragraphs: string[]; cta?: { label: string; url: string }; unsubscribeUrl: string; withBook?: boolean }): Mail {
  return {
    subject: m.subject,
    unsubscribeUrl: m.unsubscribeUrl,
    html: layout({
      preheader: m.preheader,
      heading: m.heading,
      image: m.withBook ? "book" : undefined,
      body: m.paragraphs.map(p).join(""),
      cta: m.cta,
      reason: "You are receiving this because you have an account with The Laws of Ruin.",
      unsubscribeUrl: m.unsubscribeUrl,
    }),
    text: `${m.heading}\n\n${m.paragraphs.join("\n\n")}${m.cta ? `\n\n${m.cta.label}: ${m.cta.url}` : ""}\n\nUnsubscribe: ${m.unsubscribeUrl}`,
  };
}
