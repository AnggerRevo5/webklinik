"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export type SidebarKey =
  | "dashboard"
  | "dokter"
  | "layanan"
  | "promo"
  | "galeri"
  | "review";

type SidebarItem = {
  label: string;
  description: string;
  href?: string;
  key?: SidebarKey;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    description: "Ringkasan data",
    href: "/dashboard_admin",
    key: "dashboard",
  },
  {
    label: "Dokter",
    description: "Jadwal & profil",
    href: "/dokter_jadwal_admin",
    key: "dokter",
  },
  {
    label: "Layanan",
    description: "CRUD layanan",
    href: "/admin_layanan_crud",
    key: "layanan",
  },
  {
    label: "Promo",
    description: "Kelola promo",
    href: "/admin_promo_page",
    key: "promo",
  },
  {
    label: "Galeri",
    description: "Foto & artikel",
    href: "/galeri-artikel_admin",
    key: "galeri",
  },
  {
    label: "Review",
    description: "Rating Google",
    href: "/admin_review_pesan",
    key: "review",
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
    const baseClassName = `group flex min-w-[136px] items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left transition-all duration-300 ease-out ${
      isActive
        ? "bg-sky-600 text-white shadow-[0_8px_24px_rgba(14,165,233,0.25)]"
        : "bg-white/0 text-slate-400 hover:bg-white/8 hover:text-slate-100"
    }`;

    const content = (
      <>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold leading-none">
            {item.label}
          </div>
          <div
            className={`mt-1 text-[8px] leading-none ${isActive ? "text-white/75" : "text-slate-500 group-hover:text-slate-300"}`}
          >
            {item.description}
          </div>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[8px] font-semibold ${isActive ? "bg-white/15 text-white" : "bg-white/5 text-slate-400"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </>
    );

    if (item.href) {
      return (
        <Link
          key={`${item.label}-${index}`}
          href={item.href}
          className={baseClassName}
          aria-label={item.label}
          onClick={() => setMenuOpen(false)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={`${item.label}-${index}`}
        type="button"
        className={baseClassName}
      >
        {content}
      </button>
    );
  }

  return (
    <>
      <header className="flex w-full items-center justify-between border-b border-white/10 bg-[#0D1B2A] px-3 py-3 lg:hidden">
        <div className="flex h-11 min-w-[72px] items-center justify-center rounded-2xl border border-[#E8861E] bg-gradient-to-br from-sky-600 to-sky-800 px-3 text-[10px] font-bold tracking-[0.2em] text-[#E8861E] shadow-sm">
          AMC
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

      <aside className="hidden w-full flex-row items-stretch gap-2 overflow-x-auto border-b border-white/10 bg-[#0D1B2A] p-3 lg:flex lg:w-[240px] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-4">
        <div className="flex h-11 min-w-[72px] items-center justify-center rounded-2xl border border-[#E8861E] bg-gradient-to-br from-sky-600 to-sky-800 px-3 text-[10px] font-bold tracking-[0.2em] text-[#E8861E] shadow-sm lg:mb-3 lg:h-14 lg:w-full lg:min-w-0 lg:px-4">
          AMC
        </div>
        {sidebarItems.map((item, index) => renderItem(item, index))}
        <div className="my-1 hidden h-px w-full bg-slate-800 lg:block" />
        <div className="mt-auto hidden h-8 w-8 items-center justify-center rounded-[10px] bg-sky-600 text-[10px] font-semibold text-white lg:flex">
          A
        </div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[88vw] max-w-[320px] flex-col gap-2 overflow-y-auto border-r border-white/10 bg-[#0D1B2A] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-11 min-w-[72px] items-center justify-center rounded-2xl border border-[#E8861E] bg-gradient-to-br from-sky-600 to-sky-800 px-3 text-[10px] font-bold tracking-[0.2em] text-[#E8861E] shadow-sm lg:mb-3 lg:h-14 lg:w-full lg:min-w-0 lg:px-4">
          AMC
        </div>
        {sidebarItems.map((item, index) => renderItem(item, index))}
        <div className="my-1 h-px w-full bg-slate-800" />
        <div className="mt-auto hidden h-8 w-8 items-center justify-center rounded-[10px] bg-sky-600 text-[10px] font-semibold text-white lg:flex">
          A
        </div>
      </aside>
    </>
  );
}
