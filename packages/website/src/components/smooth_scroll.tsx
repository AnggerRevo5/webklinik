"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/src/components/motion";

// Halaman admin tidak perlu smooth-scroll — dashboard/tabel data lebih enak
// di-scroll native/instan, dan Lenis di area yang isinya panjang/scrollable
// per-panel bisa terasa janggal.
function isAdminPath(path: string): boolean {
  return path.startsWith("/admin") || path.includes("_admin");
}

// Lenis mengukur tinggi konten sekali saat mount. Beberapa section (mis.
// review/staff/galeri) mengambil datanya secara async DI CLIENT dan baru
// merender penuh setelah fetch selesai — tinggi halaman jadi bertambah
// SETELAH Lenis mengukur, sehingga batas scroll Lenis basi dan scroll
// terasa "macet" sebelum benar-benar sampai Footer. Observer ini memaksa
// Lenis mengukur ulang tiap kali tinggi dokumen berubah.
function LenisResizeSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const observer = new ResizeObserver(() => lenis.resize());
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [lenis]);

  return null;
}

// Smooth scroll ala Awwwards (momentum + easing), pakai Lenis. Dinonaktifkan
// total untuk admin dan untuk prefers-reduced-motion — bukan cuma dihaluskan,
// supaya selaras dengan filosofi aksesibilitas di motion.tsx (skip total,
// bukan sekadar kurangi durasi).
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  if (isAdminPath(pathname) || reduced) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
        smoothWheel: true,
        touchMultiplier: 1.5,
      }}
    >
      <LenisResizeSync />
      {children}
    </ReactLenis>
  );
}
