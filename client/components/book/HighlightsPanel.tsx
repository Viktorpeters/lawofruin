"use client";

/* The reader's highlights, newest first: each one with its colour down the left edge, the words,
   where it is, the day, and ⋮ (Share as picture, Save as PNG, Go to the page, Change colour,
   Copy text, Delete). Tapping one opens its page, where it glows for a moment. */

import { useEffect, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { COLOURS, highlightList, subscribe, type Highlight } from "@/lib/book/highlights";
import { ICONS } from "./OptionsMenu";
import ns from "./notes.module.css";
import hs from "./highlights.module.css";

type Props = {
  lang: Lang;
  onOpen: (h: Highlight) => void;
  onMenu: (h: Highlight, at: DOMRect) => void;
};

export default function HighlightsPanel({ lang, onOpen, onMenu }: Props) {
  const [list, setList] = useState<Highlight[]>(() => highlightList());
  useEffect(() => subscribe(() => setList(highlightList())), []);

  if (!list.length) return <p className={hs.empty}>{t(lang, "hHighlight")}</p>;

  return (
    <div>
      {list.map((h, i) => (
        <div
          key={h.id}
          className={`${ns.entry} ${hs.item}`}
          style={{ "--mk": COLOURS.find((c) => c.c === h.c)!.hex, animationDelay: `${Math.min(i, 8) * 35}ms` } as React.CSSProperties}
          role="button"
          tabIndex={0}
          onClick={() => onOpen(h)}
          onKeyDown={(e) => { if (e.key === "Enter") onOpen(h); }}
        >
          <div className={ns.entryHead}>
            <span>{h.head || t(lang, "theBook")}{h.page ? ` · p. ${h.page}` : ""}</span>
            <span>{new Date(h.at).toLocaleDateString(lang, { day: "numeric", month: "short" })}</span>
          </div>
          <p className={hs.words}><span>{h.text || "…"}</span></p>
          <button type="button" className={ns.dots} aria-label={t(lang, "options")} onClick={(e) => { e.stopPropagation(); onMenu(h, e.currentTarget.getBoundingClientRect()); }}>
            {ICONS.dots}
          </button>
        </div>
      ))}
    </div>
  );
}
