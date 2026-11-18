import * as THREE from "three";
import type { Figure } from "@/lib/figures";
import { woodTexture } from "./hourglass";

/* The gallery of the fallen: tall portrait panels standing along an oval shelf around the viewer,
   so the faces ahead stand square and the ones at the edges turn away in perspective, like
   walking down a corridor of them. A dark ledge runs under the panels and a thin row of old
   spines runs above. Panels glide along the shelf, step forward and back on their own, sway when
   a breeze passes, and can be dragged along to bring anyone round. */

export type ShelfFonts = { display: string; mono: string; ui: string };

export type ShelfHandle = {
  root: THREE.Group;
  pickables: THREE.Object3D[];
  load: () => Promise<void>;
  step: (dt: number, alive: boolean) => void;
  pullOut: (obj: THREE.Object3D) => void;
  nudge: (distance: number) => void;
  dispose: () => void;
};

// The portraits stand along an oval path: its far end runs behind the hourglass, and its long
// sides run forward past the viewer like the walls of a corridor, so the faces at the edges of
// the screen turn steeply away. The portraits glide along the path, so everyone comes round.
const OV_Z = 7;          // centre of the oval
const OV_A = 5.8;        // half width
const OV_B = 8;          // half depth (far end at z = -1, near end behind the viewer)
const PANEL_W = 2.0, PANEL_H = 5.0, PANEL_D = 0.1;
const LEDGE_Y = -2.32;
const TOP_Y = LEDGE_Y + PANEL_H + 0.36;

// arc-length table so portraits are spaced evenly along the oval
const TABLE_N = 720;
const table = (() => {
  const s = new Float32Array(TABLE_N + 1); let acc = 0, px = 0, pz = -OV_B;
  for (let i = 1; i <= TABLE_N; i++) {
    const u = (i / TABLE_N) * Math.PI * 2, x = OV_A * Math.sin(u), z = -OV_B * Math.cos(u);
    acc += Math.hypot(x - px, z - pz); s[i] = acc; px = x; pz = z;
  }
  return s;
})();
const PERIM = table[TABLE_N];
function uAt(len: number) {
  len = ((len % PERIM) + PERIM) % PERIM;
  let lo = 0, hi = TABLE_N;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (table[m] < len) lo = m; else hi = m; }
  const f = (len - table[lo]) / Math.max(1e-6, table[hi] - table[lo]);
  return ((lo + f) / TABLE_N) * Math.PI * 2;
}
// position on the oval (inset toward the middle by `inset`) and the yaw that faces the middle
function onOval(u: number, inset: number, out: THREE.Vector3) {
  const nx = -Math.sin(u) / OV_A, nz = Math.cos(u) / OV_B, nl = Math.hypot(nx, nz);
  out.set(OV_A * Math.sin(u) + (nx / nl) * inset, 0, -OV_B * Math.cos(u) + (nz / nl) * inset);
  return Math.atan2(nx, nz);
}


function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((res) => {
    const im = new Image(); im.decoding = "async";
    im.onload = () => res(im); im.onerror = () => res(null); im.src = src;
  });
}

function panelCanvas(fig: Figure, img: HTMLImageElement | null, fonts: ShelfFonts) {
  const W = 520, H = Math.round(W * (PANEL_H / PANEL_W));
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#120d09"; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }

  const px = 26, py = 26, pw = W - 52, ph = Math.round(H * 0.76);
  g.save(); g.beginPath(); g.rect(px, py, pw, ph); g.clip();
  if (img) {
    const s = Math.max(pw / img.width, ph / img.height);
    const iw = img.width * s, ih = img.height * s;
    g.filter = "grayscale(1) sepia(.32) contrast(1.14) brightness(.86)";
    g.drawImage(img, px + (pw - iw) / 2, py + (ph - ih) * 0.22, iw, ih);
    g.filter = "none";
  } else {
    // no photo yet: a tall engraved monogram
    g.fillStyle = "#1e1510"; g.fillRect(px, py, pw, ph);
    g.strokeStyle = "rgba(201,165,107,.12)";
    for (let y = py + 10; y < py + ph; y += 6) { g.beginPath(); g.moveTo(px, y); g.lineTo(px + pw, y); g.stroke(); }
    const initials = fig.name.replace(/^The\s+/, "").split(/\s+/).filter((w) => /^[A-ZÁÉÍÓÚ]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
    g.fillStyle = "rgba(201,165,107,.9)"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = `400 230px ${fonts.display}`; g.fillText(initials, W / 2, py + ph * 0.46);
  }
  // light from above, falling off into the frame
  const lg = g.createLinearGradient(0, py, 0, py + ph);
  lg.addColorStop(0, "rgba(255,225,180,.10)"); lg.addColorStop(0.5, "rgba(0,0,0,0)"); lg.addColorStop(1, "rgba(6,4,2,.75)");
  g.fillStyle = lg; g.fillRect(px, py, pw, ph);
  g.restore();
  g.strokeStyle = "rgba(201,165,107,.7)"; g.lineWidth = 2; g.strokeRect(px, py, pw, ph);
  g.strokeStyle = "rgba(201,165,107,.3)"; g.lineWidth = 1; g.strokeRect(12, 12, W - 24, H - 24);

  // name plate
  const base = py + ph;
  g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.fillStyle = "#c9a56b"; g.font = `400 19px ${fonts.mono}`;
  g.fillText(fig.realm.toUpperCase().split("").join(" "), W / 2, base + 52);
  let size = 50; g.fillStyle = "#ede6d8"; g.font = `500 ${size}px ${fonts.display}`;
  while (g.measureText(fig.name).width > W - 70 && size > 30) { size -= 2; g.font = `500 ${size}px ${fonts.display}`; }
  g.fillText(fig.name, W / 2, base + 112);
  let y = base + 112;
  if (fig.known) { y += 40; g.fillStyle = "rgba(237,230,216,.62)"; g.font = `italic 400 28px ${fonts.display}`; g.fillText(`“${fig.known}”`, W / 2, y); }
  g.fillStyle = "#b8463c"; g.font = `400 19px ${fonts.mono}`;
  g.fillText(fig.fate.toUpperCase(), W / 2, y + 48);

  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function spineTexture() {
  const c = document.createElement("canvas"); c.width = 64; c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, 64, 256);
  for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.2})`; g.fillRect(Math.random() * 64, Math.random() * 256, 1 + Math.random() * 2, 1 + Math.random() * 2); }
  const sh = g.createLinearGradient(0, 0, 64, 0);
  sh.addColorStop(0, "rgba(0,0,0,.6)"); sh.addColorStop(0.4, "rgba(255,255,255,.05)"); sh.addColorStop(1, "rgba(0,0,0,.6)");
  g.fillStyle = sh; g.fillRect(0, 0, 64, 256);
  g.fillStyle = "#e3c27a"; [30, 38, 214, 222].forEach((y) => g.fillRect(6, y, 52, 2));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}


type Panel = { holder: THREE.Group; tilt: THREE.Group; mesh: THREE.Mesh; fig: Figure; s0: number; u: number; out: number; outTarget: number; hold: number; sway: number; swayVel: number };

export function createShelf(figures: Figure[], _bottomCount: number, fonts: ShelfFonts, opts: { strips?: boolean } = {}): ShelfHandle {
  const strips = opts.strips ?? true;
  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

  const root = new THREE.Group();
  root.position.z = OV_Z;

  const woodTex = keep(woodTexture()); woodTex.repeat.set(40, 1); woodTex.rotation = Math.PI / 2;
  const ledgeMat = keep(new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.65, color: 0x9a7a5e }));
  const wallTex = keep(woodTexture()); wallTex.repeat.set(30, 2);
  const wallMat = keep(new THREE.MeshStandardMaterial({ map: wallTex, color: 0x2a1e17, roughness: 0.92, side: THREE.BackSide }));
  const edgeMat = keep(new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.7 }));
  const brass = keep(new THREE.MeshStandardMaterial({ color: 0x8a6a3c, metalness: 1, roughness: 0.4 }));

  // the wall behind the portraits: an oval cylinder seen from inside
  const wall = new THREE.Mesh(keep(new THREE.CylinderGeometry(1, 1, 14, 160, 1, true)), wallMat);
  wall.scale.set(OV_A + 0.7, 1, OV_B + 0.7); wall.position.y = 1; wall.receiveShadow = true; root.add(wall);

  // a flat oval board
  const ovalBoard = (inIn: number, outOut: number, depth: number) => {
    const s = new THREE.Shape(); s.absellipse(0, 0, OV_A + outOut, OV_B + outOut, 0, Math.PI * 2, false, 0);
    const hole = new THREE.Path(); hole.absellipse(0, 0, OV_A - inIn, OV_B - inIn, 0, Math.PI * 2, true, 0); s.holes.push(hole);
    const geo = keep(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 160 }));
    const m = new THREE.Mesh(geo, ledgeMat); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; m.castShadow = true;
    return m;
  };
  const ledge = ovalBoard(0.45, 0.7, 0.12); ledge.position.y = LEDGE_Y - 0.12; root.add(ledge);

  const tmp = new THREE.Vector3();
  if (strips) {
    const top = ovalBoard(0.25, 0.7, 0.08); top.position.y = TOP_Y - 0.08; root.add(top);
    // a row of old spines along the top board, drawn as one instanced mesh
    const spineMat = keep(new THREE.MeshStandardMaterial({ map: keep(spineTexture()), roughness: 0.65 }));
    const spineGeo = keep(new THREE.BoxGeometry(1, 1, 1));
    const widths: number[] = []; let total = 0;
    while (total < PERIM - 0.3) { const w = 0.16 + Math.random() * 0.14; widths.push(w); total += w + 0.012; }
    const spines = new THREE.InstancedMesh(spineGeo, [edgeMat, edgeMat, edgeMat, edgeMat, spineMat, edgeMat], widths.length);
    const palette = [0x5a1f19, 0x24352a, 0x3a2615, 0x6b3a20, 0x1f1f1f, 0x7a2a22, 0x3b3221, 0x243039].map((c) => new THREE.Color(c));
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    let at = 0;
    widths.forEach((w, i) => {
      const h = 0.7 + Math.random() * 0.45, d = 0.7 + Math.random() * 0.2;
      const yaw = onOval(uAt(at + w / 2), d / 2 - 0.35, tmp); at += w + 0.012;
      tmp.y = TOP_Y + h / 2;
      q.setFromAxisAngle(up, yaw); sc.set(w, h, d);
      m.compose(tmp, q, sc); spines.setMatrixAt(i, m);
      spines.setColorAt(i, palette[Math.floor(Math.random() * palette.length)]);
    });
    spines.castShadow = true; spines.receiveShadow = true;
    root.add(spines);
  }

  // the portrait panels, evenly spaced along the oval
  const panelGeo = keep(new THREE.BoxGeometry(PANEL_W, PANEL_H, PANEL_D));
  const lampGeo = keep(new THREE.BoxGeometry(PANEL_W * 0.5, 0.05, 0.12));
  const armGeo = keep(new THREE.BoxGeometry(0.03, 0.03, 0.2));
  const lampMat = keep(new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffc88a, emissiveIntensity: 1.6 }));
  const panels: Panel[] = [];
  const pickables: THREE.Object3D[] = [];
  const spacing = PERIM / figures.length;
  figures.forEach((fig, i) => {
    const holder = new THREE.Group();
    const tiltG = new THREE.Group(); holder.add(tiltG);
    const mesh = new THREE.Mesh(panelGeo, [edgeMat, edgeMat, edgeMat, edgeMat, edgeMat, edgeMat]);
    mesh.position.y = PANEL_H / 2; mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData.figure = fig;
    tiltG.add(mesh);
    const lamp = new THREE.Mesh(lampGeo, lampMat); lamp.position.set(0, PANEL_H + 0.08, 0.14);
    const arm = new THREE.Mesh(armGeo, brass); arm.position.set(0, PANEL_H + 0.1, 0.05);
    tiltG.add(lamp, arm);
    root.add(holder);
    // start with Pablo Escobar behind the glass and the others either side of him
    panels.push({ holder, tilt: tiltG, mesh, fig, s0: i * spacing, u: 0, out: 0, outTarget: 0, hold: 0, sway: 0, swayVel: 0 });
    pickables.push(mesh);
  });

  /* ---------- motion ---------- */
  let along = 0, vel = 0.32, dragHold = 0;      // distance travelled along the oval
  let pullTimer = 1.2, breezeTimer = 5, breezeT = -1;
  const pull = (p: Panel, amount: number, hold: number) => { p.outTarget = amount; p.hold = hold; };
  const signedU = (u: number) => ((u + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; // 0 = far end, behind the glass

  const place = () => {
    for (const p of panels) {
      p.u = uAt(p.s0 + along);
      const yaw = onOval(p.u, 0.15, tmp);
      p.holder.position.set(tmp.x, LEDGE_Y, tmp.z);
      p.holder.rotation.y = yaw;
    }
  };
  place();

  const step = (dt: number, alive: boolean) => {
    if (alive) {
      dragHold = Math.max(0, dragHold - dt);
      if (dragHold === 0) vel += (0.32 - vel) * Math.min(1, dt * 0.5);
      along += vel * dt;
      place();

      pullTimer -= dt;
      if (pullTimer <= 0) {
        pullTimer = 1.6 + Math.random() * 2.4;
        const inView = panels.filter((p) => Math.abs(signedU(p.u)) < 0.85 && p.outTarget === 0 && p.out < 0.02);
        const p = inView[Math.floor(Math.random() * inView.length)];
        if (p) pull(p, 0.55 + Math.random() * 0.35, 1.2 + Math.random() * 1.6);
      }

      breezeTimer -= dt;
      if (breezeTimer <= 0 && breezeT < 0) { breezeT = 0; breezeTimer = 9 + Math.random() * 8; }
      if (breezeT >= 0) { breezeT += dt; if (breezeT > 5) breezeT = -1; }
    }

    for (const p of panels) {
      if (alive) {
        if (p.outTarget > 0 && p.out >= p.outTarget - 0.01) { p.hold -= dt; if (p.hold <= 0) p.outTarget = 0; }
        p.out += (p.outTarget - p.out) * Math.min(1, dt * 2.6);
        if (breezeT >= 0) {
          // the wave enters from the left of the view and leaves on the right
          const front = -1.3 + breezeT * 0.7, a = signedU(p.u);
          if (a > front - 0.12 && a < front + 0.12) p.swayVel += dt * 2.4;
        }
        p.swayVel += (-30 * p.sway - 1.8 * p.swayVel) * dt;
        p.sway += p.swayVel * dt;
      }
      p.tilt.position.z = p.out;
      p.tilt.rotation.x = -p.out * 0.08;
      p.tilt.rotation.y = p.sway * 0.12;
      p.tilt.rotation.z = p.sway * 0.03;
    }
  };

  const load = async () => {
    await Promise.all([fonts.display, fonts.mono].map((f) => document.fonts.load(`400 40px ${f}`).catch(() => null)));
    await Promise.all(panels.map(async (p) => {
      const img = await loadImage(`/figures/${p.fig.slug}.jpg`);
      const tex = keep(panelCanvas(p.fig, img, fonts));
      const face = keep(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5, metalness: 0.04 }));
      (p.mesh.material as THREE.Material[])[4] = face;
    }));
  };

  return {
    root,
    pickables,
    load,
    step,
    pullOut: (obj) => { const p = panels.find((x) => x.mesh === obj); if (p) pull(p, 1.1, 3.2); },
    // drag: the portraits follow the finger along the shelf, then keep a little speed
    nudge: (d) => { along += d; vel = THREE.MathUtils.clamp(d / 0.016 * 0.5, -6, 6); dragHold = 1.2; place(); },
    dispose: () => disposables.forEach((x) => x.dispose()),
  };
}
