"use client";

/* The reading tools. The Tools button (above Ask) opens a row along the bottom of the screen:
   Highlight, Note, Bookmark, Meanings, Turning and Landscape, each a round glass button that
   grows in from the bottom, one after another.
   The first tap on any tool shows a short card explaining it, once only.
   Highlight, Note and Meanings work with the finger on the page, so choosing one replaces the
   row with that tool's own bar: its name, its controls, and a glass × to leave. While a finger
   tool is on, pages do not turn. Nothing a tool needs is hidden in a menu. */

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { t, type Key, type Lang } from "@/lib/i18n";
import s from "./tools.module.css";

export type ToolId = "highlight" | "note" | "bookmark" | "meanings" | "turn" | "landscape";

/* the tools that need the finger on the page: pages stop turning while one is on */
export const FINGER_TOOLS: ToolId[] = ["highlight", "note", "meanings"];

const st = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const TOOLS: { id: ToolId; name: Key; help: Key; icon: ReactNode }[] = [
  {
    id: "highlight", name: "tHighlight", help: "hHighlight",
    // a circle of colour, the pencil box
    icon: <span className={s.wheel} aria-hidden="true" />,
  },
  {
    id: "note", name: "tNote", help: "hNote",
    // a small notebook with a pen across it
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h9.5a1.5 1.5 0 0 1 1.5 1.5v14.5H7.5A1.5 1.5 0 0 1 6 18z" {...st} /><path d="M9 8h5M9 11h3" {...st} /><path d="M14.5 20.5l5.6-5.6 1.6 1.6-5.6 5.6h-1.6z" {...st} /></svg>,
  },
  {
    id: "bookmark", name: "tBookmark", help: "hBookmark",
    // a ribbon with a notch
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h10v17l-5-3.6-5 3.6z" {...st} /></svg>,
  },
  {
    id: "meanings", name: "tMeanings", help: "hMeanings",
    // a letter over a dotted line
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 15.5L11 4.5l4.5 11M8.2 11.5h5.6" {...st} /><path d="M4 19.5h16" {...st} strokeDasharray="1.2 2.4" /></svg>,
  },
  {
    id: "turn", name: "tTurn", help: "hTurn",
    // two pages with an arrow between them
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h6v13h-6zM14.5 5.5h6v13h-6z" {...st} /><path d="M10.5 12h3M12.4 10.6l1.4 1.4-1.4 1.4" {...st} /></svg>,
  },
  {
    id: "landscape", name: "tLandscape", help: "hLandscape",
    // a phone on its side with a turning arrow
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9.5h17v9h-17z" {...st} /><path d="M7 6.5a6 6 0 0 1 9.5-1.5l1 1" {...st} /><path d="M17.8 3.5v2.8H15" {...st} /></svg>,
  },
];

/* a light tick under the finger, on phones that allow it (Android; iPhones ignore it) */
const tick = () => { try { navigator.vibrate?.(8); } catch { /* not supported */ } };

const TAUGHT_KEY = "lor-taught";
const taught = (): string[] => { try { return JSON.parse(localStorage.getItem(TAUGHT_KEY) || "[]"); } catch { return []; } };
const markTaught = (id: ToolId) => { try { localStorage.setItem(TAUGHT_KEY, JSON.stringify([...new Set([...taught(), id])])); } catch { /* private mode */ } };

type Props = {
  lang: Lang;
  open: boolean;                       // the row of tools is showing
  mode: ToolId | null;                 // a finger tool is on
  onClose: () => void;                 // close the row
  onMode: (id: ToolId | null) => void;
  onAction: (id: ToolId) => void;      // one-tap tools (Bookmark): do it and close the row
  children?: ReactNode;                // the controls of the tool that is on (colours, eraser, Share…)
};

export default function ToolRow({ lang, open, mode, onClose, onMode, onAction, children }: Props) {
  const [teach, setTeach] = useState<ToolId | null>(null);
  const [closing, setClosing] = useState(false);
  const [soon, setSoon] = useState<ToolId | null>(null);

  // the row slides back down before it goes
  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => { setClosing(false); setTeach(null); onClose(); }, 290);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mode) onMode(null);
      else if (open) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, open, close, onMode]);

  useEffect(() => {
    if (!soon) return;
    const id = window.setTimeout(() => setSoon(null), 2200);
    return () => window.clearTimeout(id);
  }, [soon]);

  const use = (id: ToolId) => {
    if (FINGER_TOOLS.includes(id)) { setTeach(null); onClose(); onMode(id); return; }
    if (id === "bookmark") { setTeach(null); onAction(id); close(); return; }
    // Turning and Landscape come in their own steps
    setSoon(id);
  };

  const pick = (id: ToolId) => {
    tick();
    if (!taught().includes(id)) { setTeach(id); return; }
    use(id);
  };

  const learnt = () => {
    if (!teach) return;
    markTaught(teach);
    const id = teach;
    setTeach(null);
    use(id);
  };

  /* a finger tool is on: its own bar, always on screen */
  if (mode) {
    const tool = TOOLS.find((x) => x.id === mode)!;
    return (
      <div className={s.bar} role="toolbar" aria-label={t(lang, tool.name)}>
        <span className={s.barName}>
          <span className={`${s.ic} ${s.icOn}`}>{tool.icon}</span>
          {/* on a phone the tool's own controls need the room, so only its icon shows */}
          <span className={s.barLabel}>{t(lang, tool.name)}</span>
        </span>
        <div className={s.barMid}>{children ?? <span className={s.note}>{t(lang, "soon")}</span>}</div>
        <button type="button" className={s.x} onClick={() => { tick(); onMode(null); }} aria-label={t(lang, "exitTool")}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" {...st} strokeWidth={1.8} /></svg>
        </button>
      </div>
    );
  }

  if (!open) return null;
  const help = teach ? TOOLS.find((x) => x.id === teach)! : null;

  return (
    <>
      <div className={s.scrim} onClick={close} aria-hidden="true" />

      {help && (
        <div className={s.teach} role="dialog" aria-label={t(lang, help.name)}>
          <div className={s.teachHead}>
            <span className={s.ic}>{help.icon}</span>
            <h3>{t(lang, help.name)}</h3>
          </div>
          <p>{t(lang, help.help)}</p>
          <button type="button" className={s.gotIt} onClick={learnt}>{t(lang, "gotIt")}</button>
        </div>
      )}

      {soon && !help && <p className={s.soon} role="status">{t(lang, TOOLS.find((x) => x.id === soon)!.name)} · {t(lang, "soon")}</p>}

      <nav className={`${s.row} ${closing ? s.closing : ""}`} aria-label={t(lang, "tools")}>
        {TOOLS.map((tool, i) => (
          <button
            key={tool.id}
            type="button"
            className={`${s.tool} ${teach === tool.id ? s.toolOn : ""}`}
            style={{ "--i": i } as React.CSSProperties}
            onClick={() => pick(tool.id)}
          >
            <span className={s.ic}>{tool.icon}</span>
            <span className={s.name}>{t(lang, tool.name)}</span>
          </button>
        ))}
        <button type="button" className={s.x} style={{ "--i": TOOLS.length } as React.CSSProperties} onClick={close} aria-label={t(lang, "closeTools")}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" {...st} strokeWidth={1.8} /></svg>
        </button>
      </nav>
    </>
  );
}
