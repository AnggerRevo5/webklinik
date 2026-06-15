"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  MapPin,
  Send,
  Siren,
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
  useHomeData,
  getDokterPublik,
  getArtikel,
} from "@/src/lib/api";
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
import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";

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

type SocialItem = {
  label: string;
  href: string;
  icon: string;
};

/* ─── Site constants ─── */

const CLINIC_PHONE = "0812-2556-6055";
const WHATSAPP_URL = "https://wa.me/6281225566055";

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
const btnAccent = "rounded-full bg-[#e8861e] text-white hover:bg-[#d77a18]";
const btnSoft = "rounded-full bg-[#00b4d826] text-black hover:bg-[#00b4d833]";

/* Re-usable button height token (48px desktop, 44px mobile) */
const btnHeight = "h-11 lg:h-12";

const CLINIC_ADDRESS =
  "Dsn. Krajan RT.013 RW.005, Desa Tirtomarto, Kec. Ampelgading, Kab. Malang, Jawa Timur 65183";

const SOCIAL_LINK_ITEMS = [
  { label: "Instagram", href: "#", icon: ASSETS.icons.instagram },
  { label: "Facebook", href: "#", icon: ASSETS.icons.facebook },
  { label: "Tiktok", href: "#", icon: ASSETS.icons.tiktok },
  {
    label: "Email",
    href: "mailto:info@ampelgadingmedical.com",
    icon: ASSETS.icons.email,
  },
] as const;

/* ─── Section data ─── */

const articleTabs = [
  "Semua",
  "Tips kesehatan",
  "Edukasi",
  "Berita klinik",
  "Ibu & anak",
];

const socialCards: SocialItem[] = [
  { label: "Instagram", href: "#", icon: ASSETS.icons.instagram },
  { label: "Facebook", href: "#", icon: ASSETS.icons.facebook },
  { label: "Tiktok", href: "#", icon: ASSETS.icons.tiktok },
  {
    label: "Email",
    href: "mailto:info@ampelgadingmedical.com",
    icon: ASSETS.icons.email,
  },
];

const socialIconMap: Record<string, string> = {
  instagram: ASSETS.icons.instagram,
  facebook: ASSETS.icons.facebook,
  tiktok: ASSETS.icons.tiktok,
  email: ASSETS.icons.email,
  whatsapp: ASSETS.icons.whatsapp,
};

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

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
        "bg-slate-950/45 backdrop-blur-md transition-all duration-300 ease-out",
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
          "relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_30px_90px_-36px_rgba(15,23,42,0.6)]",
          "transform-gpu transition-all duration-300 ease-out",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-[0.98] opacity-0",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#00b4d8] via-[#4200ff] to-[#e8861e]" />
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#00b4d8]/10 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-[#4200ff]/10 blur-3xl" />

        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full",
            "border border-slate-200 bg-white/90 text-slate-500 shadow-sm transition-all duration-200",
            "hover:-translate-y-0.5 hover:bg-white hover:text-slate-900",
          )}
          aria-label="Tutup profil dokter"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[280px] overflow-hidden bg-gradient-to-br from-[#082f49] via-[#0f4c81] to-[#00b4d8] p-5 sm:p-7 lg:min-h-[520px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_28%)]" />
            <div className="relative flex h-full flex-col justify-between gap-6 text-white">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90">
                  Profil Dokter
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
                  <Star className="h-3.5 w-3.5" />
                  Klinik AMC
                </span>
              </div>

              <div className="mx-auto flex w-full max-w-[300px] flex-1 items-center justify-center py-2 sm:max-w-[340px]">
                <div className="relative w-full overflow-hidden rounded-[30px] border border-white/20 bg-white/10 p-3 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)] backdrop-blur-sm">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-white/15">
                    {doctorImage ? (
                      <>
                        <Image
                          src={doctorImage}
                          alt={doctor.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 380px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-6xl font-bold text-white/60">
                          {initials}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                        {doctor.role}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-white/95">
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur-sm">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/65">
                        Inisial
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        {initials}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur-sm">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/65">
                        Jadwal
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        {doctor.schedule}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur-sm">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/65">
                        Jam
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        {doctor.time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="max-w-md text-sm leading-6 text-white/80">
                Informasi jadwal berdasarkan data dari sistem informasi klinik
                (SIK). Hubungi kami untuk konfirmasi ketersediaan dokter.
              </p>
            </div>
          </div>

          <div className="relative bg-[#fbfcfe] p-5 sm:p-7 lg:p-8">
            <div className="mb-5 max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00b4d8]">
                Detail Dokter
              </p>
              <h3
                id={`doctor-modal-title-${doctor.id}`}
                className="mt-2 text-2xl font-semibold leading-tight text-slate-900 sm:text-[2rem]"
              >
                {doctor.name}
              </h3>
              {doctor.jadwalDetail && doctor.jadwalDetail.length > 0 ? (
                <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Jadwal Lengkap
                  </p>
                  <div className="space-y-1.5">
                    {doctor.jadwalDetail.map((j, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="font-medium text-slate-700">
                          {j.hari}
                        </span>
                        <span className="text-slate-500">
                          {j.jamMulai} – {j.jamSelesai}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Hubungi klinik untuk informasi jadwal lengkap.
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00b4d8]/10 text-[#00b4d8]">
                    <Star className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Spesialisasi
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {doctor.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4200ff]/10 text-[#4200ff]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Jadwal Praktik
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {doctor.schedule}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)] sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8861e]/10 text-[#e8861e]">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Ketersediaan
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {doctor.time}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Aktif
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className={cn(btnPrimary, btnHeight, "px-5 text-sm")}
                onClick={onClose}
              >
                Tutup
              </Button>
              <div className="text-sm text-slate-500">
                Klik area gelap di luar kartu untuk menutup popup.
              </div>
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
  const touchStartX = React.useRef<number | null>(null);

  const updateArrows = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
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
      <div className="mb-3 flex justify-end gap-2">
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
        className="slider-track flex gap-[var(--gap-cards)] overflow-x-auto scroll-smooth pb-2"
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
    <Card className={cn("card-radius border-0 bg-white", cardShadowSoft)}>
      <CardContent className="card-base flex flex-col items-center gap-2 text-center">
        <Icon className="h-8 w-8 text-[#00b4d8] lg:h-10 lg:w-10" />
        <div className="t-h3 font-bold text-[#3f3f3f]">{item.title}</div>
        <div className="t-caption text-[#00b4d8]">{item.subtitle}</div>
      </CardContent>
    </Card>
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
        "group relative flex h-[184px] overflow-hidden rounded-2xl bg-white",
        "transition-all duration-300 hover:-translate-y-1",
        "shadow-[0px_3.43px_20.59px_-0.86px_#00000033] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]",
      )}
    >
      {/* Teal accent line — slides in from bottom on hover */}
      <div className="absolute bottom-0 left-0 top-0 z-10 w-[3px] origin-bottom scale-y-0 bg-[#00b4d8] transition-transform duration-300 group-hover:origin-top group-hover:scale-y-100" />

      {/* Photo panel */}
      <div className="relative w-[130px] shrink-0 overflow-hidden">
        {doctor.image ? (
          <>
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
              sizes="130px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          </>
        ) : (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center text-3xl font-bold text-white",
              `bg-gradient-to-br ${doctor.gradient}`,
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

function SocialLinkCard({ item }: { item: SocialItem }) {
  return (
    <Card className={cn("card-radius border-0 bg-white", cardShadowMd)}>
      <CardContent className="card-base flex flex-col items-center justify-center gap-3">
        <a
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="transition-transform hover:scale-105"
          aria-label={item.label}
        >
          <AssetIcon src={item.icon} alt={item.label} size={40} />
        </a>
        <div className="t-body text-center font-bold text-[#3f3f3f]">
          {item.label}
        </div>
      </CardContent>
    </Card>
  );
}

function ContactCard({
  title,
  value,
  description,
  icon,
  action,
}: {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon: React.ReactNode;
  action: React.ReactNode;
}) {
  return (
    <Card className={cn("card-radius border-0 bg-white", cardShadowMd)}>
      <CardContent className="card-base flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-[60px] w-12 items-center justify-center card-radius-sm bg-[#d9d9d9] md:w-[60px]">
            {icon}
          </div>
          <div>
            <div className="t-body-sm text-[#3f3f3f]">{title}</div>
            <div className="t-body mt-1 font-bold text-[#3f3f3f]">{value}</div>
            {description ? (
              <div className="t-body-sm mt-1 text-[#3f3f3f]">{description}</div>
            ) : null}
          </div>
        </div>
        {action}
      </CardContent>
    </Card>
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
      <div className="relative h-[152px] overflow-hidden rounded-t-[14px]">
        <Image
          src={promo.image}
          alt={promo.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-[#e8861e] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow">
          PROMO
        </span>
      </div>

      {/* Tear line + punch holes */}
      <div className="relative">
        <div className="mx-3 border-t-2 border-dashed border-[#e5d0b0]" />
        {/* Punch holes — warna sama dengan background section (#fdf8f2) */}
        <div className="absolute -left-[13px] top-1/2 h-[26px] w-[26px] -translate-y-1/2 rounded-full bg-[#fdf8f2]" />
        <div className="absolute -right-[13px] top-1/2 h-[26px] w-[26px] -translate-y-1/2 rounded-full bg-[#fdf8f2]" />
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
        ? homeData.promo.map((promo, index) => ({
            title: `Promo ${index + 1}`,
            image: resolveAssetPath(promo.url, ""),
            date: "Promo aktif",
            description: "",
          }))
        : [],
    [homeData?.promo],
  );

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
        ) : promoList.length === 0 ? (
          <p className="py-4 text-center text-sm text-[#888]">
            Belum ada promo aktif.
          </p>
        ) : (
          <CardSlider>
            {promoList.map((promo, idx) => (
              <div
                key={`promo-${idx}`}
                className="w-[80vw] shrink-0 sm:w-[46vw] lg:w-[28vw]"
                style={{ maxWidth: 360 }}
              >
                <PromoCard promo={promo} />
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
        "group flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl bg-white lg:min-h-[420px]",
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
      <div className="absolute bottom-0 left-0 top-0 z-10 w-[3px] origin-bottom scale-y-0 bg-[#00b4d8] transition-transform duration-300 group-hover:origin-top group-hover:scale-y-100" />

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
        "bg-gradient-to-br from-[#071e38] to-[#0c3a68] p-5",
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
      ) : artikelList.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#888]">
          Belum ada artikel yang dipublikasikan.
        </p>
      ) : (
        /* Bento: featured kiri, 2 kartu kanan */
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          {/* Kiri — featured besar */}
          <div
            className={
              artikelList.length === 1 ? "w-full" : "lg:w-[55%] lg:shrink-0"
            }
          >
            <ArticleFeaturedCard article={toItem(artikelList[0])} />
          </div>

          {/* Kanan — compact + dark card (hanya jika ada artikel ke-2 atau ke-3) */}
          {artikelList.length >= 2 && (
            <div className="flex flex-col gap-4 lg:flex-1">
              <ArticleCompactCard article={toItem(artikelList[1])} />
              {artikelList.length >= 3 && (
                <ArticleTextCard article={toItem(artikelList[2])} />
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
        <div className="flex flex-col gap-4">
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
                {SOCIAL_LINK_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f4f4] transition-all hover:bg-[#e4f6fb] hover:scale-110"
                  >
                    <AssetIcon src={item.icon} alt={item.label} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Kolom kanan: form + jam operasional ── */}
        <div className="flex flex-col gap-4">
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
        </div>
      </div>
    </Section>
  );
}

/* ─── Emergency CTA ─── */

function EmergencyCta() {
  return (
    <section className="bg-[#1a5fa0]">
      <div className="section-container py-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-[#2d7dd2] md:h-[104px] md:w-[104px]">
            <Siren className="h-9 w-9 text-white md:h-12 md:w-12" />
          </div>
          <div>
            <div className="t-h4 font-bold text-white">
              Butuh bantuan segera?
            </div>
            <div className="t-body mt-1 text-white">UGD kami buka 24 jam</div>
            <div className="t-body text-white">hubungi kami</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            className={cn(
              btnHeight,
              "rounded-full bg-[#008000] px-6 t-body text-white hover:bg-[#067006]",
            )}
            asChild
          >
            <Link href="/pendaftaran_online_1">
              <>
                <AssetIcon
                  src={ASSETS.icons.whatsapp}
                  alt=""
                  size={20}
                  className="mr-2"
                />
                Daftar Online
              </>
            </Link>
          </Button>
          <Button className={cn(btnAccent, btnHeight, "px-6 t-body")} asChild>
            <a href={`tel:${CLINIC_PHONE.replace(/-/g, "")}`}>
              <AssetIcon
                src={ASSETS.icons.phone}
                alt=""
                size={20}
                className="mr-2"
              />
              {CLINIC_PHONE}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

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
    [homeData?.layanan],
  );

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
      ) : layananList.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#888]">
          Data layanan belum tersedia.
        </p>
      ) : (
        <CardSlider>
          {layananList.map((layanan, i) => (
            <div
              key={`layanan-${i}`}
              className="w-[82vw] shrink-0 sm:w-[48vw] md:w-[38vw] lg:w-[27vw]"
              style={{ maxWidth: 340 }}
            >
              <ServiceCard layanan={layanan} />
            </div>
          ))}
        </CardSlider>
      )}
    </Section>
  );
}

/* Banner WhatsApp. */
function WhatsappBanner() {
  return (
    <section className="bg-[#00b4d8]">
      <div className="section-container py-8 md:py-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
        <p className="t-h3 max-w-[1003px] text-center font-medium leading-snug text-white lg:text-left">
          Kini kami hadir lebih dekat dengan anda melalui{" "}
          <span className="font-bold">Whatsapp</span>
        </p>
        <Button
          className={cn(
            "rounded-full bg-white px-6 t-h4 font-bold text-[#00b4d8] hover:bg-white/95",
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
              className="w-[88vw] shrink-0 animate-pulse rounded-2xl bg-slate-200 sm:w-[54vw] lg:w-[36vw]"
              style={{ maxWidth: 460, height: 184 }}
            />
          ))}
        </div>
      ) : khanzaDokter.length === 0 ? (
        <p className="py-4 text-center text-sm text-[#888]">
          Data dokter belum tersedia.
        </p>
      ) : (
        <CardSlider>
          {khanzaDokter.map((doctor) => (
            <div
              key={doctor.id}
              className="w-[88vw] shrink-0 sm:w-[54vw] lg:w-[36vw]"
              style={{ maxWidth: 460 }}
            >
              <DoctorCard doctor={doctor} onOpenProfile={openDoctorModal} />
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
  const heroImage = resolveAssetPath(homeData?.banner?.[0]?.url, ASSETS.hero);
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
    <Section
      id="beranda"
      className="scroll-mt-[96px]"
      innerClassName="pt-4 lg:pt-6"
    >
      <div className="grid gap-8 lg:grid-cols-[52%_48%] lg:items-center lg:gap-10">
        <div className="order-2 animate-fade-up lg:order-1">
          <h1 className="max-w-[980px] t-h1 font-bold">
            <span className="text-[#3f3f3f]">
              Klinik Rawat Inap
              <br />
            </span>
            <span className="text-[#00b4d8]">Ampelgading</span>
            <span className="text-[#3f3f3f]"> Medical Centre</span>
          </h1>
          <p className="mt-6 max-w-[740px] t-body-lg text-[#3f3f3f]">
            Pelayanan kesehatan terpadu untuk masyarakat Ampelgading dan
            sekitarnya. UGD 24 jam, rawat inap, persalinan, laboratorium, dan
            apotek. Menerima BPJS dan pasien umum.
          </p>

          <div
            className="mt-8 grid max-w-[760px] grid-cols-3"
            style={{ gap: "var(--gap-cards)" }}
          >
            {heroStats.map((item) => (
              <HeroStatCard key={item.title} item={item} />
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3 lg:gap-4">
            <Button
              className={cn(btnPrimary, btnHeight, "px-6 t-body-sm")}
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
          </div>
        </div>

        <div className="order-1 w-full animate-fade-in lg:order-2 lg:justify-self-end">
          <div className="card-radius bg-[#00b4d8] p-2">
            <div className="relative h-[40vh] min-h-[260px] w-full overflow-hidden card-radius-sm md:h-[50vh] lg:h-auto lg:max-w-[760px] lg:aspect-[1.73]">
              <Image
                src={heroImage}
                alt="Klinik Ampelgading Medical Centre"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 820px"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* Komponen utama. */
export default function LamanUtama() {
  const { data, loading } = useHomeData();

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#3f3f3f]">
      <Navbar />
      <HeroSection homeData={data} />
      <LayananSection homeData={data} loading={loading} />
      <WhatsappBanner />
      <DokterSection />
      <PromoSection homeData={data} loading={loading} />
      <ArtikelSection />
      <HubungiKamiSection homeData={data} />
      <EmergencyCta />
      <Footer />
    </main>
  );
}
