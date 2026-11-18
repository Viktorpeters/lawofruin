"use client";

/* eslint-disable @next/next/no-img-element -- tiny local SVG icons, nothing for the optimiser to do */
import { useEffect, useState } from "react";
import styles from "./phone.module.css";

/* A small 3D iPhone in pure CSS: a front with a real home screen, a back, two metal sides
   with the action button, volume buttons and side button. It turns slowly from facing left
   to facing right and back, like someone holding it up to show you. Our icon sits on the
   home screen so the visitor sees where the book will live. */

const GRID = [
  { icon: "calendar.svg", label: "Calendar" },
  { icon: "photos.svg", label: "Photos" },
  { icon: "camera.svg", label: "Camera" },
  { icon: "mail.svg", label: "Mail" },
  { icon: "clock.svg", label: "Clock" },
  { icon: "maps.svg", label: "Maps" },
  { icon: "weather.svg", label: "Weather" },
  { icon: "notes.svg", label: "Notes" },
  { icon: "books.svg", label: "Books" },
  { icon: "laws-of-ruin.png", label: "Laws of Ruin", ours: true },
  { icon: "podcasts.svg", label: "Podcasts" },
  { icon: "wallet.svg", label: "Wallet" },
];
const DOCK = ["phone.svg", "safari.svg", "messages.svg", "music.svg"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function Phone3D() {
  const [today, setToday] = useState<{ day: string; date: number } | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const d = new Date();
      setToday({ day: DAYS[d.getDay()], date: d.getDate() });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <span className={styles.stage} aria-hidden="true">
      <span className={styles.ph}>
        <span className={styles.body}>
          <span className={styles.back} />
          <span className={styles.sideL}><i /></span>
          <span className={styles.sideR} />
          <span className={styles.face}>
            <span className={styles.screen}>
              <span className={styles.wall}>
                <span className={styles.status}><b>9:41</b><b className={styles.signal}><i /><i /><i /><i /></b></span>
                <span className={styles.island} />
                <span className={styles.grid}>
                  {GRID.map((a) => (
                    <span className={`${styles.app} ${a.ours ? styles.ours : ""}`} key={a.label}>
                      <span className={styles.tile}>
                        <img src={`/phone-icons/${a.icon}`} alt="" width={60} height={60} />
                        {a.icon === "calendar.svg" && today && (
                          <span className={styles.cal}><em>{today.day}</em><strong>{today.date}</strong></span>
                        )}
                      </span>
                      <span className={styles.label}>{a.label}</span>
                    </span>
                  ))}
                </span>
                <span className={styles.dots}><i /><i /><i /></span>
                <span className={styles.dock}>
                  {DOCK.map((d) => (
                    <span className={styles.tile} key={d}><img src={`/phone-icons/${d}`} alt="" width={60} height={60} /></span>
                  ))}
                </span>
                <span className={styles.glare} />
              </span>
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}
