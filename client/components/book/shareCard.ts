/* The share picture, design B "The Page": a real-looking book page on dark cloth, the line
   painted with the reader's pencil colour, the sentence before it (if wanted), the section and
   page at the top, "marked by <name>" in the margin in pen, and along the bottom the gold title,
   the mission line and the reader's own link. Drawn on a canvas, so it saves as a real PNG.
   Three sizes: Square (1:1), Post (4:5) and Story (9:16). */

import { cmp, type Highlight, type Spot } from "@/lib/book/highlights";

export type CardSize = "square" | "post" | "story";
export const SIZES: Record<CardSize, number> = { square: 1080, post: 1350, story: 1920 };

export type CardText = { line: string; before: string; head: string; page: string };

export type CardOpts = CardText & {
  size: CardSize;
  hex: string;            // the pencil colour
  name: string;           // "" for no signature
  showBefore: boolean;
  brand: string;          // THE LAWS OF RUIN, in the reader's language
  mission: string;
  url: string;
  markedBy: string;
};

/* ---------------- reading the highlighted words off the page ---------------- */

export function readHighlight(h: Highlight): CardText {
  const seen = new Set<string>();
  const words: HTMLElement[] = [];
  document.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => {
    const k = el.dataset.k!;
    if (seen.has(k)) return;
    seen.add(k);
    words.push(el);
  });
  const spot = (el: HTMLElement): Spot => { const [seq, tok] = el.dataset.k!.split(":").map(Number); return { seq, tok }; };
  const withSpace = (el: HTMLElement) => {
    const n = el.nextElementSibling as HTMLElement | null;
    return el.textContent + (n && el.nextSibling === n && n.hasAttribute("data-s") ? n.textContent ?? " " : " ");
  };

  let line = "";
  let before = "";
  let first: HTMLElement | null = null;
  for (const el of words) {
    const s = spot(el);
    if (cmp(s, h.a) >= 0 && cmp(s, h.b) <= 0) { line += withSpace(el); first ??= el; }
    else if (s.seq === h.a.seq && s.tok < h.a.tok) before += withSpace(el);
  }
  line = line.replace(/\s+/g, " ").trim();
  before = lastSentence(before.replace(/\s+/g, " ").trim());

  const page = first?.closest<HTMLElement>("[data-folio], [data-head]");
  return {
    line,
    before,
    head: page?.dataset.head ?? "",
    page: page?.dataset.folio ? `p. ${page.dataset.folio}` : "",
  };
}

/* what comes just before the highlight: if the highlight starts in the middle of a sentence,
   the start of that sentence ("He will give the largest share to"); if it starts a sentence,
   the whole sentence before it. Found without lookbehind (old iPhones cannot read it). */
function lastSentence(text: string): string {
  if (!text) return "";
  const ends: number[] = [0];
  for (let i = 0; i < text.length - 1; i++) {
    if (".!?".includes(text[i]) && text[i + 1] === " ") ends.push(i + 2);
    else if (".!?".includes(text[i]) && "”’\"".includes(text[i + 1]) && text[i + 2] === " ") ends.push(i + 3);
  }
  const tail = text.slice(ends[ends.length - 1]).trim();
  const out = tail || text.slice(ends[ends.length - 2] ?? 0).trim();
  return out.length <= 260 ? out : "";
}

/* ---------------- fonts ---------------- */

const cssFont = (v: string, fallback: string) => {
  const f = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  return f || fallback;
};

let penReady: Promise<void> | null = null;
function loadPen() {
  penReady ??= (async () => {
    try {
      const face = new FontFace("LorPen", "url(/fonts/NanumPenScript-Regular.ttf)");
      document.fonts.add(await face.load());
    } catch { /* the signature falls back to an italic serif */ }
  })();
  return penReady;
}

export async function fontsReady() {
  await loadPen();
  const F = fonts();
  await Promise.allSettled([
    document.fonts.load(`500 40px ${F.reading}`),
    document.fonts.load(`40px ${F.reading}`),
    document.fonts.load(`700 40px ${F.display}`),
    document.fonts.load(`italic 30px ${F.accent}`),
    document.fonts.load(`20px ${F.mono}`),
  ]);
}

function fonts() {
  return {
    reading: cssFont("--font-reading", "Georgia, serif"),
    display: cssFont("--font-display", "Georgia, serif"),
    accent: cssFont("--font-accent", "Georgia, serif"),
    mono: cssFont("--font-mono", "monospace"),
    pen: "LorPen, cursive",
  };
}

/* ---------------- drawing ---------------- */

/* letters spaced apart, the way the mono labels are set in the book */
function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, gap: number, align: "left" | "right" = "left") {
  const w = [...text].reduce((n, ch) => n + ctx.measureText(ch).width + gap, -gap);
  let cx = align === "right" ? x - w : x;
  for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + gap; }
  return w;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > width && cur) { lines.push(cur); cur = w; }
    else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

export function drawCard(canvas: HTMLCanvasElement, o: CardOpts) {
  const F = fonts();
  const W = 1080;
  const H = SIZES[o.size];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  // the cloth behind the page
  ctx.fillStyle = "#1a1612";
  ctx.fillRect(0, 0, W, H);
  const cloth = ctx.createRadialGradient(W * 0.5, H * 0.35, 50, W * 0.5, H * 0.35, H);
  cloth.addColorStop(0, "rgba(120, 40, 32, 0.22)");
  cloth.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = cloth;
  ctx.fillRect(0, 0, W, H);

  // the page, with its top right corner folded down
  const px = 70, py = 70, pw = W - 140, ph = H - 70 - 230, fold = 80;
  const pagePath = () => {
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + pw - fold, py);
    ctx.lineTo(px + pw, py + fold);
    ctx.lineTo(px + pw, py + ph);
    ctx.lineTo(px, py + ph);
    ctx.closePath();
  };
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 80;
  ctx.shadowOffsetY = 30;
  pagePath();
  ctx.fillStyle = "#efe7d6";
  ctx.fill();
  ctx.restore();

  ctx.save();
  pagePath();
  ctx.clip();
  const glow = ctx.createRadialGradient(px + pw * 0.2, py + ph * 0.1, 0, px + pw * 0.2, py + ph * 0.1, pw * 0.8);
  glow.addColorStop(0, "rgba(255, 255, 255, 0.5)");
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(px, py, pw, ph);
  const age = ctx.createRadialGradient(px + pw * 0.9, py + ph * 0.9, 0, px + pw * 0.9, py + ph * 0.9, pw * 0.7);
  age.addColorStop(0, "rgba(120, 90, 50, 0.14)");
  age.addColorStop(1, "rgba(120, 90, 50, 0)");
  ctx.fillStyle = age;
  ctx.fillRect(px, py, pw, ph);
  // a fine grain, so it reads as paper, not a flat colour (the same grain every time)
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = `rgba(90, 70, 45, ${0.02 + rnd() * 0.04})`;
    ctx.fillRect(px + rnd() * pw, py + rnd() * ph, 1.4, 1.4);
  }
  ctx.restore();

  // the folded corner, its underside a shade darker
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = -4;
  ctx.shadowOffsetY = 4;
  ctx.beginPath();
  ctx.moveTo(px + pw - fold, py);
  ctx.lineTo(px + pw - fold, py + fold);
  ctx.lineTo(px + pw, py + fold);
  ctx.closePath();
  ctx.fillStyle = "#d8ccb3";
  ctx.fill();
  ctx.restore();

  const ix = px + 96, iw = pw - 192;

  // the top line: section on the left, page on the right, then a hairline
  ctx.fillStyle = "#7a6a58";
  ctx.font = `19px ${F.mono}`;
  const [part, title] = o.head.split(" · ");
  spaced(ctx, (part ?? "").toUpperCase(), ix, py + 118, 4.6);
  if (title) spaced(ctx, title.toUpperCase(), px + pw - 96 - fold * 0.4, py + 118, 4.6, "right");
  ctx.fillStyle = "rgba(90, 70, 50, 0.25)";
  ctx.fillRect(ix, py + 142, iw, 1.5);

  // the words: as large as the page allows
  const top = py + 142 + 70;
  const bottom = py + ph - (o.name ? 170 : 110);
  const room = bottom - top;
  const before = o.showBefore ? o.before : "";
  let size = o.size === "story" ? 88 : o.size === "post" ? 78 : 70;
  let lines: string[] = [], ctxLines: string[] = [], lead = 0, cSize = 0, cLead = 0, total = 0;
  for (; size >= 30; size -= 2) {
    ctx.font = `500 ${size}px ${F.reading}`;
    lines = wrap(ctx, o.line, iw);
    lead = size * 1.42;
    cSize = Math.round(size * 0.74);
    cLead = cSize * 1.58;
    ctx.font = `${cSize}px ${F.reading}`;
    ctxLines = before ? wrap(ctx, before, iw) : [];
    total = ctxLines.length * cLead + (ctxLines.length ? 24 : 0) + lines.length * lead;
    if (total <= room) break;
  }
  // set the block a little above the middle of the space, like a real page
  let y = top + Math.max(0, (room - total) * 0.42);

  ctx.fillStyle = "#3a322b";
  ctx.font = `${cSize}px ${F.reading}`;
  for (const l of ctxLines) { y += cLead; ctx.fillText(l, ix, y - cLead * 0.28); }
  if (ctxLines.length) y += 24;

  ctx.font = `500 ${size}px ${F.reading}`;
  for (const l of lines) {
    y += lead;
    const base = y - lead * 0.3;
    const w = ctx.measureText(l).width;
    // the pencil stroke: soft at both ends, a touch uneven, like a real marker
    const band = ctx.createLinearGradient(ix - 8, 0, ix + w + 8, 0);
    band.addColorStop(0, hexA(o.hex, 0));
    band.addColorStop(0.015, hexA(o.hex, 0.55));
    band.addColorStop(0.6, hexA(o.hex, 0.44));
    band.addColorStop(0.985, hexA(o.hex, 0.55));
    band.addColorStop(1, hexA(o.hex, 0));
    ctx.fillStyle = band;
    ctx.beginPath();
    ctx.moveTo(ix - 8, base - size * 0.8);
    ctx.lineTo(ix + w + 8, base - size * 0.84);
    ctx.lineTo(ix + w + 6, base + size * 0.24);
    ctx.lineTo(ix - 6, base + size * 0.22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#231d18";
    ctx.fillText(l, ix, base);
  }

  // the margin: "marked by <name>" in pen, and the page number
  if (o.name) {
    ctx.save();
    ctx.translate(ix, py + ph - 92);
    ctx.rotate(-0.05);
    ctx.fillStyle = "#a3392f";
    ctx.font = `62px ${F.pen}`;
    ctx.fillText(`— ${o.markedBy} ${o.name}`, 0, 0);
    ctx.restore();
  }
  if (o.page) {
    ctx.fillStyle = "#7a6a58";
    ctx.font = `italic 30px ${F.display}`;
    ctx.textAlign = "right";
    ctx.fillText(o.page, px + pw - 96, py + ph - 92);
    ctx.textAlign = "left";
  }

  // along the bottom: the gold title, the mission and the reader's link
  const fy = H - 70 - 48;
  const foil = ctx.createLinearGradient(70, fy - 40, 70, fy + 6);
  foil.addColorStop(0, "#f7e6b4");
  foil.addColorStop(0.45, "#b48743");
  foil.addColorStop(0.6, "#fff3cf");
  foil.addColorStop(1, "#9a7232");
  ctx.fillStyle = foil;
  ctx.font = `700 38px ${F.display}`;
  const brandW = spaced(ctx, o.brand.toUpperCase(), 70, fy, 4.4);

  // the mission line takes the room left beside the title, a little smaller if it must
  const free = W - 140 - brandW - 48;
  let ms = 30;
  ctx.font = `italic ${ms}px ${F.accent}`;
  while (ms > 20 && ctx.measureText(o.mission).width > free) { ms -= 1; ctx.font = `italic ${ms}px ${F.accent}`; }
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(237, 230, 216, 0.82)";
  ctx.fillText(o.mission, W - 70, fy - 18);
  ctx.textAlign = "left";
  ctx.fillStyle = "#c9a56b";
  ctx.font = `20px ${F.mono}`;
  spaced(ctx, o.url, W - 70, fy + 20, 2.2, "right");
}

export function cardBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((r) => canvas.toBlob(r, "image/png"));
}
