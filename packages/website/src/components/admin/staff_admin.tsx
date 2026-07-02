"use client";

import { PencilLine, Plus, Trash2, UserRound, Users2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  updateStaff,
  type CreateStaffPayload,
  type Staff,
} from "@/src/lib/api";
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

const EMPTY_FORM: CreateStaffPayload = {
  nama: "",
  jabatan: "",
  foto_url: "",
  urutan: 0,
  is_active: true,
};

export default function StaffAdmin() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateStaffPayload>(EMPTY_FORM);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(null);

  useEffect(() => {
    getAllStaff()
      .then((items) => setStaff(items))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const selected = useMemo(
    () => staff.find((item) => item.id === selectedId) ?? null,
    [staff, selectedId],
  );

  useEffect(() => {
    if (selected) {
      setForm({
        nama: selected.nama,
        jabatan: selected.jabatan,
        foto_url: selected.foto_url,
        urutan: selected.urutan,
        is_active: selected.is_active,
      });
    }
  }, [selected]);

  function resetForm() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
  }

  async function handleSubmit(event: { preventDefault(): void }) {
    event.preventDefault();
    setSubmitError(null);

    if (!form.nama.trim()) {
      setSubmitError("Nama wajib diisi");
      return;
    }
    if (!form.foto_url) {
      setSubmitError("Foto wajib dipilih");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selected) {
        const updated = await updateStaff(selected.id, form);
        setStaff((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        setSelectedId(updated.id);
        showToast("Data staff berhasil diperbarui!", "success");
      } else {
        const created = await createStaff(form);
        setStaff((current) => [...current, created]);
        setSelectedId(created.id);
        showToast("Staff berhasil ditambahkan!", "success");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal menyimpan staff";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDelete(id: number, nama: string) {
    setConfirmDialog({
      title: "Hapus Staff?",
      message: `"${nama}" akan dihapus permanen dan tidak bisa dikembalikan.`,
      onConfirm: async () => {
        try {
          await deleteStaff(id);
          setStaff((current) => {
            const next = current.filter((item) => item.id !== id);
            if (selectedId === id) resetForm();
            return next;
          });
          showToast("Staff berhasil dihapus", "success");
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Gagal menghapus staff";
          showToast(msg, "error");
        }
      },
    });
  }

  // Urutkan sesuai tampilan publik: urutan asc, lalu id asc.
  const sortedStaff = useMemo(
    () =>
      [...staff].sort((a, b) => a.urutan - b.urutan || a.id - b.id),
    [staff],
  );

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin tim/staff KRI AMC</h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="staff" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <AdminHeader
            icon={<UserRound className="h-5 w-5" />}
            title="Tim / Staff"
            subtitle="Kelola data tim yang tampil di section Tim Kami (nama, jabatan, foto)"
          >
            <button type="button" onClick={resetForm} className={adminPrimaryBtn}>
              <Plus className="h-3 w-3" />
              Tambah staff
            </button>
          </AdminHeader>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            <form
              onSubmit={handleSubmit}
              className="mb-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-[13px] font-semibold text-slate-900">
                  {selected ? "Edit staff" : "Tambah staff"}
                </div>
                <span className="rounded-full bg-sky-50 px-2 py-1 text-[8px] font-semibold text-sky-600">
                  {selected ? `ID ${selected.id}` : "POST /api/staff"}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">
                      Nama lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={form.nama}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, nama: event.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] outline-none focus:border-sky-400"
                      placeholder="mis. Ajeng Anggelina Permata"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">
                      Jabatan
                    </label>
                    <input
                      value={form.jabatan}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, jabatan: event.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] outline-none focus:border-sky-400"
                      placeholder="mis. Perawat, Bidan, Admin, Apoteker"
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="w-24">
                      <label className="mb-1 block text-[8px] font-semibold uppercase tracking-[0.5px] text-slate-500">
                        Urutan
                      </label>
                      <input
                        type="number"
                        value={form.urutan ?? 0}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            urutan: Number(event.target.value) || 0,
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] outline-none focus:border-sky-400"
                      />
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 pb-2 text-[11px] font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.is_active ?? true}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            is_active: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-300 text-sky-600"
                      />
                      Tampilkan di website
                    </label>
                  </div>
                </div>

                <ImagePicker
                  value={form.foto_url}
                  onChange={(url) => setForm((current) => ({ ...current, foto_url: url }))}
                  folder="staff"
                  label="Foto staff"
                  required
                />
              </div>

              {submitError ? (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                  {submitError}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white disabled:opacity-60"
                >
                  <Plus className="h-3 w-3" />
                  {isSubmitting
                    ? "Menyimpan..."
                    : selected
                      ? "Simpan perubahan"
                      : "Tambah staff"}
                </button>
                {selected ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(selected.id, form.nama || `Staff ${selected.id}`)}
                    className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-medium text-rose-600"
                  >
                    <Trash2 className="h-3 w-3" />
                    Hapus
                  </button>
                ) : null}
                {selected ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-medium text-slate-600"
                  >
                    Batal edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="mb-3 flex items-center gap-2">
              <div className="text-[12px] font-semibold text-slate-900">Daftar staff</div>
              <div className="ml-auto text-[10px] text-slate-500">{staff.length} orang</div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {isLoading ? (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                  Memuat data staff...
                </div>
              ) : sortedStaff.length > 0 ? (
                sortedStaff.map((item) => (
                  <article
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                  >
                    <div className="relative aspect-square bg-slate-100">
                      {item.foto_url ? (
                        <Image
                          src={item.foto_url}
                          alt={item.nama}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Users2 className="h-10 w-10 text-slate-300" />
                        </div>
                      )}
                      {!item.is_active ? (
                        <div className="absolute left-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[8px] font-semibold text-white">
                          Nonaktif
                        </div>
                      ) : null}
                      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-slate-950/75 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          title="Edit staff"
                          aria-label="Edit staff"
                          onClick={() => setSelectedId(item.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-900"
                        >
                          <PencilLine className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Hapus staff"
                          aria-label="Hapus staff"
                          onClick={() => handleDelete(item.id, item.nama)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 p-3">
                      <div className="truncate text-[11px] font-semibold text-slate-900">
                        {item.nama}
                      </div>
                      <div className="truncate text-[10px] text-slate-500">
                        {item.jabatan || "—"}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                  Belum ada data staff. Klik &quot;Tambah staff&quot; untuk menambahkan.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </main>
  );
}
