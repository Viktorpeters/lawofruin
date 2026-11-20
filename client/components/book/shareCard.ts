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

type Fonts = ReturnType<typeof fonts>;

/* the cloth, the page with its folded corner, and the section line at the top */
function paper(ctx: CanvasRenderingContext2D, W: number, H: number, head: string, F: Fonts) {
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
  const [part, title] = head.split(" · ");
  spaced(ctx, (part ?? "").toUpperCase(), ix, py + 118, 4.6);
  if (title) spaced(ctx, title.toUpperCase(), px + pw - 96 - fold * 0.4, py + 118, 4.6, "right");
  ctx.fillStyle = "rgba(90, 70, 50, 0.25)";
  ctx.fillRect(ix, py + 142, iw, 1.5);
  return { px, py, pw, ph, ix, iw, fold };
}

/* along the bottom: the gold title, the mission and the reader's link */
function footer(ctx: CanvasRenderingContext2D, W: number, H: number, o: { brand: string; mission: string; url: string }, F: Fonts) {
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

export function drawCard(canvas: HTMLCanvasElement, o: CardOpts) {
  const F = fonts();
  const W = 1080;
  const H = SIZES[o.size];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";

  const { px, py, pw, ph, ix, iw, fold } = paper(ctx, W, H, o.head, F);

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

  footer(ctx, W, H, o, F);
}

export function cardBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((r) => canvas.toBlob(r, "image/png"));
}

/* ---------------- the note pictures ----------------
   margin (N1): the paragraph with the line underlined in red pencil, a hand-drawn arrow curling
                down to the reader's comment in red pen, signed "— Victor's note";
   reply  (N2): the line alone, underlined; a red thread drops to a small paper card holding the
                note in elegant italics, with the reader's name and the date;
   page   (N3): a note written on the page itself, large, in pen, signed. */

export type NoteStyle = "margin" | "reply" | "page";

export type NoteOpts = {
  size: CardSize;
  style: NoteStyle;
  quote: string;
  before: string;
  head: string;
  page: string;
  text: string;
  date: string;
  signature: string;      // "Victor's note", or "" for no name
  name: string;           // "Victor", for the page note's signature
  label: string;          // "A reader's page note"
  brand: string;
  mission: string;
  url: string;
};

/* long notes read badly in handwriting: past this length a line note uses the Reply design */
export const MARGIN_MAX = 180;

const RED = "#a3392f";

/* a note too long for the picture even at its smallest size: keep what fits and end on "…"
   (the full note stays in the app) */
function clamp(ctx: CanvasRenderingContext2D, lines: string[], max: number, width: number): string[] {
  if (lines.length <= max) return lines;
  const out = lines.slice(0, Math.max(1, max));
  let last = out[out.length - 1];
  while (last.includes(" ") && ctx.measureText(`${last}…`).width > width) last = last.slice(0, last.lastIndexOf(" "));
  out[out.length - 1] = `${last.replace(/[\s,;:.]+$/, "")}…`;
  return out;
}
const PENCIL = "#b8322a";

export function drawNote(canvas: HTMLCanvasElement, o: NoteOpts) {
  const F = fonts();
  const W = 1080;
  const H = SIZES[o.size];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.textBaseline = "alphabetic";
  const { px, py, pw, ph, ix, iw } = paper(ctx, W, H, o.head, F);
  const top = py + 142 + 64;
  const bottom = py + ph - 130;

  // the page number, bottom right of the page
  const folio = () => {
    if (!o.page) return;
    ctx.fillStyle = "#7a6a58";
    ctx.font = `italic 30px ${F.display}`;
    ctx.textAlign = "right";
    ctx.fillText(o.page, px + pw - 96, py + ph - 92);
    ctx.textAlign = "left";
  };

  // a straight pencil underline under a run of text, slightly uneven like a hand-drawn one
  const underline = (x: number, y: number, w: number) => {
    ctx.strokeStyle = PENCIL;
    ctx.lineWidth = 3.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 2, y);
    ctx.quadraticCurveTo(x + w * 0.5, y + 1.6, x + w + 2, y - 0.8);
    ctx.stroke();
  };

  if (o.style === "page") {
    ctx.fillStyle = RED;
    ctx.font = `19px ${F.mono}`;
    spaced(ctx, o.label.toUpperCase(), ix, top + 10, 4.6);
    let size = o.size === "story" ? 82 : 76;
    let lines: string[] = [];
    for (; size >= 40; size -= 2) {
      ctx.font = `${size}px ${F.pen}`;
      lines = wrap(ctx, o.text, iw);
      if (lines.length * size * 1.08 <= bottom - top - 60) break;
    }
    ctx.font = `${size}px ${F.pen}`;
    lines = clamp(ctx, lines, Math.floor((bottom - top - 60) / (size * 1.08)), iw);
    ctx.fillStyle = "#2a2420";
    let y = top + 60;
    for (const l of lines) { y += size * 1.08; ctx.fillText(l, ix, y - size * 0.22); }
    if (o.name) {
      ctx.fillStyle = RED;
      ctx.font = `48px ${F.pen}`;
      ctx.fillText(`— ${o.name}`, ix, py + ph - 92);
    }
    folio();
    footer(ctx, W, H, o, F);
    return;
  }

  if (o.style === "margin") {
    // the paragraph: the sentence before in soft ink, the line in dark ink, underlined
    const quoteW = iw;
    let size = o.size === "story" ? 44 : 38;
    let words: { w: string; hot: boolean }[] = [];
    let rows: { w: string; hot: boolean }[][] = [];
    let penSize = 62;
    let penLines: string[] = [];
    for (; size >= 30; size -= 2) {
      words = [
        ...(o.before ? o.before.split(" ").map((w) => ({ w, hot: false })) : []),
        ...o.quote.split(" ").map((w) => ({ w, hot: true })),
      ];
      ctx.font = `${size}px ${F.reading}`;
      rows = [];
      let row: typeof words = [];
      let rowW = 0;
      const sp = ctx.measureText(" ").width;
      for (const wd of words) {
        const ww = ctx.measureText(wd.w).width;
        if (row.length && rowW + sp + ww > quoteW) { rows.push(row); row = []; rowW = 0; }
        rowW += (row.length ? sp : 0) + ww;
        row.push(wd);
      }
      if (row.length) rows.push(row);
      penSize = Math.round(size * 1.62);
      ctx.font = `${penSize}px ${F.pen}`;
      penLines = wrap(ctx, o.text, iw - 150);
      const need = rows.length * size * 1.62 + 110 + penLines.length * penSize * 1.02;
      if (need <= bottom - top) break;
    }

    // whatever room the paragraph leaves is the note's; a longer note ends on "…"
    ctx.font = `${penSize}px ${F.pen}`;
    penLines = clamp(ctx, penLines, Math.floor((bottom - top - rows.length * size * 1.62 - 110) / (penSize * 1.02)), iw - 150);

    let y = top;
    const lead = size * 1.62;
    ctx.font = `${size}px ${F.reading}`;
    const sp = ctx.measureText(" ").width;
    let lastLine = { x: ix, y: top };
    for (const row of rows) {
      y += lead;
      const base = y - lead * 0.3;
      let x = ix;
      let runStart = -1;
      for (let i = 0; i < row.length; i++) {
        const wd = row[i];
        const ww = ctx.measureText(wd.w).width;
        ctx.fillStyle = wd.hot ? "#231d18" : "#6a5d50";
        ctx.fillText(wd.w, x, base);
        if (wd.hot && runStart < 0) runStart = x;
        const next = row[i + 1];
        if (wd.hot && (!next || !next.hot)) { underline(runStart, base + size * 0.2, x + ww - runStart); runStart = -1; lastLine = { x: ix, y: base + size * 0.2 }; }
        x += ww + sp;
      }
    }

    // the arrow: from under the line, curling down and right into the note
    const ax = lastLine.x + 40;
    const ay = lastLine.y + 18;
    const tx = ax + 110;
    const ty = ay + 104;
    ctx.strokeStyle = RED;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.bezierCurveTo(ax - 10, ay + 60, ax + 30, ty, tx, ty);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tx - 15, ty - 13);
    ctx.lineTo(tx + 1, ty);
    ctx.lineTo(tx - 17, ty + 10);
    ctx.stroke();

    // the note in red pen, slightly tilted, as if written in the book
    ctx.save();
    ctx.translate(tx + 14, ty - penSize * 0.62);
    ctx.rotate(-0.035);
    ctx.fillStyle = RED;
    ctx.font = `${penSize}px ${F.pen}`;
    let py2 = 0;
    for (const l of penLines) { py2 += penSize * 1.02; ctx.fillText(l, 0, py2 - penSize * 0.3); }
    ctx.restore();

    if (o.signature) {
      ctx.fillStyle = "#7a6a58";
      ctx.font = `46px ${F.pen}`;
      ctx.fillText(`— ${o.signature}`, ix, py + ph - 92);
    }
    folio();
    footer(ctx, W, H, o, F);
    return;
  }

  // reply: the line alone, underlined, then a thread to a small card with the note
  let qs = o.size === "story" ? 54 : 48;
  let qLines: string[] = [];
  let ns = 46;
  let nLines: string[] = [];
  const cardX = ix + 54;
  const cardW = px + pw - 96 - cardX;
  for (; qs >= 36; qs -= 2) {   // never smaller than easy reading; past that the note ends on "…"
    ctx.font = `${qs}px ${F.reading}`;
    qLines = wrap(ctx, o.quote, iw);
    ns = Math.round(qs * 0.96);
    ctx.font = `italic 500 ${ns}px ${F.display}`;
    nLines = wrap(ctx, o.text, cardW - 80);
    const need = qLines.length * qs * 1.48 + 90 + 110 + nLines.length * ns * 1.24 + 40;
    if (need <= bottom - top) break;
  }
  ctx.font = `italic 500 ${ns}px ${F.display}`;
  nLines = clamp(ctx, nLines, Math.floor((bottom - top - qLines.length * qs * 1.48 - 240) / (ns * 1.24)), cardW - 80);
  let y = top;
  ctx.font = `${qs}px ${F.reading}`;
  for (const l of qLines) {
    y += qs * 1.48;
    const base = y - qs * 0.36;
    ctx.fillStyle = "#231d18";
    ctx.fillText(l, ix, base);
    underline(ix, base + qs * 0.2, ctx.measureText(l).width);
  }
  const threadTop = y + 6;
  const cardY = threadTop + 90;
  const cardH = 110 + nLines.length * ns * 1.24;

  // the thread: a short tick under the line, then down to a dot at the card
  ctx.fillStyle = PENCIL;
  ctx.fillRect(ix + 10, threadTop - 2, 18, 2.4);
  ctx.fillRect(ix + 18, threadTop, 2.4, cardY + 26 - threadTop);
  ctx.beginPath();
  ctx.arc(ix + 19.2, cardY + 30, 8, 0, Math.PI * 2);
  ctx.fill();

  // the card: lighter paper, a soft shadow, sharp corners
  ctx.save();
  ctx.shadowColor = "rgba(60, 40, 20, 0.18)";
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = "#f8f3e8";
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.restore();
  ctx.strokeStyle = "rgba(90, 70, 50, 0.18)";
  ctx.lineWidth = 1;
  ctx.strokeRect(cardX + 0.5, cardY + 0.5, cardW - 1, cardH - 1);
  ctx.font = `17px ${F.mono}`;
  ctx.fillStyle = RED;
  spaced(ctx, (o.signature || o.label).toUpperCase(), cardX + 40, cardY + 52, 4);
  ctx.fillStyle = "#9a8e7c";
  spaced(ctx, o.date.toUpperCase(), cardX + cardW - 40, cardY + 52, 4, "right");
  ctx.fillStyle = "#231d18";
  ctx.font = `italic 500 ${ns}px ${F.display}`;
  let ny = cardY + 70;
  for (const l of nLines) { ny += ns * 1.24; ctx.fillText(l, cardX + 40, ny - ns * 0.3); }

  folio();
  footer(ctx, W, H, o, F);
}
