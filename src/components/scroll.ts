"use client";

import { useEffect } from "react";

/**
 * Shared scroll progress, 0 at the top of the document to 1 at the bottom.
 * The signature scene reads this once per frame. Nothing here ever writes to
 * scroll, so the page can never be hijacked, trapped, or stuttered by the canvas.
 */
export const scrollProgress = { current: 0 };

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function measure(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? clamp01(window.scrollY / max) : 0;
}

/**
 * Installs passive scroll and resize listeners that keep scrollProgress current.
 * Passive listeners cannot call preventDefault, so scrolling stays native.
 */
export function useScrollProgress(): void {
  useEffect(() => {
    const update = () => {
      scrollProgress.current = measure();
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
}
