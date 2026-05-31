"use client";

import {
  CalendarDays,
  MoreHorizontal,
  Plus,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  createDoctor,
  deleteDoctor,
  type CreateDoctorPayload,
  type Doctor,
  updateDoctor,
  useHomeData,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type DoctorCard = {
  id: number;
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

export default function DokterJadwalAdmin() {
  const { data } = useHomeData();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateDoctorPayload>({
    url: "",
    nama_dokter: "",
    jadwal_praktek: "",
    kategori: "",
  });
  const [editForm, setEditForm] = useState<CreateDoctorPayload>({
    url: "",
    nama_dokter: "",
    jadwal_praktek: "",
    kategori: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (data?.dokter) {
      setDoctors(data.dokter);
      if (selectedDoctorId == null && data.dokter[0]) {
        setSelectedDoctorId(data.dokter[0].id);
      }
    }
  }, [data?.dokter, selectedDoctorId]);

  const selectedDoctor = useMemo(
    () => doctors.find((item) => item.id === selectedDoctorId) ?? null,
    [doctors, selectedDoctorId],
  );

  useEffect(() => {
    if (selectedDoctor) {
      setEditForm({
        url: selectedDoctor.url,
        nama_dokter: selectedDoctor.nama_dokter,
        jadwal_praktek: selectedDoctor.jadwal_praktek,
        kategori: selectedDoctor.kategori,
      });
    }
  }, [selectedDoctor]);

  const doctorCards: DoctorCard[] = doctors.map((doctor, index) => ({
    id: doctor.id,
    initials:
      doctor.nama_dokter
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "DR",
    name: doctor.nama_dokter,
    specialty: doctor.kategori,
    badge: index === 0 ? "Aktif" : "Tersedia",
    badgeClassName:
      index === 0 ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600",
    avatarClassName:
      index % 3 === 0
        ? "bg-sky-600"
        : index % 3 === 1
          ? "bg-emerald-600"
          : "bg-amber-600",
    scheduleTitle: "Jadwal praktik",
    primarySchedule: doctor.jadwal_praktek || "Belum diisi",
    secondarySchedule: doctor.url || "",
    stats: [
      { value: String(index + 1), label: "Urutan" },
      { value: doctor.kategori || "-", label: "Kategori" },
      { value: String(doctor.id), label: "ID" },
    ],
    dayDots: [true, true, true, true, true, true, true],
  }));
  const weeklySchedule: Array<{
    day: string;
    date: string;
    doctor: string;
    active: boolean;
  }> = [];

  async function handleCreateDoctor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const created = await createDoctor(form);
      setDoctors((current) => [created, ...current]);
      setSelectedDoctorId(created.id);
      setEditForm({
        url: created.url,
        nama_dokter: created.nama_dokter,
        jadwal_praktek: created.jadwal_praktek,
        kategori: created.kategori,
      });
      setForm({ url: "", nama_dokter: "", jadwal_praktek: "", kategori: "" });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Gagal menambah dokter",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateDoctor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedDoctor == null) return;

    setActionError(null);
    setIsSaving(true);

    try {
      const updated = await updateDoctor(selectedDoctor.id, editForm);
      setDoctors((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelectedDoctorId(updated.id);
      setEditForm({
        url: updated.url,
        nama_dokter: updated.nama_dokter,
        jadwal_praktek: updated.jadwal_praktek,
        kategori: updated.kategori,
      });
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Gagal mengubah dokter",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteDoctor(doctorId: number) {
    setActionError(null);
    try {
      await deleteDoctor(doctorId);
      setDoctors((current) => {
        const nextDoctors = current.filter((item) => item.id !== doctorId);
        if (selectedDoctorId === doctorId) {
          setSelectedDoctorId(nextDoctors[0]?.id ?? null);
        }
        return nextDoctors;
      });
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Gagal menghapus dokter",
      );
    }
  }

  function scrollToSchedule() {
    if (typeof document === "undefined") return;
    document
      .getElementById("jadwal-mingguan")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function previewDoctor(url?: string) {
    if (!url || typeof window === "undefined") return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin kelola dokter KRI AMC</h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="dokter" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-900">
                Dokter & Jadwal
              </div>
              <div className="text-[9px] text-slate-400">
                Data diambil dari tabel dokter
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            <form
              onSubmit={handleCreateDoctor}
              className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="text-[12px] font-medium text-slate-900">
                  Tambah dokter
                </div>
                <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                  POST /api/dokter
                </span>
              </div>
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                <input
                  value={form.nama_dokter}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      nama_dokter: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                  placeholder="Nama dokter"
                />
                <input
                  value={form.kategori}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      kategori: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                  placeholder="Kategori"
                />
                <input
                  value={form.jadwal_praktek}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      jadwal_praktek: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                  placeholder="Jadwal praktek"
                />
                <input
                  value={form.url}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      url: event.target.value,
                    }))
                  }
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                  placeholder="URL gambar"
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
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
                  {isSubmitting ? "Menyimpan..." : "Tambah dokter"}
                </button>
              </div>
            </form>

            <section
              id="jadwal-mingguan"
              className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-900">
                  <CalendarDays className="h-4 w-4 text-sky-600" />
                  Jadwal minggu ini
                </div>
                <span className="text-[9px] text-slate-400">
                  12 - 18 Mei 2026
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-7">
                {weeklySchedule.length > 0 ? (
                  weeklySchedule.map((item) => (
                    <div
                      key={`${item.day}-${item.date}`}
                      className={`rounded-lg border p-2 text-center transition-colors ${item.active ? "border-sky-600 bg-sky-600 text-white" : "border-slate-100 bg-slate-50 hover:bg-sky-50"}`}
                    >
                      <div
                        className={`text-[8px] font-medium ${item.active ? "text-white/70" : "text-slate-400"}`}
                      >
                        {item.day}
                      </div>
                      <div className="font-serif text-[14px] font-semibold leading-none">
                        {item.date}
                      </div>
                      <div
                        className={`mt-1 text-[7px] ${item.active ? "text-white/60" : "text-slate-400"}`}
                      >
                        {item.doctor}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-lg bg-slate-50 p-4 text-center text-[10px] text-slate-500 md:col-span-7">
                    Jadwal mingguan belum tersedia di db_klinik.sql.
                  </div>
                )}
              </div>
            </section>

            {doctorCards.length > 0 ? (
              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {doctorCards.map((doctor) => (
                  <article
                    key={doctor.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="relative flex items-start gap-3 p-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${doctor.avatarClassName}`}
                      >
                        {doctor.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-slate-900">
                          {doctor.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {doctor.specialty}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[8px] font-semibold ${doctor.badgeClassName}`}
                      >
                        {doctor.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedDoctorId(doctor.id)}
                        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md bg-slate-50 text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="px-4 pb-4">
                      <div className="mb-3 rounded-lg bg-slate-50 p-3">
                        <div className="mb-2 text-[8px] font-medium uppercase tracking-[1px] text-slate-400">
                          {doctor.scheduleTitle}
                        </div>
                        <div className="flex items-center justify-between py-1 text-[10px] font-medium text-slate-600">
                          <span>{doctor.primarySchedule}</span>
                          <span className="text-sky-600">
                            {doctor.secondarySchedule}
                          </span>
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
                          <div
                            key={stat.label}
                            className="rounded-lg bg-slate-50 p-2 text-center"
                          >
                            <div className="font-serif text-[14px] font-semibold leading-none text-slate-900">
                              {stat.value}
                            </div>
                            <div className="mt-0.5 text-[7px] text-slate-400">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedDoctorId(doctor.id)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-sky-50 px-2 py-2 text-[9px] font-medium text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={scrollToSchedule}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-50 px-2 py-2 text-[9px] font-medium text-amber-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-100"
                        >
                          <CalendarDays className="h-3 w-3" />
                          Jadwal
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            previewDoctor(doctor.secondarySchedule)
                          }
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-50 px-2 py-2 text-[9px] font-medium text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Eye className="h-3 w-3" />
                          Profil
                        </button>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteDoctor(doctor.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-[9px] font-medium text-rose-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-100"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                Belum ada data dokter di database.
              </div>
            )}
            {selectedDoctor ? (
              <form
                onSubmit={handleUpdateDoctor}
                className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-slate-900">
                    Edit dokter
                  </div>
                  <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                    ID {selectedDoctor.id}
                  </span>
                </div>
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                  <input
                    value={editForm.nama_dokter}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        nama_dokter: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                    placeholder="Nama dokter"
                  />
                  <input
                    value={editForm.kategori}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        kategori: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                    placeholder="Kategori"
                  />
                  <input
                    value={editForm.jadwal_praktek}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        jadwal_praktek: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                    placeholder="Jadwal praktek"
                  />
                  <input
                    value={editForm.url}
                    onChange={(event) =>
                      setEditForm((current) => ({
                        ...current,
                        url: event.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none"
                    placeholder="URL gambar"
                  />
                </div>
                {actionError ? (
                  <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                    {actionError}
                  </div>
                ) : null}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      selectedDoctor &&
                      setEditForm({
                        url: selectedDoctor.url,
                        nama_dokter: selectedDoctor.nama_dokter,
                        jadwal_praktek: selectedDoctor.jadwal_praktek,
                        kategori: selectedDoctor.kategori,
                      })
                    }
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-60"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan perubahan"}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
