"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Image as ImageIcon, Loader2, Trash2, Upload, X } from "lucide-react";
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
  { value: "kegiatan", label: "Kegiatan" },
  { value: "staff", label: "Staff" },
  { value: "artikel", label: "Artikel" },
  { value: "logo", label: "Logo" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  defaultFolder?: MediaFolder;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect, defaultFolder }: Props) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<MediaPagination>({ page: 1, per_page: 24, total: 0, total_pages: 0 });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [activeFolder, setActiveFolder] = useState<MediaFolder | "">(defaultFolder ?? "");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Logika fetch murni (.then, bukan async/await) — TIDAK ada setState sinkron
  // di level teratas, supaya aman dipanggil langsung dari efek di bawah
  // (react-hooks/set-state-in-effect). Tetap mengembalikan Promise supaya
  // caller lain (upload/delete) bisa tetap `await fetchMedia()`.
  const fetchMedia = useCallback(() => {
    return getMedia(activeFolder as MediaFolder || undefined, page)
      .then((result) => {
        setMedia(result.data);
        setPagination(result.pagination);
        setError(null);
      })
      .catch(() => {
        setError("Gagal memuat gambar. Coba refresh.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeFolder, page]);

  // Reset seleksi & tandai loading saat modal dibuka — saat RENDER (bukan efek).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setSelected(null);
      setLoading(true);
    }
  }

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen, fetchMedia]);

  // Reset halaman & seleksi saat folder berubah — saat RENDER (bukan efek).
  const [syncedActiveFolder, setSyncedActiveFolder] = useState(activeFolder);
  if (activeFolder !== syncedActiveFolder) {
    setSyncedActiveFolder(activeFolder);
    setPage(1);
    setSelected(null);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

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
        setSelected(result.data);
      } else {
        setError(result.error ?? "Upload gagal");
      }
    } catch {
      clearInterval(interval);
      setError("Gagal upload. Cek koneksi dan coba lagi.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  }

  async function handleDelete(item: MediaItem, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Hapus "${item.nama_file}"?\nKonten yang sudah pakai URL ini tidak terpengaruh.`)) return;
    const result = await deleteMedia(item.id);
    if (result.success) {
      if (selected?.id === item.id) setSelected(null);
      fetchMedia();
    } else {
      setError(result.error ?? "Gagal hapus gambar");
    }
  }

  function handleConfirm() {
    if (selected) {
      onSelect(selected.url);
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div className="flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-900">Media Library</div>
              {pagination.total > 0 && (
                <div className="text-[9px] text-slate-400">{pagination.total} gambar tersimpan</div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3">
          <div className="flex flex-1 flex-wrap gap-1.5">
            {FOLDERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setActiveFolder(f.value as MediaFolder | "")}
                className={`rounded-full px-3 py-1 text-[9px] font-semibold transition-all ${
                  activeFolder === f.value
                    ? "bg-sky-600 text-white"
                    : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label
            className={`btn-shine inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-linear-to-r from-sky-600 to-cyan-500 px-3.5 py-2 text-[11px] font-semibold text-white shadow-sm shadow-sky-600/25 transition-all hover:-translate-y-0.5 hover:shadow-md ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Mengupload... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="h-3 w-3" />
                Upload Gambar
              </>
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

        {/* Progress bar */}
        {uploading && (
          <div className="h-0.5 bg-slate-100">
            <div
              className="h-full bg-sky-600 transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mx-5 mt-3 flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)}>
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
              <ImageIcon className="h-10 w-10 opacity-30" />
              <p className="text-[11px] font-medium">Belum ada gambar</p>
              <p className="text-[9px]">
                {activeFolder ? `Folder "${activeFolder}" masih kosong` : "Upload gambar menggunakan tombol di atas"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
              {media.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelected(selected?.id === item.id ? null : item)}
                  className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                    selected?.id === item.id
                      ? "border-sky-600 shadow-[0_0_0_3px_rgba(14,165,233,0.2)]"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.nama_file}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />

                  {/* Selected checkmark */}
                  {selected?.id === item.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-sky-600/20">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/30">
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item, e)}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-rose-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>

                    {/* File info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-[9px] text-white">{item.nama_file}</p>
                      <p className="text-[8px] text-white/70">{formatFileSize(item.ukuran)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-slate-100 px-5 py-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-500 disabled:opacity-40 hover:bg-slate-100"
            >
              ←
            </button>
            <span className="text-[10px] text-slate-500">
              {page} / {pagination.total_pages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
              disabled={page === pagination.total_pages}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-medium text-slate-500 disabled:opacity-40 hover:bg-slate-100"
            >
              →
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <div className="text-[9px] text-slate-400">
            {selected ? (
              <span>
                <span className="font-semibold text-sky-600">{selected.nama_file}</span>
                {" — "}
                {formatFileSize(selected.ukuran)}
                {selected.lebar > 0 && ` · ${selected.lebar}×${selected.tinggi}px`}
              </span>
            ) : (
              "Klik gambar untuk memilih"
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selected}
              className="btn-shine rounded-lg bg-linear-to-r from-sky-600 to-cyan-500 px-4 py-2 text-[11px] font-semibold text-white shadow-sm shadow-sky-600/25 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-40 disabled:hover:translate-y-0"
            >
              Gunakan Gambar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
