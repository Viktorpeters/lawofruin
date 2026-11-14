/* Turns any error into a short JSON answer. Unexpected errors are logged, never shown. */
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/http";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, code: err.code });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Some details are missing or not valid.", issues: err.issues });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our side. Please try again." });
}
