"use client";

/* The notes diary, organised like a desktop.
   - Folders: a grid of folder icons. "All notes" first, then the reader's own folders, each with
     its count; with "Sort by day" on, a folder for every day the reader wrote, made on its own;
     last, a "New folder" tile.
   - Inside a folder: its notes, newest first, each with ⋮ (Move to folder is one of the options).
     The view slides in from the right like a phone screen, and back out with the back arrow.
   - In All notes a strip of the folders sits on top: hold a note, and it lifts under the finger;
     drag it onto a folder (the folder opens a little as it passes over), and let go to move it.
   - A folder has its own ⋮: Rename, Share all as pictures, Delete (its notes go back to All notes). */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { t, type Lang } from "@/lib/i18n";
import { addFolder, dayOf, diary, folders, moveNote, removeFolder, renameFolder, subscribe, type Folder, type Note } from "@/lib/book/notes";
import OptionsMenu, { ICONS, type MenuItem } from "./OptionsMenu";
import ns from "./notes.module.css";
import fs from "./folders.module.css";

const SORT_KEY = "lor-notes-byday";
const ALL = "all";

type Props = {
  lang: Lang;
  onNoteMenu: (n: Note, at: DOMRect) => void;
  onNoteOpen: (n: Note) => void;
  onShareMany: (notes: Note[]) => void;
  onNotice: (text: string) => void;
};

/* a folder, drawn like a desktop folder: a back with a tab, papers, and a front that tips open */
function FolderIcon({ open, tone = "plain" }: { open?: boolean; tone?: "plain" | "all" | "day" | "new" }) {
  return (
    <span className={`${fs.icon} ${open ? fs.iconOpen : ""} ${fs[tone]}`} aria-hidden="true">
      <span className={fs.back} />
      {tone !== "new" && <span className={fs.paper} />}
      <span className={fs.front}>{tone === "new" && <span className={fs.plus}>+</span>}</span>
    </span>
  );
}

/* the small card that asks for a folder's name (New folder, Rename) */
export function NamePrompt({ lang, title, start, onDone, onCancel }: { lang: Lang; title: string; start: string; onDone: (name: string) => void; onCancel: () => void }) {
  const [v, setV] = useState(start);
  const box = useRef<HTMLInputElement>(null);
  useEffect(() => { window.setTimeout(() => box.current?.focus(), 200); }, []);
  return createPortal(
    <>
      <div className={ns.menuDim} onClick={onCancel} aria-hidden="true" />
      <form
        className={fs.prompt}
        onSubmit={(e) => { e.preventDefault(); if (v.trim()) onDone(v.trim()); }}
        role="dialog"
        aria-label={title}
      >
        <h3>{title}</h3>
        <input ref={box} value={v} maxLength={40} placeholder={t(lang, "folderName")} aria-label={t(lang, "folderName")} onChange={(e) => setV(e.target.value)} />
        <div className={ns.acts}>
          <button type="button" className={ns.dim} onClick={onCancel}>{t(lang, "cancel")}</button>
          <button type="submit" disabled={!v.trim()}>{title === t(lang, "rename") ? t(lang, "saveNote") : t(lang, "create")}</button>
        </div>
      </form>
    </>,
    document.body,
  );
}

export default function NotesPanel({ lang, onNoteMenu, onNoteOpen, onShareMany, onNotice }: Props) {
  const [all, setAll] = useState<Note[]>(() => diary());
  const [dirs, setDirs] = useState<Folder[]>(() => folders());
  const [byDay, setByDay] = useState(() => { try { return localStorage.getItem(SORT_KEY) === "1"; } catch { return false; } });
  const [at, setAt] = useState<string | null>(null);           // the folder open, or null for the grid
  const [leaving, setLeaving] = useState(false);
  const [prompt, setPrompt] = useState<{ kind: "new" | "rename"; id?: string } | null>(null);
  const [menu, setMenu] = useState<{ at: DOMRect; id: string } | null>(null);
  const [drag, setDrag] = useState<{ note: Note; x: number; y: number; over: string | null } | null>(null);
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => subscribe(() => { setAll(diary()); setDirs(folders()); }), []);

  const day = (key: string) => new Date(`${key}T12:00:00`).toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "short" });
  const days = useMemo(() => [...new Set(all.map(dayOf))], [all]);
  const count = (n: number) => (n === 1 ? t(lang, "oneNote") : t(lang, "noteCount").replace("{n}", String(n)));

  const inFolder = (id: string): Note[] =>
    id === ALL ? all : id.startsWith("day:") ? all.filter((n) => dayOf(n) === id.slice(4)) : all.filter((n) => n.folder === id);
  const nameOf = (id: string) =>
    id === ALL ? t(lang, "allNotes") : id.startsWith("day:") ? day(id.slice(4)) : dirs.find((f) => f.id === id)?.name ?? "";

  const toggleDay = () => {
    const v = !byDay;
    setByDay(v);
    try { localStorage.setItem(SORT_KEY, v ? "1" : "0"); } catch { /* private mode */ }
  };

  const back = () => {
    setLeaving(true);
    window.setTimeout(() => { setAt(null); setLeaving(false); }, 260);
  };

  /* ---------- hold and drag a note onto a folder ---------- */
  const hold = useRef<{ timer: number; x: number; y: number; note: Note } | null>(null);
  const folderUnder = (x: number, y: number): string | null => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-drop]");
    return el?.dataset.drop ?? null;
  };
  const press = (e: React.PointerEvent, note: Note) => {
    if (!e.isPrimary || !dirs.length) return;
    const x = e.clientX, y = e.clientY;
    hold.current = {
      x, y, note,
      timer: window.setTimeout(() => {
        try { navigator.vibrate?.(12); } catch { /* not supported */ }
        setDrag({ note, x, y, over: null });
      }, 380),
    };
  };
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const h = hold.current;
      if (h && !drag && Math.hypot(e.clientX - h.x, e.clientY - h.y) > 8) { window.clearTimeout(h.timer); hold.current = null; }
      if (!drag) return;
      e.preventDefault();
      const over = folderUnder(e.clientX, e.clientY);
      if (over !== drag.over) { try { navigator.vibrate?.(over ? 6 : 0); } catch { /* not supported */ } }
      setDrag({ ...drag, x: e.clientX, y: e.clientY, over });
    };
    const up = () => {
      if (hold.current) { window.clearTimeout(hold.current.timer); hold.current = null; }
      if (!drag) return;
      if (drag.over) {
        const target = drag.over === "none" ? null : drag.over;
        moveNote(drag.note.id, target);
        onNotice(t(lang, "movedTo").replace("{f}", target ? dirs.find((f) => f.id === target)?.name ?? "" : t(lang, "noFolder")));
      }
      setDrag(null);
    };
    // while a note is held, the finger drags it; the list must not scroll underneath
    const still = (e: TouchEvent) => { if (drag) e.preventDefault(); };
    window.addEventListener("touchmove", still, { passive: false });
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("touchmove", still);
    };
  }, [drag, dirs, lang, onNotice]);

  const folderMenu = (id: string): MenuItem[] => [
    { icon: ICONS.edit, label: t(lang, "rename"), onPick: () => setPrompt({ kind: "rename", id }) },
    { icon: ICONS.share, label: t(lang, "shareAll"), onPick: () => onShareMany(inFolder(id)) },
    { icon: ICONS.del, label: t(lang, "deleteFolder"), danger: true, confirm: t(lang, "delSure"), onPick: () => {
      removeFolder(id);
      if (at === id) back();
      onNotice(t(lang, "folderDeleted"));
    } },
  ];

  const entry = (n: Note, i: number, draggable: boolean) => (
    <div
      key={n.id}
      className={`${ns.entry} ${drag?.note.id === n.id ? fs.lifted : ""}`}
      style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}
      role="button"
      tabIndex={0}
      onPointerDown={draggable ? (e) => press(e, n) : undefined}
      onClick={() => { if (!drag) onNoteOpen(n); }}
      onKeyDown={(e) => { if (e.key === "Enter") onNoteOpen(n); }}
    >
      <div className={ns.entryHead}>
        <span>{n.kind === "page" ? `${t(lang, "pageNote")} · ` : ""}{n.head}{n.page ? ` · p. ${n.page}` : ""}</span>
        <span>{new Date(n.ed ?? n.at).toLocaleDateString(lang, { day: "numeric", month: "short" })}</span>
      </div>
      {n.quote && <p className={ns.entryQuote}>{n.quote}</p>}
      <p className={ns.entryBody}>{n.text}</p>
      <button type="button" className={ns.dots} aria-label={t(lang, "options")} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onNoteMenu(n, e.currentTarget.getBoundingClientRect()); }}>
        {ICONS.dots}
      </button>
    </div>
  );

  /* ---------- the grid of folders ---------- */
  if (at === null) {
    return (
      <div className={fs.grid_wrap}>
        <label className={fs.sort}>
          <span>{t(lang, "sortByDay")}</span>
          <input type="checkbox" className={fs.toggle} checked={byDay} onChange={toggleDay} />
        </label>
        <div className={fs.grid}>
          <button type="button" className={fs.tile} style={{ "--i": 0 } as React.CSSProperties} onClick={() => setAt(ALL)}>
            <FolderIcon tone="all" />
            <span className={fs.name}>{t(lang, "allNotes")}</span>
            <span className={fs.count}>{count(all.length)}</span>
          </button>
          {byDay && days.map((d, i) => (
            <button key={d} type="button" className={fs.tile} style={{ "--i": i + 1 } as React.CSSProperties} onClick={() => setAt(`day:${d}`)}>
              <FolderIcon tone="day" />
              <span className={fs.name}>{day(d)}</span>
              <span className={fs.count}>{count(inFolder(`day:${d}`).length)}</span>
            </button>
          ))}
          {dirs.map((f, i) => (
            <div key={f.id} className={fs.tileWrap} style={{ "--i": i + 1 + (byDay ? days.length : 0) } as React.CSSProperties}>
              <button type="button" className={fs.tile} onClick={() => setAt(f.id)}>
                <FolderIcon />
                <span className={fs.name}>{f.name}</span>
                <span className={fs.count}>{count(inFolder(f.id).length)}</span>
              </button>
              <button type="button" className={fs.tileDots} aria-label={t(lang, "options")} onClick={(e) => setMenu({ at: e.currentTarget.getBoundingClientRect(), id: f.id })}>
                {ICONS.dots}
              </button>
            </div>
          ))}
          <button type="button" className={fs.tile} style={{ "--i": dirs.length + 1 + (byDay ? days.length : 0) } as React.CSSProperties} onClick={() => setPrompt({ kind: "new" })}>
            <FolderIcon tone="new" />
            <span className={fs.name}>{t(lang, "newFolder")}</span>
          </button>
        </div>

        {prompt && (
          <NamePrompt
            lang={lang}
            title={t(lang, prompt.kind === "new" ? "newFolder" : "rename")}
            start={prompt.kind === "rename" ? dirs.find((f) => f.id === prompt.id)?.name ?? "" : ""}
            onCancel={() => setPrompt(null)}
            onDone={(name) => { if (prompt.kind === "new") addFolder(name); else if (prompt.id) renameFolder(prompt.id, name); setPrompt(null); }}
          />
        )}
        {menu && <OptionsMenu anchor={menu.at} items={folderMenu(menu.id)} onClose={() => setMenu(null)} />}
      </div>
    );
  }

  /* ---------- inside a folder ---------- */
  const list = inFolder(at);
  const own = dirs.some((f) => f.id === at);
  return (
    <div className={`${fs.inside} ${leaving ? fs.insideOut : ""}`}>
      <div className={fs.bar}>
        <button type="button" className={fs.backBtn} onClick={back}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          {t(lang, "folders")}
        </button>
        <span className={fs.here}>
          <FolderIcon tone={at === ALL ? "all" : at.startsWith("day:") ? "day" : "plain"} open />
          {nameOf(at)}
        </span>
        {own ? (
          <button type="button" className={ns.dots} aria-label={t(lang, "options")} onClick={(e) => setMenu({ at: e.currentTarget.getBoundingClientRect(), id: at })}>
            {ICONS.dots}
          </button>
        ) : <span className={fs.spacer} />}
      </div>

      {/* in All notes: the folders as drop targets, for hold and drag */}
      {at === ALL && dirs.length > 0 && (
        <>
          <div ref={strip} className={`${fs.strip} ${drag ? fs.stripLive : ""}`}>
            <div className={`${fs.chip} ${drag?.over === "none" ? fs.chipOver : ""}`} data-drop="none">
              <FolderIcon tone="all" open={drag?.over === "none"} />
              <span>{t(lang, "noFolder")}</span>
            </div>
            {dirs.map((f) => (
              <div key={f.id} className={`${fs.chip} ${drag?.over === f.id ? fs.chipOver : ""}`} data-drop={f.id}>
                <FolderIcon open={drag?.over === f.id} />
                <span>{f.name}</span>
              </div>
            ))}
          </div>
          <p className={fs.hint}>{t(lang, "dragHint")}</p>
        </>
      )}

      {list.length === 0 ? <p className={fs.empty}>{t(lang, "folderEmpty")}</p> : list.map((n, i) => entry(n, i, at === ALL))}

      {drag && createPortal(
        <div className={fs.ghost} style={{ left: drag.x, top: drag.y }} aria-hidden="true">
          <span className={fs.ghostHead}>{drag.note.head}</span>
          <span className={fs.ghostBody}>{drag.note.text}</span>
        </div>,
        document.body,
      )}
      {prompt && (
        <NamePrompt
          lang={lang}
          title={t(lang, "rename")}
          start={dirs.find((f) => f.id === prompt.id)?.name ?? ""}
          onCancel={() => setPrompt(null)}
          onDone={(name) => { if (prompt.id) renameFolder(prompt.id, name); setPrompt(null); }}
        />
      )}
      {menu && <OptionsMenu anchor={menu.at} items={folderMenu(menu.id)} onClose={() => setMenu(null)} />}
    </div>
  );
}
