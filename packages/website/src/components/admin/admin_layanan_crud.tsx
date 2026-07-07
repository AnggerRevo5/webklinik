"use client";

import {
  ClipboardList,
  Edit3,
  ListFilter,
  PencilLine,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  createService,
  deleteService,
  type CreateServicePayload,
  type Service,
  updateService,
} from "@/src/lib/api";
import { useHomeData } from "@/src/lib/hooks";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import ImagePicker from "@/src/UiKecil/image_picker";
import {
  AdminHeader,
  adminPrimaryBtn,
  ConfirmDialog,
  ToastContainer,
  useToast,
  type ConfirmDialogState,
} from "@/src/UiKecil/admin_ui";

export default function AdminLayananCrud() {
  const { data } = useHomeData();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [serviceActiveMap, setServiceActiveMap] = useState<Record<number, boolean>>({});
  const [form, setForm] = useState<CreateServicePayload>({ nama_layanan: "", url: "" });
  const [editForm, setEditForm] = useState<CreateServicePayload>({ nama_layanan: "", url: "" });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { toasts, showToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(null);

  // Sinkronkan services/serviceActiveMap dari data hook saat RENDER (bukan di
  // efek) — pola resmi React "adjusting state when a prop changes", dikunci
  // ke referensi array data.layanan supaya cuma jalan sekali per fetch baru.
  const [syncedLayanan, setSyncedLayanan] = useState<Service[] | undefined>(undefined);
  if (data?.layanan && data.layanan !== syncedLayanan) {
    setSyncedLayanan(data.layanan);
    setServices(data.layanan);
    setServiceActiveMap((current) => {
      const nextMap = { ...current };
      for (const item of data.layanan) {
        if (!(item.id in nextMap)) nextMap[item.id] = true;
      }
      return nextMap;
    });
    if (selectedServiceId == null && data.layanan[0]) {
      setSelectedServiceId(data.layanan[0].id);
    }
  }

  const selectedService = useMemo(
    () => services.find((item) => item.id === selectedServiceId) ?? null,
    [selectedServiceId, services],
  );

  // Sinkronkan editForm ke layanan terpilih saat RENDER (bukan di efek).
  const [syncedServiceId, setSyncedServiceId] = useState<number | null>(null);
  if (selectedServiceId !== syncedServiceId) {
    setSyncedServiceId(selectedServiceId);
    if (selectedService) {
      setEditForm({
        nama_layanan: selectedService.nama_layanan,
        url: selectedService.url,
      });
    }
  }

  async function handleCreateService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const created = await createService(form);
      setServices((current) => [created, ...current]);
      setSelectedServiceId(created.id);
      setEditForm({ nama_layanan: created.nama_layanan, url: created.url });
      setForm({ nama_layanan: "", url: "" });
      showToast("Layanan berhasil ditambahkan!", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal menambah layanan";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedService == null) return;
    setSaveError(null);
    setIsSaving(true);
    try {
      const updated = await updateService(selectedService.id, editForm);
      setServices((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelectedServiceId(updated.id);
      setEditForm({ nama_layanan: updated.nama_layanan, url: updated.url });
      showToast("Perubahan berhasil disimpan!", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal mengubah layanan";
      setSaveError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  function handleDeleteService(serviceId: number, serviceName: string) {
    setConfirmDialog({
      title: "Hapus Layanan?",
      message: `"${serviceName}" akan dihapus permanen dan tidak bisa dikembalikan.`,
      onConfirm: async () => {
        try {
          await deleteService(serviceId);
          setServices((current) => current.filter((item) => item.id !== serviceId));
          setServiceActiveMap((current) => {
            const nextMap = { ...current };
            delete nextMap[serviceId];
            return nextMap;
          });
          setSelectedServiceId((currentSelected) => {
            if (currentSelected !== serviceId) return currentSelected;
            const nextItem = services.find((item) => item.id !== serviceId);
            return nextItem?.id ?? null;
          });
          showToast("Layanan berhasil dihapus", "success");
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Gagal menghapus layanan";
          showToast(msg, "error");
        }
      },
    });
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin kelola layanan KRI AMC</h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="layanan" />
        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <AdminHeader
            icon={<ClipboardList className="h-5 w-5" />}
            title="Layanan"
            subtitle="Data diambil dari tabel layanan pada database"
          >
            <button
              type="button"
              onClick={() => setSelectedServiceId(services[0]?.id ?? null)}
              className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-2 text-[11px] font-medium text-sky-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-100"
            >
              <ListFilter className="h-3 w-3" />
              Semua ({services.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedServiceId(null);
                setForm({ nama_layanan: "", url: "" });
                setEditForm({ nama_layanan: "", url: "" });
              }}
              className={adminPrimaryBtn}
            >
              <Plus className="h-3 w-3" />
              Tambah layanan
            </button>
          </AdminHeader>

          <div className="grid flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[minmax(0,1fr)_360px] lg:p-5">
            {/* Daftar layanan */}
            <section className="space-y-3">
              <form
                onSubmit={handleCreateService}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-slate-900">Tambah layanan baru</div>
                  <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                    POST /api/layanan
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Nama layanan
                    </div>
                    <input
                      value={form.nama_layanan}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, nama_layanan: event.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                      placeholder="Contoh: Homevisit"
                    />
                  </div>
                  <ImagePicker
                    value={form.url}
                    onChange={(url) => setForm((current) => ({ ...current, url }))}
                    folder="layanan"
                    label="Gambar layanan"
                  />
                </div>
                {submitError ? (
                  <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                    {submitError}
                  </div>
                ) : null}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={adminPrimaryBtn}
                >
                  <Plus className="h-3 w-3" />
                  {isSubmitting ? "Menyimpan..." : "Tambah layanan"}
                </button>
              </form>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-3 text-[9px] text-slate-500">
                {services.length > 0
                  ? `${services.length} layanan tersimpan. Klik ikon edit untuk mengubah detail.`
                  : "Belum ada data layanan di database."}
              </div>

              {services.length > 0 ? (
                services.map((service, index) => (
                  <article
                    key={service.id}
                    className={`flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm transition-colors ${selectedServiceId === service.id ? "border-sky-300 ring-1 ring-sky-200" : "border-slate-200"} ${serviceActiveMap[service.id] === false ? "opacity-60" : ""}`}
                  >
                    <div className="text-slate-300">
                      <PencilLine className="h-4 w-4 rotate-90" />
                    </div>
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-semibold text-slate-500">
                      {index + 1}
                    </div>
                    {service.url ? (
                      <img
                        src={service.url}
                        alt={service.nama_layanan}
                        className="h-8 w-8 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 shrink-0 rounded-lg bg-slate-100" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-slate-900">{service.nama_layanan}</div>
                      <div className="truncate text-[9px] text-slate-400">
                        {service.url || "Gambar belum diisi"}
                      </div>
                    </div>
                    <button
                      type="button"
                      title={serviceActiveMap[service.id] !== false ? "Sembunyikan dari website" : "Tampilkan di website"}
                      onClick={() =>
                        setServiceActiveMap((current) => ({
                          ...current,
                          [service.id]: !(current[service.id] ?? true),
                        }))
                      }
                      className={`relative h-4.5 w-8 shrink-0 rounded-full transition-colors duration-300 ${serviceActiveMap[service.id] !== false ? "bg-sky-600" : "bg-slate-200"}`}
                    >
                      <span
                        className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-all ${serviceActiveMap[service.id] !== false ? "left-4" : "left-0.5"}`}
                      />
                    </button>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        title="Edit layanan ini"
                        onClick={() => setSelectedServiceId(service.id)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600 transition-all hover:-translate-y-0.5 hover:bg-sky-100"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        title="Hapus layanan ini"
                        onClick={() => handleDeleteService(service.id, service.nama_layanan)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-rose-600 transition-all hover:-translate-y-0.5 hover:bg-rose-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                  Data layanan belum tersedia di database.
                </div>
              )}
            </section>

            {/* Panel edit */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm self-start sticky top-4">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                  <Edit3 className="h-4 w-4 text-sky-600" />
                  Edit layanan
                </div>
                {selectedService && (
                  <span className="rounded-full bg-sky-50 px-2 py-1 text-[9px] font-semibold text-sky-600">
                    ID #{selectedService.id}
                  </span>
                )}
              </div>

              <form onSubmit={handleUpdateService} className="p-4 space-y-4">
                {selectedService ? (
                  <>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Nama layanan
                      </label>
                      <input
                        value={editForm.nama_layanan}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, nama_layanan: event.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] outline-none focus:border-sky-400 focus:bg-white"
                        placeholder="Nama layanan"
                      />
                    </div>

                    <ImagePicker
                      value={editForm.url}
                      onChange={(url) => setEditForm((current) => ({ ...current, url }))}
                      folder="layanan"
                      label="Gambar layanan"
                    />

                    {editForm.url && (
                      <div>
                        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Preview gambar
                        </div>
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <img
                            src={editForm.url}
                            alt={editForm.nama_layanan}
                            className="h-32 w-full object-cover"
                          />
                          <div className="bg-slate-50 px-3 py-2">
                            <div className="text-[11px] font-medium text-slate-900">{editForm.nama_layanan}</div>
                            <div className="truncate text-[9px] text-slate-400">{editForm.url}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {saveError && (
                      <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                        {saveError}
                      </div>
                    )}

                    <div className="flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm({
                            nama_layanan: selectedService.nama_layanan,
                            url: selectedService.url,
                          })
                        }
                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500 hover:bg-slate-100"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-60 hover:bg-sky-700"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {isSaving ? "Menyimpan..." : "Simpan perubahan"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-[10px] text-slate-500">
                    Pilih layanan dari daftar untuk mengedit detailnya.
                  </div>
                )}
              </form>
            </section>
          </div>
        </section>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </main>
  );
}
