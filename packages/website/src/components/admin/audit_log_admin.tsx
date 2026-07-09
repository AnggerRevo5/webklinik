"use client";

import { AlertTriangle, RefreshCw, ScrollText, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { adminGetAuditLogs, getCurrentAdmin, type AuditLogItem, type CurrentAdmin } from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import { AdminHeader } from "@/src/UiKecil/admin_ui";

function formatDatetime(iso: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

const ACTION_LABEL: Record<string, string> = {
  login_success: "Login berhasil",
  login_failed: "Login gagal",
  logout: "Logout",
  admin_mutation: "Perubahan data",
};

function ActionBadge({ action }: { action: string }) {
  const label = ACTION_LABEL[action] ?? action;
  const cls =
    action === "login_failed"
      ? "bg-rose-50 text-rose-700"
      : action === "login_success"
        ? "bg-emerald-50 text-emerald-700"
        : action === "logout"
          ? "bg-slate-100 text-slate-600"
          : "bg-sky-50 text-sky-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function AuditLogAdmin() {
  const [me, setMe] = useState<CurrentAdmin>(null);
  const [meLoading, setMeLoading] = useState(true);
  useEffect(() => {
    getCurrentAdmin().then((admin) => {
      setMe(admin);
      setMeLoading(false);
    });
  }, []);

  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch murni — TIDAK ada setState sinkron di level teratas, supaya aman
  // dipanggil langsung dari efek mount (react-hooks/set-state-in-effect).
  const fetchLogs = useCallback(() => {
    return adminGetAuditLogs()
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setLogs([]);
        setLoadError(
          err instanceof Error && err.message === "Tidak diizinkan"
            ? "Sesi admin telah berakhir. Silakan login ulang."
            : "Gagal memuat audit log dari server.",
        );
        setLoading(false);
      });
  }, []);

  // Dipakai tombol "Muat ulang" — boleh setState sinkron karena bukan efek.
  const loadLogs = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  if (!meLoading && me?.role !== "superadmin") {
    return (
      <main className="min-h-dvh w-full bg-[#F0F4FA] p-0">
        <div className="grid min-h-dvh w-full grid-cols-1 content-start lg:grid-cols-[220px_minmax(0,1fr)]">
          <SidebarAdmin activeKey="auditlog" />
          <section className="flex min-w-0 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShieldAlert className="h-10 w-10 text-amber-500" />
            <p className="text-sm font-semibold text-slate-700">Hanya superadmin yang bisa melihat audit log</p>
            <p className="text-[11px] text-slate-400">Hubungi superadmin klinik kalau Anda butuh akses ke halaman ini.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full bg-[#F0F4FA] p-0">
      <div className="grid min-h-dvh w-full grid-cols-1 content-start lg:grid-cols-[220px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="auditlog" />

        <section className="flex min-w-0 flex-col">
          <AdminHeader
            icon={<ScrollText className="h-5 w-5" />}
            title="Audit Log"
            subtitle="Riwayat login admin & perubahan data (200 terbaru)"
          />

          <div className="flex-1 space-y-4 overflow-y-auto p-4 lg:p-5">
            <div className="mb-2 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <p className="text-[10px] text-sky-700">
                Kota/negara login dideteksi dari alamat IP (bukan GPS). Baris bertanda
                <span className="mx-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-700">
                  <AlertTriangle className="h-2.5 w-2.5" /> lokasi baru
                </span>
                berarti login berhasil itu datang dari kota berbeda dari login sukses sebelumnya —
                periksa apakah itu benar-benar Anda.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={loadLogs}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
              >
                <RefreshCw className="h-3 w-3" />
                Muat ulang
              </button>
            </div>

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                </div>
              ) : loadError ? (
                <div className="flex h-40 flex-col items-center justify-center gap-3 text-center">
                  <p className="max-w-xs text-[11px] text-amber-700">{loadError}</p>
                  {loadError.includes("login ulang") ? (
                    <a
                      href="/admin_login_page"
                      className="inline-flex items-center rounded-lg bg-amber-600 px-3 py-1.5 text-[10px] font-medium text-white hover:bg-amber-700"
                    >
                      Ke halaman login
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={loadLogs}
                      className="inline-flex items-center rounded-lg bg-amber-600 px-3 py-1.5 text-[10px] font-medium text-white hover:bg-amber-700"
                    >
                      Coba lagi
                    </button>
                  )}
                </div>
              ) : logs.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
                  <ScrollText className="h-8 w-8 opacity-30" />
                  <p className="text-sm">Belum ada aktivitas tercatat</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3">Waktu</th>
                        <th className="px-4 py-3">Aktivitas</th>
                        <th className="px-4 py-3">Aktor</th>
                        <th className="px-4 py-3">IP</th>
                        <th className="px-4 py-3">Lokasi</th>
                        <th className="px-4 py-3">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {logs.map((log) => {
                        const isNewLocation = (log.detail ?? "").startsWith("PERINGATAN");
                        return (
                          <tr key={log.id} className="transition-colors hover:bg-slate-50/70">
                            <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
                              {formatDatetime(log.created_at)}
                            </td>
                            <td className="px-4 py-2.5">
                              <ActionBadge action={log.action} />
                            </td>
                            <td className="px-4 py-2.5 text-slate-700">{log.actor || "-"}</td>
                            <td className="px-4 py-2.5 font-mono text-[10px] text-slate-500">
                              {log.ip_address || "-"}
                            </td>
                            <td className="px-4 py-2.5 text-slate-600">
                              {log.kota ? `${log.kota}${log.negara ? ", " + log.negara : ""}` : "-"}
                              {isNewLocation && (
                                <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                                  <AlertTriangle className="h-2.5 w-2.5" /> lokasi baru
                                </span>
                              )}
                            </td>
                            <td className="max-w-xs truncate px-4 py-2.5 text-slate-400" title={log.detail}>
                              {log.detail || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
