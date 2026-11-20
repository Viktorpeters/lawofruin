"use client";

/* One note, on a sharp dark card that lifts up from the bottom of the screen.
   - write: a new note. The section and page at the top, the sentence it belongs to (for a line
     note), then the writing box. Save keeps it, Cancel drops it.
   - read: the note as written, with its date, the ⋮ options, and Done.
   - edit: the writing box again, holding the note.
   The card rides above the phone's keyboard while typing. Long notes are planned for: the
   writing box grows with the text, then scrolls inside itself; the card never grows taller than
   the part of the screen the keyboard leaves; a long sentence folds to three lines (tap it to
   see it all); and a long note scrolls inside the card when read, with a soft fade at the edge
   to show there is more. */

import { useEffect, useRef, useState } from "react";
import { t, type Lang } from "@/lib/i18n";
import { ICONS } from "./OptionsMenu";
import s from "./notes.module.css";

export type Draft = { kind: "line" | "page"; quote: string; head: string; page: string };

type Props = {
  lang: Lang;
  mode: "write" | "read" | "edit";
  draft: Draft;
  text: string;
  date?: string;
  raised: boolean;                     // the tool bar is on screen below the card
  onSave: (text: string) => void;
  onCancel: () => void;
  onEdit: () => void;
  onMenu: (anchor: DOMRect) => void;
};

export default function NoteCard({ lang, mode, draft, text, date, raised, onSave, onCancel, onEdit, onMenu }: Props) {
  const [value, setValue] = useState(text);
  const [closing, setClosing] = useState(false);
  const [lift, setLift] = useState(0);
  const [room, setRoom] = useState(0);            // the height of the screen the keyboard leaves
  const [open, setOpen] = useState(false);        // the sentence shown in full
  const area = useRef<HTMLTextAreaElement>(null);
  const writing = mode !== "read";

  useEffect(() => { setValue(text); }, [text, mode]);

  // keep the card above the keyboard: the visual viewport shrinks when the keyboard opens
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const fit = () => { setLift(Math.max(0, window.innerHeight - vv.height - vv.offsetTop)); setRoom(vv.height); };
    fit();
    vv.addEventListener("resize", fit);
    vv.addEventListener("scroll", fit);
    return () => { vv.removeEventListener("resize", fit); vv.removeEventListener("scroll", fit); };
  }, []);

  useEffect(() => {
    if (writing) window.setTimeout(() => area.current?.focus({ preventScroll: true }), 260);
  }, [writing]);

  // the writing box grows line by line with the note, up to what the card can hold, then scrolls
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value, writing]);

  const leave = (then: () => void) => {
    setClosing(true);
    window.setTimeout(then, 220);
  };

  const meta = mode === "read" && date ? date : draft.page ? `p. ${draft.page}` : "";
  const head = draft.kind === "page" ? `${t(lang, "pageNote")} · ${draft.head}` : draft.head;

  return (
    <div
      className={`${s.card} ${closing ? s.cardOut : ""}`}
      style={{
        bottom: `calc(${lift ? lift + 10 : raised ? 78 : 16}px + ${lift ? "0px" : "env(safe-area-inset-bottom)"})`,
        maxHeight: room ? `${Math.max(220, room - (lift ? 24 : raised ? 100 : 40) - 60)}px` : undefined,
      }}
      role="dialog"
      aria-label={t(lang, "tNote")}
    >
      <div className={s.meta}>
        <span>{head}</span>
        <span className={s.metaRight}>
          {meta}
          {mode === "read" && (
            <button type="button" className={s.dots} aria-label={t(lang, "options")} onClick={(e) => onMenu(e.currentTarget.getBoundingClientRect())}>
              {ICONS.dots}
            </button>
          )}
        </span>
      </div>

      {draft.kind === "line" && draft.quote && (
        <p className={`${s.quote} ${open ? s.quoteOpen : ""}`} onClick={() => setOpen(!open)}>{draft.quote}</p>
      )}

      {writing ? (
        <textarea
          ref={area}
          className={s.area}
          value={value}
          rows={3}
          maxLength={3000}
          placeholder={t(lang, "writeNote")}
          aria-label={t(lang, "writeNote")}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <p className={s.body}>{text}</p>
      )}

      <div className={s.acts}>
        {writing ? (
          <>
            <button type="button" className={s.dim} onClick={() => leave(onCancel)}>{t(lang, "cancel")}</button>
            <button type="button" disabled={!value.trim()} onClick={() => leave(() => onSave(value.trim()))}>{t(lang, "saveNote")}</button>
          </>
        ) : (
          <>
            <button type="button" className={s.dim} onClick={onEdit}>{t(lang, "edit")}</button>
            <button type="button" onClick={() => leave(onCancel)}>{t(lang, "done")}</button>
          </>
        )}
      </div>
    </div>
  );
}
