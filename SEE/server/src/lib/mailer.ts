/* Sends email through Brevo's transactional API. One function, so the provider can be swapped
   for another (Resend, Postmark) by changing only this file. */
import { env } from "../config/env";
import { HttpError } from "./http";

import type { Mail } from "../emails/templates";

export async function sendMail(to: string, mail: Mail) {
  const { subject, html, text, unsubscribeUrl } = mail;
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: env.MAIL_FROM_EMAIL, name: env.MAIL_FROM_NAME },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
      // marketing emails: Gmail and Apple Mail show their own Unsubscribe button from this
      ...(unsubscribeUrl ? { headers: { "List-Unsubscribe": `<${unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } } : {}),
    }),
  });
  if (!res.ok) {
    console.error("Brevo refused the email:", res.status, await res.text().catch(() => ""));
    throw new HttpError(502, "We could not send the email. Please try again in a minute.");
  }
}
