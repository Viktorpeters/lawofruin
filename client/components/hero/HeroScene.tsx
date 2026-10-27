"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createHourglass } from "./scene/hourglass";
import { createShelf } from "./scene/shelf";
import { FIGURES, BOTTOM_ROW_COUNT } from "@/lib/figures";
import styles from "./hero.module.css";

type Props = {
  motion: boolean;            // false pauses the library (the hourglass keeps pouring)
  onReady: () => void;        // first real frame is on screen
};

export default function HeroScene({ motion, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionRef = useRef(motion);
  const readyRef = useRef(onReady);
  useEffect(() => { motionRef.current = motion; }, [motion]);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const modest = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;

    /* ---------- renderer ---------- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !modest, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, modest ? 1.25 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0a08);
    scene.fog = new THREE.Fog(0x0b0a08, 13, 27);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.42;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
    const camBase = new THREE.Vector3(0, 0.55, 9.5);
    const lookAt = new THREE.Vector3(0, 0.25, 2);

    /* ---------- light ---------- */
    const key = new THREE.SpotLight(0xffe0b0, 150, 34, 0.42, 0.65, 1.5);
    key.position.set(-4.2, 7.2, 6.2); key.target.position.set(0, 0, 2);
    key.castShadow = true; key.shadow.mapSize.set(modest ? 1024 : 2048, modest ? 1024 : 2048); key.shadow.bias = -0.0004;
    scene.add(key, key.target);
    const rim = new THREE.DirectionalLight(0xffc98a, 1.2); rim.position.set(5, 2.5, -3); scene.add(rim);
    scene.add(new THREE.AmbientLight(0x3a2a1e, 0.55));
    const shelfWash = new THREE.SpotLight(0xffb979, 90, 30, 0.9, 0.9, 1.4);
    shelfWash.position.set(0, 7, 11); shelfWash.target.position.set(0, 0.6, -0.2); scene.add(shelfWash, shelfWash.target);
    const sideFill = new THREE.HemisphereLight(0x6a4a30, 0x0b0a08, 0.5); scene.add(sideFill);
    const lantern = new THREE.PointLight(0xffa45c, 14, 7.5, 1.8);   // a slow light travelling along the shelves
    scene.add(lantern);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.6 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2.42; floor.receiveShadow = true; scene.add(floor);

    /* ---------- the hourglass and the library ---------- */
    const hourglass = createHourglass();
    hourglass.root.position.z = 2;   // stands in front of the portraits
    scene.add(hourglass.root);

    const css = getComputedStyle(document.documentElement);
    const fonts = {
      display: css.getPropertyValue("--font-display").trim() || "Georgia, serif",
      mono: css.getPropertyValue("--font-mono").trim() || "monospace",
      ui: css.getPropertyValue("--font-ui").trim() || "sans-serif",
    };
    const shelf = createShelf(FIGURES, BOTTOM_ROW_COUNT, fonts, { strips: !location.search.includes("strips=0") });
    scene.add(shelf.root);

    /* ---------- dust in the light ---------- */
    const DN = modest ? 220 : 480;
    const dPos = new Float32Array(DN * 3), dVel = new Float32Array(DN * 3);
    for (let i = 0; i < DN; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 14; dPos[i * 3 + 1] = -2.4 + Math.random() * 6.5; dPos[i * 3 + 2] = -6 + Math.random() * 10;
      dVel[i * 3] = (Math.random() - 0.5) * 0.06; dVel[i * 3 + 1] = (Math.random() - 0.3) * 0.04; dVel[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
    const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.028, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
    const dust = new THREE.Points(dustGeo, dustMat); scene.add(dust);

    /* ---------- sizing ---------- */
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // portrait phones: pull back so the whole glass fits, and raise it above the controls
      // the viewer stays inside the ring of portraits; narrow screens widen the lens instead of stepping back
      // the viewer stands inside the corridor of portraits; a wide lens makes the sides turn away
      const phone = camera.aspect < 0.75, tablet = camera.aspect < 1.1;
      camBase.z = phone ? 12 : tablet ? 10.5 : 9.5;
      camera.fov = phone ? 60 : tablet ? 56 : 50;
      lookAt.y = phone ? 1.4 : 0.25;   // on phones the glass sits lower, under the title
      // on wide screens the glass stands a little smaller so the faces around it breathe
      const s = phone ? 1 : 0.82;
      hourglass.root.scale.setScalar(s); hourglass.root.position.y = -2.06 * (1 - s);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

    /* ---------- touch: the glass reacts, the shelf can be pushed and books pulled ---------- */
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    const hitAt = (x: number, y: number) => {
      const r = canvas.getBoundingClientRect();
      ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.intersectObject(hourglass.hitProxy, false).length) return { kind: "glass" as const };
      const books = ray.intersectObjects(shelf.pickables, false);
      if (books.length) return { kind: "book" as const, obj: books[0].object };
      return { kind: "space" as const };
    };
    let drag: null | { id: number; kind: "glass" | "book" | "space"; obj?: THREE.Object3D; x0: number; y0: number; x: number; y: number; t0: number; lt: number; vx: number; vy: number; moved: boolean } = null;
    let lastTap = 0;
    const onDown = (e: PointerEvent) => {
      const hit = hitAt(e.clientX, e.clientY);
      const now = performance.now();
      drag = { id: e.pointerId, kind: hit.kind, obj: hit.kind === "book" ? hit.obj : undefined, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t0: now, lt: now, vx: 0, vy: 0, moved: false };
      if (hit.kind === "glass") { canvas.setPointerCapture(e.pointerId); hourglass.grab(); }
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1; pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      canvas.style.cursor = drag ? "grabbing" : hitAt(e.clientX, e.clientY).kind === "space" ? "default" : "grab";
      if (!drag || e.pointerId !== drag.id) return;
      const now = performance.now(), dtm = Math.max(1, now - drag.lt);
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.vx = drag.vx * 0.6 + (dx / dtm) * 0.4; drag.vy = drag.vy * 0.6 + (dy / dtm) * 0.4;
      drag.x = e.clientX; drag.y = e.clientY; drag.lt = now;
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6) drag.moved = true;
      if (!drag.moved) return;
      if (drag.kind === "glass") hourglass.drag(dx, e.clientY - drag.y0);
      else if (e.pointerType === "mouse" || Math.abs(dx) > Math.abs(dy)) shelf.nudge(dx * 0.012);
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const now = performance.now(), r = canvas.getBoundingClientRect();
      if (drag.kind === "glass") {
        if (!drag.moved) {
          const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
          const force = THREE.MathUtils.clamp(1.5 - (now - drag.t0) / 300, 0.35, 1.5);
          hourglass.knock(nx * 2.2, ny * 2.2, force);
          if (now - lastTap < 320) hourglass.turn(nx > 0 ? -1 : 1);
          lastTap = now;
        } else {
          const still = now - drag.lt > 90;
          hourglass.release(drag.vx, drag.vy, still);
        }
      } else {
        if (drag.kind === "book" && !drag.moved && drag.obj) shelf.pullOut(drag.obj);
        hourglass.release(0, 0, true);
      }
      drag = null;
    };
    const pointer = { x: 0, y: 0 };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    /* ---------- loop ---------- */
    const timer = new THREE.Timer();
    let raf = 0, t = 0, firstFrame = false, loaded = false, disposed = false;
    const camPos = camBase.clone();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      timer.update();
      const raw = Math.min(0.05, timer.getDelta());
      const live = motionRef.current && !reduce;
      t += raw;
      // hourglass always pours; slower when motion is paused
      const hgDt = raw * (live ? 1 : 0.5);
      const n = Math.ceil(hgDt / 0.02);
      for (let i = 0; i < n; i++) hourglass.step(hgDt / n);
      shelf.step(raw, live);
      if (live) {
        for (let i = 0; i < DN; i++) {
          dPos[i * 3] += dVel[i * 3] * raw; dPos[i * 3 + 1] += dVel[i * 3 + 1] * raw + Math.sin(t * 0.5 + i) * 0.0006; dPos[i * 3 + 2] += dVel[i * 3 + 2] * raw;
          if (dPos[i * 3 + 1] > 4.2) dPos[i * 3 + 1] = -2.4;
          if (Math.abs(dPos[i * 3]) > 7) dVel[i * 3] *= -1;
        }
        (dustGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        const a = Math.sin(t * 0.09) * 1.7;              // lantern walks the shelves
        lantern.position.set(Math.sin(a) * 4.6, 0.8 + Math.sin(t * 0.21) * 1.4, 7 - Math.cos(a) * 7.0);
      }
      // camera breathes and leans toward the pointer
      const lean = live ? 1 : 0.3;
      camPos.x += ((camBase.x + pointer.x * 0.6 * lean + Math.sin(t * 0.13) * 0.25 * lean) - camPos.x) * 0.03;
      camPos.y += ((camBase.y - pointer.y * 0.3 * lean + Math.sin(t * 0.17) * 0.12 * lean) - camPos.y) * 0.03;
      camPos.z += (camBase.z - camPos.z) * 0.05;
      camera.position.copy(camPos); camera.lookAt(lookAt);
      // while a full-screen guide is open, stop drawing to save battery
      if (document.body.dataset.overlay !== "1" || !firstFrame) renderer.render(scene, camera);
      if (loaded && !firstFrame) { firstFrame = true; readyRef.current(); }
    };
    shelf.load().finally(() => { if (!disposed) loaded = true; });
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      hourglass.dispose(); shelf.dispose();
      dustGeo.dispose(); dustMat.dispose(); envTex.dispose(); pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.scene} aria-label="A walnut hourglass pouring gold sand in front of a curved library of the fallen. Touch the glass to move it, tap a book to pull it out." />;
}
