"use client";

import { Siren } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/UiKecil/button";
import { cn } from "@/src/lib/utils";
import { Reveal } from "@/src/components/motion";
import { useSiteSettings } from "@/src/lib/hooks";

const ICONS = {
  whatsapp: "/assets/icons/whatsapp.svg",
  phone: "/assets/icons/phone.svg",
} as const;

function AssetIcon({
  src,
  alt,
  size,
  className,
}: {
  src: string;
  alt: string;
  size: number;
  className?: string;
}) {
  return (
    <Image src={src} alt={alt} width={size} height={size} className={cn("shrink-0", className)} />
  );
}

// Banner "Butuh bantuan segera?" — dipakai di SEMUA halaman publik tepat
// sebelum <Footer />, supaya konsisten (sebelumnya ini disalin-tempel jadi
// beberapa copy berbeda per halaman, dan sebagian halaman malah tidak
// menyertakannya sama sekali).
export default function EmergencyCta() {
  const settings = useSiteSettings();
  const clinicPhone = settings.telepon;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f4c81] via-[#1a5fa0] to-[#2d7dd2]">
      <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-40" />
      <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-[#5fd0e8]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-[#e8861e]/20 blur-3xl" />

      <div className="relative section-container flex flex-col gap-6 py-9 lg:flex-row lg:items-center lg:justify-between">
        <Reveal direction="right" className="flex items-center gap-4">
          <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-[#2d7dd2] md:h-[104px] md:w-[104px]">
            <span
              className="absolute inset-0 rounded-full ring-2 ring-white/30"
              style={{ animation: "soft-pulse 2.2s ease-out infinite" }}
            />
            <Siren className="h-9 w-9 text-white md:h-12 md:w-12" />
          </div>
          <div>
            <div className="t-h4 font-bold text-white">Butuh bantuan segera?</div>
            <div className="t-body mt-1 text-white/90">UGD kami buka 24 jam</div>
            <div className="t-body text-white/90">hubungi kami</div>
          </div>
        </Reveal>
        <Reveal direction="left" delay={120} className="flex flex-wrap gap-4">
          <Button
            className="btn-shine h-11 rounded-full bg-[#008000] px-6 t-body text-white shadow-lg shadow-emerald-900/30 transition-transform hover:-translate-y-0.5 hover:bg-[#067006] lg:h-12"
            asChild
          >
            <Link href="/pendaftaran_online_1">
              <>
                <AssetIcon src={ICONS.whatsapp} alt="" size={20} className="mr-2" />
                Daftar Online
              </>
            </Link>
          </Button>
          <Button
            className="btn-shine h-11 rounded-full bg-[#e8861e] px-6 t-body text-white shadow-lg shadow-orange-900/20 transition-transform hover:-translate-y-0.5 hover:bg-[#d77a18] lg:h-12"
            asChild
          >
            <a href={`tel:${clinicPhone.replace(/-/g, "")}`}>
              <AssetIcon src={ICONS.phone} alt="" size={20} className="mr-2" />
              {clinicPhone}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
