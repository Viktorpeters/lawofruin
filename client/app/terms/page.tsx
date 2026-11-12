import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/Legal/LegalPage";
import styles from "@/components/legal/legal.module.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: `Terms and Conditions · ${SITE.book}` };

export default function Terms() {
  return (
    <LegalPage path="/terms" kicker="The agreement" title="Terms and Conditions">
      <p>
        These terms are the agreement between you and {SITE.publisher} (&quot;we&quot;, &quot;us&quot;), a Nigerian education
        technology company. {SITE.book} is published and run by {SITE.team}. By buying, opening or reading {SITE.book} you
        agree to these terms. If you do not agree, do not buy or use it.
      </p>

      <h2>1. What you are buying</h2>
      <p>
        {SITE.book} is a digital book, read in a web app on phone, tablet or computer. It is sold as separate
        investigations. The first is <strong>{SITE.investigation}</strong>, released in six parts: Part One opens on{" "}
        {SITE.partOneOpens} and the remaining parts follow, as announced inside the app.
      </p>
      <p>
        One payment buys one investigation, <strong>all of its parts included</strong>. Later investigations will be
        released over time and are sold separately. Buying one investigation does not entitle you to any other.
      </p>

      <p>
        <strong>Languages.</strong> From 14 November 2026, the book is available in English, French, Spanish, Portuguese
        and German. Every language is included in the one price: switch between them at any time with the language button
        at the top of the book, at no extra cost.
      </p>

      <h2>2. Prices</h2>
      <ul>
        <li>Early bird: <strong>{SITE.earlyBird.price}</strong>, from {SITE.earlyBird.from} to {SITE.earlyBird.until}.</li>
        <li>From {SITE.standard.from}: <strong>{SITE.standard.price}</strong>.</li>
      </ul>
      <p>
        Prices are set in US dollars. If you pay in another currency, the amount is converted at the rate shown at checkout
        before you pay, and that is the amount charged. Your bank may add its own fees for foreign or card payments; those
        are between you and your bank. A price change never affects an investigation you have already bought.
      </p>

      <h2>3. Payment</h2>
      <p>
        Payments are processed by <strong>Flutterwave</strong>, a payment company licensed by the Central Bank of Nigeria, and may also be processed by other licensed processors such as Paystack. We never see or store your card
        number, PIN or bank login. You can pay in any of these ways:
      </p>
      <ul>
        <li>
          <strong>Card.</strong> Visa, Mastercard, American Express, Verve and other major cards, from Nigeria or abroad. Your bank
          may ask you to confirm the payment with a one-time code.
        </li>
        <li>
          <strong>Bank transfer.</strong> For buyers in Nigeria with no card. At checkout the processor gives you a bank account
          number created for that one payment only. Transfer the <strong>exact amount shown</strong> before the timer runs
          out. The payment is confirmed automatically and your access opens. Do not reuse the account number for another
          payment, and do not send a different amount; a transfer that does not match is returned by the processor and
          does not unlock the book.
        </li>
        <li>
          <strong>Apple Pay and bank apps.</strong> Where your device or country supports it, you can also pay with Apple
          Pay, or straight from your banking app in the UK and the EU.
        </li>
      </ul>
      <p>A receipt is sent to the email address you give at checkout.</p>

      <h2>4. Your access</h2>
      <p>
        When your payment is confirmed, your account can open the investigation you bought. If you buy before{" "}
        {SITE.partOneOpens}, your access begins on that date, when Part One opens, and each later part opens to you on its
        release date at no further cost.
      </p>
      <p>
        Your access is <strong>for life</strong>. If we revise, correct or expand an investigation you own, the revised
        edition is yours too, at no cost. It stays your copy for as long as {SITE.book} is published.
      </p>
      <p>
        Keep your sign-in details private. Your access is for you alone and may not be shared, sold, lent or transferred.
        We may suspend an account that is used from an unusual number of people or devices, after first contacting you.
      </p>

      <h2>5. What you own and what we own</h2>
      <p>
        Buying an investigation gives you a <strong>personal licence to read it</strong>. It does not give you ownership of
        the text, the images, the design or the app. All of these are the property of {SITE.publisher} and are protected by
        the Copyright Act 2022 of Nigeria and by copyright law in every country that is party to the Berne Convention.{" "}
        {SITE.publisher} alone holds the right to copy, share, publish and distribute {SITE.book}.
      </p>

      <div className={styles.note}>
        <p>
          <strong>Do not copy the book.</strong> You may not screenshot, screen-record, photograph, print, copy, scrape,
          translate, upload, post, sell or otherwise reproduce or share any part of {SITE.book}, in any form, without our
          written permission. Doing so infringes our copyright. We will remove infringing copies, close the account
          involved without refund, and take legal action, including a claim for damages.
        </p>
      </div>
      <p>
        Short quotations, of a few sentences, credited to {SITE.book}, are allowed for review, criticism and study, as the
        law permits.
      </p>

      <h2>6. Refunds</h2>
      <p>
        Refunds are covered by our <Link href="/refunds">Refund Policy</Link>, which forms part of these terms.
      </p>

      <h2>7. Acceptable use</h2>
      <p>
        You agree not to break, probe or get around the app&apos;s security or payment, not to use automated tools to
        access it, and not to use it for anything unlawful. We may suspend or close an account that does.
      </p>

      <h2>8. Why the book exists</h2>
      <p>
        {SITE.book} is written to educate. Each investigation studies the lives of men who rose to great power and then
        fell, and draws out the lessons of their rise and their ruin, so that readers can recognise the same patterns in
        their own work, leadership and lives. It tells these stories to teach, never to celebrate the crimes or
        cruelty in them.
      </p>
      <p>
        We take care to be accurate, but history is argued and sources disagree. The book is not professional, legal or
        financial advice. If you find an error, tell us and we will look at it for the next revision.
      </p>

      <h2>9. Availability</h2>
      <p>
        We aim to keep the app available at all times but cannot promise it will never be interrupted. If a part&apos;s
        release date has to move, we will tell you in the app and by email. If we ever stop publishing an investigation
        before all its parts are released, you may ask for a refund of the price you paid.
      </p>

      <h2>10. Liability</h2>
      <p>
        Nothing in these terms limits rights you have under the Federal Competition and Consumer Protection Act 2018 or any
        consumer law that applies to you. Apart from those rights, our total liability to you is limited to the amount you
        paid for the investigation concerned, and we are not liable for indirect or unforeseeable loss.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms. The date at the top shows the latest version. A change never takes away an
        investigation you have already bought. If a change is significant, we will tell you by email before it applies.
      </p>

      <h2>12. Law and disputes</h2>
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria. If you have a complaint, write to us first
        and we will try to settle it within 14 days. If we cannot, the courts of Lagos State, Nigeria, will decide it. If you
        live in another country, you keep any right its law gives you to bring a claim where you live.
      </p>
      <p>
        These terms, like the book, may be shown in other languages. If a translation and the English version ever
        differ, the English version applies.
      </p>

      <h2>13. Contact</h2>
      <p>
        {SITE.publisher}, Publications Team, {SITE.place}. Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
