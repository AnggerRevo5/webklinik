"use client";

import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Copy,
  MapPin,
  Send,
  Siren,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useHomeData } from "@/src/lib/api";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Input } from "@/src/UiKecil/input";
import { Section, SectionHeader } from "@/src/UiKecil/section";
import { Separator } from "@/src/UiKecil/separator";
import { Textarea } from "@/src/UiKecil/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/src/UiKecil/toggle-group";
import {
  cn,
  formatOperationalHours,
  getSettingValue,
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
  name: string;
  role: string;
  schedule: string;
  time: string;
  gradient: string;
  avatarClassName: string;
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
const btnPrimary =
  "rounded-full bg-[#00b4d8] text-white hover:bg-[#00a3c5]";
const btnAccent =
  "rounded-full bg-[#e8861e] text-white hover:bg-[#d77a18]";
const btnSoft =
  "rounded-full bg-[#00b4d826] text-black hover:bg-[#00b4d833]";

/* Re-usable button height token (48px desktop, 44px mobile) */
const btnHeight = "h-11 lg:h-12";

/* ─── Section data ─── */

const heroStats: HeroStat[] = [
  { icon: Clock3, title: "24 jam", subtitle: "UGD & rawat inap" },
  { icon: Star, title: "4.8 / 5", subtitle: "Rating Google" },
  { icon: Star, title: "BPJS", subtitle: "Umum & BPJS" },
];

const layananCards: LayananItem[] = [
  { title: "HOME VISIT", image: "/assets/services/service1.png" },
  { title: "Pos KRS", image: "/assets/services/service2.png" },
  { title: "Home Care", image: "/assets/services/service3.png" },
  { title: "Siaga Ambulan 24/7", image: "/assets/services/service4.png" },
  { title: "Rawat inap", image: "/assets/services/service5.png" },
  { title: "Konsultasi Dokter", image: "/assets/services/service6.png" },
];

const doctorCards: DoctorItem[] = [
  {
    name: "dr. Ikhwan Rizki Rasyid Turino",
    role: "Dokter Umum",
    schedule: "Rabu - Jumat",
    time: "24 jam",
    gradient: "from-neutral-400 to-neutral-600",
    avatarClassName: "bg-[#84ff74]",
  },
  {
    name: "dr. Ikhwan Rizki Rasyid Turino",
    role: "Dokter Umum",
    schedule: "Rabu - Jumat",
    time: "24 jam",
    gradient: "from-green-400 to-green-800",
    avatarClassName: "bg-[#84ff74]",
  },
  {
    name: "dr. Ikhwan Rizki Rasyid Turino",
    role: "Dokter Umum",
    schedule: "Rabu - Jumat",
    time: "24 jam",
    gradient: "from-[#4200ff] to-[#280099]",
    avatarClassName: "bg-[#84ff74]",
  },
  {
    name: "dr. Ikhwan Rizki Rasyid Turino",
    role: "Dokter Umum",
    schedule: "Rabu - Jumat",
    time: "24 jam",
    gradient: "from-[#315b41] to-[#69c18a]",
    avatarClassName: "bg-[#84ff74]",
  },
];

const promoCards: PromoItem[] = [
  {
    title: "Promo Kemerdekaan 17-an",
    image: "/assets/promo/promo1.png",
    date: "1 - 31 Agustus",
    description:
      "Pemeriksaan kesehatan, konsultasi dokter serta berbagai layanan pilihan dengan harga terjangkau",
  },
  {
    title: "Promo Hari Raya",
    image: "/assets/promo/promo2.png",
    date: "1 - 31 Agustus",
    description:
      "Nikmati layanan pemeriksaan kesehatan agar kondisi prima saat hari kemenangan",
  },
  {
    title: "Promo Akhir Tahun",
    image: "/assets/promo/promo3.png",
    date: "1 - 31 Desember",
    description:
      "Promo bagi pasien setia kami dengan potongan harga untuk pemeriksaan kesehatan dan konsultasi dokter.",
  },
  {
    title: "Promo Hari Raya",
    image: "/assets/promo/promo2.png",
    date: "1 - 31 Agustus",
    description:
      "Nikmati layanan pemeriksaan kesehatan agar kondisi prima saat hari kemenangan",
  },
];

const articleTabs = [
  "Semua",
  "Tips kesehatan",
  "Edukasi",
  "Berita klinik",
  "Ibu & anak",
];

const featuredArticle: ArticleItem = {
  title: "Card title",
  image: "/assets/articles/article-featured.png",
  description:
    "Card desription. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit rhoncus imperdiet nisi.",
};

const articleCards: ArticleItem[] = [
  {
    title: "Card title",
    image: "/assets/articles/article1.png",
    description:
      "Card desription. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit rhoncus imperdiet nisi.",
  },
  {
    title: "Card title",
    image: "/assets/articles/article2.png",
    description:
      "Card desription. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit rhoncus imperdiet nisi.",
  },
  {
    title: "Card title",
    image: "/assets/articles/article3.png",
    description:
      "Card desription. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit rhoncus imperdiet nisi.",
  },
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
      <Image src={src} alt={alt} fill className="object-cover" priority={priority} />
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

/* Kartu promo tunggal yang dipakai di grid promo. */
function PromoCard({ promo }: { promo: PromoItem }) {
  return (
    <Card className={cn("w-full card-radius border-0 bg-white", cardShadowSoft)}>
      <CardContent className="card-base space-y-4">
        <CoverImage
          src={promo.image}
          alt={promo.title}
          roundedClass="card-radius-sm"
          priority
        />
        <h3 className="t-h3 font-bold text-[#3f3f3f]">{promo.title}</h3>
        <div className="inline-flex items-center gap-2 rounded-md bg-[#cce9ec] px-3 py-1">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span className="t-caption font-medium">{promo.date}</span>
        </div>
        <p className="t-body text-[#3f3f3f]">{promo.description}</p>
      </CardContent>
    </Card>
  );
}

/* Section promo. */
function PromoSection() {
  return (
    <Section id="promo">
      <SectionHeader label="PROMO" title="Penawaran khusus untuk Anda" />

      <div
        className="grid-cards md:grid-cols-2 xl:grid-cols-4"
      >
        {promoCards.map((promo, idx) => (
          <PromoCard key={`promo-${idx}`} promo={promo} />
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <div className="h-2 w-8 rounded-full bg-[#00b4d8]" />
        <div className="h-2 w-2 rounded-full bg-[#d9d9d9]" />
        <div className="h-2 w-2 rounded-full bg-[#d9d9d9]" />
        <div className="h-2 w-2 rounded-full bg-[#d9d9d9]" />
      </div>
    </Section>
  );
}

/* Section artikel. */
function ArtikelSection() {
  const [selectedArticleTab, setSelectedArticleTab] = React.useState("Semua");

  return (
    <Section id="artikel">
      <SectionHeader
        label="ARTIKEL"
        title={
          <>
            <span>Info kesehatan </span>
            <span className="italic text-[#00b4d8]">terkini</span>
          </>
        }
      />

      <div className="mb-8">
        <ToggleGroup
          type="single"
          value={selectedArticleTab}
          onValueChange={(value) => value && setSelectedArticleTab(value)}
          className="flex flex-wrap justify-start gap-2 md:gap-3"
        >
          {articleTabs.map((tab) => (
            <ToggleGroupItem
              key={tab}
              value={tab}
              className="h-10 rounded-full border border-black bg-[#f7f5f2] px-4 t-body-sm font-medium text-black data-[state=on]:border-transparent data-[state=on]:bg-[#837ff6] data-[state=on]:text-white"
            >
              {tab}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid-cards xl:grid-cols-[1.02fr_0.98fr]">
        <Card className={cn("card-radius border-0 bg-white", cardShadowMd)}>
          <CardContent className="card-base">
            <div className="rounded-[20px] bg-[#4200ff] p-3 md:p-4 xl:p-5">
              <CoverImage
                src={featuredArticle.image}
                alt={featuredArticle.title}
                aspectClass="aspect-[1.47]"
                roundedClass="rounded-[14px]"
              />
            </div>
            <div className="mt-6 max-w-[560px]">
              <h3 className="t-h3 font-semibold text-[#3f3f3f]">
                {featuredArticle.title}
              </h3>
              <p className="t-body mt-3 text-[#3f3f3f]">
                {featuredArticle.description}
              </p>
              <Button
                variant="link"
                className="mt-4 h-auto p-0 t-body font-semibold text-[#4200ff] no-underline"
              >
                See more
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid-cards">
          {articleCards.map((article) => (
            <Card
              key={article.image}
              className={cn("card-radius border-0 bg-white", cardShadowMd)}
            >
              <CardContent className="card-base flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="shrink-0 rounded-[18px] bg-[#4200ff] p-2.5 md:p-3">
                  <div className="relative h-[120px] w-full overflow-hidden rounded-[12px] sm:h-[140px] sm:w-[140px] md:h-[150px] md:w-[150px]">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="183px"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="t-h4 font-semibold text-[#3f3f3f]">
                    {article.title}
                  </h3>
                  <p className="t-body-sm mt-2 text-[#3f3f3f]">
                    {article.description}
                  </p>
                  <Button
                    variant="link"
                    className="mt-3 h-auto p-0 t-body font-semibold text-[#4200ff] no-underline"
                  >
                    See more
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* Section hubungi kami. */
function HubungiKamiSection() {
  const { data } = useHomeData();

  const clinicPhone = getSettingValue(
    data?.site_settings ?? [],
    ["phone", "whatsapp", "wa", "telepon"],
    CLINIC_PHONE,
  );
  const clinicAddress = getSettingValue(
    data?.site_settings ?? [],
    ["address", "alamat"],
    "Dsn. Krajan RT.013 RW.005, Desa Tirtomarto, Kec. Ampelgading, Kab. Malang, Jawa Timur 65183",
  );
  const hasOperationalHours = (data?.operational_hours?.length ?? 0) > 0;
  const operationalHoursData =
    hasOperationalHours && data
      ? formatOperationalHours(data.operational_hours)
      : [
          { label: "UGD & Rawat inap", value: "24 JAM", badge: true },
          { label: "Poli Umum", value: "24 JAM", badge: true },
          { label: "Poli Gigi (Rabu - Jumat)", value: "15.00 - 21.00", badge: false },
          { label: "Poli Gigi (Sabtu - Minggu)", value: "08.00 - 14.00", badge: false },
          { label: "Laboratorium", value: "07.00 - 21.00", badge: false },
          { label: "Apotek", value: "07.00 - 21.00", badge: false },
        ];
  const hasSocialLinks = (data?.social_links?.length ?? 0) > 0;
  const socialLinkItems =
    hasSocialLinks && data
      ? data.social_links.map((item) => ({ label: item.label, href: item.url }))
      : socialCards;

  const whatsappNumber = normalizePhoneNumber(clinicPhone).replace(/^0/, "62");
  const whatsappUrl = `https://wa.me/${whatsappNumber || "6281225566055"}`;

  return (
    <Section id="hubungi">
      <SectionHeader
        label="HUBUNGI KAMI"
        title={
          <>
            <span>Ada yang bisa kami </span>
            <span className="italic text-[#00b4d8]">bantu?</span>
          </>
        }
        subtitle="Kami siap melayani Anda 24 jam setiap hari"
        align="center"
      />

      <div className="grid gap-8 xl:grid-cols-2" style={{ gap: "var(--gap-cards)" }}>
        <div className="space-y-5">
          <div className="card-radius bg-[#1f842652] p-6 shadow-[inset_0px_4px_4px_#0000001a] md:p-8">
            <div className="flex h-[250px] items-center justify-center card-radius-sm bg-[#bfd6b6] text-center text-4xl font-medium text-black sm:text-[64px]">
              GOOGLE MAPS
            </div>
          </div>

          <Card className={cn("card-radius border-0 bg-white", cardShadowMd)}>
            <CardContent className="card-base flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-[60px] w-12 items-center justify-center card-radius-sm bg-[#d9d9d9] md:w-[60px]">
                  <MapPin className="h-7 w-7 text-[#3f3f3f]" />
                </div>
                <div>
                  <div className="t-body-sm text-[#3f3f3f]">Alamat</div>
                  <div className="t-body mt-1 font-bold text-[#3f3f3f]">
                    {clinicAddress}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="h-auto rounded-full bg-[#d9d9d9] p-3 hover:bg-[#d0d0d0]"
                aria-label="Salin alamat"
              >
                <Copy className="h-4 w-4 text-black" />
              </Button>
            </CardContent>
          </Card>

          <Card className={cn("card-radius border-0 bg-white", cardShadowMd)}>
            <CardContent className="card-base flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-[60px] w-12 items-center justify-center card-radius-sm bg-[#d9d9d9] md:w-[60px]">
                  <AssetIcon src={ASSETS.icons.whatsapp} alt="WhatsApp" size={28} />
                </div>
                <div>
                  <div className="t-body-sm text-[#3f3f3f]">Whatsapp</div>
                  <div className="t-h3 mt-1 font-bold text-[#3f3f3f]">
                    {clinicPhone}
                  </div>
                  <div className="t-body-sm mt-1 text-[#3f3f3f]">
                    Chat langsung dengan kami
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="h-auto rounded-full bg-[#d9d9d9] p-3 hover:bg-[#d0d0d0]"
                asChild
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Buka WhatsApp"
                >
                  <ChevronRight className="h-5 w-5 text-black" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className={cn("card-radius border-0 bg-white", cardShadowMd)}>
            <CardContent className="card-base flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-[60px] w-12 items-center justify-center card-radius-sm bg-[#d9d9d9] md:w-[60px]">
                  <AssetIcon src={ASSETS.icons.phone} alt="Telepon" size={28} />
                </div>
                <div>
                  <div className="t-body-sm text-[#3f3f3f]">Telepone</div>
                  <div className="t-h3 mt-1 font-bold text-[#3f3f3f]">
                    {clinicPhone}
                  </div>
                  <div className="t-body-sm mt-1 text-[#3f3f3f]">
                    Tersedia 24 jam untuk keadaan darurat
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="h-auto rounded-full bg-[#d9d9d9] p-3 hover:bg-[#d0d0d0]"
                asChild
              >
                <a
                  href={`tel:${normalizePhoneNumber(clinicPhone)}`}
                  aria-label="Telepon klinik"
                >
                  <ChevronRight className="h-5 w-5 text-black" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="grid-cards grid-cols-2 sm:grid-cols-4">
            {socialLinkItems.map((item) => (
              <Card
                key={item.label}
                className={cn("card-radius border-0 bg-white", cardShadowMd)}
              >
                <CardContent className="card-base flex flex-col items-center justify-center gap-3">
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="transition-transform hover:scale-105"
                    aria-label={item.label}
                  >
                    <AssetIcon
                      src={
                        socialIconMap[item.label.toLowerCase()] ??
                        ASSETS.icons.whatsapp
                      }
                      alt={item.label}
                      size={40}
                    />
                  </a>
                  <div className="t-body text-center font-bold text-[#3f3f3f]">
                    {item.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card-radius bg-[#e7e7e752] p-6 shadow-[inset_0px_4px_4px_#0000001a]">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-[190px_1fr]">
                <Input
                  placeholder="Nama lengkap"
                  className="h-12 rounded-full border-black bg-[#f7f5f2] px-5 t-body placeholder:text-[#b3b3b3]"
                />
                <Input
                  placeholder="Contoh: 08123456789"
                  className="h-12 rounded-full border-black bg-[#f7f5f2] px-5 t-body placeholder:text-[#b3b3b3]"
                />
              </div>
              <Input
                placeholder="Alamat email (opsional)"
                className="h-12 rounded-full border-black bg-[#f7f5f2] px-5 t-body placeholder:text-[#b3b3b3]"
              />
              <Input
                placeholder="Nama Sesuai KTP"
                className="h-12 rounded-full border-black bg-[#f7f5f2] px-5 t-body placeholder:text-[#b3b3b3]"
              />
              <Textarea
                placeholder="Alamat Lengkap"
                className="min-h-[160px] rounded-[24px] border-black bg-[#f7f5f2] px-5 py-4 t-body placeholder:text-[#b3b3b3]"
              />
              <Button
                type="submit"
                className={cn(
                  btnPrimary,
                  "h-12 w-full t-body font-medium shadow-[0px_4px_33px_6px_#4a445d29]",
                )}
              >
                <Send className="mr-2 h-5 w-5" />
                Kirim Pesan
              </Button>
            </form>
          </div>

          <Card className={cn("card-radius border-0 bg-white", cardShadowMd)}>
            <CardContent className="card-base">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center card-radius-sm border-2 border-[#00b4d8] bg-[#e8f7fb]">
                  <Clock3 className="h-7 w-7 text-[#00b4d8]" />
                </div>
                <h3 className="t-h3 font-bold text-[#3f3f3f]">Jam operasional</h3>
              </div>
              <div>
                {operationalHoursData.map((item, index) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between gap-4 py-3">
                      <div className="t-body text-[#3f3f3f]">{item.label}</div>
                      {item.badge ? (
                        <div className="rounded-[16px] bg-[#d9d9d9] px-3 py-1 t-caption font-semibold uppercase tracking-wide text-black">
                          {item.value}
                        </div>
                      ) : (
                        <div className="t-body font-medium text-[#3f3f3f]">
                          {item.value}
                        </div>
                      )}
                    </div>
                    {index < operationalHoursData.length - 1 ? (
                      <Separator className="bg-[#e8e8e8]" />
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            <div className="t-h4 font-bold text-white">Butuh bantuan segera?</div>
            <div className="t-body mt-1 text-white">UGD kami buka 24 jam</div>
            <div className="t-body text-white">hubungi kami</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            className={cn(btnHeight, "rounded-full bg-[#008000] px-6 t-body text-white hover:bg-[#067006]")}
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
function LayananSection() {
  return (
    <Section id="layanan" bg="bg-[#d9d9d9]">
      <div className="grid gap-8 lg:grid-cols-[355px_1fr] lg:items-start">
        <div>
          <SectionHeader
            label="LAYANAN KAMI"
            title="Layanan Kami"
            subtitle="Kami berkomitmen memberikan layanan dan fasilitas kesehatan dengan sepenuh hati"
          />
        </div>

        <div className="grid-cards md:grid-cols-3">
          {layananCards.slice(0, 3).map((layanan) => (
            <Card
              key={layanan.title}
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
          ))}
        </div>
      </div>

      <div
        className="mt-6 grid lg:grid-cols-[355px_1fr]"
        style={{ gap: "var(--gap-cards)" }}
      >
        <div />
        <div className="grid-cards md:grid-cols-3">
          {layananCards.slice(3).map((layanan) => (
            <Card
              key={layanan.title}
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
          ))}
        </div>
      </div>
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
  return (
    <Section id="dokter">
      <SectionHeader label="DOKTER KAMI" title="Dokter Kami" />

      <div className="grid-cards lg:grid-cols-2">
        {doctorCards.map((doctor, idx) => (
          <Card
            key={`doctor-${idx}`}
            className={cn(
              "overflow-hidden card-radius border-0 bg-white",
              cardShadowMd,
            )}
          >
            <div
              className={cn(
                "h-[112px] bg-gradient-to-r lg:h-[120px]",
                doctor.gradient,
              )}
            />
            <CardContent className="card-base flex flex-col items-center text-center">
              <div
                className={cn(
                  "relative -mt-16 mb-4 h-[88px] w-[88px] overflow-hidden rounded-full border-4 border-white shadow-md",
                  doctor.avatarClassName,
                )}
              >
                <div className="absolute inset-0 rounded-full bg-[#84ff74]" />
              </div>
              <h3 className="t-h3 font-medium leading-tight text-[#3f3f3f]">
                {doctor.name}
              </h3>
              <p className="t-body mt-2 font-medium text-[#3f3f3f]">
                {doctor.role}
              </p>
              <div className="t-body-sm mt-3 flex items-center gap-2 text-[#3f3f3f]">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span className="font-medium">{doctor.schedule}</span>
              </div>
              <div className="t-body-sm mt-1.5 flex items-center gap-2 text-[#757575]">
                <Clock3 className="h-4 w-4 shrink-0" />
                <span className="font-medium">{doctor.time}</span>
              </div>
              <Button
                variant="outline"
                className={cn(
                  btnHeight,
                  "mt-4 rounded-full border-[#4200ff] px-6 t-body-sm font-medium text-[#4200ff] hover:bg-[#4200ff]/5",
                )}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* Hero utama. */
function HeroSection() {
  return (
    <Section id="beranda">
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
            {heroStats.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className={cn("card-radius border-0 bg-white", cardShadowSoft)}
                >
                  <CardContent className="card-base flex flex-col items-center gap-2 text-center">
                    <Icon className="h-8 w-8 text-[#00b4d8] lg:h-10 lg:w-10" />
                    <div className="t-h3 font-bold text-[#3f3f3f]">
                      {item.title}
                    </div>
                    <div className="t-caption text-[#00b4d8]">{item.subtitle}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap gap-3 lg:gap-4">
            <Button className={cn(btnPrimary, btnHeight, "px-6 t-body-sm")} asChild>
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
              className={cn(btnSoft, btnHeight, "px-6 t-body-sm text-[#5f6f7a]")}
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
                src={ASSETS.hero}
                alt="Klinik Ampelgading Medical Centre"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 736px"
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
  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#3f3f3f]">
      <Navbar />
      <HeroSection />
      <LayananSection />
      <WhatsappBanner />
      <DokterSection />
      <PromoSection />
      <ArtikelSection />
      <HubungiKamiSection />
      <EmergencyCta />
      <Footer />
    </main>
  );
}
