"use client";

import { ExternalLink, MessageSquare, Siren, Star } from "lucide-react";
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
import { getReview, type ReviewAdminData } from "@/src/lib/api";

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

const CLINIC_PHONE = "0812-2556-6055";
const WHATSAPP_URL = "https://wa.me/6281225566055";

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

const timelineItems: TimelineItem[] = [
  {
    year: "2011",
    title: "Awal mula",
    description: "praktik mandiri dr. Nikma Fitriasari, MMRS",
    yearClass: "text-[#00b4d8]",
    titleClass: "text-[#3f3f3f]",
  },
  {
    year: "2021",
    title: "Klinik rawat inap",
    description:
      "Resmi menjadi KRI Ampelgading Medical Centre dan beroperasi 24 jam dengan izin klinik pratama",
    yearClass: "text-[#3f3f3f]",
    titleClass: "text-[#00b4d8]",
  },
  {
    year: "2023",
    title: "Menerima BPJS",
    description: "Melayani pasien BPJS Kesehatan & umum",
    yearClass: "text-[#00b4d8]",
    titleClass: "text-[#3f3f3f]",
  },
  {
    year: "2026",
    title: "Terus berkembang",
    description: "Layanan SIAP DOK, homevisit, rating 4.8",
    yearClass: "text-[#3f3f3f]",
    titleClass: "text-[#00b4d8]",
  },
];

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
  return (
    <Section id="tentang">
      <div className="text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Star className="h-5 w-5 fill-[#00b4d8] text-[#00b4d8]" />
          <span className="t-overline text-[#00b4d8]">TENTANG KAMI</span>
        </div>
        <h1 className="t-h1 font-bold text-[#3f3f3f]">Mengenal lebih dekat</h1>
      </div>

      <div
        className="mt-8 grid w-full lg:grid-cols-[530px_1fr]"
        style={{ gap: "var(--gap-cards)" }}
      >
        <div className="relative h-[280px] w-full overflow-hidden card-radius sm:h-[340px] lg:h-[398px]">
          <Image
            src={ASSETS.aboutHero}
            alt="Kegiatan klinik Ampelgading Medical Centre"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 530px"
          />
        </div>

        <div className="flex flex-col">
          <h2 className="t-h2 font-bold text-[#3f3f3f]">
            Melayani dengan <span className="text-[#00b4d8]">sepenuh hati</span>{" "}
            untuk kesehatan masyarakat Ampelgading
          </h2>
          <p className="mt-4 t-body-lg font-medium text-[#9a9a9a]">
            KRI Ampelgading Medical Centre adalah klinik rawat inap yang
            berlokasi di Desa Tirtomarto, Kec. Ampelgading, Kab. Malang.
            Didukung tenaga medis profesional, kami melayani UGD 24 jam, rawat
            inap, rawat jalan, persalinan, dan laboratorium
          </p>

          <div
            className="mt-6 grid sm:grid-cols-2"
            style={{ gap: "var(--gap-cards)" }}
          >
            {highlights.map((item) => (
              <Card
                key={item.label}
                className={cn(
                  "card-radius border-0 bg-[#e7e7e7] backdrop-blur-[14.37px]",
                  cardShadowSoft,
                )}
              >
                <CardContent className="card-base flex flex-col items-center justify-center text-center">
                  <div className="t-h2 font-bold text-[#00b4d8]">
                    {item.value}
                  </div>
                  <div className="t-body mt-2 text-black">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-8 grid lg:grid-cols-2"
        style={{ gap: "var(--gap-cards)" }}
      >
        {visionMission.map((item) => (
          <Card
            key={item.title}
            className={cn(
              "card-radius border-0 bg-[#e7e7e7] backdrop-blur-[14.37px]",
              cardShadowSoft,
            )}
          >
            <CardContent className="card-base">
              <div className="mb-4 flex items-center gap-3">
                <AssetIcon src={item.icon} alt={item.title} size={32} />
                <h3 className="t-h3 font-bold text-[#3f3f3f]">{item.title}</h3>
              </div>
              <p className="t-body font-medium text-[#3f3f3f]">
                {item.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 w-full">
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: "var(--gap-cards)" }}
        >
          {timelineItems.map((item) => (
            <div key={item.year} className="text-center">
              <div className={cn("t-h3 font-bold", item.yearClass)}>
                {item.year}
              </div>
              <div className={cn("t-body mt-1 font-medium", item.titleClass)}>
                {item.title}
              </div>
            </div>
          ))}
        </div>
        <Separator className="mt-4 bg-[#bcbcbc]" />
        <div
          className="grid grid-cols-2 pt-3 md:grid-cols-4"
          style={{ gap: "var(--gap-cards)" }}
        >
          {timelineItems.map((item) => (
            <div
              key={`${item.year}-desc`}
              className="t-caption text-center font-medium text-[#a6a6a6]"
            >
              {item.description}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Gallery ─── */

function GaleriSection() {
  const galleryGroups = [galeriKlinik, galeriKlinik];

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
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
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
        {stats.map((item) => (
          <Card key={item.label} className="card-radius border-0 bg-[#e7e7e7]">
            <CardContent className="card-base flex flex-col items-center justify-center">
              <div className="t-h2 font-bold text-[#00b4d8]">{item.value}</div>
              <div className="t-body mt-2 text-center font-bold text-[#808080]">
                {item.label}
              </div>
            </CardContent>
          </Card>
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
            <Card
              key={review.id ?? index}
              className={cn("card-radius border-0 bg-white", cardShadowMd)}
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
  return (
    <section className="bg-[#1a5fa0]">
      <div className="section-container flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
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
              "h-12 rounded-full bg-[#008000] px-6 t-body text-white hover:bg-[#067006]",
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
              "h-12 rounded-full bg-[#e8861e] px-6 t-body text-white hover:bg-[#d77a18]",
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
        </div>
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

  useEffect(() => {
    getReview()
      .then(setReviewData)
      .catch(() => {})
      .finally(() => setLoadingReview(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#f2f0ed] text-[#3f3f3f]">
      <Navbar />
      <AboutIntroSection />
      <GaleriSection />
      <RatingSection reviewData={reviewData} loading={loadingReview} />
      <EmergencyCta />
      <Footer />
    </main>
  );
}
