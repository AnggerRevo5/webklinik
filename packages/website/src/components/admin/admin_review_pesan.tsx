"use client";

import { Clock3, Eye, EyeOff, Mail, RefreshCw, Send, Star, StarOff, Trash2, User, Users, Check } from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

const reviews = [
	{ name: "Suhartini", date: "3 bulan lalu · Google Maps", text: "Alhamdulillah anak saya dirawat di sini pelayanannya sangat baik. Dokter dan perawatnya ramah, tidak ada bedanya antara pasien BPJS dan umum.", tag: "Pasien BPJS", featured: true, active: true, score: 5 },
	{ name: "Ahmad Ridwan", date: "5 bulan lalu · Google Maps", text: "Sudah jadi pasien sejak 2013, dari awal masih praktik mandiri sampai sekarang jadi klinik. Pelayanan dan pendekatan dokternya sangat membantu.", tag: "Pasien lama", featured: true, active: true, score: 5 },
	{ name: "Rudi Hartono", date: "2 bulan lalu · Google Maps", text: "Antriannya agak lama, tapi pelayanan dokternya oke. Semoga bisa diperbaiki lagi sistem antriannya.", tag: "Disembunyikan", featured: false, active: false, score: 3 },
];

const messages = [
	{ name: "Hendra Wijaya", time: "10 mnt", preview: "Apakah ada jadwal poling ke Desa Lebakharjo?", unread: true, selected: true },
	{ name: "Rina Safitri", time: "1 jam", preview: "Mau tanya soal biaya persalinan normal", unread: true },
	{ name: "Bambang S.", time: "2 jam", preview: "Apakah tersedia USG untuk ibu hamil?", unread: true },
	{ name: "Agus Sutomo", time: "3 jam", preview: "Terima kasih pelayanannya sangat baik", unread: false },
];

export default function AdminReviewPesan() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman admin review testimoni dan pesan masuk KRI AMC</h2>
			<div className="grid min-h-[700px] grid-cols-[56px_minmax(0,1fr)] overflow-hidden rounded-3xl bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="review" />
				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex flex-wrap items-center gap-3">
							<div>
								<div className="text-[15px] font-semibold text-slate-900">Review & Pesan</div>
								<div className="text-[9px] text-slate-500">Kelola testimoni dan pesan masuk dari pengunjung</div>
							</div>
							<div className="flex rounded-lg bg-slate-100 p-0.5">
								<button type="button" className="rounded-md bg-white px-3 py-1 text-[10px] font-medium text-sky-600 shadow-sm"><Star className="mr-1 inline h-3 w-3" />Review</button>
								<button type="button" className="rounded-md px-3 py-1 text-[10px] font-medium text-slate-400"><Mail className="mr-1 inline h-3 w-3" />Pesan <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[7px] text-white">3</span></button>
							</div>
						</div>
						<div className="inline-flex items-center gap-1 text-[10px] text-slate-500"><RefreshCw className="h-3.5 w-3.5" />Sync Google</div>
					</header>

					<div className="flex-1 overflow-y-auto p-4 lg:p-5">
						<div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
							<div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
								<div className="text-center">
									<div className="text-[36px] font-bold leading-none text-slate-900">4.8</div>
									<div className="my-1 flex justify-center gap-1 text-amber-400"><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /><Star className="h-3.5 w-3.5 fill-current" /></div>
									<div className="text-[9px] text-slate-500">23 ulasan Google</div>
								</div>
								<div className="space-y-1 text-[9px] text-slate-500">
									{[
										["5", "20", "85%"],
										["4", "2", "10%"],
										["3", "1", "3%"],
										["2", "0", "0%"],
										["1", "0", "0%"],
									].map(([score, count, width]) => (
										<div key={score} className="flex items-center gap-2"><span className="w-3 text-right">{score}</span><div className="h-1.5 flex-1 rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width }} /></div><span className="w-4 text-right">{count}</span></div>
									))}
								</div>
								<div className="flex flex-col gap-2">
									<button type="button" className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-2 text-[9px] font-medium text-sky-600"><Eye className="h-3 w-3" />Buka Google Maps</button>
									<button type="button" className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-[9px] font-medium text-emerald-600"><RefreshCw className="h-3 w-3" />Sync ulasan</button>
									<button type="button" className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-[9px] font-medium text-amber-600"><Star className="h-3 w-3" />3 featured aktif</button>
								</div>
							</div>
						</div>

						<div className="mb-3 flex flex-wrap gap-2 text-[9px] font-medium">
							{["Semua (23)", "Featured (3)", "Ditampilkan (20)", "Disembunyikan (3)"].map((tab, index) => (
								<span key={tab} className={`rounded-full border px-3 py-1.5 ${index === 0 ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500"}`}>{tab}</span>
							))}
						</div>

						<div className="grid gap-4 xl:grid-cols-2">
							<section className="space-y-3">
								{reviews.map((review, index) => (
									<article key={review.name} className={`rounded-2xl border bg-white p-4 shadow-sm ${review.featured ? "border-amber-400 ring-2 ring-amber-50" : review.active ? "border-slate-200" : "border-slate-200 opacity-60"}`}>
										<div className="mb-2 flex items-center gap-3">
											<div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white ${index === 0 ? "bg-sky-600" : index === 1 ? "bg-emerald-600" : "bg-slate-400"}`}>{review.name[0]}</div>
											<div>
												<div className="text-[11px] font-medium text-slate-900">{review.name}</div>
												<div className="text-[8px] text-slate-400">{review.date}</div>
											</div>
											<div className="ml-auto flex gap-0.5 text-amber-400">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} className="h-3 w-3 fill-current" />)}</div>
										</div>
										<div className="text-[10px] leading-6 text-slate-600">{review.text}</div>
										<div className="mt-3 flex flex-wrap items-center gap-2">
											<span className={`rounded-full px-2 py-1 text-[8px] font-semibold ${index === 0 ? "bg-emerald-50 text-emerald-600" : index === 1 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>{review.tag}</span>
											{review.featured ? <span className="rounded-full bg-amber-50 px-2 py-1 text-[8px] font-semibold text-amber-700 inline-flex items-center gap-1"><Star className="h-2.5 w-2.5" />Featured</span> : null}
											<div className="ml-auto flex items-center gap-1">
												<span className="text-[8px] text-slate-400">Tampil</span>
												<button type="button" className={`relative h-[18px] w-8 rounded-full ${review.active ? "bg-sky-600" : "bg-slate-200"}`}><span className={`absolute top-[2px] h-3.5 w-3.5 rounded-full bg-white shadow-sm ${review.active ? "left-4" : "left-[2px]"}`} /></button>
												<button type="button" className="rounded-md bg-amber-50 p-1.5 text-amber-700"><StarOff className="h-3 w-3" /></button>
												<button type="button" className="rounded-md bg-rose-50 p-1.5 text-rose-600"><EyeOff className="h-3 w-3" /></button>
											</div>
										</div>
									</article>
								))}
							</section>

							<section className="space-y-3">
								<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
									<div className="border-b border-slate-100 px-4 py-3">
										<div className="text-[12px] font-semibold text-slate-900">Pesan Masuk</div>
										<div className="mt-2 flex gap-2 text-[8px] font-medium"><span className="rounded-full bg-sky-600 px-2 py-1 text-white">Semua</span><span className="rounded-full border border-slate-200 px-2 py-1 text-slate-500">Belum dibaca</span><span className="rounded-full border border-slate-200 px-2 py-1 text-slate-500">Sudah dibaca</span></div>
									</div>
									<div className="divide-y divide-slate-100">
										{messages.map((message) => (
											<article key={message.name} className={`flex gap-3 p-3 text-[10px] ${message.selected ? "bg-sky-50" : ""} ${message.unread ? "border-l-4 border-rose-500" : ""}`}>
												<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600"><User className="h-3.5 w-3.5" /></div>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between gap-2"><div className="font-medium text-slate-900">{message.name}</div><div className="text-[8px] text-slate-400">{message.time}</div></div>
													<div className="truncate text-[9px] text-slate-500">{message.preview}</div>
												</div>
											</article>
										))}
									</div>
								</div>
								<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
									<div className="border-b border-slate-100 px-4 py-3">
										<div className="text-[13px] font-semibold text-slate-900">Hendra Wijaya</div>
										<div className="mt-1 flex flex-wrap items-center gap-3 text-[9px] text-slate-400"><span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />0812-3456-7890</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />10 menit lalu</span></div>
									</div>
									<div className="space-y-3 p-4 text-[10px]">
										<div className="inline-flex rounded-full bg-sky-50 px-3 py-1.5 text-[9px] font-semibold text-sky-600">Keperluan: Informasi layanan</div>
										<div className="rounded-2xl bg-slate-100 p-4 leading-7 text-slate-700">Selamat siang, saya ingin menanyakan apakah ada jadwal poling ke Desa Lebakharjo bulan ini? Kami sangat membutuhkan layanan kesehatan di desa kami. Terima kasih.</div>
										<div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3"><span className="text-[9px] text-slate-500">Status:</span><span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[9px] font-medium">Belum dibalas</span></div>
									</div>
									<div className="flex gap-2 border-t border-slate-100 p-3">
										<button type="button" className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-[10px] font-medium text-white inline-flex items-center justify-center gap-1"><Send className="h-3.5 w-3.5" />Balas via WhatsApp</button>
										<button type="button" className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500 inline-flex items-center justify-center gap-1"><Check className="h-3.5 w-3.5" />Tandai dibaca</button>
										<button type="button" className="h-9 w-9 rounded-lg bg-rose-50 text-rose-600 inline-flex items-center justify-center"><Trash2 className="h-3.5 w-3.5" /></button>
									</div>
								</div>
							</section>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}