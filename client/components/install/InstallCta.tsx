"use client";

import { useEffect, useRef, useState } from "react";
import { detectDevice, detectRoute, isStandalone, type BeforeInstallPromptEvent, type Device, type InstallRoute } from "@/lib/install";
import Phone3D from "./Phone3D";
import Laptop3D from "./Laptop3D";
import InstallGuide from "./InstallGuide";
import styles from "./install.module.css";

/* "Add to" on top of a 3D device. The device matches the visitor's: a phone on phones and
   tablets, a laptop on computers, so the picture always shows where the book will live.
   One button, the right behaviour for each device:
   Android and desktop Chrome or Edge get the browser's own install prompt; iPhone gets the
   animated guide; WhatsApp, Instagram and other in-app browsers are asked to open the page in a
   real browser first; a computer browser with no install support is told how to get it. */
export default function InstallCta() {
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [route, setRoute] = useState<InstallRoute | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [guide, setGuide] = useState<null | "ios" | "android" | "inapp" | "desktop">(null);

  useEffect(() => {
    const first = requestAnimationFrame(() => {
      setRoute((r) => r ?? detectRoute(false));
      setDevice(detectDevice());
    });
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

  if (route === "installed" || (route && isStandalone())) return null;

  const onClick = async () => {
    const r = route ?? detectRoute(false);
    if (r === "prompt" && promptRef.current) {
      const ev = promptRef.current;
      await ev.prompt();
      const { outcome } = await ev.userChoice;
      promptRef.current = null;
      setRoute(outcome === "accepted" ? "installed" : detectRoute(false));
      return;
    }
    setGuide(r === "prompt" || r === "installed" ? "android" : r);
  };

  const computer = device === "computer";

  return (
    <>
      <button
        type="button"
        className={styles.cta}
        onClick={onClick}
        aria-label={computer ? "Install The Laws of Ruin on this computer" : "Add The Laws of Ruin to your home screen"}
      >
        <span className={styles.ctaLabel}>Add to</span>
        {/* until we know the device, an empty space of the same size, so nothing jumps */}
        <span className={`${styles.device} ${device ? styles.deviceIn : ""}`} data-device={device ?? "unknown"}>
          {device === "phone" && <Phone3D />}
          {computer && <Laptop3D />}
        </span>
      </button>
      {guide && <InstallGuide mode={guide} onClose={() => setGuide(null)} />}
    </>
  );
}
