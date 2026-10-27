"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import SoundControl from "./SoundControl";
import InstallCta from "@/components/install/InstallCta";
import styles from "./hero.module.css";

// three.js only runs in the browser
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const OPENS = new Date("2026-12-07T00:00:00+01:00");

export default function Hero() {
  const [motion, setMotion] = useState(true);
  const [ready, setReady] = useState(false);
  const [days, setDays] = useState<number | null>(null);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const first = requestAnimationFrame(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) setMotion(false);
      setDays(Math.max(0, Math.ceil((OPENS.getTime() - Date.now()) / 86400000)));
    });
    const t = setTimeout(() => setReady(true), 14000); // never trap anyone behind the loader
    return () => { cancelAnimationFrame(first); clearTimeout(t); };
  }, []);

  return (
    <main className={styles.hero}>
      <HeroScene motion={motion} onReady={markReady} />
      <div className={styles.vignette} aria-hidden="true" />

      <header className={styles.nav}>
        <Link href="/" className={styles.brand} aria-label="The Laws of Ruin, home">
          <span className={styles.brandName}>The Laws of Ruin</span>
          <span className={styles.brandSub}>Investigation I · The Fall of Kings</span>
        </Link>
        <div className={styles.opens}>
          <span className={styles.opensLabel}>Opens</span>
          <span className={styles.opensDate}>07 · 12 · 2026</span>
          {days !== null && <span className={styles.opensDays}>{days} days</span>}
        </div>
      </header>

      <section className={styles.copy}>
        <h1 className={styles.title}>Every empire leaves the same ruins.</h1>
        <p className={styles.tagline}>For those who seek power, and those who must keep it.</p>
      </section>

      <div className={styles.controls}>
        <SoundControl />
        <button
          className={`${styles.ctrl} ${!motion ? styles.ctrlOn : ""}`}
          onClick={() => setMotion((m) => !m)}
          aria-label={motion ? "Pause the library" : "Play the library"}
          aria-pressed={!motion}
          title={motion ? "Pause the library" : "Play the library"}
        >
          {motion ? (
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true"><rect x="7" y="6" width="3" height="12" /><rect x="14" y="6" width="3" height="12" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true"><path d="M8 5.5 L18.5 12 L8 18.5 Z" /></svg>
          )}
        </button>
      </div>

      <div className={styles.install}>
        <InstallCta />
      </div>

      <div className={`${styles.loader} ${ready ? styles.loaderDone : ""}`} aria-hidden={ready}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/loader/hourglass.webp" alt="" width="120" height="120" className={styles.loaderGlass} />
        <span className={styles.loaderText}>Turning the glass</span>
      </div>
    </main>
  );
}
