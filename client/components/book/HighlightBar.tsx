"use client";

/* Highlight's own controls, in the tool bar: the six colours as small sharp squares, and the
   eraser and Share, which appear as soon as there is a highlight. Share turns the latest
   highlight into a picture. */

import { COLOURS, type Colour } from "@/lib/book/highlights";
import { t, type Lang } from "@/lib/i18n";
import s from "./tools.module.css";

type Props = {
  lang: Lang;
  colour: Colour;
  setColour: (c: Colour) => void;
  erase: boolean;
  setErase: (on: boolean) => void;
  any: boolean;            // at least one highlight exists
  onShare: () => void;
};

export default function HighlightBar({ lang, colour, setColour, erase, setErase, any, onShare }: Props) {
  return (
    <div className={s.swatches} role="radiogroup" aria-label={t(lang, "tHighlight")}>
      {COLOURS.map(({ c, hex }, i) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={!erase && colour === c}
          className={`${s.swatch} ${!erase && colour === c ? s.swatchOn : ""}`}
          style={{ "--sw": hex, "--i": i } as React.CSSProperties}
          onClick={() => { setErase(false); setColour(c); }}
        />
      ))}
      {any && (
        <button
          type="button"
          className={`${s.eraser} ${erase ? s.eraserOn : ""}`}
          aria-pressed={erase}
          aria-label={t(lang, "eraser")}
          onClick={() => setErase(!erase)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.5 19.5h11M4.6 14.9l9.2-9.2a1.6 1.6 0 0 1 2.3 0l3.2 3.2a1.6 1.6 0 0 1 0 2.3l-7.6 7.6a2.4 2.4 0 0 1-1.7.7H8.4a2.4 2.4 0 0 1-1.7-.7l-2.1-2.1a1.3 1.3 0 0 1 0-1.8z" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.4 10.1l5.5 5.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        </button>
      )}
      {any && (
        <button type="button" className={s.shareBtn} onClick={onShare} aria-label={t(lang, "share")}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M6 12.5v7h12v-7" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
