"use client";

import { useMemo } from "react";

/*
  Subtle constellation backdrop: tiny lavender white dots scattered on the void.
  Purely decorative and non interactive. Fixed, so it stays put while the page
  scrolls over it. Sits above the 3D canvas and below all content, so it shows
  only in the gaps between the dark cards, like a star field.

  Positions come from a seeded generator (not Math.random) so the server and
  client render the exact same stars, avoiding a hydration mismatch.
*/

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function StarField({ count = 140 }: { count?: number }) {
  const stars = useMemo(() => {
    const rng = makeRng(1337);
    return Array.from({ length: count }, () => {
      const size = rng() < 0.15 ? 2 : 1;
      return {
        left: rng() * 100,
        top: rng() * 100,
        size,
        opacity: 0.12 + rng() * 0.45,
      };
    });
  }, [count]);

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
