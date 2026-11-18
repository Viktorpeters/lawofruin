/* Sign-in requests. Plain functions: they only talk to the server. The hooks in lib/queries and
   lib/actions decide when to call them and keep the answers. */
import { api, referral, token, type Me } from "@/lib/api";
import type { Lang } from "@/lib/i18n";

export async function getMe(): Promise<Me | null> {
  if (!token.get()) return null;                       // not signed in: no request at all
  try {
    const r = await api<{ user: Me }>("/api/auth/me");
    return r.user;
  } catch {
    return null;                                       // expired or removed: treated as signed out
  }
}

export function startEmail(email: string, lang: Lang) {
  return api<{ ok: true }>("/api/auth/email/start", { method: "POST", body: { email, lang } });
}

export function verifyEmail(email: string, code: string, lang: Lang) {
  return api<{ token: string; user: Me }>("/api/auth/email/verify", { method: "POST", body: { email, code, lang, ref: referral.get() } });
}
