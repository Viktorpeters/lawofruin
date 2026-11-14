/* The sign-in token: a signed note saying which reader this is, kept on their device for 90 days. */
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type TokenBody = { sub: string; email: string };

export function signToken(body: TokenBody) {
  return jwt.sign(body, env.JWT_SECRET, { expiresIn: "90d" });
}

export function verifyToken(token: string): TokenBody | null {
  try {
    const v = jwt.verify(token, env.JWT_SECRET);
    return typeof v === "object" && v && "sub" in v ? (v as TokenBody) : null;
  } catch {
    return null;
  }
}
