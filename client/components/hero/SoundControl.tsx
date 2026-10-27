"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./hero.module.css";

/* The hero's music. Browsers refuse sound before the visitor touches the page,
   so the track loads while the page loads, and begins with a slow fade on the first
   tap, click, key or scroll. The waveform moves with the real sound. */

const SRC = "/audio/hero-theme.mp3";
const VOLUME = 0.55;
const KEY = "lor-sound";
const BARS = 14;

type State = "waiting" | "playing" | "off" | "missing";

export default function SoundControl() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<{ ctx: AudioContext; gain: GainNode; analyser: AnalyserNode } | null>(null);
  const barsRef = useRef<(SVGRectElement | null)[]>([]);
  const [state, setState] = useState<State>("waiting");
  const stateRef = useRef<State>("waiting");
  useEffect(() => { stateRef.current = state; }, [state]);

  // set up the element and honour the visitor's last choice
  useEffect(() => {
    const a = new Audio();
    a.src = SRC; a.loop = true; a.preload = "auto"; a.crossOrigin = "anonymous";
    a.addEventListener("error", () => setState("missing"));
    audioRef.current = a;
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch {}
    const first = requestAnimationFrame(() => { if (saved === "off") setState("off"); });
    return () => { cancelAnimationFrame(first); a.pause(); a.src = ""; ctxRef.current?.ctx.close().catch(() => {}); };
  }, []);

  const fadeTo = (v: number, seconds: number) => {
    const c = ctxRef.current; if (!c) return;
    const now = c.ctx.currentTime;
    c.gain.gain.cancelScheduledValues(now);
    c.gain.gain.setValueAtTime(c.gain.gain.value, now);
    c.gain.gain.linearRampToValueAtTime(v, now + seconds);
  };

  const start = async () => {
    const a = audioRef.current; if (!a) return;
    try {
      if (!ctxRef.current) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const srcNode = ctx.createMediaElementSource(a);
        const gain = ctx.createGain(); gain.gain.value = 0;
        const analyser = ctx.createAnalyser(); analyser.fftSize = 64; analyser.smoothingTimeConstant = 0.82;
        srcNode.connect(gain); gain.connect(analyser); analyser.connect(ctx.destination);
        ctxRef.current = { ctx, gain, analyser };
      }
      await ctxRef.current.ctx.resume();
      await a.play();
      fadeTo(VOLUME, 3.5);
      setState("playing");
    } catch {
      setState(a.error ? "missing" : "waiting");
    }
  };

  const stop = () => {
    const a = audioRef.current; if (!a) return;
    fadeTo(0, 0.8);
    setTimeout(() => { if (stateRef.current !== "playing") a.pause(); }, 850);
    setState("off");
  };

  // the first gesture anywhere on the page starts the music, unless it was turned off
  useEffect(() => {
    const kick = () => { if (stateRef.current === "waiting") start(); };
    const opts = { once: true, passive: true } as const;
    const evs = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    evs.forEach((e) => window.addEventListener(e, kick, opts));
    return () => evs.forEach((e) => window.removeEventListener(e, kick));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // waveform: real levels while playing, a quiet line otherwise
  useEffect(() => {
    let raf = 0; const data = new Uint8Array(32); let t = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw); t += 0.016;
      const c = ctxRef.current, playing = stateRef.current === "playing";
      if (playing && c) c.analyser.getByteFrequencyData(data);
      for (let i = 0; i < BARS; i++) {
        const el = barsRef.current[i]; if (!el) continue;
        let h: number;
        if (playing && c) h = 2 + (data[Math.min(31, 1 + i * 2)] / 255) * 18 + Math.sin(t * 3 + i) * 1.2;
        else if (stateRef.current === "waiting") h = 2 + (Math.sin(t * 1.6 + i * 0.6) * 0.5 + 0.5) * 3;   // a breath: sound is ready
        else h = 1.5;
        h = Math.max(1.5, Math.min(20, h));
        el.setAttribute("y", String(12 - h / 2)); el.setAttribute("height", String(h));
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const onClick = () => {
    if (state === "playing") { stop(); try { localStorage.setItem(KEY, "off"); } catch {} }
    else if (state !== "missing") { try { localStorage.setItem(KEY, "on"); } catch {} start(); }
  };

  const label = state === "playing" ? "Turn the music off" : state === "missing" ? "Music not available yet" : "Turn the music on";
  return (
    <button className={`${styles.ctrl} ${state === "playing" ? styles.ctrlOn : ""}`} onClick={onClick} aria-label={label} aria-pressed={state === "playing"} disabled={state === "missing"} title={label}>
      <svg viewBox="0 0 58 24" className={styles.wave} aria-hidden="true">
        {Array.from({ length: BARS }).map((_, i) => (
          <rect key={i} ref={(el) => { barsRef.current[i] = el; }} x={1 + i * 4.1} y="11" width="2" height="2" />
        ))}
      </svg>
    </button>
  );
}
