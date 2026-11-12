import type { Metadata } from "next";
import LegalPage from "@/components/Legal/LegalPage";
import styles from "@/components/Legal/legal.module.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: `Refund Policy · ${SITE.book}` };

export default function Refunds() {
  return (
    <LegalPage path="/refunds" kicker="Your money" title="Refund Policy">
      <p>
        {SITE.book} is a digital book that opens the moment it is delivered, so it cannot be returned the way a printed book
        can. This policy sets out exactly when you get your money back.
      </p>

      <h2>You will get a full refund if</h2>
      <ul>
        <li>
          <strong>You bought before {SITE.partOneOpens}</strong> and change your mind before Part One opens. Ask any time
          before that date; no reason needed.
        </li>
        <li><strong>You were charged twice</strong> for the same investigation.</li>
        <li><strong>You were charged the wrong amount.</strong> We refund the difference.</li>
        <li>
          <strong>You paid but cannot open the book</strong>, and we cannot fix it within 7 days of you telling us.
        </li>
        <li>
          <strong>You bought within the last 14 days</strong> and have read no more than the first law of Part One. This
          gives you a fair look before you decide.
        </li>
        <li>
          <strong>We stop publishing</strong> an investigation before all of its parts are released.
        </li>
      </ul>

      <h2>No refund is given if</h2>
      <ul>
        <li>more than 14 days have passed since you gained access, or you have read beyond the first law of Part One, and none of the cases above applies;</li>
        <li>your access was closed for copying or sharing the book, as set out in our Terms;</li>
        <li>you bought by mistake an investigation you already own, and did not tell us within 14 days.</li>
      </ul>

      <div className={styles.note}>
        <p>
          <strong>Wherever you live.</strong> We sell worldwide, and this policy applies to every buyer in every country.
          Some countries, including those of the European Union and the United Kingdom, give buyers a period to cancel an
          online purchase. For digital content, that right ends once the content is delivered with your consent. At checkout
          you agree to immediate access and acknowledge this. Any right your own country&apos;s law gives you still applies.
          We still honour every case on this page.
        </p>
      </div>

      <h2>Bank transfers that do not match</h2>
      <p>
        If you pay by bank transfer and send the wrong amount, or pay after the account number has expired, the payment is
        not accepted and the payment processor returns the money to the account it came from, usually within a few working days. If it
        has not arrived after 5 working days, email us with the date, the amount and your bank, and we will trace it.
      </p>

      <h2>How to ask</h2>
      <p>
        Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> from the address you bought with. Include your receipt or the
        payment reference and a sentence on what happened. We reply within 3 working days.
      </p>

      <h2>How the money comes back</h2>
      <p>
        Approved refunds are made through the payment processor to the card or bank account you paid from, for the amount you paid in the
        currency you paid. We start the refund within 5 working days of approving it. Your bank then takes, usually, 5 to 10
        working days to show it; international cards can take longer. Your access to that investigation ends when the
        refund is made.
      </p>

      <h2>Before a chargeback</h2>
      <p>
        Please write to us first. Almost every problem is settled faster by email than through a dispute with your bank, and
        a refund we make ourselves reaches you sooner.
      </p>
    </LegalPage>
  );
}
