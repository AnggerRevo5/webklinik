"use client";

import * as React from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SiteAnimations() {
  const pathname = usePathname();
  const transitionLayerRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return;

    const transitionLayer = transitionLayerRef.current;
    if (!transitionLayer) return;

    const timeline = gsap.timeline({ defaults: { ease: "sine.out" } });

    timeline
      .set(transitionLayer, { autoAlpha: 0 })
      .to(transitionLayer, { autoAlpha: 1, duration: 0.08 })
      .to(transitionLayer, { autoAlpha: 0, duration: 0.45 });

    return () => {
      timeline.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={transitionLayerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.16),transparent_42%),linear-gradient(180deg,rgba(10,24,36,0.08),rgba(10,24,36,0.02))]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00b4d8] via-[#1a5fa0] to-[#e8861e]" />
    </div>
  );
}
