"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Shelf from "./Shelf";
import Hourglass from "./HourGlass";
import SoundControl from "./SoundControl";
import InstallCta from "@/components/install/InstallCta";
import { BY_SLUG, CIRCLE_NAME, dates } from "@/lib/figures";
import styles from "./hero.module.css";

const OPENS = new Date("2026-12-17T00:00:00+01:00");

/* The small line under the name. It turns slowly through four lines; the promise in the
   bottom band ("For those who seek power...") never moves, so the key is always on screen. */
const WHISPERS = [
  "Investigation I · The Fall of Kings",
  "A field guide for the modern power seeker",
  "The office. The pulpit. The palace. The street.",
  "Not only how to take power. How to keep it.",
];

type Props = {
  photos: Record<string, string>;   // slug -> file name, only for photos that exist in /public/figures
};

/* One screen, no nav.
   Top: the name, the turning line, the opening date; the hourglass on the right.
   Middle: the shelves of covers.
   Bottom: the thesis and the promise (or the pulled volume's card), sound and pause, and "Add to". */
export default function Hero({ photos }: Props) {
  const [motion, setMotion] = useState(true);
  const [days, setDays] = useState<number | null>(null);
  const [pulled, setPulled] = useState<string | null>(null);
  const onPull = useCallback((slug: string | null) => setPulled(slug), []);

  useEffect(() => {
    const first = requestAnimationFrame(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches)
        setMotion(false);
      setDays(
        Math.max(0, Math.ceil((OPENS.getTime() - Date.now()) / 86400000)),
      );
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPulled(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const fig = pulled ? BY_SLUG[pulled] : null;
  const [from, to] = fig ? dates(fig) : ["", null];

  return (
    <main className={styles.hero} data-motion={motion ? "on" : "off"}>
      <header className={styles.top}>
        <div className={styles.brand}>
          <h1 className={styles.brandName}>The Laws of Ruin</h1>
          <p className={styles.whisper}>
            <span className="sr-only">{WHISPERS.join(". ")}</span>
            {WHISPERS.map((w, i) => (
              <span
                key={w}
                className={styles.whisperLine}
                style={{ animationDelay: `${i * 4.5 - 18.6}s` }}
                aria-hidden="true"
              >
                {w}
              </span>
            ))}
          </p>
          <p className={styles.opens}>
            <span className={styles.opensLabel}>Opens</span> 07 · 12 · 26
            <span className={styles.opensDays}>
              {days !== null ? ` · ${days} days` : ""}
            </span>
          </p>
        </div>
        <Hourglass motion={motion} />
      </header>

      <Shelf photos={photos} motion={motion} pulled={pulled} onPull={onPull} />

      <footer className={styles.bottom}>
        <div className={styles.left} data-pulled={fig ? "" : undefined}>
          <div className={styles.words} aria-live="polite">
            <div
              className={`${styles.thesis} ${fig ? styles.away : ""}`}
              aria-hidden={!!fig}
            >
              <p className={styles.title}>
                Every empire leaves the same ruins.
              </p>
              <p className={styles.tagline}>
                For those who seek power, and those who must keep it.
              </p>
            </div>
            {fig && (
              <div className={styles.card} key={fig.slug}>
                <span className={styles.thumb}>
                  {photos[fig.slug] && (
                    <Image
                      src={`/figures/${photos[fig.slug]}`}
                      alt=""
                      fill
                      sizes="56px"
                      style={{
                        objectFit: "cover",
                        objectPosition: fig.focus ?? "50% 28%",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </span>
                <div className={styles.cardText}>
                  <span className={styles.cardRealm}>
                    {fig.realm} · {CIRCLE_NAME[fig.circle]}
                  </span>
                  <span className={styles.cardName}>{fig.name}</span>
                  {fig.known && (
                    <span className={styles.cardKnown}>“{fig.known}”</span>
                  )}
                  <span className={styles.cardDates}>
                    {to ? (
                      <>
                        {from}
                        <i aria-hidden="true" />
                        {to}
                      </>
                    ) : fig.span ? (
                      from
                    ) : (
                      `Born ${from}`
                    )}
                  </span>
                  <span className={styles.cardFate}>{fig.fate}</span>
                  <button
                    type="button"
                    className={styles.putBack}
                    onClick={() => setPulled(null)}
                  >
                    Put it back
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.controls}>
            <SoundControl />
            <button
              type="button"
              className={`${styles.ctrl} ${!motion ? styles.ctrlOn : ""}`}
              onClick={() => setMotion((m) => !m)}
              aria-label={motion ? "Pause the motion" : "Play the motion"}
              aria-pressed={!motion}
              title={motion ? "Pause the motion" : "Play the motion"}
            >
              {motion ? (
                <svg
                  viewBox="0 0 24 24"
                  className={styles.icon}
                  aria-hidden="true"
                >
                  <rect x="7" y="6" width="3" height="12" />
                  <rect x="14" y="6" width="3" height="12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className={styles.icon}
                  aria-hidden="true"
                >
                  <path d="M8 5.5 L18.5 12 L8 18.5 Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={styles.install}>
          <InstallCta />
        </div>
      </footer>
    </main>
  );
}
