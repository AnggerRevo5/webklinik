"use client";

import type { LucideIcon } from "lucide-react";
import {
	Ambulance,
	Bed,
	ClipboardList,
	Clock3,
	Edit3,
	Eye,
	HeartPlus,
	HouseHeart,
	ListFilter,
	PencilLine,
	Plus,
	Save,
	Stethoscope,
	Trash2,
	Upload,
	Users,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type ServiceItem = {
	order: string;
	name: string;
	desc: string;
	icon: LucideIcon;
	iconWrap: string;
	badge: string;
	active: boolean;
};

const services: ServiceItem[] = [
	{ order: "1", name: "SIAP DOK", desc: "Konsultasi kesehatan online", icon: HouseHeart, iconWrap: "bg-sky-50 text-sky-600", badge: "Unggulan", active: true },
	{ order: "2", name: "Homevisit", desc: "Kunjungan ke rumah", icon: HouseHeart, iconWrap: "bg-emerald-50 text-emerald-600", badge: "Unggulan", active: true },
	{ order: "3", name: "POS KRS", desc: "Administrasi keluar", icon: ClipboardList, iconWrap: "bg-violet-50 text-violet-600", badge: "Unggulan", active: true },
	{ order: "4", name: "Poling", desc: "Poli keliling", icon: Ambulance, iconWrap: "bg-amber-50 text-amber-600", badge: "Unggulan", active: true },
	{ order: "5", name: "UGD 24 Jam", desc: "Gawat darurat", icon: HeartPlus, iconWrap: "bg-rose-50 text-rose-600", badge: "Reguler", active: true },
	{ order: "6", name: "Poli Umum", desc: "Pemeriksaan & konsultasi", icon: Stethoscope, iconWrap: "bg-sky-50 text-sky-700", badge: "Reguler", active: true },
	{ order: "12", name: "Observasi", desc: "Pemantauan kondisi", icon: Bed, iconWrap: "bg-slate-100 text-slate-400", badge: "Nonaktif", active: false },
];

const iconChoices = [Ambulance, HouseHeart, Stethoscope, Bed, ClipboardList, HeartPlus, Users, Clock3, Eye, Edit3];

export default function AdminLayananCrud() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman admin kelola layanan KRI AMC</h2>

			<div className="grid min-h-[700px] grid-cols-[56px_minmax(0,1fr)] overflow-hidden rounded-3xl bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="layanan" />
				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<div className="text-[15px] font-semibold text-slate-900">Layanan</div>
							<div className="text-[9px] text-slate-500">Kelola daftar layanan, urutan tampil, dan status aktif di website</div>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<button type="button" className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-medium text-sky-600"><ListFilter className="h-3 w-3" />Semua (16)</button>
							<button type="button" className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white"><Plus className="h-3 w-3" />Tambah layanan</button>
						</div>
					</header>

					<div className="grid flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[minmax(0,1fr)_340px] lg:p-5">
						<section className="space-y-3">
							<div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 text-[9px] text-slate-500">
								Drag untuk ubah urutan layanan.
							</div>
							{services.map((service) => {
								const Icon = service.icon;

								return (
									<article key={service.name} className={`flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm ${service.active ? "border-slate-200" : "border-slate-200 opacity-60"}`}>
										<div className="text-slate-300"><PencilLine className="h-4 w-4 rotate-90" /></div>
										<div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-semibold text-slate-500">{service.order}</div>
										<div className={`flex h-8 w-8 items-center justify-center rounded-lg ${service.iconWrap}`}><Icon className="h-4 w-4" /></div>
										<div className="min-w-0 flex-1">
											<div className="text-[11px] font-medium text-slate-900">{service.name}</div>
											<div className="text-[9px] text-slate-500">{service.desc}</div>
										</div>
										<span className={`rounded-full px-2 py-1 text-[8px] font-semibold ${service.badge === "Unggulan" ? "bg-sky-50 text-sky-600" : service.badge === "Reguler" ? "bg-slate-100 text-slate-500" : "bg-rose-50 text-rose-600"}`}>{service.badge}</span>
										<button type="button" className={`relative h-[18px] w-8 rounded-full ${service.active ? "bg-sky-600" : "bg-slate-200"}`}>
											<span className={`absolute top-[2px] h-3.5 w-3.5 rounded-full bg-white shadow-sm ${service.active ? "left-4" : "left-[2px]"}`} />
										</button>
										<div className="flex gap-1">
											<button type="button" className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600"><Edit3 className="h-3 w-3" /></button>
											<button type="button" className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-rose-600"><Trash2 className="h-3 w-3" /></button>
										</div>
									</article>
								);
							})}
						</section>

						<section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
							<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
								<div className="flex items-center gap-2 text-[12px] font-medium text-slate-900"><Edit3 className="h-4 w-4 text-sky-600" />Edit layanan</div>
								<span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">SIAP DOK</span>
							</div>
							<div className="space-y-3 p-4">
								<div className="rounded-2xl bg-sky-50 p-3">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white"><HeartPlus className="h-5 w-5" /></div>
										<div>
											<div className="text-[11px] font-medium text-slate-900">SIAP DOK</div>
											<div className="text-[9px] text-slate-500">Konsultasi online</div>
										</div>
									</div>
								</div>
								<div className="space-y-2">
									<div>
										<div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">Nama layanan</div>
										<input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none" defaultValue="SIAP DOK" readOnly />
									</div>
									<div>
										<div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">Deskripsi</div>
										<textarea className="h-16 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none" defaultValue="Konsultasi kesehatan online langsung dengan dokter kapan saja dan dimana saja." readOnly />
									</div>
									<div>
										<div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">Ikon pilihan</div>
										<div className="grid grid-cols-5 gap-2">
											{iconChoices.map((Icon, index) => (
												<div key={index} className={`flex h-8 items-center justify-center rounded-lg border text-[12px] ${index === 0 ? "border-sky-600 bg-sky-50 text-sky-600" : "border-slate-200 text-slate-500"}`}><Icon className="h-4 w-4" /></div>
											))}
										</div>
									</div>
									<div>
										<div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">Preview di website</div>
										<div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 p-3 text-white">
											<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20"><HeartPlus className="h-4 w-4" /></div>
											<div className="min-w-0">
												<div className="text-[11px] font-medium">SIAP DOK</div>
												<div className="text-[8px] text-white/75">Konsultasi online</div>
											</div>
											<span className="ml-auto rounded-full bg-white/15 px-2 py-1 text-[7px] font-semibold">Unggulan</span>
										</div>
									</div>
								</div>
							</div>
							<div className="flex gap-2 border-t border-slate-100 px-4 py-3">
								<button type="button" className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500">Batal</button>
								<button type="button" className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white"><Save className="h-3.5 w-3.5" />Simpan</button>
							</div>
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}