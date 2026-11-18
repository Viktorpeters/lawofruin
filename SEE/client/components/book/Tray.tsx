"use client";

/* The reader tray: one round button at the bottom right. Its rings are an hourglass seen from
   above, gold on near-black. Tapping it fans the five items out in a quarter circle, up and to
   the left, each with its label under it. Tapping an item opens its panel. Tap outside, tap the
   button again or press Escape to close. Left-handed readers can mirror it to the bottom left
   (Appearance). Ask has its own button directly above, so it is always one tap away.
   Built on the same pattern as the Alcove reader tray. */

import { useCallback, useEffect, useState } from "react";
import { ASK_ICON, TRAY_ITEMS, type TrayItemId } from "./trayItems";
import { t, type Lang } from "@/lib/i18n";
import styles from "./tray.module.css";

/* The radius and angles (90 is straight up, 180 is straight left) keep at least 8px of clear
   space between every icon and every label. Change them together, not one at a time. */
const RADIUS = 152;
const ANGLES = [85, 105, 127, 152, 180];

type Props = {
  left: boolean;
  light: boolean;                    // over the dark cover
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

  return (
    <>
      {open && <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />}

      <button
        type="button"
        className={`${styles.ask} ${left ? styles.left : ""} ${open ? styles.askAway : ""}`}
        onClick={() => { setOpen(false); onAsk(); }}
        aria-label={t(lang, "askTitle")}
        tabIndex={open ? -1 : 0}
      >
        <span className={styles.itemIcon}>{ASK_ICON}</span>
        <span className={styles.askLabel}>{t(lang, "ask")}</span>
      </button>

      <nav className={`${styles.tray} ${left ? styles.left : ""} ${open ? styles.open : ""} ${light ? styles.light : ""}`} aria-label="Reader menu">
        {TRAY_ITEMS.map((item, i) => {
          const rad = (ANGLES[i] * Math.PI) / 180;
          const x = Math.cos(rad) * RADIUS * (left ? -1 : 1);
          const y = -Math.sin(rad) * RADIUS;
          return (
            <button
              key={item.id}
              type="button"
              className={styles.item}
              style={{ "--x": `${x.toFixed(1)}px`, "--y": `${y.toFixed(1)}px`, "--i": i } as React.CSSProperties}
              onClick={() => { setOpen(false); onChoose(item.id); }}
              tabIndex={open ? 0 : -1}
              aria-label={t(lang, item.id)}
            >
              <span className={styles.itemIcon}>{item.icon}</span>
              <span className={styles.label}>{t(lang, item.id)}</span>
            </button>
          );
        })}

        <button type="button" className={styles.orb} onClick={toggle} aria-expanded={open} aria-label={open ? t(lang, "closeMenu") : t(lang, "openMenu")}>
          <span className={styles.ring} />
          <span className={styles.ring} />
          <span className={styles.ring} />
          <span className={styles.core} />
        </button>
      </nav>
    </>
  );
}
