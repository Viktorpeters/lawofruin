"use client";

/* What opens when the home-screen icon is tapped.
   First open: the splash (the hourglass turns, then flies onto the cover), then the cover,
   which the reader swings open into the book.
   Every open after that: straight to the page they stopped on. No splash, no cover.
   The words come from the server, in the reader's language, and only what this reader may read.
   Over the book: the language button and the profile icon top right; Ask and the tray bottom right. */

import { useCallback, useEffect, useRef, useState } from "react";
import Book, { type BookHandle, type PageInfo } from "./Book";
import Splash from "./Splash";
import Tray from "./Tray";
import ToolRow, { type ToolId } from "./ToolRow";
import HighlightBar from "./HighlightBar";
import ShareSheet, { downloadFile, highlightFile, noteFile, savedName } from "./ShareSheet";
import NoteCard, { type Draft } from "./NoteCard";
import OptionsMenu, { ICONS } from "./OptionsMenu";
import { useNoter, underline, type Picked } from "./useNoter";
import { addFolder, addNote, folders, moveNote, noteById, removeNote, setNotesLang, subscribe as onNotes, updateNote, type Note } from "@/lib/book/notes";
import { NamePrompt } from "./NotesPanel";
import nstyles from "./notes.module.css";
import { subscribe as onBookmarks, toggle as toggleBookmark } from "@/lib/book/bookmarks";
import { useHighlighter } from "./useHighlighter";
import { COLOURS, flash, highlights, recolour, removeHighlight, subscribe, setHighlightLang, type Colour, type Highlight } from "@/lib/book/highlights";
import hs from "./highlights.module.css";
import ts from "./tools.module.css";
import Panel, { type PanelId } from "./Panels";
import { WhoCard, WordCard } from "./Cards";
import Coach from "./Coach";
import LawSheet from "./LawSheet";
import { setBook, VERSION } from "@/lib/book/content";
import { useBook, useMe } from "@/lib/queries";
import { useSignOut } from "@/lib/actions";
import { LANGS, savedLang, saveLang, t, type Key, type Lang } from "@/lib/i18n";
import s from "./bookapp.module.css";

const SEEN_KEY = "lor-seen";     // set once the reader has opened the cover
const FS_KEY = "lor-fs";
const HAND_KEY = "lor-hand";
const GUIDE_KEY = "lor-guide";  // set once the reading guide has been seen
const TIP_KEY = "lor-tip";      // set once the reader has tapped a name (or closed the tip)
export const SIZES = [14, 15.5, 17];   // text size: standard (dense, like a hardback), larger, largest
const SPLASH_MIN = 1700;         // the hourglass turns at least this long before it flies

function get(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function set(key: string, v: string | null) {
  try { if (v === null) localStorage.removeItem(key); else localStorage.setItem(key, v); } catch { /* ignore */ }
}

export default function BookApp() {
  const book = useRef<BookHandle>(null);
  const [boot, setBoot] = useState<null | { returning: boolean }>(null);
  const [fontSize, setFontSizeState] = useState(SIZES[0]);
  const [tip, setTip] = useState(false);
  const [tools, setTools] = useState(false);              // the row of reading tools is open
  const [mode, setMode] = useState<ToolId | null>(null);  // a finger tool is on: pages do not turn
  const [colour, setColour] = useState<Colour>("y");
  const [erase, setErase] = useState(false);
  const [marks, setMarks] = useState(0);                  // how many highlights there are, in this language
  const [notice, setNotice] = useState<string | null>(null);
  const [sharing, setSharing] = useState<Highlight | null>(null);   // the highlight being made into a picture
  const [sharingNote, setSharingNote] = useState<Note | null>(null); // the note being made into a picture
  // the note card: writing a new note (on a sentence, or on the page), reading one, or editing it
  const [card, setCard] = useState<{ mode: "write" | "read" | "edit"; draft: Draft; picked?: Picked; pageAt?: { seq: number; tok: number }; sec?: string; id?: string } | null>(null);
  const [menu, setMenu] = useState<{ note: Note; at: DOMRect } | null>(null);
  const [moving, setMoving] = useState<{ note: Note; at: DOMRect } | null>(null);   // the Move to folder list
  const [hlMenu, setHlMenu] = useState<{ h: Highlight; at: DOMRect } | null>(null);
  const [hlColour, setHlColour] = useState<{ h: Highlight; at: DOMRect } | null>(null);
  const [naming, setNaming] = useState<Note | null>(null);                         // a new folder, made while moving a note
  const [left, setLeftState] = useState(false);
  const [ready, setReady] = useState(false);
  const [minTime, setMinTime] = useState(false);
  const [splashTarget, setSplashTarget] = useState<DOMRect | null>(null);
  const [splash, setSplash] = useState(false);
  const [page, setPage] = useState<PageInfo | null>(null);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [who, setWho] = useState<string | null>(null);
  const [word, setWord] = useState<{ id: string; at: DOMRect } | null>(null);
  const [guide, setGuide] = useState(false);
  const [law, setLaw] = useState<number | null>(null);
  const [lang, setLangState] = useState<Lang>("en");
  const [langOpen, setLangOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const whoFromList = useRef(false);   // a card opened from the Who's Who list goes back to the list

  // the reader (null when signed out) and the book they may read, in their language
  const me = useMe().data ?? null;
  const words = useBook(lang, !!boot);
  const owner = words.data?.owner ?? false;
  const offline = words.isError && version === 0;
  const signOutNow = useSignOut();

  // a new book arrived (first load, another language, a sign-in): hand it to the reader
  useEffect(() => {
    if (!words.data) return;
    setBook(words.data);
    setVersion(VERSION);
  }, [words.data]);

  // read the saved settings once, in the browser, then fetch the reader and the book
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const fs = Number(get(FS_KEY));
      if (SIZES.includes(fs)) setFontSizeState(fs);
      setLeftState(get(HAND_KEY) === "left");
      const l = savedLang();
      setLangState(l);
      const returning = get(SEEN_KEY) === "1" && !!get("lor-place");
      setSplash(!returning);
      setBoot({ returning });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // no signal and no saved book: the splash steps aside so the reader sees why
  useEffect(() => {
    if (offline && version === 0) setSplash(false);
  }, [offline, version]);

  // the splash turns for a moment before it may fly
  useEffect(() => {
    if (!splash) return;
    const t = window.setTimeout(() => setMinTime(true), SPLASH_MIN);
    return () => window.clearTimeout(t);
  }, [splash]);

  // the book is ready and the hourglass has turned: fly it onto the cover
  useEffect(() => {
    if (!splash || !ready || !minTime || splashTarget) return;
    const raf = requestAnimationFrame(() => setSplashTarget(book.current?.emblemRect() ?? new DOMRect(innerWidth / 2 - 20, innerHeight / 2 - 30, 40, 64)));
    return () => cancelAnimationFrame(raf);
  }, [splash, ready, minTime, splashTarget]);

  const onPage = useCallback((info: PageInfo) => {
    setPage(info);
    if (info.index > 0) set(SEEN_KEY, "1");
    // the first time the cover is opened, show how to turn the pages
    if (info.index > 0 && get(GUIDE_KEY) !== "1") setGuide(true);
    // once the reader is inside the book, one tip: names open their file
    if (info.index > 0 && get(TIP_KEY) !== "1") setTip(true);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const endTip = useCallback(() => { set(TIP_KEY, "1"); setTip(false); }, []);
  const onWho = useCallback((id: string) => { setWord(null); whoFromList.current = false; setWho(id); endTip(); }, [endTip]);
  const onWord = useCallback((id: string, at: DOMRect) => setWord({ id, at }), []);
  const endSplash = useCallback(() => setSplash(false), []);
  const endGuide = useCallback(() => { set(GUIDE_KEY, "1"); setGuide(false); }, []);

  const jump = useCallback((sec: string) => {
    setPanel(null);
    setWho(null);
    whoFromList.current = false;
    // "law-1" and the like open that law's sheet; everything else is a page in the book
    if (sec.startsWith("law-")) { setLaw(Number(sec.slice(4))); return; }
    setLaw(null);
    book.current?.jumpTo(sec);
  }, []);

  const closeWho = useCallback(() => {
    setWho(null);
    // opened from the list: the list comes back, at the same name and the same search
    if (whoFromList.current) { whoFromList.current = false; setPanel("whoswho"); }
  }, []);

  const setFontSize = useCallback((n: number) => { set(FS_KEY, String(n)); setFontSizeState(n); }, []);
  const setLeft = useCallback((v: boolean) => { set(HAND_KEY, v ? "left" : null); setLeftState(v); }, []);
  const restart = useCallback(() => { setPanel(null); book.current?.flipTo(0); }, []);

  const chooseLang = useCallback((l: Lang) => {
    setLangOpen(false);
    saveLang(l);
    setLangState(l);
    document.documentElement.lang = l;   // the book for this language is fetched by useBook
  }, []);

  const signOut = useCallback(() => { signOutNow(); setPanel(null); }, [signOutNow]);

  // highlights: one list per language; repaint the pages whenever it changes
  useEffect(() => { setHighlightLang(lang); setMarks(highlights().length); }, [lang]);
  useEffect(() => subscribe(() => { setMarks(highlights().length); book.current?.repaint(); }), []);
  useEffect(() => { book.current?.repaint(); }, [version]);
  useEffect(() => onBookmarks(() => book.current?.fold()), []);
  // notes: one list per language; the pen marks are redrawn whenever the list changes
  useEffect(() => { setNotesLang(lang); book.current?.repaint(); }, [lang]);
  useEffect(() => onNotes(() => book.current?.repaint()), []);
  useEffect(() => { if (mode !== "highlight") setErase(false); }, [mode]);
  useEffect(() => { if (marks === 0) setErase(false); }, [marks]);
  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(id);
  }, [notice]);

  // Bookmark: one tap folds the corner of the page the reader is on (or unfolds it)
  const bookmark = useCallback(() => {
    const here = book.current?.here();
    if (!here || here.dark) { setNotice(t(lang, "noBmHere")); return; }
    const done = toggleBookmark(here.start, here.end, here.head, here.page);
    try { navigator.vibrate?.(done === "added" ? [6, 40, 10] : 8); } catch { /* not supported */ }
    setNotice(t(lang, done === "added" ? "bmAdded" : "bmRemoved"));
  }, [lang]);

  // the link on every picture: the reader's own Earn link when signed in
  const shareLink = typeof window === "undefined" ? "" : me?.refCode ? `${window.location.origin}/r/${me.refCode}` : window.location.origin;
  const brand = t(lang, "coverTitle").split("|").join(" ");

  const openNote = useCallback((id: string) => {
    const n = noteById(id);
    if (!n) return;
    setWho(null); setWord(null);
    underline(n.kind === "line" ? n.a : null, n.kind === "line" ? n.b ?? n.a : null);
    setCard({ mode: "read", id, draft: { kind: n.kind, quote: n.quote, head: n.head, page: n.page } });
  }, []);

  const closeCard = useCallback(() => { underline(null, null); setCard(null); }, []);

  const saveCard = useCallback((text: string) => {
    if (!card) return;
    if (card.mode === "edit" && card.id) updateNote(card.id, text);
    else if (card.picked) {
      const p = card.picked;
      addNote({ kind: "line", a: p.a, b: p.b, quote: p.quote, before: p.before, sec: p.sec, head: p.head, page: p.page, text });
    } else if (card.pageAt) {
      addNote({ kind: "page", a: card.pageAt, quote: "", before: "", sec: card.sec ?? "", head: card.draft.head, page: card.draft.page, text });
    }
    try { navigator.vibrate?.([6, 40, 10]); } catch { /* not supported */ }
    underline(null, null);
    setCard(null);
    setNotice(t(lang, "noteSaved"));
  }, [card, lang]);

  // a page note: written on the page the reader is on, with no sentence
  const pageNote = useCallback(() => {
    const here = book.current?.here();
    if (!here || here.dark) { setNotice(t(lang, "noBmHere")); return; }
    if (!(owner || !/^(law|part)/.test(here.sec))) { setNotice(t(lang, "noteBuyers")); return; }
    underline(null, null);
    setCard({ mode: "write", draft: { kind: "page", quote: "", head: here.head, page: here.page }, pageAt: here.start, sec: here.sec });
  }, [lang, owner]);

  const noteMenu = (n: Note): { icon: React.ReactNode; label: string; onPick: () => void; danger?: boolean; confirm?: string }[] => [
    { icon: ICONS.share, label: t(lang, "sharePic"), onPick: () => { setCard(null); underline(null, null); setSharingNote(n); } },
    { icon: ICONS.save, label: t(lang, "savePng"), onPick: async () => {
      const f = await noteFile(n, lang, savedName(me?.name ?? ""), shareLink, brand);
      if (f) { downloadFile(f); setNotice(t(lang, "savedImg")); }
    } },
    { icon: ICONS.go, label: t(lang, "goToPage"), onPick: () => {
      setPanel(null);
      book.current?.goTo(n.a);
      if (n.kind === "line") window.setTimeout(() => underline(n.a, n.b ?? n.a), 500);
      window.setTimeout(() => underline(null, null), 2600);
    } },
    { icon: ICONS.folder, label: t(lang, "moveTo"), onPick: () => setMoving({ note: n, at: menu?.at ?? new DOMRect(window.innerWidth - 40, 120, 30, 30) }) },
    { icon: ICONS.edit, label: t(lang, "editNote"), onPick: () => {
      setPanel(null);
      setCard({ mode: "edit", id: n.id, draft: { kind: n.kind, quote: n.quote, head: n.head, page: n.page } });
    } },
    { icon: ICONS.copy, label: t(lang, "copyText"), onPick: async () => {
      const text = n.quote ? `“${n.quote}”\n\n${n.text}\n\n${n.head}${n.page ? `, p. ${n.page}` : ""}` : `${n.text}\n\n${n.head}${n.page ? `, p. ${n.page}` : ""}`;
      try { await navigator.clipboard.writeText(text); setNotice(t(lang, "textCopied")); } catch { /* clipboard blocked */ }
    } },
    { icon: ICONS.del, label: t(lang, "del"), danger: true, confirm: t(lang, "delSure"), onPick: () => {
      removeNote(n.id);
      underline(null, null);
      setCard((c) => (c?.id === n.id ? null : c));
      setNotice(t(lang, "noteDeleted"));
    } },
  ];

  // take the reader to a highlight; it glows for a moment
  const goToHighlight = (h: Highlight) => {
    setPanel(null);
    book.current?.goTo(h.a);
    window.setTimeout(() => flash(h), 450);
  };

  const highlightMenu = (h: Highlight): { icon: React.ReactNode; label: string; onPick: () => void; danger?: boolean; confirm?: string }[] => [
    { icon: ICONS.share, label: t(lang, "sharePic"), onPick: () => setSharing(h) },
    { icon: ICONS.save, label: t(lang, "savePng"), onPick: async () => {
      const f = await highlightFile(h, lang, savedName(me?.name ?? ""), shareLink, brand);
      if (f) { downloadFile(f); setNotice(t(lang, "savedImg")); }
    } },
    { icon: ICONS.go, label: t(lang, "goToPage"), onPick: () => goToHighlight(h) },
    { icon: <span className={hs.swatch} style={{ "--sw": COLOURS.find((c) => c.c === h.c)!.hex } as React.CSSProperties} />, label: t(lang, "changeColour"), onPick: () => setHlColour({ h, at: hlMenu?.at ?? new DOMRect(window.innerWidth - 40, 120, 30, 30) }) },
    { icon: ICONS.copy, label: t(lang, "copyText"), onPick: async () => {
      try { await navigator.clipboard.writeText(`“${h.text ?? ""}”\n\n${h.head ?? ""}${h.page ? `, p. ${h.page}` : ""}`); setNotice(t(lang, "textCopied")); } catch { /* clipboard blocked */ }
    } },
    { icon: ICONS.del, label: t(lang, "del"), danger: true, confirm: t(lang, "delSure"), onPick: () => removeHighlight(h.id) },
  ];

  useNoter({
    on: mode === "note",
    busy: !!card,
    allowed: (sec) => owner || !/^(law|part)/.test(sec),
    onBlocked: () => setNotice(t(lang, "noteBuyers")),
    onPick: (p) => setCard({ mode: "write", picked: p, draft: { kind: "line", quote: p.quote, head: p.head, page: p.page } }),
    onOpen: openNote,
  });

  useHighlighter({
    on: mode === "highlight",
    colour,
    erase,
    // the Preface is free to mark; the laws are for readers who own the book
    allowed: (sec) => owner || !/^(law|part)/.test(sec),
    onBlocked: () => setNotice(t(lang, "hlBuyers")),
  });

  if (!boot) return <main className={s.app} />;

  // the book shows once it is built: at once for a returning reader, behind the flight for a new one
  const showBook = ready && (!splash || !!splashTarget);
  const dark = page?.dark ?? true;
  const current = LANGS.find((x) => x.code === lang)!;

  return (
    <main className={s.app}>
      {version > 0 && (
        <Book
          ref={book}
          fontSize={fontSize}
          version={version}
          visible={showBook}
          startFromPlace={boot.returning}
          onReady={onReady}
          onPage={onPage}
          onWho={onWho}
          onWord={onWord}
          onLaw={setLaw}
          paused={mode !== null}
        />
      )}

      {offline && version === 0 && !splash && (
        <div className={s.offline}>
          <p>{t(lang, "noConnection")}</p>
          <button type="button" onClick={() => words.refetch()}>{t(lang, "retry")}</button>
        </div>
      )}

      {showBook && (
        <>
          <button type="button" className={`${s.lang} ${dark ? s.onDark : ""}`} onClick={() => setLangOpen((o) => !o)} aria-label={t(lang, "language")} aria-expanded={langOpen}>
            {current.short}
          </button>
          {langOpen && (
            <>
              <div className={s.langScrim} onClick={() => setLangOpen(false)} aria-hidden="true" />
              <ul className={s.langList} role="listbox" aria-label={t(lang, "language")}>
                {LANGS.map((x) => (
                  <li key={x.code}>
                    <button type="button" role="option" aria-selected={x.code === lang} onClick={() => chooseLang(x.code)}>
                      <span>{x.short}</span>{x.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="button" className={`${s.profile} ${dark ? s.onDark : ""} ${me ? s.signedIn : ""}`} onClick={() => setPanel("account")} aria-label={t(lang, "account")}>
            {me ? (
              // signed in: the first letter of their email, in gold
              <span className={s.initial} aria-hidden="true">{(me.name || me.email).trim().charAt(0).toUpperCase()}</span>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.5" r="3" /><path d="M2.5 14.5c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" /></svg>
            )}
          </button>
          {/* on the closed cover: only the hint, so nothing sits on the corner the reader lifts */}
          {page?.index === 0 || guide || tools || mode ? (
            page?.index === 0 && !panel && !guide && <p className={s.hint}>{t(lang, "swipe")}</p>
          ) : (
            <Tray
              left={left}
              light={dark}
              lang={lang}
              onChoose={(id) => { setWho(null); setWord(null); setPanel(id); }}
              onAsk={() => { setWho(null); setWord(null); setPanel("ask"); }}
              onTools={() => { setWho(null); setWord(null); setTools(true); }}
            />
          )}
        </>
      )}

      {showBook && page && page.index > 0 && (
        <ToolRow lang={lang} open={tools} mode={mode} onClose={() => setTools(false)} onMode={setMode} onAction={(id) => { if (id === "bookmark") bookmark(); }}>
          {mode === "highlight" ? <HighlightBar lang={lang} colour={colour} setColour={setColour} erase={erase} setErase={setErase} any={marks > 0} onShare={() => {
            // the most recent highlight becomes the picture
            const latest = [...highlights()].sort((a, b) => b.at - a.at)[0];
            if (latest) setSharing(latest);
          }} /> : mode === "note" ? (
            <>
              <span className={nstyles.hint}>{t(lang, "tapLineOr")}</span>
              <button type="button" className={nstyles.free} onClick={pageNote}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                {t(lang, "pageNote")}
              </button>
            </>
          ) : undefined}
        </ToolRow>
      )}

      {panel && (
        <Panel
          id={panel}
          lang={lang}
          me={me}
          owner={owner}
          section={page?.secs[0]}
          law={law ?? undefined}
          onClose={() => setPanel(null)}
          onOpen={setPanel}
          onJump={jump}
          onPlace={(a) => { setPanel(null); book.current?.goTo(a); }}
          onNoteMenu={(n, at) => setMenu({ note: n, at })}
          onNotice={setNotice}
          onHighlightOpen={goToHighlight}
          onHighlightMenu={(h, at) => setHlMenu({ h, at })}
          onShareMany={async (list) => {
            // a folder's notes as pictures, shared together (or saved, where sharing files is not possible)
            const files = (await Promise.all(list.slice(0, 10).map((n) => noteFile(n, lang, savedName(me?.name ?? ""), shareLink, brand)))).filter(Boolean) as File[];
            if (!files.length) return;
            const data = { files, text: `${t(lang, "mission")} ${shareLink}` };
            if (navigator.canShare?.(data)) { try { await navigator.share(data); } catch { /* closed */ } }
            else { files.forEach((f, i) => window.setTimeout(() => downloadFile(f), i * 300)); setNotice(t(lang, "savedImg")); }
          }}
          onNoteOpen={(n) => { setPanel(null); book.current?.goTo(n.a); window.setTimeout(() => openNote(n.id), 420); }}
          onWho={(id) => { setPanel(null); whoFromList.current = true; setWho(id); }}
          onSignOut={signOut}
          onLang={chooseLang}
          fontSize={fontSize}
          setFontSize={setFontSize}
          left={left}
          setLeft={setLeft}
          onRestart={restart}
          onGuide={() => { setPanel(null); setGuide(true); }}
        />
      )}
      {law !== null && <LawSheet n={law} onClose={() => setLaw(null)} onWho={onWho} onWord={onWord} />}
      {who && <WhoCard id={who} onClose={closeWho} onJump={jump} />}
      {word && <WordCard id={word.id} at={word.at} onClose={() => setWord(null)} />}

      {notice && <p className={ts.soon} role="status">{notice}</p>}
      {card && (
        <NoteCard
          key={`${card.mode}-${card.id ?? "new"}`}
          lang={lang}
          mode={card.mode}
          draft={card.draft}
          text={card.id ? noteById(card.id)?.text ?? "" : ""}
          date={card.id ? new Date(noteById(card.id)?.ed ?? noteById(card.id)?.at ?? Date.now()).toLocaleDateString(lang, { day: "numeric", month: "short", year: "numeric" }) : undefined}
          raised={mode !== null}
          onSave={saveCard}
          onCancel={closeCard}
          onEdit={() => setCard((c) => (c ? { ...c, mode: "edit" } : c))}
          onMenu={(at) => { const n = card.id ? noteById(card.id) : undefined; if (n) setMenu({ note: n, at }); }}
        />
      )}
      {menu && <OptionsMenu anchor={menu.at} items={noteMenu(menu.note)} onClose={() => setMenu(null)} />}
      {hlMenu && <OptionsMenu anchor={hlMenu.at} items={highlightMenu(hlMenu.h)} onClose={() => setHlMenu(null)} />}
      {hlColour && (
        <OptionsMenu
          anchor={hlColour.at}
          onClose={() => setHlColour(null)}
          items={COLOURS.map(({ c, hex }) => ({
            icon: <span className={hs.swatch} style={{ "--sw": hex } as React.CSSProperties} />,
            label: `${t(lang, `c_${c}` as Key)}${c === hlColour.h.c ? "  ✓" : ""}`,
            onPick: () => recolour(hlColour.h.id, c),
          }))}
        />
      )}
      {moving && (
        <OptionsMenu
          anchor={moving.at}
          onClose={() => setMoving(null)}
          items={[
            { icon: ICONS.folderAll, label: t(lang, "noFolder"), onPick: () => { moveNote(moving.note.id, null); setNotice(t(lang, "movedTo").replace("{f}", t(lang, "noFolder"))); } },
            ...folders().map((f) => ({ icon: ICONS.folder, label: f.name, onPick: () => { moveNote(moving.note.id, f.id); setNotice(t(lang, "movedTo").replace("{f}", f.name)); } })),
            { icon: ICONS.plus, label: t(lang, "newFolder"), onPick: () => setNaming(moving.note) },
          ]}
        />
      )}
      {naming && (
        <NamePrompt
          lang={lang}
          title={t(lang, "newFolder")}
          start=""
          onCancel={() => setNaming(null)}
          onDone={(name) => { const f = addFolder(name); moveNote(naming.id, f.id); setNaming(null); setNotice(t(lang, "movedTo").replace("{f}", f.name)); }}
        />
      )}
      {sharing && (
        <ShareSheet lang={lang} highlight={sharing} defaultName={me?.name ?? ""} link={shareLink} brand={brand} onClose={() => setSharing(null)} />
      )}
      {sharingNote && (
        <ShareSheet lang={lang} note={sharingNote} defaultName={me?.name ?? ""} link={shareLink} brand={brand} onClose={() => setSharingNote(null)} />
      )}
      {tip && !guide && !panel && !who && !tools && !mode && showBook && page && page.index > 0 && (
        <div className={s.tip} role="status">
          <span>{t(lang, "tapName")}</span>
          <button type="button" onClick={endTip}>{t(lang, "ok")}</button>
        </div>
      )}
      {guide && showBook && <Coach onDone={endGuide} />}
      {splash && <Splash target={splashTarget} onDone={endSplash} />}
    </main>
  );
}
