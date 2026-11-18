"use client";

/* eslint-disable @next/next/no-img-element -- an animated webp must not go through the image optimiser */
import { useEffect, useState } from "react";
import styles from "./hero.module.css";

/* The small hourglass, top right.
   A still frame (2 KB) paints at once; the moving loop (about 235 KB) is fetched only after the
   page has finished loading, so it never slows the first screen.
   The loop holds two full turns in the same direction (a whole circle) and exactly two thirds of
   a slow spin, so its last frame flows straight into its first: it never jumps or resets.
   When motion is paused, the still frame shows: the same resting glass the loop ends on. */

const STILL = "/hourglass/shelf-still.webp";
const LOOP = "/hourglass/shelf.webp";

export default function Hourglass({ motion }: { motion: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchLoop = () => {
      const img = new window.Image();
      img.src = LOOP;
      img.decode().then(
        () => { if (!cancelled) setReady(true); },
        () => {},
      );
    };
    const whenIdle = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
      if (ric) ric(fetchLoop);
      else window.setTimeout(fetchLoop, 300);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
    };
  }, []);

  return (
    <img
      className={styles.glass}
      src={motion && ready ? LOOP : STILL}
      alt=""
      width={194}
      height={200}
      decoding="async"
      fetchPriority="low"
    />
  );
}
