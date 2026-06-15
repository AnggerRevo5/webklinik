"use client";

import type { LucideIcon } from "lucide-react";
import {
  Ambulance,
  Bed,
  ClipboardList,
  Clock3,
  Edit3,
  Eye,
  HeartPlus,
  HouseHeart,
  ListFilter,
  PencilLine,
  Plus,
  Save,
  Stethoscope,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createService,
  deleteService,
  type CreateServicePayload,
  type Service,
  updateService,
  useHomeData,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import ImagePicker from "@/src/UiKecil/image_picker";

type ServiceItem = {
  id: number;
  order: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  iconWrap: string;
  badge: string;
  active: boolean;
};

const iconChoices = [
  Ambulance,
  HouseHeart,
  Stethoscope,
  Bed,
  ClipboardList,
  HeartPlus,
  Users,
  Clock3,
  Eye,
  Edit3,
];

export default function AdminLayananCrud() {
  const { data } = useHomeData();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [serviceActiveMap, setServiceActiveMap] = useState<
    Record<number, boolean>
  >({});
  const [form, setForm] = useState<CreateServicePayload>({
    nama_layanan: "",
    url: "",
  });
  const [editForm, setEditForm] = useState<CreateServicePayload>({
    nama_layanan: "",
    url: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (data?.layanan) {
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
  }, [data?.layanan, selectedServiceId]);

  const selectedService = useMemo(
    () => services.find((item) => item.id === selectedServiceId) ?? null,
    [selectedServiceId, services],
  );

  useEffect(() => {
    if (selectedService) {
      setEditForm({
        nama_layanan: selectedService.nama_layanan,
        url: selectedService.url,
      });
    }
  }, [selectedService]);

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
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Gagal menambah layanan",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedService == null) return;

    setDeleteError(null);
    setIsSaving(true);

    try {
      const updated = await updateService(selectedService.id, editForm);
      setServices((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelectedServiceId(updated.id);
      setEditForm({ nama_layanan: updated.nama_layanan, url: updated.url });
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Gagal mengubah layanan",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteService(serviceId: number) {
    setDeleteError(null);
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
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Gagal menghapus layanan",
      );
    }
  }

  const serviceCards: ServiceItem[] = services.map((item, index) => ({
    id: item.id,
    order: String(index + 1),
    name: item.nama_layanan,
    desc: item.url || "Data gambar/URL belum diisi",
    icon: index % 2 === 0 ? HouseHeart : Stethoscope,
    iconWrap:
      index % 2 === 0
        ? "bg-sky-50 text-sky-600"
        : "bg-emerald-50 text-emerald-600",
    badge: index < 3 ? "Unggulan" : "Reguler",
    active: serviceActiveMap[item.id] ?? true,
  }));

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin kelola layanan KRI AMC</h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="layanan" />
        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-900">
                Layanan
              </div>
              <div className="text-[9px] text-slate-500">
                Data diambil dari tabel layanan pada database
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedServiceId(services[0]?.id ?? null)}
                className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-medium text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
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
                className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-600"
              >
                <Plus className="h-3 w-3" />
                Tambah layanan
              </button>
            </div>
          </header>

          <div className="grid flex-1 gap-4 overflow-y-auto p-4 xl:grid-cols-[minmax(0,1fr)_340px] lg:p-5">
            <section className="space-y-3">
              <form
                onSubmit={handleCreateService}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-slate-900">
                    Tambah layanan
                  </div>
                  <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                    POST /api/layanan
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">
                      Nama layanan
                    </div>
                    <input
                      value={form.nama_layanan}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          nama_layanan: event.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                      placeholder="Contoh: Homevisit"
                    />
                  </div>
                  <ImagePicker
                    value={form.url}
                    onChange={(url) => setForm((current) => ({ ...current, url }))}
                    folder="layanan"
                    label="URL / Gambar"
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
                  className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white disabled:opacity-60"
                >
                  <Plus className="h-3 w-3" />
                  {isSubmitting ? "Menyimpan..." : "Tambah layanan"}
                </button>
              </form>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-4 text-[9px] text-slate-500">
                {services.length > 0
                  ? "Drag untuk ubah urutan layanan."
                  : "Belum ada data layanan di database."}
              </div>
              {serviceCards.length > 0 ? (
                serviceCards.map((service) => {
                  const Icon = service.icon;

                  return (
                    <article
                      key={service.id}
                      className={`flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-sm ${service.active ? "border-slate-200" : "border-slate-200 opacity-60"}`}
                    >
                      <div className="text-slate-300">
                        <PencilLine className="h-4 w-4 rotate-90" />
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-semibold text-slate-500">
                        {service.order}
                      </div>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${service.iconWrap}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-slate-900">
                          {service.name}
                        </div>
                        <div className="text-[9px] text-slate-500">
                          {service.desc}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[8px] font-semibold ${service.badge === "Unggulan" ? "bg-sky-50 text-sky-600" : service.badge === "Reguler" ? "bg-slate-100 text-slate-500" : "bg-rose-50 text-rose-600"}`}
                      >
                        {service.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setServiceActiveMap((current) => ({
                            ...current,
                            [service.id]: !service.active,
                          }))
                        }
                        className={`relative h-[18px] w-8 rounded-full transition-colors duration-300 ${service.active ? "bg-sky-600" : "bg-slate-200"}`}
                      >
                        <span
                          className={`absolute top-[2px] h-3.5 w-3.5 rounded-full bg-white shadow-sm ${service.active ? "left-4" : "left-[2px]"}`}
                        />
                      </button>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedServiceId(service.id)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(service.id)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-rose-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                  Data layanan belum tersedia di database.
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-900">
                  <Edit3 className="h-4 w-4 text-sky-600" />
                  Edit layanan
                </div>
                <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                  {selectedService?.nama_layanan ?? "Belum ada data"}
                </span>
              </div>
              <form onSubmit={handleUpdateService} className="space-y-3 p-4">
                <div className="rounded-2xl bg-sky-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
                      <HeartPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-slate-900">
                        {selectedService?.nama_layanan ?? "Belum ada data"}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {selectedService?.url ??
                          "Tambahkan data layanan di database"}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedService ? (
                  <div className="space-y-2">
                    <div>
                      <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">
                        Nama layanan
                      </div>
                      <input
                        value={editForm.nama_layanan}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            nama_layanan: event.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                      />
                    </div>
                    <ImagePicker
                      value={editForm.url}
                      onChange={(url) => setEditForm((current) => ({ ...current, url }))}
                      folder="layanan"
                      label="Deskripsi / URL Gambar"
                    />
                    <div>
                      <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">
                        Ikon pilihan
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {iconChoices.map((Icon, index) => (
                          <div
                            key={index}
                            className={`flex h-8 items-center justify-center rounded-lg border text-[12px] ${index === 0 ? "border-sky-600 bg-sky-50 text-sky-600" : "border-slate-200 text-slate-500"}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">
                        Preview di website
                      </div>
                      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 p-3 text-white">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                          <HeartPlus className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-medium">
                            {editForm.nama_layanan}
                          </div>
                          <div className="text-[8px] text-white/75">
                            {editForm.url}
                          </div>
                        </div>
                        <span className="ml-auto rounded-full bg-white/15 px-2 py-1 text-[7px] font-semibold">
                          Unggulan
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-[10px] text-slate-500">
                    Belum ada layanan untuk diedit.
                  </div>
                )}
                {deleteError ? (
                  <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                    {deleteError}
                  </div>
                ) : null}
                <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      selectedService &&
                      setEditForm({
                        nama_layanan: selectedService.nama_layanan,
                        url: selectedService.url,
                      })
                    }
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-60"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
