"use client";

import { useEffect, useState } from "react";
import type { InstallRoute } from "@/lib/install";
import styles from "./install.module.css";

/* A full-screen guide that shows, on an animated phone, exactly what to tap.
   It plays on its own; tap the phone or the step marks to move at your own pace. */

type Mode = Extract<InstallRoute, "ios" | "android" | "inapp" | "desktop">;

const STEPS: Record<Mode, string[]> = {
  ios: [
    "Tap the Share button at the bottom of Safari. On newer iPhones, tap ⋯ first, then Share.",
    "The share sheet opens. Scroll down the list.",
    "Tap Add to Home Screen.",
    "Keep the name, then tap Add.",
    "The Laws of Ruin is on your home screen. Open it from there.",
  ],
  android: [
    "Tap the ⋮ menu at the top right of your browser.",
    "Tap Install app, or Add to Home screen.",
    "Confirm with Install.",
    "The Laws of Ruin is on your home screen. Open it from there.",
  ],
  inapp: [
    "You are inside another app's browser, which cannot install apps. Tap the ⋯ menu at the top.",
    "Tap Open in browser. On iPhone it may say Open in Safari.",
    "In the browser, tap Add to again.",
  ],
  desktop: [
    "This browser cannot install apps. Open this page in Chrome or Edge and press Add to again. On a Mac in Safari, choose File, then Add to Dock. Or open it on your phone.",
  ],
};

const TITLE: Record<Mode, string> = {
  ios: "Add to your iPhone",
  android: "Add to your phone",
  inapp: "Open in your browser first",
  desktop: "Add it to this computer",
};

export default function InstallGuide({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const steps = STEPS[mode];
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (steps.length < 2) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % steps.length), step === steps.length - 1 ? 3600 : 2900);
    return () => clearTimeout(id);
  }, [step, steps.length]);

  useEffect(() => {
    document.body.dataset.overlay = "1";
    return () => { delete document.body.dataset.overlay; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(location.origin); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  };

  return (
    <div className={styles.guide} role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div className={styles.guideInner}>
        <div className={styles.guideHead}>
          <span className={styles.guideEyebrow}>Keep the laws in your pocket</span>
          <h2 id="guide-title" className={styles.guideTitle}>{TITLE[mode]}</h2>
        </div>

        {mode !== "desktop" && (
          <button className={styles.phoneStage} onClick={() => setStep((s) => (s + 1) % steps.length)} aria-label="Next step">
            <GuidePhone mode={mode} step={step} />
          </button>
        )}

        <div className={styles.guideCaption} aria-live="polite">
          <span className={styles.stepNo}>{String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
          <p>{steps[step]}</p>
        </div>

        {steps.length > 1 && (
          <div className={styles.stepMarks} role="tablist" aria-label="Steps">
            {steps.map((_, i) => (
              <button key={i} role="tab" aria-selected={i === step} aria-label={`Step ${i + 1}`} className={i === step ? styles.markOn : styles.mark} onClick={() => setStep(i)} />
            ))}
          </div>
        )}

        {(mode === "inapp" || mode === "desktop") && (
          <div className={styles.linkRow}>
            <span className={styles.linkText}>lawofruin.io</span>
            <button className={styles.textBtn} onClick={copyLink}>{copied ? "Copied" : "Copy link"}</button>
          </div>
        )}

        <button className={styles.closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

/* ---------------- the animated phone ---------------- */

function GuidePhone({ mode, step }: { mode: Exclude<Mode, "desktop">; step: number }) {
  return (
    <svg viewBox="0 0 300 600" className={styles.guidePhone} data-step={step} aria-hidden="true">
      <defs>
        <linearGradient id="gp-body" x1="0" x2="1">
          <stop offset="0" stopColor="#4a443b" /><stop offset=".12" stopColor="#cfc6b6" /><stop offset=".5" stopColor="#7b7365" /><stop offset=".9" stopColor="#ddd5c6" /><stop offset="1" stopColor="#433d34" />
        </linearGradient>
        <linearGradient id="gp-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24312a" /><stop offset=".6" stopColor="#16120f" /><stop offset="1" stopColor="#2c1d14" />
        </linearGradient>
        <clipPath id="gp-screen"><rect x="16" y="16" width="268" height="568" rx="38" /></clipPath>
        <clipPath id="gp-list"><rect x="16" y="376" width="268" height="214" /></clipPath>
      </defs>
      <rect x="2" y="2" width="296" height="596" rx="52" fill="url(#gp-body)" />
      <rect x="10" y="10" width="280" height="580" rx="45" fill="#040404" />
      <g clipPath="url(#gp-screen)">
        {mode === "ios" && <IosScreens step={step} />}
        {mode === "android" && <AndroidScreens step={step} />}
        {mode === "inapp" && <InAppScreens step={step} />}
      </g>
      <rect x="112" y="26" width="76" height="22" rx="11" fill="#040404" />
    </svg>
  );
}

function SitePreview({ top = 64, bottom = 520 }: { top?: number; bottom?: number }) {
  const h = bottom - top;
  return (
    <g>
      <rect x="16" y={top} width="268" height={h} fill="#0b0a08" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={24 + i * 29} y={top + 40 + (i % 2) * 8} width="20" height="58" fill={["#3a1512", "#1f2a22", "#2b1c12", "#4a2a18"][i % 4]} />
      ))}
      <image href="/icons/icon-192.png" x="110" y={top + h * 0.34} width="80" height="80" />
      <rect x="40" y={top + h * 0.7} width="160" height="10" fill="#ede6d8" opacity=".85" />
      <rect x="40" y={top + h * 0.7 + 18} width="110" height="7" fill="#8c8377" />
      <rect x="196" y={top + h - 40} width="64" height="24" fill="none" stroke="#c9a56b" />
    </g>
  );
}

function Tap({ x, y }: { x: number; y: number }) {
  return (
    <g className={styles.tap}>
      <circle cx={x} cy={y} r="18" fill="none" stroke="#c9a56b" strokeWidth="2" />
      <circle cx={x} cy={y} r="7" fill="#c9a56b" fillOpacity=".7" />
    </g>
  );
}

function HomeScreen() {
  const colors = ["#3d4a3f", "#6b4b2f", "#2f3d4f", "#5a2e2a", "#4b4636", "#2f4746", "#4a3a52", "#5b5242", "#30363d", "#55402d", "#3e3a30", "#41353a", "#344033", "#4b3b2b", "#2c3a44"];
  return (
    <g>
      <rect x="16" y="16" width="268" height="568" fill="url(#gp-wall)" />
      <text x="36" y="44" fill="#ede6d8" fontSize="13" fontFamily="var(--font-ui)">9:41</text>
      {colors.map((c, i) => {
        const x = 34 + (i % 4) * 62, y = 80 + Math.floor(i / 4) * 78;
        return <rect key={i} x={x} y={y} width="46" height="46" rx="11" fill={c} />;
      })}
      <g className={styles.popIn}>
        <image href="/icons/icon-192.png" x={34 + 3 * 62} y={80 + 3 * 78} width="46" height="46" style={{ clipPath: "inset(0 round 11px)" }} />
        <text x={34 + 3 * 62 + 23} y={80 + 3 * 78 + 62} fill="#ede6d8" fontSize="9.5" textAnchor="middle" fontFamily="var(--font-ui)">Laws of Ruin</text>
      </g>
      <rect x="34" y="500" width="232" height="66" rx="22" fill="#ffffff" fillOpacity=".08" />
    </g>
  );
}

function IosScreens({ step }: { step: number }) {
  const rows = ["Copy", "Add to Reading List", "Add Bookmark", "Add to Favourites", "Find on Page", "Add to Home Screen", "Markup", "Print"];
  const sheetY = step >= 1 ? 250 : 600;
  const scroll = step >= 2 ? -170 : 0;
  return (
    <g>
      {step <= 2 && (
        <g>
          <rect x="16" y="16" width="268" height="568" fill="#0b0a08" />
          <SitePreview top={58} bottom={516} />
          {/* address bar and toolbar, bottom of Safari */}
          <rect x="16" y="516" width="268" height="68" fill="#1c1a17" />
          <rect x="34" y="474" width="232" height="34" rx="12" fill="#2a2724" />
          <text x="150" y="496" fill="#d6cfc2" fontSize="12" textAnchor="middle" fontFamily="var(--font-ui)">lawofruin.io</text>
          <g stroke="#7ea7ff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M44 540 l-8 8 8 8" /><path d="M86 540 l8 8 -8 8" opacity=".35" />
            <g className={step === 0 ? styles.pulse : undefined}>
              <rect x="141" y="540" width="18" height="18" rx="2" /><path d="M150 548 V532 M144 537 l6 -6 6 6" />
            </g>
            <path d="M196 538 h14 v18 h-14 z M203 538 v18" /><rect x="236" y="538" width="14" height="14" rx="2" /><rect x="242" y="544" width="14" height="14" rx="2" />
          </g>
          {step === 0 && <Tap x={150} y={545} />}
          {/* share sheet */}
          <g style={{ transform: `translateY(${sheetY - 250}px)`, transition: "transform .7s cubic-bezier(.2,.8,.2,1)" }}>
            <rect x="16" y="250" width="268" height="340" rx="18" fill="#242220" />
            <rect x="130" y="258" width="40" height="5" rx="2.5" fill="#55504a" />
            <image href="/icons/icon-192.png" x="32" y="274" width="38" height="38" />
            <text x="80" y="290" fill="#ede6d8" fontSize="12.5" fontFamily="var(--font-ui)">The Laws of Ruin</text>
            <text x="80" y="306" fill="#8c8377" fontSize="10.5" fontFamily="var(--font-ui)">lawofruin.io</text>
            {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={46 + i * 52} cy="348" r="20" fill={["#2f6f3e", "#2e5d8f", "#6b4b2f", "#5a2e2a", "#3a3632"][i]} />)}
            <g clipPath="url(#gp-list)"><g style={{ transform: `translateY(${scroll}px)`, transition: "transform .8s cubic-bezier(.2,.8,.2,1)" }}>
              {rows.map((r, i) => {
                const y = 386 + i * 40, hot = r === "Add to Home Screen" && step >= 2;
                return (
                  <g key={r}>
                    <rect x="28" y={y} width="244" height="34" rx="9" fill={hot ? "#3a2f22" : "#2e2b28"} stroke={hot ? "#c9a56b" : "none"} className={hot ? styles.pulse : undefined} />
                    <text x="42" y={y + 22} fill="#ede6d8" fontSize="12.5" fontFamily="var(--font-ui)">{r}</text>
                    {r === "Add to Home Screen" && <g stroke="#ede6d8" strokeWidth="1.6" fill="none"><rect x="244" y={y + 9} width="16" height="16" rx="3" /><path d={`M252 ${y + 13} v8 M248 ${y + 17} h8`} /></g>}
                  </g>
                );
              })}
            </g></g>
            {step === 2 && <Tap x={150} y={403 + 5 * 40 - 170} />}
          </g>
        </g>
      )}
      {step === 3 && (
        <g className={styles.fadeIn}>
          <rect x="16" y="16" width="268" height="568" fill="#1b1917" />
          <text x="34" y="78" fill="#7ea7ff" fontSize="13" fontFamily="var(--font-ui)">Cancel</text>
          <text x="150" y="78" fill="#ede6d8" fontSize="13" textAnchor="middle" fontFamily="var(--font-ui)" fontWeight="600">Add to Home Screen</text>
          <text x="266" y="78" fill="#7ea7ff" fontSize="13" textAnchor="end" fontFamily="var(--font-ui)" fontWeight="600" className={styles.pulse}>Add</text>
          <rect x="28" y="104" width="244" height="86" rx="12" fill="#2a2724" />
          <image href="/icons/icon-192.png" x="40" y="118" width="58" height="58" style={{ clipPath: "inset(0 round 13px)" }} />
          <text x="112" y="140" fill="#ede6d8" fontSize="14" fontFamily="var(--font-ui)">Laws of Ruin</text>
          <line x1="112" y1="150" x2="258" y2="150" stroke="#3d3934" />
          <text x="112" y="170" fill="#8c8377" fontSize="11" fontFamily="var(--font-ui)">lawofruin.io</text>
          <Tap x={255} y={74} />
        </g>
      )}
      {step === 4 && <HomeScreen />}
    </g>
  );
}

function AndroidScreens({ step }: { step: number }) {
  const items = ["New tab", "New Incognito tab", "History", "Downloads", "Bookmarks", "Install app", "Share", "Settings"];
  return (
    <g>
      {step <= 2 && (
        <g>
          <rect x="16" y="16" width="268" height="568" fill="#0b0a08" />
          <rect x="16" y="50" width="268" height="54" fill="#1f1d1b" />
          <rect x="30" y="62" width="200" height="30" rx="15" fill="#2e2b28" />
          <text x="48" y="82" fill="#d6cfc2" fontSize="12" fontFamily="var(--font-ui)">lawofruin.io</text>
          <g fill="#ede6d8" className={step === 0 ? styles.pulse : undefined}><circle cx="258" cy="69" r="2.4" /><circle cx="258" cy="77" r="2.4" /><circle cx="258" cy="85" r="2.4" /></g>
          <SitePreview top={104} bottom={584} />
          {step === 0 && <Tap x={258} y={77} />}
          {step >= 1 && (
            <g className={styles.fadeIn}>
              <rect x="110" y="96" width="166" height={items.length * 38 + 14} rx="10" fill="#2a2724" />
              {items.map((it, i) => {
                const hot = it === "Install app";
                return (
                  <g key={it}>
                    {hot && <rect x="116" y={104 + i * 38} width="154" height="32" rx="6" fill="#3a2f22" stroke="#c9a56b" className={styles.pulse} />}
                    <text x="130" y={125 + i * 38} fill="#ede6d8" fontSize="12.5" fontFamily="var(--font-ui)">{it}</text>
                  </g>
                );
              })}
              {step === 1 && <Tap x={190} y={104 + 5 * 38 + 16} />}
            </g>
          )}
          {step === 2 && (
            <g className={styles.fadeIn}>
              <rect x="16" y="16" width="268" height="568" fill="#000" opacity=".55" />
              <rect x="36" y="210" width="228" height="170" rx="18" fill="#2a2724" />
              <text x="56" y="246" fill="#ede6d8" fontSize="15" fontFamily="var(--font-ui)">Install app</text>
              <image href="/icons/icon-192.png" x="56" y="264" width="44" height="44" />
              <text x="112" y="284" fill="#ede6d8" fontSize="12.5" fontFamily="var(--font-ui)">Laws of Ruin</text>
              <text x="112" y="300" fill="#8c8377" fontSize="10.5" fontFamily="var(--font-ui)">lawofruin.io</text>
              <text x="176" y="356" fill="#8ab4ff" fontSize="13" fontFamily="var(--font-ui)" textAnchor="end">Cancel</text>
              <text x="244" y="356" fill="#8ab4ff" fontSize="13" fontFamily="var(--font-ui)" textAnchor="end" fontWeight="600" className={styles.pulse}>Install</text>
              <Tap x={226} y={352} />
            </g>
          )}
        </g>
      )}
      {step === 3 && <HomeScreen />}
    </g>
  );
}

function InAppScreens({ step }: { step: number }) {
  return (
    <g>
      <rect x="16" y="16" width="268" height="568" fill="#0b0a08" />
      <rect x="16" y="50" width="268" height="50" fill="#f2efe9" />
      <text x="34" y="80" fill="#222" fontSize="18" fontFamily="var(--font-ui)">×</text>
      <text x="150" y="80" fill="#222" fontSize="12" textAnchor="middle" fontFamily="var(--font-ui)">lawofruin.io</text>
      <g fill="#222" className={step === 0 ? styles.pulse : undefined}><circle cx="252" cy="76" r="2.4" /><circle cx="260" cy="76" r="2.4" /><circle cx="268" cy="76" r="2.4" /></g>
      <SitePreview top={100} bottom={584} />
      {step === 0 && <Tap x={260} y={76} />}
      {step >= 1 && (
        <g className={styles.fadeIn}>
          <rect x="16" y="380" width="268" height="204" rx="18" fill="#f2efe9" />
          {["Open in browser", "Copy link", "Share", "Refresh"].map((t, i) => (
            <g key={t}>
              {i === 0 && step === 1 && <rect x="28" y={398} width="244" height="36" rx="8" fill="#efe2c8" stroke="#a37a3a" className={styles.pulse} />}
              <text x="44" y={421 + i * 42} fill="#222" fontSize="13" fontFamily="var(--font-ui)">{t}</text>
            </g>
          ))}
          {step === 1 && <Tap x={150} y={416} />}
        </g>
      )}
      {step === 2 && (
        <g className={styles.fadeIn}>
          <rect x="16" y="16" width="268" height="568" fill="#0b0a08" />
          <SitePreview top={58} bottom={584} />
          <Tap x={228} y={556} />
        </g>
      )}
    </g>
  );
}
