"use client";

import * as React from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { startSession, trackPageview, endSession } from "@/src/lib/tracking";
import { loadConsent, onConsentChanged } from "@/src/lib/consent";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Halaman admin tidak perlu di-track — hanya trafik pengunjung website publik
function isAdminPath(path: string): boolean {
  return path.startsWith("/admin") || path.includes("_admin");
}

export default function SiteAnimations() {
  const pathname = usePathname();
  const transitionLayerRef = React.useRef<HTMLDivElement | null>(null);
  const isFirstRender = React.useRef(true);

  // GSAP page transition — berjalan setiap route berubah (sama seperti sebelumnya)
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

  // Mulai sesi HANYA bila consent analitik sudah diberikan (lewat CookieConsent).
  // Lewati tracking jika halaman admin — baca window.location.pathname karena effect
  // hanya berjalan di client, dan deps array harus tetap [] (tidak boleh berubah ukuran)
  React.useEffect(() => {
    if (isAdminPath(window.location.pathname)) return;

    function tryStart() {
      const consent = loadConsent();
      if (consent?.analytics) startSession();
    }

    tryStart(); // consent mungkin sudah tersimpan dari kunjungan sebelumnya
    const unsubscribe = onConsentChanged((consent) => {
      if (consent.analytics) startSession();
    });

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        endSession();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribe();
    };
  }, []);

  // Catat pageview setiap kali pathname berubah, lewati render pertama dan halaman admin
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isAdminPath(pathname)) return;
    if (!loadConsent()?.analytics) return;
    trackPageview(pathname);
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
