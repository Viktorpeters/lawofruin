"use client";

/* The two cards a tap inside the text opens.
   Who's Who (approved design B): a case file, paper index card with a clipped photo, a red stamp,
   the tipping point, and "Appears in" chips that jump to each place in the book.
   Word card: a light paper popover pointing at the tapped word. Both work offline. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BY_ID, PEOPLE } from "@/lib/book/whoswho";
import { WORD_BY_ID } from "@/lib/book/words";
import { APPEARS } from "@/lib/book/marks";
import s from "./cards.module.css";

const STAMP = { verified: "Verified", disputed: "Disputed", personal: "From the author", organisation: "On record" } as const;

/* A card's photo is /figures/<id>.<ext>. The file may be .jpg, .jpeg, .png or .webp: the card tries
   each in turn and shows initials only when none is there. A few photos carry a longer name than
   the card's id; PHOTO_NAME points the card at them. */
const EXT = ["jpg", "jpeg", "png", "webp"];
const PHOTO_NAME: Record<string, string> = {
  "maximilian-i": "maximilian-i-mexico",
};

function initials(name: string) {
  return name.replace(/^(Dr|Engr|Lord|King|The)\s+/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export function WhoCard({ id, onClose, onJump }: { id: string; onClose: () => void; onJump: (sec: string) => void }) {
  const p = BY_ID[id];
  // which extension we are trying for this person; past the last one, the card shows initials
  const [attempt, setAttempt] = useState({ id, n: 0 });
  const n = attempt.id === id ? attempt.n : 0;
  const photo = n < EXT.length;
  const fileNo = String(PEOPLE.findIndex((x) => x.id === id) + 1).padStart(3, "0");
  const appears = APPEARS[id] ?? [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!p) return null;
  return (
    <div className={s.scrim} onClick={onClose}>
      <article className={s.file} role="dialog" aria-label={`Who's Who: ${p.name}`} onClick={(e) => e.stopPropagation()}>
        <header className={s.hd}>
          <span>Who&apos;s Who · File {fileNo}</span>
          <button type="button" className={s.x} onClick={onClose} aria-label="Close">×</button>
        </header>
        <span className={`${s.stamp} ${p.status === "disputed" ? s.stampDisputed : ""}`}>{STAMP[p.status]}</span>
        <div className={s.row}>
          <div className={s.ph}>
            <span className={s.clip} aria-hidden="true" />
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${id}-${n}`}
                src={`/figures/${PHOTO_NAME[p.id] ?? p.id}.${EXT[n]}`}
                alt=""
                onError={() => setAttempt({ id, n: n + 1 })}
              />
            ) : (
              <span className={s.ini}>{initials(p.name)}</span>
            )}
          </div>
          <div className={s.id}>
            <div className={s.nm}>{p.name}</div>
            {p.known && <div className={s.ka}>{p.known}</div>}
            {p.dates && <div className={s.dt}>{p.dates}</div>}
            <div className={s.role}>{p.role}</div>
          </div>
        </div>
        <p className={s.about}>{p.about}</p>
        {p.tipping && (
          <>
            <div className={s.lbl}>Tipping point</div>
            <p className={s.tip}>{p.tipping}</p>
          </>
        )}
        {appears.length > 0 && (
          <>
            <div className={s.lbl}>Appears in</div>
            <div className={s.chips}>
              {appears.map((a) => (
                <button key={a.id} type="button" onClick={() => onJump(a.id)}>{a.label}</button>
              ))}
            </div>
          </>
        )}
      </article>
    </div>
  );
}

export function WordCard({ id, at, onClose }: { id: string; at: DOMRect; onClose: () => void }) {
  const w = WORD_BY_ID[id];
  const card = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number; arrow: number; below: boolean } | null>(null);

  // place it under the word, or above it when there is no room; keep it on screen
  useLayoutEffect(() => {
    const el = card.current;
    if (!el) return;
    const vw = window.innerWidth, vh = window.innerHeight;
    const width = Math.min(340, vw - 32);
    const h = el.offsetHeight;
    const below = at.bottom + 12 + h < vh - 90;
    const left = Math.max(16, Math.min(vw - width - 16, at.left + at.width / 2 - width / 2));
    const top = below ? at.bottom + 12 : Math.max(16, at.top - 12 - h);
    const arrow = Math.max(18, Math.min(width - 18, at.left + at.width / 2 - left));
    setPos({ left, top, arrow, below });
  }, [at]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!w) return null;
  return (
    <div className={s.clear} onClick={onClose}>
      <div
        ref={card}
        className={`${s.wcard} ${pos?.below === false ? s.above : ""}`}
        role="dialog"
        aria-label={w.word}
        onClick={(e) => e.stopPropagation()}
        style={pos ? { left: pos.left, top: pos.top, "--arrow": `${pos.arrow}px`, visibility: "visible" } as React.CSSProperties : { visibility: "hidden" }}
      >
        <div className={s.w}>{w.word}</div>
        {w.say && <div className={s.pr}>{w.say}</div>}
        <span className={s.tag}>{w.tag}</span>
        <p className={s.meaning}>{w.meaning}</p>
        {w.use && <p className={s.use}>{w.use}</p>}
      </div>
    </div>
  );
}
