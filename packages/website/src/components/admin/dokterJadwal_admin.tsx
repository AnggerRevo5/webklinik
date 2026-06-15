"use client";

import { CalendarDays, Info, Camera, Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
  adminGetDokter,
  adminToggleTampilDokter,
  updateDokterFoto,
  type DokterAdmin,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import ImagePicker from "@/src/UiKecil/image_picker";

export default function DokterJadwalAdmin() {
  const [doctors, setDoctors] = useState<DokterAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKd, setSelectedKd] = useState<string | null>(null);
  const [editFoto, setEditFoto] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const loadDokter = useCallback(() => {
    setLoading(true);
    adminGetDokter().then((list) => {
      setDoctors(list);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadDokter();
  }, [loadDokter]);

  useEffect(() => {
    const dok = doctors.find((d) => d.kd_dokter === selectedKd);
    if (dok) {
      setEditFoto(dok.foto_url ?? "");
      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [selectedKd, doctors]);

  async function handleToggleTampil(kdDokter: string) {
    setToggling(kdDokter);
    // optimistic update
    setDoctors((prev) =>
      prev.map((d) =>
        d.kd_dokter === kdDokter ? { ...d, tampil_website: !d.tampil_website } : d,
      ),
    );
    try {
      const res = await adminToggleTampilDokter(kdDokter);
      // sync dengan nilai aktual dari server
      setDoctors((prev) =>
        prev.map((d) =>
          d.kd_dokter === kdDokter ? { ...d, tampil_website: res.tampil_website } : d,
        ),
      );
    } catch {
      // revert jika gagal
      setDoctors((prev) =>
        prev.map((d) =>
          d.kd_dokter === kdDokter ? { ...d, tampil_website: !d.tampil_website } : d,
        ),
      );
    } finally {
      setToggling(null);
    }
  }

  async function handleSaveFoto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedKd) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await updateDokterFoto(selectedKd, editFoto);
      if (!res.success) throw new Error(res.error ?? "Gagal menyimpan foto");
      setDoctors((prev) =>
        prev.map((d) =>
          d.kd_dokter === selectedKd ? { ...d, foto_url: editFoto } : d,
        ),
      );
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Gagal menyimpan foto");
    } finally {
      setIsSaving(false);
    }
  }

  const selectedDoctor = doctors.find((d) => d.kd_dokter === selectedKd) ?? null;
  const totalTampil = doctors.filter((d) => d.tampil_website).length;

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin dokter & jadwal</h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="dokter" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-900">Dokter & Jadwal</div>
              <div className="text-[9px] text-slate-400">Data dari SIK Khanza (read-only)</div>
            </div>
            {!loading && doctors.length > 0 && (
              <div className="flex items-center gap-2 text-[9px] text-slate-500">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                  {totalTampil} ditampilkan di website
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">
                  {doctors.length - totalTampil} disembunyikan
                </span>
              </div>
            )}
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            {/* Notice */}
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <p className="text-[10px] text-sky-700">
                Data dokter dan jadwal dikelola melalui SIK Khanza (read-only). Di sini dapat mengubah foto dokter dan memilih dokter mana yang ditampilkan di website publik.
              </p>
            </div>

            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                Memuat data dokter...
              </div>
            ) : doctors.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                Tidak ada data dokter aktif dari SIK Khanza.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {doctors.map((dok, index) => {
                  const isSelected = dok.kd_dokter === selectedKd;
                  const isToggling = toggling === dok.kd_dokter;
                  const avatarColor =
                    index % 3 === 0
                      ? "bg-sky-600"
                      : index % 3 === 1
                        ? "bg-emerald-600"
                        : "bg-amber-600";
                  const initials =
                    dok.nm_dokter
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase() ?? "")
                      .join("") || "DR";

                  return (
                    <article
                      key={dok.kd_dokter}
                      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${isSelected ? "border-sky-400 ring-1 ring-sky-300" : "border-slate-200"}`}
                    >
                      <div className="flex items-start gap-3 p-4">
                        {dok.foto_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={dok.foto_url}
                            alt={dok.nm_dokter}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold text-white ${avatarColor}`}
                          >
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-medium text-slate-900">
                            {dok.nm_dokter}
                          </div>
                          <div className="text-[10px] text-slate-400">{dok.spesialis || "Umum"}</div>
                          <div className="mt-1 text-[8px] text-slate-400">
                            kd: {dok.kd_dokter}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          {/* Toggle tampil website */}
                          <button
                            type="button"
                            disabled={isToggling}
                            onClick={() => handleToggleTampil(dok.kd_dokter)}
                            aria-label={dok.tampil_website ? "Sembunyikan dari website" : "Tampilkan di website"}
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 ${
                              dok.tampil_website
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                            }`}
                          >
                            {dok.tampil_website ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                            {dok.tampil_website ? "Tampil" : "Sembunyikan"}
                          </button>
                          {/* Edit foto */}
                          <button
                            type="button"
                            onClick={() => setSelectedKd(dok.kd_dokter)}
                            className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1.5 text-[9px] font-medium text-amber-600 transition-all hover:-translate-y-0.5 hover:bg-amber-100"
                          >
                            <Camera className="h-3 w-3" />
                            Foto
                          </button>
                        </div>
                      </div>

                      {dok.jadwal && dok.jadwal.length > 0 ? (
                        <div className="border-t border-slate-100 px-4 pb-3 pt-2">
                          <div className="mb-1 text-[8px] font-medium uppercase tracking-widest text-slate-400">
                            Jadwal Praktek
                          </div>
                          <div className="flex flex-col gap-1">
                            {dok.jadwal.map((j, ji) => (
                              <div
                                key={ji}
                                className="flex items-center gap-2 text-[9px] text-slate-600"
                              >
                                <CalendarDays className="h-3 w-3 shrink-0 text-sky-400" />
                                <span className="font-medium">{j.hari_kerja}</span>
                                <span className="text-slate-400">
                                  {j.jam_mulai}–{j.jam_selesai}
                                </span>
                                {j.nm_poli ? (
                                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] text-slate-500">
                                    {j.nm_poli}
                                  </span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}

            {/* Edit foto panel */}
            {selectedDoctor ? (
              <form
                onSubmit={handleSaveFoto}
                className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-slate-900">
                    Ubah foto — {selectedDoctor.nm_dokter}
                  </div>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[8px] font-semibold text-amber-600">
                    PUT /api/dokter-foto/{selectedDoctor.kd_dokter}
                  </span>
                </div>

                <ImagePicker
                  value={editFoto}
                  onChange={setEditFoto}
                  folder="dokter"
                  label="Foto Dokter"
                />

                {saveError ? (
                  <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                    {saveError}
                  </div>
                ) : null}
                {saveSuccess ? (
                  <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[9px] text-emerald-600">
                    Foto berhasil disimpan.
                  </div>
                ) : null}

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedKd(null);
                      setSaveError(null);
                      setSaveSuccess(false);
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-60"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan foto"}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
