"use client";

import { Clock3, MapPin, Siren } from "lucide-react";
import Image from "next/image";
import { useHomeData } from "@/src/lib/api";
import {
  cn,
  formatOperationalHours,
  getSettingValue,
} from "@/src/lib/utils";

const ASSETS = {
  logo: "/assets/logo/LOGO.svg",
  icons: {
    whatsapp: "/assets/icons/whatsapp.svg",
    phone: "/assets/icons/phone.svg",
    instagram: "/assets/icons/instagram.svg",
    facebook: "/assets/icons/facebook.svg",
  },
} as const;

const footerNav = [
  "Beranda",
  "Tentang kami",
  "Layanan",
  "Dokter",
  "Galeri",
  "Artikel",
  "Hubungi kami",
];

const footerServices = [
  "UGD 24 Jam",
  "Rawat inap",
  "Poli umum",
  "Poli gigi",
  "Persalinan",
  "Laboratorium",
  "SIAP DOK",
  "HomeVisit",
];

const fallbackAddress =
  "Dsn. Krajan RT.013 RW.005, Desa Tirtomarto, Kec. Ampelgading, Kab. Malang, Jawa Timur 65183";

const socialIconMap: Record<string, string> = {
  instagram: ASSETS.icons.instagram,
  facebook: ASSETS.icons.facebook,
  whatsapp: ASSETS.icons.whatsapp,
};

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

export default function Footer() {
  const { data } = useHomeData();

  const clinicPhone = getSettingValue(
    data?.site_settings ?? [],
    ["phone", "whatsapp", "wa", "telepon"],
    "",
  );
  const clinicAddress = getSettingValue(
    data?.site_settings ?? [],
    ["address", "alamat"],
    "",
  );
  const operationalHoursData = data?.operational_hours ?? [];
  const operationalHours =
    operationalHoursData.length > 0
      ? formatOperationalHours(operationalHoursData)
      : [];
  const socialLinksData = data?.social_links ?? [];
  const socialLinks = socialLinksData;

  return (
    <footer className="bg-white">
      <div className="section-wrap">
        <div
          className="grid md:grid-cols-2 xl:grid-cols-[1.2fr_0.6fr_0.6fr_0.8fr]"
          style={{ gap: "var(--gap-cards)" }}
        >
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f2f2f2] md:h-[110px] md:w-[110px]">
                <Image
                  src={ASSETS.logo}
                  alt="Logo klinik"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div className="max-w-[300px] t-body-lg leading-snug">
                <span className="text-[#808080]">Klinik Rawat Inap </span>
                <span className="text-[#e8861e]">
                  Ampelgading Medical Centre
                </span>
              </div>
            </div>
            <p className="max-w-[347px] t-body text-[#808080]">
              Klinik rawat inap yang melayani dengan sepnuh hati untuk masyarakt
              Ampelgading dan sekitarnya sejak 2011
            </p>
            <p className="mt-4 t-body text-[#808080]">
              PT. Banar Medika Mandiri
            </p>
            <p className="t-body-sm text-[#808080]/70">
              NIB: 0220106452414
              <br />
              Izin: 503/IOK.35.07.122/2021
            </p>
            <div className="mt-6 flex max-w-[406px] flex-wrap items-center justify-between gap-3 card-radius-sm bg-[#00b4d8] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Siren className="h-5 w-5 text-[#e03c31]" />
                </div>
                <span className="t-body-lg font-medium text-[#e03c31]">
                  UGD 24 JAM
                </span>
              </div>
              <span className="t-body-lg font-medium text-white">
                {clinicPhone || "Data kontak belum tersedia"}
              </span>
            </div>
          </div>

          <div>
            <h2 className="mb-4 t-h4 font-bold text-[#e8861e]">Navigasi</h2>
            <ul className="space-y-2">
              {footerNav.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#808080]" />
                  <button
                    type="button"
                    className="t-body text-left font-medium text-[#808080] transition-colors hover:text-[#00b4d8]"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 t-h4 font-bold text-[#e8861e]">Layanan</h2>
            <ul className="space-y-2">
              {footerServices.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#808080]" />
                  <button
                    type="button"
                    className="t-body text-left font-medium text-[#808080] transition-colors hover:text-[#00b4d8]"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 t-h4 font-bold text-[#e8861e]">Kontak</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="rounded-[10px] bg-white p-2 shadow-sm ring-1 ring-black/5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="t-h4 font-medium text-[#00b4d8]">Alamat</h3>
                  <p className="mt-1 t-body text-[#808080]">
                    {clinicAddress || "Data alamat belum tersedia di database"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-[10px] bg-white p-2 shadow-sm ring-1 ring-black/5">
                  <AssetIcon src={ASSETS.icons.phone} alt="Telepon" size={20} />
                </div>
                <div>
                  <h3 className="t-h4 font-medium text-[#00b4d8]">
                    Telepone / WA
                  </h3>
                  <p className="mt-1 t-body text-[#808080]">
                    {clinicPhone || "Data telepon belum tersedia di database"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-[10px] bg-white p-2 shadow-sm ring-1 ring-black/5">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="t-h4 font-medium text-[#00b4d8]">
                    Jam operasional
                  </h3>
                  <div className="mt-1 space-y-1 t-body text-[#808080]">
                    {operationalHours.length > 0 ? (
                      operationalHours.slice(0, 2).map((item) => (
                        <p key={item.label}>
                          {item.label}: {item.value}
                        </p>
                      ))
                    ) : (
                      <p>Data jam operasional belum tersedia di database</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                {socialLinks.length > 0 ? socialLinks.map((item) => {
                  const icon =
                    socialIconMap[item.label.toLowerCase()] ??
                    ASSETS.icons.whatsapp;

                  return (
                    <a
                      key={item.label}
                      href={item.url}
                      target={
                        item.url.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.url.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={item.label}
                      className="transition-opacity hover:opacity-80"
                    >
                      <AssetIcon src={icon} alt={item.label} size={28} />
                    </a>
                  );
                }) : <p className="t-body text-[#808080]">Data sosial media belum tersedia di database</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
