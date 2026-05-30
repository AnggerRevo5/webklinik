"use client";

import type { LucideIcon } from "lucide-react";
import {
	CalendarDays,
	ClipboardList,
	Clock3,
	Download,
	Eye,
	HeartPlus,
	MapPin,
	MousePointerClick,
	Plus,
	Search,
	Settings,
	Star,
	Tag,
	Users,
	Workflow,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type MetricCard = {
	title: string;
	value: string;
	trend?: string;
	icon: LucideIcon;
	iconClassName: string;
	containerClassName: string;
	barClassName?: string;
	bars?: number[];
};

type SocialCard = {
	name: string;
	followers: string;
	delta: string;
	clicks: string;
	icon: LucideIcon;
	iconClassName: string;
	iconWrapClassName: string;
};

type ContentCard = {
	title: string;
	date: string;
	status: string;
	statusClassName: string;
	gradient: string;
	icon: LucideIcon;
	iconClassName: string;
};

const metrics: MetricCard[] = [
	{
		title: "Pengunjung website",
		value: "3,847",
		trend: "+24%",
		icon: Eye,
		iconClassName: "text-sky-600",
		containerClassName: "bg-sky-50 text-sky-600",
		bars: [40, 55, 45, 70, 60, 85, 90],
		barClassName: "bg-sky-600",
	},
	{
		title: "Klik WhatsApp",
		value: "312",
		trend: "+18%",
		icon: MousePointerClick,
		iconClassName: "text-emerald-500",
		containerClassName: "bg-emerald-50 text-emerald-500",
		bars: [30, 45, 50, 40, 65, 70, 80],
		barClassName: "bg-emerald-500",
	},
	{
		title: "Klik daftar online",
		value: "89",
		trend: "+32%",
		icon: CalendarDays,
		iconClassName: "text-amber-600",
		containerClassName: "bg-amber-50 text-amber-600",
		bars: [25, 35, 50, 45, 60, 75, 90],
		barClassName: "bg-amber-600",
	},
	{
		title: "Rata-rata waktu di website",
		value: "4:23",
		icon: Clock3,
		iconClassName: "text-violet-600",
		containerClassName: "bg-violet-50 text-violet-600",
	},
	{
		title: "Klik sosial media",
		value: "156",
		trend: "+15%",
		icon: Workflow,
		iconClassName: "text-rose-600",
		containerClassName: "bg-rose-50 text-rose-600",
	} as MetricCard,
];

const socialCards: SocialCard[] = [
	{
		name: "Instagram",
		followers: "1,240",
		delta: "+187",
		clicks: "78 klik dari web",
		icon: Users,
		iconClassName: "text-pink-600",
		iconWrapClassName: "bg-pink-50 text-pink-600",
	},
	{
		name: "Facebook",
		followers: "856",
		delta: "+64",
		clicks: "43 klik dari web",
		icon: Users,
		iconClassName: "text-blue-600",
		iconWrapClassName: "bg-blue-50 text-blue-600",
	},
	{
		name: "TikTok",
		followers: "2,450",
		delta: "+312",
		clicks: "35 klik dari web",
		icon: Users,
		iconClassName: "text-slate-900",
		iconWrapClassName: "bg-zinc-100 text-slate-900",
	},
	{
		name: "Google Business",
		followers: "4.8",
		delta: "+8",
		clicks: "420 temukan via Google",
		icon: MapPin,
		iconClassName: "text-sky-600",
		iconWrapClassName: "bg-sky-50 text-sky-600",
	},
];

const contentCards: ContentCard[] = [
	{
		title: "Promo Kemerdekaan 17-an",
		date: "1-31 Agu 2026",
		status: "Aktif",
		statusClassName: "bg-emerald-50 text-emerald-600",
		gradient: "from-cyan-200 to-sky-400",
		icon: Tag,
		iconClassName: "text-white/40",
	},
	{
		title: "Promo Hari Raya",
		date: "1-15 Jun 2026",
		status: "Aktif",
		statusClassName: "bg-emerald-50 text-emerald-600",
		gradient: "from-emerald-200 to-teal-400",
		icon: Star,
		iconClassName: "text-white/40",
	},
	{
		title: "Promo Paket Persalinan",
		date: "Belum dijadwalkan",
		status: "Draft",
		statusClassName: "bg-amber-50 text-amber-600",
		gradient: "from-amber-200 to-orange-400",
		icon: HeartPlus,
		iconClassName: "text-white/40",
	},
	{
		title: "Promo MCU Awal Tahun",
		date: "1-31 Jan 2026",
		status: "Expired",
		statusClassName: "bg-rose-50 text-rose-600",
		gradient: "from-rose-200 to-rose-400",
		icon: ClipboardList,
		iconClassName: "text-white/40",
	},
];

function SectionTitle({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle?: string }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<Icon className="h-4 w-4 text-sky-500" />
				<div className="text-[11px] font-semibold text-slate-900">{title}</div>
			</div>
			{subtitle ? <div className="text-[8px] text-slate-400">{subtitle}</div> : null}
		</div>
	);
}

function MetricSpark({ bars, colorClass }: { bars?: number[]; colorClass: string }) {
	if (!bars || bars.length === 0) return null;

	return (
		<div className="mt-3 flex h-5 items-end gap-[2px]">
			{bars.map((height, index) => (
				<div
					key={`${height}-${index}`}
					className={`w-full rounded-[2px] ${index < bars.length - 2 ? "bg-slate-200" : colorClass}`}
					style={{ height: `${height}%` }}
				/>
			))}
		</div>
	);
}

export default function DashboardAdmin() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Dashboard admin lengkap dengan analytics dan content management untuk KRI AMC</h2>

			<div className="grid min-h-[700px] grid-cols-[56px_1fr] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="dashboard" />

				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-center gap-3">
							<div className="text-[15px] font-semibold text-slate-900">Dashboard</div>
							<div className="flex rounded-lg bg-slate-100 p-0.5">
								{["Overview", "Analytics", "Konten"].map((item, index) => (
									<div
										key={item}
										className={`rounded-md px-3 py-1 text-[10px] font-medium ${index === 0 ? "bg-white text-sky-600 shadow-sm" : "text-slate-400"}`}
									>
										{item}
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<button type="button" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-medium text-slate-600">
								<CalendarDays className="h-3 w-3" />
								30 hari terakhir
							</button>
							<button type="button" className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-medium text-sky-600">
								<Download className="h-3 w-3" />
								Export
							</button>
							<button type="button" className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white">
								<Plus className="h-3 w-3" />
								Tambah
							</button>
						</div>
					</header>

					<div className="flex-1 overflow-y-auto p-4 lg:p-5">
						<section className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
							{metrics.map((metric) => {
								const Icon = metric.icon;

								return (
									<article key={metric.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
										<div className="mb-1 flex items-center justify-between">
											<div className={`flex h-6 w-6 items-center justify-center rounded-md ${metric.containerClassName}`}>
												<Icon className={`h-3.5 w-3.5 ${metric.iconClassName}`} />
											</div>
											{metric.trend ? (
												<span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-600">{metric.trend}</span>
											) : null}
										</div>
										<div className="text-[20px] font-semibold leading-none text-slate-900">{metric.value}</div>
										<div className="mt-1 text-[8px] text-slate-400">{metric.title}</div>
										<MetricSpark bars={metric.bars} colorClass={metric.barClassName ?? "bg-slate-300"} />
									</article>
								);
							})}
						</section>

						<section className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
							{socialCards.map((card) => {
								const Icon = card.icon;

								return (
									<article key={card.name} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
										<div className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${card.iconWrapClassName}`}>
											<Icon className={`h-4 w-4 ${card.iconClassName}`} />
										</div>
										<div className="mb-1 text-[9px] font-medium text-slate-900">{card.name}</div>
										<div className="flex justify-center gap-2">
											<div>
												<div className="text-[13px] font-semibold leading-none text-slate-900">{card.followers}</div>
												<div className="text-[7px] text-slate-400">Followers</div>
											</div>
											<div>
												<div className="text-[13px] font-semibold leading-none text-emerald-600">{card.delta}</div>
												<div className="text-[7px] text-slate-400">Baru</div>
											</div>
										</div>
										<div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] font-medium text-sky-600">
											<Search className="h-3 w-3" />
											{card.clicks}
										</div>
									</article>
								);
							})}
						</section>

						<section className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
							<article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
								<SectionTitle icon={MapPin} title="Google Business Profile" subtitle="30 hari terakhir" />
								<div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
									{[
										{ label: "Pencarian", num: "420", color: "text-sky-500", trend: "↑ 28%" },
										{ label: "Klik rute", num: "187", color: "text-rose-500", trend: "↑ 15%" },
										{ label: "Panggilan", num: "96", color: "text-emerald-500", trend: "↑ 22%" },
										{ label: "Lihat profil", num: "543", color: "text-amber-500", trend: "↑ 35%" },
									].map((item) => (
										<div key={item.label} className="rounded-lg bg-slate-50 p-2 text-center">
											<div className={`text-[16px] font-semibold leading-none ${item.color}`}>{item.num}</div>
											<div className="mt-0.5 text-[8px] text-slate-400">{item.label}</div>
											<div className="mt-0.5 text-[7px] font-medium text-emerald-600">{item.trend}</div>
										</div>
									))}
								</div>
							</article>

							<article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
								<SectionTitle icon={Star} title="Review tracker" />
								<div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
									<div className="rounded-lg bg-slate-50 p-2 text-center">
										<div className="text-[8px] text-slate-400">Sebelum website</div>
										<div className="text-[18px] font-semibold text-slate-400">15</div>
										<div className="text-[8px] text-slate-400">review</div>
									</div>
									<div className="text-lg font-semibold text-emerald-600">→</div>
									<div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-center">
										<div className="text-[8px] text-slate-400">Sesudah website</div>
										<div className="text-[18px] font-semibold text-emerald-600">23</div>
										<div className="text-[8px] text-emerald-600">review (+53%)</div>
									</div>
								</div>
							</article>
						</section>

						<section>
							<div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
								<div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
									<Tag className="h-4 w-4 text-amber-500" />
									Kelola konten website
								</div>
								<div className="flex flex-wrap rounded-lg bg-slate-100 p-0.5">
									{["Promo", "Artikel", "Galeri", "Dokter"].map((item, index) => (
										<div
											key={item}
											className={`rounded-md px-3 py-1 text-[9px] font-medium ${index === 0 ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}
										>
											{item}
										</div>
									))}
								</div>
							</div>

							<div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
								{contentCards.map((card) => {
									const Icon = card.icon;

									return (
										<article key={card.title} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
											<div className={`relative flex h-20 items-center justify-center bg-gradient-to-br ${card.gradient}`}>
												<span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[7px] font-semibold ${card.statusClassName}`}>{card.status}</span>
												<Icon className={`h-6 w-6 ${card.iconClassName}`} />
											</div>
											<div className="p-2.5">
												<div className="truncate text-[10px] font-medium text-slate-900">{card.title}</div>
												<div className="mt-0.5 flex items-center gap-1 text-[8px] text-slate-400">
													<CalendarDays className="h-2.5 w-2.5" />
													{card.date}
												</div>
												<div className="mt-2 flex gap-1">
													<button type="button" className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-50 text-sky-600">
														<Workflow className="h-3 w-3" />
													</button>
													<button type="button" className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-50 text-slate-400">
														<Eye className="h-3 w-3" />
													</button>
													<button type="button" className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-50 text-rose-500">
														<Settings className="h-3 w-3" />
													</button>
												</div>
											</div>
										</article>
									);
								})}
							</div>
						</section>

					</div>
				</section>
			</div>
		</main>
	);
}