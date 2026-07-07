"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import {
  type ConsentState,
  loadConsent,
  saveConsent,
  onOpenCookieSettings,
} from "@/src/lib/consent";

// Modal consent cookie — muncul sebelum tracking apapun dimulai (kecuali
// fungsional dasar situs). Sesuai UU PDP: analitik defaultnya "setuju" tapi
// bisa ditolak sepenuhnya sebelum data terkirim. Situs publik TIDAK meminta
// lokasi GPS presisi sama sekali — kota/provinsi dari IP sudah cukup untuk
// analitik agregat (lihat kebijakan_privasi.tsx).
export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [analyticsPref, setAnalyticsPref] = useState(true);

  useEffect(() => {
    if (!loadConsent()) {
      const timer = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => onOpenCookieSettings(() => setShow(true)), []);

  const applyConsent = (analytics: boolean) => {
    const full: ConsentState = { analytics, timestamp: new Date().toISOString() };
    saveConsent(full);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-100 flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-15px_rgba(15,76,129,0.35)] sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00b4d8]/10 text-[#00b4d8]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="t-h4 font-bold text-slate-900">Kebijakan Privasi & Cookie</h2>
            <p className="t-caption text-slate-500">KRI Ampelgading Medical Centre</p>
          </div>
        </div>

        <p className="t-body-sm mb-4 leading-relaxed text-slate-600">
          Kami menggunakan cookie untuk mengenali kunjungan Anda dan menganalisis pola
          kunjungan situs secara agregat, guna meningkatkan layanan klinik. Data tidak
          dijual atau dibagikan ke pihak ketiga untuk kepentingan iklan.
        </p>

        {showDetail && (
          <div className="mb-4 space-y-3 rounded-xl bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="t-body-sm font-semibold text-slate-800">
                  Analitik Pengunjung <span className="text-[#00b4d8]">(disarankan)</span>
                </p>
                <p className="t-caption text-slate-500">
                  Halaman yang dikunjungi, jenis perangkat, dan kota/wilayah asal
                  (dari IP, bukan lokasi presisi) untuk statistik agregat.
                </p>
              </div>
              <button
                type="button"
                aria-label="Toggle analitik"
                onClick={() => setAnalyticsPref((p) => !p)}
                className={`mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full px-1 transition-colors ${
                  analyticsPref ? "justify-end bg-[#00b4d8]" : "justify-start bg-slate-300"
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-white shadow" />
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowDetail((p) => !p)}
          className="mb-4 inline-flex items-center gap-1 t-caption font-medium text-[#0f4c81] hover:underline"
        >
          {showDetail ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {showDetail ? "Sembunyikan detail" : "Atur preferensi cookie"}
        </button>

        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => applyConsent(true)}
            className="btn-shine h-11 flex-1 rounded-full bg-[#00b4d8] t-body-sm font-semibold text-white shadow-md shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#06a8ca]"
          >
            Setuju Semua
          </button>
          {showDetail && (
            <button
              type="button"
              onClick={() => applyConsent(analyticsPref)}
              className="h-11 flex-1 rounded-full border border-[#00b4d8] t-body-sm font-semibold text-[#0f4c81] transition-colors hover:bg-[#00b4d8]/5"
            >
              Simpan Pilihan Saya
            </button>
          )}
          <button
            type="button"
            onClick={() => applyConsent(false)}
            className="h-11 flex-1 t-body-sm font-medium text-slate-400 transition-colors hover:text-slate-600"
          >
            Tolak semua
          </button>
        </div>

        <p className="mt-3 text-center t-caption text-slate-400">
          Dengan melanjutkan, Anda menyetujui{" "}
          <a href="/kebijakan-privasi" className="text-[#00b4d8] hover:underline" target="_blank">
            Kebijakan Privasi
          </a>{" "}
          kami.
        </p>
      </div>
    </div>
  );
}
