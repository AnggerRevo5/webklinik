"use client";

import { useState } from "react";
import { Button } from "@/src/UiKecil/button";
import { ArrowLeft, MessageCircle, Smartphone } from "lucide-react";
import { softCardClass } from "@/src/components/pendaftaran_online/registration_shell";
import { cn } from "@/src/lib/utils";

const PLAYSTORE =
  "https://play.google.com/store/apps/details?id=app.bpjskesehatan.mobile";
const APPSTORE =
  "https://apps.apple.com/id/app/mobile-jkn/id1237601115";
const WHATSAPP =
  "https://wa.me/6281225566055?text=Halo%2C%20saya%20ingin%20daftar%20sebagai%20pasien%20BPJS";

const LANGKAH = [
  "Buka aplikasi Mobile JKN di HP Anda",
  "Login menggunakan akun BPJS Kesehatan",
  'Pilih menu "Pendaftaran Pelayanan"',
  "Cari Klinik Ampelgading Medical Centre",
  "Pilih poli, dokter, dan tanggal kunjungan",
  "Konfirmasi pendaftaran",
];

export default function MobileJKNRedirect({
  onBack,
}: {
  onBack: () => void;
}) {
  const [clicked, setClicked] = useState(false);

  const handleOpenMobileJKN = () => {
    setClicked(true);
    window.location.href = "mobilejkn://";
    setTimeout(() => {
      if (document.hasFocus()) {
        window.open(PLAYSTORE, "_blank");
      }
    }, 1500);
  };

  return (
    <div className={cn(softCardClass, "p-6 sm:p-7")}>
      <div className="mx-auto max-w-[560px]">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Smartphone className="h-8 w-8" />
          </div>
          <h2 className="t-h3 font-bold text-slate-900">
            Pasien BPJS Kesehatan
          </h2>
          <p className="mt-2 t-body text-slate-500">
            Pendaftaran peserta BPJS dilakukan melalui aplikasi{" "}
            <strong className="text-slate-900">Mobile JKN</strong>
          </p>
        </div>

        {/* Langkah-langkah */}
        <div className="mb-6 rounded-2xl border border-[#00b4d8]/15 bg-[#00b4d8]/5 p-4">
          <p className="mb-3 t-body-sm font-bold text-[#0f4c81]">
            Cara daftar via Mobile JKN:
          </p>
          <ol className="space-y-2.5">
            {LANGKAH.map((langkah, i) => (
              <li key={i} className="flex items-start gap-3 t-body-sm text-slate-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00b4d8] text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                {langkah}
              </li>
            ))}
          </ol>
        </div>

        {/* Tombol utama */}
        <Button
          onClick={handleOpenMobileJKN}
          className="btn-shine mb-3 h-12 w-full rounded-full bg-emerald-500 t-body font-semibold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          <Smartphone className="mr-2 h-5 w-5" />
          {clicked ? "Membuka Mobile JKN..." : "Buka Aplikasi Mobile JKN"}
        </Button>

        {/* Download links */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <a
            href={PLAYSTORE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 t-body-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span>🤖</span> Play Store
          </a>
          <a
            href={APPSTORE}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 t-body-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span>🍎</span> App Store
          </a>
        </div>

        {/* Info WhatsApp */}
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-3">
          <p className="t-body-sm text-amber-800">
            <strong>Info:</strong> Jika klinik belum tersedia di Mobile JKN,
            hubungi kami via WhatsApp untuk pendaftaran BPJS.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 t-body-sm font-semibold text-emerald-600 hover:underline"
          >
            <MessageCircle className="h-4 w-4" />
            Chat WhatsApp AMC
          </a>
        </div>

        {/* Kembali */}
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 w-full rounded-full border border-slate-300 bg-white t-body font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Kembali (saya bukan pasien BPJS)
        </Button>
      </div>
    </div>
  );
}
