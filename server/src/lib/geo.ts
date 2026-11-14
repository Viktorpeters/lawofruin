/* Which country a request comes from, worked out on the server from the visitor's IP address.
   The app never decides this itself, so a price cannot be changed from the browser. */
import geoip from "geoip-lite";
import type { Request } from "express";

export function countryOf(req: Request): string | null {
  // a CDN in front of the server may already know the country
  const fromCdn = req.header("cf-ipcountry") ?? req.header("x-vercel-ip-country");
  if (fromCdn && /^[A-Z]{2}$/.test(fromCdn)) return fromCdn;
  const ip = (req.ip ?? "").replace(/^::ffff:/, "");
  return geoip.lookup(ip)?.country ?? null;
}
