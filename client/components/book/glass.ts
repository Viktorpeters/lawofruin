/* The hourglass mark as an SVG string: a frame, sand in the top bulb, the falling stream and the
   heap below (every hourglass in the book is shown mid-pour). `fill` is a flat colour or "foil". */

let n = 0;

export function glassSvg(fill: string, w: number, attrs = ""): string {
  const id = `g${n++}`;
  const h = Math.round((w * 96) / 56);
  const paint =
    fill === "foil"
      ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e6b4"/><stop offset=".45" stop-color="#9a7232"/><stop offset=".55" stop-color="#f7e6b4"/><stop offset="1" stop-color="#5f4419"/></linearGradient></defs>`
      : "";
  const c = fill === "foil" ? `url(#${id})` : fill;
  return `<svg width="${w}" height="${h}" viewBox="-28 -48 56 96" aria-hidden="true" ${attrs}>${paint}<g stroke="${c}" fill="none" stroke-width="2"><rect x="-25" y="-47" width="50" height="6"/><rect x="-25" y="41" width="50" height="6"/><path d="M-17,-41 C-17,-12 -2.6,-7 -2.6,0 C-2.6,7 -17,12 -17,41 M17,-41 C17,-12 2.6,-7 2.6,0 C2.6,7 17,12 17,41"/><path d="M-21.5,-41V41M21.5,-41V41" stroke-width="1.3"/></g><path d="M-12.5,-22 C-10.5,-11 -3.5,-6.5 -1.6,-1.5 L1.6,-1.5 C3.5,-6.5 10.5,-11 12.5,-22 Z" fill="${c}"/><path d="M0,-1.5V31" stroke="${c}" stroke-width="1"/><path d="M-15,41 C-14,34 -5,29.5 0,28.5 C5,29.5 14,34 15,41 Z" fill="${c}"/></svg>`;
}
