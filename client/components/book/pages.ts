/* Builds the book: the fixed pages (cover, title, dedication...) and the flowing text
   (copyright, Preface, Contents), cut into pages that fit the reader's screen exactly.
   Pages are plain HTML so the page-curl library can own them; taps on names, words and
   buttons are caught by one listener in Book.tsx (each carries a data- attribute). */
import s from "./book.module.css";
import { glassSvg } from "./glass";
import { tokenize, type Token } from "@/lib/book/marks";
import { PREFACE } from "@/lib/book/preface";
import { PARTS, PASS_LINE } from "@/lib/book/contents";
import { TITLE, COPYRIGHT, DEDICATION, EPIGRAPHS, FOR_THOSE, WHICH, END } from "@/lib/book/front";

export type Anchor = { seq: number; tok: number };

export type BuiltPage = {
  html: string;          // the inside of the page
  hard?: boolean;        // the two boards of the cover
  dark?: boolean;        // the cover: the icons over it turn light
  head?: string;         // running head
  folio?: boolean;       // show a page number
  flow?: boolean;        // cut from flowing text: keeps the padded text area it was measured in
  secs: string[];        // section ids that appear on this page, for jumps
  start: Anchor;         // where this page begins, to keep the reader's place when pages change
};

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------------- fixed pages ---------------- */

function cover(): string {
  return `<div class="${s.board}">
    <div class="${s.frame}"></div><div class="${s.frame} ${s.frame2}"></div>
    <div class="${s.coverStack}">
      <div>
        <span class="${s.foil} ${s.coverKicker}">INVESTIGATION I</span>
        <div class="${s.foil} ${s.coverTitle}">THE<br>LAWS OF<br>RUIN</div>
      </div>
      <span data-emblem>${glassSvg("foil", 64, `class="${s.emblem}"`)}</span>
      <div>
        <span class="${s.foil} ${s.coverSub}">The Fall of Kings</span><br>
        <span class="${s.foil} ${s.coverHouse}">ORION LEARNING INNOVATIONS</span>
      </div>
    </div>
    <div class="${s.lift}"></div>
  </div>`;
}

function backCover(): string {
  return `<div class="${s.board}"><div class="${s.frame}"></div><div class="${s.backMark}">${glassSvg("foil", 34)}</div></div>`;
}

function halfTitle(): string {
  return `<div class="${s.center}">${glassSvg("#1d1812", 22)}<div class="${s.halfTitle}">The Laws of Ruin</div></div>`;
}

function titlePage(): string {
  return `<div class="${s.center}" style="justify-content:flex-start;padding-top:18vh">
    <div class="${s.mono} ${s.red}">${esc(TITLE.series)}</div>
    <div class="${s.bigTitle}">${TITLE.name.map(esc).join("<br>")}</div>
    <div class="${s.subTitle}">${esc(TITLE.sub)}</div>
    <div class="${s.shortRule}"></div>
    ${glassSvg("#1d1812", 18)}
    <div class="${s.by}" style="margin-top:22px">${esc(TITLE.by)}</div>
    <div class="${s.house}">${esc(TITLE.house)}</div>
    <div class="${s.mono}" style="margin-top:6px">${esc(TITLE.team)}</div>
    <div class="${s.mono} ${s.bottomLine}">${esc(TITLE.place)}</div>
  </div>`;
}

function dedication(): string {
  return `<div class="${s.center}" style="justify-content:flex-start;padding-top:26vh">
    <p class="${s.dedic}">${DEDICATION.map(esc).join("<br>")}</p></div>`;
}

function epigraph(): string {
  const [a, b] = EPIGRAPHS;
  return `<div class="${s.center}" style="padding:60px 30px 90px">
    <div class="${s.epiLines}">${a.lines.map(esc).join("<br>")}</div>
    <p class="${s.epiWho}">${esc(a.who)}, ${esc(a.from)}</p>
    <div class="${s.epiGap}"></div>
    <div class="${s.epiLines}">${b.lines.map(esc).join("<br>")}</div>
    <p class="${s.epiWho}"><button type="button" class="${s.who}" data-who="ibn-khaldun">${esc(b.who)}</button>, ${esc(b.from)}</p>
  </div>`;
}

function forThose(): string {
  return `<div class="${s.center}">
    <div class="${s.forLine}">${esc(FOR_THOSE.line)}<br><i>${esc(FOR_THOSE.italic)}</i></div>
    <div class="${s.redRule}"></div>
    <div class="${s.realms}">${FOR_THOSE.realms.map(esc).join("<br>")}</div></div>`;
}

function which(stance: string | null): string {
  return `<div class="${s.which}">
    <div class="${s.mono} ${s.red}">${esc(WHICH.kicker)}</div>
    <div class="${s.whichTitle}">${esc(WHICH.title)}</div>
    <p class="${s.whichLead}">${esc(WHICH.lead)}</p>
    <div class="${s.opts}">${WHICH.options
      .map((o) => `<button type="button" class="${s.opt}" data-stance="${o.id}" aria-pressed="${stance === o.id}"><span class="${s.optName}">${esc(o.name)}</span><span class="${s.optLine}">${esc(o.line)}</span></button>`)
      .join("")}</div>
    <div class="${s.mono} ${s.turn}">Turn the page to go on</div></div>`;
}

function endPage(): string {
  return `<div class="${s.center}">
    ${glassSvg("#9b2a21", 26)}
    <div class="${s.mono} ${s.red}" style="margin-top:18px">${esc(END.kicker)}</div>
    <div class="${s.endTitle}">${esc(END.title)}</div>
    <p class="${s.endLine}">${esc(END.line)}</p></div>`;
}

/* ---------------- flowing text ---------------- */

type Flow =
  | { seq: number; sec: string; head: string; kind: "para"; cls: string; tokens: Token[]; drop?: boolean }
  | { seq: number; sec: string; head: string; kind: "block"; html: string; breakBefore?: boolean; minAfter?: number };

function paraHtml(f: Extract<Flow, { kind: "para" }>, from: number, to: number, split: boolean): string {
  const cls = [s.p, f.cls];
  if (from > 0) cls.push(s.cont);
  if (from === 0 && f.drop) cls.push(s.drop);
  if (split) cls.push(s.split);
  let html = "";
  for (let i = from; i < to; i++) {
    const t = f.tokens[i];
    if (t.t === "text") html += esc(t.s);
    else html += `<button type="button" class="${t.t === "who" ? s.who : s.word}" data-${t.t}="${t.id}">${esc(t.s)}</button>${esc(t.tail)}`;
  }
  // a cut paragraph must not end on a space, or the justified last line stretches oddly
  return `<p class="${cls.join(" ")}">${split ? html.trimEnd() : html}</p>`;
}

const LOCK = `<svg width="10" height="11" viewBox="0 0 10 11" aria-hidden="true"><rect x="1" y="5" width="8" height="5.5" fill="none" stroke="currentColor"/><path d="M2.8 5V3.4a2.2 2.2 0 0 1 4.4 0V5" fill="none" stroke="currentColor"/></svg>`;

function buildFlow(): { copy: Flow[]; preface: Flow[]; toc: Flow[] } {
  let seq = 0;
  const copy: Flow[] = COPYRIGHT.map((t, i) => ({
    seq: seq++, sec: "copyright", head: "", kind: "block",
    html: i === 0
      ? `<div style="margin:0 0 28px">${glassSvg("#1d1812", 14)}</div><p class="${s.copy} ${s.copyFirst}">${esc(t)}</p>`
      : `<p class="${s.copy}">${esc(t)}</p>`,
  }));

  const preface: Flow[] = [];
  for (const sec of PREFACE) {
    const head = `Preface · ${sec.title}`;
    preface.push({
      seq: seq++, sec: sec.id, head, kind: "block", breakBefore: true,
      html: `<div class="${s.opener}">${glassSvg("#9b2a21", 16, `class="${s.orn}"`)}<div class="${s.secNum}">Preface · ${esc(sec.num)}</div><h2 class="${s.secTitle}">${esc(sec.title)}</h2><div class="${s.rule}"></div></div>`,
    });
    const seen = new Set<string>();
    let firstPara = true;   // no indent on the first paragraph after a heading
    let dropped = false;    // one drop cap per section, on its first paragraph
    for (const b of sec.blocks) {
      if (b.k === "sub") {
        preface.push({ seq: seq++, sec: sec.id, head, kind: "block", minAfter: 70, html: `<div class="${s.sub}">${esc(b.t)}</div>` });
        firstPara = true;
        continue;
      }
      const isP = b.k === "p";
      const cls = isP ? (firstPara ? s.first : "") : s[b.k];
      preface.push({ seq: seq++, sec: sec.id, head, kind: "para", cls, tokens: tokenize(b.t, seen), drop: isP && !dropped });
      if (isP) { firstPara = false; dropped = true; }
    }
    if (sec.sources.length) {
      preface.push({ seq: seq++, sec: sec.id, head, kind: "block", minAfter: 40, html: `<div class="${s.srcHead}">Sources for this section</div>` });
      for (const src of sec.sources) preface.push({ seq: seq++, sec: sec.id, head, kind: "block", html: `<p class="${s.src}">${esc(src)}</p>` });
    }
  }

  const toc: Flow[] = [{
    seq: seq++, sec: "contents", head: "Contents", kind: "block", breakBefore: true,
    html: `<div class="${s.mono} ${s.tocKicker}">Investigation I · The Fall of Kings</div><h2 class="${s.tocTitle}">Contents</h2><p class="${s.pass}">${esc(PASS_LINE)}</p>`,
  }];
  for (const part of PARTS) {
    toc.push({
      seq: seq++, sec: "contents", head: "Contents", kind: "block", minAfter: 90,
      html: `<div class="${s.part}"><div class="${s.partNum}"><span class="${s.mono}">Part ${part.n}</span><span class="${s.mono} ${s.lock}">${LOCK} ${esc(part.opens)}</span></div><div class="${s.partTitle}">${esc(part.title)}</div></div>`,
    });
    for (const law of part.laws) {
      const extra =
        (law.judgment ? `<div class="${s.judg}">${esc(law.judgment)}</div>` : "") +
        (law.eras ? `<div class="${s.stamps}">${law.eras.map((e) => `<span>${esc(e)}</span>`).join("")}</div>` : "") +
        (law.key ? `<div class="${s.key}"><span class="${s.keyLabel}">KEY</span>${esc(law.key)}</div>` : "");
      toc.push({
        seq: seq++, sec: "contents", head: "Contents", kind: "block",
        html: `<div class="${s.entry}"><div class="${s.entryHead}"><span class="${s.mono}">Law ${law.n}</span></div><div class="${s.lawTitle}">${esc(law.title)}</div><div class="${s.opensOn}">Opens on ${esc(law.opener)} · ${esc(law.place)}</div>${extra}</div>`,
      });
    }
  }
  return { copy, preface, toc };
}

/* Cut a flow into pages. `box` is the off-screen page's text area, the same size as the real one. */
function paginate(flow: Flow[], box: HTMLElement, opts: { head: boolean; folio: boolean }): BuiltPage[] {
  const pages: BuiltPage[] = [];
  let parts: string[] = [];
  let cur: BuiltPage | null = null;
  // text is measured inside a column like the one each real page wraps its text in, against the
  // height left between the running head and the page number
  const cs = getComputedStyle(box);
  const room = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const col = document.createElement("div");
  col.style.display = "flow-root";
  box.innerHTML = "";
  box.appendChild(col);
  const fits = (extra = 0) => col.offsetHeight + extra <= room + 0.5;
  const finish = () => {
    if (cur) { cur.html = parts.join(""); pages.push(cur); }
  };
  const open = (f: Flow, tok: number) => {
    finish();
    parts = [];
    col.innerHTML = "";
    cur = { html: "", flow: true, head: opts.head ? f.head : undefined, folio: opts.folio, secs: [f.sec], start: { seq: f.seq, tok } };
  };
  const add = (html: string) => {
    col.insertAdjacentHTML("beforeend", html);
    return col.lastElementChild as HTMLElement;
  };
  const note = (f: Flow) => {
    if (cur && !cur.secs.includes(f.sec)) cur.secs.push(f.sec);
  };

  for (let i = 0; i < flow.length; i++) {
    const f = flow[i];
    if (!cur || (f.kind === "block" && f.breakBefore)) open(f, 0);
    note(f);

    if (f.kind === "block") {
      const el = add(f.html);
      if (!fits(f.minAfter ?? 0) && parts.length) {
        el.remove();
        open(f, 0);
        add(f.html);
      }
      parts.push(f.html);
      continue;
    }

    // a paragraph: place as much as fits, carry the rest to the next page
    let from = 0;
    const n = f.tokens.length;
    while (from < n) {
      const whole = paraHtml(f, from, n, false);
      const el = add(whole);
      if (fits()) { parts.push(whole); break; }
      el.remove();
      // the most words that fit on this page
      let lo = 0, hi = n - from;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        const probe = add(paraHtml(f, from, from + mid, true));
        const ok = fits();
        probe.remove();
        if (ok) lo = mid; else hi = mid - 1;
      }
      // never leave a lonely word or two at the foot of a page
      if (lo < 4 && parts.length) { open(f, from); note(f); continue; }
      if (lo === 0) lo = 1; // a page too small for one word: place it anyway
      const piece = paraHtml(f, from, from + lo, true);
      add(piece);
      parts.push(piece);
      from += lo;
      open(f, from);
      note(f);
    }
  }
  finish();
  return pages;
}

/* The whole book, in order. `box` is the measuring page's text area. */
export function buildBook(box: HTMLElement, stance: string | null): BuiltPage[] {
  const { copy, preface, toc } = buildFlow();
  const fixed = (html: string, sec: string, extra: Partial<BuiltPage> = {}): BuiltPage => ({ html, secs: [sec], start: { seq: -1, tok: 0 }, ...extra });

  const pages: BuiltPage[] = [
    fixed(cover(), "cover", { hard: true, dark: true }),
    fixed(halfTitle(), "half-title"),
    fixed(titlePage(), "title"),
    ...paginate(copy, box, { head: false, folio: false }),
    fixed(dedication(), "dedication"),
    fixed(epigraph(), "epigraph"),
    ...paginate(preface, box, { head: true, folio: true }),
    fixed(forThose(), "for-those"),
    fixed(which(stance), "which"),
    ...paginate(toc, box, { head: true, folio: true }),
    fixed(endPage(), "end"),
  ];
  // the back board must sit alone on the left in a two-page spread, so the count must be even
  if ((pages.length + 1) % 2 === 1) pages.push(fixed("", "blank"));
  pages.push(fixed(backCover(), "back", { hard: true, dark: true }));

  // fixed pages carry the anchor of the flow page before them, so a saved place always resolves
  let last: Anchor = { seq: -1, tok: 0 };
  for (const p of pages) {
    if (p.start.seq === -1) p.start = { ...last };
    else last = p.start;
  }
  return pages;
}

/* Wrap a built page in its outer element, as the page-curl library expects. */
export function pageElement(p: BuiltPage, folio: number | null): HTMLElement {
  const el = document.createElement("div");
  el.className = `${s.page} ${p.hard ? s.cover : s.paper}`;
  el.dataset.density = p.hard ? "hard" : "soft";
  el.innerHTML =
    (p.head ? `<div class="${s.rh}">${esc(p.head)}</div>` : "") +
    (p.hard ? p.html : p.flow ? `<div class="${s.inner}"><div style="display:flow-root">${p.html}</div></div>` : `<div class="${s.inner}" style="padding:0">${p.html}</div>`) +
    (p.folio && folio ? `<div class="${s.folio}">${folio}</div>` : "");
  return el;
}

export const pageClasses = { page: s.page, paper: s.paper, inner: s.inner, measure: s.measure };
