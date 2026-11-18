/* Sign-in by email code: one way in, for every reader in every country. The reader types their
   email, gets a 6-digit code, types it, and is in. A new reader is credited to whoever sent them
   (once, at their first sign-in), and gets a token that keeps them signed in for 90 days. */
import crypto from "crypto";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http";
import { sendMail } from "../../lib/mailer";
import { otpMail, welcomeMail } from "../../emails/templates";
import { signToken } from "../../lib/tokens";
import { env } from "../../config/env";
import { REFERRAL_WINDOW_DAYS } from "../../config/sale";

const CODE_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export type RefClaim = { code: string; at: number } | undefined;

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

/* a short link code with no look-alike letters (no 0/O, 1/l/I) */
function newRefCode() {
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(crypto.randomBytes(7), (b) => abc[b % abc.length]).join("");
}

export async function startEmail(email: string) {
  const recent = await prisma.emailCode.count({ where: { email, createdAt: { gt: new Date(Date.now() - 10 * 60_000) } } });
  if (recent >= 5) throw new HttpError(429, "Too many codes asked for. Please wait ten minutes.");

  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  await prisma.emailCode.create({ data: { email, codeHash: hash(`${email}:${code}`), expiresAt: new Date(Date.now() + CODE_MINUTES * 60_000) } });

  await sendMail(email, otpMail(code, CODE_MINUTES));
}

export async function verifyEmail(email: string, code: string, ref: RefClaim) {
  const row = await prisma.emailCode.findFirst({ where: { email, expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" } });
  if (!row) throw new HttpError(400, "That code has expired. Ask for a new one.");
  if (row.attempts >= MAX_ATTEMPTS) throw new HttpError(429, "Too many wrong tries. Ask for a new code.");
  if (row.codeHash !== hash(`${email}:${code.replace(/\s/g, "")}`)) {
    await prisma.emailCode.update({ where: { id: row.id }, data: { attempts: { increment: 1 } } });
    throw new HttpError(400, "That code is not right. Check the email and try again.");
  }
  await prisma.emailCode.deleteMany({ where: { email } });
  return signIn({ email }, ref);
}

/* ---------- shared ---------- */

async function signIn(who: { email: string }, ref: RefClaim) {
  let user = await prisma.user.findUnique({ where: { email: who.email } });
  if (!user) {
    // a new reader: credit the link that brought them, if it is recent and not their own
    let referredById: string | undefined;
    let referredAt: Date | undefined;
    if (ref && Date.now() - ref.at < REFERRAL_WINDOW_DAYS * 86_400_000) {
      const sharer = await prisma.user.findUnique({ where: { refCode: ref.code } });
      if (sharer && sharer.email !== who.email) { referredById = sharer.id; referredAt = new Date(ref.at); }
    }
    let created = false;
    for (let i = 0; i < 5 && !user; i++) {
      try {
        user = await prisma.user.create({ data: { email: who.email, refCode: newRefCode(), referredById, referredAt } });
        created = true;
      } catch (e) {
        if (i === 4) throw e;   // a clash on the link code: try another
      }
    }
    // the welcome email goes out in the background: a slow mail service never delays sign-in
    if (created && user) sendWelcome(who.email, user.refCode).catch((e) => console.error("Welcome email failed:", e));
  }
  return { token: signToken({ sub: user!.id, email: user!.email }), user: publicUser(user!) };
}

async function sendWelcome(email: string, refCode: string) {
  await sendMail(email, welcomeMail(`${env.APP_URL.replace(/\/$/, "")}/r/${refCode}`));
}

export function publicUser(u: { id: string; email: string; name: string | null; refCode: string }) {
  return { id: u.id, email: u.email, name: u.name, refCode: u.refCode };
}
