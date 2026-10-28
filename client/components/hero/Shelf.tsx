"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BY_SLUG, FIGURES, SHELVES, dates } from "@/lib/figures";
import styles from "./shelf.module.css";

/* Two shelves of big picture covers, leaning on each other like records in a crate.
   Each shelf swipes on its own. Tap a cover to pull it off the shelf; tap it again to put it back.
   No library: native scrolling, CSS for the wood and the lean, one small timer for the "nudge". */

const LEAN = [-4, 3, -2, 5, -3, 2, -5, 1, 4, -1];

type Props = {
  photos: Record<string, string>;   // slug -> file name, only for photos that exist in /public/figures
  motion: boolean;
  pulled: string | null;
  onPull: (slug: string | null) => void;
};

export default function Shelf({ photos, motion, pulled, onPull }: Props) {
  const unitRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  // Photos load only when their cover comes within a screen of view, so a visitor who never
  // swipes downloads about eight photos, not fifty-six.
  const [near, setNear] = useState<Set<string>>(() => new Set(SHELVES.flatMap((row) => row.slice(0, 4))));

  useEffect(() => {
    const observers = rowsRef.current.map((row) => {
      if (!row) return null;
      const io = new IntersectionObserver((entries) => {
        const found = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).dataset.slug as string);
        if (found.length) setNear((prev) => { const next = new Set(prev); found.forEach((f) => next.add(f)); return next.size === prev.size ? prev : next; });
      }, { root: row, rootMargin: "0px 100% 0px 100%" });
      row.querySelectorAll<HTMLElement>("[data-slug]").forEach((el) => io.observe(el));
      return io;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Every few seconds one cover in view eases forward a little, as if it wants to be picked.
  useEffect(() => {
    if (!motion || pulled) return;
    const unit = unitRef.current;
    if (!unit) return;
    let last: HTMLElement | null = null;
    const id = window.setInterval(() => {
      const vw = window.innerWidth;
      const seen = Array.from(unit.querySelectorAll<HTMLElement>("[data-cover]")).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.left > 4 && r.right < vw - 4;
      });
      if (!seen.length) return;
      let pick = seen[Math.floor(Math.random() * seen.length)];
      if (pick === last && seen.length > 1) pick = seen[(seen.indexOf(pick) + 1) % seen.length];
      last = pick;
      pick.classList.remove(styles.nudge);
      void pick.offsetWidth; // restart the animation
      pick.classList.add(styles.nudge);
      window.setTimeout(() => pick.classList.remove(styles.nudge), 2200);
    }, 3400);
    return () => window.clearInterval(id);
  }, [motion, pulled]);

  // On a computer, the mouse wheel moves the shelf under the pointer sideways.
  useEffect(() => {
    const rows = rowsRef.current.filter(Boolean) as HTMLDivElement[];
    const onWheel = (e: WheelEvent) => {
      const row = e.currentTarget as HTMLDivElement;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        row.scrollBy({ left: e.deltaY, behavior: "auto" });
      }
    };
    rows.forEach((r) => r.addEventListener("wheel", onWheel, { passive: false }));
    return () => rows.forEach((r) => r.removeEventListener("wheel", onWheel));
  }, []);

  // The arrows under the shelves move both shelves by most of a screen.
  const slide = (dir: 1 | -1) => {
    rowsRef.current.forEach((r) => r?.scrollBy({ left: dir * r.clientWidth * 0.8, behavior: "smooth" }));
  };

  return (
    <>
      <section className={styles.unit} ref={unitRef} aria-label="The library" data-pulled={pulled ? "" : undefined}>
        {SHELVES.map((row, r) => (
          <div className={styles.bay} key={r}>
            <div className={styles.back} aria-hidden="true" />
            <div className={styles.ceil} aria-hidden="true" />
            <div className={styles.board} aria-hidden="true" />
            <div
              className={styles.row}
              role="list"
              ref={(el) => { rowsRef.current[r] = el; }}
            >
              {row.map((slug, i) => {
                const f = BY_SLUG[slug];
                if (!f) return null;
                const [from, to] = dates(f);
                const isPulled = pulled === slug;
                return (
                  <div
                    role="listitem"
                    className={styles.slot}
                    key={slug}
                    data-slug={slug}
                    style={{ "--lean": `${LEAN[(i + r * 3) % LEAN.length]}deg`, zIndex: isPulled ? 60 : 10 + i } as CSSProperties}
                  >
                    <button
                      type="button"
                      data-cover=""
                      data-photo={photos[slug] ? "" : undefined}
                      className={`${styles.cover} ${isPulled ? styles.out : ""}`}
                      onClick={() => onPull(isPulled ? null : slug)}
                      aria-pressed={isPulled}
                      aria-label={`${f.name}, ${to ? `${from} to ${to}` : f.span ? from : `born ${from}`}. ${isPulled ? "Put it back" : "Take it off the shelf"}`}
                    >
                      <span className={styles.photo}>
                        {photos[slug] && near.has(slug) && <Image
                          src={`/figures/${photos[slug]}`}
                          alt=""
                          fill
                          sizes="(min-width: 900px) 240px, 170px"
                          loading={i < 3 ? "eager" : "lazy"}
                          style={{ objectFit: "cover", objectPosition: f.focus ?? "50% 28%" }}
                          onLoad={(e) => { e.currentTarget.style.opacity = "1"; }}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />}
                      </span>
                      <span className={styles.realm}>{f.realm}</span>
                      <span className={styles.plate}>
                        <span className={styles.plateName}>{f.name}</span>
                        <span className={styles.plateDates}>
                          {to ? (
                            <>
                              <span>{from}</span>
                              <i aria-hidden="true" />
                              <span>{to}</span>
                            </>
                          ) : f.span ? (
                            <span>{from}</span>
                          ) : (
                            <span>Born {from}</span>
                          )}
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
            <div className={styles.lip} aria-hidden="true" />
            <div className={`${styles.post} ${styles.postL}`} aria-hidden="true" />
            <div className={`${styles.post} ${styles.postR}`} aria-hidden="true" />
          </div>
        ))}
      </section>

      <div className={styles.count}>
        <button type="button" className={styles.swipe} onClick={() => slide(-1)} aria-label="Slide the shelves back">‹</button>
        <span>Swipe the shelves</span>
        <button type="button" className={styles.swipe} onClick={() => slide(1)} aria-label="Slide the shelves on">›</button>
        <span className={styles.total}>{FIGURES.length} volumes</span>
      </div>
    </>
  );
}
