"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import Navbar from "@/src/components/navbar";
import {
  loadPendaftaranSession,
  savePendaftaranSession,
  submitPendaftaran,
  type PendaftaranSession,
} from "@/src/lib/api";

function formatTanggal(dateStr: string): string {
  if (!dateStr) return "—";
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  return `${d} ${bulan[parseInt(m) - 1]} ${y}`;
}

function formatTanggalKunjungan(dateStr: string): string {
  if (!dateStr) return "—";
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const d = new Date(dateStr + "T00:00:00");
  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function maskNIK(nik?: string): string {
  if (!nik || nik.length < 8) return nik ?? "—";
  return nik.slice(0, 4) + "••••••••" + nik.slice(-4);
}

export default function PendaftaranOnlineKonfirmasiSection() {
  const router = useRouter();
  const [session, setSession] = useState<PendaftaranSession>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setSession(loadPendaftaranSession());
  }, []);

  const { step1, step2 } = session;

  const handleSubmit = async () => {
    if (!consent) {
      setSubmitError("Centang pernyataan persetujuan untuk melanjutkan");
      return;
    }
    if (!step1 || !step2) {
      setSubmitError("Data tidak lengkap, kembali ke langkah sebelumnya");
      return;
    }
    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = {
        is_new_pasien: step1.isNewPasien,
        no_rkm_medis: step1.no_rkm_medis ?? "",
        no_ktp: step1.no_ktp,
        nm_pasien: step1.nm_pasien ?? "",
        jk: step1.jk ?? "",
        tmp_lahir: step1.tmp_lahir ?? "",
        tgl_lahir: step1.tgl_lahir ?? "",
        nm_ibu: step1.nm_ibu ?? "",
        alamat: step1.alamat ?? "",
        gol_darah: step1.gol_darah ?? "",
        pekerjaan: step1.pekerjaan ?? "",
        stts_nikah: step1.stts_nikah ?? "",
        agama: step1.agama ?? "",
        no_tlp: step1.no_tlp ?? "",
        pnd: step1.pnd ?? "",
        keluarga: step1.keluarga ?? "",
        namakeluarga: step1.namakeluarga ?? "",
        kd_pj: step2.kd_pj,
        no_peserta: step2.no_peserta,
        kd_poli: step2.kd_poli,
        kd_dokter: step2.kd_dokter,
        tanggal_periksa: step2.tanggal_periksa,
        waktu_kunjungan: step2.waktu_kunjungan,
      };

      const res = await submitPendaftaran(payload);

      if (!res.success) {
        setSubmitError(res.error ?? "Pendaftaran gagal, coba lagi");
        return;
      }

      // Simpan hasil ke session lalu arahkan ke konfirmasi
      savePendaftaranSession({
        result: {
          no_reg: res.data?.no_reg ?? "—",
          no_rkm_medis: res.data?.no_rkm_medis ?? "",
          tanggal_periksa: step2.tanggal_periksa,
          waktu_kunjungan: step2.waktu_kunjungan,
          nm_dokter: step2.nm_dokter,
          nm_poli: step2.nm_poli,
          status: res.data?.status ?? "Belum",
        },
      });
      router.push("/laman_konfirmasi_pendaftaran");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="step-3"
      className="section-wrap card-radius bg-[#e7e7e752] shadow-[inset_0px_4px_4px_#0000001a]"
    >
      <Navbar />

      <div className="card-base">
        {/* Judul */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-10 w-10 text-[#8da9c9]" />
            <h1 className="t-h2 font-medium uppercase tracking-wide text-[#00b4d8]">
              PENDAFTARAN ONLINE
            </h1>
          </div>
          <p className="mt-4 text-center t-body-lg font-medium text-black">
            Konfirmasi pendaftaran
            <br />
            Periksa kembali data Anda sebelum mengirim
          </p>

          {/* Step indicator */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {[
              { number: 1, label: "Data diri", done: true },
              { number: 2, label: "Kunjungan", done: true },
              { number: 3, label: "Konfirmasi", done: false },
            ].map((step, index) => (
              <div key={step.label} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${
                      step.done
                        ? "bg-[#008000]"
                        : step.number === 3
                          ? "bg-[#1d19ff] text-white"
                          : "bg-[#b4b4b4] text-[#494949]"
                    }`}
                  >
                    {step.done ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <span className="t-body-sm font-medium">{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`t-body-sm font-medium max-[639px]:hidden ${
                      step.done
                        ? "text-[#008000]"
                        : step.number === 3
                          ? "text-[#0000ff]"
                          : "text-[#a4a4a4]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`mx-5 hidden h-px w-[80px] md:block ${
                      index === 0 ? "bg-[#7aa66e]" : "bg-[#9a9a9a]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan */}
        <div className="mt-10 space-y-4">
          {/* Data Pasien */}
          <Card className="w-full card-radius border border-black bg-[#f7f5f2] shadow-none">
            <CardContent className="card-base">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#d9d9d9]">
                  <Check className="h-[18px] w-[18px] text-[#8f9aa3]" />
                </div>
                <h2 className="t-h3 font-bold leading-none text-black">Data Pasien</h2>
              </div>

              <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
                <div className="space-y-3">
                  <dl className="space-y-0.5">
                    <dt className="t-caption font-medium text-[#9b9b9b]">NAMA LENGKAP</dt>
                    <dd className="t-body font-normal text-black">{step1?.nm_pasien ?? "—"}</dd>
                  </dl>
                  <dl className="space-y-0.5">
                    <dt className="t-caption font-medium text-[#9b9b9b]">NIK</dt>
                    <dd className="t-body font-normal text-black">{maskNIK(step1?.no_ktp)}</dd>
                  </dl>
                  <dl className="space-y-0.5">
                    <dt className="t-caption font-medium text-[#9b9b9b]">TANGGAL LAHIR</dt>
                    <dd className="t-body font-normal text-black">
                      {formatTanggal(step1?.tgl_lahir ?? "")}
                    </dd>
                  </dl>
                </div>
                <div className="space-y-3">
                  <dl className="space-y-0.5">
                    <dt className="t-caption font-medium text-[#9b9b9b]">JENIS KELAMIN</dt>
                    <dd className="t-body font-normal text-black">
                      {step1?.jk === "L" ? "Laki-laki" : step1?.jk === "P" ? "Perempuan" : "—"}
                    </dd>
                  </dl>
                  <dl className="space-y-0.5">
                    <dt className="t-caption font-medium text-[#9b9b9b]">NO. HP / WHATSAPP</dt>
                    <dd className="t-body font-normal text-black">{step1?.no_tlp ?? "—"}</dd>
                  </dl>
                </div>
              </div>

              {step1?.alamat && (
                <dl className="mt-4 space-y-0.5">
                  <dt className="t-caption font-medium text-[#9b9b9b]">ALAMAT</dt>
                  <dd className="t-body font-normal text-black">{step1.alamat}</dd>
                </dl>
              )}
            </CardContent>
          </Card>

          {/* Detail Kunjungan */}
          <Card className="w-full card-radius border border-black bg-[#f7f5f2] shadow-none">
            <CardContent className="card-base">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[10px] bg-[#ffc4c4]">
                  <CalendarDays className="h-7 w-7 text-[#d25555]" />
                </div>
                <h2 className="t-h3 font-bold leading-snug text-black">Detail Kunjungan</h2>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                <dl className="space-y-0.5">
                  <dt className="t-caption font-medium text-[#b3b3b3]">POLIKLINIK</dt>
                  <dd className="t-body-lg font-normal text-black">{step2?.nm_poli ?? "—"}</dd>
                </dl>
                <dl className="space-y-0.5">
                  <dt className="t-caption font-medium text-[#b3b3b3]">DOKTER</dt>
                  <dd className="t-body-lg font-normal text-black">{step2?.nm_dokter ?? "—"}</dd>
                </dl>
                <dl className="space-y-0.5">
                  <dt className="t-caption font-medium text-[#b3b3b3]">TANGGAL PERIKSA</dt>
                  <dd className="t-body-lg font-normal text-black">
                    {formatTanggalKunjungan(step2?.tanggal_periksa ?? "")}
                  </dd>
                </dl>
                <dl className="space-y-0.5">
                  <dt className="t-caption font-medium text-[#b3b3b3]">WAKTU</dt>
                  <dd className="t-body-lg font-normal text-black">
                    {step2?.waktu_kunjungan
                      ? `${step2.waktu_kunjungan} – ${step2.jam_selesai} WIB`
                      : "—"}
                  </dd>
                </dl>
                <dl className="space-y-0.5">
                  <dt className="t-caption font-medium text-[#b3b3b3]">PENJAMIN</dt>
                  <dd className="t-body-lg font-normal text-black">{step2?.png_jawab ?? "—"}</dd>
                </dl>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Persetujuan */}
        <div className="mt-6 flex items-start gap-3">
          <button
            type="button"
            onClick={() => setConsent((c) => !c)}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
              consent
                ? "border-[#13c6f3] bg-[#13c6f3]"
                : "border-[#d9d9d9] bg-white"
            }`}
          >
            {consent && <Check className="h-3 w-3 text-white" />}
          </button>
          <div className="t-body text-black">
            <span className="font-bold">Saya menyatakan data yang diisi sudah benar</span>
            <span className="font-medium">
              {" "}dan bersedia dihubungi oleh tim Klinik Rawat Inap Ampelgading
              Medical Centre untuk konfirmasi kunjungan.
            </span>
          </div>
        </div>

        {submitError && (
          <p className="mt-4 t-body-sm font-medium text-red-500">{submitError}</p>
        )}

        {/* Tombol */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="order-2 w-full lg:order-1 lg:w-auto">
            <p className="text-center t-body font-medium text-[#b3b3b3] lg:text-left">
              Data Anda aman dan hanya digunakan untuk keperluan administrasi klinik
            </p>
          </div>
          <div className="order-1 flex w-full flex-col gap-4 sm:flex-row sm:justify-end lg:order-2 lg:w-auto">
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-full border-2 border-black bg-transparent px-6 t-body font-medium text-black shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-transparent"
              onClick={() => router.push("/pendaftaran_online_2")}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Kembali
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="h-12 rounded-full bg-[#00b4d8] px-6 t-body font-medium text-white shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#00b4d8]/90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Kirim Pendaftaran ✓
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
