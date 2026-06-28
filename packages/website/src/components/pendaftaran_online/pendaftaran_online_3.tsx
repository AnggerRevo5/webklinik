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
import { cn } from "@/src/lib/utils";
import { Reveal } from "@/src/components/motion";
import {
  RegistrationShell,
  softCardClass,
} from "@/src/components/pendaftaran_online/registration_shell";
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
    <RegistrationShell
      current={3}
      subtitle="Periksa kembali data Anda sebelum mengirim pendaftaran"
    >
      <Reveal direction="up">
        {/* Ringkasan */}
        <div className="space-y-4">
          {/* Data Pasien */}
          <div className={cn(softCardClass, "w-full p-5 sm:p-6")}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00b4d8]/10 text-[#00b4d8]">
                  <Check className="h-5 w-5" />
                </div>
                <h2 className="t-h3 font-bold leading-none text-slate-900">Data Pasien</h2>
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
          </div>

          {/* Detail Kunjungan */}
          <div className={cn(softCardClass, "w-full p-5 sm:p-6")}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl bg-[#e8861e]/10">
                  <CalendarDays className="h-7 w-7 text-[#e8861e]" />
                </div>
                <h2 className="t-h3 font-bold leading-snug text-slate-900">Detail Kunjungan</h2>
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
          </div>

          {/* Persetujuan */}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={() => setConsent((c) => !c)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                consent
                  ? "border-[#00b4d8] bg-[#00b4d8]"
                  : "border-slate-300 bg-white"
              }`}
            >
              {consent && <Check className="h-3 w-3 text-white" />}
            </button>
            <div className="t-body-sm text-slate-700" onClick={() => setConsent((c) => !c)}>
              <span className="font-bold text-slate-900">Saya menyatakan data yang diisi sudah benar</span>
              <span>
                {" "}dan bersedia dihubungi oleh tim Klinik Rawat Inap Ampelgading
                Medical Centre untuk konfirmasi kunjungan.
              </span>
            </div>
          </label>

          {submitError && (
            <p className="t-body-sm font-medium text-red-500">{submitError}</p>
          )}

          {/* Tombol */}
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <p className="order-2 text-center t-body-sm text-slate-400 lg:order-1 lg:text-left">
              Data Anda aman dan hanya digunakan untuk keperluan administrasi klinik
            </p>
            <div className="order-1 flex w-full flex-col gap-3 sm:flex-row sm:justify-end lg:order-2 lg:w-auto">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-full border border-slate-300 bg-white px-6 t-body font-medium text-slate-700 transition-transform hover:-translate-y-0.5 hover:bg-slate-50"
                onClick={() => router.push("/pendaftaran_online_2")}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Kembali
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-shine h-12 rounded-full bg-[#00b4d8] px-6 t-body font-medium text-white shadow-lg shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#05abce] disabled:opacity-60 disabled:hover:translate-y-0"
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
      </Reveal>
    </RegistrationShell>
  );
}
