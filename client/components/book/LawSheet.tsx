"use client";

/* One law, opened from the Contents: the law, its Judgment, its era stamps, the short story,
   then its twelve sections, each one a tappable row that unfolds into a short story of its own.
   Every Who's Who name and word inside is tappable, so readers can open files as they go. */

import { useEffect, useMemo, useState } from "react";
import { PARTS } from "@/lib/book/content";
import { tokenize, type Token } from "@/lib/book/marks";
import s from "./LawSheet.module.css";

type Props = {
  n: number;
  onClose: () => void;
  onWho: (id: string) => void;
  onWord: (id: string, at: DOMRect) => void;
};

function Rich({ tokens, onWho, onWord }: { tokens: Token[]; onWho: Props["onWho"]; onWord: Props["onWord"] }) {
  return (
    <>
      {tokens.map((t, i) =>
        t.t === "text" ? (
          t.s
        ) : (
          <span key={i}>
            <button
              type="button"
              className={t.t === "who" ? s.who : s.word}
              onClick={(e) => (t.t === "who" ? onWho(t.id) : onWord(t.id, e.currentTarget.getBoundingClientRect()))}
            >
              {t.s}
            </button>
            {t.tail}
          </span>
        ),
      )}
    </>
  );
}

export default function LawSheet({ n, onClose, onWho, onWord }: Props) {
  const found = useMemo(() => {
    for (const part of PARTS) for (const law of part.laws) if (law.n === n) return { part, law };
    return null;
  }, [n]);
  const [open, setOpen] = useState<number | null>(0);

  // names are marked once across the whole law, the first time they appear
  const marked = useMemo(() => {
    const seen = new Set<string>();
    const law = found?.law;
    return {
      story: law?.story ? tokenize(law.story, seen) : [],
      sections: (law?.sections ?? []).map((x) => tokenize(x.text, seen)),
    };
  }, [found]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!found) return null;
  const { part, law } = found;

  return (
    <div className={s.wrap} onClick={onClose}>
      <article className={s.sheet} role="dialog" aria-label={`Law ${law.n}: ${law.title}`} onClick={(e) => e.stopPropagation()}>
        <header className={s.head}>
          <span className={s.kicker}>Part {part.n} · {part.title}</span>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close">×</button>
        </header>

        <div className={s.num}>Law {law.n}</div>
        <h2 className={s.title}>{law.title}</h2>
        {law.judgment && <p className={s.judg}>{law.judgment}</p>}
        {law.eras && <div className={s.stamps}>{law.eras.map((e) => <span key={e}>{e}</span>)}</div>}
        {law.story && <p className={s.story}><Rich tokens={marked.story} onWho={onWho} onWord={onWord} /></p>}

        <div className={s.label}>The {law.sections?.length ?? 0} sections · tap to open</div>
        <ol className={s.list}>
          {(law.sections ?? []).map((sec, i) => (
            <li key={sec.name} className={`${s.item} ${open === i ? s.on : ""}`}>
              <button type="button" className={s.row} onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <span className={s.idx}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.name}>{sec.name}</span>
                <span className={s.chev} aria-hidden="true">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className={s.text}><Rich tokens={marked.sections[i]} onWho={onWho} onWord={onWord} /></p>
              )}
            </li>
          ))}
        </ol>
        <p className={s.foot}>The full law, every section at length, opens on {part.opens}.</p>
      </article>
    </div>
  );
}
