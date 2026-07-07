"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, Clock3, Home, MessageCircle, Stethoscope } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/UiKecil/button";
import Navbar from "@/src/components/navbar";
import { Reveal } from "@/src/components/motion";
import {
  clearPendaftaranSession,
  loadPendaftaranSession,
  type PendaftaranSession,
} from "@/src/lib/api";

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

export default function LamanKonfirmasiPendaftaran() {
  const [session, setSession] = useState<PendaftaranSession>({});

  useEffect(() => {
    // Sengaja setelah mount (bukan lazy initial state) supaya tidak hydration
    // mismatch — SSR tidak punya akses sessionStorage, jadi render pertama
    // client HARUS sama dengan server ({}), baru diisi data asli sesudahnya.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(loadPendaftaranSession());
  }, []);

  const { result, step1, step2 } = session;

  const noReg = result?.no_reg ?? "—";
  const tanggal = result?.tanggal_periksa ?? step2?.tanggal_periksa ?? "";
  const waktu = result?.waktu_kunjungan ?? step2?.waktu_kunjungan ?? "—";
  const nmDokter = result?.nm_dokter ?? step2?.nm_dokter ?? "—";
  const nmPoli = result?.nm_poli ?? step2?.nm_poli ?? "—";
  const noTlp = step1?.no_tlp ?? "—";

  // Waktu ringkas untuk tampilan (ambil hh:mm saja)
  const waktuRingkas = waktu.includes(" ")
    ? waktu.split(" ")[1]?.slice(0, 5)
    : waktu.slice(0, 5);

  const detailItems = [
    { icon: Stethoscope, label: "Poliklinik", value: nmPoli },
    { icon: Stethoscope, label: "Dokter", value: nmDokter },
    { icon: CalendarDays, label: "Tanggal Periksa", value: formatTanggalKunjungan(tanggal) },
    { icon: Clock3, label: "Waktu", value: `${waktuRingkas} WIB` },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5f2] text-slate-900">
      <Navbar />

      {/* Latar aurora */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-emerald-400/25"
          style={{ top: "-6%", left: "-6%", width: "38vw", height: "38vw", ["--orb-dur"]: "18s" } as React.CSSProperties}
        />
        <div
          className="aurora-blob bg-[#00b4d8]/25"
          style={{ bottom: "-8%", right: "-6%", width: "34vw", height: "34vw", ["--orb-dur"]: "22s", ["--orb-delay"]: "2s" } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-grid-soft opacity-50" />
      </div>

      <div className="section-wrap">
        <Reveal direction="up">
          <div className="relative mx-auto w-full max-w-[760px] overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 p-7 text-center shadow-[0_40px_90px_-40px_rgba(15,76,129,0.5)] backdrop-blur sm:p-10">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-400 via-[#00b4d8] to-[#e8861e]" />

            {/* Success badge */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-emerald-400/20" style={{ animation: "soft-pulse 2.2s ease-out infinite" }} />
              <span className="absolute inset-2 rounded-full bg-emerald-400/30" style={{ animation: "soft-pulse 2.2s ease-out 0.3s infinite" }} />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/40">
                <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
              </span>
            </div>

            <h1 className="t-h2 font-bold text-slate-900">Pendaftaran berhasil!</h1>
            <p className="mx-auto mt-3 max-w-[520px] t-body-lg text-slate-500">
              Terima kasih telah mendaftar di KRI Ampelgading Medical Centre
            </p>

            {/* Nomor registrasi */}
            <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-[#00b4d8]/20 bg-[#00b4d8]/8 px-7 py-3">
              <span className="t-caption font-semibold uppercase tracking-wider text-[#0f4c81]">
                Nomor Registrasi
              </span>
              <span className="t-h3 font-bold tracking-wide text-[#0f4c81]">{noReg}</span>
            </div>

            {/* Detail grid */}
            <div className="mx-auto mt-7 grid w-full max-w-[560px] grid-cols-1 gap-3 sm:grid-cols-2">
              {detailItems.map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00b4d8]/10 text-[#00b4d8]">
                    <item.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="t-caption font-medium uppercase tracking-wider text-slate-400">{item.label}</p>
                    <p className="mt-0.5 t-body-sm font-bold text-slate-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="mx-auto mt-6 max-w-[560px] space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
              <p className="t-body-sm text-amber-900">
                Harap datang <span className="font-bold">15 menit sebelum</span> waktu
                kunjungan. Tunjukkan nomor registrasi{" "}
                <span className="font-bold">{noReg}</span> kepada petugas.
              </p>
              <p className="t-body-sm text-amber-900">
                Tim kami akan menghubungi Anda di{" "}
                <span className="font-bold">{noTlp}</span> untuk konfirmasi kunjungan.
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                  Status: Menunggu konfirmasi
                </span>
              </p>
            </div>

            <nav
              className="mx-auto mt-8 grid w-full max-w-[560px] grid-cols-1 sm:grid-cols-2"
              style={{ gap: "var(--gap-cards)" }}
            >
              <Button
                type="button"
                asChild
                onClick={clearPendaftaranSession}
                className="btn-shine h-12 w-full rounded-full bg-[#00b4d8] px-6 t-body font-medium text-white shadow-lg shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#00a7c9]"
              >
                <Link href="/">
                  <span className="flex items-center justify-center gap-3">
                    <Home className="h-5 w-5" />
                    <span>Ke beranda</span>
                  </span>
                </Link>
              </Button>
              <Button
                type="button"
                asChild
                className="btn-shine h-12 w-full rounded-full bg-[#008000] px-6 t-body font-medium text-white shadow-lg shadow-emerald-900/20 transition-transform hover:-translate-y-0.5 hover:bg-[#0a720a]"
              >
                <Link
                  href="https://wa.me/6281225566055"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="flex items-center justify-center gap-3">
                    <MessageCircle className="h-5 w-5" />
                    <span>Whatsapp</span>
                  </span>
                </Link>
              </Button>
            </nav>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
