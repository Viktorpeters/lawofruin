"use client";

/* The reading guide: a dark see-through layer shown once, the first time the cover is opened.
   Dashed lines split the page into the same three parts the book really uses:
   the left third goes back, the right third goes forward, the middle is for reading.
   A hand shows each move. Tap anywhere, or "Got it", to start reading.
   Settings can show it again. */

import { useEffect } from "react";
import s from "./coach.module.css";

const Hand = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M10 9.5V4.2a1.8 1.8 0 0 1 3.6 0v6.3M13.6 10.3V8.9a1.8 1.8 0 0 1 3.6 0v2.4M17.2 11.1a1.8 1.8 0 0 1 3.6 0v3.1a7.6 7.6 0 0 1-7.6 7.6h-1.6c-2.5 0-4-.8-5.4-2.1l-3.3-3.3a1.8 1.8 0 0 1 2.6-2.5l2.5 2.4V9.4a1.8 1.8 0 0 1 3.6 0" />
  </svg>
);

export default function Coach({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter") onDone(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  return (
    <div className={s.coach} onClick={onDone} role="dialog" aria-label="How to turn the pages">
      <div className={s.zones}>
        <section className={s.zone}>
          <div className={s.demo}>
            <Hand className={`${s.hand} ${s.tapHand}`} />
            <span className={s.ring} />
          </div>
          <div className={s.name}>Back</div>
          <p className={s.how}>Tap here, or swipe right anywhere</p>
          <span className={`${s.arrow} ${s.arrowRight}`} aria-hidden="true">→</span>
        </section>

        <section className={`${s.zone} ${s.middle}`}>
          <div className={s.name}>Read</div>
          <p className={s.how}>Tapping the middle never turns the page</p>
          <p className={s.example}>
            Tap a <span className={s.who}>name</span> for its file,
            <br />a <span className={s.word}>word</span> for its meaning
          </p>
        </section>

        <section className={s.zone}>
          <div className={s.demo}>
            <Hand className={`${s.hand} ${s.swipeHand}`} />
            <span className={s.trail} />
          </div>
          <div className={s.name}>Next</div>
          <p className={s.how}>Tap here, or swipe left anywhere</p>
          <span className={`${s.arrow} ${s.arrowLeft}`} aria-hidden="true">←</span>
        </section>
      </div>

      <div className={s.foot}>
        <p className={s.note}>Drag, and the page follows your finger. Pull it a third of the way across and let go, and it turns.</p>
        <button type="button" className={s.got} onClick={onDone}>Got it</button>
      </div>
    </div>
  );
}
