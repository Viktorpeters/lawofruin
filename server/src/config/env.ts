/* Every setting the server needs, read once from .env and checked. A missing value stops the
   server at start-up with a clear message, instead of failing later in the middle of a payment. */
import "dotenv/config";
import { z } from "zod";

const list = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),
  CORS_ORIGINS: z.string().transform(list),
  BREVO_API_KEY: z.string().min(1),
  MAIL_FROM_EMAIL: z.string().email(),
  MAIL_FROM_NAME: z.string().default("The Laws of Ruin"),
  ANTHROPIC_API_KEY: z.string().default(""),
  ASK_MODEL: z.string().default("claude-haiku-5-5"),
  TRANSLATE_MODEL: z.string().default("claude-sonnet-5-5"),
  PREVIEW_EMAILS: z.string().default("").transform((v) => list(v.toLowerCase())),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Settings are missing or wrong in .env:");
  for (const issue of parsed.error.issues) console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  process.exit(1);
}

export const env = parsed.data;
