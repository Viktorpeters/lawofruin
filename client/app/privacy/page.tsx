import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: `Privacy Policy · ${SITE.book}` };

export default function Privacy() {
  return (
    <LegalPage path="/privacy" kicker="Your data" title="Privacy Policy">
      <p>
        {SITE.publisher}, through {SITE.team}, is the data controller for {SITE.book}. This policy explains what we
        collect, why, and your rights. It follows the Nigeria Data Protection Act 2023 and, for buyers in Europe and the
        United Kingdom, the GDPR and UK GDPR.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account:</strong> your email address and, if you give it, your name.</li>
        <li>
          <strong>Purchase:</strong> what you bought, the price, the currency, the date, and the payment reference the payment processor
          gives us.
        </li>
        <li>
          <strong>Reading:</strong> where you stopped in the book, so it opens there next time on any device.
        </li>
        <li>
          <strong>Technical:</strong> your device type, browser, country and IP address, to keep the service running and
          secure and to stop abuse of accounts.
        </li>
      </ul>

      <h2>What we never collect</h2>
      <p>
        We never receive or store your card number, its security code, your PIN or your bank login. These go straight to
        our payment processor, Flutterwave, which is certified to the PCI DSS security standard for card data. When you pay by bank transfer, we see
        only that the payment arrived, its amount and its reference.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>to give you the book you bought and keep your place in it (to perform our contract with you);</li>
        <li>to take payment, send receipts and handle refunds (contract, and our legal duty to keep financial records);</li>
        <li>to prevent fraud, unauthorised sharing and copying of the book (our legitimate interest in protecting our work);</li>
        <li>to tell you when a new part or a revised edition of your investigation is released (contract);</li>
        <li>to tell you about new investigations, only if you agree. You can stop these at any time from any such email.</li>
      </ul>
      <p>We do not sell your data, and we do not use it for advertising profiles.</p>

      <h2>Who we share it with</h2>
      <ul>
        <li><strong>Flutterwave</strong>, and any other licensed processor we use such as Paystack, to process payments and refunds;</li>
        <li><strong>our hosting and email providers</strong>, who store and send data for us under contract and only on our instructions;</li>
        <li><strong>authorities</strong>, only when the law requires it.</li>
      </ul>
      <p>
        Some of these providers keep data outside Nigeria. When data leaves Nigeria, or the EU or UK, we rely on the
        safeguards the law requires, such as adequacy decisions or standard contractual clauses.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Your account and reading place: for as long as you have the account, since your access is for life. Purchase
        records: six years, as tax law requires. Technical logs: up to 12 months. When you close your account, we delete
        your data except what the law requires us to keep.
      </p>

      <h2>On your device</h2>
      <p>
        The app stores small files on your device so it can work offline, remember your settings and keep you signed in.
        These are needed for the app to work. We use no advertising cookies.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask to see the data we hold about you, correct it, delete it, receive a copy of it, or object to or limit
        how we use it, and you may withdraw any consent you gave. Email us and we will answer within 30 days. If you are
        not satisfied, you may complain to the Nigeria Data Protection Commission, or to the data protection authority
        where you live.
      </p>

      <h2>Children</h2>
      <p>
        {SITE.book} is not directed at children under 13, and we do not knowingly collect their data. A buyer under 18
        should have a parent or guardian&apos;s permission.
      </p>

      <h2>Security</h2>
      <p>
        All traffic to the app is encrypted. Access to our data is limited to the people who need it. If a breach ever puts
        your data at risk, we will tell you and the regulator as the law requires.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We will post any change here and update the date at the top; significant changes will also be emailed to you.
        Questions or requests: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </LegalPage>
  );
}
