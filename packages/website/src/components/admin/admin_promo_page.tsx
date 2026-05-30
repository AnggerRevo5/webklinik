"use client";

import { CalendarDays, ClipboardList, Copy, Download, Edit3, Eye, Gift, Plus, Save, Tag, Trash2, Upload } from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

const promos = [
	{ title: "Promo Kemerdekaan — Diskon 17%", desc: "Diskon biaya rawat inap 17% untuk semua kelas kamar selama Agustus 2026", status: "Aktif", badge: "Rawat Inap", period: "1 - 31 Agu 2026", countdown: "82" },
	{ title: "Paket Persalinan Normal Hemat", desc: "Gratis 1 hari perawatan ibu dan bayi untuk persalinan normal", status: "Aktif", badge: "Persalinan", period: "Jun - Jul 2026", countdown: "30" },
	{ title: "Paket MCU Akhir Tahun", desc: "Paket medical check up lengkap dengan harga spesial akhir tahun", status: "Draft", badge: "Medical Check Up", period: "Belum dijadwalkan", countdown: "" },
	{ title: "Promo MCU Awal Tahun", desc: "Paket medical check up dengan diskon 20%", status: "Expired", badge: "", period: "1-31 Jan 2026", countdown: "" },
];

export default function AdminPromoPage() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman admin kelola promo KRI AMC</h2>
			<div className="grid min-h-[700px] grid-cols-[56px_minmax(0,1fr)] overflow-hidden rounded-3xl bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="promo" />
				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<div className="text-[15px] font-semibold text-slate-900">Promo</div>
							<div className="text-[9px] text-slate-500">Kelola promo dan penawaran khusus klinik</div>
						</div>
						<button type="button" className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white"><Plus className="h-3 w-3" />Buat promo baru</button>
					</header>

					<div className="grid flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[minmax(0,1fr)_380px] lg:p-5">
						<section className="space-y-3">
							<div className="flex flex-wrap gap-2 text-[9px] font-medium">
								{["Semua (6)", "Aktif (2)", "Draft (2)", "Expired (2)"].map((label, index) => (
									<span key={label} className={`rounded-full border px-3 py-1.5 ${index === 0 ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500"}`}>{label}</span>
								))}
							</div>
							<div className="space-y-3">
								{promos.map((promo, index) => (
									<article key={promo.title} className={`grid overflow-hidden rounded-2xl border bg-white shadow-sm md:grid-cols-[160px_minmax(0,1fr)] ${index === 0 ? "border-sky-600 ring-2 ring-sky-100" : "border-slate-200"}`}>
										<div className={`relative min-h-[120px] bg-gradient-to-br ${index === 0 ? "from-sky-600 to-sky-800" : index === 1 ? "from-emerald-500 to-emerald-700" : index === 2 ? "from-amber-300 to-orange-500" : "from-slate-300 to-slate-400"}`}>
											<div className="absolute inset-0 flex items-center justify-center text-white/40"><Gift className="h-10 w-10" /></div>
										</div>
										<div className="flex flex-col gap-2 p-4 text-[10px]">
											<div className="flex flex-wrap items-center gap-2">
												<span className={`rounded-full px-2 py-1 text-[8px] font-semibold ${promo.status === "Aktif" ? "bg-emerald-50 text-emerald-600" : promo.status === "Draft" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>{promo.status}</span>
												{promo.badge ? <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">{promo.badge}</span> : null}
											</div>
											<div className="text-[12px] font-semibold text-slate-900">{promo.title}</div>
											<div className="leading-6 text-slate-500">{promo.desc}</div>
											<div className="mt-auto flex flex-wrap items-center gap-3 text-slate-500">
												<span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{promo.period}</span>
												{promo.countdown ? <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-600"><span className="font-semibold">{promo.countdown}</span> hari lagi</span> : null}
											</div>
											<div className="flex gap-1 pt-1">
												<button type="button" className="rounded-md bg-sky-50 p-1.5 text-sky-600"><Edit3 className="h-3.5 w-3.5" /></button>
												<button type="button" className="rounded-md bg-slate-50 p-1.5 text-slate-500"><Eye className="h-3.5 w-3.5" /></button>
												<button type="button" className="rounded-md bg-rose-50 p-1.5 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
											</div>
										</div>
									</article>
								))}
							</div>
						</section>

						<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
							<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
								<div className="flex items-center gap-2 text-[12px] font-medium text-slate-900"><Tag className="h-4 w-4 text-amber-500" />Edit promo</div>
								<span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-600">Aktif</span>
							</div>
							<div className="space-y-3 p-4 text-[10px]">
								<div className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 p-3 text-white">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Tag className="h-5 w-5" /></div>
										<div><div className="text-[11px] font-medium">Promo Kemerdekaan — Diskon 17%</div><div className="text-[8px] text-white/70">Tampilan di website</div></div>
									</div>
								</div>
								<button type="button" className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-500"><Upload className="h-5 w-5" />Upload gambar promo (1200×630px)</button>
								{[
									["Judul promo", "Promo Kemerdekaan — Diskon 17%"],
									["Deskripsi", "Diskon biaya rawat inap 17% untuk semua kelas kamar selama bulan Agustus 2026."],
									["Tanggal mulai", "01/08/2026"],
									["Tanggal berakhir", "31/08/2026"],
									["Kategori", "Rawat Inap"],
									["Diskon", "17%"],
									["Status", "Aktif"],
								].map(([label, value], index) => (
									<div key={label as string} className={index === 1 ? "" : ""}>
										<div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">{label as string}</div>
										{index === 1 ? <textarea className="h-16 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none" defaultValue={value as string} readOnly /> : <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 outline-none" defaultValue={value as string} readOnly />}
									</div>
								))}
							</div>
							<div className="flex gap-2 border-t border-slate-100 px-4 py-3">
								<button type="button" className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500">Batal</button>
								<button type="button" className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white"><Save className="h-3.5 w-3.5" />Simpan</button>
								<button type="button" className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-medium text-emerald-600"><Eye className="h-3.5 w-3.5" />Preview</button>
							</div>
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}