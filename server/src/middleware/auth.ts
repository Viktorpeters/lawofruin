/* Reads "Authorization: Bearer <token>". optionalAuth never blocks; requireAuth answers 401. */
import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/tokens";
import { HttpError } from "../lib/http";

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const h = req.header("authorization");
  if (h?.startsWith("Bearer ")) {
    const body = verifyToken(h.slice(7));
    if (body) req.user = { id: body.sub, email: body.email };
  }
  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, "Please sign in first.", "signin"));
  next();
}
