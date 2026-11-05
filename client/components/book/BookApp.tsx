"use client";

/* What opens when the home-screen icon is tapped.
   First open: the splash (the hourglass turns, then flies onto the cover), then the cover,
   which the reader swings open into the book.
   Every open after that: straight to the page they stopped on. No splash, no cover.
   Over the book: the profile icon top right, the tray button bottom right. */

import { useCallback, useEffect, useRef, useState } from "react";
import Book, { type BookHandle, type PageInfo } from "./Book";
import Splash from "./Splash";
import Tray from "./Tray";
import Panel, { type PanelId } from "./Panels";
import { WhoCard, WordCard } from "./Cards";
import Coach from "./Coach";
import s from "./bookapp.module.css";

const SEEN_KEY = "lor-seen";     // set once the reader has opened the cover
const FS_KEY = "lor-fs";
const HAND_KEY = "lor-hand";
const GUIDE_KEY = "lor-guide";  // set once the reading guide has been seen
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
  const [fontSize, setFontSizeState] = useState(16);
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

  // read the saved settings once, in the browser
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const fs = Number(get(FS_KEY));
      if (fs === 15 || fs === 16 || fs === 17.5) setFontSizeState(fs);
      setLeftState(get(HAND_KEY) === "left");
      const returning = get(SEEN_KEY) === "1" && !!get("lor-place");
      setSplash(!returning);
      setBoot({ returning });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

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
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onWho = useCallback((id: string) => { setWord(null); setWho(id); }, []);
  const onWord = useCallback((id: string, at: DOMRect) => setWord({ id, at }), []);
  const endSplash = useCallback(() => setSplash(false), []);
  const endGuide = useCallback(() => { set(GUIDE_KEY, "1"); setGuide(false); }, []);

  const jump = useCallback((sec: string) => {
    setPanel(null);
    setWho(null);
    book.current?.jumpTo(sec);
  }, []);

  const setFontSize = useCallback((n: number) => { set(FS_KEY, String(n)); setFontSizeState(n); }, []);
  const setLeft = useCallback((v: boolean) => { set(HAND_KEY, v ? "left" : null); setLeftState(v); }, []);
  const restart = useCallback(() => { setPanel(null); book.current?.flipTo(0); }, []);

  if (!boot) return <main className={s.app} />;

  // the book shows once it is built: at once for a returning reader, behind the flight for a new one
  const showBook = ready && (!splash || !!splashTarget);
  const dark = page?.dark ?? true;

  return (
    <main className={s.app}>
      <Book
        ref={book}
        fontSize={fontSize}
        visible={showBook}
        startFromPlace={boot.returning}
        onReady={onReady}
        onPage={onPage}
        onWho={onWho}
        onWord={onWord}
      />

      {showBook && (
        <>
          <button type="button" className={`${s.profile} ${dark ? s.onDark : ""}`} onClick={() => setPanel("account")} aria-label="Your account">
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.5" r="3" /><path d="M2.5 14.5c.8-3 3-4.5 5.5-4.5s4.7 1.5 5.5 4.5" /></svg>
          </button>
          {/* on the closed cover: only the hint, so nothing sits on the corner the reader lifts */}
          {page?.index === 0 || guide ? (
            !panel && !guide && <p className={s.hint}>Swipe to open</p>
          ) : (
            <Tray left={left} light={dark} onChoose={(id) => { setWho(null); setWord(null); setPanel(id); }} />
          )}
        </>
      )}

      {panel && (
        <Panel
          id={panel}
          onClose={() => setPanel(null)}
          onJump={jump}
          onWho={(id) => { setPanel(null); setWho(id); }}
          fontSize={fontSize}
          setFontSize={setFontSize}
          left={left}
          setLeft={setLeft}
          onRestart={restart}
          onGuide={() => { setPanel(null); setGuide(true); }}
        />
      )}
      {who && <WhoCard id={who} onClose={() => setWho(null)} onJump={jump} />}
      {word && <WordCard id={word.id} at={word.at} onClose={() => setWord(null)} />}

      {guide && showBook && <Coach onDone={endGuide} />}
      {splash && <Splash target={splashTarget} onDone={endSplash} />}
    </main>
  );
}
