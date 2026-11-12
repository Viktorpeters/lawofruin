import Link from "next/link";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import LegalLinks from "./LegalLinks";
import styles from "./legal.module.css";

/* The frame every policy page shares: the name back to the website, the title, the date, the text, the links. */
export default function LegalPage({ path, kicker, title, children }: { path: string; kicker: string; title: string; children: ReactNode }) {
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <Link href="/" className={styles.brand}>{SITE.book}</Link>
        <LegalLinks current={path} />
      </header>

      <article className={styles.body}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>Last updated {SITE.lastUpdated}</p>
        {children}
      </article>

      <footer className={styles.foot}>
        <span>© 2026 {SITE.publisher}. {SITE.place}.</span>
        <LegalLinks current={path} />
      </footer>
    </main>
  );
}
