/* The tray's items, in their fixed order. Each opens its panel (components/book/Panels.tsx).
   Ask is not in the tray: it has its own button, always in reach, just above the tray. */
import type { ReactNode } from "react";

export type TrayItemId = "contents" | "whoswho" | "purchases" | "earn" | "appearance";

/* icon: the round glass button on the right (unchanged).
   mark: the small picture at the left of the label card. */
export type TrayItem = { id: TrayItemId; icon: ReactNode; mark: ReactNode };

const st = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const TRAY_ITEMS: TrayItem[] = [
  {
    id: "contents",
    // a closed book, its page lines drawn in dashes
    mark: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5h12.5v17H7a2 2 0 0 1-2-2z" {...st} /><path d="M5 18.5a2 2 0 0 1 2-2h10.5" {...st} /><path d="M8.5 7.5h6M8.5 10.5h6M8.5 13.5h4" {...st} strokeDasharray="1.6 1.6" /></svg>,
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5h11.5a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2z" {...st} /><path d="M5 18a2 2 0 0 1 2-2h11.5M8.5 8h6.5M8.5 11h4.5" {...st} /></svg>,
  },
  {
    id: "whoswho",
    // a profile in a circle: head and shoulders
    mark: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" {...st} /><circle cx="12" cy="9.8" r="3" {...st} /><path d="M6.4 18.6c1-2.4 3-3.7 5.6-3.7s4.6 1.3 5.6 3.7" {...st} /></svg>,
    // a case file with a face clipped to it
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5h6l1.6 2h9.4v11h-17z" {...st} /><circle cx="10" cy="13" r="2" {...st} /><path d="M6.8 17.5c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M15 12.5h3M15 15h3" {...st} /></svg>,
  },
  {
    id: "purchases",
    // a shopping bag
    mark: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12.5H6z" {...st} /><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" {...st} /></svg>,
    // a receipt with a torn foot
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" {...st} /><path d="M9 8h6M9 11h6M9 14h3.5" {...st} /></svg>,
  },
  {
    id: "earn",
    // three gold coins with depth: two stacked, one standing in front
    mark: (
      <svg viewBox="2 5.5 19.5 15.5" aria-hidden="true">
        <defs>
          <linearGradient id="coinFace" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff3c4" /><stop offset=".45" stopColor="#f2c14e" /><stop offset="1" stopColor="#b9801c" /></linearGradient>
          <linearGradient id="coinSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a5a10" /><stop offset=".5" stopColor="#d79b2e" /><stop offset="1" stopColor="#7a4e0c" /></linearGradient>
        </defs>
        <path d="M2.5 14.5v2.2c0 1.3 2.3 2.3 5.2 2.3s5.2-1 5.2-2.3v-2.2z" fill="url(#coinSide)" />
        <ellipse cx="7.7" cy="14.5" rx="5.2" ry="2.3" fill="url(#coinFace)" />
        <path d="M2.5 10.8v2.2c0 1.3 2.3 2.3 5.2 2.3s5.2-1 5.2-2.3v-2.2z" fill="url(#coinSide)" />
        <ellipse cx="7.7" cy="10.8" rx="5.2" ry="2.3" fill="url(#coinFace)" />
        <ellipse cx="16.2" cy="13.6" rx="4.6" ry="5.6" fill="url(#coinSide)" />
        <ellipse cx="15.4" cy="13.6" rx="4.4" ry="5.6" fill="url(#coinFace)" />
        <ellipse cx="15.4" cy="13.6" rx="2.7" ry="3.6" fill="none" stroke="#a8701a" strokeWidth=".9" />
      </svg>
    ),
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="10" cy="7.5" rx="5.5" ry="2.3" {...st} /><path d="M4.5 7.5v4c0 1.3 2.5 2.3 5.5 2.3M4.5 11.5v4c0 1.3 2.5 2.3 5.5 2.3" {...st} /><ellipse cx="15.5" cy="13.5" rx="4.5" ry="2" {...st} /><path d="M11 13.5v3.5c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-3.5" {...st} /></svg>,
  },
  {
    id: "appearance",
    // a circle of colour
    mark: <span style={{ display: "block", width: 16, height: 16, borderRadius: "50%", background: "conic-gradient(from 200deg, #ff5f6d, #ffc371, #f9f871, #47e5bc, #4facfe, #a06cff, #ff5f6d)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.35)" }} />,
    // "Aa": how the page reads
    icon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 18.5L8 6l4.5 12.5M5.2 14h5.6" {...st} /><path d="M17.5 18.5V12M14.5 14.2a3 3 0 1 1 3 3.2" {...st} /></svg>,
  },
];

/* Ask's own button: a speech mark with a question in it */
export const ASK_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5h-2.5z" {...st} /><path d="M10.2 9a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1M12 13.4v.1" {...st} /></svg>
);
