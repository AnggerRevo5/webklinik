"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ClipboardList,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/src/UiKecil/button";
import { Input } from "@/src/UiKecil/input";
import { Separator } from "@/src/UiKecil/separator";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { Reveal } from "@/src/components/motion";
import {
  RegistrationShell,
  HelpCard,
  fieldClass,
  selectFieldClass,
  fieldLabelClass,
  softCardClass,
} from "@/src/components/pendaftaran_online/registration_shell";
import {
  getDokterKhanza,
  getPenjamin,
  getPoliKhanza,
  getHariKhanza,
  loadPendaftaranSession,
  savePendaftaranSession,
  type DokterJadwal,
  type PenjabKhanza,
  type PoliKhanza,
} from "@/src/lib/api";

const selectClass = selectFieldClass;

const today = new Date().toISOString().split("T")[0];

export default function FormulirKunjungan() {
  const router = useRouter();

  // Data dari step 1
  const [step1Data, setStep1Data] = useState<ReturnType<typeof loadPendaftaranSession>["step1"]>(undefined);

  // Referensi data dari Khanza
  const [poliList, setPoliList] = useState<PoliKhanza[]>([]);
  const [penjaminList, setPenjaminList] = useState<PenjabKhanza[]>([]);
  const [dokterList, setDokterList] = useState<DokterJadwal[]>([]);

  // Seleksi user
  const [kdPj, setKdPj] = useState("");
  const [noPeserta, setNoPeserta] = useState("");
  const [kdPoli, setKdPoli] = useState("");
  const [tanggalPeriksa, setTanggalPeriksa] = useState("");
  const [kdDokter, setKdDokter] = useState("");
  const [selectedDokter, setSelectedDokter] = useState<DokterJadwal | null>(null);

  const [loadingDokter, setLoadingDokter] = useState(false);
  const [error, setError] = useState("");

  // Load step1 data + referensi pada mount
  useEffect(() => {
    const session = loadPendaftaranSession();
    setStep1Data(session.step1);

    Promise.all([getPoliKhanza(), getPenjamin()])
      .then(([poli, penjamin]) => {
        setPoliList(poli ?? []);
        setPenjaminList(penjamin ?? []);
      })
      .catch((err: unknown) => {
        setError(
          "Gagal memuat data: " +
            (err instanceof Error ? err.message : "Periksa koneksi backend"),
        );
      });
  }, []);

  // Load dokter saat poli + tanggal sudah dipilih
  useEffect(() => {
    if (!kdPoli || !tanggalPeriksa) {
      setDokterList([]);
      setKdDokter("");
      setSelectedDokter(null);
      return;
    }
    const hari = getHariKhanza(new Date(tanggalPeriksa + "T00:00:00"));
    setLoadingDokter(true);
    getDokterKhanza(kdPoli, hari, tanggalPeriksa)
      .then((list) => {
        setDokterList(list ?? []);
        setKdDokter("");
        setSelectedDokter(null);
      })
      .finally(() => setLoadingDokter(false));
  }, [kdPoli, tanggalPeriksa]);

  const handlePilihDokter = (dokter: DokterJadwal) => {
    setKdDokter(dokter.kd_dokter);
    setSelectedDokter(dokter);
  };

  const handleLanjut = () => {
    if (!kdPj) { setError("Pilih jenis penjamin"); return; }
    if (!kdPoli) { setError("Pilih poliklinik"); return; }
    if (!tanggalPeriksa) { setError("Pilih tanggal kunjungan"); return; }
    if (!kdDokter || !selectedDokter) { setError("Pilih dokter"); return; }
    setError("");

    const penjaminInfo = penjaminList.find((p) => p.kd_pj === kdPj);
    const poliInfo = poliList.find((p) => p.kd_poli === kdPoli);

    savePendaftaranSession({
      step2: {
        kd_pj: kdPj,
        png_jawab: penjaminInfo?.png_jawab ?? kdPj,
        no_peserta: noPeserta,
        kd_poli: kdPoli,
        nm_poli: poliInfo?.nm_poli ?? kdPoli,
        tanggal_periksa: tanggalPeriksa,
        kd_dokter: kdDokter,
        nm_dokter: selectedDokter.nm_dokter,
        waktu_kunjungan: selectedDokter.jam_mulai,
        jam_selesai: selectedDokter.jam_selesai,
      },
    });
    router.push("/pendaftaran_online_3");
  };

  const nmPasien = step1Data?.nm_pasien ?? "—";
  const nikMasked = step1Data?.no_ktp
    ? step1Data.no_ktp.slice(0, 4) + "••••••••" + step1Data.no_ktp.slice(-4)
    : "—";

  const summaryRows = [
    { label: "Nama", value: nmPasien },
    { label: "NIK", value: nikMasked },
    { label: "Tgl lahir", value: step1Data?.tgl_lahir ?? "—" },
    {
      label: "Jenis kelamin",
      value: step1Data?.jk === "L" ? "Laki-laki" : step1Data?.jk === "P" ? "Perempuan" : "—",
    },
    { label: "No. HP", value: step1Data?.no_tlp ?? "—" },
  ];

  return (
    <RegistrationShell
      current={2}
      subtitle="Pilih jenis penjamin dan jadwal kunjungan Anda"
    >
      <Reveal direction="up">
        <div
          className="grid w-full grid-cols-1 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]"
          style={{ gap: "var(--gap-cards)" }}
        >
          {/* ── Form Area ── */}
          <section className={cn(softCardClass, "p-5 sm:p-6")}>
                  {/* PENJAMIN */}
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#e5defc]">
                        <ClipboardList className="h-4 w-4 text-[#87a8d9]" />
                      </div>
                      <h2 className="t-h3 font-bold text-black">Jenis Penjamin</h2>
                    </div>

                    {penjaminList.length === 0 ? (
                      <p className="t-body-sm text-[#7f7f7f]">Memuat daftar penjamin...</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {penjaminList.map((pj) => {
                          const isSelected = kdPj === pj.kd_pj;
                          return (
                            <button
                              key={pj.kd_pj}
                              type="button"
                              onClick={() => { setKdPj(pj.kd_pj); setNoPeserta(""); }}
                              className="text-left"
                            >
                              <div
                                className={`flex min-h-[56px] items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
                                  isSelected
                                    ? "border-[#00b4d8] bg-[#00b4d8]/8 shadow-sm shadow-[#00b4d8]/20"
                                    : "border-slate-200 bg-white hover:border-[#00b4d8]/50"
                                }`}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="t-body font-bold leading-tight text-slate-900">
                                    {pj.png_jawab}
                                  </p>
                                  <p className="t-body-sm font-medium text-slate-400">
                                    {pj.kd_pj}
                                  </p>
                                </div>
                                <div
                                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                    isSelected ? "border-[#00b4d8] bg-[#00b4d8]" : "border-slate-300 bg-white"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* No peserta BPJS */}
                    {kdPj === "BPJ" && (
                      <div className="mt-3 space-y-2">
                        <label className={fieldLabelClass}>
                          No. Peserta BPJS
                        </label>
                        <Input
                          value={noPeserta}
                          onChange={(e) => setNoPeserta(e.target.value)}
                          placeholder="Nomor peserta BPJS Kesehatan"
                          className={fieldClass}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="mb-6 bg-black/20" />

                  {/* JADWAL KUNJUNGAN */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#e5defc]">
                        <CalendarDays className="h-4 w-4 text-[#87a8d9]" />
                      </div>
                      <h2 className="t-h3 font-bold text-black">Jadwal Kunjungan</h2>
                    </div>

                    {/* Pilih poli */}
                    <div className="space-y-2">
                      <label className={fieldLabelClass}>
                        Pilih Poliklinik
                      </label>
                      <select
                        title="Pilih Poliklinik"
                        value={kdPoli}
                        onChange={(e) => { setKdPoli(e.target.value); setTanggalPeriksa(""); }}
                        className={selectClass}
                      >
                        <option key="__empty__" value="">— Pilih Poli —</option>
                        {poliList.map((p) => (
                          <option key={p.kd_poli} value={p.kd_poli}>
                            {p.nm_poli}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pilih tanggal */}
                    <div className="space-y-2">
                      <label className={fieldLabelClass}>
                        Tanggal Kunjungan
                      </label>
                      <Input
                        type="date"
                        value={tanggalPeriksa}
                        min={today}
                        onChange={(e) => setTanggalPeriksa(e.target.value)}
                        disabled={!kdPoli}
                        className={cn(fieldClass, "disabled:opacity-50")}
                      />
                      {!kdPoli && (
                        <p className="t-caption font-medium text-[#b3b3b3]">
                          Pilih poli terlebih dahulu
                        </p>
                      )}
                    </div>

                    {/* Pilih dokter */}
                    {kdPoli && tanggalPeriksa && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-5 w-5 text-[#87a8d9]" />
                          <h3 className="t-h3 font-bold text-black">Pilih Dokter</h3>
                        </div>

                        {loadingDokter ? (
                          <div className="flex items-center gap-2 py-4 t-body text-[#7f7f7f]">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Memuat jadwal dokter...
                          </div>
                        ) : dokterList.length === 0 ? (
                          <div className="rounded-[16px] border border-amber-200 bg-amber-50 p-4">
                            <p className="t-body font-medium text-amber-800">
                              Tidak ada dokter tersedia pada hari ini di poli yang dipilih.
                              Coba pilih tanggal lain.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {dokterList.map((d) => {
                              const isSelected = kdDokter === d.kd_dokter;
                              const kuotaHabis = d.kuota > 0 && d.sisa_kuota <= 0;
                              return (
                                <button
                                  key={d.kd_dokter}
                                  type="button"
                                  onClick={() => !kuotaHabis && handlePilihDokter(d)}
                                  disabled={kuotaHabis}
                                  className="block w-full text-left disabled:opacity-50"
                                >
                                  <div
                                    className={`flex min-h-[84px] items-center gap-3 rounded-xl border px-4 py-4 transition-all duration-200 ${
                                      isSelected
                                        ? "border-[#00b4d8] bg-[#00b4d8]/8 shadow-sm shadow-[#00b4d8]/20"
                                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#00b4d8]/50"
                                    }`}
                                  >
                                    <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0f4c81] to-[#00b4d8] t-body font-bold text-white">
                                      {d.nm_dokter.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h3 className="t-h4 font-bold leading-tight text-slate-900">
                                        {d.nm_dokter}
                                      </h3>
                                      <div className="t-body-sm font-medium text-slate-500">
                                        {d.jam_mulai} – {d.jam_selesai}
                                      </div>
                                      {d.kuota > 0 && (
                                        <div
                                          className={`t-caption font-semibold ${
                                            kuotaHabis
                                              ? "text-red-500"
                                              : "text-emerald-600"
                                          }`}
                                        >
                                          {kuotaHabis
                                            ? "Kuota penuh"
                                            : `Sisa kuota: ${d.sisa_kuota}`}
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                        isSelected ? "border-[#00b4d8] bg-[#00b4d8]" : "border-slate-300 bg-white"
                                      }`}
                                    >
                                      {isSelected && (
                                        <Check className="h-3.5 w-3.5 text-white" />
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Info waktu kunjungan */}
                    {selectedDokter && (
                      <div className="rounded-[16px] border border-[#08b4d8]/30 bg-blue-50 p-3">
                        <p className="t-body-sm font-medium text-blue-700">
                          Waktu kunjungan:{" "}
                          <strong>
                            {selectedDokter.jam_mulai} – {selectedDokter.jam_selesai} WIB
                          </strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <p className="mt-4 t-body-sm font-medium text-red-500">{error}</p>
                  )}

                  {/* Tombol navigasi */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      className="h-12 rounded-full border border-slate-300 bg-white px-6 t-body font-medium text-slate-700 transition-transform hover:-translate-y-0.5 hover:bg-slate-50"
                      asChild
                    >
                      <Link href="/pendaftaran_online_1">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Kembali
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      onClick={handleLanjut}
                      className="btn-shine h-12 rounded-full bg-[#00b4d8] px-6 t-body font-medium text-white shadow-lg shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#05abce]"
                    >
                      Lanjut konfirmasi
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </section>

          {/* ── Sidebar ── */}
          <aside className="hidden flex-col gap-4 lg:sticky lg:top-6 lg:flex lg:self-start">
            <div className={cn(softCardClass, "p-5")}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00b4d8]/10">
                  <ClipboardList className="h-5 w-5 text-[#0f4c81]" />
                </div>
                <h3 className="t-h4 font-bold text-slate-900">Ringkasan data diri</h3>
              </div>
              <div>
                {summaryRows.map((row, index) => (
                  <div key={row.label}>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4 py-2.5 t-body-sm">
                      <div className="font-medium text-slate-400">{row.label}</div>
                      <div className="text-right font-medium text-slate-900">{row.value}</div>
                    </div>
                    {index < summaryRows.length - 1 && (
                      <Separator className="bg-slate-100" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <HelpCard />
          </aside>

          {/* Mobile accordion */}
          <details className={cn(softCardClass, "p-4 lg:hidden")}>
            <summary className="cursor-pointer t-body font-semibold text-slate-900">
              Lihat ringkasan data
            </summary>
            <div className="mt-3 space-y-2 t-body-sm text-slate-500">
              {summaryRows.slice(0, 3).map((row) => (
                <div key={row.label} className="flex justify-between gap-3">
                  <span>{row.label}</span>
                  <span className="font-medium text-slate-900">{row.value}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      </Reveal>
    </RegistrationShell>
  );
}
