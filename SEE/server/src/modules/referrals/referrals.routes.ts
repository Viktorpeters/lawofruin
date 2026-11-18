/* POST /api/referrals/click  { code, visitorId }   counts one click on a reader's link
   GET  /api/referrals/me                          the Earn panel's numbers */
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { recordClick, statsFor } from "./referrals.service";

export const referralRoutes = Router();

referralRoutes.post("/click", async (req, res) => {
  const body = z.object({ code: z.string().min(4).max(20), visitorId: z.string().min(8).max(64) }).parse(req.body);
  res.json({ ok: await recordClick(body.code, body.visitorId) });
});

referralRoutes.get("/me", requireAuth, async (req, res) => {
  res.json(await statsFor(req.user!.id));
});
