"use client";

import {
  CalendarDays,
  Edit3,
  Eye,
  Gift,
  Plus,
  Save,
  Tag,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createPromo,
  deletePromo,
  type CreatePromoPayload,
  type Promo,
  updatePromo,
  useHomeData,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import ImagePicker from "@/src/UiKecil/image_picker";
import {
  ConfirmDialog,
  ToastContainer,
  useToast,
  type ConfirmDialogState,
} from "@/src/UiKecil/admin_ui";

export default function AdminPromoPage() {
  const { data } = useHomeData();
  const [promos, setPromos] = useState<Promo[]>([]);
  const [selectedPromoId, setSelectedPromoId] = useState<number | null>(null);
  const [form, setForm] = useState<CreatePromoPayload>({ url: "" });
  const [editForm, setEditForm] = useState<CreatePromoPayload>({ url: "" });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { toasts, showToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(null);

  useEffect(() => {
    if (data?.promo) {
      setPromos(data.promo);
      if (selectedPromoId == null && data.promo[0]) {
        setSelectedPromoId(data.promo[0].id);
      }
    }
  }, [data?.promo, selectedPromoId]);

  const selectedPromo = useMemo(
    () => promos.find((item) => item.id === selectedPromoId) ?? null,
    [promos, selectedPromoId],
  );

  useEffect(() => {
    if (selectedPromo) {
      setEditForm({ url: selectedPromo.url });
    }
  }, [selectedPromo]);

  function startNewPromo() {
    setSelectedPromoId(null);
    setForm({ url: "" });
    setEditForm({ url: "" });
  }

  function previewPromo(url?: string) {
    if (!url || typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const promoCards = promos.map((promo, index) => ({
    id: promo.id,
    title: `Promo ${index + 1}`,
    desc: promo.url || "URL gambar promo belum diisi",
    status: index === 0 ? "Aktif" : "Draft",
    badge: index === 0 ? "Aktif" : "",
    period: "Data dari tabel promo",
    countdown: String(index + 1),
  }));

  async function handleCreatePromo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const created = await createPromo(form);
      setPromos((current) => [created, ...current]);
      setSelectedPromoId(created.id);
      setEditForm({ url: created.url });
      setForm({ url: "" });
      showToast("Promo berhasil ditambahkan!", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal menambah promo";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdatePromo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedPromo == null) return;

    setActionError(null);
    setIsSaving(true);

    try {
      const updated = await updatePromo(selectedPromo.id, editForm);
      setPromos((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelectedPromoId(updated.id);
      setEditForm({ url: updated.url });
      showToast("Promo berhasil disimpan!", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal mengubah promo";
      setActionError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  function handleDeletePromo(promoId: number, promoTitle: string) {
    setConfirmDialog({
      title: "Hapus Promo?",
      message: `"${promoTitle}" akan dihapus permanen dan tidak bisa dikembalikan.`,
      onConfirm: async () => {
        setActionError(null);
        try {
          await deletePromo(promoId);
          setPromos((current) => {
            const nextPromos = current.filter((item) => item.id !== promoId);
            if (selectedPromoId === promoId) {
              setSelectedPromoId(nextPromos[0]?.id ?? null);
            }
            return nextPromos;
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

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin kelola promo KRI AMC</h2>
      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="promo" />
        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-900">
                Promo
              </div>
              <div className="text-[10px] text-slate-500">
                Data diambil dari tabel promo pada database
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
              <form
                onSubmit={handleCreatePromo}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-slate-900">
                    Tambah promo
                  </div>
                  <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                    POST /api/promo
                  </span>
                </div>
                <ImagePicker
                  value={form.url}
                  onChange={(url) => setForm({ url })}
                  folder="promo"
                  label="URL Gambar Promo"
                />
                {submitError ? (
                  <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                    {submitError}
                  </div>
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

              <div className="flex flex-wrap gap-2 text-[9px] font-medium">
                {[`Semua (${promos.length})`, "Aktif", "Draft", "Expired"].map(
                  (label, index) => (
                    <span
                      key={label}
                      className={`rounded-full border px-3 py-1.5 ${index === 0 ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500"}`}
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
              <div className="space-y-3">
                {promoCards.length > 0 ? (
                  promoCards.map((promo, index) => (
                    <article
                      key={promo.id}
                      className={`grid overflow-hidden rounded-2xl border bg-white shadow-sm md:grid-cols-[160px_minmax(0,1fr)] ${index === 0 ? "border-sky-600 ring-2 ring-sky-100" : "border-slate-200"}`}
                    >
                      <div
                        className={`relative min-h-[120px] bg-gradient-to-br ${index === 0 ? "from-sky-600 to-sky-800" : index === 1 ? "from-emerald-500 to-emerald-700" : index === 2 ? "from-amber-300 to-orange-500" : "from-slate-300 to-slate-400"}`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-white/40">
                          <Gift className="h-10 w-10" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 p-4 text-[10px]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[8px] font-semibold ${promo.status === "Aktif" ? "bg-emerald-50 text-emerald-600" : promo.status === "Draft" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}
                          >
                            {promo.status}
                          </span>
                          {promo.badge ? (
                            <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                              {promo.badge}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[12px] font-semibold text-slate-900">
                          {promo.title}
                        </div>
                        <div className="leading-6 text-slate-500">
                          {promo.desc}
                        </div>
                        <div className="mt-auto flex flex-wrap items-center gap-3 text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {promo.period}
                          </span>
                          {promo.countdown ? (
                            <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-600">
                              <span className="font-semibold">
                                {promo.countdown}
                              </span>{" "}
                              hari lagi
                            </span>
                          ) : null}
                        </div>
                        <div className="flex gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => setSelectedPromoId(promo.id)}
                            className="rounded-md bg-sky-50 p-1.5 text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => previewPromo(promo.desc)}
                            className="rounded-md bg-slate-50 p-1.5 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Hapus promo ini"
                            aria-label="Hapus promo ini"
                            onClick={() => handleDeletePromo(promo.id, promo.title)}
                            className="rounded-md bg-rose-50 p-1.5 text-rose-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                    Belum ada data promo di database.
                  </div>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                  <Tag className="h-4 w-4 text-amber-500" />
                  Edit promo
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-600">
                  {selectedPromo?.url ?? "Kosong"}
                </span>
              </div>
              <form
                onSubmit={handleUpdatePromo}
                className="space-y-3 p-4 text-[10px]"
              >
                <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 p-3 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-medium">
                        {selectedPromo
                          ? `Promo ${selectedPromo.id}`
                          : "Belum ada data promo"}
                      </div>
                      <div className="text-[8px] text-white/70">
                        Tampilan di website
                      </div>
                    </div>
                  </div>
                </div>
                {selectedPromo ? (
                  <>
                    <ImagePicker
                      value={editForm.url}
                      onChange={(url) => setEditForm({ url })}
                      folder="promo"
                      label="URL Gambar Promo"
                    />
                    {actionError ? (
                      <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                        {actionError}
                      </div>
                    ) : null}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          selectedPromo &&
                          setEditForm({ url: selectedPromo.url })
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
                    Belum ada promo di database.
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
