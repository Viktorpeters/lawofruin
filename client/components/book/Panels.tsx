"use client";

/* What each tray item, the Ask button and the profile icon open: a sheet from the bottom on
   phones, a side panel on wide screens. */

import { bookmarks, subscribe, remove as removeBookmark, type Bookmark } from "@/lib/book/bookmarks";
import { diary, subscribe as onNotes, type Note } from "@/lib/book/notes";
import { ICONS } from "./OptionsMenu";
import ns from "./notes.module.css";
import NotesPanel from "./NotesPanel";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PREFACE } from "@/lib/book/preface";
import { PARTS } from "@/lib/book/contents";
import { PEOPLE } from "@/lib/book/whoswho";
import type { ApiError, Me } from "@/lib/api";
import { useEarnStats, usePricing, usePurchases } from "@/lib/queries";
import { useAsk, useStartEmail, useVerifyEmail } from "@/lib/actions";
import type { Money } from "@/lib/services/referrals.service";
import { LANGS, t, type Key, type Lang } from "@/lib/i18n";
import type { TrayItemId } from "./trayItems";
import s from "./panels.module.css";

export type PanelId = TrayItemId | "account" | "ask" | "notes";

const TITLE: Record<PanelId, Key> = {
  contents: "contents", notes: "notes", whoswho: "whoswho", purchases: "purchases", earn: "earn", appearance: "appearance", account: "account", ask: "askTitle",
};

type Props = {
  id: PanelId;
  lang: Lang;
  me: Me | null;
  owner: boolean;
  section?: string;       // the page the reader is on, for Ask
  law?: number;           // the law sheet open, for Ask
  onClose: () => void;
  onOpen: (id: PanelId) => void;
  onJump: (sec: string) => void;
  onPlace: (a: { seq: number; tok: number }) => void;   // open a bookmarked page
  onNoteMenu: (n: Note, at: DOMRect) => void;            // the ⋮ options of a note in the diary
  onNoteOpen: (n: Note) => void;                         // open a note's page, with the whole note on it
  onShareMany: (notes: Note[]) => void;                  // a folder's "Share all as pictures"
  onNotice: (text: string) => void;
  onWho: (id: string) => void;
  onSignOut: () => void;
  onLang: (l: Lang) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  left: boolean;
  setLeft: (v: boolean) => void;
  onRestart: () => void;
  onGuide: () => void;
};

export default function Panel(props: Props) {
  const { id, onClose, lang } = props;
  // closing plays the slide-out first, then the panel is removed
  const [closing, setClosing] = useState(false);
  const close = () => {
    if (closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { onClose(); return; }
    setClosing(true);
    window.setTimeout(onClose, 210);
  };
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeRef.current(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const p = { ...props, onClose: close };

  return (
    <div className={`${s.wrap} ${closing ? s.closing : ""}`} onClick={close}>
      <section className={`${s.panel} ${id === "ask" ? s.askPanel : ""}`} role="dialog" aria-label={t(lang, TITLE[id])} onClick={(e) => e.stopPropagation()} data-panel={id}>
        <header className={s.head}>
          <h2 className={s.title}>{t(lang, TITLE[id])}</h2>
          <button type="button" className={s.close} onClick={close} aria-label={t(lang, "close")}>×</button>
        </header>
        <div className={s.body}>
          {id === "contents" && <ContentsList {...p} />}
          {id === "notes" && <NotesPanel lang={p.lang} onNoteMenu={p.onNoteMenu} onNoteOpen={p.onNoteOpen} onShareMany={p.onShareMany} onNotice={p.onNotice} />}
          {id === "whoswho" && <WhoList {...p} />}
          {id === "ask" && <Ask {...p} />}
          {id === "earn" && <Earn {...p} />}
          {id === "purchases" && <Purchases {...p} />}
          {id === "appearance" && <Appearance {...p} />}
          {id === "account" && <Account {...p} />}
        </div>
      </section>
    </div>
  );
}

/* ---------- Contents ---------- */

function ContentsList({ onJump, onPlace, onOpen, lang }: Props) {
  const [marks, setMarks] = useState<Bookmark[]>(() => bookmarks());
  useEffect(() => subscribe(() => setMarks(bookmarks())), []);
  const [notes, setNotes] = useState<Note[]>(() => diary());
  useEffect(() => onNotes(() => setNotes(diary())), []);
  const row = (sec: string, label: string, title: string) => (
    <button key={sec} type="button" className={s.row} onClick={() => onJump(sec)}>
      <span className={s.rowNum}>{label}</span>
      <span className={s.rowTitle}>{title}</span>
    </button>
  );
  return (
    <>
      {marks.length > 0 && (
        <>
          <div className={s.group}>{t(lang, "bookmarks")}</div>
          {marks.map((b) => (
            <div key={b.id} className={s.bmRow}>
              <button type="button" className={s.row} onClick={() => onPlace(b.a)}>
                <span className={s.bmFold} aria-hidden="true" />
                <span className={s.rowTitle}>{b.head || t(lang, "theBook")}</span>
                {b.page && <span className={s.rowMeta}>p. {b.page}</span>}
              </button>
              <button type="button" className={s.bmX} onClick={() => removeBookmark(b.id)} aria-label={t(lang, "removeBm")}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>
              </button>
            </div>
          ))}
        </>
      )}
      {notes.length > 0 && (
        <>
          {/* the notes diary has its own place, with folders */}
          <div className={s.group}>{t(lang, "notes")}</div>
          <button type="button" className={s.row} onClick={() => onOpen("notes")}>
            <span className={ns.notesRowIcon} aria-hidden="true">{ICONS.edit}</span>
            <span className={s.rowTitle}>{t(lang, "allNotes")}</span>
            <span className={s.rowMeta}>{notes.length} ›</span>
          </button>
        </>
      )}
      <div className={s.group}>{t(lang, "openingPages")}</div>
      {row("cover", "", t(lang, "cover"))}
      {row("title", "", t(lang, "titlePage"))}
      {row("dedication", "", t(lang, "dedication"))}
      {row("epigraph", "", t(lang, "epigraph"))}
      <div className={s.group}>{t(lang, "prefaceGroup")}</div>
      {PREFACE.map((sec) => row(sec.id, sec.num, sec.title))}
      <div className={s.group}>{t(lang, "beforeLaws")}</div>
      {row("which", "", t(lang, "which"))}
      {row("contents", "", t(lang, "thirtyLaws"))}
      <div className={s.group}>{t(lang, "investigation")}</div>
      {PARTS.map((p) => (
        <button key={p.n} type="button" className={s.row} onClick={() => onJump(`part-${p.n}`)}>
          <span className={s.rowNum}>{t(lang, "part")} {p.n}</span>
          <span className={s.rowTitle}>{p.title}</span>
          {!p.open && <span className={s.rowLock}>{p.opens}</span>}
        </button>
      ))}
    </>
  );
}

/* ---------- Who's Who ----------
   The search and the scroll position outlive the panel, so closing a card brings the reader
   back to the same name in the same list. */

let whoQuery = "";
let whoScroll = 0;

function WhoList({ onWho, lang }: Props) {
  const [q, setQ] = useState(whoQuery);
  const top = useRef<HTMLDivElement>(null);
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...PEOPLE]
      .filter((p) => !needle || p.name.toLowerCase().includes(needle) || (p.known ?? "").toLowerCase().includes(needle) || p.role.toLowerCase().includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [q]);

  // the panel is the scrolling box: put it back where it was, and remember where it goes
  useLayoutEffect(() => {
    const box = top.current?.closest("section");
    if (!box) return;
    box.scrollTop = whoScroll;
    const onScroll = () => { whoScroll = box.scrollTop; };
    box.addEventListener("scroll", onScroll, { passive: true });
    return () => box.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={top}>
      <input
        className={s.search}
        type="search"
        placeholder={t(lang, "findName")}
        value={q}
        onChange={(e) => { whoQuery = e.target.value; whoScroll = 0; setQ(e.target.value); }}
        aria-label={t(lang, "findName")}
      />
      <p className={s.count}>{t(lang, "files", { n: list.length })}</p>
      {list.map((p) => (
        <button key={p.id} type="button" className={s.row} onClick={() => onWho(p.id)}>
          <span className={s.rowTitle}>{p.name}</span>
          <span className={s.rowMeta}>{p.dates ?? ""}</span>
          <span className={s.rowRole}>{p.role}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Ask ----------
   The conversation outlives the panel, so closing and reopening keeps it. */

type Msg = { role: "user" | "assistant"; text: string };
let askLog: Msg[] = [];

function Ask({ lang, me, owner, section, law, onOpen }: Props) {
  const [log, setLog] = useState<Msg[]>(askLog);
  const [q, setQ] = useState("");
  const [left, setLeft] = useState<number | null>(null);
  const ask = useAsk();
  const busy = ask.isPending;
  const err = ask.error ? (ask.error as ApiError).message : "";
  const box = useRef<HTMLDivElement>(null);

  // the messages scroll inside their own box; keep the newest one in view
  useEffect(() => {
    askLog = log;
    const el = box.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [log, busy]);

  if (!me) {
    return (
      <>
        <p className={s.text}>{t(lang, "askMember")}</p>
        <button type="button" className={s.line} onClick={() => onOpen("account")}>{t(lang, "signInToAsk")}</button>
      </>
    );
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = q.trim();
    if (question.length < 2 || busy) return;
    const history = log.slice(-6);
    setLog((l) => [...l, { role: "user", text: question }]);
    setQ("");
    ask.mutate(
      { question, lang, history, section, law },
      { onSuccess: (r) => { setLog((l) => [...l, { role: "assistant", text: r.answer }]); if (r.mode === "owner") setLeft(r.left); } },
    );
  };

  return (
    <>
      <p className={s.small}>{t(lang, owner ? "askOwner" : "askMember")}</p>
      <div className={s.chat} ref={box}>
        {log.map((m, i) => (
          <p key={i} className={m.role === "user" ? s.qMsg : s.aMsg}>{m.text}</p>
        ))}
        {busy && (
          <div className={s.thinking} role="status" aria-label={t(lang, "thinking")}>
            <span /><span /><span />
          </div>
        )}
        {err && <p className={s.error}>{err}</p>}
        {left !== null && !busy && <p className={s.pending}>{t(lang, "askLeft", { n: Math.max(0, left) })}</p>}
      </div>
      <form className={s.askForm} onSubmit={send}>
        <input className={s.search} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, "askPh")} aria-label={t(lang, "askPh")} maxLength={600} />
        <button type="submit" className={s.send} disabled={busy || q.trim().length < 2}>{t(lang, "send")}</button>
      </form>
    </>
  );
}

/* ---------- Earn ---------- */

const money = (m: Money) =>
  m.length ? m.map((x) => (x.currency === "NGN" ? `₦${(x.amount / 100).toLocaleString("en-NG")}` : `$${(x.amount / 100).toFixed(2).replace(/\.00$/, "")}`)).join(" · ") : "0";

function Earn({ lang, me, onOpen }: Props) {
  const q = useEarnStats(!!me);
  const stats = q.data ?? null;
  const err = q.error ? (q.error as ApiError).message : "";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const tm = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(tm);
  }, [copied]);

  if (!me) {
    return (
      <>
        <p className={s.text}>{t(lang, "earnLead")}</p>
        <button type="button" className={s.line} onClick={() => onOpen("account")}>{t(lang, "signInToEarn")}</button>
      </>
    );
  }

  const copy = async () => {
    if (!stats) return;
    try { await navigator.clipboard.writeText(stats.link); } catch {
      // older browsers: select the text so the reader can copy it by hand
      const el = document.getElementById("lor-link");
      if (el) { const r = document.createRange(); r.selectNodeContents(el); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); }
    }
    setCopied(true);
  };

  return (
    <>
      <p className={s.text}>{t(lang, "earnLead")}</p>

      <div className={s.group}>{t(lang, "yourLink")}</div>
      <div className={s.linkRow}>
        <span id="lor-link" className={s.link}>{stats ? stats.link.replace(/^https?:\/\//, "") : "…"}</span>
        <span className={`${s.copied} ${copied ? s.copiedOn : ""}`} aria-live="polite">{copied ? t(lang, "copied") : ""}</span>
        <button type="button" className={s.copy} onClick={copy} aria-label={t(lang, "copy")} disabled={!stats}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.5" y="8.5" width="11" height="11" /><path d="M15.5 8.5V4.5h-11v11h4" /></svg>
        </button>
      </div>

      <div className={s.stats}>
        <div><b>{stats?.clicks ?? "–"}</b><span>{t(lang, "clicks")}</span></div>
        <div><b>{stats?.paid ?? "–"}</b><span>{t(lang, "paid")}</span></div>
        <div><b>{stats ? money(stats.available) : "–"}</b><span>{t(lang, "earned")}</span></div>
      </div>
      {stats && stats.pending.length > 0 && <p className={s.pending}>{t(lang, "pending", { x: money(stats.pending) })}</p>}
      {err && <p className={s.error}>{err}</p>}

      <p className={s.small}>{t(lang, "earnRules")}</p>
    </>
  );
}

/* ---------- Purchases ---------- */

function Purchases({ lang, me, onOpen }: Props) {
  // the server decides the currency from where the reader is; the app only shows it
  const items = usePurchases().data;
  const price = usePricing().data;

  return (
    <>
      {(items ?? []).map((it) => (
        <div key={it.n} className={s.item}>
          <div className={s.itemHead}>
            <span className={s.rowTitle}>{it.title}</span>
            {it.owned && <span className={s.owned}>{t(lang, "owned")}</span>}
          </div>
          {!it.owned && price && (
            <>
              <p className={s.price}>{price.display}</p>
              {price.phase !== "standard" && <p className={s.small}>{t(lang, "thenPrice", { price: price.standard })}</p>}
              <p className={s.small}>{t(lang, "includes")}</p>
              {me ? (
                <button type="button" className={s.line} disabled>{t(lang, "checkoutSoon")}</button>
              ) : (
                <button type="button" className={s.line} onClick={() => onOpen("account")}>{t(lang, "signInToBuy")}</button>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
}

/* ---------- Appearance ---------- */

function Appearance({ lang, onLang, fontSize, setFontSize, left, setLeft, onRestart, onGuide }: Props) {
  const sizes = [
    { v: 14, label: t(lang, "standard") },
    { v: 15.5, label: t(lang, "larger") },
    { v: 17, label: t(lang, "largest") },
  ];
  return (
    <>
      <div className={s.group}>{t(lang, "textSize")}</div>
      <div className={s.seg}>
        {sizes.map((z) => (
          <button key={z.v} type="button" aria-pressed={fontSize === z.v} onClick={() => setFontSize(z.v)} style={{ fontSize: `${z.v}px` }}>{z.label}</button>
        ))}
      </div>
      <div className={s.group}>{t(lang, "language")}</div>
      <div className={s.langs}>
        {LANGS.map((l) => (
          <button key={l.code} type="button" aria-pressed={lang === l.code} onClick={() => onLang(l.code)}>{l.name}</button>
        ))}
      </div>
      <div className={s.group}>{t(lang, "menuButton")}</div>
      <div className={s.seg}>
        <button type="button" aria-pressed={!left} onClick={() => setLeft(false)}>{t(lang, "rightHand")}</button>
        <button type="button" aria-pressed={left} onClick={() => setLeft(true)}>{t(lang, "leftHand")}</button>
      </div>
      <div className={s.group}>{t(lang, "theBook")}</div>
      <button type="button" className={s.line} onClick={onGuide}>{t(lang, "showTurn")}</button>
      <button type="button" className={s.line} onClick={onRestart}>{t(lang, "fromCover")}</button>
    </>
  );
}

/* ---------- Account ---------- */

function Account({ lang, me, onSignOut, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const startEmail = useStartEmail();
  const verifyEmail = useVerifyEmail();
  const busy = startEmail.isPending || verifyEmail.isPending;
  const failed = (startEmail.error ?? verifyEmail.error) as ApiError | null;
  const err = failed?.message ?? "";

  const start = (e: React.FormEvent) => {
    e.preventDefault();
    verifyEmail.reset();
    startEmail.mutate({ email, lang }, { onSuccess: () => setSent(true) });
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    startEmail.reset();
    // on success the reader appears everywhere at once, and the panel slides back down
    verifyEmail.mutate({ email, code, lang }, { onSuccess: () => onClose() });
  };

  return (
    <>
      {me ? (
        <>
          <div className={s.group}>{t(lang, "signedInAs")}</div>
          <p className={s.text}>{me.email}</p>
          <button type="button" className={s.line} onClick={onSignOut}>{t(lang, "signOut")}</button>
        </>
      ) : (
        <>
          <p className={s.text}>{t(lang, "signInLead")}</p>
          {!sent ? (
            <form onSubmit={start}>
              <input className={s.search} type="email" autoComplete="email" required placeholder={t(lang, "emailPh")} value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className={s.line} disabled={busy || !email} aria-busy={startEmail.isPending}>
                {startEmail.isPending ? <><span>{t(lang, "sending")}</span><span className={s.spin} aria-hidden="true" /></> : t(lang, "sendCode")}
              </button>
            </form>
          ) : (
            <form onSubmit={verify}>
              <p className={s.small}>{t(lang, "codeSent", { email })}</p>
              <input
                className={`${s.search} ${s.code}`}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={7}
                placeholder={t(lang, "codePh")}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^\d ]/g, ""))}
                autoFocus
              />
              <button type="submit" className={s.line} disabled={busy || code.replace(/\s/g, "").length !== 6} aria-busy={verifyEmail.isPending}>
                {verifyEmail.isPending ? <><span>{t(lang, "signingIn")}</span><span className={s.spin} aria-hidden="true" /></> : t(lang, "signIn")}
              </button>
              <button type="button" className={s.switch} onClick={() => { setSent(false); setCode(""); startEmail.reset(); verifyEmail.reset(); }}>{t(lang, "changeEmail")}</button>
            </form>
          )}
          {err && <p className={s.error}>{err}</p>}
        </>
      )}
      <div className={s.group}>{t(lang, "about")}</div>
      <p className={s.small}>{t(lang, "aboutText")}</p>
      <div className={s.group}>{t(lang, "licence")}</div>
      <p className={s.small}>{t(lang, "licenceText")}</p>
    </>
  );
}
