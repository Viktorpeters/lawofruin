/* GET /api/pricing?currency=NGN|USD
   Answers the price for this reader: the currency follows their country unless they chose one. */
import { Router } from "express";
import { z } from "zod";
import { countryOf } from "../../lib/geo";
import { defaultCurrency, priceFor } from "./pricing.service";
import { EARLY_BIRD_FROM, PRICES, STANDARD_FROM } from "../../config/sale";

export const pricingRoutes = Router();

pricingRoutes.get("/", (req, res) => {
  const chosen = z.enum(["NGN", "USD"]).optional().parse(req.query.currency || undefined);
  const country = countryOf(req);
  const currency = chosen ?? defaultCurrency(country);
  res.json({
    country,
    detected: defaultCurrency(country),
    ...priceFor(currency),
    earlyBirdFrom: EARLY_BIRD_FROM,
    standardFrom: STANDARD_FROM,
    standard: priceFor(currency, STANDARD_FROM).display,
    usdEarly: `$${PRICES.early.USD / 100}`,
  });
});
