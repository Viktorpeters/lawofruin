/* Sign-in by email code: one way in, for every reader in every country. The reader types their
   email, gets a 6-digit code, types it, and is in. A new reader is credited to whoever sent them
   (once, at their first sign-in), and gets a token that keeps them signed in for 90 days. */
import crypto from "crypto";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http";
import { sendMail } from "../../lib/mailer";
import { signToken } from "../../lib/tokens";
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

  const spaced = `${code.slice(0, 3)} ${code.slice(3)}`;
  await sendMail(
    email,
    `${spaced} is your Laws of Ruin code`,
    `<div style="font-family:Georgia,serif;background:#0b0a08;color:#ede6d8;padding:40px 28px;text-align:center">
      <p style="font-family:monospace;letter-spacing:.24em;font-size:11px;color:#c9a56b;margin:0 0 18px">THE LAWS OF RUIN</p>
      <p style="font-size:17px;margin:0 0 22px">Your sign-in code</p>
      <p style="font-family:monospace;font-size:34px;letter-spacing:.2em;color:#c9a56b;margin:0 0 22px">${spaced}</p>
      <p style="font-size:14px;color:#a39a8b;margin:0">It works for ${CODE_MINUTES} minutes. If you did not ask for it, ignore this email.</p>
    </div>`,
    `Your Laws of Ruin sign-in code is ${spaced}. It works for ${CODE_MINUTES} minutes.`,
  );
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
    for (let i = 0; i < 5 && !user; i++) {
      try {
        user = await prisma.user.create({ data: { email: who.email, refCode: newRefCode(), referredById, referredAt } });
      } catch (e) {
        if (i === 4) throw e;   // a clash on the link code: try another
      }
    }
  }
  return { token: signToken({ sub: user!.id, email: user!.email }), user: publicUser(user!) };
}

export function publicUser(u: { id: string; email: string; name: string | null; refCode: string }) {
  return { id: u.id, email: u.email, name: u.name, refCode: u.refCode };
}
