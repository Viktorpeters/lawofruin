/* The Express app: shared middleware, then each module mounted under /api.
   Every module (auth, book, pricing, purchases, referrals, ask) lives in src/modules/<name>
   with its own routes and service, so any one of them can later be split into its own service. */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "./config/env";
import { optionalAuth } from "./middleware/auth";
import { errorHandler, notFound } from "./middleware/error";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookRoutes } from "./modules/book/book.routes";
import { pricingRoutes } from "./modules/pricing/pricing.routes";
import { purchaseRoutes } from "./modules/purchases/purchases.routes";
import { referralRoutes } from "./modules/referrals/referrals.routes";
import { askRoutes } from "./modules/ask/ask.routes";

export const app = express();

app.set("trust proxy", true);   // behind Render, Railway or a load balancer: read the visitor's real IP
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS, credentials: false }));
app.use(compression());
app.use(express.json({ limit: "100kb" }));
app.use(optionalAuth);           // reads the sign-in token if there is one; never blocks

app.get("/health", (_req, res) => { res.json({ ok: true }); });

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api/ask", askRoutes);

app.use(notFound);
app.use(errorHandler);
