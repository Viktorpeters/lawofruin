"use client";

/* The share picture editor. It slides up over the book with the picture on top, and under it
   everything the reader can change before sharing: the size (Square, Post, Story), the pencil
   colour, their name (or none), and whether the sentence before the line shows. Save keeps a
   PNG on the device; Share opens the phone's own share sheet (WhatsApp, Instagram…) with the
   picture and the reader's link.
   It makes two kinds of picture: a highlighted line, or a note (Margin, Reply or Page). */

import { useCallback, useEffect, useRef, useState } from "react";
import { COLOURS, type Colour, type Highlight } from "@/lib/book/highlights";
import type { Note } from "@/lib/book/notes";
import { t, type Lang } from "@/lib/i18n";
import { cardBlob, drawCard, drawNote, fontsReady, MARGIN_MAX, readHighlight, type CardSize, type CardText, type NoteOpts, type NoteStyle } from "./shareCard";
import s from "./share.module.css";

const NAME_KEY = "lor-share-name";
const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

/* the words a note picture needs, in the reader's language */
export function noteOpts(n: Note, lang: Lang, o: { size: CardSize; style: NoteStyle; name: string; before: boolean; link: string; brand: string }): NoteOpts {
  return {
    size: o.size,
    style: o.style,
    quote: n.quote,
    before: o.before ? n.before : "",
    head: n.head,
    page: n.page ? `p. ${n.page}` : "",
    text: n.text,
    date: new Date(n.ed ?? n.at).toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" }),
    signature: o.name ? t(lang, "noteBy").replace("{n}", o.name) : "",
    name: o.name,
    label: t(lang, "pageNoteLabel"),
    brand: o.brand,
    mission: t(lang, "mission"),
    url: o.link.replace(/^https?:\/\//, ""),
  };
}

export const defaultStyle = (n: Note): NoteStyle => (n.kind === "page" ? "page" : n.text.length > MARGIN_MAX ? "reply" : "margin");
export const savedName = (fallback: string) => get(NAME_KEY) ?? fallback;

/* Save as PNG straight from a note's options: the default picture, no editor */
export async function noteFile(n: Note, lang: Lang, name: string, link: string, brand: string): Promise<File | null> {
  await fontsReady();
  const c = document.createElement("canvas");
  drawNote(c, noteOpts(n, lang, { size: "post", style: defaultStyle(n), name, before: !!n.before, link, brand }));
  const blob = await cardBlob(c);
  return blob ? new File([blob], "laws-of-ruin-note.png", { type: "image/png" }) : null;
}

export function downloadFile(f: File) {
  const url = URL.createObjectURL(f);
  const a = document.createElement("a");
  a.href = url;
  a.download = f.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

type Props = {
  lang: Lang;
  highlight?: Highlight;
  note?: Note;
  defaultName: string;
  link: string;              // the reader's own link (with their Earn code when signed in)
  brand: string;
  onClose: () => void;
};

export default function ShareSheet({ lang, highlight, note: noteItem, defaultName, link, brand, onClose }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [text] = useState<CardText>(() =>
    highlight ? readHighlight(highlight) : { line: noteItem!.quote, before: noteItem!.before, head: noteItem!.head, page: noteItem!.page ? `p. ${noteItem!.page}` : "" });
  const [style, setStyle] = useState<NoteStyle>(() => (noteItem ? defaultStyle(noteItem) : "margin"));
  const [size, setSize] = useState<CardSize>("post");
  const [colour, setColour] = useState<Colour>(highlight?.c ?? "y");
  const [name, setName] = useState(() => get(NAME_KEY) ?? defaultName);
  const [signed, setSigned] = useState(true);
  const [before, setBefore] = useState(!!text.before);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => { fontsReady().then(() => setReady(true)); }, []);

  // redraw whenever a choice changes
  useEffect(() => {
    if (!ready || !canvas.current) return;
    if (noteItem) {
      drawNote(canvas.current, noteOpts(noteItem, lang, { size, style, name: signed ? name.trim() : "", before, link, brand }));
      return;
    }
    drawCard(canvas.current, {
      ...text,
      size,
      hex: COLOURS.find((c) => c.c === colour)!.hex,
      name: signed ? name.trim() : "",
      showBefore: before,
      brand,
      mission: t(lang, "mission"),
      url: link.replace(/^https?:\/\//, ""),
      markedBy: t(lang, "markedBy"),
    });
  }, [ready, text, size, colour, name, signed, before, brand, lang, link, noteItem, style]);

  useEffect(() => {
    if (!note) return;
    const id = window.setTimeout(() => setNote(null), 2200);
    return () => window.clearTimeout(id);
  }, [note]);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const file = async () => {
    if (!canvas.current) return null;
    const blob = await cardBlob(canvas.current);
    return blob ? new File([blob], "laws-of-ruin.png", { type: "image/png" }) : null;
  };

  const download = downloadFile;

  const save = async () => {
    setBusy(true);
    const f = await file();
    setBusy(false);
    if (!f) return;
    download(f);
    setNote(t(lang, "savedImg"));
  };

  const share = async () => {
    setBusy(true);
    const f = await file();
    setBusy(false);
    if (!f) return;
    const data = { files: [f], text: `${t(lang, "mission")} ${link}` };
    if (navigator.canShare?.(data)) {
      try { await navigator.share(data); } catch { /* the reader closed the share sheet */ }
    } else {
      // computers without a share sheet: keep the picture instead
      download(f);
      setNote(t(lang, "savedImg"));
    }
  };

  return (
    <div className={`${s.wrap} ${closing ? s.closing : ""}`} role="dialog" aria-label={t(lang, noteItem ? "shareNote" : "shareTitle")}>
      <div className={s.scrim} onClick={close} aria-hidden="true" />
      <section className={s.sheet}>
        <header className={s.head}>
          <h2>{t(lang, noteItem ? "shareNote" : "shareTitle")}</h2>
          <button type="button" className={s.x} onClick={close} aria-label={t(lang, "close")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>

        <div className={s.stage}>
          <canvas ref={canvas} className={`${s.preview} ${ready ? s.shown : ""}`} />
        </div>

        <div className={s.controls}>
          <div className={s.row}>
            <span className={s.label}>{t(lang, "size")}</span>
            <div className={s.seg} role="radiogroup" aria-label={t(lang, "size")}>
              {(["square", "post", "story"] as CardSize[]).map((z) => (
                <button key={z} type="button" role="radio" aria-checked={size === z} className={size === z ? s.segOn : ""} onClick={() => setSize(z)}>
                  <span className={`${s.shape} ${s[`shape_${z}`]}`} aria-hidden="true" />
                  {t(lang, z)}
                </button>
              ))}
            </div>
          </div>

          {noteItem?.kind === "line" && (
            <div className={s.row}>
              <span className={s.label}>{t(lang, "style")}</span>
              <div className={s.seg} role="radiogroup" aria-label={t(lang, "style")}>
                {(["margin", "reply"] as const).map((z) => (
                  <button key={z} type="button" role="radio" aria-checked={style === z} className={style === z ? s.segOn : ""} onClick={() => setStyle(z)}>
                    {t(lang, z)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!noteItem && (
          <div className={s.row}>
            <span className={s.label}>{t(lang, "colour")}</span>
            <div className={s.swatches} role="radiogroup" aria-label={t(lang, "colour")}>
              {COLOURS.map(({ c, hex }) => (
                <button key={c} type="button" role="radio" aria-checked={colour === c} className={`${s.swatch} ${colour === c ? s.swatchOn : ""}`} style={{ "--sw": hex } as React.CSSProperties} onClick={() => setColour(c)} />
              ))}
            </div>
          </div>
          )}

          <label className={s.row}>
            <span className={s.label}>{t(lang, "showName")}</span>
            <input type="checkbox" className={s.toggle} checked={signed} onChange={(e) => setSigned(e.target.checked)} />
          </label>
          {signed && (
            <input
              className={s.name}
              value={name}
              maxLength={28}
              placeholder={t(lang, "yourName")}
              aria-label={t(lang, "yourName")}
              onChange={(e) => { setName(e.target.value); set(NAME_KEY, e.target.value); }}
            />
          )}

          {text.before && (!noteItem || style === "margin") && (
            <label className={s.row}>
              <span className={s.label}>{t(lang, "showBefore")}</span>
              <input type="checkbox" className={s.toggle} checked={before} onChange={(e) => setBefore(e.target.checked)} />
            </label>
          )}
        </div>

        <footer className={s.actions}>
          <button type="button" className={s.action} onClick={save} disabled={busy || !ready}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" /></svg>
            {t(lang, "save")}
          </button>
          <button type="button" className={`${s.action} ${s.primary}`} onClick={share} disabled={busy || !ready}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5M6 12.5v7h12v-7" /></svg>
            {t(lang, "share")}
          </button>
        </footer>
        {note && <p className={s.note} role="status">{note}</p>}
      </section>
    </div>
  );
}
