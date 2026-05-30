"use client";

import { Check, Key, Lock, MessageCircle, User } from "lucide-react";

export default function AdminLoginPage() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman login admin KRI AMC</h2>

			<div className="grid min-h-[700px] overflow-hidden rounded-3xl bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] xl:grid-cols-2">
				<section className="relative flex flex-col justify-between overflow-hidden bg-slate-900 p-8 text-white sm:p-10">
					<div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-500/10" />
					<div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber-500/10" />

					<div className="relative z-10 flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-amber-400 bg-sky-600 text-[11px] font-bold text-amber-400">AMC</div>
						<div>
							<div className="text-[13px] font-semibold">Ampelgading Medical Centre</div>
							<div className="text-[9px] text-slate-300">Dashboard Admin</div>
						</div>
					</div>

					<div className="relative z-10 max-w-md">
						<div className="font-serif text-[28px] font-semibold leading-tight sm:text-[34px]">Kelola klinik lebih <span className="text-amber-400 italic">mudah</span></div>
						<p className="mt-4 text-[11px] leading-7 text-slate-300">Panel admin KRI AMC untuk mengelola pendaftaran pasien, konten website, dan memantau performa klinik secara real-time.</p>

						<ul className="mt-6 space-y-3 text-[10px] text-slate-300">
							<li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Kelola pendaftaran & jadwal dokter</li>
							<li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Update promo, galeri, dan artikel</li>
							<li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Pantau analytics website & sosmed</li>
							<li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Monitor ketersediaan kamar rawat inap</li>
						</ul>
					</div>

					<div className="relative z-10 text-[8px] text-slate-400">© 2026 KRI Ampelgading Medical Centre · PT Banar Medika Mandiri</div>
				</section>

				<section className="flex items-center justify-center p-6 sm:p-10">
					<div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
						<div className="text-[22px] font-semibold text-slate-900">Selamat datang</div>
						<div className="mt-1 text-[10px] text-slate-500">Masuk ke dashboard admin klinik</div>

						<div className="mt-6 space-y-4">
							<div>
								<div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-700">Username</div>
								<div className="relative">
									<User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
									<input className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-[11px] outline-none" placeholder="Masukkan username" readOnly />
								</div>
							</div>

							<div>
								<div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.5px] text-slate-700">Password</div>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
									<input className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-[11px] outline-none" placeholder="Masukkan password" type="password" readOnly />
								</div>
							</div>
						</div>

						<div className="mt-4 flex items-center justify-between text-[9px] text-slate-500">
							<span className="inline-flex items-center gap-2"><span className="flex h-4 w-4 items-center justify-center rounded border border-sky-600 bg-sky-600 text-white"><Check className="h-2.5 w-2.5" /></span>Ingat saya</span>
							<span className="text-sky-600">Lupa password?</span>
						</div>

						<button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-[12px] font-medium text-white shadow-[0_8px_24px_rgba(37,99,235,0.28)]"><Key className="h-4 w-4" />Masuk ke Dashboard</button>

						<div className="my-5 flex items-center gap-3 text-[8px] text-slate-400"><span className="h-px flex-1 bg-slate-200" />atau<span className="h-px flex-1 bg-slate-200" /></div>

						<button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[11px] font-medium text-slate-700"><MessageCircle className="h-4 w-4 text-emerald-500" />Minta akses via WhatsApp</button>

						<div className="mt-4 text-center text-[8px] text-slate-400">Hubungi administrator jika mengalami masalah login</div>
					</div>
				</section>
			</div>
		</main>
	);
}