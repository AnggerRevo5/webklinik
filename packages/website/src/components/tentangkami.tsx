"use client";

import { ExternalLink, Images, MessageSquare, Siren, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useEffect, useState } from "react";
import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Section, SectionHeader } from "@/src/UiKecil/section";
import { Separator } from "@/src/UiKecil/separator";
import { cn } from "@/src/lib/utils";
import { Reveal, Parallax, Tilt, ScrollProgress, WordReveal, ClipReveal } from "@/src/components/motion";
import { getGaleri, getReview, parseTimeline, type Gallery, type ReviewAdminData } from "@/src/lib/api";
import { useSiteSettings } from "@/src/lib/hooks";

/* ─── Types ─── */

type HighlightItem = { value: string; label: string };

type VisionMissionItem = {
  title: string;
  icon: string;
  content: string;
};

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  yearClass: string;
  titleClass: string;
};

type GalleryItem = { title: string; image: string; description: string };

type StatItem = { value: string; label: string };


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

const cardShadowSoft =
  "shadow-[0px_2.87px_17.25px_-0.72px_#00000033] transition-shadow duration-300 hover:shadow-[0px_4px_24px_-2px_#00000040]";
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

const galeriKlinik: GalleryItem[] = [
  {
    title: "Kegiatan klinik",
    image: "/assets/galeri/galeri1.png",
    description:
      "Pelayanan harian dan aktivitas klinik untuk pasien serta keluarga.",
  },
  {
    title: "Poling Desa Tirtomarto",
    image: "/assets/galeri/galeri2.png",
    description:
      "Kegiatan pelayanan keliling untuk menjangkau warga di desa sekitar.",
  },
  {
    title: "Home care",
    image: "/assets/galeri/galeri3.png",
    description:
      "Layanan kunjungan ke rumah pasien untuk pemantauan dan perawatan.",
  },
  {
    title: "UGD 24 Jam",
    image: "/assets/galeri/galeri4.png",
    description:
      "Tim siaga yang siap menangani kondisi gawat darurat kapan saja.",
  },
  {
    title: "Posyandu",
    image: "/assets/galeri/galeri5.png",
    description: "Pendampingan kesehatan ibu dan anak di kegiatan posyandu.",
  },
  {
    title: "Edukasi kesehatan",
    image: "/assets/galeri/galeri6.png",
    description:
      "Sesi penyuluhan untuk meningkatkan pemahaman kesehatan masyarakat.",
  },
];

const stats: StatItem[] = [
  { value: "50+", label: "Kegiatan per tahun" },
  { value: "10", label: "Desa terjangkau polling" },
  { value: "250+", label: "Pasien terlayani" },
];

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
        "h-2 w-full overflow-hidden rounded-full bg-[#d9d9d9]",
        trackClassName,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[#ff8c00] transition-all",
          barClassName,
        )}
        style={{ width: `${value}%` }}
      />
    </div>
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
                  src={ASSETS.aboutHero}
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

/* ─── Gallery ─── */

function GaleriSection({ items }: { items: GalleryItem[] }) {
  const resolved = items.length > 0 ? items : galeriKlinik;
  const galleryGroups = [resolved, resolved];

  return (
    <Section id="galeri">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between section-header">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 fill-[#00b4d8] text-[#00b4d8]" />
            <span className="t-overline text-[#00b4d8]">GALERI KLINIK</span>
          </div>
          <h2 className="t-h2 font-bold text-[#3f3f3f]">
            Kegiatan & <span className="italic text-[#00b4d8]">aktivitas</span>{" "}
            kami
          </h2>
        </div>
        <Link
          href="/galeri"
          className="btn-shine inline-flex w-fit items-center gap-2 rounded-full bg-[#00b4d8] px-5 py-2.5 t-body-sm font-semibold text-white shadow-lg shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#00a3c5]"
        >
          <Images className="h-4 w-4" />
          Lihat semua foto
        </Link>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex w-max animate-gallery-marquee will-change-transform"
          style={{ ["--duration" as string]: "34s" } as React.CSSProperties}
        >
          {galleryGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              aria-hidden={groupIndex > 0}
              className="flex shrink-0 gap-4 pr-4"
            >
              {group.map((item, index) => (
                <Card
                  key={`${item.image}-${groupIndex}-${index}`}
                  className={cn(
                    "group w-[85vw] shrink-0 overflow-hidden rounded-none border-0 bg-white sm:w-[320px] md:w-[480px] lg:w-[640px]",
                    cardShadowMd,
                  )}
                >
                  <CardContent className="p-0">
                    <div className="group relative h-[280px] w-full overflow-hidden md:h-[300px] lg:h-[400px]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-200" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                        <h3 className="t-h4 font-medium text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 max-w-[90%] t-body-sm text-white/90">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-8 grid md:grid-cols-3"
        style={{ gap: "var(--gap-cards)" }}
      >
        {stats.map((item, i) => (
          <Reveal key={item.label} direction="up" delay={i * 100}>
            <div className="ring-gradient card-radius h-full border border-white/60 bg-white/75 p-6 shadow-[0px_2.87px_17.25px_-0.72px_#00000020] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(0,180,216,0.35)]">
              <div className="flex flex-col items-center justify-center">
                <div className="t-h2 font-bold text-[#00b4d8]">{item.value}</div>
                <div className="t-body mt-2 text-center font-bold text-[#808080]">
                  {item.label}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
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

  const dynamicRatingBars = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { label: String(star), value: pct };
  });

  const displayRating =
    summary.rating_google > 0 ? summary.rating_google.toFixed(1) : "—";
  const totalUlasan =
    summary.total_ulasan > 0 ? `${summary.total_ulasan} ulasan` : "—";
  const mapsHref = summary.link_gmaps || GOOGLE_REVIEW_URL;

  return (
    <Section id="google-review">
      <SectionHeader label="RATING" title="Apa kata mereka" />

      {/* Rating overview row */}
      <div
        className="grid lg:grid-cols-[1fr_260px]"
        style={{ gap: "var(--gap-cards)" }}
      >
        {/* Star distribution card */}
        <Card className={cn("card-radius border-0 bg-[#f7f5f2]", cardShadowMd)}>
          <CardContent className="card-base">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex gap-0.5">
                {stars.map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#ff8c00] text-[#ff8c00]" />
                ))}
              </div>
              <span className="t-body-sm font-semibold text-[#ff8c00]">
                Google Review
              </span>
            </div>
            <div className="mb-6 t-caption text-[#9a9a9a]">
              {summary.total_ulasan > 0
                ? `Berdasarkan ${summary.total_ulasan} ulasan di Google Maps`
                : "Belum ada data ulasan Google"}
            </div>
            <div className="flex items-end gap-6">
              <div className="shrink-0">
                <div className="t-h1 font-bold leading-none text-[#3f3f3f]">
                  {displayRating}
                </div>
                <div className="mt-1 t-caption text-[#9a9a9a]">dari 5</div>
              </div>
              <div className="flex-1 space-y-2">
                {dynamicRatingBars.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2"
                  >
                    <span className="w-3 shrink-0 t-caption text-right text-[#757575]">
                      {item.label}
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

      {/* Review cards */}
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
        ) : reviews.length === 0 ? (
          <div className="col-span-3 py-12 text-center">
            <MessageSquare className="mx-auto mb-3 h-8 w-8 text-[#d9d9d9]" />
            <p className="t-body text-[#9a9a9a]">
              Belum ada ulasan yang ditampilkan.
            </p>
          </div>
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

      {/* CTA bar */}
      <Card
        className={cn("mt-8 card-radius border-0 bg-[#1a5fa0]", cardShadowMd)}
      >
        <CardContent className="card-base flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="t-h4 font-bold text-white">
                Punya pengalaman di klinik kami?
              </h3>
              <p className="t-body text-white/75">
                Bagikan ulasan Anda di Google Maps
              </p>
            </div>
          </div>
          <Button
            className="h-12 shrink-0 rounded-full bg-white px-6 t-body font-semibold text-[#1a5fa0] hover:bg-white/90"
            asChild
          >
            <a href={mapsHref} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Tulis Ulasan
            </a>
          </Button>
        </CardContent>
      </Card>
    </Section>
  );
}

function EmergencyCta() {
  const settings = useSiteSettings();
  const CLINIC_PHONE = settings.telepon;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f4c81] via-[#1a5fa0] to-[#2d7dd2]">
      <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-40" />
      <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-[#5fd0e8]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-[#e8861e]/20 blur-3xl" />

      <div className="relative section-container flex flex-col gap-6 py-9 lg:flex-row lg:items-center lg:justify-between">
        <Reveal direction="right" className="flex items-center gap-4">
          <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full bg-[#2d7dd2] md:h-[104px] md:w-[104px]">
            <span className="absolute inset-0 rounded-full ring-2 ring-white/30" style={{ animation: "soft-pulse 2.2s ease-out infinite" }} />
            <Siren className="h-9 w-9 text-white md:h-12 md:w-12" />
          </div>
          <div>
            <div className="t-h4 font-bold text-white">
              Butuh bantuan segera?
            </div>
            <div className="t-body mt-1 text-white/90">UGD kami buka 24 jam</div>
            <div className="t-body text-white/90">hubungi kami</div>
          </div>
        </Reveal>
        <Reveal direction="left" delay={120} className="flex flex-wrap gap-4">
          <Button
            className={cn(
              "btn-shine h-12 rounded-full bg-[#008000] px-6 t-body text-white shadow-lg shadow-emerald-900/30 transition-transform hover:-translate-y-0.5 hover:bg-[#067006]",
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
          <Button
            className={cn(
              "btn-shine h-12 rounded-full bg-[#e8861e] px-6 t-body text-white shadow-lg shadow-orange-900/20 transition-transform hover:-translate-y-0.5 hover:bg-[#d77a18]",
            )}
            asChild
          >
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
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Main ─── */

export default function TentangKami() {
  const [reviewData, setReviewData] = useState<ReviewAdminData>({
    reviews: [],
    summary: { rating_google: 0, total_ulasan: 0, link_gmaps: "" },
  });
  const [loadingReview, setLoadingReview] = useState(true);
  const [galeriItems, setGaleriItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    getReview()
      .then(setReviewData)
      .catch(() => {})
      .finally(() => setLoadingReview(false));

    getGaleri()
      .then((data: Gallery[]) =>
        setGaleriItems(
          data
            .filter((item) => item.url)
            .map((item) => ({
              title: item.text,
              image: item.url,
              description: item.kategori,
            })),
        ),
      )
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#f2f0ed] text-[#3f3f3f]">
      <ScrollProgress />
      <Navbar />
      <AboutIntroSection />
      <GaleriSection items={galeriItems} />
      <RatingSection reviewData={reviewData} loading={loadingReview} />
      <EmergencyCta />
      <Footer />
    </main>
  );
}
