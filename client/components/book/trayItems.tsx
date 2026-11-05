/* The tray's items, in their fixed order. Each opens its panel (components/book/Panels.tsx). */
import type { ReactNode } from "react";

export type TrayItemId = "contents" | "whoswho" | "ask" | "earn" | "settings";

export type TrayItem = { id: TrayItemId; label: string; icon: ReactNode };

const st = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const TRAY_ITEMS: TrayItem[] = [
  {
    id: "contents",
    label: "Contents",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h11.5a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2z" {...st} /><path d="M5 18a2 2 0 0 1 2-2h11.5M8.5 8h6.5M8.5 11h4.5" {...st} /></svg>,
  },
  {
    id: "whoswho",
    label: "Who's Who",
    // a case file with a face clipped to it
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h6l1.6 2h9.4v11h-17z" {...st} /><circle cx="10" cy="13" r="2" {...st} /><path d="M6.8 17.5c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M15 12.5h3M15 15h3" {...st} /></svg>,
  },
  {
    id: "ask",
    label: "Ask",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5h-2.5z" {...st} /><path d="M10.2 9a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1M12 13.4v.1" {...st} /></svg>,
  },
  {
    id: "earn",
    label: "Earn",
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="10" cy="7.5" rx="5.5" ry="2.3" {...st} /><path d="M4.5 7.5v4c0 1.3 2.5 2.3 5.5 2.3M4.5 11.5v4c0 1.3 2.5 2.3 5.5 2.3" {...st} /><ellipse cx="15.5" cy="13.5" rx="4.5" ry="2" {...st} /><path d="M11 13.5v3.5c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-3.5" {...st} /></svg>,
  },
  {
    id: "settings",
    label: "Settings",
    // "Aa": how the page reads
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 18.5L8 6l4.5 12.5M5.2 14h5.6" {...st} /><path d="M17.5 18.5V12M14.5 14.2a3 3 0 1 1 3 3.2" {...st} /></svg>,
  },
];
