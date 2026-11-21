/* The reading fonts a reader can choose. All twenty ship with the app (the font files are in
   public/fonts/reading, declared in components/book/reading-fonts.css), so they work offline and
   need nothing from outside. A phone downloads a font from the app only when it is used. */

export type ReadingFont = { id: string; name: string; css: string };

const serif = (fam: string) => `'Lor ${fam}', Georgia, serif`;
const sans = (fam: string) => `'Lor ${fam}', system-ui, sans-serif`;

export const FONTS: ReadingFont[] = [
  { id: "source", name: "Source Serif", css: "var(--font-reading), Georgia, serif" },
  { id: "literata", name: "Literata", css: serif("Literata") },
  { id: "merriweather", name: "Merriweather", css: serif("Merriweather") },
  { id: "lora", name: "Lora", css: serif("Lora") },
  { id: "ebgaramond", name: "EB Garamond", css: serif("EB Garamond") },
  { id: "crimson", name: "Crimson Pro", css: serif("Crimson Pro") },
  { id: "baskerville", name: "Libre Baskerville", css: serif("Libre Baskerville") },
  { id: "cormorant", name: "Cormorant", css: serif("Cormorant Garamond") },
  { id: "ptserif", name: "PT Serif", css: serif("PT Serif") },
  { id: "notoserif", name: "Noto Serif", css: serif("Noto Serif") },
  { id: "spectral", name: "Spectral", css: serif("Spectral") },
  { id: "alegreya", name: "Alegreya", css: serif("Alegreya") },
  { id: "playfair", name: "Playfair", css: serif("Playfair Display") },
  { id: "bitter", name: "Bitter", css: serif("Bitter") },
  { id: "robotoslab", name: "Roboto Slab", css: serif("Roboto Slab") },
  { id: "atkinson", name: "Atkinson Hyperlegible", css: sans("Atkinson Hyperlegible") },
  { id: "inter", name: "Inter", css: sans("Inter") },
  { id: "lato", name: "Lato", css: sans("Lato") },
  { id: "opensans", name: "Open Sans", css: sans("Open Sans") },
  { id: "nunito", name: "Nunito Sans", css: sans("Nunito Sans") },
];

export const fontById = (id: string) => FONTS.find((f) => f.id === id) ?? FONTS[0];
const family = (f: ReadingFont) => f.css.split(",")[0].replace(/'/g, "").trim();

/* load a font fully before the book is measured in it */
export async function loadFont(id: string) {
  const f = fontById(id);
  if (f.id === "source") return;
  const fam = family(f);
  await Promise.race([
    Promise.all([document.fonts.load(`16px "${fam}"`), document.fonts.load(`italic 16px "${fam}"`), document.fonts.load(`600 16px "${fam}"`)]),
    new Promise((r) => setTimeout(r, 4000)),
  ]);
}

/* the picker shows each name in its own font */
export const previewFamily = (f: ReadingFont) => f.css;
export function loadPreviews() { /* the fonts are part of the app: nothing to fetch from outside */ }
