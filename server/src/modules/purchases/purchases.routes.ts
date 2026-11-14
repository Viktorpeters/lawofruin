/* GET /api/purchases   the investigations, each marked owned or not, for the Purchases panel.
   Checkout and the payment webhooks join this module in Wave 3. */
import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { library } from "./purchases.service";
import { INVESTIGATIONS } from "../../config/sale";

export const purchaseRoutes = Router();

purchaseRoutes.get("/", async (req, res) => {
  if (!req.user) {
    res.json({ items: INVESTIGATIONS.map((i) => ({ n: i.n, title: i.title, owned: false, boughtAt: null })) });
    return;
  }
  res.json({ items: await library(req.user.id) });
});

purchaseRoutes.get("/mine", requireAuth, async (req, res) => {
  res.json({ items: await library(req.user!.id) });
});
