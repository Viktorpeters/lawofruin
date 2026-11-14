/* POST /api/ask  { question, lang, history, section?, law? }
   Signed-in readers only. Owners get full answers; everyone else gets the strict mode. */
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { owns } from "../purchases/purchases.service";
import { LANGS } from "../book/book.service";
import { ask } from "./ask.service";

export const askRoutes = Router();

askRoutes.post("/", requireAuth, async (req, res) => {
  const body = z.object({
    question: z.string().trim().min(2).max(600),
    lang: z.enum(LANGS).catch("en"),
    history: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().max(2000) })).max(12).default([]),
    section: z.string().max(60).optional(),
    law: z.number().int().min(1).max(30).optional(),
  }).parse(req.body);
  const owner = await owns(req.user, 1);
  res.json(await ask(req.user!, owner, body));
});
