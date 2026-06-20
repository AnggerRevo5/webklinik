"use client";

import {
  Calendar,
  Edit3,
  Eye,
  Gift,
  Plus,
  Save,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPromo,
  deletePromo,
  getPromo,
  type CreatePromoPayload,
  type Promo,
  updatePromo,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import ImagePicker from "@/src/UiKecil/image_picker";
import {
  ConfirmDialog,
  ToastContainer,
  useToast,
  type ConfirmDialogState,
} from "@/src/UiKecil/admin_ui";

type PromoStatus = "aktif" | "draft" | "expired" | "dijadwalkan";
type TabKey = "semua" | "aktif" | "draft" | "expired";

function getPromoStatus(promo: Promo): PromoStatus {
  if (!promo.tampil) return "draft";
  const now = new Date();
  if (promo.tanggal_selesai && new Date(promo.tanggal_selesai) < now) return "expired";
  if (promo.tanggal_mulai && new Date(promo.tanggal_mulai) > now) return "dijadwalkan";
  return "aktif";
}

const STATUS_LABEL: Record<PromoStatus, string> = {
  aktif: "Aktif",
  draft: "Draft",
  expired: "Expired",
  dijadwalkan: "Dijadwalkan",
};

const STATUS_CLASS: Record<PromoStatus, string> = {
  aktif: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50 text-amber-700",
  expired: "bg-rose-50 text-rose-700",
  dijadwalkan: "bg-sky-50 text-sky-700",
};

function toInputDate(val: string | null | undefined): string {
  if (!val) return "";
  return val.slice(0, 10);
}

function formatDateDisplay(val: string | null | undefined): string {
  if (!val) return "";
  const d = new Date(val);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function sisaHari(tanggalSelesai: string | null | undefined): number | null {
  if (!tanggalSelesai) return null;
  const diff = new Date(tanggalSelesai).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AdminPromoPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loadingPromo, setLoadingPromo] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("semua");
  const [selectedPromoId, setSelectedPromoId] = useState<number | null>(null);
  const [form, setForm] = useState<CreatePromoPayload>({ url: "", tampil: false, tanggal_mulai: null, tanggal_selesai: null });
  const [editForm, setEditForm] = useState<CreatePromoPayload>({ url: "", tampil: false, tanggal_mulai: null, tanggal_selesai: null });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { toasts, showToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(null);

  const loadPromo = useCallback(() => {
    setLoadingPromo(true);
    setFetchError(null);
    getPromo()
      .then((list) => {
        setPromos(list);
        if (list[0]) setSelectedPromoId((prev) => prev ?? list[0].id);
      })
      .catch((err) => {
        setFetchError(err instanceof Error ? err.message : "Gagal memuat data promo dari server.");
      })
      .finally(() => setLoadingPromo(false));
  }, []);

  useEffect(() => { loadPromo(); }, [loadPromo]);

  const selectedPromo = useMemo(
    () => promos.find((item) => item.id === selectedPromoId) ?? null,
    [promos, selectedPromoId],
  );

  useEffect(() => {
    if (selectedPromo) {
      setEditForm({
        url: selectedPromo.url,
        tampil: selectedPromo.tampil,
        tanggal_mulai: toInputDate(selectedPromo.tanggal_mulai),
        tanggal_selesai: toInputDate(selectedPromo.tanggal_selesai),
      });
    }
  }, [selectedPromo]);

  const counts = useMemo(() => {
    const result = { semua: promos.length, aktif: 0, draft: 0, expired: 0 };
    for (const p of promos) {
      const s = getPromoStatus(p);
      if (s === "aktif") result.aktif++;
      else if (s === "draft" || s === "dijadwalkan") result.draft++;
      else if (s === "expired") result.expired++;
    }
    return result;
  }, [promos]);

  const filteredPromos = useMemo(() => {
    if (activeTab === "semua") return promos;
    return promos.filter((p) => {
      const s = getPromoStatus(p);
      if (activeTab === "aktif") return s === "aktif";
      if (activeTab === "draft") return s === "draft" || s === "dijadwalkan";
      if (activeTab === "expired") return s === "expired";
      return true;
    });
  }, [promos, activeTab]);

  function startNewPromo() {
    setSelectedPromoId(null);
    setForm({ url: "", tampil: false, tanggal_mulai: null, tanggal_selesai: null });
    setEditForm({ url: "", tampil: false, tanggal_mulai: null, tanggal_selesai: null });
  }

  function previewPromo(url?: string) {
    if (!url || typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleToggleTampil(promo: Promo) {
    try {
      const updated = await updatePromo(promo.id, {
        url: promo.url,
        tampil: !promo.tampil,
        tanggal_mulai: toInputDate(promo.tanggal_mulai) || null,
        tanggal_selesai: toInputDate(promo.tanggal_selesai) || null,
      });
      setPromos((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      showToast(updated.tampil ? "Promo ditampilkan di website" : "Promo disembunyikan dari website", "success");
    } catch {
      showToast("Gagal mengubah status promo", "error");
    }
  }

  async function handleCreatePromo(event: { preventDefault(): void }) {
    event.preventDefault();
    if (!form.url) {
      setSubmitError("Pilih gambar promo terlebih dahulu.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const created = await createPromo(form);
      setPromos((current) => [created, ...current]);
      setSelectedPromoId(created.id);
      setForm({ url: "", tampil: false, tanggal_mulai: null, tanggal_selesai: null });
      showToast("Promo berhasil ditambahkan!", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal menambah promo";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdatePromo(event: { preventDefault(): void }) {
    event.preventDefault();
    if (selectedPromo == null) return;
    setActionError(null);
    setIsSaving(true);
    try {
      const updated = await updatePromo(selectedPromo.id, editForm);
      setPromos((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      showToast("Promo berhasil disimpan!", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal mengubah promo";
      setActionError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  function handleDeletePromo(promoId: number, label: string) {
    setConfirmDialog({
      title: "Hapus Promo?",
      message: `"${label}" akan dihapus permanen dan tidak bisa dikembalikan.`,
      onConfirm: async () => {
        try {
          await deletePromo(promoId);
          setPromos((current) => {
            const next = current.filter((item) => item.id !== promoId);
            if (selectedPromoId === promoId) setSelectedPromoId(next[0]?.id ?? null);
            return next;
          });
          showToast("Promo berhasil dihapus", "success");
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Gagal menghapus promo";
          setActionError(msg);
          showToast(msg, "error");
        }
      },
    });
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: "semua", label: `Semua (${counts.semua})` },
    { key: "aktif", label: `Aktif (${counts.aktif})` },
    { key: "draft", label: `Draft (${counts.draft})` },
    { key: "expired", label: `Expired (${counts.expired})` },
  ];

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin kelola promo KRI AMC</h2>
      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="promo" />
        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-900">Promo</div>
              <div className="text-[10px] text-slate-500">
                Promo dengan status Aktif dan dalam rentang tanggal akan tampil di website
              </div>
            </div>
            <button
              type="button"
              onClick={startNewPromo}
              className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-600"
            >
              <Plus className="h-3 w-3" />
              Buat promo baru
            </button>
          </header>

          <div className="grid flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[minmax(0,1fr)_380px] lg:p-5">
            <section className="space-y-3">
              {/* Form tambah promo */}
              <form
                onSubmit={handleCreatePromo}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-slate-900">Tambah promo baru</div>
                  <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                    POST /api/promo
                  </span>
                </div>
                <ImagePicker
                  value={form.url}
                  onChange={(url) => setForm((f) => ({ ...f, url }))}
                  folder="promo"
                  label="Gambar Promo"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                      Tanggal Mulai (opsional)
                    </label>
                    <input
                      type="date"
                      value={form.tanggal_mulai ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, tanggal_mulai: e.target.value || null }))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-700 focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                      Tanggal Selesai (opsional)
                    </label>
                    <input
                      type="date"
                      value={form.tanggal_selesai ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, tanggal_selesai: e.target.value || null }))}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-700 focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-[10px] font-medium text-slate-700">Langsung tampilkan di website</span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, tampil: !f.tampil }))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.tampil ? "bg-emerald-500" : "bg-slate-300"}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.tampil ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
                {submitError ? (
                  <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">{submitError}</div>
                ) : null}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-600"
                >
                  <Plus className="h-3 w-3" />
                  {isSubmitting ? "Menyimpan..." : "Tambah promo"}
                </button>
              </form>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 text-[9px] font-medium">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-full border px-3 py-1.5 transition-colors ${activeTab === tab.key ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Daftar promo */}
              <div className="space-y-3">
                {loadingPromo ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-400 shadow-sm">
                    Memuat data promo...
                  </div>
                ) : fetchError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
                    <div className="mb-2 text-[10px] font-semibold text-rose-700">Gagal memuat promo</div>
                    <div className="mb-3 text-[9px] text-rose-600">{fetchError}</div>
                    <button
                      type="button"
                      onClick={loadPromo}
                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-[9px] font-medium text-white hover:bg-rose-700"
                    >
                      Coba lagi
                    </button>
                  </div>
                ) : filteredPromos.length > 0 ? (
                  filteredPromos.map((promo, index) => {
                    const status = getPromoStatus(promo);
                    const sisa = sisaHari(promo.tanggal_selesai);
                    return (
                      <article
                        key={promo.id}
                        className={`grid overflow-hidden rounded-2xl border bg-white shadow-sm md:grid-cols-[160px_minmax(0,1fr)] ${selectedPromoId === promo.id ? "border-sky-500 ring-2 ring-sky-100" : "border-slate-200"}`}
                      >
                        <div className="relative min-h-30 bg-slate-100">
                          {promo.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={promo.url}
                              alt={`Promo ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                              <Gift className="h-10 w-10" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 p-4 text-[10px]">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${STATUS_CLASS[status]}`}>
                              {STATUS_LABEL[status]}
                            </span>
                            {promo.tanggal_mulai || promo.tanggal_selesai ? (
                              <span className="inline-flex items-center gap-1 text-[8px] text-slate-400">
                                <Calendar className="h-3 w-3" />
                                {promo.tanggal_mulai ? formatDateDisplay(promo.tanggal_mulai) : "—"}
                                {" s/d "}
                                {promo.tanggal_selesai ? formatDateDisplay(promo.tanggal_selesai) : "∞"}
                              </span>
                            ) : null}
                            {status === "aktif" && sisa !== null && sisa <= 7 ? (
                              <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-[8px] font-semibold text-amber-600">
                                {sisa > 0 ? `${sisa} hari lagi` : "Hari terakhir"}
                              </span>
                            ) : null}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-900">Promo {index + 1}</div>
                          <div className="truncate text-[9px] text-slate-400" title={promo.url}>
                            {promo.url || "URL gambar belum diisi"}
                          </div>
                          <div className="mt-auto flex gap-1 pt-1">
                            <button
                              type="button"
                              onClick={() => handleToggleTampil(promo)}
                              title={promo.tampil ? "Sembunyikan dari website" : "Tampilkan di website"}
                              className={`rounded-md p-1.5 transition-all duration-300 hover:-translate-y-0.5 ${promo.tampil ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                            >
                              {promo.tampil ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedPromoId(promo.id)}
                              title="Edit promo"
                              className="rounded-md bg-sky-50 p-1.5 text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => previewPromo(promo.url)}
                              title="Lihat gambar"
                              className="rounded-md bg-slate-50 p-1.5 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Hapus promo ini"
                              aria-label="Hapus promo ini"
                              onClick={() => handleDeletePromo(promo.id, `Promo ${index + 1}`)}
                              className="rounded-md bg-rose-50 p-1.5 text-rose-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                    {promos.length === 0 ? "Belum ada data promo di database." : `Tidak ada promo dengan status "${activeTab}".`}
                  </div>
                )}
              </div>
            </section>

            {/* Panel edit */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm self-start">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                  <Tag className="h-4 w-4 text-amber-500" />
                  Edit promo
                </div>
                {selectedPromo ? (
                  <span className={`rounded-full px-2 py-1 text-[8px] font-semibold ${STATUS_CLASS[getPromoStatus(selectedPromo)]}`}>
                    {STATUS_LABEL[getPromoStatus(selectedPromo)]}
                  </span>
                ) : null}
              </div>
              <form onSubmit={handleUpdatePromo} className="space-y-3 p-4 text-[10px]">
                {selectedPromo ? (
                  <>
                    {/* Preview gambar */}
                    {selectedPromo.url ? (
                      <div className="relative h-28 overflow-hidden rounded-xl bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedPromo.url} alt="Preview promo" className="h-full w-full object-cover" />
                      </div>
                    ) : null}

                    <ImagePicker
                      value={editForm.url}
                      onChange={(url) => setEditForm((f) => ({ ...f, url }))}
                      folder="promo"
                      label="URL Gambar Promo"
                    />

                    {/* Toggle tampil */}
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <div>
                        <div className="font-medium text-slate-700">Tampilkan di website</div>
                        <div className="text-[8px] text-slate-400">
                          {editForm.tampil ? "Promo aktif terlihat pengunjung" : "Promo tersembunyi (draft)"}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditForm((f) => ({ ...f, tampil: !f.tampil }))}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${editForm.tampil ? "bg-emerald-500" : "bg-slate-300"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${editForm.tampil ? "translate-x-4" : "translate-x-0.5"}`} />
                      </button>
                    </div>

                    {/* Tanggal */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                        Tanggal Mulai (opsional)
                      </label>
                      <input
                        type="date"
                        value={editForm.tanggal_mulai ?? ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, tanggal_mulai: e.target.value || null }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-700 focus:border-sky-400 focus:outline-none"
                      />
                      <div className="text-[8px] text-slate-400">Kosongkan agar promo langsung tampil</div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                        Tanggal Selesai (opsional)
                      </label>
                      <input
                        type="date"
                        value={editForm.tanggal_selesai ?? ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, tanggal_selesai: e.target.value || null }))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-700 focus:border-sky-400 focus:outline-none"
                      />
                      <div className="text-[8px] text-slate-400">Kosongkan agar promo tampil tanpa batas waktu</div>
                    </div>

                    {actionError ? (
                      <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">{actionError}</div>
                    ) : null}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            url: selectedPromo.url,
                            tampil: selectedPromo.tampil,
                            tanggal_mulai: toInputDate(selectedPromo.tanggal_mulai),
                            tanggal_selesai: toInputDate(selectedPromo.tanggal_selesai),
                          })
                        }
                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-700"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {isSaving ? "Menyimpan..." : "Simpan"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-[10px] text-slate-500">
                    Pilih promo dari daftar untuk diedit, atau tambah promo baru.
                  </div>
                )}
              </form>
              <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
                <button
                  type="button"
                  onClick={startNewPromo}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => previewPromo(selectedPromo?.url)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-[10px] font-medium text-emerald-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Lihat Gambar
                </button>
              </div>
            </section>
          </div>
        </section>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </main>
  );
}
