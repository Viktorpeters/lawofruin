"use client";

/* What each tray item (and the profile icon) opens: a sheet from the bottom on phones,
   a side panel on wide screens. */

import { useEffect, useMemo, useState } from "react";
import { PREFACE } from "@/lib/book/preface";
import { PARTS } from "@/lib/book/content";
import { PEOPLE } from "@/lib/book/whoswho";
import type { TrayItemId } from "./trayItems";
import s from "./panels.module.css";

export type PanelId = TrayItemId | "account";

const TITLES: Record<PanelId, string> = {
  contents: "Contents",
  whoswho: "Who's Who",
  ask: "Ask the book",
  earn: "Get paid while reading",
  settings: "Settings",
  account: "Your account",
};

type Props = {
  id: PanelId;
  onClose: () => void;
  onJump: (sec: string) => void;
  onWho: (id: string) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  left: boolean;
  setLeft: (v: boolean) => void;
  onRestart: () => void;
  onGuide: () => void;
};

export default function Panel(props: Props) {
  const { id, onClose } = props;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={s.wrap} onClick={onClose}>
      <section className={s.panel} role="dialog" aria-label={TITLES[id]} onClick={(e) => e.stopPropagation()}>
        <header className={s.head}>
          <h2 className={s.title}>{TITLES[id]}</h2>
          <button type="button" className={s.close} onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className={s.body}>
          {id === "contents" && <ContentsList {...props} />}
          {id === "whoswho" && <WhoList {...props} />}
          {id === "ask" && <Ask />}
          {id === "earn" && <Earn />}
          {id === "settings" && <Settings {...props} />}
          {id === "account" && <Account />}
        </div>
      </section>
    </div>
  );
}

function ContentsList({ onJump }: Props) {
  const row = (sec: string, label: string, title: string) => (
    <button key={sec} type="button" className={s.row} onClick={() => onJump(sec)}>
      <span className={s.rowNum}>{label}</span>
      <span className={s.rowTitle}>{title}</span>
    </button>
  );
  return (
    <>
      <div className={s.group}>Opening pages</div>
      {row("cover", "", "The cover")}
      {row("title", "", "Title page")}
      {row("dedication", "", "Dedication")}
      {row("epigraph", "", "Epigraph")}
      <div className={s.group}>Preface · The Cycle</div>
      {PREFACE.map((sec) => row(sec.id, sec.num, sec.title))}
      <div className={s.group}>Before the laws</div>
      {row("which", "", "Which are you?")}
      {row("contents", "", "The thirty laws")}
      <div className={s.group}>Investigation I</div>
      {PARTS.map((p) => (
        <button key={p.n} type="button" className={s.row} onClick={() => onJump("contents")}>
          <span className={s.rowNum}>Part {p.n}</span>
          <span className={s.rowTitle}>{p.title}</span>
          <span className={s.rowLock}>{p.opens}</span>
        </button>
      ))}
    </>
  );
}

function WhoList({ onWho }: Props) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...PEOPLE]
      .filter((p) => !needle || p.name.toLowerCase().includes(needle) || (p.known ?? "").toLowerCase().includes(needle) || p.role.toLowerCase().includes(needle))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [q]);
  return (
    <>
      <input className={s.search} type="search" placeholder="Find a name" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a name" />
      <p className={s.count}>{list.length} files · all readable offline</p>
      {list.map((p) => (
        <button key={p.id} type="button" className={s.row} onClick={() => onWho(p.id)}>
          <span className={s.rowTitle}>{p.name}</span>
          <span className={s.rowMeta}>{p.dates ?? ""}</span>
          <span className={s.rowRole}>{p.role}</span>
        </button>
      ))}
    </>
  );
}

function Ask() {
  return (
    <>
      <p className={s.text}>Soon you will be able to ask the book anything: why it was written, what a law means, what happened next to any figure in it.</p>
      <p className={s.text}>Every answer will come from the book itself, and will show you the page it came from.</p>
      <p className={s.soon}>Opens with early bird sales, 10 November</p>
    </>
  );
}

function Earn() {
  return (
    <>
      <p className={s.text}>Every reader gets their own link. When someone buys the book through your link, you earn $2.</p>
      <p className={s.text}>You will see everyone who joined through you, and what you have earned, right here.</p>
      <p className={s.soon}>Opens with early bird sales, 10 November</p>
    </>
  );
}

function Settings({ fontSize, setFontSize, left, setLeft, onRestart, onGuide }: Props) {
  const sizes = [
    { v: 15, label: "Smaller" },
    { v: 16, label: "Standard" },
    { v: 17.5, label: "Larger" },
  ];
  return (
    <>
      <div className={s.group}>Text size</div>
      <div className={s.seg}>
        {sizes.map((z) => (
          <button key={z.v} type="button" aria-pressed={fontSize === z.v} onClick={() => setFontSize(z.v)} style={{ fontSize: `${z.v - 1}px` }}>{z.label}</button>
        ))}
      </div>
      <div className={s.group}>Menu button</div>
      <div className={s.seg}>
        <button type="button" aria-pressed={!left} onClick={() => setLeft(false)}>Right hand</button>
        <button type="button" aria-pressed={left} onClick={() => setLeft(true)}>Left hand</button>
      </div>
      <div className={s.group}>The book</div>
      <button type="button" className={s.line} onClick={onGuide}>Show how to turn the pages</button>
      <button type="button" className={s.line} onClick={onRestart}>Read from the cover again</button>
    </>
  );
}

function Account() {
  return (
    <>
      <p className={s.text}>Sign in to buy the book, keep your place on every device and get your own referral link.</p>
      <button type="button" className={s.line} disabled>Continue with Google</button>
      <p className={s.soon}>Sign-in opens with early bird sales, 10 November</p>
      <div className={s.group}>About</div>
      <p className={s.text}>The Laws of Ruin is researched, written and published by the Publications Team of Orion Learning Innovations, an edtech company in Lagos, Nigeria.</p>
      <div className={s.group}>Licence</div>
      <p className={s.small}>© 2026 Orion Learning Innovations. All rights reserved. This book is licensed for reading inside this app, to the account that bought it.</p>
    </>
  );
}
