"use client";

/* Splash B: the hourglass turns on dark, then flies down and shrinks onto the gold hourglass
   stamped on the cover, while the cover rises behind it. Shown on the first open only;
   a returning reader goes straight to their page. */

import { useEffect, useRef, useState } from "react";
import s from "./splash.module.css";

type Props = {
  target: DOMRect | null;   // the cover's hourglass; when it arrives, the flight starts
  onDone: () => void;
};

export default function Splash({ target, onDone }: Props) {
  const glass = useRef<HTMLImageElement>(null);
  const [flying, setFlying] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!target || !glass.current) return;
    const from = glass.current.getBoundingClientRect();
    // the hourglass in the webp fills about 62% of its frame; match that to the stamped one
    const scale = target.height / (from.height * 0.62);
    const dx = target.left + target.width / 2 - (from.left + from.width / 2);
    const dy = target.top + target.height / 2 - (from.top + from.height / 2);
    const raf = requestAnimationFrame(() => {
      setFlying(true);
      setStyle({ transform: `translate(${dx}px, ${dy}px) scale(${scale})` });
    });
    const done = window.setTimeout(onDone, 1000);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(done); };
  }, [target, onDone]);

  return (
    <div className={`${s.splash} ${flying ? s.flying : ""}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={glass} src="/loader/hourglass.webp" alt="" width={160} height={160} className={s.glass} style={style} />
    </div>
  );
}
