"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hand-built WebGL scene: a lacquer espresso cup on a marble plinth,
 * drifting steam, orbiting beans, gilt rings and candle dust.
 * Mouse parallax + scroll dolly. Honours prefers-reduced-motion.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0806, 0.055);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
    camera.position.set(0, 1.35, 7.6);

    /* ── lights ─────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x3a2c20, 2.1));
    scene.add(new THREE.HemisphereLight(0xecd59b, 0x140f0b, 1.1));

    const key = new THREE.SpotLight(0xffe2ac, 190, 30, 0.66, 0.9, 1.5);
    key.position.set(3.4, 7.6, 4.4);
    key.target.position.set(0, 0.3, 0);
    scene.add(key, key.target);

    const rim = new THREE.PointLight(0xf0cf84, 62, 24, 2);
    rim.position.set(-4.6, 2.4, -3.6);
    scene.add(rim);

    const ember = new THREE.PointLight(0x8c2a33, 34, 18, 2);
    ember.position.set(4.4, -0.6, 2.4);
    scene.add(ember);

    const candle = new THREE.PointLight(0xffc46b, 16, 11, 2);
    candle.position.set(-1.9, 0.6, 2.1);
    scene.add(candle);

    const underglow = new THREE.PointLight(0xc9a44c, 22, 12, 2);
    underglow.position.set(0, -1.9, 1.2);
    scene.add(underglow);

    /* ── materials ──────────────────────────────────────────── */
    const disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];
    const track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(x: T): T => {
      disposables.push(x);
      return x;
    };

    const lacquer = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x14100c,
        roughness: 0.22,
        metalness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        sheen: 0.4,
        sheenColor: new THREE.Color(0x6b1f27),
      }),
    );

    const gold = track(
      new THREE.MeshStandardMaterial({
        color: 0xd8b25c,
        roughness: 0.22,
        metalness: 1,
        emissive: 0x2a1d05,
        emissiveIntensity: 0.6,
      }),
    );

    const crema = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x7a4520,
        roughness: 0.1,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        emissive: 0x2a1306,
        emissiveIntensity: 1.1,
      }),
    );

    const beanMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x4a2a17,
        roughness: 0.55,
        metalness: 0.08,
        clearcoat: 0.5,
      }),
    );

    const marble = track(
      new THREE.MeshStandardMaterial({ color: 0x0f0c09, roughness: 0.35, metalness: 0.55 }),
    );

    /* ── cup assembly ───────────────────────────────────────── */
    const stage = new THREE.Group();
    scene.add(stage);

    // plinth
    const plinth = new THREE.Mesh(track(new THREE.CylinderGeometry(2.5, 2.75, 0.28, 72)), marble);
    plinth.position.y = -1.28;
    stage.add(plinth);

    const plinthRing = new THREE.Mesh(track(new THREE.TorusGeometry(2.52, 0.022, 12, 96)), gold);
    plinthRing.rotation.x = Math.PI / 2;
    plinthRing.position.y = -1.13;
    stage.add(plinthRing);

    // saucer
    const saucer = new THREE.Mesh(track(new THREE.CylinderGeometry(1.62, 1.42, 0.085, 72)), lacquer);
    saucer.position.y = -1.06;
    stage.add(saucer);

    const saucerGold = new THREE.Mesh(track(new THREE.TorusGeometry(1.6, 0.018, 12, 96)), gold);
    saucerGold.rotation.x = Math.PI / 2;
    saucerGold.position.y = -1.02;
    stage.add(saucerGold);

    // cup body via lathe profile
    const profile: THREE.Vector2[] = [];
    const steps = 26;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const y = -1.0 + t * 1.34;
      const r = 0.44 + Math.pow(t, 0.62) * 0.42;
      profile.push(new THREE.Vector2(r, y));
    }
    profile.push(new THREE.Vector2(0.88, 0.32));
    profile.push(new THREE.Vector2(0.84, 0.3));
    const cupGeo = track(new THREE.LatheGeometry(profile, 72));
    const cup = new THREE.Mesh(cupGeo, lacquer);
    stage.add(cup);

    // inner wall (cream-glazed) + coffee surface
    const innerGeo = track(new THREE.CylinderGeometry(0.83, 0.5, 1.18, 48, 1, true));
    const innerMat = track(
      new THREE.MeshStandardMaterial({ color: 0xe8d7b8, roughness: 0.35, side: THREE.BackSide }),
    );
    const inner = new THREE.Mesh(innerGeo, innerMat);
    inner.position.y = -0.36;
    stage.add(inner);

    const coffee = new THREE.Mesh(track(new THREE.CircleGeometry(0.8, 64)), crema);
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.2;
    stage.add(coffee);

    // latte-art ring + rosette
    const artRing = new THREE.Mesh(track(new THREE.TorusGeometry(0.46, 0.022, 10, 64)), track(
      new THREE.MeshStandardMaterial({ color: 0xf1e2c6, roughness: 0.4 }),
    ));
    artRing.rotation.x = Math.PI / 2;
    artRing.position.y = 0.205;
    stage.add(artRing);

    for (let i = 0; i < 6; i += 1) {
      const petal = new THREE.Mesh(track(new THREE.SphereGeometry(0.1, 16, 12)), track(
        new THREE.MeshStandardMaterial({ color: 0xf3e6cc, roughness: 0.45 }),
      ));
      petal.scale.set(1, 0.12, 0.5);
      const a = (i / 6) * Math.PI * 2;
      petal.position.set(Math.cos(a) * 0.2, 0.21, Math.sin(a) * 0.2);
      petal.rotation.y = -a;
      stage.add(petal);
    }

    // gilt lip
    const lip = new THREE.Mesh(track(new THREE.TorusGeometry(0.86, 0.026, 14, 96)), gold);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = 0.33;
    stage.add(lip);

    // handle
    const handle = new THREE.Mesh(track(new THREE.TorusGeometry(0.42, 0.062, 18, 48, Math.PI * 1.25)), lacquer);
    handle.position.set(0.98, -0.34, 0);
    handle.rotation.set(0, 0, Math.PI * 0.38);
    stage.add(handle);

    // spoon on the saucer
    const spoonHandle = new THREE.Mesh(track(new THREE.CylinderGeometry(0.02, 0.026, 1.05, 12)), gold);
    spoonHandle.rotation.z = Math.PI / 2;
    spoonHandle.position.set(0.15, -1.0, 1.18);
    spoonHandle.rotation.y = 0.35;
    stage.add(spoonHandle);

    const spoonBowl = new THREE.Mesh(track(new THREE.SphereGeometry(0.11, 20, 14)), gold);
    spoonBowl.scale.set(1, 0.28, 1.35);
    spoonBowl.position.set(-0.38, -1.0, 1.02);
    stage.add(spoonBowl);

    /* ── steam particles ────────────────────────────────────── */
    const puffCanvas = document.createElement("canvas");
    puffCanvas.width = 64;
    puffCanvas.height = 64;
    const pctx = puffCanvas.getContext("2d");
    if (pctx) {
      const g = pctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,240,214,0.85)");
      g.addColorStop(0.45, "rgba(233,206,155,0.28)");
      g.addColorStop(1, "rgba(233,206,155,0)");
      pctx.fillStyle = g;
      pctx.fillRect(0, 0, 64, 64);
    }
    const puffTex = track(new THREE.CanvasTexture(puffCanvas));

    const STEAM = 90;
    const steamPos = new Float32Array(STEAM * 3);
    const steamSeed = new Float32Array(STEAM);
    for (let i = 0; i < STEAM; i += 1) {
      steamSeed[i] = Math.random();
      steamPos[i * 3] = (Math.random() - 0.5) * 0.9;
      steamPos[i * 3 + 1] = Math.random() * 2.6;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 0.9;
    }
    const steamGeo = track(new THREE.BufferGeometry());
    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    const steamMat = track(
      new THREE.PointsMaterial({
        size: 0.62,
        map: puffTex,
        transparent: true,
        opacity: 0.36,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xf0dcb4,
      }),
    );
    const steam = new THREE.Points(steamGeo, steamMat);
    steam.position.y = 0.25;
    stage.add(steam);

    /* ── orbiting beans ─────────────────────────────────────── */
    const beanGeo = track(new THREE.SphereGeometry(0.155, 20, 16));
    const creaseGeo = track(new THREE.TorusGeometry(0.15, 0.012, 8, 28));
    const beans: THREE.Group[] = [];
    for (let i = 0; i < 16; i += 1) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(beanGeo, beanMat);
      body.scale.set(1, 0.62, 1.32);
      const crease = new THREE.Mesh(creaseGeo, track(
        new THREE.MeshStandardMaterial({ color: 0x241109, roughness: 0.8 }),
      ));
      crease.rotation.y = Math.PI / 2;
      crease.position.y = 0.075;
      g.add(body, crease);
      const a = (i / 16) * Math.PI * 2;
      const rad = 2.35 + Math.sin(i * 2.4) * 0.55;
      g.position.set(Math.cos(a) * rad, -0.55 + Math.sin(i * 1.7) * 0.85, Math.sin(a) * rad);
      g.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      g.userData = { a, rad, speed: 0.12 + Math.random() * 0.16, yBase: g.position.y, spin: Math.random() * 0.6 };
      stage.add(g);
      beans.push(g);
    }

    /* ── gilt rings ─────────────────────────────────────────── */
    const ringGeoA = track(new THREE.TorusGeometry(3.1, 0.008, 8, 180));
    const ringGeoB = track(new THREE.TorusGeometry(3.7, 0.006, 8, 180));
    const ringMat = track(
      new THREE.MeshBasicMaterial({ color: 0xc9a44c, transparent: true, opacity: 0.45 }),
    );
    const ringA = new THREE.Mesh(ringGeoA, ringMat);
    const ringB = new THREE.Mesh(ringGeoB, ringMat);
    ringA.rotation.set(1.15, 0.2, 0.3);
    ringB.rotation.set(-1.05, -0.4, 0.6);
    ringA.position.y = 0.1;
    ringB.position.y = 0.3;
    stage.add(ringA, ringB);

    /* ── candle dust ────────────────────────────────────────── */
    const DUST = 420;
    const dustPos = new Float32Array(DUST * 3);
    const dustSpeed = new Float32Array(DUST);
    for (let i = 0; i < DUST; i += 1) {
      dustPos[i * 3] = (Math.random() - 0.5) * 16;
      dustPos[i * 3 + 1] = Math.random() * 9 - 2.5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      dustSpeed[i] = 0.06 + Math.random() * 0.22;
    }
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = track(
      new THREE.PointsMaterial({
        size: 0.045,
        map: puffTex,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xecd59b,
      }),
    );
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* ── interaction ────────────────────────────────────────── */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;
    const resize = () => {
      width = mount.clientWidth || 1;
      height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = width < 720 ? 52 : 38;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let visible = true;
    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    }, { threshold: 0.02 });
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;

    const render = () => {
      const t = clock.getElapsedTime();

      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      const scrollProgress = Math.min(1, scrollY / Math.max(1, window.innerHeight * 0.9));

      stage.rotation.y = t * 0.16 + pointer.x * 0.55;
      stage.rotation.x = pointer.y * 0.12;
      stage.position.y = Math.sin(t * 0.55) * 0.07 - scrollProgress * 1.5;

      camera.position.x = pointer.x * 0.85;
      camera.position.y = 1.35 - pointer.y * 0.5 + scrollProgress * 1.1;
      camera.position.z = 7.6 - scrollProgress * 1.5;
      camera.lookAt(0, 0.05 - scrollProgress * 0.4, 0);

      ringA.rotation.z = t * 0.22;
      ringB.rotation.z = -t * 0.16;
      ringA.rotation.x = 1.15 + Math.sin(t * 0.3) * 0.12;

      const sp = steamGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < STEAM; i += 1) {
        const seed = steamSeed[i];
        let y = sp.getY(i) + (0.0055 + seed * 0.011);
        if (y > 3.1) y = -0.15;
        const sway = Math.sin(t * (0.7 + seed) + seed * 22) * 0.42 * (y * 0.45);
        sp.setX(i, sway * (0.35 + seed * 0.6));
        sp.setY(i, y);
        sp.setZ(i, Math.cos(t * (0.6 + seed) + seed * 17) * 0.4 * (y * 0.4));
      }
      sp.needsUpdate = true;
      steamMat.opacity = 0.2 + Math.sin(t * 0.8) * 0.05;

      beans.forEach((b, i) => {
        const u = b.userData as { a: number; rad: number; speed: number; yBase: number; spin: number };
        const a = u.a + t * u.speed * 0.35;
        b.position.x = Math.cos(a) * u.rad;
        b.position.z = Math.sin(a) * u.rad;
        b.position.y = u.yBase + Math.sin(t * 0.8 + i) * 0.22;
        b.rotation.x += 0.004 + u.spin * 0.006;
        b.rotation.y += 0.006;
      });

      const dp = dustGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < DUST; i += 1) {
        let y = dp.getY(i) + dustSpeed[i] * 0.006;
        if (y > 6.5) y = -2.5;
        dp.setY(i, y);
        dp.setX(i, dp.getX(i) + Math.sin(t * 0.25 + i) * 0.0015);
      }
      dp.needsUpdate = true;
      dust.rotation.y = t * 0.012;

      candle.intensity = 16 + Math.sin(t * 5.5) * 3.4 + Math.sin(t * 11.3) * 1.6;
      rim.intensity = 62 + Math.sin(t * 0.7) * 9;
      underglow.intensity = 22 + Math.sin(t * 0.45) * 4;

      renderer.render(scene, camera);
    };

    if (reduced) {
      render();
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        render();
      };
      loop();
    }

    const onVisibility = () => {
      if (!reduced) render();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 h-full w-full [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
