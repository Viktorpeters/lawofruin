/* POST /api/auth/email/start   { email }                 sends a 6-digit code
   POST /api/auth/email/verify  { email, code, ref? }     answers { token, user }
   GET  /api/auth/me                                      the signed-in reader */
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { requireAuth } from "../../middleware/auth";
import { publicUser, startEmail, verifyEmail } from "./auth.service";

export const authRoutes = Router();

const email = z.string().trim().toLowerCase().email();
const ref = z.object({ code: z.string().min(4).max(20), at: z.number() }).optional();

authRoutes.post("/email/start", async (req, res) => {
  const body = z.object({ email }).parse(req.body);
  await startEmail(body.email);
  res.json({ ok: true });
});

authRoutes.post("/email/verify", async (req, res) => {
  const body = z.object({ email, code: z.string().min(6).max(8), ref }).parse(req.body);
  res.json(await verifyEmail(body.email, body.code, body.ref));
});

authRoutes.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) { res.status(401).json({ error: "Please sign in again.", code: "signin" }); return; }
  res.json({ user: publicUser(user) });
});
