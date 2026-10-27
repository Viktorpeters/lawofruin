"use client";

import { useEffect, useRef, useState } from "react";
import { detectRoute, isStandalone, type BeforeInstallPromptEvent, type InstallRoute } from "@/lib/install";
import PhoneGlyph from "./PhoneGlyph";
import InstallGuide from "./InstallGuide";
import styles from "./install.module.css";

/* "Add to" beside a small 3D phone. One button, the right behaviour for each device. */
export default function InstallCta() {
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [route, setRoute] = useState<InstallRoute | null>(null);
  const [guide, setGuide] = useState<null | "ios" | "android" | "inapp" | "desktop">(null);

  useEffect(() => {
    const first = requestAnimationFrame(() => setRoute((r) => r ?? detectRoute(false)));
    const onPrompt = (e: Event) => {
      e.preventDefault();                       // keep it for our own button
      promptRef.current = e as BeforeInstallPromptEvent;
      setRoute(detectRoute(true));
    };
    const onInstalled = () => { promptRef.current = null; setRoute("installed"); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!route || route === "installed" || isStandalone()) return null;

  const onClick = async () => {
    if (route === "prompt" && promptRef.current) {
      const ev = promptRef.current;
      await ev.prompt();
      const { outcome } = await ev.userChoice;
      promptRef.current = null;
      setRoute(outcome === "accepted" ? "installed" : detectRoute(false));
      return;
    }
    setGuide(route === "prompt" ? "android" : (route as "ios" | "android" | "inapp" | "desktop"));
  };

  return (
    <>
      <button className={styles.cta} onClick={onClick} aria-label="Add The Laws of Ruin to your home screen">
        <span className={styles.ctaLabel}>Add to</span>
        <PhoneGlyph />
      </button>
      {guide && <InstallGuide mode={guide} onClose={() => setGuide(null)} />}
    </>
  );
}
