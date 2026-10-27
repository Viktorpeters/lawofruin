import type { Metadata } from "next";
import styles from "./app.module.css";

export const metadata: Metadata = { title: "The Laws of Ruin" };

// Where the home-screen icon opens. A holding screen until the app itself is designed.
export default function AppHome() {
  return (
    <main className={styles.wrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/loader/hourglass.webp" alt="" width="140" height="140" className={styles.glass} />
      <h1 className={styles.title}>The library opens on 7 December.</h1>
      <p className={styles.note}>You are early. Keep this icon; it is your way in.</p>
    </main>
  );
}
