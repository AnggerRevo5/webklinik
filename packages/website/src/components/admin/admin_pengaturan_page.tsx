"use client";

import {
	Bell,
	Building2,
	Clock3,
	Key,
	Lock,
	MapPin,
	Mail,
	PencilLine,
	Save,
	Settings,
	Star,
	Upload,
	User,
	Users,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

const tabs = [
	{ label: "Profil klinik", icon: Building2, active: true },
	{ label: "Jam operasional", icon: Clock3, active: false },
	{ label: "Lokasi & kontak", icon: MapPin, active: false },
	{ label: "Sosial media", icon: Mail, active: false },
	{ label: "Google Review", icon: Star, active: false },
	{ label: "Akun admin", icon: Users, active: false },
	{ label: "Keamanan", icon: Lock, active: false },
	{ label: "Notifikasi", icon: Bell, active: false },
] as const;

const socials = [
	{ name: "WhatsApp", value: "0812-2556-6055", dot: "bg-emerald-500" },
	{ name: "Instagram", value: "@amc.ampelgading", dot: "bg-pink-500" },
	{ name: "Facebook", value: "AMC Ampelgading", dot: "bg-sky-600" },
	{ name: "TikTok", value: "Belum diisi...", dot: "bg-slate-300" },
] as const;

export default function AdminPengaturanPage() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman admin pengaturan profil klinik KRI AMC</h2>
			<div className="grid min-h-[700px] grid-cols-[56px_minmax(0,1fr)] overflow-hidden rounded-3xl bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="settings" />
				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<div className="text-[15px] font-semibold text-slate-900">Pengaturan</div>
							<div className="text-[9px] text-slate-500">Kelola profil klinik dan konfigurasi sistem</div>
						</div>
						<button type="button" className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white"><Save className="h-3 w-3" />Simpan semua</button>
					</header>

					<div className="grid flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[200px_minmax(0,1fr)] lg:p-5">
						<aside className="space-y-2">
							<div className="px-2 pb-1 text-[8px] font-medium uppercase tracking-[1px] text-slate-400">Klinik</div>
							{tabs.map((tab) => {
								const Icon = tab.icon;

								return (
									<button key={tab.label} type="button" className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[10px] font-medium ${tab.active ? "bg-sky-50 text-sky-600" : "text-slate-500 hover:bg-slate-100"}`}>
										<Icon className="h-4 w-4" />
										{tab.label}
									</button>
								);
							})}
						</aside>

						<section className="space-y-4">
							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
								<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
									<div className="flex items-center gap-2 text-[12px] font-medium text-slate-900"><Building2 className="h-4 w-4 text-sky-600" />Profil klinik</div>
									<button type="button" className="inline-flex items-center gap-1 text-[9px] font-medium text-sky-600"><PencilLine className="h-3 w-3" />Edit</button>
								</div>
								<div className="space-y-3 p-4">
									<div className="flex items-center gap-3">
										<div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-amber-500 bg-sky-600 text-[10px] font-bold text-amber-400">AMC</div>
										<div>
											<button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[9px] text-slate-500"><Upload className="h-3 w-3" />Ganti logo</button>
											<div className="mt-1 text-[8px] text-slate-400">PNG, SVG · Maks 2MB</div>
										</div>
									</div>
									<div className="grid gap-3 md:grid-cols-2">
										{[
											["Nama klinik", "KRI Ampelgading Medical Centre"],
											["Singkatan", "KRI AMC"],
										].map(([label, value]) => (
											<div key={label}>
												<div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">{label}</div>
												<input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none" defaultValue={value} readOnly />
											</div>
										))}
									</div>
									<div>
										<div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">Tagline</div>
										<input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none" defaultValue="Melayani dengan sepenuh hati" readOnly />
									</div>
									<div>
										<div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">Deskripsi singkat</div>
										<textarea className="h-16 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none" defaultValue="Klinik rawat inap yang berkomitmen memberikan pelayanan kesehatan terbaik bagi masyarakat Ampelgading dan sekitarnya." readOnly />
									</div>
								</div>
							</article>

							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
								<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
									<div className="flex items-center gap-2 text-[12px] font-medium text-slate-900"><Clock3 className="h-4 w-4 text-amber-500" />Jam operasional</div>
									<button type="button" className="inline-flex items-center gap-1 text-[9px] font-medium text-sky-600"><PencilLine className="h-3 w-3" />Edit</button>
								</div>
								<div className="space-y-2 p-4 text-[10px]">
									{[
										["UGD & Rawat Inap", "24 JAM", true],
										["Poli Umum", "07:00 - 21:00", true],
										["Poli Gigi (Rab-Jum)", "15:00 - 21:00", true],
										["Poli Gigi (Sab-Min)", "08:00 - 14:00", true],
										["Laboratorium", "07:00 - 21:00", true],
										["Apotek", "07:00 - 21:00", true],
									].map(([name, time, active], index) => (
										<div key={index} className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl px-3 py-2 ${index === 0 ? "bg-rose-50" : "bg-slate-50"}`}>
											<span className="font-medium text-slate-900">{name}</span>
											<span className="font-medium text-sky-600">{time}</span>
											<span className={`rounded-full px-2 py-1 text-[8px] font-semibold ${active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{active ? "Aktif" : "Nonaktif"}</span>
										</div>
									))}
								</div>
							</article>

							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
								<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
									<div className="flex items-center gap-2 text-[12px] font-medium text-slate-900"><Mail className="h-4 w-4 text-violet-600" />Sosial media & kontak</div>
									<button type="button" className="inline-flex items-center gap-1 text-[9px] font-medium text-sky-600"><PencilLine className="h-3 w-3" />Edit</button>
								</div>
								<div className="space-y-2 p-4">
									{socials.map((social) => (
										<div key={social.name} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 text-[10px]">
											<span className={`h-7 w-7 rounded-lg ${social.dot}`} />
											<span className="w-20 font-medium text-slate-900">{social.name}</span>
											<input className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 outline-none" defaultValue={social.value} readOnly />
											<span className="h-2 w-2 rounded-full bg-emerald-500" />
										</div>
									))}
								</div>
							</article>

							<article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
								<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
									<div className="flex items-center gap-2 text-[12px] font-medium text-slate-900"><Users className="h-4 w-4 text-emerald-600" />Akun admin</div>
									<button type="button" className="inline-flex items-center gap-1 text-[9px] font-medium text-sky-600"><Upload className="h-3 w-3" />Tambah</button>
								</div>
								<div className="grid gap-2 p-4 text-[10px]">
									<div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
										<div className="flex items-center gap-3">
											<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white"><User className="h-4 w-4" /></div>
											<div><div className="font-medium text-slate-900">Administrator</div><div className="text-[8px] text-slate-400">Super Admin · admin@amc.co.id</div></div>
										</div>
										<div className="flex gap-1"><button type="button" className="rounded-md bg-sky-50 p-1.5 text-sky-600"><Key className="h-3 w-3" /></button><button type="button" className="rounded-md bg-sky-50 p-1.5 text-sky-600"><PencilLine className="h-3 w-3" /></button></div>
									</div>
								</div>
							</article>
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}