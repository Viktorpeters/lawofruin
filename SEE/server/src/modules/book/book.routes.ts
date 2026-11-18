/* GET /api/book?lang=en   the whole book this reader may read, in their language. */
import { Router } from "express";
import { z } from "zod";
import { LANGS, bookFor } from "./book.service";
import { owns } from "../purchases/purchases.service";

export const bookRoutes = Router();

bookRoutes.get("/", async (req, res) => {
  const lang = z.enum(LANGS).catch("en").parse(req.query.lang);
  const owner = await owns(req.user, 1);
  res.set("Cache-Control", "private, no-cache");
  res.json(bookFor(lang, owner));
});
