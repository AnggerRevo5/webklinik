"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  MapPin,
  Send,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import {
  type HomeData,
  type DokterPublik,
  type Artikel,
  getDokterPublik,
  getArtikel,
} from "@/src/lib/api";
import { useHomeData, useSiteSettings } from "@/src/lib/hooks";
import { trackSocialClick } from "@/src/lib/tracking";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Input } from "@/src/UiKecil/input";
import { Section, SectionHeader } from "@/src/UiKecil/section";
import { Separator } from "@/src/UiKecil/separator";
import { Textarea } from "@/src/UiKecil/textarea";
import {
  cn,
  formatOperationalHours,
  normalizePhoneNumber,
} from "@/src/lib/utils";
import PageFooter from "@/src/components/page_footer";
import Navbar from "@/src/components/navbar";
import { Reveal, Parallax, Tilt, ScrollProgress, WordReveal, Marquee, Magnetic, ClipReveal } from "@/src/components/motion";

type HeroStat = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
};

type LayananItem = {
  title: string;
  image: string;
};

type DoctorItem = {
  id: number;
  name: string;
  role: string;
  schedule: string;
  time: string;
  gradient: string;
  avatarClassName: string;
  image: string;
  initials: string;
  jadwalDetail?: {
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    poli: string;
  }[];
};

type PromoItem = {
  title: string;
  image: string;
  date: string;
  description: string;
};

type ArticleItem = {
  title: string;
  image: string;
  description: string;
  slug?: string;
};

/* ─── Site constants ─── */

/* Nomor kontak default — dipakai bila setting belum termuat. Nilai aktual
   diambil dinamis per-komponen via useSiteSettings(). */

const ASSETS = {
  logo: "/assets/logo/LOGO.svg",
  hero: "/assets/banner/Banner.svg",
  icons: {
    whatsapp: "/assets/icons/whatsapp.svg",
    phone: "/assets/icons/phone.svg",
    instagram: "/assets/icons/instagram.svg",
    facebook: "/assets/icons/facebook.svg",
    tiktok: "/assets/icons/tiktok.svg",
    email: "/assets/icons/email.svg",
    location: "/assets/icons/location.svg",
  },
} as const;

const cardShadowSoft =
  "shadow-[0px_2.87px_17.25px_-0.72px_#00000033] transition-shadow duration-300 hover:shadow-[0px_4px_24px_-2px_#00000040]";
const cardShadowMd =
  "shadow-[0px_3.43px_20.59px_-0.86px_#00000033] transition-shadow duration-300 hover:shadow-[0px_5px_28px_-2px_#00000045]";
const btnPrimary = "rounded-full bg-[#00b4d8] text-white hover:bg-[#00a3c5]";
const btnSoft = "rounded-full bg-[#00b4d826] text-black hover:bg-[#00b4d833]";

/* Re-usable button height token (48px desktop, 44px mobile) */
const btnHeight = "h-11 lg:h-12";

const CLINIC_ADDRESS =
  "Dsn. Krajan RT.013 RW.005, Desa Tirtomarto, Kec. Ampelgading, Kab. Malang, Jawa Timur 65183";

// URL instagram/facebook/tiktok/email diambil dari site_settings (bisa
// diedit admin) lewat useSiteSettings() di dalam HubungiKamiSection — bukan
// lagi hardcoded "#", lihat SITE_DEFAULTS di src/lib/api.ts untuk nilai awal.
function socialLinkItems(settings: Record<string, string>) {
  return [
    { key: "instagram", label: "Instagram", href: settings.instagram, icon: ASSETS.icons.instagram },
    { key: "facebook", label: "Facebook", href: settings.facebook, icon: ASSETS.icons.facebook },
    { key: "tiktok", label: "Tiktok", href: settings.tiktok, icon: ASSETS.icons.tiktok },
    { key: "email", label: "Email", href: `mailto:${settings.email}`, icon: ASSETS.icons.email },
  ] as const;
}

/* ─── Section data ─── */


function resolveAssetPath(url: string | undefined, fallback: string) {
  if (!url) return fallback;
  if (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }
  return fallback;
}

function getInitials(name: string) {
  const words = name
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .slice(0, 2);

  if (words.length === 0) return "DR";

  return words
    .map((word) =>
      word
        .replace(/[^a-zA-Z]/g, "")
        .charAt(0)
        .toUpperCase(),
    )
    .join("")
    .slice(0, 2);
}

const DOCTOR_GRADIENTS = [
  "from-neutral-400 to-neutral-600",
  "from-green-400 to-green-800",
  "from-[#4200ff] to-[#280099]",
  "from-[#315b41] to-[#69c18a]",
];
const DOCTOR_AVATAR_BG = [
  "bg-[#84ff74]",
  "bg-[#74c8ff]",
  "bg-[#ff8474]",
  "bg-[#f8ff74]",
];
const HARI_INDO: Record<string, string> = {
  SENIN: "Senin",
  SELASA: "Selasa",
  RABU: "Rabu",
  KAMIS: "Kamis",
  JUMAT: "Jumat",
  SABTU: "Sabtu",
  AKHAD: "Minggu",
};
const HARI_ORDER = [
  "SENIN",
  "SELASA",
  "RABU",
  "KAMIS",
  "JUMAT",
  "SABTU",
  "AKHAD",
];

function mapKhanzaDokterToDoctorItems(
  dokterList: DokterPublik[],
): DoctorItem[] {
  return dokterList.map((d, i) => {
    const uniqueHari = [...new Set(d.jadwal.map((j) => j.hari_kerja))];
    uniqueHari.sort((a, b) => HARI_ORDER.indexOf(a) - HARI_ORDER.indexOf(b));
    const schedule =
      uniqueHari.length > 0
        ? uniqueHari.map((h) => HARI_INDO[h] ?? h).join(", ")
        : "Hubungi klinik";
    const first = d.jadwal[0];
    const time = first ? `${first.jam_mulai} – ${first.jam_selesai}` : "-";

    return {
      id: i + 1,
      name: d.nm_dokter,
      role: d.spesialis || "Dokter",
      schedule,
      time,
      gradient: DOCTOR_GRADIENTS[i % DOCTOR_GRADIENTS.length],
      avatarClassName: DOCTOR_AVATAR_BG[i % DOCTOR_AVATAR_BG.length],
      image: d.foto_url || "",
      initials: getInitials(d.nm_dokter),
      jadwalDetail: d.jadwal.map((j) => ({
        hari: HARI_INDO[j.hari_kerja] ?? j.hari_kerja,
        jamMulai: j.jam_mulai,
        jamSelesai: j.jam_selesai,
        poli: j.nm_poli,
      })),
    };
  });
}

function DoctorProfileModal({
  doctor,
  open,
  onClose,
}: {
  doctor: DoctorItem;
  open: boolean;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const doctorImage =
    doctor.image &&
    (doctor.image.startsWith("/") || doctor.image.startsWith("http"))
      ? doctor.image
      : null;
  const initials = doctor.initials || getInitials(doctor.name);
  const hariCount = doctor.jadwalDetail?.length ?? 0;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
        "bg-slate-950/50 backdrop-blur-md transition-all duration-300 ease-out",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`doctor-modal-title-${doctor.id}`}
        className={cn(
          "relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_40px_120px_-40px_rgba(15,23,42,0.7)]",
          "transform-gpu transition-all duration-300 ease-out",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-[0.97] opacity-0",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full",
            "border border-white/40 bg-white/15 text-white shadow-sm backdrop-blur-md transition-all duration-200",
            "hover:rotate-90 hover:bg-white hover:text-slate-900 lg:text-white",
          )}
          aria-label="Tutup profil dokter"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[92vh] gap-0 lg:grid-cols-[0.85fr_1.15fr]">
          {/* ── Left: photo hero ── */}
          <div className="relative min-h-72 overflow-hidden bg-linear-to-br from-[#082f49] via-[#0f4c81] to-[#00b4d8] lg:min-h-[34rem]">
            {doctorImage ? (
              <Image
                src={doctorImage}
                alt={doctor.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 440px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-7xl font-bold text-white/30">
                  {initials}
                </span>
              </div>
            )}
            {/* readability gradient + accent glow */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/15 to-slate-950/30" />
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#00b4d8]/30 blur-3xl" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-5">
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 backdrop-blur-md">
                Profil Dokter
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-current" />
                Klinik AMC
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="inline-flex items-center rounded-full bg-[#00b4d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#00b4d8]/30">
                {doctor.role}
              </span>
              <h3
                id={`doctor-modal-title-${doctor.id}`}
                className="mt-2.5 text-2xl font-bold leading-tight text-white drop-shadow-sm sm:text-3xl"
              >
                {doctor.name}
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/60">
                    <CalendarDays className="h-3 w-3" />
                    Hari Praktik
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {hariCount > 0 ? `${hariCount} hari / minggu` : doctor.schedule}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-white/60">
                    <Clock3 className="h-3 w-3" />
                    Jam
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {doctor.time}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: details ── */}
          <div className="relative flex max-h-[92vh] flex-col overflow-y-auto bg-[#fbfcfe] p-5 sm:p-7 lg:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#00b4d8] via-[#4200ff] to-[#e8861e]" />

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00b4d8]/10 px-3 py-1 text-xs font-semibold text-[#00b4d8]">
                <Star className="h-3.5 w-3.5" />
                {doctor.role}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Aktif Praktik
              </span>
            </div>

            <h4 className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Jadwal Praktik
            </h4>

            {doctor.jadwalDetail && doctor.jadwalDetail.length > 0 ? (
              <div className="mt-3 space-y-2">
                {doctor.jadwalDetail.map((j, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.4)] transition-colors hover:border-[#00b4d8]/40"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00b4d8]/10 text-[#00b4d8] transition-colors group-hover:bg-[#00b4d8] group-hover:text-white">
                      <CalendarDays className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {j.hari}
                      </p>
                      {j.poli ? (
                        <p className="truncate text-xs text-slate-400">
                          {j.poli}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                      {j.jamMulai} – {j.jamSelesai}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
                Jadwal lengkap belum tersedia. Hubungi klinik untuk konfirmasi
                ketersediaan dokter.
              </div>
            )}

            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-400">
              <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-300" />
              Informasi jadwal berdasarkan data Sistem Informasi Klinik (SIK)
              dan dapat berubah sewaktu-waktu.
            </p>

            <div className="mt-auto flex flex-col gap-2.5 pt-6 sm:flex-row">
              <Button
                asChild
                className={cn(
                  btnPrimary,
                  btnHeight,
                  "flex-1 px-5 text-sm shadow-lg shadow-[#00b4d8]/25",
                )}
              >
                <Link href="/pendaftaran_online_1">Daftar Online</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  btnHeight,
                  "rounded-full border-slate-200 px-5 text-sm text-slate-600 hover:bg-slate-50",
                )}
                onClick={onClose}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverImage({
  src,
  alt,
  aspectClass = "aspect-[16/10]",
  roundedClass,
  priority = false,
}: {
  src: string;
  alt: string;
  aspectClass?: string;
  roundedClass?: string;
  priority?: boolean;
}) {
  if (!src) return <div className={cn("relative overflow-hidden bg-gray-200", aspectClass, roundedClass)} />;
  return (
    <div className={cn("relative overflow-hidden", aspectClass, roundedClass)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

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
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
    />
  );
}

function CardSlider({ children }: { children: React.ReactNode }) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);
  // Hanya dianggap bisa di-scroll bila overflow-nya berarti (bukan sekadar
  // pembulatan sub-pixel beberapa px) — supaya tidak ada "scroll sedikit".
  const [isScrollable, setIsScrollable] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);

  const updateArrows = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const scrollable = maxScroll > 12;
    setIsScrollable(scrollable);
    setCanPrev(scrollable && el.scrollLeft > 4);
    setCanNext(scrollable && el.scrollLeft < maxScroll - 4);
  }, []);

  React.useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    const t = setTimeout(updateArrows, 80);
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.78), behavior: "smooth" });
  };

  return (
    <div>
      <div
        className={cn(
          "mb-3 justify-end gap-2",
          isScrollable ? "flex" : "hidden",
        )}
      >
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={!canPrev}
          aria-label="Sebelumnya"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
            canPrev
              ? "border-[#00b4d8] bg-white text-[#00b4d8] shadow-sm hover:bg-[#00b4d8] hover:text-white"
              : "cursor-not-allowed border-black/10 bg-white/50 text-black/20",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={!canNext}
          aria-label="Selanjutnya"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
            canNext
              ? "border-[#00b4d8] bg-[#00b4d8] text-white shadow-sm hover:bg-[#00a3c5]"
              : "cursor-not-allowed border-black/10 bg-white/50 text-black/20",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={trackRef}
        className={cn(
          // py-2 memberi ruang untuk efek hover -translate-y; overflow-visible saat
          // tidak perlu scroll mencegah scroll vertikal "hantu" (browser memaksa
          // overflow-y jadi auto begitu overflow-x di-set non-visible).
          "slider-track flex gap-(--gap-cards) scroll-smooth py-2",
          isScrollable
            ? "overflow-x-auto overflow-y-hidden"
            : "justify-center overflow-visible",
        )}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) scroll(diff > 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HeroStatCard({ item }: { item: HeroStat }) {
  const Icon = item.icon;

  return (
    <div className="ring-gradient group flex flex-col items-center gap-2 rounded-2xl border border-white/60 bg-white/70 p-4 text-center shadow-[0px_2.87px_17.25px_-0.72px_#00000020] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_36px_-14px_rgba(0,180,216,0.4)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00b4d8]/10 text-[#00b4d8] transition-colors group-hover:bg-[#00b4d8] group-hover:text-white">
        <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
      </div>
      <div className="t-h3 font-bold text-[#3f3f3f]">{item.title}</div>
      <div className="t-caption text-[#00b4d8]">{item.subtitle}</div>
    </div>
  );
}

function ServiceCard({ layanan }: { layanan: LayananItem }) {
  return (
    <Card
      className={cn(
        "overflow-hidden card-radius border-0 bg-[#f7f5f2]",
        cardShadowSoft,
      )}
    >
      <CardContent className="space-y-3 p-3 pb-4">
        <CoverImage
          src={layanan.image}
          alt={layanan.title}
          roundedClass="card-radius-sm"
        />
        <h3 className="t-h4 px-2 font-medium text-black">{layanan.title}</h3>
      </CardContent>
    </Card>
  );
}

function DoctorCard({
  doctor,
  onOpenProfile,
}: {
  doctor: DoctorItem;
  onOpenProfile: (doctor: DoctorItem) => void;
}) {
  return (
    <div
      className={cn(
        "group relative flex h-46 overflow-hidden rounded-2xl bg-white",
        "transition-all duration-300 hover:-translate-y-1",
        "shadow-[0px_3.43px_20.59px_-0.86px_#00000033] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]",
      )}
    >
      {/* Teal accent line — slides in from bottom on hover */}
      <div className="absolute bottom-0 left-0 top-0 z-10 w-0.75 origin-bottom scale-y-0 bg-[#00b4d8] transition-transform duration-300 group-hover:origin-top group-hover:scale-y-100" />

      {/* Photo panel */}
      <div className="relative w-32.5 shrink-0 overflow-hidden">
        {doctor.image ? (
          <>
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
              sizes="130px"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/10" />
          </>
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center text-3xl font-bold text-white",
              `bg-linear-to-br ${doctor.gradient}`,
            )}
          >
            {doctor.initials}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="flex flex-1 flex-col justify-between px-4 py-4">
        {/* Top: specialty + name */}
        <div>
          <span className="inline-flex items-center rounded-full bg-[#00b4d8]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#00b4d8]">
            {doctor.role}
          </span>
          <h3 className="mt-2 text-[14px] font-semibold leading-snug text-[#1a1a1a]">
            {doctor.name}
          </h3>
        </div>

        {/* Middle: schedule */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[12px] text-[#555]">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#00b4d8]" />
            <span>{doctor.schedule}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#555]">
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#00b4d8]" />
            <span>{doctor.time}</span>
          </div>
        </div>

        {/* Bottom: CTA link */}
        <button
          type="button"
          onClick={() => onOpenProfile(doctor)}
          className="flex w-fit items-center gap-1 text-[12px] font-semibold text-[#00b4d8] transition-all duration-200 hover:gap-2"
        >
          Lihat Profil
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* Kartu promo — desain voucher/kupon. */
function PromoCard({ promo }: { promo: PromoItem }) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl bg-white",
        "border-2 border-dashed border-[#e5d0b0]",
        "shadow-[0_2px_16px_-4px_rgba(0,0,0,0.10)]",
        "transition-all duration-300 hover:-translate-y-1",
        "hover:shadow-[0_10px_32px_-8px_rgba(232,134,30,0.25)]",
        "hover:border-[#e8861e]/60",
      )}
    >
      {/* Image — rounded top only, overflow-hidden agar foto tidak meluber */}
      <div className="relative h-38 overflow-hidden rounded-t-[14px]">
        <Image
          src={promo.image}
          alt={promo.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="360px"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-[#e8861e] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow">
          PROMO
        </span>
      </div>

      {/* Tear line + punch holes */}
      <div className="relative">
        <div className="mx-3 border-t-2 border-dashed border-[#e5d0b0]" />
        {/* Punch holes — warna sama dengan background section (#fdf8f2) */}
        <div className="absolute -left-3.25 top-1/2 h-6.5 w-6.5 -translate-y-1/2 rounded-full bg-[#fdf8f2]" />
        <div className="absolute -right-3.25 top-1/2 h-6.5 w-6.5 -translate-y-1/2 rounded-full bg-[#fdf8f2]" />
      </div>

      {/* Info — tinggi tetap konsisten dengan line-clamp */}
      <div className="px-4 pb-4 pt-3">
        <h3 className="text-[14px] font-bold leading-snug text-[#1a1a1a]">
          {promo.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#999]">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#e8861e]" />
          <span>{promo.date}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[#666]">
          {promo.description}
        </p>
      </div>
    </div>
  );
}

/* Section promo. */
function PromoSection({
  homeData,
  loading,
}: {
  homeData?: HomeData | null;
  loading?: boolean;
}) {
  const promoList = React.useMemo(
    () =>
      homeData?.promo?.length
        ? homeData.promo
            .filter((promo) => promo.url)
            .map((promo, index) => ({
              title: `Promo ${index + 1}`,
              image: resolveAssetPath(promo.url, ""),
              date: "Promo aktif",
              description: "",
            }))
        : [],
    [homeData],
  );

  if (!loading && promoList.length === 0) return null;

  return (
    <Section id="promo" bg="bg-[#fdf8f2]" innerClassName="pt-8">
      <SectionHeader label="PROMO" title="Penawaran khusus untuk Anda" />

      {/* py-3 -my-3: memberi ruang vertikal untuk shadow & hover lift tanpa menambah whitespace */}
      <div className="-my-3 overflow-hidden py-3">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[80vw] shrink-0 animate-pulse rounded-2xl bg-[#e8e0d4] sm:w-[46vw] lg:w-[28vw]"
                style={{ maxWidth: 360, height: 260 }}
              />
            ))}
          </div>
        ) : (
          <CardSlider>
            {promoList.map((promo, idx) => (
              <div
                key={`promo-${idx}`}
                className="w-[80vw] shrink-0 sm:w-[46vw] lg:w-[28vw]"
                style={{ maxWidth: 360 }}
              >
                <Reveal direction="up" delay={Math.min(idx, 4) * 80} className="h-full">
                  <PromoCard promo={promo} />
                </Reveal>
              </div>
            ))}
          </CardSlider>
        )}
      </div>
    </Section>
  );
}

/* ── Bento artikel: 3 varian kartu berbeda bentuk ── */

/* Kartu besar kiri — foto + deskripsi lengkap */
function ArticleFeaturedCard({ article }: { article: ArticleItem }) {
  return (
    <div
      className={cn(
        "group flex h-full min-h-85 flex-col overflow-hidden rounded-2xl bg-white lg:min-h-[420px]",
        "shadow-[0_4px_24px_-6px_rgba(0,0,0,0.12)] transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_14px_40px_-8px_rgba(0,0,0,0.18)]",
      )}
    >
      {/* Foto — ~55% tinggi */}
      <div className="relative h-[200px] shrink-0 overflow-hidden lg:h-[240px]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-[#00b4d8] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow">
          Tips Kesehatan
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-[#aaa]">
            <Clock3 className="h-3 w-3" />
            <span>5 menit baca</span>
          </div>
          <h3 className="mt-2 text-[17px] font-bold leading-snug text-[#1a1a1a]">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#666]">
            {article.description}
          </p>
        </div>
        {article.slug ? (
          <Link
            href={`/artikel/${article.slug}`}
            className="mt-3 flex w-fit items-center gap-1 text-[13px] font-semibold text-[#00b4d8] transition-all duration-200 hover:gap-2"
          >
            Baca selengkapnya <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="mt-3 flex w-fit items-center gap-1 text-[13px] font-semibold text-[#00b4d8]">
            Baca selengkapnya <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}

/* Kartu horizontal kanan atas — foto kiri, teks kanan */
function ArticleCompactCard({ article }: { article: ArticleItem }) {
  return (
    <div
      className={cn(
        "group relative flex h-[180px] overflow-hidden rounded-2xl bg-white",
        "shadow-[0_2px_16px_-4px_rgba(0,0,0,0.10)] transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.16)]",
      )}
    >
      {/* Accent line hover */}
      <div className="absolute bottom-0 left-0 top-0 z-10 w-0.75 origin-bottom scale-y-0 bg-[#00b4d8] transition-transform duration-300 group-hover:origin-top group-hover:scale-y-100" />

      {/* Foto */}
      <div className="relative w-[150px] shrink-0 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          sizes="150px"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00b4d8]">
            Edukasi
          </span>
          <h3 className="mt-1.5 line-clamp-3 text-[14px] font-semibold leading-snug text-[#1a1a1a]">
            {article.title}
          </h3>
        </div>
        {article.slug ? (
          <Link
            href={`/artikel/${article.slug}`}
            className="flex w-fit items-center gap-1 text-[12px] font-semibold text-[#00b4d8] transition-all duration-200 hover:gap-2"
          >
            Baca <ChevronRight className="h-3 w-3" />
          </Link>
        ) : (
          <span className="flex w-fit items-center gap-1 text-[12px] font-semibold text-[#00b4d8]">
            Baca <ChevronRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );
}

/* Kartu dark navy kanan bawah — tanpa foto, warna solid */
function ArticleTextCard({ article }: { article: ArticleItem }) {
  return (
    <div
      className={cn(
        "group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl",
        "bg-linear-to-br from-[#071e38] to-[#0c3a68] p-5",
        "shadow-[0_2px_16px_-4px_rgba(0,0,0,0.22)] transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-6px_rgba(0,100,200,0.28)]",
        "min-h-[160px]",
      )}
    >
      {/* Dekorasi lingkaran abstrak */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#00b4d8]/10" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-[#e8861e]/8" />

      <div className="relative">
        <span className="inline-flex rounded-full bg-white/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white/60">
          Berita Klinik
        </span>
        <h3 className="mt-3 text-[15px] font-bold leading-snug text-white">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-white/55">
          {article.description}
        </p>
      </div>

      {article.slug ? (
        <Link
          href={`/artikel/${article.slug}`}
          className="relative mt-4 flex w-fit items-center gap-1 text-[12px] font-semibold text-[#00b4d8] transition-all duration-200 hover:gap-2"
        >
          Baca selengkapnya <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      ) : (
        <span className="relative mt-4 flex w-fit items-center gap-1 text-[12px] font-semibold text-[#00b4d8]">
          Baca selengkapnya <ChevronRight className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}

/* Section artikel — bento grid. */
function ArtikelSection() {
  const [artikelList, setArtikelList] = React.useState<Artikel[]>([]);
  const [artikelLoading, setArtikelLoading] = React.useState(true);

  React.useEffect(() => {
    getArtikel(3).then((list) => {
      setArtikelList(list);
      setArtikelLoading(false);
    });
  }, []);

  const toItem = (a: Artikel): ArticleItem => ({
    title: a.judul,
    image: a.foto_url || "/assets/articles/article-featured.png",
    description: a.ringkasan || "",
    slug: a.slug,
  });

  if (!artikelLoading && artikelList.length === 0) return null;

  return (
    <Section id="artikel" innerClassName="pt-8">
      <SectionHeader
        label="ARTIKEL"
        title={
          <>
            <span>Info kesehatan </span>
            <span className="italic text-[#00b4d8]">terkini</span>
          </>
        }
        subtitle="Tips dan edukasi kesehatan dari tim medis kami"
      />

      {artikelLoading ? (
        /* Skeleton bento */
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <div className="lg:w-[55%] lg:shrink-0">
            <div
              className="animate-pulse rounded-2xl bg-slate-200 lg:min-h-[420px]"
              style={{ minHeight: 340 }}
            />
          </div>
          <div className="flex flex-col gap-4 lg:flex-1">
            <div
              className="animate-pulse rounded-2xl bg-slate-200"
              style={{ height: 180 }}
            />
            <div
              className="animate-pulse flex-1 rounded-2xl bg-slate-200"
              style={{ minHeight: 160 }}
            />
          </div>
        </div>
      ) : (
        /* Bento: featured kiri, 2 kartu kanan */
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {/* Kiri — featured besar */}
          <Reveal
            direction="up"
            className={
              artikelList.length === 1 ? "w-full" : "lg:w-[55%] lg:shrink-0"
            }
          >
            <ArticleFeaturedCard article={toItem(artikelList[0])} />
          </Reveal>

          {/* Kanan — compact + dark card (hanya jika ada artikel ke-2 atau ke-3) */}
          {artikelList.length >= 2 && (
            <div className="flex flex-col gap-4 lg:flex-1">
              <Reveal direction="left" delay={120}>
                <ArticleCompactCard article={toItem(artikelList[1])} />
              </Reveal>
              {artikelList.length >= 3 && (
                <Reveal direction="left" delay={220} className="flex flex-1">
                  <ArticleTextCard article={toItem(artikelList[2])} />
                </Reveal>
              )}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

/* Section hubungi kami. */
function HubungiKamiSection({ homeData }: { homeData?: HomeData | null }) {
  const data = homeData;
  const settings = useSiteSettings();
  const CLINIC_PHONE = settings.telepon;
  const WHATSAPP_URL = `https://wa.me/${settings.whatsapp}`;
  const operationalHoursData = React.useMemo(
    () => formatOperationalHours(data?.operational_hours ?? []),
    [data?.operational_hours],
  );
  const [copied, setCopied] = React.useState(false);
  const handleCopyAddress = React.useCallback(async () => {
    if (!navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(CLINIC_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, []);

  return (
    <Section id="hubungi" innerClassName="pt-8">
      <SectionHeader
        label="HUBUNGI KAMI"
        title={
          <>
            <span>Ada yang bisa kami </span>
            <span className="italic text-[#00b4d8]">bantu?</span>
          </>
        }
        subtitle="Kami siap melayani Anda 24 jam setiap hari"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {/* ── Kolom kiri: peta + satu panel kontak ── */}
        <Reveal direction="right" className="flex flex-col gap-4">
          {/* Peta */}
          <div className="overflow-hidden rounded-2xl shadow-[0_2px_16px_-4px_rgba(0,0,0,0.12)]">
            <iframe
              title="Google Maps KRI Ampelgading Medical Centre"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.6548893398885!2d112.87117427568808!3d-8.237415082715378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6119ef38ca617%3A0x24c74a32e7d6bfb!2sKRI%20Ampelgading%20Medical%20Centre!5e0!3m2!1sid!2sid!4v1780219273500!5m2!1sid!2sid"
              className="h-[220px] w-full border-0 sm:h-[260px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Panel kontak terpadu — alamat + telepon + WA + sosial dalam 1 kartu */}
          <div className={cn("rounded-2xl bg-white p-5", cardShadowMd)}>
            {/* Alamat */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00b4d8]" />
                <p className="text-[13px] leading-relaxed text-[#444]">
                  {CLINIC_ADDRESS}
                </p>
              </div>
              <button
                type="button"
                aria-label="Salin alamat"
                onClick={handleCopyAddress}
                className="shrink-0 rounded-full bg-[#f1f1f1] p-2 transition-colors hover:bg-[#e4f6fb]"
              >
                <Copy className="h-3.5 w-3.5 text-[#555]" />
              </button>
            </div>
            {copied && (
              <p className="mt-1 pl-7 text-[11px] font-medium text-[#00b4d8]">
                Alamat disalin ✓
              </p>
            )}

            <Separator className="my-4 bg-[#f0f0f0]" />

            {/* Telepon & WhatsApp */}
            <div className="space-y-3">
              <a
                href={`tel:${normalizePhoneNumber(CLINIC_PHONE)}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f8f8] px-4 py-3 transition-colors hover:bg-[#f0f0f0]"
              >
                <div className="flex items-center gap-3">
                  <AssetIcon src={ASSETS.icons.phone} alt="Telepon" size={16} />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#999]">
                      Telepon
                    </p>
                    <p className="text-[13px] font-bold text-[#1a1a1a]">
                      {CLINIC_PHONE}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#bbb]" />
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl bg-[#f0fdf4] px-4 py-3 transition-colors hover:bg-[#dcfce7]"
              >
                <div className="flex items-center gap-3">
                  <AssetIcon
                    src={ASSETS.icons.whatsapp}
                    alt="WhatsApp"
                    size={16}
                  />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#16a34a]">
                      WhatsApp
                    </p>
                    <p className="text-[13px] font-bold text-[#1a1a1a]">
                      Chat langsung dengan kami
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#86efac]" />
              </a>
            </div>

            <Separator className="my-4 bg-[#f0f0f0]" />

            {/* Ikon sosial kecil */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#bbb]">
                Ikuti kami
              </span>
              <div className="flex gap-1.5 ml-1">
                {socialLinkItems(settings).map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    onClick={() => trackSocialClick(item.key)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f4f4] transition-all hover:bg-[#e4f6fb] hover:scale-110"
                  >
                    <AssetIcon src={item.icon} alt={item.label} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Kolom kanan: form + jam operasional ── */}
        <Reveal direction="left" delay={120} className="flex flex-col gap-4">
          {/* Form pesan — disederhanakan */}
          <div className="rounded-2xl bg-[#f8f9fb] p-5 shadow-[inset_0px_2px_8px_rgba(0,0,0,0.06)]">
            <h3 className="mb-4 text-[15px] font-bold text-[#1a1a1a]">
              Kirim Pesan
            </h3>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Nama lengkap"
                  className="h-11 rounded-full border-[#e0e0e0] bg-white px-5 text-[13px] placeholder:text-[#bbb]"
                />
                <Input
                  placeholder="Nomor WhatsApp"
                  className="h-11 rounded-full border-[#e0e0e0] bg-white px-5 text-[13px] placeholder:text-[#bbb]"
                />
              </div>
              <Textarea
                placeholder="Tulis pesan atau pertanyaan Anda..."
                className="min-h-[110px] rounded-2xl border-[#e0e0e0] bg-white px-5 py-3 text-[13px] placeholder:text-[#bbb]"
              />
              <Button
                type="submit"
                className={cn(
                  btnPrimary,
                  "h-11 w-full text-[13px] font-semibold",
                )}
              >
                <Send className="mr-2 h-4 w-4" />
                Kirim Pesan
              </Button>
            </form>
          </div>

          {/* Jam operasional */}
          <div className={cn("rounded-2xl bg-white p-5", cardShadowMd)}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f7fb]">
                <Clock3 className="h-4.5 w-4.5 text-[#00b4d8]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a]">
                Jam Operasional
              </h3>
            </div>
            {operationalHoursData.length > 0 ? (
              <div>
                {operationalHoursData.map((item, index) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-4 py-2.5">
                      <span className="text-[13px] text-[#555]">
                        {item.label}
                      </span>
                      {item.badge ? (
                        <span className="rounded-full bg-[#e8f7fb] px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#00b4d8]">
                          {item.value}
                        </span>
                      ) : (
                        <span className="text-[13px] font-semibold text-[#1a1a1a]">
                          {item.value}
                        </span>
                      )}
                    </div>
                    {index < operationalHoursData.length - 1 && (
                      <Separator className="bg-[#f4f4f4]" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[#999]">
                Data jam operasional belum tersedia.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ─── Emergency CTA ─── */

/* Section layanan utama klinik. */
function LayananSection({
  homeData,
  loading,
}: {
  homeData?: HomeData | null;
  loading?: boolean;
}) {
  const layananList = React.useMemo(
    () =>
      homeData?.layanan?.length
        ? homeData.layanan.map((item, index) => ({
            title: item.nama_layanan || `Layanan ${index + 1}`,
            image: resolveAssetPath(item.url, ""),
          }))
        : [],
    [homeData],
  );

  if (!loading && layananList.length === 0) return null;

  return (
    <Section
      id="layanan"
      className="scroll-mt-[96px]"
      bg="bg-[#d9d9d9]"
      innerClassName="pt-4 pb-8"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          label="LAYANAN KAMI"
          title="Layanan Kami"
          subtitle="Kami berkomitmen memberikan layanan dan fasilitas kesehatan dengan sepenuh hati"
          className="mb-0"
        />
      </div>
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[82vw] shrink-0 animate-pulse rounded-2xl bg-[#c8c8c8] sm:w-[48vw] md:w-[38vw] lg:w-[27vw]"
              style={{ maxWidth: 340, height: 200 }}
            />
          ))}
        </div>
      ) : (
        <CardSlider>
          {layananList.map((layanan, i) => (
            <div
              key={`layanan-${i}`}
              className="w-[82vw] shrink-0 sm:w-[48vw] md:w-[38vw] lg:w-[27vw]"
              style={{ maxWidth: 340 }}
            >
              <Reveal direction="up" delay={Math.min(i, 4) * 80} className="h-full">
                <ServiceCard layanan={layanan} />
              </Reveal>
            </div>
          ))}
        </CardSlider>
      )}
    </Section>
  );
}

/* Banner WhatsApp. */
function WhatsappBanner() {
  const settings = useSiteSettings();
  const CLINIC_PHONE = settings.telepon;
  const WHATSAPP_URL = `https://wa.me/${settings.whatsapp}`;
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#00b4d8] via-[#1a9ec9] to-[#0f9bc0]">
      {/* Dekorasi */}
      <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-30" />
      <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -right-8 bottom-0 h-48 w-48 rounded-full bg-[#e8861e]/15 blur-3xl" />

      <div className="relative section-container py-8 md:py-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
        <Reveal direction="right">
          <p className="t-h3 max-w-[1003px] text-center font-medium leading-snug text-white lg:text-left">
            Kini kami hadir lebih dekat dengan anda melalui{" "}
            <span className="font-bold">Whatsapp</span>
          </p>
        </Reveal>
        <Reveal direction="left" delay={120}>
          <Button
            className={cn(
              "btn-shine rounded-full bg-white px-6 t-h4 font-bold text-[#00b4d8] shadow-xl shadow-[#0f4c81]/20 transition-transform hover:-translate-y-0.5 hover:bg-white/95",
              btnHeight,
            )}
            asChild
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <AssetIcon
                src={ASSETS.icons.whatsapp}
                alt=""
                size={24}
                className="mr-2"
              />
              {CLINIC_PHONE}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* Section profil dokter. */
function DokterSection() {
  const closeTimerRef = React.useRef<number | null>(null);
  const [khanzaDokter, setKhanzaDokter] = React.useState<DoctorItem[]>([]);
  const [dokterLoading, setDokterLoading] = React.useState(true);

  React.useEffect(() => {
    getDokterPublik().then((list) => {
      if (list.length > 0) {
        setKhanzaDokter(mapKhanzaDokterToDoctorItems(list));
      }
      setDokterLoading(false);
    });
  }, []);

  const [selectedDoctor, setSelectedDoctor] = React.useState<DoctorItem | null>(
    null,
  );
  const [isDoctorModalOpen, setIsDoctorModalOpen] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (isDoctorModalOpen || !selectedDoctor) return;

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setSelectedDoctor(null);
      closeTimerRef.current = null;
    }, 240);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [isDoctorModalOpen, selectedDoctor]);

  const openDoctorModal = (doctor: DoctorItem) => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const closeDoctorModal = () => {
    setIsDoctorModalOpen(false);
  };

  if (!dokterLoading && khanzaDokter.length === 0) return null;

  return (
    <Section
      id="dokter"
      className="scroll-mt-[96px]"
      innerClassName="pt-4 pb-8"
    >
      <SectionHeader label="DOKTER KAMI" title="Dokter Kami" />

      {dokterLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[88vw] shrink-0 animate-pulse rounded-2xl bg-slate-200 sm:w-[54vw] lg:w-[calc((100%_-_2*var(--gap-cards))/3)]"
              style={{ height: 184 }}
            />
          ))}
        </div>
      ) : (
        <CardSlider>
          {khanzaDokter.map((doctor, i) => (
            <div
              key={doctor.id}
              className="w-[88vw] shrink-0 sm:w-[54vw] lg:w-[calc((100%_-_2*var(--gap-cards))/3)]"
            >
              <Reveal direction="up" delay={Math.min(i, 4) * 80} className="h-full">
                <DoctorCard doctor={doctor} onOpenProfile={openDoctorModal} />
              </Reveal>
            </div>
          ))}
        </CardSlider>
      )}

      {selectedDoctor ? (
        <DoctorProfileModal
          doctor={selectedDoctor}
          open={isDoctorModalOpen}
          onClose={closeDoctorModal}
        />
      ) : null}
    </Section>
  );
}

/* Hero utama. */
function HeroSection({ homeData }: { homeData?: HomeData | null }) {
  const settings = useSiteSettings();
  const WHATSAPP_URL = `https://wa.me/${settings.whatsapp}`;
  // Sumber gambar hero: setting "hero_image" (diatur di admin Pengaturan),
  // fallback ke tabel banner, lalu ke aset bawaan.
  const heroImage = resolveAssetPath(
    settings.hero_image || homeData?.banner?.[0]?.url,
    ASSETS.hero,
  );
  const klinikInfo = homeData?.klinik_info ?? null;
  const legacyReview = homeData?.google_reviews?.[0] ?? null;
  const reviewRating =
    klinikInfo?.rating_google ?? Number(legacyReview?.average_rating ?? 0);
  const reviewRatingLabel =
    reviewRating > 0 ? `${reviewRating.toFixed(1)}/5` : "—/5";
  const totalUlasan =
    klinikInfo?.total_ulasan ?? Number(legacyReview?.review_count ?? 0);
  const heroStats: HeroStat[] = React.useMemo(
    () => [
      {
        icon: Clock3,
        title: "24 jam",
        subtitle: "Buka setiap hari",
      },
      {
        icon: Star,
        title: "BPJS",
        subtitle: "Menerima pasien BPJS",
      },
      {
        icon: Star,
        title: reviewRatingLabel,
        subtitle:
          totalUlasan > 0 ? `${totalUlasan} ulasan Google` : "Review Google",
      },
    ],
    [reviewRatingLabel, totalUlasan],
  );

  return (
    <section
      id="beranda"
      className="relative scroll-mt-[96px] overflow-hidden bg-grid-soft"
    >
      {/* ── Aurora background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-[#00b4d8]/40"
          style={{ top: "-8%", left: "-6%", width: "44vw", height: "44vw", ["--orb-dur" as string]: "16s" }}
        />
        <div
          className="aurora-blob bg-[#e8861e]/25"
          style={{ bottom: "-12%", right: "-4%", width: "38vw", height: "38vw", ["--orb-dur" as string]: "20s", ["--orb-delay" as string]: "2s" }}
        />
        <div
          className="aurora-blob bg-[#1a5fa0]/20"
          style={{ top: "30%", right: "24%", width: "26vw", height: "26vw", ["--orb-dur" as string]: "18s", ["--orb-delay" as string]: "1s" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f5f2]/10 via-[#f7f5f2]/40 to-[#f7f5f2]" />
      </div>

      <div className="section-container pb-10 pt-6 lg:pt-10">
        <div className="grid gap-10 lg:grid-cols-[50%_50%] lg:items-center lg:gap-12">
          {/* ── Kolom teks ── */}
          <div className="order-2 lg:order-1">
            <Reveal direction="up" delay={0}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00b4d8]/25 bg-white/70 px-4 py-1.5 text-[12px] font-semibold text-[#0f4c81] shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" style={{ animation: "soft-pulse 1.8s ease-out infinite" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                UGD 24 Jam · Menerima BPJS &amp; Umum
              </span>
            </Reveal>

            <h1 className="mt-5 max-w-[980px] t-h1 font-bold tracking-tight leading-[1.14]">
              <WordReveal
                as="span"
                text="Klinik Rawat Inap"
                className="block text-[#3f3f3f]"
                delay={120}
                step={70}
              />
              <span className="block">
                <WordReveal
                  as="span"
                  text="Ampelgading"
                  wordClassName="text-gradient-brand"
                  delay={340}
                  step={70}
                />{" "}
                <WordReveal
                  as="span"
                  text="Medical Centre"
                  className="text-[#3f3f3f]"
                  delay={440}
                  step={70}
                />
              </span>
            </h1>

            <Reveal direction="up" delay={160}>
              <p className="mt-6 max-w-[640px] t-body-lg text-[#52606a]">
                {settings.hero_subtitle}
              </p>
            </Reveal>

            <Reveal direction="up" delay={240}>
              <div className="mt-8 flex flex-wrap gap-3 lg:gap-4">
                <Magnetic strength={0.4}>
                  <Button
                    className={cn(btnPrimary, btnHeight, "btn-shine px-6 t-body-sm shadow-lg shadow-[#00b4d8]/25")}
                    asChild
                  >
                    <Link href="/pendaftaran_online_1">
                      <>
                        <AssetIcon
                          src={ASSETS.icons.whatsapp}
                          alt=""
                          size={16}
                          className="mr-2"
                        />
                        DAFTAR ONLINE
                      </>
                    </Link>
                  </Button>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <Button
                    variant="secondary"
                    className={cn(
                      btnSoft,
                      btnHeight,
                      "px-6 t-body-sm text-[#5f6f7a]",
                    )}
                    asChild
                  >
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      <AssetIcon
                        src={ASSETS.icons.whatsapp}
                        alt=""
                        size={16}
                        className="mr-2"
                      />
                      WHATSAPP
                    </a>
                  </Button>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal direction="up" delay={320}>
              <div
                className="mt-9 grid max-w-[640px] grid-cols-3"
                style={{ gap: "var(--gap-cards)" }}
              >
                {heroStats.map((item) => (
                  <HeroStatCard key={item.title} item={item} />
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── Kolom gambar (parallax + tilt + badge mengambang) ── */}
          <div className="order-1 w-full lg:order-2 lg:justify-self-end">
            <Reveal direction="left" delay={120} distance={40}>
              <Parallax speed={0.08} className="relative">
                {/* glow ring */}
                <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[34px] bg-gradient-to-tr from-[#00b4d8]/30 via-transparent to-[#e8861e]/25 blur-2xl" />
                <Tilt max={6}>
                  <div className="card-radius bg-gradient-to-br from-[#00b4d8] to-[#1a9ec9] p-2 shadow-[0_30px_80px_-30px_rgba(15,76,129,0.55)]">
                    <ClipReveal duration={1100} className="relative h-[42vh] min-h-[280px] w-full overflow-hidden card-radius-sm md:h-[52vh] lg:h-auto lg:max-w-[760px] lg:aspect-[1.73]">
                      <Image
                        src={heroImage}
                        alt="Klinik Ampelgading Medical Centre"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 820px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071e38]/25 via-transparent to-transparent" />
                    </ClipReveal>
                  </div>
                </Tilt>

                {/* Badge mengambang — rating */}
                <div className="absolute -left-3 bottom-6 hidden rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8861e]/15 text-[#e8861e]">
                      <Star className="h-5 w-5 fill-[#e8861e]" />
                    </div>
                    <div>
                      <div className="text-lg font-bold leading-none text-[#1a1a1a]">
                        {reviewRatingLabel}
                      </div>
                      <div className="mt-1 text-[11px] text-[#6b7280]">
                        {totalUlasan > 0 ? `${totalUlasan} ulasan Google` : "Rating Google"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge mengambang — 24 jam */}
                <div className="absolute -right-2 top-5 hidden rounded-2xl border border-white/60 bg-[#0f4c81] px-4 py-3 text-white shadow-xl sm:block">
                  <div className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 text-[#5fd0e8]" />
                    <div>
                      <div className="text-sm font-bold leading-none">24 Jam</div>
                      <div className="mt-1 text-[11px] text-white/70">Buka setiap hari</div>
                    </div>
                  </div>
                </div>
              </Parallax>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Marquee band — strip kata kunci klinik ala Awwwards. */
const MARQUEE_WORDS = [
  "UGD 24 JAM",
  "RAWAT INAP",
  "PERSALINAN",
  "LABORATORIUM",
  "APOTEK",
  "MENERIMA BPJS",
  "HOMEVISIT",
];

function MarqueeBand() {
  return (
    <section className="overflow-hidden border-y border-white/10 bg-gradient-to-r from-[#0f4c81] via-[#1a5fa0] to-[#0f4c81] py-4">
      <Marquee duration={26} itemClassName="gap-0">
        {MARQUEE_WORDS.map((word) => (
          <span key={word} className="flex items-center">
            <span className="px-6 t-h4 font-bold uppercase tracking-[0.12em] text-white/90">
              {word}
            </span>
            <Star className="h-4 w-4 shrink-0 fill-[#5fd0e8] text-[#5fd0e8]" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}

/* Komponen utama. */
export default function LamanUtama() {
  const { data, loading } = useHomeData();

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#3f3f3f]">
      <ScrollProgress />
      <Navbar />
      <HeroSection homeData={data} />
      <MarqueeBand />
      <LayananSection homeData={data} loading={loading} />
      <WhatsappBanner />
      <DokterSection />
      <PromoSection homeData={data} loading={loading} />
      <ArtikelSection />
      <HubungiKamiSection homeData={data} />
      <PageFooter />
    </main>
  );
}
