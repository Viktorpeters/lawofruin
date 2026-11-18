import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/site";
import styles from "./legal.module.css";

/* The four links: Terms, Privacy, Refunds, Contact. Used on the website and on every legal page. */
export default function LegalLinks({ className = "", current }: { className?: string; current?: string }) {
  return (
    <nav className={`${styles.links} ${className}`} aria-label="Policies and contact">
      {LEGAL_LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={current === l.href ? "page" : undefined}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
