"use client";

import { Clock3, Mail, Search, Send, Trash2, User, Check } from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

const inbox = [
	{ name: "Hendra Wijaya", time: "10 mnt", preview: "Apakah ada jadwal poling ke Desa Lebakharjo?", tag: "Informasi", unread: true, selected: true },
	{ name: "Rina Safitri", time: "1 jam", preview: "Mau tanya soal biaya persalinan normal", tag: "Biaya", unread: true },
	{ name: "Bambang S.", time: "2 jam", preview: "Apakah tersedia USG untuk ibu hamil?", tag: "Layanan", unread: true },
	{ name: "Agus Sutomo", time: "3 jam", preview: "Terima kasih pelayanannya sangat baik", tag: "Apresiasi" },
];

export default function AdminPesanLogin() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman pesan masuk admin KRI AMC</h2>
			<div className="grid min-h-[700px] grid-cols-[56px_minmax(0,1fr)] overflow-hidden rounded-3xl bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="pesan" />
				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<div className="text-[15px] font-semibold text-slate-900">Pesan Masuk</div>
							<div className="text-[9px] text-slate-500">Inbox dari form kontak website — 3 pesan belum dibaca</div>
						</div>
						<button type="button" className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-500"><Check className="h-3 w-3" />Tandai semua dibaca</button>
					</header>

					<div className="grid flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:p-5">
						<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
							<div className="border-b border-slate-100 p-3">
								<div className="relative">
									<Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
									<input className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[10px] outline-none" placeholder="Cari pesan..." readOnly />
								</div>
							</div>
							<div className="flex gap-2 border-b border-slate-100 p-2 text-[8px] font-medium">
								<span className="rounded-full bg-sky-600 px-3 py-1 text-white">Semua</span>
								<span className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">Belum dibaca (3)</span>
								<span className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">Sudah dibaca</span>
							</div>
							<div className="divide-y divide-slate-100">
								{inbox.map((item) => (
									<article key={item.name} className={`flex gap-3 p-3 text-[10px] ${item.selected ? "bg-sky-50" : ""} ${item.unread ? "border-l-4 border-rose-500" : ""}`}>
										<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600"><User className="h-3.5 w-3.5" /></div>
										<div className="min-w-0 flex-1">
											<div className="flex items-center justify-between gap-2">
												<div className="font-medium text-slate-900">{item.name}</div>
												<div className="text-[8px] text-slate-400">{item.time}</div>
											</div>
											<div className="truncate text-[9px] text-slate-500">{item.preview}</div>
											<div className="mt-1 inline-flex rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">{item.tag}</div>
										</div>
									</article>
								))}
							</div>
						</section>

						<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
							<div className="border-b border-slate-100 p-4">
								<div className="text-[13px] font-semibold text-slate-900">Hendra Wijaya</div>
								<div className="mt-1 flex flex-wrap items-center gap-3 text-[9px] text-slate-400">
									<span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> 0812-3456-7890</span>
									<span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> 10 menit lalu</span>
									<span className="rounded-full bg-sky-50 px-2 py-1 font-semibold text-sky-600">Informasi</span>
									<span className="rounded-full bg-rose-50 px-2 py-1 font-semibold text-rose-600">Belum dibaca</span>
								</div>
							</div>
							<div className="space-y-3 p-4 text-[10px]">
								<div className="inline-flex rounded-full bg-sky-50 px-3 py-1.5 text-[9px] font-semibold text-sky-600">Keperluan: Informasi layanan</div>
								<div className="rounded-2xl bg-slate-100 p-4 leading-7 text-slate-700">Selamat siang, saya ingin menanyakan apakah ada jadwal poling ke Desa Lebakharjo bulan ini? Kami sangat membutuhkan layanan kesehatan di desa kami. Terima kasih.</div>
								<div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
									<span className="text-[9px] text-slate-500">Status:</span>
									<span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[9px] font-medium">Belum dibalas</span>
								</div>
							</div>
							<div className="flex flex-wrap gap-2 border-t border-slate-100 p-3">
								<button type="button" className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-500 px-3 py-2 text-[10px] font-medium text-white"><Send className="h-3.5 w-3.5" />Balas via WhatsApp</button>
								<button type="button" className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500"><Check className="h-3.5 w-3.5" />Tandai dibaca</button>
								<button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
							</div>
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}