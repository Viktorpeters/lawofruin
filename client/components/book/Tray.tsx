"use client";

/* The reader menu: one round glass button at the bottom right. Tapping it brings the five
   items out in a column above it, one after another: each grows from nothing to full size,
   from the bottom right where the button is, 40ms after the one below it, with a small
   overshoot so it lands with a snap. Each label is a small sharp white-edged card (its own
   picture, then the words) close beside its round icon.
   Tap an item to open its panel; tap outside, the button again or Escape to close (the items
   go back in, the last one first). Left-handed readers can mirror it (Appearance).
   Ask has its own glass button directly above, always one tap away. */

import { useCallback, useEffect, useState } from "react";
import { ASK_ICON, TRAY_ITEMS, type TrayItemId } from "./trayItems";
import { t, type Lang } from "@/lib/i18n";
import styles from "./tray.module.css";

const STEP = 58;   // the distance between the centres of two items, in px

type Props = {
  left: boolean;
  light: boolean;    // over the dark cover
  lang: Lang;
  onChoose: (id: TrayItemId) => void;
  onAsk: () => void;
};

export default function Tray({ left, light, lang, onChoose, onAsk }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const n = TRAY_ITEMS.length;

  return (
    <>
      <div className={`${styles.scrim} ${open ? styles.scrimOn : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <button
        type="button"
        className={`${styles.ask} ${left ? styles.left : ""} ${open ? styles.askAway : ""} ${light ? styles.light : ""}`}
        onClick={() => { setOpen(false); onAsk(); }}
        aria-label={t(lang, "askTitle")}
        tabIndex={open ? -1 : 0}
      >
        {ASK_ICON}
      </button>

      <nav className={`${styles.tray} ${left ? styles.left : ""} ${open ? styles.open : ""} ${light ? styles.light : ""}`} aria-label="Reader menu">
        {TRAY_ITEMS.map((item, i) => {
          // the last item in the list sits nearest the button and comes out first
          const fromButton = n - i;
          return (
            <button
              key={item.id}
              type="button"
              className={styles.item}
              style={{
                "--y": `${-fromButton * STEP}px`,
                "--in": `${(fromButton - 1) * 40}ms`,
                "--out": `${(n - fromButton) * 30}ms`,
              } as React.CSSProperties}
              onClick={() => { setOpen(false); onChoose(item.id); }}
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
            >
              <span className={styles.label}>
                <span className={styles.mark}>{item.mark}</span>
                {t(lang, item.id)}
              </span>
              <span className={styles.icon}>{item.icon}</span>
            </button>
          );
        })}

        <button type="button" className={styles.orb} onClick={toggle} aria-expanded={open} aria-label={open ? t(lang, "closeMenu") : t(lang, "openMenu")}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}>
            <path className={styles.bar1} d="M5 8h14" />
            <path className={styles.bar2} d="M5 16h14" />
          </svg>
        </button>
      </nav>
    </>
  );
}
