"use client";

import type { LucideIcon } from "lucide-react";
import {
	Ambulance,
	Building2,
	Edit3,
	Eye,
	HeartPulse,
	HouseHeart,
	ImagePlus,
	ListFilter,
	PencilLine,
	Plus,
	Syringe,
	Trash2,
	Users2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createGallery, deleteGallery, type CreateGalleryPayload, type Gallery, updateGallery, useHomeData } from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type GalleryItem = {
	id: number;
	title: string;
	badge: string;
	badgeClassName: string;
	gradientClassName: string;
	icon: LucideIcon;
	iconClassName: string;
};

const galleryFilters = ["Semua", "Kegiatan", "Fasilitas", "Layanan", "Poli"] as const;

function GalleryCard({
	item,
	onEdit,
	onDelete,
}: {
	item: GalleryItem;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
}) {
	const Icon = item.icon;

	return (
		<article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
			<div className={`relative aspect-square bg-gradient-to-br ${item.gradientClassName}`}>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_45%)]" />
				<div className="absolute inset-0 flex items-center justify-center">
					<Icon className={`h-10 w-10 ${item.iconClassName}`} />
				</div>
				<div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold shadow-sm">
					<span className={item.badgeClassName}>{item.badge}</span>
				</div>
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
					<div className="text-[11px] font-medium text-white">{item.title}</div>
					<div className="mt-2 flex items-center gap-2">
						<button type="button" onClick={() => onEdit(item.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-900">
							<PencilLine className="h-3.5 w-3.5" />
						</button>
						<button type="button" onClick={() => onDelete(item.id)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-rose-600">
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

export default function GaleriArtikelAdmin() {
	const { data } = useHomeData();
	const [gallery, setGallery] = useState<Gallery[]>([]);
	const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);
	const [form, setForm] = useState<CreateGalleryPayload>({ kategori: "", text: "", url: "" });
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (data?.galeri) {
			setGallery(data.galeri);
			if (selectedGalleryId == null && data.galeri[0]) {
				setSelectedGalleryId(data.galeri[0].id);
			}
		}
	}, [data?.galeri, selectedGalleryId]);

	const selectedGallery = useMemo(() => gallery.find((item) => item.id === selectedGalleryId) ?? null, [gallery, selectedGalleryId]);

	useEffect(() => {
		if (selectedGallery) {
			setForm({ kategori: selectedGallery.kategori, text: selectedGallery.text, url: selectedGallery.url });
		}
	}, [selectedGallery]);

	const galleryItems: GalleryItem[] = gallery.map((item, index) => ({
		id: item.id,
		title: item.text || item.url || `Galeri ${index + 1}`,
		badge: item.kategori || "Galeri",
		badgeClassName: index % 3 === 0 ? "bg-emerald-50 text-emerald-600" : index % 3 === 1 ? "bg-sky-50 text-sky-600" : "bg-amber-50 text-amber-700",
		gradientClassName: index % 3 === 0 ? "from-cyan-300 via-sky-400 to-sky-500" : index % 3 === 1 ? "from-emerald-300 via-teal-400 to-emerald-500" : "from-violet-300 via-violet-400 to-violet-500",
		icon: index % 4 === 0 ? Ambulance : index % 4 === 1 ? HouseHeart : index % 4 === 2 ? Building2 : index % 4 === 3 ? HeartPulse : Users2,
		iconClassName: "text-white/40",
	}));

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitError(null);
		setActionError(null);
		setIsSubmitting(true);

		try {
			if (selectedGallery) {
				const updated = await updateGallery(selectedGallery.id, form);
				setGallery((current) => current.map((item) => (item.id === updated.id ? updated : item)));
				setSelectedGalleryId(updated.id);
			} else {
				const created = await createGallery(form);
				setGallery((current) => [created, ...current]);
				setSelectedGalleryId(created.id);
			}
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : "Gagal menyimpan galeri");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleDeleteGallery(id: number) {
		setActionError(null);
		try {
			await deleteGallery(id);
			setGallery((current) => {
				const next = current.filter((item) => item.id !== id);
				if (selectedGalleryId === id) {
					setSelectedGalleryId(next[0]?.id ?? null);
				}
				return next;
			});
		} catch (error) {
			setActionError(error instanceof Error ? error.message : "Gagal menghapus galeri");
		}
	}

	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman admin galeri KRI AMC</h2>

			<div className="grid min-h-[700px] grid-cols-[56px_minmax(0,1fr)] overflow-hidden rounded-3xl bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="galeri" />

				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
					<header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<div className="text-[15px] font-semibold text-slate-900">Galeri</div>
							<div className="text-[9px] text-slate-500">CRUD galeri langsung ke tabel galeri, artikel tidak disertakan karena tidak ada tabelnya.</div>
						</div>
						<button type="button" onClick={() => { setSelectedGalleryId(null); setForm({ kategori: "", text: "", url: "" }); }} className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white">
							<Plus className="h-3 w-3" />
							Tambah foto
						</button>
					</header>

					<div className="flex-1 overflow-y-auto p-4 lg:p-5">
						<form onSubmit={handleSubmit} className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
							<div className="flex items-center justify-between gap-2">
								<div className="text-[12px] font-medium text-slate-900">{selectedGallery ? "Edit galeri" : "Tambah galeri"}</div>
								<span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">{selectedGallery ? `ID ${selectedGallery.id}` : "POST /api/galeri"}</span>
							</div>
							<div className="grid gap-2 md:grid-cols-3">
								<input value={form.kategori} onChange={(event) => setForm((current) => ({ ...current, kategori: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none" placeholder="Kategori" />
								<input value={form.text} onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none" placeholder="Judul / deskripsi" />
								<input value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none" placeholder="URL gambar" />
							</div>
							{submitError ? <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">{submitError}</div> : null}
							<div className="flex flex-wrap items-center gap-2">
								<button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white disabled:opacity-60">
									<Plus className="h-3 w-3" />
									{isSubmitting ? "Menyimpan..." : selectedGallery ? "Simpan perubahan" : "Tambah galeri"}
								</button>
								{selectedGallery ? (
									<button type="button" onClick={() => handleDeleteGallery(selectedGallery.id)} className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-medium text-rose-600">
										<Trash2 className="h-3 w-3" />
										Hapus
									</button>
								) : null}
							</div>
							{actionError ? <div className="rounded-lg bg-amber-50 px-3 py-2 text-[9px] text-amber-700">{actionError}</div> : null}
						</form>

						<div className="mb-3 flex flex-wrap items-center gap-2">
							{galleryFilters.map((filter, index) => (
								<button key={filter} type="button" className={`rounded-full border px-3 py-1.5 text-[10px] font-medium ${index === 0 ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500"}`}>
									{filter}
								</button>
							))}
							<div className="ml-auto text-[10px] text-slate-500">{galleryItems.length} foto</div>
						</div>

						<section>
							<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
								{galleryItems.length > 0 ? galleryItems.map((item) => (
									<GalleryCard key={item.id} item={item} onEdit={setSelectedGalleryId} onDelete={handleDeleteGallery} />
								)) : (
									<div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
										Belum ada data galeri di database.
									</div>
								)}
							</div>
						</section>
					</div>
				</section>
			</div>
		</main>
	);
}
