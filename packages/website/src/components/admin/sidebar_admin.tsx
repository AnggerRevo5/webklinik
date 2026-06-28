"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  BarChart2,
  ClipboardList,
  FileImage,
  FileText,
  Home,
  Image as ImageIcon,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Stethoscope,
  Tag,
  Users,
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
  | "artikel"
  | "pengunjung"
  | "sosmed"
  | "pengaturan";

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
  {
    label: "Pengunjung",
    description: "Laporan sesi",
    href: "/admin_laporan_pengunjung",
    key: "pengunjung",
    icon: Users,
  },
  {
    label: "Sosmed",
    description: "Snapshot & GBP",
    href: "/admin_sosmed_snapshot",
    key: "sosmed",
    icon: BarChart2,
  },
  {
    label: "Pengaturan",
    description: "Konten & kontak",
    href: "/admin_pengaturan",
    key: "pengaturan",
    icon: Settings,
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
    const baseClassName = `group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ease-out ${
      isActive
        ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/25"
        : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

    return (
      <Link
        key={`${item.label}-${index}`}
        href={item.href ?? "#"}
        className={baseClassName}
        aria-label={item.label}
        onClick={() => setMenuOpen(false)}
      >
        {/* Indikator aktif di sisi kiri */}
        {isActive && (
          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/80" />
        )}
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
          isActive ? "bg-white/20" : "bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600"
        }`}>
          <Icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold leading-tight">
            {item.label}
          </div>
          <div className={`mt-0.5 max-w-full truncate text-[10px] leading-none ${isActive ? "text-white/75" : "text-slate-400"}`}>
            {item.description}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <>
      <header className="flex w-full items-center justify-between border-b border-white/10 bg-[#0D1B2A] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <img src="/assets/logo/LOGO.svg" alt="Logo admin" className="h-8 w-8 shrink-0" />
          <div>
            <p className="text-sm font-semibold leading-tight text-white">KRI AMC</p>
            <p className="mt-0.5 text-[10px] leading-none text-white/50">Admin Panel</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Tutup menu admin" : "Buka menu admin"}
          aria-expanded={menuOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100 transition-all duration-200 hover:bg-white/10"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity duration-300 lg:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside className="hidden w-full flex-col border-b border-slate-200 bg-white lg:flex lg:w-[220px] lg:border-b-0 lg:border-r">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-[#0D1B2A] to-[#13314f] px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <img src="/assets/logo/LOGO.svg" alt="KRI AMC" className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-white">KRI AMC</p>
            <p className="mt-0.5 text-[10px] leading-none text-sky-200/70">Admin Panel</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Menu</p>
          <div className="space-y-0.5">{sidebarItems.map((item, index) => renderItem(item, index))}</div>
        </div>
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-cyan-500 text-xs font-bold text-white shadow-sm">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">Admin</p>
              <p className="text-[10px] text-slate-400">Super Admin</p>
            </div>
            <Link href="/admin_login_page" title="Logout" aria-label="Logout" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500">
              <LogOut className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[85vw] max-w-[280px] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-[#0D1B2A] to-[#13314f] px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <img src="/assets/logo/LOGO.svg" alt="KRI AMC" className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight text-white">KRI AMC</p>
            <p className="mt-0.5 text-[10px] leading-none text-sky-200/70">Admin Panel</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Menu</p>
          <div className="space-y-0.5">{sidebarItems.map((item, index) => renderItem(item, index))}</div>
        </div>
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-xs font-bold text-white">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-900">Admin</p>
              <p className="text-[10px] text-slate-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
