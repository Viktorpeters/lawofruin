import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

/* Fonts live in client/fonts/. Paths are relative to this file (client/app/layout.tsx). */

// Display: law titles and headlines
const display = localFont({
  src: [
    { path: "../fonts/Cormorant-Garamound/CormorantGaramond-VariableFont_wght.ttf", style: "normal", weight: "300 700" },
    { path: "../fonts/Cormorant-Garamound/CormorantGaramond-Italic-VariableFont_wght.ttf", style: "italic", weight: "300 700" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

// Reading text inside the book
const reading = localFont({
  src: [
    { path: "../fonts/Literata/Literata-VariableFont_opsz,wght.ttf", style: "normal", weight: "200 900" },
    { path: "../fonts/Literata/Literata-Italic-VariableFont_opsz,wght.ttf", style: "italic", weight: "200 900" },
  ],
  variable: "--font-reading",
  preload: false,           // only the reader uses it, so the hero does not wait for it
  display: "swap",
  fallback: ["Georgia", "serif"],
});

// Parent font: navigation, buttons, captions, all UI text
const ui = localFont({
  src: "../fonts/parent-fonts/PlusJakartaSans-VariableFont_wght.ttf",
  weight: "200 800",
  variable: "--font-ui",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

// Case-file details: dates, fates, labels
const mono = localFont({
  src: "../fonts/parent-fonts/IBMPlexMono-Regular.ttf",
  weight: "400",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
});

// Small italic pull quotes and taglines
const accent = localFont({
  src: [
    { path: "../fonts/parent-fonts/InstrumentSerif-Regular.ttf", style: "normal", weight: "400" },
    { path: "../fonts/parent-fonts/InstrumentSerif-Italic.ttf", style: "italic", weight: "400" },
  ],
  variable: "--font-accent",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "The Laws of Ruin",
  description: "An investigation into the rise and fall of the most powerful men of their age. For those who seek power, and those who must keep it.",
  applicationName: "The Laws of Ruin",
  appleWebApp: { capable: true, title: "Laws of Ruin", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0B0A08",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${reading.variable} ${ui.variable} ${mono.variable} ${accent.variable}`}>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
