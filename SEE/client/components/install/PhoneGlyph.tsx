import styles from "./install.module.css";

/* The small 3D phone beside "Add to": a home screen with a few apps,
   and the Laws of Ruin icon dropping into the empty slot, again and again. */
export default function PhoneGlyph() {
  const apps = [
    "#3d4a3f", "#6b4b2f", "#2f3d4f", "#5a2e2a",
    "#4b4636", "#2f4746", "#4a3a52", "#5b5242",
    "#30363d", "#55402d", null, "#3e3a30",
  ];
  return (
    <span className={styles.phone3d} aria-hidden="true">
      <svg viewBox="0 0 64 120" className={styles.phoneSvg}>
        <defs>
          <linearGradient id="pg-body" x1="0" x2="1">
            <stop offset="0" stopColor="#5b5348" />
            <stop offset=".18" stopColor="#d9d0c0" />
            <stop offset=".5" stopColor="#8a8172" />
            <stop offset=".85" stopColor="#e7dfd0" />
            <stop offset="1" stopColor="#4d463c" />
          </linearGradient>
          <linearGradient id="pg-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d2a24" />
            <stop offset=".55" stopColor="#14110e" />
            <stop offset="1" stopColor="#2a1c14" />
          </linearGradient>
          <linearGradient id="pg-glare" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" />
            <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="62" height="118" rx="11" fill="url(#pg-body)" />
        <rect x="3.2" y="3.2" width="57.6" height="113.6" rx="9" fill="#050505" />
        <rect x="5" y="5" width="54" height="110" rx="7.5" fill="url(#pg-screen)" />
        <rect x="24" y="7.5" width="16" height="4.2" rx="2.1" fill="#050505" />
        {apps.map((c, i) => {
          const x = 10 + (i % 4) * 11.5, y = 20 + Math.floor(i / 4) * 13;
          return c ? <rect key={i} x={x} y={y} width="8.4" height="8.4" rx="2.2" fill={c} /> : null;
        })}
        <g className={styles.phoneDrop}>
          <image href="/icons/icon-192.png" x={10 + 2 * 11.5} y={20 + 2 * 13} width="8.4" height="8.4" preserveAspectRatio="xMidYMid slice" style={{ clipPath: "inset(0 round 2.2px)" }} />
        </g>
        <rect x="10" y="100" width="44" height="10" rx="3.5" fill="#ffffff" fillOpacity=".08" />
        <rect x="5" y="5" width="54" height="110" rx="7.5" fill="url(#pg-glare)" />
      </svg>
    </span>
  );
}
