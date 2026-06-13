"use client";

import { MapPin, Phone, Siren } from "lucide-react";
import Image from "next/image";
import { useHomeData } from "@/src/lib/api";
import { cn } from "@/src/lib/utils";

const ASSETS = {
  logo: "/assets/logo/LOGO.svg",
  icons: {
    whatsapp: "/assets/icons/whatsapp.svg",
    instagram: "/assets/icons/instagram.svg",
    facebook: "/assets/icons/facebook.svg",
    tiktok: "/assets/icons/tiktok.svg",
  },
} as const;

const socialIconMap: Record<string, string> = {
  instagram: ASSETS.icons.instagram,
  facebook:  ASSETS.icons.facebook,
  tiktok:    ASSETS.icons.tiktok,
  whatsapp:  ASSETS.icons.whatsapp,
};

const FALLBACK_SOCIALS = [
  { key: "instagram", icon: ASSETS.icons.instagram, label: "Instagram" },
  { key: "facebook",  icon: ASSETS.icons.facebook,  label: "Facebook"  },
  { key: "tiktok",    icon: ASSETS.icons.tiktok,    label: "TikTok"    },
  { key: "whatsapp",  icon: ASSETS.icons.whatsapp,  label: "WhatsApp"  },
];

export default function Footer() {
  const { data } = useHomeData();
  const socialLinks = data?.social_links ?? [];

  const socials = socialLinks.length > 0
    ? socialLinks.map((item) => ({
        key: item.label.toLowerCase(),
        icon: socialIconMap[item.label.toLowerCase()] ?? ASSETS.icons.whatsapp,
        label: item.label,
        url: item.url,
      }))
    : FALLBACK_SOCIALS.map((s) => ({ ...s, url: "#" }));

  return (
    <footer className="relative overflow-hidden bg-[#eef8fb]">
      {/* Dot-grid pattern — ties to brand teal, sangat subtle */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, #00b4d8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.07,
        }}
      />
      {/* Vignette fade di tepi agar dot tidak terlalu ramai */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #eef8fb 100%)",
        }}
      />

      {/* Main content */}
      <div className="relative section-wrap pb-6 pt-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ── Kiri: Brand ── */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#00b4d8]/20 bg-white shadow-sm">
                <Image
                  src={ASSETS.logo}
                  alt="Logo AMC"
                  width={44}
                  height={44}
                  className="-translate-y-1 object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#00b4d8]/70">
                  Klinik Rawat Inap
                </p>
                <p className="text-xl font-bold leading-tight text-[#e8861e]">
                  Ampelgading Medical Centre
                </p>
              </div>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-[#4a6a78]">
              Melayani dengan sepenuh hati sejak 2011. Kesehatan Anda adalah prioritas kami.
            </p>

            <div className="mt-3 space-y-0.5">
              <p className="text-xs text-[#7a9aa8]">PT. Banar Medika Mandiri</p>
              <p className="text-xs text-[#9ab4be]">NIB: 0220106452414</p>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#00b4d8]/20 bg-white shadow-sm transition-all duration-200 hover:scale-110 hover:border-[#00b4d8]/50 hover:bg-[#00b4d8]/10"
                >
                  <Image
                    src={s.icon}
                    alt={s.label}
                    width={18}
                    height={18}
                    className="object-contain opacity-70 transition-opacity group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* ── Kanan: Kontak ── */}
          <div className={cn("lg:border-l lg:border-[#00b4d8]/15 lg:pl-12")}>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#00b4d8]/70">
              Hubungi Kami
            </p>

            <div className="mb-5 flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00b4d8]" />
              <p className="text-sm leading-relaxed text-[#4a6a78]">
                Dsn. Krajan RT.013 RW.005, Desa Tirtomarto,<br />
                Kec. Ampelgading, Kab. Malang 65183
              </p>
            </div>

            <a
              href="tel:081225566055"
              className="mb-3 flex items-center gap-3 text-sm text-[#4a6a78] transition-colors hover:text-[#1a1a1a]"
            >
              <Phone className="h-4 w-4 shrink-0 text-[#00b4d8]" />
              0812-2556-6055
            </a>

            <a
              href="https://wa.me/6281225566055"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 flex items-center gap-3 text-sm text-[#4a6a78] transition-colors hover:text-[#16a34a]"
            >
              <Image
                src={ASSETS.icons.whatsapp}
                alt="WhatsApp"
                width={16}
                height={16}
                className="shrink-0 object-contain"
              />
              Chat via WhatsApp
            </a>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-50 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-600">Buka 24 JAM</span>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={cn(
          "mt-8 flex flex-col gap-2 border-t border-[#00b4d8]/15 pt-5",
          "sm:flex-row sm:items-center sm:justify-between",
        )}>
          <p className="text-xs text-[#8aacb8]">
            © 2025 Ampelgading Medical Centre. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-1.5">
            <Siren className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs text-[#8aacb8]">UGD 24 JAM — Siap melayani kapan saja</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
