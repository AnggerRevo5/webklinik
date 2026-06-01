"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Loader2, HeartPulse, ShieldCheck } from "lucide-react";

const loadingCopyMap: Array<{
  match: string;
  title: string;
  description: string;
}> = [
  {
    match: "/pendaftaran_online",
    title: "Menyiapkan pendaftaran online",
    description: "Sebentar, kami sedang membuka alur pendaftaran Anda.",
  },
  {
    match: "/tentangkami",
    title: "Membuka halaman tentang kami",
    description: "Kami sedang memuat profil klinik dan informasi layanan.",
  },
  {
    match: "/",
    title: "Menyiapkan beranda",
    description: "Kami sedang memuat pengalaman pertama yang lebih ringan.",
  },
];

function getLoadingCopy(pathname: string) {
  const matched = loadingCopyMap.find((item) => {
    if (item.match === "/") return pathname === "/";
    return pathname.startsWith(item.match);
  });

  return (
    matched ?? {
      title: "Memuat halaman",
      description: "Kami sedang menyiapkan tampilan terbaik untuk Anda.",
    }
  );
}

function LoadingGlyph({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#00b4d8] border-r-[#00b4d8]/35"
      style={{
        animation: "spin 1.8s linear infinite",
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function LoadingScreen() {
  const pathname = usePathname();
  const { title, description } = getLoadingCopy(pathname);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(0,180,216,0.16),transparent_40%),linear-gradient(180deg,#f7f5f2_0%,#eefbff_100%)] px-4 py-10 text-[#3f3f3f]">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(0,180,216,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#00b4d8]/15 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[#e8861e]/10 blur-3xl" />

      <section className="relative w-full max-w-xl rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
            <LoadingGlyph delay={0} />
            <LoadingGlyph delay={0.45} />
            <LoadingGlyph delay={0.9} />
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00b4d8] to-[#1a5fa0] shadow-[0_18px_50px_-18px_rgba(0,180,216,0.7)]">
              <Image
                src="/assets/logo/LOGO.svg"
                alt="Ampelgading Medical Centre"
                width={38}
                height={38}
                priority
              />
            </div>
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00b4d8]/20 bg-[#00b4d8]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#00b4d8]">
            <HeartPulse className="h-3.5 w-3.5" />
            Klinik AMC
          </div>

          <h1 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-[2rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00b4d8]/10 text-[#00b4d8]">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-900">
                Sedang memuat
              </div>
              <div className="text-xs text-slate-500">
                Mohon tunggu sebentar
              </div>
            </div>
          </div>

          <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: "Aman" },
              { icon: HeartPulse, label: "Cepat" },
              { icon: Loader2, label: "Ringan" },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  <Icon className="h-4 w-4 text-[#00b4d8]" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
