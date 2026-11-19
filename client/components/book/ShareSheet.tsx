"use client";

/* The share picture editor. It slides up over the book with the picture on top, and under it
   everything the reader can change before sharing: the size (Square, Post, Story), the pencil
   colour, their name (or none), and whether the sentence before the line shows. Save keeps a
   PNG on the device; Share opens the phone's own share sheet (WhatsApp, Instagram…) with the
   picture and the reader's link. */

import { useCallback, useEffect, useRef, useState } from "react";
import { COLOURS, type Colour, type Highlight } from "@/lib/book/highlights";
import { t, type Lang } from "@/lib/i18n";
import { cardBlob, drawCard, fontsReady, readHighlight, type CardSize, type CardText } from "./shareCard";
import s from "./share.module.css";

const NAME_KEY = "lor-share-name";
const get = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

type Props = {
  lang: Lang;
  highlight: Highlight;
  defaultName: string;
  link: string;              // the reader's own link (with their Earn code when signed in)
  brand: string;
  onClose: () => void;
};

export default function ShareSheet({ lang, highlight, defaultName, link, brand, onClose }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [text] = useState<CardText>(() => readHighlight(highlight));
  const [size, setSize] = useState<CardSize>("post");
  const [colour, setColour] = useState<Colour>(highlight.c);
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
  }, [ready, text, size, colour, name, signed, before, brand, lang, link]);

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

  const download = (f: File) => {
    const url = URL.createObjectURL(f);
    const a = document.createElement("a");
    a.href = url;
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

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
    <div className={`${s.wrap} ${closing ? s.closing : ""}`} role="dialog" aria-label={t(lang, "shareTitle")}>
      <div className={s.scrim} onClick={close} aria-hidden="true" />
      <section className={s.sheet}>
        <header className={s.head}>
          <h2>{t(lang, "shareTitle")}</h2>
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

          <div className={s.row}>
            <span className={s.label}>{t(lang, "colour")}</span>
            <div className={s.swatches} role="radiogroup" aria-label={t(lang, "colour")}>
              {COLOURS.map(({ c, hex }) => (
                <button key={c} type="button" role="radio" aria-checked={colour === c} className={`${s.swatch} ${colour === c ? s.swatchOn : ""}`} style={{ "--sw": hex } as React.CSSProperties} onClick={() => setColour(c)} />
              ))}
            </div>
          </div>

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

          {text.before && (
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
