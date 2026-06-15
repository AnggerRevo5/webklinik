"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  CalendarDays,
  ClipboardList,
  FileImage,
  FileText,
  Home,
  Image as ImageIcon,
  Menu,
  MessageCircle,
  Stethoscope,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";

export type SidebarKey =
  | "dashboard"
  | "dokter"
  | "layanan"
  | "promo"
  | "galeri"
  | "media"
  | "review"
  | "artikel";

type SidebarItem = {
  label: string;
  description: string;
  href?: string;
  key?: SidebarKey;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    description: "Ringkasan data",
    href: "/dashboard_admin",
    key: "dashboard",
    icon: Home,
  },
  {
    label: "Dokter",
    description: "Jadwal & profil",
    href: "/dokter_jadwal_admin",
    key: "dokter",
    icon: Stethoscope,
  },
  {
    label: "Layanan",
    description: "CRUD layanan",
    href: "/admin_layanan_crud",
    key: "layanan",
    icon: ClipboardList,
  },
  {
    label: "Promo",
    description: "Kelola promo",
    href: "/admin_promo_page",
    key: "promo",
    icon: Tag,
  },
  {
    label: "Galeri",
    description: "Foto & artikel",
    href: "/galeri-artikel_admin",
    key: "galeri",
    icon: ImageIcon,
  },
  {
    label: "Media",
    description: "Library gambar",
    href: "/admin_media",
    key: "media",
    icon: FileImage,
  },
  {
    label: "Review",
    description: "Rating Google",
    href: "/admin_review_pesan",
    key: "review",
    icon: MessageCircle,
  },
  {
    label: "Artikel",
    description: "Kelola artikel",
    href: "/artikel_admin",
    key: "artikel",
    icon: FileText,
  },
];

export default function SidebarAdmin({
  activeKey,
}: {
  activeKey?: SidebarKey;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  function renderItem(item: SidebarItem, index: number) {
    const isActive = activeKey != null && item.key === activeKey;
    const Icon = item.icon;
    const baseClassName = `group flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left text-sm transition-all duration-300 ease-out ${
      isActive
        ? "bg-sky-600 text-white shadow-[0_18px_40px_rgba(14,165,233,0.18)] border-sky-500/50"
        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
    }`;

    return (
      <Link
        key={`${item.label}-${index}`}
        href={item.href ?? "#"}
        className={baseClassName}
        aria-label={item.label}
        onClick={() => setMenuOpen(false)}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 shadow-sm transition-all duration-300 group-hover:bg-slate-200">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold leading-tight">
            {item.label}
          </div>
          <div className={`mt-0.5 max-w-full truncate text-[10px] leading-none ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`}>
            {item.description}
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 group-hover:bg-slate-200">
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>
    );
  }

  return (
    <>
      <header className="flex w-full items-center justify-between border-b border-white/10 bg-[#0D1B2A] px-3 py-3 lg:hidden">
        <div className="flex h-11 min-w-[72px] items-center justify-center rounded-2xl border border-[#E8861E] bg-gradient-to-br from-sky-600 to-sky-800 px-3 text-[10px] font-bold tracking-[0.2em] text-[#E8861E] shadow-sm">
          <img
            src="/assets/logo/LOGO.svg"
            alt="Logo admin"
            className="h-8 w-8"
          />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Tutup menu admin" : "Buka menu admin"}
          aria-expanded={menuOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition-all duration-300 hover:bg-white/10"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity duration-300 lg:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside className="hidden w-full flex-col gap-5 overflow-y-auto border-b border-slate-200 bg-white p-4 lg:flex lg:w-[220px] lg:border-b-0 lg:border-r lg:p-5">
        <div className="flex justify-center">
          <img
            src="/assets/logo/LOGO.svg"
            alt="Logo admin"
            className="h-10 w-10"
          />
        </div>
        <div className="space-y-4">{sidebarItems.map((item, index) => renderItem(item, index))}</div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[85vw] max-w-[280px] flex-col gap-5 overflow-y-auto border-r border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!menuOpen}
      >
        <div className="flex justify-center">
          <img
            src="/assets/logo/LOGO.svg"
            alt="Logo admin"
            className="h-10 w-10"
          />
        </div>
        <div className="space-y-4">{sidebarItems.map((item, index) => renderItem(item, index))}</div>
      </aside>
    </>
  );
}
