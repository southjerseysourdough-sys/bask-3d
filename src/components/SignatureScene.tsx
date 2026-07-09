"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
  HueSaturation,
  Noise,
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import * as THREE from "three";
import { scrollProgress, useScrollProgress } from "./scroll";

/*
  The Bask signature graphic: Dot Dome, a faithful port of the reference
  scene's measured state (camera, light rig, animation keyframes, material,
  fog, and post stack all read from the live scene's published state). The
  geometry is our own instanced dash dome; the sparse Bask pink accents are
  the one deliberate deviation.

  How the reference actually moves:
  - The camera never moves. The model's parent group does everything:
    it spins half a turn in the first fifth of the scroll, bobs, and scales,
    all finished by 50 percent scroll, holding after.
  - The light rig (two blue point lights) translates across the scene.
  - A lit grey backdrop plane gives the blue wash behind the hero, then
    recedes into the fog by 13 percent scroll.
  - Every keyframe interpolates linearly. Scroll progress is the timeline.
*/

// ---- Camera (static; rig z -1.8532 + camera z 8.0692) ----
const CAM_POS: [number, number, number] = [0, -0.0214, 6.216];
const CAM_FOV = 30;
const MOBILE_ZOOM = 0.7;

const STATIC_PROGRESS = 0.0; // reduced motion holds the hero pose

// ---- Keyframe tracks measured from the reference (linear, hold at ends) ----
type Track = [number, number][];
const TRACKS: Record<string, Track> = {
  mainPx: [
    [0, 0],
    [0.101, 2.273],
    [0.151, 2.273],
    [0.208, 0.122],
    [0.459, 0.122],
    [0.5, 5.724],
  ],
  mainPy: [
    [0, 2.161],
    [0.101, 0.065],
    [0.151, 2.633],
    [0.208, 0.063],
    [0.5, 0.063],
  ],
  mainPz: [
    [0, 0],
    [0.208, 0],
    [0.398, -8.279],
    [0.459, -8.279],
    [0.5, -3.773],
  ],
  mainRy: [
    [0, 0],
    [0.101, 1.571],
    [0.151, 1.571],
    [0.208, 3.142],
    [0.459, 3.142],
    [0.5, 2.725],
  ],
  mainS: [
    [0, 1.51],
    [0.101, 1.689],
    [0.151, 1.689],
    [0.208, 2.332],
    [0.398, 1.337],
    [0.459, 1.773],
    [0.5, 3.063],
  ],
  mainSz: [
    [0, 1.51],
    [0.101, 1.689],
    [0.151, 1.689],
    [0.208, 2.547],
    [0.398, 1.461],
    [0.459, 1.936],
    [0.5, 3.345],
  ],
  lightPx: [
    [0, 0],
    [0.1, 1.188],
    [0.2, 1.188],
    [0.3, 0],
    [0.35, 0],
    [0.4, 2.114],
  ],
  lightPy: [
    [0, 1.321],
    [0.1, 0],
    [0.4, 0],
  ],
  lightPz: [
    [0, 3.996],
    [0.2, 3.996],
    [0.3, 0],
    [0.35, 0],
    [0.4, 4.65],
  ],
  bgPz: [
    [0, -9.902],
    [0.085, -9.902],
    [0.11, -11.329],
    [0.129, -60.732],
  ],
};

function sample(track: Track, t: number): number {
  if (t <= track[0][0]) return track[0][1];
  const last = track[track.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 1; i < track.length; i++) {
    if (t <= track[i][0]) {
      const [t0, v0] = track[i - 1];
      const [t1, v1] = track[i];
      const f = (t - t0) / (t1 - t0);
      return v0 + (v1 - v0) * f;
    }
  }
  return last[1];
}

// ---- Dome geometry: concentric rings of dashes in the XY plane, bowl along
// Z so the reference's Y spin sweeps it from face on to edge on. ----
const MAX_R = 2.0;
const DOME_DEPTH = 1.5; // rim sits toward the camera, center recedes
const RIM_WAVE = 0.28; // scalloped petal wave
const PETALS = 9;

function buildDome(mobile: boolean): {
  blue: { positions: Float32Array; angles: Float32Array; count: number };
  pink: { positions: Float32Array; angles: Float32Array; count: number };
  dashLong: number;
  dashThin: number;
} {
  const RINGS = mobile ? 22 : 34;
  const DENSITY = mobile ? 12 : 21; // dots nearly touch along a ring
  const INNER = mobile ? 4 : 6;

  const bluePos: number[] = [];
  const blueAng: number[] = [];
  const pinkPos: number[] = [];
  const pinkAng: number[] = [];

  for (let ri = INNER; ri <= RINGS; ri++) {
    const r = (ri / RINGS) * MAX_R;
    const circ = 2 * Math.PI * r;
    const count = Math.max(8, Math.floor(circ * DENSITY));
    for (let j = 0; j < count; j++) {
      const theta = (j / count) * Math.PI * 2 + ri * 0.012;
      const bowl = DOME_DEPTH * (r / MAX_R) * (r / MAX_R);
      const scallop =
        RIM_WAVE * Math.sin(theta * PETALS) * (r / MAX_R) * (r / MAX_R);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = bowl + scallop;
      // sparse pink accents near the center: the Bask signal
      const isPink = r / MAX_R < 0.34 && Math.random() < 0.11;
      if (isPink) {
        pinkPos.push(x, y, z);
        pinkAng.push(theta);
      } else {
        bluePos.push(x, y, z);
        blueAng.push(theta);
      }
    }
  }

  return {
    blue: {
      positions: new Float32Array(bluePos),
      angles: new Float32Array(blueAng),
      count: blueAng.length,
    },
    pink: {
      positions: new Float32Array(pinkPos),
      angles: new Float32Array(pinkAng),
      count: pinkAng.length,
    },
    dashLong: mobile ? 0.042 : 0.038,
    dashThin: 0.016,
  };
}

function DashSet({
  positions,
  angles,
  count,
  dashLong,
  dashThin,
  color,
  emissive,
}: {
  positions: Float32Array;
  angles: Float32Array;
  count: number;
  dashLong: number;
  dashThin: number;
  color: string;
  emissive: string;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const zAxis = new THREE.Vector3(0, 0, 1);
    const p = new THREE.Vector3();
    const s = new THREE.Vector3(dashLong, dashThin, dashThin);
    for (let i = 0; i < count; i++) {
      p.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      q.setFromAxisAngle(zAxis, angles[i] + Math.PI / 2); // dash along the ring
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      {/* reference material: lit metal with matching emissive, roughness 1 */}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={1}
        metalness={1}
        roughness={1}
      />
    </instancedMesh>
  );
}

function MainController({
  animate,
  mobile,
  staticProgress,
}: {
  animate: boolean;
  mobile: boolean;
  staticProgress: number;
}) {
  const group = useRef<THREE.Group>(null);
  const dome = useRef<THREE.Group>(null);
  const eased = useRef(0);
  const geo = useMemo(() => buildDome(mobile), [mobile]);

  const apply = (t: number, time: number) => {
    const g = group.current;
    if (!g) return;
    g.position.set(
      sample(TRACKS.mainPx, t),
      sample(TRACKS.mainPy, t),
      sample(TRACKS.mainPz, t)
    );
    g.rotation.y = sample(TRACKS.mainRy, t);
    const s = sample(TRACKS.mainS, t);
    g.scale.set(s, s, sample(TRACKS.mainSz, t));
    // stand in for the reference model's slow baked ambient clip
    if (dome.current) dome.current.rotation.z = time * 0.04;
  };

  useLayoutEffect(() => {
    apply(staticProgress, 0.0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticProgress]);

  useFrame((state) => {
    if (!animate) return;
    eased.current += (scrollProgress.current - eased.current) * 0.08;
    apply(eased.current, state.clock.elapsedTime);
  });

  return (
    <group ref={group}>
      <group ref={dome}>
        <DashSet {...geo.blue} dashLong={geo.dashLong} dashThin={geo.dashThin}
          color="#6DA3FF" emissive="#6DA3FF" />
        <DashSet {...geo.pink} dashLong={geo.dashLong} dashThin={geo.dashThin}
          color="#FA0F4B" emissive="#FA0F4B" />
      </group>
    </group>
  );
}

function LightController({
  animate,
  staticProgress,
}: {
  animate: boolean;
  staticProgress: number;
}) {
  const group = useRef<THREE.Group>(null);
  const eased = useRef(0);

  const apply = (t: number) => {
    const g = group.current;
    if (!g) return;
    g.position.set(
      sample(TRACKS.lightPx, t),
      sample(TRACKS.lightPy, t),
      sample(TRACKS.lightPz, t)
    );
  };

  useLayoutEffect(() => {
    apply(staticProgress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticProgress]);

  useFrame(() => {
    if (!animate) return;
    eased.current += (scrollProgress.current - eased.current) * 0.08;
    apply(eased.current);
  });

  return (
    <group ref={group}>
      {/* both reference lights are the same blue. The decay 0 light is scaled
          down for this renderer so dots read blue with highlights, not white. */}
      <pointLight
        color="#1786FF"
        intensity={5}
        distance={34.15}
        decay={0}
        position={[0.866, 1.182, 1.221]}
      />
      <pointLight
        color="#1786FF"
        intensity={25}
        distance={20}
        decay={1.76}
        position={[-1.08, -0.942, 1.221]}
      />
    </group>
  );
}

function Backdrop({
  animate,
  staticProgress,
}: {
  animate: boolean;
  staticProgress: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const eased = useRef(0);

  const apply = (t: number) => {
    if (mesh.current) mesh.current.position.z = sample(TRACKS.bgPz, t);
  };

  useLayoutEffect(() => {
    apply(staticProgress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticProgress]);

  useFrame(() => {
    if (!animate) return;
    eased.current += (scrollProgress.current - eased.current) * 0.08;
    apply(eased.current);
  });

  // the grey plane the blue lights wash across, giving the hero its glow
  return (
    <mesh ref={mesh} scale={[26.98, 15.45, 1]} position={[0, 0, -9.902]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color="#6A6A6A" metalness={0.41} roughness={0.64} />
    </mesh>
  );
}

function MouseTilt({ enabled }: { enabled: boolean }) {
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX / window.innerWidth - 0.5;
      target.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  useFrame((state) => {
    if (!enabled) return;
    const cam = state.camera;
    cam.position.x += (target.current.x * 0.35 - cam.position.x) * 0.04;
    cam.position.y +=
      (CAM_POS[1] - target.current.y * 0.2 - cam.position.y) * 0.04;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

function PostFX() {
  // Reference stack and order: bloom, vignette, tone mapping, saturation, noise.
  // Blend functions decoded from the reference state: bloom SCREEN (default),
  // noise SOFT_LIGHT, the rest NORMAL.
  return (
    <EffectComposer multisampling={8}>
      <Bloom
        intensity={1.0}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.028}
        mipmapBlur
        radius={0.89}
      />
      <Vignette offset={0.2} darkness={0.5} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <HueSaturation saturation={0.2} />
      <Noise opacity={0.2} blendFunction={BlendFunction.SOFT_LIGHT} />
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
  // measure that container as zero before its own resize listener is attached.
  // Kick a re-measure until R3F sizes the canvas.
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
        fov: CAM_FOV,
        near: 0.1,
        far: 1000,
        position: CAM_POS,
        zoom: mobile ? MOBILE_ZOOM : 1,
      }}
    >
      {/* background and fog share one color, as in the reference, so the
          fogged backdrop plane disappears seamlessly into the void */}
      <color attach="background" args={["#030818"]} />
      <fog attach="fog" args={["#030818", 10, 20]} />
      <MainController
        animate={animate}
        mobile={mobile}
        staticProgress={STATIC_PROGRESS}
      />
      <LightController animate={animate} staticProgress={STATIC_PROGRESS} />
      <Backdrop animate={animate} staticProgress={STATIC_PROGRESS} />
      <MouseTilt enabled={animate && !mobile} />
      <PostFX />
    </Canvas>
  );
}
