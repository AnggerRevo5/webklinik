"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  FileImage,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import {
  deleteMedia,
  formatFileSize,
  getMedia,
  uploadMedia,
  validateImageFile,
  type MediaFolder,
  type MediaItem,
  type MediaPagination,
} from "@/src/lib/api";

const FOLDERS: { value: MediaFolder | ""; label: string }[] = [
  { value: "", label: "Semua" },
  { value: "dokter", label: "Dokter" },
  { value: "layanan", label: "Layanan" },
  { value: "promo", label: "Promo" },
  { value: "galeri", label: "Galeri" },
  { value: "artikel", label: "Artikel" },
  { value: "logo", label: "Logo" },
];

export default function MediaAdminPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<MediaPagination>({
    page: 1, per_page: 24, total: 0, total_pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeFolder, setActiveFolder] = useState<MediaFolder | "">("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMedia(activeFolder as MediaFolder || undefined, page);
      setMedia(result.data);
      setPagination(result.pagination);
    } catch {
      setError("Gagal memuat gambar.");
    } finally {
      setLoading(false);
    }
  }, [activeFolder, page]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);
  useEffect(() => { setPage(1); setDetail(null); }, [activeFolder]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) { setError(validationError); e.target.value = ""; return; }

    const folder = (activeFolder || "galeri") as MediaFolder;
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((p) => Math.min(p + 10, 90));
    }, 200);

    try {
      const result = await uploadMedia(file, folder);
      clearInterval(interval);
      setUploadProgress(100);
      if (result.success && result.data) {
        await fetchMedia();
        setDetail(result.data);
      } else {
        setError(result.error ?? "Upload gagal");
      }
    } catch {
      clearInterval(interval);
      setError("Gagal upload. Cek koneksi.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Hapus "${item.nama_file}"?`)) return;
    const result = await deleteMedia(item.id);
    if (result.success) {
      if (detail?.id === item.id) setDetail(null);
      fetchMedia();
    } else {
      setError(result.error ?? "Gagal hapus");
    }
  }

  function copyURL(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Media Library KRI AMC</h2>
      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="media" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          {/* Page header */}
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-900">Media Library</div>
              <div className="text-[9px] text-slate-500">
                Gambar tersimpan di Cloudinary · {pagination.total} file
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className={`inline-flex cursor-pointer items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-amber-600 ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                {uploading ? (
                  <><Loader2 className="h-3 w-3 animate-spin" /> Mengupload...</>
                ) : (
                  <><Plus className="h-3 w-3" /> Upload Gambar</>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </header>

          {/* Upload progress */}
          {uploading && (
            <div className="h-0.5 bg-slate-100">
              <div className="h-full bg-sky-600 transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-y-auto p-4 lg:p-5">
              {/* Folder filter */}
              <div className="mb-4 flex flex-wrap gap-2">
                {FOLDERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setActiveFolder(f.value as MediaFolder | "")}
                    className={`rounded-full px-3 py-1.5 text-[9px] font-semibold transition-all ${
                      activeFolder === f.value
                        ? "bg-sky-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {f.label}
                    {f.value === "" && pagination.total > 0 && (
                      <span className="ml-1 opacity-60">({pagination.total})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-3 flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError(null)}><X className="h-3 w-3" /></button>
                </div>
              )}

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 xl:grid-cols-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
                  ))}
                </div>
              ) : media.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white">
                  <FileImage className="h-10 w-10 text-slate-300" />
                  <p className="text-[11px] font-medium text-slate-500">Belum ada gambar</p>
                  <label className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[9px] font-medium text-slate-500 hover:bg-slate-100">
                    <Upload className="mr-1 inline h-3 w-3" />
                    Upload pertama
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 xl:grid-cols-6">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setDetail(detail?.id === item.id ? null : item)}
                      className={`group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${
                        detail?.id === item.id
                          ? "border-sky-600 shadow-[0_0_0_3px_rgba(14,165,233,0.15)]"
                          : "border-transparent hover:border-slate-200"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.nama_file}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      {detail?.id === item.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-sky-600/15">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-white shadow">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/25">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500 text-white opacity-0 shadow transition-opacity group-hover:opacity-100 hover:bg-rose-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="truncate text-[8px] text-white">{item.nama_file}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                  >←</button>
                  <span className="text-[10px] text-slate-400">{page} / {pagination.total_pages}</span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                    disabled={page === pagination.total_pages}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                  >→</button>
                </div>
              )}
            </div>

            {/* Detail panel */}
            {detail && (
              <aside className="hidden w-64 shrink-0 border-l border-slate-200 bg-white p-4 xl:flex xl:flex-col xl:gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-slate-900">Detail</div>
                  <button type="button" onClick={() => setDetail(null)} className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100">
                    <X className="h-3 w-3" />
                  </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={detail.url} alt={detail.nama_file} className="w-full object-cover" />
                </div>

                <div className="space-y-2 text-[9px]">
                  {[
                    { label: "Nama file", value: detail.nama_file },
                    { label: "Folder", value: detail.folder },
                    { label: "Format", value: detail.format.toUpperCase() },
                    { label: "Ukuran", value: formatFileSize(detail.ukuran) },
                    detail.lebar > 0 ? { label: "Dimensi", value: `${detail.lebar} × ${detail.tinggi} px` } : null,
                  ].filter(Boolean).map((row) => row && (
                    <div key={row.label} className="flex items-center justify-between gap-2">
                      <span className="text-slate-400">{row.label}</span>
                      <span className="truncate font-medium text-slate-700">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-400">URL</div>
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                    <span className="flex-1 truncate text-[8px] text-slate-500">{detail.url}</span>
                    <button
                      type="button"
                      onClick={() => copyURL(detail.url)}
                      className="shrink-0 rounded-md bg-sky-50 p-1 text-sky-600 hover:bg-sky-100"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(detail)}
                  className="mt-auto flex items-center justify-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-[9px] font-medium text-rose-600 hover:bg-rose-100"
                >
                  <Trash2 className="h-3 w-3" />
                  Hapus gambar ini
                </button>
              </aside>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
