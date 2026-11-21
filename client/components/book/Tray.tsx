"use client";

/* The reader's controls: one white button in the top left corner, and nothing else, so the
   top of the page stays clear.
   Tap it and three glass buttons spring out to its right, one after another: Menu, Tools and
   Ask. Each one flies out from behind the button, turning as it grows, and lands with a small
   bounce; the white button itself turns into a ×. Tap the × and they fly back in the same way,
   the last one first, and the × turns back.
   Menu drops the reader menu down beneath it (Contents, Who's Who, Purchases, Earn, Appearance),
   each item growing in after the one above it. Tools and Ask do what they always did, and the
   buttons fold away behind them. */

import { useCallback, useEffect, useState } from "react";
import { ASK_ICON, MENU_ICON, TOOLS_ICON, TRAY_ITEMS, type TrayItemId } from "./trayItems";
import { t, type Lang } from "@/lib/i18n";
import styles from "./tray.module.css";

const STEP = 52;     // the distance between two menu items, in px
const OUT_MS = 420;  // how long the buttons take to fly back in

type Props = {
  left: boolean;
  light: boolean;    // over the dark cover
  lang: Lang;
  onChoose: (id: TrayItemId) => void;
  onAsk: () => void;
  onTools: () => void;
};

export default function Tray({ light, lang, onChoose, onAsk, onTools }: Props) {
  const [cluster, setCluster] = useState<"closed" | "open" | "closing">("closed");
  const [menu, setMenu] = useState(false);

  const fold = useCallback((then?: () => void) => {
    setMenu(false);
    setCluster((c) => (c === "closed" ? c : "closing"));
    window.setTimeout(() => setCluster((c) => (c === "closing" ? "closed" : c)), OUT_MS);
    if (then) window.setTimeout(then, 120);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") fold(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fold]);

  const tick = () => { try { navigator.vibrate?.(6); } catch { /* not supported */ } };
  const launch = () => {
    tick();
    if (cluster === "open") fold();
    else if (cluster === "closed") setCluster("open");
  };

  const shown = cluster !== "closed";
  const n = TRAY_ITEMS.length;
  const buttons = [
    { key: "menu", icon: MENU_ICON, label: t(lang, menu ? "closeMenu" : "openMenu"), act: () => { tick(); setMenu((m) => !m); }, on: menu },
    { key: "tools", icon: TOOLS_ICON, label: t(lang, "tools"), act: () => fold(onTools), on: false },
    { key: "ask", icon: ASK_ICON, label: t(lang, "askTitle"), act: () => fold(onAsk), on: false },
  ];

  return (
    <>
      <div className={`${styles.scrim} ${menu ? styles.scrimOn : ""}`} onClick={() => setMenu(false)} aria-hidden="true" />

      <nav className={`${styles.tray} ${shown ? styles.open : ""} ${cluster === "closing" ? styles.closing : ""} ${light ? styles.light : ""}`} aria-label="Reader menu">
        {/* the white button: two lines that turn into a × */}
        <button type="button" className={styles.orb} onClick={launch} aria-expanded={cluster === "open"} aria-label={cluster === "open" ? t(lang, "closeMenu") : t(lang, "openMenu")}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.glyph}>
            <path className={styles.bar1} d="M5 8h14" />
            <path className={styles.bar2} d="M5 16h14" />
          </svg>
        </button>

        {/* Menu, Tools, Ask: they fly out to the right, and back in */}
        {shown && buttons.map((b, i) => (
          <button
            key={b.key}
            type="button"
            className={`${styles.btn} ${b.on ? styles.btnOn : ""}`}
            style={{ "--i": i, "--o": buttons.length - 1 - i, "--x": `${46 + i * 42}px` } as React.CSSProperties}
            onClick={b.act}
            aria-label={b.label}
            aria-expanded={b.key === "menu" ? menu : undefined}
            disabled={cluster === "closing"}
          >
            {b.icon}
          </button>
        ))}

        {/* the reader menu, dropping down beneath the Menu button */}
        <div className={`${styles.drop} ${menu ? styles.dropOpen : ""}`}>
          {TRAY_ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={styles.item}
              style={{
                "--y": `${(i + 1) * STEP + 8}px`,
                "--in": `${i * 40}ms`,
                "--out": `${(n - 1 - i) * 30}ms`,
              } as React.CSSProperties}
              onClick={() => fold(() => onChoose(item.id))}
              tabIndex={menu ? 0 : -1}
              aria-hidden={!menu}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>
                <span className={styles.mark}>{item.mark}</span>
                {t(lang, item.id)}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
