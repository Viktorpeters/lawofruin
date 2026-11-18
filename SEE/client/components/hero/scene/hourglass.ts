import * as THREE from "three";

/* The living hourglass: walnut frame, bronze fittings, clear glass, and a fixed amount of
   gold sand that only ever moves through the neck. It pours, rests, is turned by hand,
   and reacts to being held, thrown, tipped and knocked. */

export type HourglassHandle = {
  root: THREE.Group;              // place this in the scene
  hitProxy: THREE.Mesh;           // invisible shape used to detect touches on the glass
  step: (dt: number) => void;
  turn: (dir?: number) => void;
  grab: () => void;               // a finger lands on the glass
  drag: (dxPx: number, dyFromStartPx: number) => void;
  release: (vxPxPerMs: number, vyPxPerMs: number, still: boolean) => void;
  knock: (nx: number, ny: number, force: number) => void;
  dispose: () => void;
};

const H = 1.78, NECK = 0.07, INSET = 0.014;
function rIn(y: number) {
  y = Math.max(0, Math.min(H, y));
  if (y < 1.12) return NECK + (0.93 - NECK) * Math.pow(Math.sin((Math.PI / 2) * (y / 1.12)), 0.75);
  const t = (y - 1.12) / (H - 1.12);
  return 0.93 - 0.2 * t * t;
}
const rSand = (y: number) => Math.max(0.004, rIn(y) - INSET);

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, srgb = false) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  draw(c.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function noise(size: number, lo: number, hi: number) {
  return canvasTex(size, size, (g, w, h) => {
    const d = g.createImageData(w, h);
    for (let i = 0; i < d.data.length; i += 4) { const v = lo + Math.random() * (hi - lo); d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    g.putImageData(d, 0, 0);
  });
}

export function woodTexture() {
  return canvasTex(512, 1024, (g, w, h) => {
    g.fillStyle = "#3b2416"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * w;
      g.strokeStyle = `rgba(${20 + Math.random() * 30},${10 + Math.random() * 16},6,${0.18 + Math.random() * 0.3})`;
      g.lineWidth = 1 + Math.random() * 6; g.beginPath(); g.moveTo(x, 0);
      for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y * 0.006 + i) * 10 + Math.sin(y * 0.03 + i * 3) * 2, y);
      g.stroke();
    }
    for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(110,70,40,${Math.random() * 0.08})`; g.fillRect(Math.random() * w, Math.random() * h, 1, 6 + Math.random() * 20); }
  }, true);
}

type Bulb = {
  sign: 1 | -1;
  mesh: THREE.Mesh;
  geo: THREE.BufferGeometry;
  base: Float32Array;
  cloud: Float32Array;
  proj: Float32Array;
  flagged: Uint8Array;
  amount: number;
  surface: number;
  crossR: number;
  shape: number;
  shapeT: number;
};

export function createHourglass(): HourglassHandle {
  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

  /* ---------- materials ---------- */
  const wood = keep(new THREE.MeshPhysicalMaterial({ map: keep(woodTexture()), roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4, bumpMap: keep(noise(256, 90, 160)), bumpScale: 0.6 }));
  const bronze = keep(new THREE.MeshStandardMaterial({ color: 0x8a6a3c, metalness: 1, roughness: 0.38, roughnessMap: keep(noise(256, 60, 200)), bumpMap: keep(noise(256, 100, 150)), bumpScale: 0.3 }));
  const sandColor = keep(canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = "#a9824c"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 26000; i++) {
      const v = Math.random();
      g.fillStyle = v < 0.45 ? `rgba(226,196,140,${Math.random() * 0.55})` : v < 0.85 ? `rgba(128,92,48,${Math.random() * 0.55})` : `rgba(70,46,24,${Math.random() * 0.7})`;
      g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
    }
  }, true));
  sandColor.repeat.set(5, 5);
  const sandBump = keep(noise(512, 30, 225)); sandBump.repeat.set(9, 9);
  const sandMat = keep(new THREE.MeshStandardMaterial({ map: sandColor, roughness: 0.97, metalness: 0, bumpMap: sandBump, bumpScale: 1.6, side: THREE.DoubleSide }));
  const glassMat = keep(new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, roughness: 0.035, thickness: 0.16, ior: 1.5, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.4 }));

  /* ---------- group nesting: spin > tilt > turn > hourglass ---------- */
  const spinG = new THREE.Group(), tiltG = new THREE.Group(), flipG = new THREE.Group(), hg = new THREE.Group();
  spinG.add(tiltG); tiltG.add(flipG); flipG.add(hg);

  const glassPts: THREE.Vector2[] = [];
  for (let i = 0; i <= 80; i++) { const y = -H + 2 * H * (i / 80); glassPts.push(new THREE.Vector2(rIn(Math.abs(y)) + 0.035, y)); }
  const glass = new THREE.Mesh(keep(new THREE.LatheGeometry(glassPts, 96)), glassMat);
  glass.renderOrder = 3; hg.add(glass);

  const plate = (y: number) => {
    const g = new THREE.Group(), s = Math.sign(y);
    const slab = new THREE.Mesh(keep(new THREE.CylinderGeometry(1.42, 1.48, 0.22, 96)), wood); slab.castShadow = true; slab.receiveShadow = true;
    const lip = new THREE.Mesh(keep(new THREE.CylinderGeometry(1.5, 1.5, 0.06, 96)), bronze); lip.position.y = -s * 0.13;
    const collar = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.86, 0.9, 0.08, 96)), bronze); collar.position.y = -s * 0.15;
    g.add(slab, lip, collar); g.position.y = y; return g;
  };
  hg.add(plate(H + 0.17), plate(-H - 0.17));

  const postPts: THREE.Vector2[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48, y = -H + 2 * H * t;
    const r = 0.085 + 0.035 * Math.sin(t * Math.PI) + 0.022 * Math.pow(Math.sin(t * Math.PI * 5), 8) - 0.02 * Math.pow(Math.sin(t * Math.PI * 2.5 + 1.57), 16);
    postPts.push(new THREE.Vector2(r, y));
  }
  const postGeo = keep(new THREE.LatheGeometry(postPts, 32));
  const capGeo = keep(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 32));
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + Math.PI / 6;
    const p = new THREE.Mesh(postGeo, wood); p.castShadow = true; p.position.set(Math.cos(a) * 1.18, 0, Math.sin(a) * 1.18);
    const capT = new THREE.Mesh(capGeo, bronze); capT.position.set(p.position.x, H - 0.02, p.position.z);
    const capB = new THREE.Mesh(capGeo, bronze); capB.position.set(p.position.x, -H + 0.02, p.position.z);
    hg.add(p, capT, capB);
  }

  // invisible shape for touch detection
  const hitProxy = new THREE.Mesh(keep(new THREE.CylinderGeometry(1.55, 1.55, 2 * H + 0.6, 16)), keep(new THREE.MeshBasicMaterial({ visible: false })));
  hg.add(hitProxy);

  /* ---------- sand bodies (volume-true, stay inside the glass) ---------- */
  const RING = 72, ROWS = 64;
  const makeBulb = (sign: 1 | -1): Bulb => {
    const prof = [new THREE.Vector2(0.001, 0.002)];
    for (let i = 0; i <= ROWS; i++) { const y = 0.002 + (H - 0.004) * Math.pow(i / ROWS, 1.15); prof.push(new THREE.Vector2(rSand(y), y)); }
    prof.push(new THREE.Vector2(0.001, H - 0.002));
    const geo = keep(new THREE.LatheGeometry(prof, RING));
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const base = new Float32Array(posAttr.array as Float32Array);
    if (sign < 0) {
      for (let i = 1; i < base.length; i += 3) base[i] = -base[i];
      const idx = geo.index!.array as Uint16Array | Uint32Array;
      for (let i = 0; i < idx.length; i += 3) { const t = idx[i]; idx[i] = idx[i + 1]; idx[i + 1] = t; }
    }
    (posAttr.array as Float32Array).set(base);
    const mesh = new THREE.Mesh(geo, sandMat); mesh.castShadow = true; mesh.receiveShadow = true;
    hg.add(mesh);
    const N = 7000, cloud = new Float32Array(N * 3); let n = 0;
    while (n < N) {
      const x = (Math.random() * 2 - 1) * 0.95, z = (Math.random() * 2 - 1) * 0.95, y = Math.random() * H;
      if (Math.hypot(x, z) < rSand(y)) { cloud[n * 3] = x; cloud[n * 3 + 1] = sign * y; cloud[n * 3 + 2] = z; n++; }
    }
    return { sign, mesh, geo, base, cloud, proj: new Float32Array(N), flagged: new Uint8Array(base.length / 3), amount: sign > 0 ? 1 : 0, surface: 0, crossR: 0.5, shape: 0, shapeT: 0 };
  };
  const A = makeBulb(1), B = makeBulb(-1);

  const clampInside = (b: Bulb, p: THREE.Vector3) => {
    let y = p.y * b.sign; y = Math.min(H - 0.003, Math.max(0.003, y)); p.y = y * b.sign;
    const lim = rSand(y), r = Math.hypot(p.x, p.z);
    if (r > lim) { p.x *= lim / r; p.z *= lim / r; }
  };
  const surfOffset = (b: Bulb, rho: number) => {
    if (b.shape === 0) return 0;
    const t = Math.max(0, 1 - rho / Math.max(0.05, b.crossR));
    return b.shape * Math.pow(t, 1.35);
  };
  const p = new THREE.Vector3();
  const updateBulb = (b: Bulb, u: THREE.Vector3) => {
    const posAttr = b.geo.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array, base = b.base;
    if (b.amount <= 0.0005) { b.mesh.visible = false; return; }
    b.mesh.visible = true;
    const c = b.cloud, pr = b.proj, N = pr.length;
    for (let i = 0; i < N; i++) pr[i] = c[i * 3] * u.x + c[i * 3 + 1] * u.y + c[i * 3 + 2] * u.z;
    pr.sort();
    const h = b.amount >= 0.9995 ? Infinity : pr[Math.min(N - 1, Math.floor(b.amount * N))];
    b.surface = h;
    b.crossR = rSand(Math.abs(u.y * (isFinite(h) ? h : 0)));
    const flagged = b.flagged;
    for (let i = 0, v = 0; i < pos.length; i += 3, v++) {
      p.set(base[i], base[i + 1], base[i + 2]);
      flagged[v] = 0;
      if (isFinite(h)) {
        for (let k = 0; k < 2; k++) {
          const d = p.dot(u);
          const rho = Math.sqrt(Math.max(0, p.lengthSq() - d * d));
          const s = h + surfOffset(b, rho);
          if (d > s) { p.addScaledVector(u, s - d); clampInside(b, p); flagged[v] = 1; }
        }
      }
      pos[i] = p.x; pos[i + 1] = p.y; pos[i + 2] = p.z;
    }
    posAttr.needsUpdate = true;
    b.geo.computeVertexNormals();
    const nrm = b.geo.attributes.normal as THREE.BufferAttribute, na = nrm.array as Float32Array;
    for (let v = 0; v < flagged.length; v++) if (flagged[v]) { na[v * 3] = u.x; na[v * 3 + 1] = u.y; na[v * 3 + 2] = u.z; }
    nrm.needsUpdate = true;
    b.geo.computeBoundingSphere();
  };

  /* ---------- falling grains ---------- */
  const GN = 1100;
  const gPos = new Float32Array(GN * 3), gVel = new Float32Array(GN * 3), gLife = new Float32Array(GN), gCol = new Float32Array(GN * 3), gKind = new Uint8Array(GN);
  for (let i = 0; i < GN; i++) {
    gLife[i] = -1; gPos[i * 3 + 1] = 999;
    const s = 0.82 + Math.random() * 0.3; gCol[i * 3] = 0.86 * s; gCol[i * 3 + 1] = 0.68 * s; gCol[i * 3 + 2] = 0.42 * s;
  }
  const grainGeo = keep(new THREE.BufferGeometry());
  grainGeo.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
  grainGeo.setAttribute("color", new THREE.BufferAttribute(gCol, 3));
  const grains = new THREE.Points(grainGeo, keep(new THREE.PointsMaterial({ size: 0.06, vertexColors: true })));
  grains.frustumCulled = false; grains.renderOrder = 1; hg.add(grains);
  let gNext = 0, spawnAcc = 0;
  const spawnGrain = (down: THREE.Vector3) => {
    const i = gNext; gNext = (gNext + 1) % GN;
    const j = 0.016;
    gPos[i * 3] = (Math.random() - 0.5) * j; gPos[i * 3 + 1] = (Math.random() - 0.5) * 0.02; gPos[i * 3 + 2] = (Math.random() - 0.5) * j;
    const sp = 0.35 + Math.random() * 0.15;
    gVel[i * 3] = down.x * sp + (Math.random() - 0.5) * 0.04; gVel[i * 3 + 1] = down.y * sp; gVel[i * 3 + 2] = down.z * sp + (Math.random() - 0.5) * 0.04;
    gLife[i] = 0; gKind[i] = 0;
  };
  const upL = new THREE.Vector3();
  const stepGrains = (dt: number, down: THREE.Vector3, lower: Bulb) => {
    const G = 7.5; let alive = 0;
    upL.copy(down).negate();
    for (let i = 0; i < GN; i++) {
      if (gLife[i] < 0) continue;
      gLife[i] += dt;
      gVel[i * 3] += down.x * G * dt; gVel[i * 3 + 1] += down.y * G * dt; gVel[i * 3 + 2] += down.z * G * dt;
      gPos[i * 3] += gVel[i * 3] * dt; gPos[i * 3 + 1] += gVel[i * 3 + 1] * dt; gPos[i * 3 + 2] += gVel[i * 3 + 2] * dt;
      const px = gPos[i * 3], py = gPos[i * 3 + 1], pz = gPos[i * 3 + 2];
      let dead = false;
      if (gKind[i] === 1) { if (gLife[i] > 0.16) dead = true; }
      else {
        const d = px * upL.x + py * upL.y + pz * upL.z;
        const rho = Math.sqrt(Math.max(0, px * px + py * py + pz * pz - d * d));
        const s = lower.amount > 0.0005 ? lower.surface + surfOffset(lower, rho) : -Infinity;
        if (d < Math.max(s, -H + 0.02)) {
          if (Math.random() < 0.22) {
            gKind[i] = 1; gLife[i] = 0;
            const a = Math.random() * Math.PI * 2, sp = 0.25 + Math.random() * 0.35;
            gVel[i * 3] = Math.cos(a) * sp + upL.x * 0.6; gVel[i * 3 + 1] = upL.y * 0.6; gVel[i * 3 + 2] = Math.sin(a) * sp + upL.z * 0.6;
            gPos[i * 3] += upL.x * 0.01; gPos[i * 3 + 1] += upL.y * 0.01; gPos[i * 3 + 2] += upL.z * 0.01;
          } else dead = true;
        }
      }
      if (Math.abs(gPos[i * 3 + 1]) > H || gLife[i] > 3) dead = true;
      if (dead) { gLife[i] = -1; gPos[i * 3 + 1] = 999; } else alive++;
    }
    (grainGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    return alive;
  };

  /* ---------- motion ---------- */
  const POUR = 20, REPOSE = 0.52;
  let flipBase = 0, restTimer = 0;
  let flipping: { t: number; dur: number; from: number; dir: number } | null = null;
  let spinAngle = 0.35, spinVel = 0.12, held = false;
  const tilt = { x: 0, z: 0, vx: 0, vz: 0, hx: null as number | null };
  let lift = 0, liftVel = 0;
  const dEff = new THREE.Vector3(0, -1, 0); let sliding = false;
  const q = new THREE.Quaternion(), dTrue = new THREE.Vector3(), upA = new THREE.Vector3(), u = new THREE.Vector3();
  const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const smooth = THREE.MathUtils.smoothstep, clamp = THREE.MathUtils.clamp;

  const turn = (dir = 1) => { if (!flipping) flipping = { t: 0, dur: 1.9, from: flipBase, dir }; };

  const step = (dt: number) => {
    if (held) spinVel = 0;
    else { spinVel += (0.12 - spinVel) * Math.min(1, dt * 0.8); spinAngle += spinVel * dt; }
    spinG.rotation.y = spinAngle;

    const K = 26, C = 2.6;
    if (tilt.hx === null) { tilt.vx += (-K * tilt.x - C * tilt.vx) * dt; tilt.x += tilt.vx * dt; }
    else { tilt.vx = (tilt.hx - tilt.x) / Math.max(dt, 1e-3); tilt.x = tilt.hx; }
    tilt.vz += (-K * tilt.z - C * tilt.vz) * dt; tilt.z += tilt.vz * dt;
    tilt.x = clamp(tilt.x, -0.75, 0.75); tilt.z = clamp(tilt.z, -0.75, 0.75);
    tiltG.rotation.set(tilt.x, 0, tilt.z);

    if (flipping) {
      flipping.t += dt;
      const k = Math.min(1, flipping.t / flipping.dur), e = easeInOut(k);
      flipG.rotation.z = flipping.from + flipping.dir * Math.PI * e;
      flipG.rotation.x = Math.sin(Math.PI * k) * 0.22;
      lift = Math.sin(Math.PI * Math.min(1, k * 1.05)) * 0.55; liftVel = 0;
      if (k >= 1) {
        flipBase = flipping.from + flipping.dir * Math.PI; flipG.rotation.z = flipBase; flipG.rotation.x = 0;
        flipping = null; liftVel = -1.6; tilt.vz += 1.1 * (Math.random() > 0.5 ? 1 : -1); tilt.vx += 0.6;
      }
    } else {
      liftVel += (-60 * lift - 7 * liftVel) * dt; lift += liftVel * dt;
      if (lift < -0.03) { lift = -0.03; liftVel *= -0.3; }
    }
    flipG.position.y = lift;

    hg.updateWorldMatrix(true, false);
    hg.getWorldQuaternion(q);
    upA.set(0, 1, 0).applyQuaternion(q);
    q.invert();
    dTrue.set(0, -1, 0).applyQuaternion(q);
    if (dEff.angleTo(dTrue) > REPOSE) sliding = true;
    if (sliding) { dEff.lerp(dTrue, 1 - Math.exp(-dt * 6)).normalize(); if (dEff.angleTo(dTrue) < 0.03) sliding = false; }
    u.copy(dEff).negate();

    const cosUp = upA.y;
    const upper = cosUp > 0 ? A : B, lower = upper === A ? B : A;
    const upright = Math.abs(cosUp);
    const flow = smooth(upright, 0.45, 0.85);
    let moved = 0;
    if (upper.amount > 0 && flow > 0) {
      moved = Math.min(upper.amount, (dt / POUR) * flow);
      upper.amount -= moved; lower.amount += moved;
      if (upper.amount < 1e-4) { lower.amount += upper.amount; upper.amount = 0; }
    }
    const pouring = moved > 0;
    const settle = smooth(upright, 0.8, 0.98) * (sliding ? 0 : 1);
    const target = pouring ? 1 : 0;
    upper.shapeT += (target - upper.shapeT) * Math.min(1, dt * 3);
    lower.shapeT += (target - lower.shapeT) * Math.min(1, dt * 3);
    upper.shape = -Math.min(0.28, upper.amount * 0.9) * upper.shapeT * settle;
    lower.shape = Math.min(0.42, lower.amount * 1.6 + 0.02) * lower.shapeT * settle;

    updateBulb(A, u); updateBulb(B, u);

    if (pouring) { spawnAcc += dt * 1300 * flow; while (spawnAcc > 1) { spawnGrain(dTrue); spawnAcc--; } } else spawnAcc = 0;
    const alive = stepGrains(dt, dTrue, lower);

    if (!flipping && upper.amount === 0 && alive === 0 && !sliding) {
      restTimer += dt;
      if (restTimer > 1.4) { restTimer = 0; turn(Math.random() > 0.5 ? 1 : -1); }
    } else restTimer = 0;
  };

  step(1 / 60);

  return {
    root: spinG,
    hitProxy,
    step,
    turn,
    grab: () => { held = true; spinVel = 0; },
    drag: (dxPx, dyFromStartPx) => { spinAngle += dxPx * 0.012; tilt.hx = clamp(dyFromStartPx * 0.004, -0.7, 0.7); },
    release: (vx, vy, still) => {
      held = false; tilt.hx = null;
      if (still) return;
      spinVel = clamp(vx * 10, -9, 9);
      tilt.vz += clamp(-vx * 1.6, -4, 4);
      tilt.vx = clamp(vy * 3.2, -5, 5);
      if (vy < -1.6) turn(1);
    },
    knock: (nx, ny, force) => { held = false; tilt.hx = null; tilt.vz += nx * 7 * force; tilt.vx -= (ny * 4 + 0.6) * force; },
    dispose: () => disposables.forEach((d) => d.dispose()),
  };
}
