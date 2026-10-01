import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * Decorative WebGL "emission tracking" diorama:
 * a steel plant on a floating platform, chimneys releasing emissions that turn
 * clean (grey → mint) as they rise, a monitoring sensor sending out cyan scan pulses, a solar array and trees,
 * a live 3D bar chart of COx / NOx / SOx / PM, and CO₂ molecules orbiting.
 * Transparent background — sits on top of any CSS gradient.
 *
 * variant: 'hero' (login, rich) | 'compact' (dashboard banner, lighter)
 */

// Soft round sprite for smoke puffs
const makePuffTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

export default function SteelScene({ variant = 'hero', offsetX = 0, offsetY = 0, scale = 1, className, style }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let staticMode = false;
    const compact = variant === 'compact';

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return undefined; // WebGL unavailable — the CSS background still looks complete
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(compact ? 32 : 36, 1, 0.1, 100);
    const baseZ = compact ? 12 : 13;
    camera.position.set(0, 0, baseZ);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(4, 8, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x2dd4bf, compact ? 25 : 40, 30);
    rim.position.set(-5, 2, 4);
    scene.add(rim);

    // ---------- Materials (palette: sage / forest / mint / steel) ----------
    const disposables = [];
    const mat = (m) => { disposables.push(m); return m; };
    const steel = mat(new THREE.MeshPhysicalMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.3, clearcoat: 0.5 }));
    const greenSteel = mat(new THREE.MeshPhysicalMaterial({ color: 0x059669, metalness: 0.6, roughness: 0.35, clearcoat: 0.8 }));
    const platformMat = mat(new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, metalness: 0.2, roughness: 0.55, clearcoat: 0.4 }));
    const lawn = mat(new THREE.MeshStandardMaterial({ color: 0xa7f3d0, roughness: 0.8 }));
    const glow = mat(new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.9 }));
    const mintGlow = mat(new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x10b981, emissiveIntensity: 0.8 }));
    const solarMat = mat(new THREE.MeshPhysicalMaterial({ color: 0x0e7490, metalness: 0.6, roughness: 0.15, clearcoat: 1 }));
    const treeMat = mat(new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 }));
    const trunkMat = mat(new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 }));
    const windowMat = mat(new THREE.MeshStandardMaterial({ color: 0xcffafe, emissive: 0x22d3ee, emissiveIntensity: 0.4 }));

    const root = new THREE.Group();
    const anchor = new THREE.Group(); // positions the composition inside the panel
    anchor.position.set(offsetX, offsetY, 0);
    anchor.scale.setScalar(scale);
    anchor.rotation.x = 0.32; // view slightly from above
    anchor.add(root);
    scene.add(anchor);

    // ---------- Platform ----------
    const platform = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.1, 0.45, 72), platformMat);
    platform.position.y = -1.45;
    root.add(platform);
    const lawnDisc = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.06, 72), lawn);
    lawnDisc.position.y = -1.2;
    root.add(lawnDisc);
    const edge = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.035, 12, 120), glow);
    edge.rotation.x = Math.PI / 2;
    edge.position.y = -1.22;
    root.add(edge);

    // ---------- Plant (factory + sawtooth roof + chimneys) ----------
    const plant = new THREE.Group();
    plant.position.set(-0.9, 0, 0.2);
    root.add(plant);
    const hall = new THREE.Mesh(new RoundedBoxGeometry(2.3, 1.1, 1.5, 3, 0.06), steel);
    hall.position.y = -0.62;
    plant.add(hall);
    const toothGeo = new THREE.CylinderGeometry(0.32, 0.32, 1.5, 3, 1);
    for (let i = 0; i < 3; i += 1) {
      const tooth = new THREE.Mesh(toothGeo, greenSteel);
      tooth.rotation.x = Math.PI / 2;
      tooth.rotation.y = Math.PI / 2;
      tooth.position.set(-0.75 + i * 0.75, 0.0, 0);
      plant.add(tooth);
    }
    for (let i = 0; i < 4; i += 1) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.02), windowMat);
      win.position.set(-0.8 + i * 0.53, -0.55, 0.76);
      plant.add(win);
    }

    const chimneys = [
      { x: -0.55, z: -0.35, h: 2.3 },
      { x: 0.35, z: -0.35, h: 1.8 },
    ];
    const chimneyTops = chimneys.map(({ x, z, h }) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, h, 24), steel);
      c.position.set(x, -1.17 + h / 2, z);
      plant.add(c);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.09, 24), mintGlow);
      band.position.set(x, -1.17 + h - 0.25, z);
      plant.add(band);
      return new THREE.Vector3(x - 0.9, -1.17 + h, z + 0.2); // in root space
    });

    // ---------- Emissions: grey near the stack, clean mint as it rises ----------
    const puffTex = makePuffTexture();
    disposables.push(puffTex);
    const perStack = compact ? 26 : 40;
    const smokeCount = perStack * chimneyTops.length;
    const smokePos = new Float32Array(smokeCount * 3);
    const smokeCol = new Float32Array(smokeCount * 3);
    const smokeLife = new Float32Array(smokeCount);
    const smokeSeed = new Float32Array(smokeCount);
    for (let i = 0; i < smokeCount; i += 1) {
      smokeLife[i] = Math.random();
      smokeSeed[i] = Math.random() * Math.PI * 2;
    }
    const smokeGeo = new THREE.BufferGeometry();
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    smokeGeo.setAttribute('color', new THREE.BufferAttribute(smokeCol, 3));
    const smokeMat = mat(new THREE.PointsMaterial({
      size: compact ? 0.42 : 0.5, map: puffTex, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false,
    }));
    const smoke = new THREE.Points(smokeGeo, smokeMat);
    root.add(smoke);
    const dirty = new THREE.Color(0x94a3b8);
    const mid = new THREE.Color(0x22d3ee);
    const clean = new THREE.Color(0x34d399);
    const tmpColor = new THREE.Color();
    const fadeColor = new THREE.Color(0xecfdf5);

    // ---------- Monitoring sensor with scan pulses ----------
    const sensor = new THREE.Group();
    sensor.position.set(1.85, 0, 0.9);
    root.add(sensor);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 2.2, 12), steel);
    mast.position.y = -0.1;
    sensor.add(mast);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), glow);
    head.position.y = 1.05;
    sensor.add(head);
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.08, 0.12, 24, 1, true), greenSteel);
    dish.position.y = 0.82;
    sensor.add(dish);
    const pulses = [0, 1, 2].map((i) => {
      const m = mat(new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.92, 1, 48), m);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.15;
      ring.userData.offset = i / 3;
      sensor.add(ring);
      return ring;
    });

    // ---------- Live emission bar chart (COx, NOx, SOx, PM) ----------
    const barColors = [0x334155, 0x047857, 0xd97706, 0xdc2626]; // COx, NOx, SOx, PM — same as the trend chart
    const bars = barColors.map((color, i) => {
      const m = mat(new THREE.MeshPhysicalMaterial({ color, metalness: 0.3, roughness: 0.35, clearcoat: 1 }));
      const bar = new THREE.Mesh(new RoundedBoxGeometry(0.32, 1, 0.32, 3, 0.05), m);
      bar.position.set(0.9 + i * 0.42, -1.17, -1.35);
      bar.userData = { base: 0.7 + (i % 2) * 0.35, phase: i * 1.3 };
      root.add(bar);
      return bar;
    });

    // ---------- Solar array (renewable energy) ----------
    const solar = new THREE.Group();
    solar.position.set(-1.0, -1.17, 1.85);
    root.add(solar);
    const panelGeo = new RoundedBoxGeometry(0.62, 0.04, 0.42, 2, 0.015);
    const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.22, 6);
    for (let i = 0; i < 3; i += 1) {
      const leg = new THREE.Mesh(legGeo, steel);
      leg.position.set(-0.7 + i * 0.7, 0.11, 0);
      solar.add(leg);
      const panel = new THREE.Mesh(panelGeo, solarMat);
      panel.position.set(-0.7 + i * 0.7, 0.24, 0);
      panel.rotation.x = -0.45;
      solar.add(panel);
    }

    // ---------- Trees ----------
    const coneGeo = new THREE.ConeGeometry(0.22, 0.55, 12);
    const trunkGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.18, 8);
    [[2.55, -0.4], [2.2, 1.7], [-2.6, 0.9], [-2.3, -1.3], [0.4, 2.45]].forEach(([x, z], i) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.09;
      tree.add(trunk);
      const crown = new THREE.Mesh(coneGeo, treeMat);
      crown.position.y = 0.42;
      tree.add(crown);
      tree.position.set(x, -1.17, z);
      tree.scale.setScalar(0.85 + (i % 3) * 0.15);
      root.add(tree);
    });

    // ---------- Orbiting CO₂ molecules ----------
    const carbonMat = mat(new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.3, clearcoat: 1 }));
    const oxygenMat = mat(new THREE.MeshPhysicalMaterial({ color: 0x5eead4, metalness: 0.1, roughness: 0.15, clearcoat: 1, transparent: true, opacity: 0.92 }));
    const bondGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8);
    const carbonGeo = new THREE.SphereGeometry(0.2, 24, 16);
    const oxygenGeo = new THREE.SphereGeometry(0.16, 24, 16);
    const molecules = [];
    const molCount = compact ? 3 : 4;
    for (let i = 0; i < molCount; i += 1) {
      const mol = new THREE.Group();
      mol.add(new THREE.Mesh(carbonGeo, carbonMat));
      [-1, 1].forEach((s) => {
        const o = new THREE.Mesh(oxygenGeo, oxygenMat);
        o.position.x = s * 0.38;
        mol.add(o);
      });
      const bond = new THREE.Mesh(bondGeo, steel);
      bond.rotation.z = Math.PI / 2;
      mol.add(bond);
      mol.userData = { angle: (i / molCount) * Math.PI * 2, radius: 3.9 + (i % 2) * 0.4, y: 0.4 + (i % 3) * 0.7, speed: 0.12 + i * 0.02 };
      root.add(mol);
      molecules.push(mol);
    }

    // ---------- Pointer parallax ----------
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = baseZ * Math.max(1, 1.1 / camera.aspect);
      camera.updateProjectionMatrix();
      if (staticMode) renderer.render(scene, camera); // keep the still frame sharp after resizes
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;
    let last = 0;
    const renderFrame = (fixedT, draw = true) => {
      const t = fixedT ?? clock.getElapsedTime();
      const dt = Math.min(0.05, Math.max(0, t - last));
      last = t;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      root.rotation.y = -0.5 + Math.sin(t * 0.15) * 0.35 + pointer.x * 0.3;
      anchor.rotation.x = 0.32 + pointer.y * 0.08;
      root.position.y = Math.sin(t * 0.6) * 0.06;

      // emissions
      for (let i = 0; i < smokeCount; i += 1) {
        smokeLife[i] += dt * (0.22 + (i % 5) * 0.02);
        if (smokeLife[i] > 1) smokeLife[i] -= 1;
        const life = smokeLife[i];
        const top = chimneyTops[i % chimneyTops.length];
        const seed = smokeSeed[i];
        smokePos[i * 3] = top.x + Math.sin(seed + life * 4) * 0.25 * life + life * 0.9;
        smokePos[i * 3 + 1] = top.y + life * 3.0;
        smokePos[i * 3 + 2] = top.z + Math.cos(seed + life * 3) * 0.25 * life;
        const k = Math.min(1, life * 1.5);
        if (k < 0.5) tmpColor.copy(dirty).lerp(mid, k * 2);
        else tmpColor.copy(mid).lerp(clean, (k - 0.5) * 2);
        // fade out toward the top by mixing toward white-ish highlight
        const fade = life > 0.75 ? (life - 0.75) * 4 : 0;
        tmpColor.lerp(fadeColor, fade * 0.6);
        smokeCol[i * 3] = tmpColor.r;
        smokeCol[i * 3 + 1] = tmpColor.g;
        smokeCol[i * 3 + 2] = tmpColor.b;
      }
      smokeGeo.attributes.position.needsUpdate = true;
      smokeGeo.attributes.color.needsUpdate = true;

      // sensor pulses
      pulses.forEach((ring) => {
        const p = (t * 0.45 + ring.userData.offset) % 1;
        ring.scale.setScalar(0.3 + p * 2.4);
        ring.material.opacity = 0.55 * (1 - p);
      });
      head.material.emissiveIntensity = 0.7 + Math.sin(t * 3) * 0.3;

      // live bars
      bars.forEach((bar) => {
        const hgt = bar.userData.base + Math.sin(t * 1.2 + bar.userData.phase) * 0.25;
        bar.scale.y = hgt;
        bar.position.y = -1.17 + hgt / 2;
      });

      // CO₂ molecules
      molecules.forEach((m) => {
        const d = m.userData;
        const a = d.angle + t * d.speed;
        m.position.set(Math.cos(a) * d.radius, d.y + Math.sin(t * 0.8 + d.angle) * 0.25, Math.sin(a) * d.radius * 0.6);
        m.rotation.y = t * 0.6 + d.angle;
        m.rotation.z = Math.sin(t * 0.5 + d.angle) * 0.4;
      });

      if (draw) renderer.render(scene, camera);
    };

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      renderFrame();
    };

    if (reduceMotion) {
      // settle the particles into a natural spread, then draw one still frame
      for (let k = 0; k < 60; k += 1) renderFrame(k * 0.05, k === 59);
      staticMode = true;
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      ro.disconnect();
      io.disconnect();
      scene.traverse((obj) => { if (obj.geometry) obj.geometry.dispose(); });
      disposables.forEach((d) => d.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [variant, offsetX, offsetY, scale]);

  return <div ref={mountRef} aria-hidden className={className} style={{ position: 'absolute', inset: 0, ...style }} />;
}
