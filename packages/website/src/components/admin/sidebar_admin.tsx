"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import {
  BarChart2,
  Building2,
  ChevronDown,
  ClipboardList,
  Clock,
  FileImage,
  FileText,
  Home,
  Image as ImageIcon,
  LineChart,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  ScrollText,
  Settings,
  ShieldCheck,
  Stethoscope,
  Tag,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAdmin, type CurrentAdmin } from "@/src/lib/api";

export type SidebarKey =
  | "dashboard"
  | "dokter"
  | "layanan"
  | "promo"
  | "galeri"
  | "staff"
  | "jam"
  | "media"
  | "review"
  | "artikel"
  | "pengunjung"
  | "sosmed"
  | "auditlog"
  | "kelola-admin"
  | "pengaturan";

// Key yang cuma boleh tampil untuk role superadmin (superadmin only:
// audit log & kelola akun admin — lihat middleware.AdminAuth/requireSuperadmin
// di backend, yang jadi penegak sesungguhnya; ini cuma soal UX sembunyikan menu).
const SUPERADMIN_ONLY_KEYS: SidebarKey[] = ["auditlog", "kelola-admin"];

type SidebarLink = {
  label: string;
  description: string;
  href: string;
  key: SidebarKey;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type SidebarGroup = {
  group: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  children: SidebarLink[];
};

type SidebarEntry = SidebarLink | SidebarGroup;

function isGroup(entry: SidebarEntry): entry is SidebarGroup {
  return "children" in entry;
}

const sidebarEntries: SidebarEntry[] = [
  {
    label: "Dashboard",
    description: "Ringkasan data",
    href: "/dashboard_admin",
    key: "dashboard",
    icon: Home,
  },
  {
    group: "Profil Klinik",
    description: "Dokter, tim, jam",
    icon: Building2,
    children: [
      {
        label: "Dokter",
        description: "Jadwal & profil",
        href: "/dokter_jadwal_admin",
        key: "dokter",
        icon: Stethoscope,
      },
      {
        label: "Tim",
        description: "Staff & jabatan",
        href: "/staff_admin",
        key: "staff",
        icon: UserRound,
      },
      {
        label: "Jam Operasional",
        description: "Jam buka klinik",
        href: "/jam_operasional_admin",
        key: "jam",
        icon: Clock,
      },
    ],
  },
  {
    group: "Konten & Promosi",
    description: "Layanan, promo, galeri, artikel",
    icon: Megaphone,
    children: [
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
        label: "Artikel",
        description: "Kelola artikel",
        href: "/artikel_admin",
        key: "artikel",
        icon: FileText,
      },
    ],
  },
  {
    label: "Media",
    description: "Library gambar",
    href: "/admin_media",
    key: "media",
    icon: FileImage,
  },
  {
    group: "Analitik",
    description: "Pengunjung, sosmed, review",
    icon: LineChart,
    children: [
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
        label: "Review",
        description: "Rating Google",
        href: "/admin_review_pesan",
        key: "review",
        icon: MessageCircle,
      },
      {
        label: "Audit Log",
        description: "Riwayat login & aktivitas admin",
        href: "/admin_audit_log",
        key: "auditlog",
        icon: ScrollText,
      },
    ],
  },
  {
    label: "Kelola Admin",
    description: "Akun & role admin",
    href: "/kelola_admin",
    key: "kelola-admin",
    icon: ShieldCheck,
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
  // Grup yang terbuka. Default: grup yang memuat halaman aktif ikut terbuka.
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    sidebarEntries
      .filter(isGroup)
      .filter((entry) =>
        entry.children.some((child) => child.key === activeKey),
      )
      .map((entry) => entry.group),
  );
  const router = useRouter();

  const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin>(null);
  useEffect(() => {
    let alive = true;
    getCurrentAdmin().then((admin) => {
      if (alive) setCurrentAdmin(admin);
    });
    return () => {
      alive = false;
    };
  }, []);

  const isSuperadmin = currentAdmin?.role === "superadmin";
  const displayUsername = currentAdmin?.username ?? "Admin";
  const displayRoleLabel = isSuperadmin ? "Super Admin" : currentAdmin?.role === "admin" ? "Admin" : "—";
  const displayInitial = (currentAdmin?.username?.[0] ?? "A").toUpperCase();
  // Sembunyikan menu superadmin-only untuk role admin biasa. Ini cuma UX —
  // penegak sesungguhnya ada di backend (requireSuperadmin), jadi tetap aman
  // walau seseorang paksa akses URL-nya langsung.
  const visibleEntries: SidebarEntry[] = sidebarEntries
    .map((entry) => {
      if (isGroup(entry)) {
        const children = entry.children.filter(
          (child) => isSuperadmin || !SUPERADMIN_ONLY_KEYS.includes(child.key),
        );
        return children.length > 0 ? { ...entry, children } : null;
      }
      return isSuperadmin || !SUPERADMIN_ONLY_KEYS.includes(entry.key) ? entry : null;
    })
    .filter((entry): entry is SidebarEntry => entry !== null);

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin_login_page");
    router.refresh();
  }

  function toggleGroup(name: string) {
    setOpenGroups((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  }

  function renderLink(item: SidebarLink, nested = false) {
    const isActive = activeKey != null && item.key === activeKey;
    const Icon = item.icon;
    const baseClassName = `group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 text-left text-sm transition-all duration-200 ease-out ${
      nested ? "py-2" : "py-2.5"
    } ${
      isActive
        ? "bg-linear-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/25"
        : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

    return (
      <Link
        key={item.key}
        href={item.href}
        className={baseClassName}
        aria-label={item.label}
        aria-current={isActive ? "page" : undefined}
        onClick={() => setMenuOpen(false)}
      >
        {/* Indikator aktif di sisi kiri */}
        {isActive && (
          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white/80" />
        )}
        <div className={`flex shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
          nested ? "h-7 w-7" : "h-8 w-8"
        } ${
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

  function renderGroup(entry: SidebarGroup) {
    const Icon = entry.icon;
    const isOpen = openGroups.includes(entry.group);
    const hasActive = entry.children.some((child) => child.key === activeKey);

    return (
      <div key={entry.group}>
        <button
          type="button"
          onClick={() => toggleGroup(entry.group)}
          aria-expanded={isOpen}
          className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ease-out ${
            hasActive && !isOpen
              ? "bg-sky-50 text-sky-700"
              : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
            hasActive && !isOpen
              ? "bg-sky-100 text-sky-600"
              : "bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600"
          }`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold leading-tight">
              {entry.group}
            </div>
            <div className="mt-0.5 max-w-full truncate text-[10px] leading-none text-slate-400">
              {entry.description}
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="mt-0.5 space-y-0.5 border-l border-slate-100 pl-2.5 ml-4">
            {entry.children.map((child) => renderLink(child, true))}
          </div>
        )}
      </div>
    );
  }

  function renderNav() {
    return (
      <div className="space-y-0.5">
        {visibleEntries.map((entry) =>
          isGroup(entry) ? renderGroup(entry) : renderLink(entry),
        )}
      </div>
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

      <aside className="hidden w-full flex-col border-b border-slate-200 bg-white lg:flex lg:w-55 lg:border-b-0 lg:border-r">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 bg-linear-to-r from-[#0D1B2A] to-[#13314f] px-5">
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
          {renderNav()}
        </div>
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-sky-600 to-cyan-500 text-xs font-bold text-white shadow-sm">
              {displayInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">{displayUsername}</p>
              <p className="text-[10px] text-slate-400">{displayRoleLabel}</p>
            </div>
            <button type="button" title="Logout" aria-label="Logout" onClick={handleLogout} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-500">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[85vw] max-w-70 flex-col overflow-hidden border-r border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 bg-linear-to-r from-[#0D1B2A] to-[#13314f] px-5">
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
          {renderNav()}
        </div>
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-xs font-bold text-white">
              {displayInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-900">{displayUsername}</p>
              <p className="text-[10px] text-slate-400">{displayRoleLabel}</p>
            </div>
            <button type="button" title="Logout" onClick={handleLogout} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-rose-500">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
