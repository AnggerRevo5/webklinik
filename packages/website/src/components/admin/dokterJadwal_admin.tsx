"use client";

import {
	CalendarDays,
	MoreHorizontal,
	Plus,
	Eye,
	Edit3,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type DoctorCard = {
	initials: string;
	name: string;
	specialty: string;
	badge: string;
	badgeClassName: string;
	avatarClassName: string;
	scheduleTitle: string;
	primarySchedule: string;
	secondarySchedule?: string;
	stats: Array<{ value: string; label: string }>;
	dayDots: boolean[];
};

const weeklySchedule = [
	{ day: "Sen", date: "12", doctor: "dr. Angga", active: true },
	{ day: "Sel", date: "13", doctor: "dr. Angga", active: false },
	{ day: "Rab", date: "14", doctor: "dr. Ikhwan", active: false },
	{ day: "Kam", date: "15", doctor: "dr. Ikhwan", active: false },
	{ day: "Jum", date: "16", doctor: "dr. Ikhwan", active: false },
	{ day: "Sab", date: "17", doctor: "dr. Nikma", active: false },
	{ day: "Min", date: "18", doctor: "dr. Nikma", active: false },
] as const;

const doctorCards: DoctorCard[] = [
	{
		initials: "MA",
		name: "dr. Muhammad Angga Dewa Sudin",
		specialty: "Dokter Umum",
		badge: "Aktif",
		badgeClassName: "bg-emerald-50 text-emerald-600",
		avatarClassName: "bg-sky-600",
		scheduleTitle: "Jadwal praktik",
		primarySchedule: "Senin - Selasa",
		secondarySchedule: "24 Jam",
		stats: [
			{ value: "124", label: "Pasien/bulan" },
			{ value: "4.9", label: "Rating" },
			{ value: "3th", label: "Bergabung" },
		],
		dayDots: [true, true, false, false, false, false, false],
	},
	{
		initials: "IR",
		name: "dr. Ikhwan Rizki Rasyid Turino",
		specialty: "Dokter Umum",
		badge: "Libur hari ini",
		badgeClassName: "bg-rose-50 text-rose-600",
		avatarClassName: "bg-emerald-600",
		scheduleTitle: "Jadwal praktik",
		primarySchedule: "Rabu - Jumat",
		secondarySchedule: "24 Jam",
		stats: [
			{ value: "98", label: "Pasien/bulan" },
			{ value: "4.7", label: "Rating" },
			{ value: "2th", label: "Bergabung" },
		],
		dayDots: [false, false, true, true, true, false, false],
	},
	{
		initials: "NF",
		name: "dr. Nikma Fitriasari, MMRS",
		specialty: "Dokter Umum",
		badge: "Pendiri",
		badgeClassName: "bg-amber-50 text-amber-700",
		avatarClassName: "bg-amber-600",
		scheduleTitle: "Jadwal praktik",
		primarySchedule: "Sabtu - Minggu",
		secondarySchedule: "24 Jam",
		stats: [
			{ value: "86", label: "Pasien/bulan" },
			{ value: "5.0", label: "Rating" },
			{ value: "15th", label: "Bergabung" },
		],
		dayDots: [false, false, false, false, false, true, true],
	},
	{
		initials: "DA",
		name: "drg. Dina Andriana",
		specialty: "Dokter Gigi",
		badge: "Libur hari ini",
		badgeClassName: "bg-rose-50 text-rose-600",
		avatarClassName: "bg-violet-600",
		scheduleTitle: "Jadwal praktik",
		primarySchedule: "Rabu - Jumat",
		secondarySchedule: "15:00 - 21:00",
		stats: [
			{ value: "62", label: "Pasien/bulan" },
			{ value: "4.8", label: "Rating" },
			{ value: "1th", label: "Bergabung" },
		],
		dayDots: [false, false, true, true, true, true, true],
	},
] as const;

export default function DokterJadwalAdmin() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman admin kelola dokter KRI AMC</h2>

			<div className="grid min-h-[680px] grid-cols-[56px_1fr] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="dokter" />

				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<div className="text-[15px] font-semibold text-slate-900">Dokter & Jadwal</div>
							<div className="text-[9px] text-slate-400">Kelola data dokter dan jadwal praktik</div>
						</div>
						<button type="button" className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white">
							<Plus className="h-3 w-3" />
							Tambah dokter
						</button>
					</header>

					<div className="flex-1 overflow-y-auto p-4 lg:p-5">
						<section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
							<div className="mb-3 flex items-center justify-between">
								<div className="flex items-center gap-2 text-[12px] font-medium text-slate-900">
									<CalendarDays className="h-4 w-4 text-sky-600" />
									Jadwal minggu ini
								</div>
								<span className="text-[9px] text-slate-400">12 - 18 Mei 2026</span>
							</div>
							<div className="grid grid-cols-2 gap-2 md:grid-cols-7">
								{weeklySchedule.map((item) => (
									<div
										key={`${item.day}-${item.date}`}
										className={`rounded-lg border p-2 text-center transition-colors ${item.active ? "border-sky-600 bg-sky-600 text-white" : "border-slate-100 bg-slate-50 hover:bg-sky-50"}`}
									>
										<div className={`text-[8px] font-medium ${item.active ? "text-white/70" : "text-slate-400"}`}>{item.day}</div>
										<div className="font-serif text-[14px] font-semibold leading-none">{item.date}</div>
										<div className={`mt-1 text-[7px] ${item.active ? "text-white/60" : "text-slate-400"}`}>{item.doctor}</div>
									</div>
								))}
							</div>
						</section>

						<section className="grid grid-cols-1 gap-3 md:grid-cols-2">
							{doctorCards.map((doctor) => (
								<article key={doctor.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
									<div className="relative flex items-start gap-3 p-4">
										<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${doctor.avatarClassName}`}>
											{doctor.initials}
										</div>
										<div className="min-w-0 flex-1">
											<div className="truncate text-[13px] font-medium text-slate-900">{doctor.name}</div>
											<div className="text-[10px] text-slate-400">{doctor.specialty}</div>
										</div>
										<span className={`rounded-full px-2 py-1 text-[8px] font-semibold ${doctor.badgeClassName}`}>{doctor.badge}</span>
										<button type="button" className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md bg-slate-50 text-slate-400">
											<MoreHorizontal className="h-3.5 w-3.5" />
										</button>
									</div>

									<div className="px-4 pb-4">
										<div className="mb-3 rounded-lg bg-slate-50 p-3">
											<div className="mb-2 text-[8px] font-medium uppercase tracking-[1px] text-slate-400">{doctor.scheduleTitle}</div>
											<div className="flex items-center justify-between py-1 text-[10px] font-medium text-slate-600">
												<span>{doctor.primarySchedule}</span>
												<span className="text-sky-600">{doctor.secondarySchedule}</span>
											</div>
											<div className="mt-2 flex gap-1">
												{doctor.dayDots.map((on, index) => (
													<span
														key={`${doctor.name}-${index}`}
														className={`h-1.5 flex-1 rounded-full ${on ? "bg-sky-600" : "bg-slate-200"}`}
													/>
												))}
											</div>
										</div>

										<div className="mb-3 grid grid-cols-3 gap-2">
											{doctor.stats.map((stat) => (
												<div key={stat.label} className="rounded-lg bg-slate-50 p-2 text-center">
													<div className="font-serif text-[14px] font-semibold leading-none text-slate-900">{stat.value}</div>
													<div className="mt-0.5 text-[7px] text-slate-400">{stat.label}</div>
												</div>
											))}
										</div>

										<div className="flex gap-2">
											<button type="button" className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-50 px-2 py-2 text-[9px] font-medium text-sky-600">
												<Edit3 className="h-3 w-3" />
												Edit
											</button>
											<button type="button" className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-50 px-2 py-2 text-[9px] font-medium text-amber-600">
												<CalendarDays className="h-3 w-3" />
												Jadwal
											</button>
											<button type="button" className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-50 px-2 py-2 text-[9px] font-medium text-slate-500">
												<Eye className="h-3 w-3" />
												Profil
											</button>
										</div>
									</div>
								</article>
							))}
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}
