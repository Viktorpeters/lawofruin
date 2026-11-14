/* Talks to the Laws of Ruin server. The sign-in token lives on this device (localStorage) and
   rides on every request as "Authorization: Bearer <token>". */

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://api.lawofruin.app").replace(/\/$/, "");

const TOKEN_KEY = "lor-token";
const REF_KEY = "lor-ref";
const VISITOR_KEY = "lor-visitor";

function get(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function put(key: string, v: string | null) {
  try { if (v === null) localStorage.removeItem(key); else localStorage.setItem(key, v); } catch { /* private mode */ }
}

export const token = { get: () => get(TOKEN_KEY), set: (t: string | null) => put(TOKEN_KEY, t) };

/* the referral link this visitor arrived through, kept for 30 days */
export const referral = {
  get(): { code: string; at: number } | undefined {
    try {
      const v = JSON.parse(get(REF_KEY) ?? "null");
      return v && Date.now() - v.at < 30 * 86_400_000 ? v : undefined;
    } catch { return undefined; }
  },
  set(code: string) { put(REF_KEY, JSON.stringify({ code, at: Date.now() })); },
};

/* one random id per device, so a click on a link counts once */
export function visitorId() {
  let v = get(VISITOR_KEY);
  if (!v) { v = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/[^a-z0-9-]/gi, ""); put(VISITOR_KEY, v); }
  return v;
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) { super(message); }
}

export async function api<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = { accept: "application/json" };
  const t = token.get();
  if (t) headers.authorization = `Bearer ${t}`;
  if (opts.body !== undefined) headers["content-type"] = "application/json";
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { method: opts.method ?? "GET", headers, body: opts.body === undefined ? undefined : JSON.stringify(opts.body) });
  } catch {
    throw new ApiError(0, "No connection. Check your internet and try again.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) token.set(null);   // the sign-in has expired
    throw new ApiError(res.status, data.error ?? "Something went wrong. Please try again.", data.code);
  }
  return data as T;
}

export type Me = { id: string; email: string; name: string | null; refCode: string };
