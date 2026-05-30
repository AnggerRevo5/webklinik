"use client";

import type { LucideIcon } from "lucide-react";
import {
	Ambulance,
	Building2,
	CloudUpload,
	Clock3,
	Edit3,
	Eye,
	HeartPulse,
	HouseHeart,
	ImagePlus,
	ListFilter,
	PencilLine,
	Plus,
 	Newspaper,
	Send,
	Stethoscope,
	Trash2,
	Users2,
	Syringe,
	Smile,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type GalleryItem = {
	title: string;
	badge: string;
	badgeClassName: string;
	gradientClassName: string;
	icon: LucideIcon;
	iconClassName: string;
};

type ArticleItem = {
	title: string;
	category: string;
	categoryClassName: string;
	status: string;
	statusClassName: string;
	meta: string;
	views: string;
	shares: string;
	duration: string;
	gradientClassName: string;
	icon: LucideIcon;
};

const galleryTabs = ["Galeri", "Artikel"] as const;
const galleryFilters = ["Semua", "Kegiatan", "Fasilitas", "Layanan", "Poli"] as const;

const galleryItems: GalleryItem[] = [
	{
		title: "Poli ke Desa Tirtomarto",
		badge: "Kegiatan",
		badgeClassName: "bg-emerald-50 text-emerald-600",
		gradientClassName: "from-cyan-300 via-sky-400 to-sky-500",
		icon: Ambulance,
		iconClassName: "text-white/40",
	},
	{
		title: "Homevisit pasien",
		badge: "Layanan",
		badgeClassName: "bg-sky-50 text-sky-600",
		gradientClassName: "from-emerald-300 via-teal-400 to-emerald-500",
		icon: HouseHeart,
		iconClassName: "text-white/40",
	},
	{
		title: "Ruang rawat inap",
		badge: "Fasilitas",
		badgeClassName: "bg-amber-50 text-amber-700",
		gradientClassName: "from-violet-300 via-violet-400 to-violet-500",
		icon: Building2,
		iconClassName: "text-white/40",
	},
	{
		title: "Penyuluhan kesehatan",
		badge: "Kegiatan",
		badgeClassName: "bg-emerald-50 text-emerald-600",
		gradientClassName: "from-orange-200 via-amber-300 to-orange-400",
		icon: Users2,
		iconClassName: "text-white/40",
	},
	{
		title: "Vaksinasi",
		badge: "Layanan",
		badgeClassName: "bg-sky-50 text-sky-600",
		gradientClassName: "from-rose-300 via-rose-400 to-rose-500",
		icon: Syringe,
		iconClassName: "text-white/40",
	},
	{
		title: "Laboratorium",
		badge: "Fasilitas",
		badgeClassName: "bg-amber-50 text-amber-700",
		gradientClassName: "from-sky-300 via-cyan-400 to-sky-500",
		icon: Stethoscope,
		iconClassName: "text-white/40",
	},
	{
		title: "Pemeriksaan EKG",
		badge: "Layanan",
		badgeClassName: "bg-sky-50 text-sky-600",
		gradientClassName: "from-emerald-300 via-green-400 to-emerald-500",
		icon: HeartPulse,
		iconClassName: "text-white/40",
	},
	{
		title: "Tambah foto",
		badge: "",
		badgeClassName: "",
		gradientClassName: "from-slate-200 to-slate-300 border-2 border-dashed border-slate-300",
		icon: ImagePlus,
		iconClassName: "text-slate-400",
	},
];

const articleItems: ArticleItem[] = [
	{
		title: "Mengenal tanda-tanda serangan jantung dan kapan harus ke UGD",
		category: "Tips kesehatan",
		categoryClassName: "bg-cyan-50 text-cyan-700",
		status: "Published",
		statusClassName: "bg-emerald-50 text-emerald-600",
		meta: "dr. Nikma · 8 Mei 2026",
		views: "234",
		shares: "12",
		duration: "3 min",
		gradientClassName: "from-cyan-300 via-sky-400 to-sky-500",
		icon: HeartPulse,
	},
	{
		title: "Persiapan persalinan yang aman di klinik",
		category: "Ibu & anak",
		categoryClassName: "bg-rose-50 text-rose-600",
		status: "Published",
		statusClassName: "bg-emerald-50 text-emerald-600",
		meta: "Admin · 5 Mei 2026",
		views: "187",
		shares: "8",
		duration: "4 min",
		gradientClassName: "from-emerald-300 via-teal-400 to-emerald-500",
		icon: Users2,
	},
	{
		title: "Kapan waktu yang tepat periksa gigi anak?",
		category: "Edukasi",
		categoryClassName: "bg-amber-50 text-amber-700",
		status: "Draft",
		statusClassName: "bg-amber-50 text-amber-600",
		meta: "Admin · Draft",
		views: "—",
		shares: "—",
		duration: "5 min",
		gradientClassName: "from-amber-300 via-orange-400 to-orange-500",
		icon: Smile,
	},
	{
		title: "Jadwal poli bulan Mei 2026",
		category: "Berita klinik",
		categoryClassName: "bg-violet-50 text-violet-700",
		status: "Published",
		statusClassName: "bg-emerald-50 text-emerald-600",
		meta: "Admin · 28 Apr 2026",
		views: "156",
		shares: "15",
		duration: "2 min",
		gradientClassName: "from-violet-300 via-violet-400 to-violet-500",
		icon: Ambulance,
	},
];

function PhotoCard({ item }: { item: GalleryItem }) {
	const Icon = item.icon;

	if (item.title === "Tambah foto") {
		return (
			<button
				type="button"
				className="group flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400 transition hover:border-sky-400 hover:bg-sky-50 hover:text-sky-500"
			>
				<ImagePlus className="h-7 w-7 transition group-hover:scale-105" />
				<span className="mt-2 text-[11px] font-medium">Tambah foto</span>
			</button>
		);
	}

	return (
		<article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
			<div className={`relative aspect-square bg-gradient-to-br ${item.gradientClassName}`}>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_45%)]" />
				<div className="absolute inset-0 flex items-center justify-center">
					<Icon className={`h-10 w-10 ${item.iconClassName}`} />
				</div>
				<div className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-sm">
					<span className={item.badgeClassName}>{item.badge}</span>
				</div>
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
					<div className="text-[11px] font-medium text-white">{item.title}</div>
					<div className="mt-2 flex items-center gap-2">
						<button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-900">
							<PencilLine className="h-3.5 w-3.5" />
						</button>
						<button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-rose-600">
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>
			<div className="border-t border-slate-200 p-3">
				<div className="text-[11px] font-medium text-slate-900">{item.title}</div>
			</div>
		</article>
	);
}

function ArticleCard({ item }: { item: ArticleItem }) {
	const Icon = item.icon;

	return (
		<article className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[120px_minmax(0,1fr)]">
			<div className={`relative min-h-[120px] bg-gradient-to-br ${item.gradientClassName}`}>
				<div className="absolute inset-0 flex items-center justify-center">
					<Icon className="h-8 w-8 text-white/40" />
				</div>
				<div className={`absolute left-3 top-3 rounded-full px-2 py-1 text-[9px] font-semibold ${item.statusClassName}`}>
					{item.status}
				</div>
			</div>

			<div className="flex flex-col p-3.5">
				<div className={`mb-1 inline-flex w-fit rounded-full px-2.5 py-1 text-[9px] font-semibold ${item.categoryClassName}`}>
					{item.category}
				</div>
				<h3 className="text-[12px] font-semibold leading-5 text-slate-900">{item.title}</h3>
				<div className="mt-1 text-[10px] text-slate-500">{item.meta}</div>

				<div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-500">
					<div className="inline-flex items-center gap-1">
						<Eye className="h-3.5 w-3.5" />
						{item.views}
					</div>
					<div className="inline-flex items-center gap-1">
						<Send className="h-3.5 w-3.5" />
						{item.shares}
					</div>
					<div className="inline-flex items-center gap-1">
						<Clock3 className="h-3.5 w-3.5" />
						{item.duration}
					</div>
				</div>

				<div className="mt-4 flex flex-wrap gap-2">
					<button type="button" className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1.5 text-[10px] font-medium text-sky-600">
						<Edit3 className="h-3.5 w-3.5" />
						Edit
					</button>
					<button type="button" className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">
						<Eye className="h-3.5 w-3.5" />
						Lihat
					</button>
					<button type="button" className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[10px] font-medium text-rose-600">
						<Trash2 className="h-3.5 w-3.5" />
						Hapus
					</button>
				</div>
			</div>
		</article>
	);
}

export default function GaleriArtikelAdmin() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman admin kelola galeri dan artikel KRI AMC</h2>

			<div className="grid min-h-[700px] grid-cols-[56px_minmax(0,1fr)] overflow-hidden rounded-3xl bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="galeri" />

				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex flex-wrap items-center gap-3">
							<div>
								<div className="text-[15px] font-semibold text-slate-900">Galeri & Artikel</div>
								<div className="text-[9px] text-slate-500">Kelola foto kegiatan dan konten artikel</div>
							</div>
							<div className="flex rounded-lg bg-slate-100 p-0.5">
								{galleryTabs.map((tab, index) => (
									<button
										key={tab}
										type="button"
										className={`rounded-md px-3 py-1 text-[10px] font-medium ${index === 0 ? "bg-white text-sky-600 shadow-sm" : "text-slate-400"}`}
									>
										{tab}
									</button>
								))}
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<button type="button" className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-medium text-sky-600">
								<ListFilter className="h-3 w-3" />
								Pilih
							</button>
							<button type="button" className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white">
								<Plus className="h-3 w-3" />
								Upload foto
							</button>
						</div>
					</header>

					<div className="flex-1 overflow-y-auto p-4 lg:p-5">
						<section className="mb-4 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 shadow-sm">
							<div className="flex flex-col items-center gap-3 text-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
									<CloudUpload className="h-6 w-6" />
								</div>
								<div>
									<div className="text-[12px] font-medium text-slate-700">Drag & drop foto di sini atau klik untuk upload</div>
									<div className="mt-1 text-[10px] text-slate-500">PNG, JPG, WEBP · Maks 5MB per file · Bisa upload banyak sekaligus</div>
								</div>
							</div>
						</section>

						<div className="mb-3 flex flex-wrap items-center gap-2">
							{galleryFilters.map((filter, index) => (
								<button
									key={filter}
									type="button"
									className={`rounded-full border px-3 py-1.5 text-[10px] font-medium ${index === 0 ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500"}`}
								>
									{filter}
								</button>
							))}
							<div className="ml-auto text-[10px] text-slate-500">18 foto</div>
						</div>

						<section>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
								{galleryItems.map((item) => (
									<PhotoCard key={item.title} item={item} />
								))}
							</div>
						</section>

						<div className="my-6 h-px bg-slate-200" />

						<section>
							<div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
								<div className="flex items-center gap-2">
														<Newspaper className="h-4 w-4 text-amber-500" />
									<div className="text-[13px] font-semibold text-slate-900">Artikel terbaru</div>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									<button type="button" className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-medium text-sky-600">
										<ListFilter className="h-3 w-3" />
										Semua
									</button>
									<button type="button" className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white">
										<Plus className="h-3 w-3" />
										Tulis artikel
									</button>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
								{articleItems.map((item) => (
									<ArticleCard key={item.title} item={item} />
								))}
							</div>
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}
