"use client";

import { ExternalLink, MessageSquare, Star, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import PageFooter from "@/src/components/page_footer";
import Navbar from "@/src/components/navbar";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Section, SectionHeader } from "@/src/UiKecil/section";
import { cn } from "@/src/lib/utils";
import { Reveal, Parallax, Tilt, ScrollProgress, WordReveal, ClipReveal } from "@/src/components/motion";
import { EMPTY_RATING_BREAKDOWN, getGaleriPreview, getReview, getStaff, parseTimeline, type GaleriPreview, type ReviewAdminData, type Staff } from "@/src/lib/api";
import GoogleReviews from "@/src/components/GoogleReviews";
import { useSiteSettings } from "@/src/lib/hooks";

/* ─── Types ─── */

type HighlightItem = { value: string; label: string };

type VisionMissionItem = {
  title: string;
  icon: string;
  content: string;
};



/* ─── Constants ─── */

const GOOGLE_REVIEW_URL = "https://maps.app.goo.gl/vkGS2vwxcmb6rvzd8";
const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4874.12081354438!2d112.8737492!3d-8.237420400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6119ef38ca617%3A0x24c74a32e7d6bfb!2sKRI%20Ampelgading%20Medical%20Centre!5e1!3m2!1sid!2sid!4v1781523411427!5m2!1sid!2sid";

const ASSETS = {
  aboutHero: "/assets/about/about-1.png",
  icons: {
    phone: "/assets/icons/phone.svg",
    whatsapp: "/assets/icons/whatsapp.svg",
    vision: "/assets/icons/vision.svg",
    mission: "/assets/icons/mission.svg",
    history: "/assets/icons/history.svg",
    target: "/assets/icons/target.svg",
    instagram: "/assets/icons/instagram.svg",
    facebook: "/assets/icons/facebook.svg",
  },
} as const;

/* Nomor kontak diambil dinamis via useSiteSettings() di tiap komponen. */

const cardShadowMd =
  "shadow-[0px_3.43px_20.59px_-0.86px_#00000033] transition-shadow duration-300 hover:shadow-[0px_5px_28px_-2px_#00000045]";

/* ─── Data ─── */

const highlights: HighlightItem[] = [
  { value: "24/7", label: "Siaga setiap hari" },
  { value: "4.8", label: "Rating kepuasan" },
];

const visionMission: VisionMissionItem[] = [
  {
    title: "Visi",
    icon: ASSETS.icons.vision,
    content:
      "Terwujudnya Klinik Rawat Inap Ampelgading Medical Centre yang Berkualitas, Profesional, dan Terpercaya dalam Pelayanan Kesehatan di Kecamatan Ampelgading dan Sekitarnya.",
  },
  {
    title: "Misi",
    icon: ASSETS.icons.mission,
    content:
      "Memberikan pelayanan bermutu dengan mengutamakan keselamatan pasien dan program 7S. Memanfaatkan teknologi, meningkatkan fasilitas dan kompetensi karyawan, serta membangun kemitraan dengan pihak profesional medis dan masyarakat.",
  },
];

/* Timeline kini diambil dari pengaturan (settings.timeline) via AboutIntroSection. */

const stars = Array.from({ length: 5 });

const AVATAR_COLORS = [
  "#1a5fa0",
  "#e8861e",
  "#00b4d8",
  "#6b5ce7",
  "#0d9e6e",
];

function getInitials(nama: string): string {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ─── Helpers ─── */

function AssetIcon({
  src,
  alt,
  size = 24,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}

function ProgressBar({
  value,
  trackClassName,
  barClassName,
}: {
  value: number;
  trackClassName?: string;
  barClassName?: string;
}) {
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[#e9e5de]",
        trackClassName,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-linear-to-r from-[#ffb347] to-[#ff8c00] transition-all duration-700 ease-out",
          barClassName,
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function GoogleGIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

/* ─── Galeri Preview ─── */

const PREVIEW_CATEGORIES: { key: keyof GaleriPreview; label: string }[] = [
  { key: "kegiatan", label: "Kegiatan" },
  { key: "layanan", label: "Layanan" },
  { key: "fasilitas", label: "Fasilitas" },
  { key: "poli", label: "Poli" },
];

function GaleriPreviewSection() {
  const [preview, setPreview] = useState<GaleriPreview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGaleriPreview()
      .then(setPreview)
      .catch(() => setPreview(null))
      .finally(() => setLoading(false));
  }, []);

  const categories = preview
    ? PREVIEW_CATEGORIES.filter((c) => preview[c.key].length > 0)
    : [];

  if (!loading && categories.length === 0) return null;

  return (
    <Section id="galeri-preview">
      <div className="section-header">
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-5 w-5 fill-[#00b4d8] text-[#00b4d8]" />
          <span className="t-overline text-[#00b4d8]">GALERI KLINIK</span>
        </div>
        <h2 className="t-h2 font-bold text-[#3f3f3f]">
          Foto <span className="italic text-[#00b4d8]">klinik</span> kami
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video animate-pulse rounded-xl bg-[#e7e7e7]"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.key}>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#9a9a9a]">
                {cat.label}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {preview![cat.key].map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-video overflow-hidden card-radius"
                  >
                    <Image
                      src={item.url}
                      alt={item.text || cat.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {item.text && (
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="absolute bottom-2 left-2 right-2 text-[10px] font-medium text-white">
                          {item.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          href="/galeri"
          className="inline-flex items-center gap-2 rounded-full bg-[#00b4d8] px-6 py-3 t-body font-semibold text-white transition-colors hover:bg-[#0099b8]"
        >
          Lihat Semua Foto
          <span aria-hidden>→</span>
        </Link>
      </div>
    </Section>
  );
}

/* ─── About intro ─── */

function AboutIntroSection() {
  const settings = useSiteSettings();
  const visiMisi = visionMission.map((item) => ({
    ...item,
    content: item.title === "Visi" ? settings.visi : settings.misi,
  }));
  const timeline = parseTimeline(settings.timeline);
  return (
    <section id="tentang" className="relative overflow-hidden bg-grid-soft">
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-[#00b4d8]/35"
          style={{ top: "-10%", left: "-8%", width: "42vw", height: "42vw", ["--orb-dur" as string]: "17s" } as React.CSSProperties}
        />
        <div
          className="aurora-blob bg-[#e8861e]/20"
          style={{ bottom: "-10%", right: "-6%", width: "36vw", height: "36vw", ["--orb-dur" as string]: "21s", ["--orb-delay" as string]: "2s" } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f2f0ed]/10 via-[#f2f0ed]/40 to-[#f2f0ed]" />
      </div>

      <div className="section-wrap">
        <div className="text-center">
          <Reveal direction="up">
            <div className="mb-3 inline-flex items-center justify-center gap-2 rounded-full border border-[#00b4d8]/20 bg-[#00b4d8]/8 px-3 py-1">
              <Star className="h-4 w-4 fill-[#00b4d8] text-[#00b4d8]" />
              <span className="t-overline text-[#00b4d8]">TENTANG KAMI</span>
            </div>
          </Reveal>
          <h1 className="t-h1 font-bold leading-[1.14]">
            <WordReveal
              as="span"
              text="Mengenal lebih"
              className="text-[#3f3f3f]"
              delay={120}
              step={70}
            />{" "}
            <WordReveal
              as="span"
              text="dekat"
              wordClassName="text-gradient-brand"
              delay={320}
              step={70}
            />
          </h1>
        </div>

        <div
          className="mt-10 grid w-full lg:grid-cols-[530px_1fr]"
          style={{ gap: "var(--gap-cards)" }}
        >
          <Parallax speed={0.06}>
            <Tilt max={5}>
              <ClipReveal duration={1100} className="relative h-[280px] w-full overflow-hidden card-radius shadow-[0_30px_70px_-30px_rgba(15,76,129,0.5)] sm:h-[340px] lg:h-[398px]">
                <Image
                  src={settings.about_image || ASSETS.aboutHero}
                  alt="Kegiatan klinik Ampelgading Medical Centre"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 530px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071e38]/30 via-transparent to-transparent" />
              </ClipReveal>
            </Tilt>
          </Parallax>

          <Reveal direction="left" delay={120} className="flex flex-col">
            <h2 className="t-h2 font-bold text-[#3f3f3f]">
              Melayani dengan <span className="text-[#00b4d8]">sepenuh hati</span>{" "}
              untuk kesehatan masyarakat Ampelgading
            </h2>
            <p className="mt-4 t-body-lg font-medium text-[#7a8088]">
              {settings.about_text}
            </p>

            <div
              className="mt-6 grid sm:grid-cols-2"
              style={{ gap: "var(--gap-cards)" }}
            >
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="ring-gradient card-radius border border-white/60 bg-white/70 p-5 text-center shadow-[0px_2.87px_17.25px_-0.72px_#00000020] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_-16px_rgba(0,180,216,0.4)]"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="t-h2 font-bold text-[#00b4d8]">
                      {item.value}
                    </div>
                    <div className="t-body mt-2 text-black">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div
          className="mt-8 grid lg:grid-cols-2"
          style={{ gap: "var(--gap-cards)" }}
        >
          {visiMisi.map((item, i) => (
            <Reveal key={item.title} direction="up" delay={i * 120}>
              <div className="ring-gradient card-radius h-full border border-white/60 bg-white/75 p-7 shadow-[0px_2.87px_17.25px_-0.72px_#00000020] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_-18px_rgba(0,180,216,0.35)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00b4d8]/10">
                    <AssetIcon src={item.icon} alt={item.title} size={28} />
                  </div>
                  <h3 className="t-h3 font-bold text-[#3f3f3f]">{item.title}</h3>
                </div>
                <p className="t-body font-medium text-[#3f3f3f]">
                  {item.content}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Timeline — desain garis horizontal dengan titik */}
        <Reveal direction="up" className="mt-12 w-full">
          <div className="relative">
            <div className="absolute left-0 right-0 top-[14px] hidden h-0.5 bg-gradient-to-r from-[#00b4d8]/30 via-[#00b4d8]/40 to-[#e8861e]/30 md:block" />
            <div
              className="grid grid-cols-2 md:grid-cols-4"
              style={{ gap: "var(--gap-cards)" }}
            >
              {timeline.map((item, i) => (
                <div key={`${item.year}-${i}`} className="relative text-center">
                  <span className="mx-auto mb-4 hidden h-7 w-7 items-center justify-center rounded-full border-2 border-[#00b4d8] bg-white md:flex">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#00b4d8]" style={i % 2 ? { background: "#e8861e" } : undefined} />
                  </span>
                  <div className={cn("t-h3 font-bold", i % 2 === 0 ? "text-[#00b4d8]" : "text-[#3f3f3f]")}>
                    {item.year}
                  </div>
                  <div className={cn("t-body mt-1 font-medium", i % 2 === 0 ? "text-[#3f3f3f]" : "text-[#00b4d8]")}>
                    {item.title}
                  </div>
                  <div className="t-caption mt-1 font-medium text-[#a6a6a6]">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Rating ─── */

function RatingSection({
  reviewData,
  loading,
}: {
  reviewData: ReviewAdminData;
  loading: boolean;
}) {
  const { reviews, summary } = reviewData;

  const breakdown = summary.rating_breakdown;
  const breakdownTotal = breakdown["5"] + breakdown["4"] + breakdown["3"] + breakdown["2"] + breakdown["1"];
  const dynamicRatingBars = ([5, 4, 3, 2, 1] as const).map((star) => {
    const count = breakdown[String(star) as "5" | "4" | "3" | "2" | "1"];
    const pct = breakdownTotal > 0 ? Math.round((count / breakdownTotal) * 100) : 0;
    return { label: String(star), value: pct };
  });

  const displayRating =
    summary.rating_google > 0 ? summary.rating_google.toFixed(1) : "—";
  const totalUlasan =
    summary.total_ulasan > 0 ? `${summary.total_ulasan} ulasan` : "—";
  const mapsHref = summary.link_gmaps || GOOGLE_REVIEW_URL;
  const ratingPercent =
    summary.rating_google > 0 ? (summary.rating_google / 5) * 100 : 0;

  return (
    <Section id="google-review">
      <SectionHeader label="RATING" title="Apa kata mereka" />

      {/* Rating overview row */}
      <div
        className="grid lg:grid-cols-[1fr_260px]"
        style={{ gap: "var(--gap-cards)" }}
      >
        {/* Star distribution card */}
        <Card className={cn("relative overflow-hidden card-radius border-0 bg-linear-to-br from-white to-[#f7f5f2]", cardShadowMd)}>
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#ff8c00]/8 blur-3xl" />
          <CardContent className="card-base relative">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e0d8] bg-white px-2.5 py-1 shadow-sm">
                <GoogleGIcon size={14} />
                <span className="t-body-sm font-semibold text-[#3f3f3f]">
                  Google Review
                </span>
              </div>
              <div className="flex gap-0.5">
                {stars.map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#ff8c00] text-[#ff8c00]" />
                ))}
              </div>
            </div>
            <div className="mb-6 t-caption text-[#9a9a9a]">
              {summary.total_ulasan > 0
                ? `Berdasarkan ${summary.total_ulasan} ulasan di Google Maps`
                : "Belum ada data ulasan Google"}
            </div>
            <div className="flex items-end gap-6">
              <div className="relative shrink-0">
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full transition-all duration-700"
                  style={{
                    background: `conic-gradient(#ff8c00 ${ratingPercent}%, #e9e5de ${ratingPercent}%)`,
                  }}
                >
                  <div className="flex h-23 w-23 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                    <span className="t-h1 font-bold leading-none text-[#3f3f3f]">
                      {displayRating}
                    </span>
                    <span className="mt-1 t-caption text-[#9a9a9a]">dari 5</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {dynamicRatingBars.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2"
                  >
                    <span className="flex w-3 shrink-0 items-center gap-0.5 t-caption text-right text-[#757575]">
                      {item.label}
                      <Star className="h-2.5 w-2.5 fill-[#d9d9d9] text-[#d9d9d9]" />
                    </span>
                    <ProgressBar value={item.value} />
                    <span className="w-8 shrink-0 t-caption text-[#9a9a9a]">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Maps embed card */}
        <div
          className={cn(
            "overflow-hidden card-radius bg-white",
            cardShadowMd,
          )}
        >
          <div className="relative h-50 w-full">
            <iframe
              src={MAPS_EMBED_URL}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi KRI Ampelgading Medical Centre"
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <div className="t-body-sm font-semibold text-[#3f3f3f]">
                KRI Ampelgading Medical Centre
              </div>
              <div className="mt-0.5 flex items-center gap-1">
                <div className="flex gap-0.5">
                  {stars.map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-[#ff8c00] text-[#ff8c00]"
                    />
                  ))}
                </div>
                <span className="t-caption text-[#9a9a9a]">
                  {displayRating} · {totalUlasan}
                </span>
              </div>
            </div>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-[#e8f4fd] px-3 py-1.5 t-caption font-semibold text-[#1a5fa0] transition-colors hover:bg-[#d0e8f8]"
            >
              Buka →
            </a>
          </div>
        </div>
      </div>

      {/* Review cards — testimoni terkurasi manual, section terpisah dari
          "Ulasan dari Google" di bawah. Disembunyikan total bila kosong
          (bukan tampilkan placeholder) supaya tidak ada section kosong yang
          mengganggu bila admin belum menambah testimoni manual. */}
      {(loading || reviews.length > 0) && (
      <div
        className="mt-8 grid md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "var(--gap-cards)" }}
      >
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "card-radius h-52 animate-pulse bg-[#f7f5f2]",
                cardShadowMd,
              )}
            />
          ))
        ) : (
          reviews.map((review, index) => (
            <Reveal key={review.id ?? index} direction="up" delay={Math.min(index, 5) * 80}>
            <Card
              className={cn("card-radius h-full border-0 bg-white", cardShadowMd)}
            >
              <CardContent className="card-base flex flex-col gap-3">
                {/* Header: avatar + name */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full t-body-sm font-semibold text-white"
                    style={{
                      backgroundColor:
                        AVATAR_COLORS[index % AVATAR_COLORS.length],
                    }}
                  >
                    {getInitials(review.nama)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate t-body font-semibold text-[#3f3f3f]">
                      {review.nama}
                    </h3>
                    <div className="t-caption text-[#9a9a9a]">
                      {review.tag || review.tanggal}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                  {stars.map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={cn(
                        "h-3.5 w-3.5",
                        starIndex < review.rating
                          ? "fill-[#ff8c00] text-[#ff8c00]"
                          : "fill-[#e5e5e5] text-[#e5e5e5]",
                      )}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="line-clamp-4 t-body-sm leading-relaxed text-[#5a5a5a]">
                  {review.komentar}
                </p>
              </CardContent>
            </Card>
            </Reveal>
          ))
        )}
      </div>
      )}

      {/* Ulasan Google asli (cache RapidAPI, terpisah dari testimoni terkurasi di atas) */}
      <div className="mt-10">
        <h3 className="mb-4 t-h4 font-bold text-[#3f3f3f]">Ulasan dari Google</h3>
        <GoogleReviews />
      </div>

      {/* CTA bar */}
      <Card
        className={cn("mt-8 card-radius border-0 bg-[#1a5fa0]", cardShadowMd)}
      >
        <CardContent className="card-base flex flex-col items-start justify-between gap-5 pt-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="t-h4 font-bold leading-snug text-white">
                Punya pengalaman di klinik kami?
              </h3>
              <p className="t-body leading-snug text-white/75">
                Bagikan ulasan Anda di Google Maps
              </p>
            </div>
          </div>
          <Button
            className="h-13 w-full shrink-0 self-center rounded-full bg-white px-7 t-body font-semibold text-[#1a5fa0] hover:bg-white/90 md:w-auto"
            asChild
          >
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              Tulis Ulasan
            </a>
          </Button>
        </CardContent>
      </Card>
    </Section>
  );
}

/* ─── Main ─── */

/* ─── Tim Kami ─── */

function StaffProfileModal({
  staff,
  open,
  onClose,
}: {
  staff: Staff;
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

  const hasFoto = Boolean(staff.foto_url);

  return (
    <div
      className={cn(
        "fixed inset-0 z-80 flex items-center justify-center p-4 sm:p-6",
        "bg-slate-950/55 backdrop-blur-md transition-all duration-300 ease-out",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Profil ${staff.nama}`}
        className={cn(
          "relative w-full max-w-sm overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_40px_120px_-40px_rgba(15,23,42,0.7)]",
          "transform-gpu transition-all duration-300 ease-out",
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.97] opacity-0",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup profil staff"
          className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:rotate-90 hover:bg-white hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-4/5 w-full overflow-hidden bg-linear-to-br from-[#082f49] via-[#0f4c81] to-[#00b4d8]">
          {hasFoto ? (
            <Image
              src={staff.foto_url}
              alt={staff.nama}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 100vw, 384px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <UserRound className="h-24 w-24 text-white/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            {staff.jabatan ? (
              <span className="inline-flex items-center rounded-full bg-[#00b4d8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#00b4d8]/30">
                {staff.jabatan}
              </span>
            ) : null}
            <h3 className="mt-2.5 text-2xl font-bold leading-tight text-white drop-shadow-sm">
              {staff.nama}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 px-5 py-4">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#00b4d8]/10 text-[#00b4d8]">
            <UserRound className="h-4.5 w-4.5" />
          </span>
          <p className="text-[13px] leading-5 text-slate-500">
            Bagian dari tim KRI Ampelgading Medical Centre yang siap melayani Anda.
          </p>
        </div>
      </div>
    </div>
  );
}

function TimSection() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Staff | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getStaff()
      .then((data) => setStaff(data.filter((s) => s.foto_url)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && staff.length === 0) return null;

  const openModal = (s: Staff) => {
    setSelected(s);
    setOpen(true);
  };

  return (
    <Section id="tim">
      <SectionHeader label="TIM KAMI" title="Tim yang melayani Anda" />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-4/5 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {staff.map((s, i) => (
            <Reveal key={s.id} direction="up" delay={Math.min(i, 6) * 60}>
              <button
                type="button"
                onClick={() => openModal(s)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-white text-left shadow-[0_2px_16px_-4px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]"
              >
                <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={s.foto_url}
                    alt={s.nama}
                    fill
                    loading="lazy"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    {s.jabatan ? (
                      <span className="mb-1 inline-block rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#00b4d8] backdrop-blur">
                        {s.jabatan}
                      </span>
                    ) : null}
                    <p className="line-clamp-2 t-body-sm font-semibold text-white">
                      {s.nama}
                    </p>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {selected ? (
        <StaffProfileModal staff={selected} open={open} onClose={() => setOpen(false)} />
      ) : null}
    </Section>
  );
}

export default function TentangKami() {
  const [reviewData, setReviewData] = useState<ReviewAdminData>({
    reviews: [],
    summary: { rating_google: 0, total_ulasan: 0, link_gmaps: "", rating_breakdown: EMPTY_RATING_BREAKDOWN },
  });
  const [loadingReview, setLoadingReview] = useState(true);

  useEffect(() => {
    getReview()
      .then(setReviewData)
      .catch(() => {})
      .finally(() => setLoadingReview(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#3f3f3f]">
      <ScrollProgress />
      <Navbar />
      <AboutIntroSection />
      <GaleriPreviewSection />
      <TimSection />
      <RatingSection reviewData={reviewData} loading={loadingReview} />
      <PageFooter />
    </main>
  );
}
