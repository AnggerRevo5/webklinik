"use client";

import * as React from "react";
import { Check, ShieldCheck } from "lucide-react";
import Navbar from "@/src/components/navbar";
import { Reveal } from "@/src/components/motion";
import { cn } from "@/src/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Kerangka bersama untuk seluruh alur pendaftaran online.
   Menyediakan: latar aurora, header band brand, stepper animasi,
   serta gaya field & kartu yang konsisten & profesional.
   Mempertahankan kombinasi warna: teal #00b4d8, hijau, krem #f7f5f2.
   ───────────────────────────────────────────────────────────── */

export const REG_STEPS = ["Data diri", "Kunjungan", "Konfirmasi"] as const;

/* Gaya field yang dipakai ulang di semua langkah */
export const fieldClass =
  "h-12 rounded-xl border border-slate-200 bg-white px-4 t-body text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus-visible:border-[#00b4d8] focus-visible:ring-2 focus-visible:ring-[#00b4d8]/30 focus-visible:ring-offset-0";
export const selectFieldClass =
  "h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 t-body text-slate-900 shadow-sm transition-colors focus:border-[#00b4d8] focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/30";
export const fieldLabelClass =
  "t-body-sm font-semibold text-slate-700";
export const sectionTitleClass =
  "inline-flex items-center gap-2 t-body-sm font-bold uppercase tracking-wider text-[#0f4c81]";

/* Kartu putih lembut yang dipakai untuk panel/sidebar */
export const softCardClass =
  "rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_30px_-18px_rgba(15,76,129,0.35)]";

export function Stepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="mx-auto mt-6 flex w-full max-w-[640px] items-center">
      {REG_STEPS.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const state =
          n < current ? "done" : n === current ? "current" : "upcoming";
        const isLast = i === REG_STEPS.length - 1;
        return (
          <li
            key={label}
            className={cn("flex items-center", !isLast && "flex-1")}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                  state === "done" &&
                    "bg-emerald-500 text-white shadow-md shadow-emerald-500/30",
                  state === "current" &&
                    "bg-white text-[#00b4d8] ring-2 ring-[#00b4d8]",
                  state === "upcoming" &&
                    "bg-white/60 text-slate-400 ring-1 ring-slate-300",
                )}
              >
                {state === "current" && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-[#00b4d8]/40 animate-ping" />
                )}
                {state === "done" ? <Check className="h-4.5 w-4.5" /> : n}
              </span>
              <span
                className={cn(
                  "t-caption font-semibold transition-colors max-[420px]:hidden",
                  state === "done" && "text-emerald-600",
                  state === "current" && "text-[#0f4c81]",
                  state === "upcoming" && "text-slate-400",
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200/80">
                <span
                  className={cn(
                    "block h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#00b4d8] transition-all duration-500",
                    n < current ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function RegistrationShell({
  current,
  title = "Pendaftaran Online",
  subtitle,
  badge = "Aman & Terenkripsi",
  children,
}: {
  current: 1 | 2 | 3;
  title?: string;
  subtitle?: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5f2] text-slate-900">
      <Navbar />

      {/* Latar aurora + grid halus */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="aurora-blob bg-[#00b4d8]/30"
          style={
            {
              top: "-6%",
              left: "-8%",
              width: "40vw",
              height: "40vw",
              ["--orb-dur"]: "18s",
            } as React.CSSProperties
          }
        />
        <div
          className="aurora-blob bg-[#1a5fa0]/20"
          style={
            {
              top: "20%",
              right: "-6%",
              width: "32vw",
              height: "32vw",
              ["--orb-dur"]: "22s",
              ["--orb-delay"]: "2s",
            } as React.CSSProperties
          }
        />
        <div className="absolute inset-0 bg-grid-soft opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f7f5f2]/30 to-[#f7f5f2]" />
      </div>

      <div className="section-wrap">
        {/* ── Header band brand ── */}
        <Reveal direction="up">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0f4c81] via-[#1a5fa0] to-[#00b4d8] p-7 text-white shadow-[0_30px_70px_-32px_rgba(15,76,129,0.6)] sm:p-9">
            <div className="pointer-events-none absolute inset-0 bg-grid-soft opacity-30" />
            <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#5fd0e8]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#e8861e]/20 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[12px] font-semibold backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-[#9be7f5]" />
                {badge}
              </span>
              <h1 className="mt-4 t-h2 font-bold tracking-tight">{title}</h1>
              {subtitle && (
                <p className="mt-2 max-w-[560px] t-body text-white/85">
                  {subtitle}
                </p>
              )}

              {/* Stepper di dalam strip translucent */}
              <div className="mt-6 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <StepperOnDark current={current} />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Konten langkah ── */}
        <div className="mt-7">{children}</div>
      </div>
    </main>
  );
}

/* Varian stepper untuk latar gelap (header band) */
function StepperOnDark({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="mx-auto flex w-full max-w-[560px] items-center">
      {REG_STEPS.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const state =
          n < current ? "done" : n === current ? "current" : "upcoming";
        const isLast = i === REG_STEPS.length - 1;
        return (
          <li
            key={label}
            className={cn("flex items-center", !isLast && "flex-1")}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                  state === "done" && "bg-emerald-400 text-white",
                  state === "current" && "bg-white text-[#0f4c81]",
                  state === "upcoming" && "bg-white/15 text-white/60",
                )}
              >
                {state === "current" && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-white/50 animate-ping" />
                )}
                {state === "done" ? <Check className="h-4 w-4" /> : n}
              </span>
              <span
                className={cn(
                  "t-body-sm font-semibold transition-colors max-[560px]:hidden",
                  state === "upcoming" ? "text-white/55" : "text-white",
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
                <span
                  className={cn(
                    "block h-full rounded-full bg-emerald-300 transition-all duration-500",
                    n < current ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* Kartu bantuan WhatsApp yang konsisten dipakai di sidebar */
export function HelpCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#0f9bc0] p-5 text-white shadow-[0_18px_40px_-20px_rgba(0,180,216,0.6)]">
      <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
      <div className="relative">
        <h3 className="t-h4 font-bold">Butuh bantuan?</h3>
        <p className="mt-1.5 t-body-sm text-white/90">
          Kesulitan mengisi formulir? Tim kami siap membantu via WhatsApp.
        </p>
        <a
          href="https://wa.me/6281225566055"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-shine mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 t-body-sm font-semibold text-[#0f7d2e] shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Chat WhatsApp
        </a>
      </div>
    </div>
  );
}
