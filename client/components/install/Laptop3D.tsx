"use client";

/* eslint-disable @next/next/no-img-element -- tiny local icons, nothing for the optimiser to do */
import styles from "./laptop.module.css";

/* The desktop twin of the 3D phone: a small laptop in pure CSS, lid open, keyboard deck lying
   flat. On its screen the book is already installed: its own window with the book's mark,
   and our icon lit on the taskbar, so a visitor on a computer sees where the book will live.
   It turns slowly from left to right and back, like the phone. */

const BAR = ["mail.svg", "photos.svg", "music.svg", "notes.svg"];

export default function Laptop3D() {
  return (
    <span className={styles.stage} aria-hidden="true">
      <span className={styles.lap}>
        {/* the keyboard deck, lying flat in front of the hinge */}
        <span className={styles.deck}>
          <span className={styles.keys}>
            {Array.from({ length: 48 }, (_, i) => <i key={i} />)}
          </span>
          <span className={styles.pad} />
        </span>
        <span className={styles.lip} />

        {/* the lid, leaning back a little */}
        <span className={styles.lid}>
          <span className={styles.lidBack} />
          <span className={styles.bezel}>
            <span className={styles.cam} />
            <span className={styles.screen}>
              <span className={styles.win}>
                <span className={styles.winBar}>
                  <span className={styles.winDots}><i /><i /><i /></span>
                </span>
                <span className={styles.winBody}>
                  <img className={styles.winIcon} src="/phone-icons/laws-of-ruin.png" alt="" width={64} height={64} />
                  <span className={styles.rule} />
                </span>
              </span>
              <span className={styles.bar}>
                {BAR.map((b) => (
                  <span className={styles.barIcon} key={b}><img src={`/phone-icons/${b}`} alt="" width={20} height={20} /></span>
                ))}
                <span className={`${styles.barIcon} ${styles.ours}`}>
                  <img src="/phone-icons/laws-of-ruin.png" alt="" width={20} height={20} />
                </span>
              </span>
              <span className={styles.glare} />
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}
