"use client";

import { MapPin, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/src/UiKecil/button";
import { Separator } from "@/src/UiKecil/separator";
import { cn } from "@/src/lib/utils";

const WHATSAPP_URL = "https://wa.me/6281225566055";

const ASSETS = {
  logo: "/assets/logo/LOGO.svg",
  icons: {
    whatsapp: "/assets/icons/whatsapp.svg",
    instagram: "/assets/icons/instagram.svg",
  },
} as const;

const btnPrimary = "rounded-full bg-[#00b4d8] text-white hover:bg-[#00a3c5]";
const btnAccent = "rounded-full bg-[#e8861e] text-white hover:bg-[#d77a18]";
const btnSoft = "rounded-full bg-[#00b4d826] text-black hover:bg-[#00b4d833]";

const navItems = [
  { label: "Beranda", href: "/#beranda", isSection: true, id: "beranda" },
  { label: "Layanan", href: "/#layanan", isSection: true, id: "layanan" },
  { label: "Dokter", href: "/#dokter", isSection: true, id: "dokter" },
  { label: "Promo", href: "/#promo", isSection: true, id: "promo" },
  { label: "Artikel", href: "/#artikel", isSection: true, id: "artikel" },
  { label: "Tentang Kami", href: "/tentangkami", isSection: false },
];

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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (hash && pathname === "/") {
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          50,
        );
      }
    }
  }, [pathname]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleSectionClick(
    e: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>,
    id?: string,
  ) {
    if (!id) return;
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        router.push(`/#${id}`);
      }
    }
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden border-b bg-white lg:block">
        <div className="section-container flex flex-wrap items-center justify-between gap-3 py-2">
          <Button
            variant="secondary"
            className={cn(btnSoft, "h-9 px-4 t-body-sm")}
          >
            <MapPin className="mr-2 h-4 w-4 shrink-0" />
            Lokasi klinik
          </Button>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              className={cn(btnSoft, "h-9 px-4 t-body-sm")}
              asChild
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <AssetIcon
                  src={ASSETS.icons.whatsapp}
                  alt="WhatsApp"
                  size={16}
                  className="mr-2"
                />
                Whatsapp
              </a>
            </Button>
            <span className="hidden t-body-sm text-black sm:inline">
              Ikuti kami di:
            </span>
            <Separator
              orientation="vertical"
              className="hidden h-8 bg-black/20 sm:block"
            />
            <a
              href="#"
              aria-label="Instagram"
              className="transition-opacity hover:opacity-80"
            >
              <AssetIcon
                src={ASSETS.icons.instagram}
                alt="Instagram"
                size={24}
              />
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-out",
          scrolled
            ? "bg-transparent shadow-none backdrop-blur-md"
            : "bg-[#1a9ec9] shadow-[0_8px_24px_rgba(15,23,42,0.18)]",
        )}
      >
        <div
          className={cn(
            "section-container flex h-[64px] items-center justify-between gap-3 lg:h-[72px]",
          )}
        >
          <Link href="/" className="flex items-center gap-3">
            <div
              className={cn(
                "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm transition-all duration-300 lg:h-14 lg:w-14",
              )}
            >
              <Image
                src={ASSETS.logo}
                alt="Logo Ampelgading Medical Centre"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div>
              <div
                className={cn(
                  "t-caption transition-colors duration-300",
                  scrolled ? "text-[#3f3f3f]" : "text-white",
                )}
              >
                Ampelgading
              </div>
              <div
                className={cn(
                  "t-h4 font-bold leading-tight transition-colors duration-300",
                  scrolled ? "text-[#3f3f3f]" : "text-white",
                )}
              >
                Medical Centre
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "t-body-sm font-bold transition-all duration-300 hover:opacity-80",
                  scrolled ? "text-[#3f3f3f]" : "text-white",
                )}
                onClick={(e) =>
                  item.isSection && handleSectionClick(e as any, item.id)
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button className={cn(btnPrimary, "h-11 px-5 t-body-sm")} asChild>
              <Link href="/pendaftaran_online_1">Daftar Online</Link>
            </Button>
            <Button className={cn(btnAccent, "h-11 px-5 t-body-sm")}>
              Sign up/in
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button className={cn(btnPrimary, "h-11 px-4 t-body-sm")} asChild>
              <Link href="/pendaftaran_online_1">Daftar Online</Link>
            </Button>
            <button
              type="button"
              aria-label="Buka menu"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[60] bg-[#0D1B2A] transition-transform duration-300 lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col px-8 pb-8 pt-20">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMenuOpen(false)}
            className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white"
          >
            <X className="h-6 w-6" />
          </button>

          <nav className="flex flex-col gap-6">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (item.isSection) handleSectionClick(e as any, item.id);
                  setMenuOpen(false);
                }}
                className="translate-y-2 t-h2 font-semibold text-white opacity-0 transition-all duration-300"
                style={{
                  transitionDelay: menuOpen ? `${index * 50}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(8px)",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 grid gap-3">
            <Button
              className={cn(btnPrimary, "h-12 justify-start px-5 t-body")}
              asChild
            >
              <Link
                href="/pendaftaran_online_1"
                onClick={() => setMenuOpen(false)}
              >
                Daftar Online <span className="ml-2">→</span>
              </Link>
            </Button>
            <Button
              className={cn(
                btnSoft,
                "h-12 justify-start px-5 t-body text-white",
              )}
              asChild
            >
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>

          <div className="mt-auto t-body text-slate-300">0812-2556-6055</div>
        </div>
      </div>
    </header>
  );
}
