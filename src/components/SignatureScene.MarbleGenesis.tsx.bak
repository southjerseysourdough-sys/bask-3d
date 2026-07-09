"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { scrollProgress, useScrollProgress } from "./scroll";

/*
  The Bask signature graphic: Marble Genesis.

  One marble sphere holds the hero. As you scroll through the proof panel (which
  is opaque, so the split happens out of sight), the sphere separates into four
  smaller spheres that settle two behind the Core Support card and two behind the
  Managed IT card. Through the middle of the page they stay apart. Near the final
  call to action they drift back together into one sphere.

  The read: one team, divided into the right lane for you, always one team
  underneath.

  Motion is one continuous timeline driven by scroll progress 0 to 1, read once
  per frame. A light rig (blue key plus pink rim) rakes across the marble as you
  scroll, and bloom lets the lit stone glow.
*/

// ---- Camera, measured from the reference framing ----
const CAMERA_FOV = 30;
const CAMERA_Z_NEAR = 8.4;
const CAMERA_Z_FAR = 9.6;
const LIGHT_RIG_SWEEP = 2.114; // radians on Z across the full scroll
const STATIC_PROGRESS = 0.06; // frozen hero pose for reduced motion

// ---- Named stages as ranges of scroll progress ----
const SPLIT_FROM = 0.18;
const SPLIT_TO = 0.45; // by here the four spheres are settled behind the cards
const MERGE_FROM = 0.85;
const MERGE_TO = 1.0; // by here they are one sphere again

// Where each of the four spheres settles. Two land behind the left card
// (Core Support), two behind the right card (Managed IT), pushed slightly back
// in z so depth of field softens them behind the translucent cards.
const SETTLE: [number, number, number][] = [
  [-2.15, 0.75, -0.4],
  [-1.7, -0.95, -0.75],
  [2.15, 0.75, -0.4],
  [1.7, -0.95, -0.75],
];
// Hero sits a touch right and up so the live headline (left aligned) stays clear.
const GENESIS_CENTER: [number, number, number] = [0.6, 0.3, 0];
const MERGE_CENTER: [number, number, number] = [0, 0, 0];
// Nested radii in the hero so the four coincident spheres read as one solid ball
// (distinct radii means no z fighting). They shrink as they separate.
const GENESIS_SCALE = [1.3, 1.12, 0.98, 0.86];
const SETTLE_SCALE = 0.62;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
function smoothstep(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
function stage(p: number, a: number, b: number): number {
  return clamp01((p - a) / (b - a));
}

// Pure function: where sphere i sits at scroll progress p.
function sphereTransform(
  i: number,
  p: number
): { pos: [number, number, number]; scale: number } {
  const ts = smoothstep(SPLIT_FROM, SPLIT_TO, p);
  const tm = smoothstep(MERGE_FROM, MERGE_TO, p);

  let x = lerp(GENESIS_CENTER[0], SETTLE[i][0], ts);
  let y = lerp(GENESIS_CENTER[1], SETTLE[i][1], ts);
  let z = lerp(GENESIS_CENTER[2], SETTLE[i][2], ts);
  x = lerp(x, MERGE_CENTER[0], tm);
  y = lerp(y, MERGE_CENTER[1], tm);
  z = lerp(z, MERGE_CENTER[2], tm);

  let s = lerp(GENESIS_SCALE[i], SETTLE_SCALE, ts);
  s = lerp(s, GENESIS_SCALE[i], tm);

  return { pos: [x, y, z], scale: s };
}

// ---- Procedural cool grey marble texture, generated on a canvas so nothing is
// fetched over the network. Value noise -> fbm -> turbulence veining. ----
function makeMarbleTexture(size: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);

  const hash = (x: number, y: number) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const fade = (t: number) => t * t * (3 - 2 * t);
  const vnoise = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const tl = hash(xi, yi);
    const tr = hash(xi + 1, yi);
    const bl = hash(xi, yi + 1);
    const br = hash(xi + 1, yi + 1);
    const u = fade(xf);
    const v = fade(yf);
    return (tl * (1 - u) + tr * u) * (1 - v) + (bl * (1 - u) + br * u) * v;
  };
  const fbm = (x: number, y: number) => {
    let f = 0;
    let a = 0.5;
    let fr = 1;
    for (let o = 0; o < 5; o++) {
      f += a * vnoise(x * fr, y * fr);
      a *= 0.5;
      fr *= 2;
    }
    return f;
  };

  // base near white, cool grey veins
  const base = [233, 234, 240];
  const vein = [138, 147, 166];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * 6;
      const ny = (y / size) * 6;
      const turb = fbm(nx, ny);
      let m = Math.sin((nx + turb * 4.5) * Math.PI); // -1..1
      m = Math.pow(Math.abs(m), 0.45); // 0 at vein center, sharpen the veins
      const idx = (y * size + x) * 4;
      img.data[idx] = vein[0] + (base[0] - vein[0]) * m;
      img.data[idx + 1] = vein[1] + (base[1] - vein[1]) * m;
      img.data[idx + 2] = vein[2] + (base[2] - vein[2]) * m;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function Spheres({ animate, mobile }: { animate: boolean; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const eased = useRef(0);
  const marble = useMemo(() => makeMarbleTexture(mobile ? 256 : 512), [mobile]);

  useFrame((state, delta) => {
    if (!animate) return;
    eased.current += (scrollProgress.current - eased.current) * 0.08;
    const p = eased.current;
    for (let i = 0; i < 4; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const { pos, scale } = sphereTransform(i, p);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.scale.setScalar(scale);
      mesh.rotation.y += delta * 0.12 * (i % 2 ? -1 : 1);
    }
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.03;
      group.current.rotation.x = -0.05 + p * 0.12;
    }
  });

  const seg = mobile ? 48 : 96;

  return (
    <group
      ref={group}
      rotation={animate ? undefined : [-0.05 + STATIC_PROGRESS * 0.12, 0, 0]}
    >
      {[0, 1, 2, 3].map((i) => {
        const t = sphereTransform(i, STATIC_PROGRESS);
        return (
          <mesh
            key={i}
            ref={(el) => {
              meshes.current[i] = el;
            }}
            position={animate ? undefined : t.pos}
            scale={animate ? undefined : t.scale}
          >
            <sphereGeometry args={[1, seg, seg]} />
            {/* Polished cool marble. Clearcoat gives the wet stone highlight the
                two colored lights bloom into. */}
            <meshPhysicalMaterial
              map={marble}
              color="#ffffff"
              roughness={0.35}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.22}
              emissive="#0A1330"
              emissiveIntensity={0.05}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function LightRig({ animate }: { animate: boolean }) {
  const rig = useRef<THREE.Group>(null);
  const eased = useRef(0);

  useFrame(() => {
    if (!animate || !rig.current) return;
    eased.current += (scrollProgress.current - eased.current) * 0.08;
    rig.current.rotation.z = eased.current * LIGHT_RIG_SWEEP;
  });

  return (
    <group
      ref={rig}
      rotation={animate ? undefined : [0, 0, STATIC_PROGRESS * LIGHT_RIG_SWEEP]}
    >
      {/* blue key light, reaches across to the spread spheres */}
      <pointLight
        color="#2E7BFF"
        intensity={14}
        distance={16}
        decay={2}
        position={[2.6, 1.4, 3.2]}
      />
      {/* pink rim light, the Bask brand accent */}
      <pointLight
        color="#FA0F4B"
        intensity={18}
        distance={16}
        decay={2}
        position={[-2.6, -1.2, 3.0]}
      />
    </group>
  );
}

function CameraRig({ animate }: { animate: boolean }) {
  const eased = useRef(0);
  useFrame((state) => {
    if (!animate) return;
    eased.current += (scrollProgress.current - eased.current) * 0.08;
    state.camera.position.z = lerp(
      CAMERA_Z_NEAR,
      CAMERA_Z_FAR,
      stage(eased.current, 0, 0.6)
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function PostFX({ mobile }: { mobile: boolean }) {
  // Reference stack order: depth of field, bloom, vignette.
  return (
    <EffectComposer>
      {mobile ? (
        <></>
      ) : (
        <DepthOfField focusDistance={0.09} focalLength={0.02} bokehScale={2.2} />
      )}
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.8}
        mipmapBlur
        radius={0.55}
      />
      <Vignette offset={0.32} darkness={0.9} />
    </EffectComposer>
  );
}

export default function SignatureScene() {
  useScrollProgress();
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setMobile(window.innerWidth < 760);
    setAnimate(!reduce);
    setReady(true);
  }, []);

  // The canvas sits in a position fixed container. On first mount R3F can
  // measure that container as zero before its own resize listener is attached,
  // leaving the canvas at its default 300x150. Kick a re-measure a few times
  // until R3F sizes the canvas (it stamps an inline width once it does).
  useEffect(() => {
    if (!ready) return;
    let tries = 0;
    let timer = 0;
    const kick = () => {
      window.dispatchEvent(new Event("resize"));
      const canvas = document.querySelector<HTMLCanvasElement>(
        ".scene-bg canvas"
      );
      tries += 1;
      if ((!canvas || !canvas.style.width) && tries < 20) {
        timer = window.setTimeout(kick, 60);
      }
    };
    timer = window.setTimeout(kick, 0);
    return () => window.clearTimeout(timer);
  }, [ready]);

  if (!ready) return null;

  return (
    <Canvas
      frameloop={animate ? "always" : "demand"}
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{
        fov: CAMERA_FOV,
        near: 0.1,
        far: 100,
        position: [0, 0, CAMERA_Z_NEAR],
      }}
    >
      <color attach="background" args={["#050D30"]} />
      <ambientLight intensity={0.25} color="#7C8CFF" />
      <hemisphereLight
        args={["#3A5BFF", "#050D30", 0.18]}
        position={[0, 1, 0]}
      />
      <Spheres animate={animate} mobile={mobile} />
      <LightRig animate={animate} />
      <CameraRig animate={animate} />
      <PostFX mobile={mobile} />
    </Canvas>
  );
}
