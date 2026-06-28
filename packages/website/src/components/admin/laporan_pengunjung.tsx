"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Globe,
  Monitor,
  Smartphone,
  Users,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import { AdminHeader } from "@/src/UiKecil/admin_ui";
import {
  adminGetVisitorStats,
  adminGetVisitorSessions,
  type VisitorStats,
  type VisitorSessionItem,
  type MediaPagination,
} from "@/src/lib/api";

const SOURCE_OPTIONS = [
  "direct",
  "google",
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "referral",
];

function formatDuration(seconds: number): string {
  if (!seconds) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}d`;
  return `${m}m ${s}d`;
}

function formatDatetime(iso: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function LaporanPengunjung() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [sessions, setSessions] = useState<VisitorSessionItem[]>([]);
  const [pagination, setPagination] = useState<MediaPagination>({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filterDevice, setFilterDevice] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterBrowser, setFilterBrowser] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const [statsData, sessionsData] = await Promise.all([
      adminGetVisitorStats(),
      adminGetVisitorSessions(
        page,
        filterDevice || undefined,
        filterSource || undefined,
        filterBrowser || undefined,
      ),
    ]);
    setStats(statsData);
    setSessions(sessionsData.data);
    setPagination(sessionsData.pagination);
    setLoading(false);
  }, [page, filterDevice, filterSource, filterBrowser]);

  useEffect(() => { load(); }, [load]);

  function applyFilters() {
    setPage(1);
    load();
  }

  return (
    <main className="min-h-dvh w-full bg-[#F0F4FA] p-0">
      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="pengunjung" />

        <section className="flex min-w-0 flex-col">
          {/* Header */}
          <AdminHeader
            icon={<Users className="h-5 w-5" />}
            title="Laporan Pengunjung"
            subtitle="Sesi & trafik website KRI AMC"
          />

          <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4">
            {/* Stats bar */}
            <section className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {[
                {
                  icon: Users,
                  label: "Total Sesi (7 hari)",
                  value: stats?.total_sesi_minggu_ini ?? 0,
                  color: "text-sky-600",
                  bg: "bg-sky-50",
                },
                {
                  icon: Activity,
                  label: "Rata-rata Halaman",
                  value: stats?.rata_rata_halaman ?? 0,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
                {
                  icon: Clock3,
                  label: "Rata-rata Durasi",
                  value: `${stats?.rata_rata_durasi_menit ?? 0} menit`,
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                },
                {
                  icon: Globe,
                  label: "Total Sesi DB",
                  value: pagination.total,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.label}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.bg}`}>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                    <div>
                      <div className={`text-lg font-bold leading-none ${card.color}`}>{card.value}</div>
                      <div className="mt-0.5 text-[10px] text-slate-500">{card.label}</div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Source & Device breakdown */}
            {stats && (
              <section className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-sky-500" />
                    <span className="text-[11px] font-semibold text-slate-800">Sumber Trafik</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.source.length > 0
                      ? stats.source.map((s) => (
                          <button
                            key={s.source}
                            type="button"
                            onClick={() => { setFilterSource(filterSource === s.source ? "" : s.source); setPage(1); }}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                              filterSource === s.source
                                ? "bg-sky-600 text-white"
                                : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                            }`}
                          >
                            {s.source}
                            <span className="rounded-full bg-white/30 px-1 font-bold">{s.count}</span>
                          </button>
                        ))
                      : <span className="text-[10px] text-slate-400">Belum ada data</span>}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[11px] font-semibold text-slate-800">Device</span>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(stats.device).map(([dev, count]) => {
                      const isActive = filterDevice === dev;
                      return (
                        <button
                          key={dev}
                          type="button"
                          onClick={() => { setFilterDevice(isActive ? "" : dev); setPage(1); }}
                          className={`flex flex-1 flex-col items-center rounded-lg border p-2 text-center transition-colors ${
                            isActive
                              ? "border-emerald-400 bg-emerald-50"
                              : "border-slate-100 bg-slate-50 hover:border-emerald-200"
                          }`}
                        >
                          {dev === "Mobile"
                            ? <Smartphone className="mb-0.5 h-4 w-4 text-emerald-500" />
                            : <Monitor className="mb-0.5 h-4 w-4 text-slate-500" />}
                          <span className="text-sm font-semibold text-slate-800">{count}</span>
                          <span className="text-[9px] text-slate-500">{dev}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* Filter bar */}
            <section className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <Filter className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <select
                value={filterDevice}
                onChange={(e) => setFilterDevice(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
              >
                <option value="">Semua Device</option>
                <option value="Mobile">Mobile</option>
                <option value="Desktop">Desktop</option>
              </select>

              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
              >
                <option value="">Semua Sumber</option>
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Filter browser..."
                value={filterBrowser}
                onChange={(e) => setFilterBrowser(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />

              <button
                type="button"
                onClick={applyFilters}
                className="rounded-lg bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700"
              >
                Terapkan
              </button>

              {(filterDevice || filterSource || filterBrowser) ? (
                <button
                  type="button"
                  onClick={() => { setFilterDevice(""); setFilterSource(""); setFilterBrowser(""); setPage(1); }}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-200"
                >
                  Reset
                </button>
              ) : null}

              <span className="ml-auto text-[10px] text-slate-400">
                {pagination.total} sesi ditemukan
              </span>
            </section>

            {/* Table */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
                  <Users className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Belum ada data sesi</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3">IP</th>
                        <th className="px-4 py-3">Device</th>
                        <th className="px-4 py-3">Browser</th>
                        <th className="px-4 py-3">Halaman</th>
                        <th className="px-4 py-3">Durasi</th>
                        <th className="px-4 py-3">Sumber</th>
                        <th className="px-4 py-3">Mulai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sessions.map((s) => (
                        <tr key={s.id} className="transition-colors hover:bg-slate-50/70">
                          <td className="px-4 py-2.5 font-mono text-[10px] text-slate-500">
                            {s.ip_address || "-"}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${
                              s.device === "Mobile"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {s.device === "Mobile"
                                ? <Smartphone className="h-2.5 w-2.5" />
                                : <Monitor className="h-2.5 w-2.5" />}
                              {s.device || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">{s.browser || "-"}</td>
                          <td className="px-4 py-2.5 text-center font-semibold text-slate-800">
                            {s.pages_visited}
                          </td>
                          <td className="px-4 py-2.5 text-slate-500">{formatDuration(s.duration_second)}</td>
                          <td className="px-4 py-2.5">
                            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-medium text-sky-700">
                              {s.source || "direct"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-400">{formatDatetime(s.started_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                  <span className="text-[10px] text-slate-400">
                    Hal {pagination.page} dari {pagination.total_pages}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={page >= pagination.total_pages}
                      onClick={() => setPage((p) => p + 1)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
