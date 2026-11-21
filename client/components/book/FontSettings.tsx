"use client";

/* Font settings, in Appearance: the text size and the heading size as real numbers (a reader can
   go from very small to very large, not just three steps), and the reading font, from twenty.
   A small page on top shows the choice as it will look: a heading with its big first letter,
   then running text. The text size moves only the running text; the heading size moves the
   headings and the big first letters. The book re-pages a moment after the reader stops. */

import { useEffect } from "react";
import { t, type Lang } from "@/lib/i18n";
import { FONTS, fontById, loadPreviews, previewFamily } from "@/lib/book/fonts";
import s from "./fontset.module.css";

export const TEXT_MIN = 8, TEXT_MAX = 40, HEAD_MIN = 10, HEAD_MAX = 48;

type Props = {
  lang: Lang;
  fontSize: number;
  setFontSize: (n: number) => void;
  headSize: number;
  setHeadSize: (n: number) => void;
  fontId: string;
  setFontId: (id: string) => void;
};

function Size({ label, value, min, max, set }: { label: string; value: number; min: number; max: number; set: (n: number) => void }) {
  const step = (d: number) => set(Math.min(max, Math.max(min, value + d)));
  return (
    <div className={s.size}>
      <div className={s.sizeRow}>
        <span className={s.label}>{label}</span>
        <div className={s.stepper}>
          <button type="button" onClick={() => step(-1)} disabled={value <= min} aria-label={`${label} −`}>−</button>
          <output>{value}<small>px</small></output>
          <button type="button" onClick={() => step(1)} disabled={value >= max} aria-label={`${label} +`}>+</button>
        </div>
      </div>
      <input
        type="range"
        className={s.range}
        min={min}
        max={max}
        step={1}
        value={value}
        aria-label={label}
        style={{ "--p": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
        onChange={(e) => set(Number(e.target.value))}
      />
    </div>
  );
}

export default function FontSettings({ lang, fontSize, setFontSize, headSize, setHeadSize, fontId, setFontId }: Props) {
  useEffect(() => { loadPreviews(); }, []);
  const font = fontById(fontId);

  return (
    <div className={s.wrap}>
      {/* the page as it will look */}
      <div className={s.preview} style={{ fontFamily: previewFamily(font) }}>
        <h4 style={{ fontSize: `${Math.round(headSize * 1.25)}px` }}>{t(lang, "previewHead")}</h4>
        <p style={{ fontSize: `${fontSize}px` }}>
          <span className={s.drop} style={{ fontSize: `${Math.round(headSize * 2.6)}px` }}>{t(lang, "previewText").charAt(0)}</span>
          {t(lang, "previewText").slice(1)}
        </p>
      </div>

      <Size label={t(lang, "textSize")} value={fontSize} min={TEXT_MIN} max={TEXT_MAX} set={setFontSize} />
      <Size label={t(lang, "headingSize")} value={headSize} min={HEAD_MIN} max={HEAD_MAX} set={setHeadSize} />

      <div className={s.label} style={{ marginTop: 18 }}>{t(lang, "fontLabel")}</div>
      <div className={s.fonts} role="radiogroup" aria-label={t(lang, "fontLabel")}>
        {FONTS.map((f, i) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={f.id === fontId}
            className={`${s.font} ${f.id === fontId ? s.fontOn : ""}`}
            style={{ fontFamily: previewFamily(f), "--i": i } as React.CSSProperties}
            onClick={() => setFontId(f.id)}
          >
            <span className={s.aa}>Aa</span>
            <span className={s.fname}>{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
