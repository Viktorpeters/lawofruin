/* POST /api/ask  { question, lang, history, section?, law? }
   Signed-in readers only, and at most a few questions a minute each, so nobody can fire
   questions in a loop. Owners get AI answers; everyone else the fixed answer. */
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { owns } from "../purchases/purchases.service";
import { LANGS } from "../book/book.service";
import { ASK } from "../../config/sale";
import { ask } from "./ask.service";

export const askRoutes = Router();

const perMinute = rateLimit({
  windowMs: 60_000,
  limit: ASK.perMinute,
  keyGenerator: (req) => req.user!.id,            // counted per reader, not per network
  validate: { trustProxy: false },
  handler: (_req, res) => { res.status(429).json({ error: "Slow down a little. Ask again in a minute.", code: "minute" }); },
});

askRoutes.post("/", requireAuth, perMinute, async (req, res) => {
  const body = z.object({
    question: z.string().trim().min(2).max(500),
    lang: z.enum(LANGS).catch("en"),
    history: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().max(2000) })).max(12).default([]),
    section: z.string().max(60).optional(),
    law: z.number().int().min(1).max(30).optional(),
  }).parse(req.body);
  const owner = await owns(req.user, 1);
  res.json(await ask(req.user!, owner, body));
});
