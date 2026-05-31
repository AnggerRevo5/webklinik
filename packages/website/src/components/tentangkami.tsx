"use client";

import { ExternalLink, MessageSquare, Siren, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Section, SectionHeader } from "@/src/UiKecil/section";
import { Separator } from "@/src/UiKecil/separator";
import { cn } from "@/src/lib/utils";

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

type RatingBar = { label: string; value: number };

type ReviewItem = {
  name: string;
  role: string;
  text: string;
  image: string;
  initials: string;
};

/* ─── Constants ─── */

const GOOGLE_REVIEW_URL = "https://maps.google.com";

const ASSETS = {
  aboutHero: "/assets/about/about-1.png",
  googleMaps: "/assets/about/about-3.png",
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

const ratingBars: RatingBar[] = [
  { label: "5", value: 85 },
  { label: "4", value: 10 },
  { label: "3", value: 3 },
  { label: "2", value: 0 },
  { label: "1", value: 2 },
];

const reviews: ReviewItem[] = [
  {
    name: "Sara Ali Khan",
    role: "Cardiology Patient",
    text: "Thanks for all the services, no doubt it is the best hospital.",
    image: "/assets/team/team1.png",
    initials: "SA",
  },
  {
    name: "Simon Targett",
    role: "Neurology Patient",
    text: "Thanks for all the services, no doubt it is the best hospital.",
    image: "/assets/team/team2.png",
    initials: "ST",
  },
  {
    name: "Sara Ali Khan",
    role: "Cardiology Patient",
    text: "Thanks for all the services, no doubt it is the best hospital.",
    image: "/assets/team/team3.png",
    initials: "SA",
  },
];

const stars = Array.from({ length: 5 });

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

function ReviewAvatar({
  src,
  alt,
  initials,
}: {
  src: string;
  alt: string;
  initials: string;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-[#4200ff]" />
      <div className="relative ml-3 mt-1 h-[52px] w-[52px] overflow-hidden rounded-full bg-[#d9d9d9]">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="52px"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center t-body-sm font-medium text-[#3f3f3f]">
            {initials}
          </span>
        )}
      </div>
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

function RatingSection() {
  return (
    <Section id="google-review">
      <SectionHeader label="RATING" title="Apa kata mereka" />

      <div
        className="grid lg:grid-cols-[1fr_244px]"
        style={{ gap: "var(--gap-cards)" }}
      >
        <Card className={cn("card-radius border-0 bg-[#f7f5f2]", cardShadowMd)}>
          <CardContent className="card-base">
            <div className="mb-3 flex items-center gap-1 text-[#ff8c00]">
              {stars.map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-[#ff8c00]" />
              ))}
            </div>
            <div className="mb-5 t-body-sm font-medium text-[#757575]">
              Berdasarkan 23 ulasan di Google
            </div>
            <div className="grid grid-cols-[60px_1fr] gap-4">
              <div className="t-h2 font-medium text-[#3f3f3f]">4.8</div>
              <div className="space-y-3">
                {ratingBars.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-[16px_1fr] items-center gap-3"
                  >
                    <div className="t-body text-[#3f3f3f]">{item.label}</div>
                    <ProgressBar value={item.value} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "overflow-hidden card-radius border-0 bg-[#f7f5f2]",
            cardShadowMd,
          )}
        >
          <CardContent className="relative h-[200px] p-0">
            <Image
              src={ASSETS.googleMaps}
              alt="Google Maps klinik"
              fill
              className="object-cover"
              sizes="244px"
            />
          </CardContent>
        </Card>
      </div>

      <div
        className="mt-8 grid md:grid-cols-2 lg:grid-cols-3"
        style={{ gap: "var(--gap-cards)" }}
      >
        {reviews.map((review, index) => (
          <Card
            key={`${review.name}-${index}`}
            className={cn("card-radius border-0 bg-white", cardShadowMd)}
          >
            <CardContent className="card-base">
              <div className="mb-4 flex items-start gap-4">
                <ReviewAvatar
                  src={review.image}
                  alt={review.name}
                  initials={review.initials}
                />
                <div>
                  <h3 className="t-h4 font-medium text-[#3f3f3f]">
                    {review.name}
                  </h3>
                  <div className="t-caption font-medium text-[#757575]">
                    {review.role}
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center gap-1 text-[#4200ff]">
                {stars.map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="h-3.5 w-3.5 fill-[#4200ff] text-[#4200ff]"
                  />
                ))}
              </div>
              <p className="t-body-sm text-[#3f3f3f]">{review.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card
        className={cn("mt-8 card-radius border-0 bg-[#f7f5f2]", cardShadowMd)}
      >
        <CardContent className="card-base flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-9 w-9 shrink-0 text-[#63a9df]" />
            <div>
              <h3 className="t-h4 font-bold text-[#3f3f3f]">
                Punya pengalaman di klinik kami?
              </h3>
              <p className="t-body text-[#3f3f3f]">
                Bagikan ulasan Anda di Google Maps
              </p>
            </div>
          </div>
          <Button
            className="h-12 rounded-full bg-[#8480f6] px-5 t-body text-white hover:bg-[#8480f6]/90"
            asChild
          >
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
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
  return (
    <main className="min-h-screen bg-[#f2f0ed] text-[#3f3f3f]">
      <Navbar />
      <AboutIntroSection />
      <GaleriSection />
      <RatingSection />
      <EmergencyCta />
      <Footer />
    </main>
  );
}
