"use client";

/* The ⋮ options card. It grows out of the dots that opened it, with a spring and a blur that
   clears, while the screen behind dims; its rows drop in one after another. It opens downward,
   or upward when there is no room below. Tapping outside folds it back into the dots.
   A row marked `danger` (Delete) asks once: the first tap turns it into "Tap again to delete". */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import s from "./notes.module.css";

export type MenuItem = { icon: ReactNode; label: string; onPick: () => void; danger?: boolean; confirm?: string };

type Props = { anchor: DOMRect; items: MenuItem[]; onClose: () => void };

const ROW = 46;

export default function OptionsMenu({ anchor, items, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [arming, setArming] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const height = items.length * ROW + 12;
  const up = anchor.bottom + height + 16 > window.innerHeight && anchor.top - height - 16 > 0;
  const right = Math.max(10, window.innerWidth - anchor.right);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(onClose, 190);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useLayoutEffect(() => { box.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }); }, []);

  const pick = (i: number) => {
    const it = items[i];
    if (it.danger && it.confirm && arming !== i) { setArming(i); return; }
    try { navigator.vibrate?.(8); } catch { /* not supported */ }
    close();
    window.setTimeout(it.onPick, 120);
  };

  return (
    <>
      <div className={`${s.menuDim} ${closing ? s.menuDimOut : ""}`} onClick={close} aria-hidden="true" />
      <div
        ref={box}
        role="menu"
        className={`${s.menu} ${up ? s.menuUp : ""} ${closing ? s.menuOut : ""}`}
        style={up ? { bottom: window.innerHeight - anchor.top + 4, right } : { top: anchor.bottom + 4, right }}
      >
        {items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            role="menuitem"
            className={`${s.menuRow} ${it.danger ? s.menuDanger : ""} ${arming === i ? s.menuArmed : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            onClick={() => pick(i)}
          >
            {it.icon}
            <span>{arming === i && it.confirm ? it.confirm : it.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

const st = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
export const ICONS = {
  share: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M6 12.5v7h12v-7" {...st} /></svg>,
  save: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" {...st} /></svg>,
  go: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5" {...st} /></svg>,
  edit: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.2-4.4L16.6 4.2a1.8 1.8 0 0 1 2.6 0l.6.6a1.8 1.8 0 0 1 0 2.6L8.4 18.8zM14.5 6.3l3.2 3.2" {...st} /></svg>,
  copy: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 8.5h10v11h-10zM5.5 15.5v-11h10" {...st} /></svg>,
  del: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9.5 7V4.5h5V7M7 7l1 13h8l1-13" {...st} /></svg>,
  dots: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5.5" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="18.5" r="1.6" fill="currentColor" /></svg>,
};
