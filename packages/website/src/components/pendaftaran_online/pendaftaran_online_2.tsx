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
  MessageCircle,
  Phone,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Input } from "@/src/UiKecil/input";
import { Separator } from "@/src/UiKecil/separator";
import Link from "next/link";
import Navbar from "@/src/components/navbar";
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

const selectClass =
  "h-12 w-full rounded-full border border-[#8f8f8f] bg-[#f7f5f2] px-4 t-body text-black focus:outline-none cursor-pointer appearance-none";

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
    <main className="min-h-screen bg-[#f7f5f2]">
      <Navbar />

      <div className="section-wrap">
        <section className="card-radius border border-black/5 bg-[#e7e7e752] shadow-[inset_0px_4px_4px_#0000001a]">
          <div className="card-base">
            <div className="mx-auto flex max-w-[1360px] flex-col items-center">
              {/* Judul */}
              <div className="mb-2 flex items-center gap-3">
                <CalendarDays className="h-10 w-10 text-[#87a8d9]" />
                <h1 className="t-h2 text-center font-medium uppercase tracking-wide text-[#00b4d8]">
                  Pendaftaran Online
                </h1>
              </div>
              <p className="mb-8 text-center t-body-lg font-medium text-black">
                Pilih penjamin dan jadwal kunjungan
              </p>

              {/* Step indicator */}
              <div className="mb-11 flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#008000]">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="t-body-sm font-medium text-[#008000]">Data diri</span>
                </div>
                <div className="hidden h-px w-[74px] bg-[#77b36c] sm:block" />
                <div className="flex items-center gap-3">
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#1d19ff] text-white">
                    <span className="t-body-sm font-medium">2</span>
                  </div>
                  <span className="t-body-sm font-medium text-[#0000ff]">Kunjungan</span>
                </div>
                <div className="hidden h-px w-[74px] bg-[#9a9a9a] sm:block" />
                <div className="flex items-center gap-3">
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#b4b4b4] text-[#494949]">
                    <span className="t-body-sm font-medium">3</span>
                  </div>
                  <span className="t-body-sm font-medium text-[#a4a4a4]">Konfirmasi</span>
                </div>
              </div>

              <div
                className="grid w-full max-w-[1370px] grid-cols-1 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]"
                style={{ gap: "var(--gap-cards)" }}
              >
                {/* ── Form Area ── */}
                <section>
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
                              <Card
                                className={`card-radius border shadow-none ${
                                  isSelected
                                    ? "border-[#5d5dff] bg-[#0000ff33]"
                                    : "border-black bg-[#f7f5f2]"
                                }`}
                              >
                                <CardContent className="flex min-h-[56px] items-center gap-3 px-4 py-3">
                                  <div className="min-w-0 flex-1">
                                    <p className="t-body font-bold text-black leading-tight">
                                      {pj.png_jawab}
                                    </p>
                                    <p className="t-body-sm font-medium text-black/40">
                                      {pj.kd_pj}
                                    </p>
                                  </div>
                                  <div
                                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-black ${
                                      isSelected ? "bg-[#0000ff]" : "bg-[#d9d9d9]"
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                  </div>
                                </CardContent>
                              </Card>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* No peserta BPJS */}
                    {kdPj === "BPJ" && (
                      <div className="mt-3 space-y-2">
                        <label className="t-body-sm font-bold uppercase tracking-wide text-black">
                          No. Peserta BPJS
                        </label>
                        <Input
                          value={noPeserta}
                          onChange={(e) => setNoPeserta(e.target.value)}
                          placeholder="Nomor peserta BPJS Kesehatan"
                          className="h-12 rounded-full border border-[#8f8f8f] bg-[#f7f5f2] px-4 t-body text-black placeholder:text-[#b3b3b3] focus-visible:ring-0"
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
                      <label className="t-body-sm font-bold uppercase tracking-wide text-black">
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
                      <label className="t-body-sm font-bold uppercase tracking-wide text-black">
                        Tanggal Kunjungan
                      </label>
                      <Input
                        type="date"
                        value={tanggalPeriksa}
                        min={today}
                        onChange={(e) => setTanggalPeriksa(e.target.value)}
                        disabled={!kdPoli}
                        className="h-12 rounded-full border border-[#8f8f8f] bg-[#f7f5f2] px-4 t-body text-black focus-visible:ring-0 disabled:opacity-50"
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
                                  <Card
                                    className={`card-radius border shadow-none ${
                                      isSelected
                                        ? "border-[#5d5dff] bg-[#0000ff33]"
                                        : "border-black bg-[#f7f5f2]"
                                    }`}
                                  >
                                    <CardContent className="flex min-h-[84px] items-center gap-3 px-4 py-4">
                                      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#87a8d9] t-body-sm font-medium text-white">
                                        {d.nm_dokter.charAt(0)}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <h3 className="t-h4 font-bold leading-tight text-black">
                                          {d.nm_dokter}
                                        </h3>
                                        <div className="t-body-sm font-medium text-black/50">
                                          {d.jam_mulai} – {d.jam_selesai}
                                        </div>
                                        {d.kuota > 0 && (
                                          <div
                                            className={`t-caption font-medium ${
                                              kuotaHabis
                                                ? "text-red-500"
                                                : "text-green-600"
                                            }`}
                                          >
                                            {kuotaHabis
                                              ? "Kuota penuh"
                                              : `Sisa kuota: ${d.sisa_kuota}`}
                                          </div>
                                        )}
                                      </div>
                                      <div
                                        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-black ${
                                          isSelected ? "bg-[#0000ff]" : "bg-[#d9d9d9]"
                                        }`}
                                      >
                                        {isSelected && (
                                          <Check className="h-3.5 w-3.5 text-white" />
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
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
                      className="h-12 rounded-full border-2 border-black bg-[#f7f5f2] px-6 t-body font-medium text-black shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#f2efea]"
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
                      className="h-12 rounded-full bg-[#00b4d8] px-6 t-body font-medium text-white shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#05abce]"
                    >
                      Lanjut konfirmasi
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </section>

                {/* ── Sidebar ── */}
                <aside className="hidden flex-col gap-5 lg:flex">
                  <Card className="card-radius border border-black bg-[#f7f5f2] shadow-none">
                    <CardContent className="card-base">
                      <div className="mb-3 flex items-center gap-3">
                        <ClipboardList className="h-6 w-6 text-[#87a8d9]" />
                        <h3 className="t-h3 font-bold text-black">Ringkasan data diri</h3>
                      </div>
                      <div>
                        {summaryRows.map((row, index) => (
                          <div key={row.label}>
                            <div className="grid grid-cols-[140px_1fr] items-center gap-4 py-2 t-body">
                              <div className="font-medium text-[#b3b3b3]">{row.label}</div>
                              <div className="text-right text-black">{row.value}</div>
                            </div>
                            {index < summaryRows.length - 1 && (
                              <Separator className="bg-black/20" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-radius border-0 bg-[#00b4d8] text-white shadow-[0px_4px_33px_6px_#4a445d29]">
                    <CardContent className="card-base">
                      <div className="mb-3 flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        <h3 className="t-h3 font-medium">Butuh bantuan?</h3>
                      </div>
                      <p className="mb-5 max-w-[430px] t-body font-medium text-white">
                        Tim kami siap membantu memilih layanan yang tepat
                      </p>
                      <Button
                        className="h-12 rounded-full bg-[#0d8f1f] px-5 t-body font-medium text-white shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#0b831b]"
                        asChild
                      >
                        <Link
                          href="https://wa.me/6281225566055"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="mr-2 h-5 w-5 fill-white text-white" />
                          Chat Whatsapp
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </aside>

                {/* Mobile accordion */}
                <details className="rounded-2xl border border-black/20 bg-[#f7f5f2] p-4 lg:hidden">
                  <summary className="cursor-pointer t-body font-semibold text-black">
                    Lihat ringkasan data
                  </summary>
                  <div className="mt-3 space-y-2 t-body-sm text-[#5f5f5f]">
                    {summaryRows.slice(0, 3).map((row) => (
                      <div key={row.label} className="flex justify-between gap-3">
                        <span>{row.label}</span>
                        <span className="font-medium text-black">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
