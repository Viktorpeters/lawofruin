/* The six part emblems, drawn as solid cast-gold objects: a gradient body lit from the upper
   left, a dark rim, a bright edge highlight, and a shadow under it (from book.module.css).
   Part 1 crown · 2 throne · 3 coins · 4 sword · 5 the crowd · 6 the sealed will. */

const defs = (id: string) => `<defs>
  <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset=".28" stop-color="#e2bd6e"/><stop offset=".6" stop-color="#a87a3a"/><stop offset="1" stop-color="#5a3d14"/></linearGradient>
  <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe8" stop-opacity=".9"/><stop offset="1" stop-color="#fffbe8" stop-opacity="0"/></linearGradient>
  <radialGradient id="${id}r" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#c8963f"/><stop offset="1" stop-color="#6b4a19"/></radialGradient>
</defs>`;

const PATHS: Record<number, (id: string) => string> = {
  // a crown: five points, a band, three jewels
  1: (id) => `<path d="M14 70 L10 30 L30 48 L40 18 L50 46 L60 18 L70 48 L90 30 L86 70 Z" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2.2" stroke-linejoin="round"/>
    <rect x="12" y="70" width="76" height="14" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2.2"/>
    <path d="M16 73 H84" stroke="url(#${id}h)" stroke-width="2"/>
    <circle cx="10" cy="30" r="4.5" fill="url(#${id}r)" stroke="#3a2608" stroke-width="1.5"/><circle cx="40" cy="18" r="4.5" fill="url(#${id}r)" stroke="#3a2608" stroke-width="1.5"/><circle cx="60" cy="18" r="4.5" fill="url(#${id}r)" stroke="#3a2608" stroke-width="1.5"/><circle cx="90" cy="30" r="4.5" fill="url(#${id}r)" stroke="#3a2608" stroke-width="1.5"/>
    <circle cx="30" cy="77" r="3.2" fill="#9b2a21" stroke="#3a2608"/><circle cx="50" cy="77" r="3.6" fill="#1f4f6b" stroke="#3a2608"/><circle cx="70" cy="77" r="3.2" fill="#9b2a21" stroke="#3a2608"/>`,
  // a throne: tall back, seat, legs
  2: (id) => `<path d="M30 10 H70 L66 52 H34 Z" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M40 18 H60 L58 44 H42 Z" fill="none" stroke="#3a2608" stroke-width="1.6" opacity=".7"/>
    <circle cx="50" cy="9" r="5" fill="url(#${id}r)" stroke="#3a2608" stroke-width="1.6"/>
    <path d="M20 52 H80 V64 H20 Z" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2.2"/>
    <path d="M24 55 H76" stroke="url(#${id}h)" stroke-width="2"/>
    <path d="M18 46 H30 V64 M82 46 H70 V64" fill="none" stroke="#3a2608" stroke-width="2.2"/>
    <path d="M26 64 L24 90 M74 64 L76 90 M38 64 V86 M62 64 V86" stroke="#3a2608" stroke-width="5" stroke-linecap="square"/>
    <path d="M26 64 L24 90 M74 64 L76 90" stroke="url(#${id}b)" stroke-width="3"/>`,
  // a stack of coins and one standing coin
  3: (id) => `${[0, 1, 2, 3].map((i) => `<ellipse cx="38" cy="${80 - i * 11}" rx="26" ry="8" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2"/><path d="M12 ${80 - i * 11} v6 a26 8 0 0 0 52 0 v-6" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2"/>`).join("")}
    <ellipse cx="38" cy="47" rx="26" ry="8" fill="url(#${id}r)" stroke="#3a2608" stroke-width="2"/>
    <circle cx="72" cy="46" r="20" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2.2"/>
    <circle cx="72" cy="46" r="14" fill="none" stroke="#3a2608" stroke-width="1.4" opacity=".7"/>
    <path d="M72 37 V55 M67 41 h7 a3.5 3.5 0 0 1 0 7 h-5 a3.5 3.5 0 0 0 0 7 h7" fill="none" stroke="#3a2608" stroke-width="1.8"/>`,
  // an upright sword
  4: (id) => `<path d="M50 4 L57 16 V62 H43 V16 Z" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M50 8 V60" stroke="#3a2608" stroke-width="1.2" opacity=".55"/>
    <path d="M47 14 V58" stroke="url(#${id}h)" stroke-width="2"/>
    <path d="M24 62 H76 L72 70 H28 Z" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2.2" stroke-linejoin="round"/>
    <rect x="45" y="70" width="10" height="16" fill="#5b1b17" stroke="#3a2608" stroke-width="2"/>
    <circle cx="50" cy="91" r="6" fill="url(#${id}r)" stroke="#3a2608" stroke-width="2"/>`,
  // the crowd: three figures, the middle one taller
  5: (id) => `${[[24, 30, 0.86], [76, 30, 0.86], [50, 22, 1]].map(([x, y, k]) => `<circle cx="${x}" cy="${y}" r="${11 * k}" fill="url(#${id}r)" stroke="#3a2608" stroke-width="2"/><path d="M${x - 20 * k} ${86} C${x - 20 * k} ${y + 22} ${x + 20 * k} ${y + 22} ${x + 20 * k} ${86} Z" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2" stroke-linejoin="round"/>`).join("")}
    <path d="M8 88 H92" stroke="#3a2608" stroke-width="2.2"/>`,
  // a rolled will with a red wax seal
  6: (id) => `<rect x="18" y="16" width="64" height="62" fill="url(#${id}b)" stroke="#3a2608" stroke-width="2.2"/>
    <path d="M28 30 H72 M28 40 H72 M28 50 H60" stroke="#3a2608" stroke-width="1.6" opacity=".6"/>
    <rect x="12" y="10" width="76" height="10" rx="5" fill="url(#${id}r)" stroke="#3a2608" stroke-width="2"/>
    <rect x="12" y="74" width="76" height="10" rx="5" fill="url(#${id}r)" stroke="#3a2608" stroke-width="2"/>
    <path d="M60 78 L56 94 L64 88 L70 96 L70 78" fill="#7a1d17" stroke="#3a2608" stroke-width="1.5"/>
    <circle cx="66" cy="66" r="11" fill="#9b2a21" stroke="#3a2608" stroke-width="2"/>
    <circle cx="66" cy="66" r="6.5" fill="none" stroke="#c96a5f" stroke-width="1.4"/>`,
};

export function partIcon(n: number, className: string): string {
  const id = `pi${n}`;
  return `<svg viewBox="0 0 100 100" width="104" height="104" class="${className}" aria-hidden="true">${defs(id)}${(PATHS[n] ?? PATHS[1])(id)}</svg>`;
}
