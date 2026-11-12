import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import styles from "@/components/legal/legal.module.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: `Contact · ${SITE.book}` };

export default function Contact() {
  return (
    <LegalPage path="/contact" kicker="Write to us" title="Contact">
      <p>
        For payments, access, refunds, errors in the text, permissions or press, write to the publishers. We reply within 3
        working days.
      </p>

      <a className={styles.mail} href={`mailto:${SITE.email}`}>{SITE.email}</a>

      <h2>So we can help at once</h2>
      <ul>
        <li>write from the email address you bought with;</li>
        <li>for a payment, add the date, the amount and the payment reference from your receipt;</li>
        <li>for a bank transfer, add the name of your bank and the time you sent it.</li>
      </ul>

      <h2>Before you write</h2>
      <p>
        Refunds are explained in our <Link href="/refunds">Refund Policy</Link>, your data in our{" "}
        <Link href="/privacy">Privacy Policy</Link>, and the rules of purchase in our <Link href="/terms">Terms</Link>.
      </p>

      <h2>The publisher</h2>
      <p>
        {SITE.book} is published by {SITE.team}.<br />
        {SITE.place}.
      </p>
    </LegalPage>
  );
}
