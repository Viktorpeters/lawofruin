// Works out how this visitor can add the app to their home screen.

export type InstallRoute =
  | "installed"     // already running as the installed app
  | "prompt"        // Chrome and Edge: the browser's own install prompt
  | "ios"           // iPhone or iPad: Share, then Add to Home Screen
  | "android"       // Android without a prompt: browser menu, then Install app
  | "inapp"         // inside WhatsApp, Instagram, Facebook, X, TikTok: open in a real browser first
  | "chrome"        // Samsung Internet: its installs are flagged by Play Protect, so install from Chrome
  | "desktop";      // a computer with no install support: open it on your phone

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function isStandalone() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

/* Which picture to show under "Add to": a phone or a laptop. Decided by the device itself, never
   by the width of the window, so a narrow desktop window still gets the laptop. A finger as the
   main pointer, or a phone or tablet in the user agent, means a phone. (Chrome's device mode in
   the inspector pretends to be a phone in both ways, so it shows the phone, which is what a real
   phone would see.) */
export type Device = "phone" | "computer";
export function detectDevice(): Device {
  const ua = navigator.userAgent;
  const handheld = /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle|Opera Mini/i.test(ua)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);   // iPad asking for the desktop site
  const finger = window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(hover: hover)").matches;
  return handheld || finger ? "phone" : "computer";
}

export function detectRoute(hasPrompt: boolean): InstallRoute {
  if (isStandalone()) return "installed";
  const ua = navigator.userAgent;
  const inApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Snapchat|musical_ly|BytedanceWebview|TikTok|Twitter|WhatsApp/i.test(ua);
  const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  if (inApp) return "inapp";
  // Samsung Internet offers an install, but Google Play Protect currently flags what it installs as
  // "built for an older version of Android". Chrome installs the same app cleanly, so send them there.
  if (android && /SamsungBrowser/i.test(ua)) return "chrome";
  if (hasPrompt) return "prompt";
  if (ios) return "ios";
  if (android) return "android";
  return "desktop";
}

/* Opens this same page in Chrome on Android. If Chrome is not installed, Android stays on the
   page instead (the fallback URL), so the visitor is never stranded. */
export function openInChrome() {
  const here = location.href;
  const target = here.replace(/^https?:\/\//, "");
  location.href = `intent://${target}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(here)};end`;
}
