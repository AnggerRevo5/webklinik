"use client";

import { Key, Lock, MessageCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const WHATSAPP_URL = "https://wa.me/6281225566055";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login gagal");
        return;
      }
      const redirect = searchParams.get("redirect") ?? "/dashboard_admin";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman login admin KRI AMC</h2>

      <div className="grid min-h-dvh w-full overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] xl:grid-cols-2">
        {/* Panel kiri — branding */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-slate-900 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-500/10" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-500/10" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-amber-400 bg-sky-600 text-[11px] font-bold text-amber-400">
              AMC
            </div>
            <div>
              <div className="text-[13px] font-semibold">
                Ampelgading Medical Centre
              </div>
              <div className="text-[9px] text-slate-300">Dashboard Admin</div>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="font-serif text-[28px] font-semibold leading-tight sm:text-[34px]">
              Kelola klinik lebih{" "}
              <span className="italic text-amber-400">mudah</span>
            </div>
            <p className="mt-4 text-[11px] leading-7 text-slate-300">
              Panel admin KRI AMC untuk mengelola pendaftaran pasien, konten
              website, dan memantau performa klinik secara real-time.
            </p>
            <ul className="mt-6 space-y-3 text-[10px] text-slate-300">
              {[
                "Kelola pendaftaran & jadwal dokter",
                "Update promo, galeri, dan artikel",
                "Pantau analytics website & sosmed",
                "Monitor ketersediaan kamar rawat inap",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 text-[8px] text-slate-400">
            © 2026 KRI Ampelgading Medical Centre · PT Banar Medika Mandiri
          </div>
        </section>

        {/* Panel kanan — form login */}
        <section className="flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-[22px] font-semibold text-slate-900">
              Selamat datang
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              Masuk ke dashboard admin klinik
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-700">
                  Password
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password admin"
                    required
                    autoFocus
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-[11px] outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-[10px] text-rose-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-[12px] font-medium text-white shadow-[0_8px_24px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <Key className="h-4 w-4" />
                {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[8px] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              atau
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[11px] font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              Minta akses via WhatsApp
            </a>

            <div className="mt-4 text-center text-[8px] text-slate-400">
              Hubungi administrator jika mengalami masalah login
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
