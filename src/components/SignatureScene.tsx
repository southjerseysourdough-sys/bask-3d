"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  The Bask signature graphic.

  Technique measured from the reference scene: a metallic dotted surface lit by
  two hard colored lights held in a light rig. The dots barely move. What reads
  as motion is the rig raking a highlight across the metal as you scroll, the
  whole model turning slowly, and bloom letting the lit dots glow. Positions are
  baked once (a shallow dome of concentric rings with a static wave relief), so
  we never push thousands of vertices per frame.

  One continuous timeline driven by scroll progress 0 to 1, read once per frame.
*/

// ---- Measured reference values ----
const CAMERA_FOV = 30;
const CAMERA_Z_NEAR = 8.4; // start of scroll
const CAMERA_Z_FAR = 9.6; // reached by 60 percent scroll
const MODEL_SCALE = 1.5;
const LIGHT_RIG_SWEEP = 2.114; // radians on Z across the full scroll
const STATIC_PROGRESS = 0.15; // frozen pose for reduced motion

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}
function stage(p: number, a: number, b: number): number {
  return clamp01((p - a) / (b - a));
}

// ---- Concentric ring dome geometry, built once ----
function buildDome(mobile: boolean): {
  positions: Float32Array;
  count: number;
  dotSize: number;
} {
  const RINGS = mobile ? 30 : 50;
  const MAX_R = 2.0; // local units, the model group scales this by 1.5
  const DENSITY = mobile ? 9 : 18; // dots per unit of circumference
  const DOME_DEPTH = 0.5; // shallow dome toward the camera
  const WAVE_AMP = 0.06; // static ripple relief baked into z
  const WAVE_FREQ = 6.0;

  const pts: number[] = [];
  for (let ri = 1; ri <= RINGS; ri++) {
    const r = (ri / RINGS) * MAX_R;
    const circumference = 2 * Math.PI * r;
    const count = Math.max(6, Math.floor(circumference * DENSITY));
    for (let j = 0; j < count; j++) {
      const angle = (j / count) * Math.PI * 2 + ri * 0.06; // slight per ring twist
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const dome = DOME_DEPTH * (1 - (r / MAX_R) * (r / MAX_R));
      const wave = WAVE_AMP * Math.sin(r * WAVE_FREQ);
      const z = dome + wave; // relief faces the camera
      pts.push(x, y, z);
    }
  }
  return {
    positions: new Float32Array(pts),
    count: pts.length / 3,
    dotSize: mobile ? 0.026 : 0.02,
  };
}

function DotField({ mobile }: { mobile: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { positions, count, dotSize } = useMemo(
    () => buildDome(mobile),
    [mobile]
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3(dotSize, dotSize, dotSize);
    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      p.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, count, dotSize]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, mobile ? 6 : 8, mobile ? 6 : 8]} />
      {/* Grey blue metal. The color you see on screen is the light, not the base. */}
      <meshStandardMaterial
        color="#6DA3FF"
        metalness={1.0}
        roughness={0.6}
        emissive="#0A1A3F"
        emissiveIntensity={0.12}
      />
    </instancedMesh>
  );
}

function Model({ animate, mobile }: { animate: boolean; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!animate || !group.current) return;
    const t = state.clock.elapsedTime;
    const p = scrollProgress.current;
    // slow continuous ambient turn plus a small scroll nudge
    group.current.rotation.z = t * 0.05 + p * 0.35;
    // tilt slightly deeper into the page as you scroll
    group.current.rotation.x = -0.05 + p * 0.33;
  });

  const staticRotation: [number, number, number] = [
    -0.05 + STATIC_PROGRESS * 0.33,
    0,
    STATIC_PROGRESS * 0.35,
  ];

  return (
    <group
      ref={group}
      scale={MODEL_SCALE}
      rotation={animate ? undefined : staticRotation}
    >
      <DotField mobile={mobile} />
    </group>
  );
}

function LightRig({ animate }: { animate: boolean }) {
  const rig = useRef<THREE.Group>(null);
  const eased = useRef(0);

  useFrame(() => {
    if (!animate || !rig.current) return;
    // ease toward live scroll so the sweep is smooth, never jumpy
    eased.current += (scrollProgress.current - eased.current) * 0.08;
    rig.current.rotation.z = eased.current * LIGHT_RIG_SWEEP;
  });

  return (
    <group
      ref={rig}
      rotation={animate ? undefined : [0, 0, STATIC_PROGRESS * LIGHT_RIG_SWEEP]}
    >
      {/* blue key light */}
      <pointLight
        color="#2E7BFF"
        intensity={55}
        distance={9}
        decay={2}
        position={[1.7, 0, 2.0]}
      />
      {/* pink rim light, the Bask swap for the reference second blue light */}
      <pointLight
        color="#FA0F4B"
        intensity={48}
        distance={9}
        decay={2}
        position={[-1.7, 0.5, 1.8]}
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
        <DepthOfField
          focusDistance={0.08}
          focalLength={0.02}
          bokehScale={2.5}
        />
      )}
      <Bloom
        intensity={1.0}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />
      <Vignette offset={0.32} darkness={0.92} />
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
    const forceStatic = new URLSearchParams(window.location.search).has(
      "static"
    );
    setMobile(window.innerWidth < 760);
    setAnimate(!reduce && !forceStatic);
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

  // Nothing renders until we are on the client and know the environment. The
  // navy body background stands in until the canvas paints.
  if (!ready) return null;

  return (
    <Canvas
      frameloop={animate ? "always" : "demand"}
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      camera={{
        fov: CAMERA_FOV,
        near: 0.1,
        far: 100,
        position: [0, 0, CAMERA_Z_NEAR],
      }}
    >
      <color attach="background" args={["#050D30"]} />
      {/* faint fill so the metal is never pure black where the rig does not reach */}
      <ambientLight intensity={0.1} color="#5B7FFF" />
      <Model animate={animate} mobile={mobile} />
      <LightRig animate={animate} />
      <CameraRig animate={animate} />
      <PostFX mobile={mobile} />
    </Canvas>
  );
}
