"use client";

import { Check, Eye, EyeOff, Key, Lock, MessageCircle, ShieldCheck, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const WHATSAPP_URL = "https://wa.me/6281225566055";

const HIGHLIGHTS = [
  "Kelola pendaftaran & jadwal dokter",
  "Update promo, galeri, dan artikel",
  "Pantau analytics website & sosmed",
  "Monitor ketersediaan kamar rawat inap",
];

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
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

      <div className="grid min-h-dvh w-full overflow-hidden bg-[#F0F4FA] xl:grid-cols-2">
        {/* ── Panel brand ── */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-[#0D1B2A] via-[#13314f] to-[#0f4c81] px-10 py-10 text-white xl:flex">
          <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-20" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <img src="/assets/logo/LOGO.svg" alt="Logo AMC" className="h-9 w-9" />
            </div>
            <div>
              <div className="text-[14px] font-bold">Ampelgading Medical Centre</div>
              <div className="text-[10px] text-sky-200/70">Dashboard Admin</div>
            </div>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="text-[34px] font-bold leading-tight">
              Kelola klinik lebih{" "}
              <span className="text-amber-400">mudah</span>
            </div>
            <p className="mt-4 text-[12px] leading-7 text-slate-300">
              Panel admin KRI AMC untuk mengelola pendaftaran pasien, konten
              website, dan memantau performa klinik secara real-time.
            </p>

            <ul className="mt-7 space-y-3.5 text-[12px] text-slate-200">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-300">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 text-[10px] text-slate-400">
            © 2026 KRI Ampelgading Medical Centre · PT Banar Medika Mandiri
          </div>
        </section>

        {/* ── Panel form ── */}
        <section className="relative flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-40" />
          <div className="pointer-events-none absolute -right-10 top-10 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_30px_70px_-40px_rgba(15,76,129,0.5)] backdrop-blur sm:p-8">
            {/* Brand mini untuk mobile */}
            <div className="mb-6 flex items-center gap-3 xl:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#0D1B2A] to-[#13314f]">
                <img src="/assets/logo/LOGO.svg" alt="Logo AMC" className="h-8 w-8" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-slate-900">KRI AMC</div>
                <div className="text-[10px] text-slate-400">Dashboard Admin</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[10px] font-semibold text-sky-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Akses Terlindungi
            </div>
            <div className="mt-4 text-[24px] font-bold text-slate-900">
              Selamat datang
            </div>
            <div className="mt-1 text-[12px] text-slate-500">
              Masuk ke dashboard admin klinik
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3 text-[12px] text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                    placeholder="Masukkan username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-[12px] text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                    placeholder="Masukkan password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={() => setRemember((v) => !v)}
                  className="inline-flex items-center gap-2"
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${remember ? "border-sky-600 bg-sky-600 text-white" : "border-slate-300 bg-white"}`}>
                    {remember && <Check className="h-2.5 w-2.5" />}
                  </span>
                  Ingat saya
                </button>
                <span className="cursor-pointer font-medium text-sky-600 hover:underline">Lupa password?</span>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-[10px] text-rose-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !username || !password}
                className="btn-shine mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-600 to-cyan-500 px-4 py-3 text-[13px] font-semibold text-white shadow-lg shadow-sky-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sky-600/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <Key className="h-4 w-4" />
                {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[10px] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              atau
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              Minta akses via WhatsApp
            </a>

            <div className="mt-4 text-center text-[10px] text-slate-400">
              Hubungi administrator jika mengalami masalah login
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
