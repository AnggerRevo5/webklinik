"use client";

import { Clock, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import {
  AdminHeader,
  adminPrimaryBtn,
  ConfirmDialog,
  ToastContainer,
  useToast,
  type ConfirmDialogState,
} from "@/src/UiKecil/admin_ui";
import {
  createOperationalHour,
  deleteOperationalHour,
  getOperationalHours,
  updateOperationalHour,
  type OperationalHour,
} from "@/src/lib/api";

// Baris yang sedang diedit di form (id null = baris baru yang belum disimpan).
type Row = {
  id: number | null;
  day_label: string;
  open_time: string;
  close_time: string;
  is_24_hours: boolean;
  note: string;
};

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200";

function toRow(h: OperationalHour): Row {
  return {
    id: h.id,
    day_label: h.day_label,
    open_time: h.open_time ?? "",
    close_time: h.close_time ?? "",
    is_24_hours: h.is_24_hours,
    note: h.note ?? "",
  };
}

export default function JamOperasionalAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(null);

  useEffect(() => {
    getOperationalHours()
      .then((data) => setRows(data.map(toRow)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function setRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: null, day_label: "", open_time: "", close_time: "", is_24_hours: false, note: "" },
    ]);
  }

  async function removeRow(index: number) {
    const row = rows[index];
    // Baris baru (belum disimpan) cukup dibuang dari state.
    if (row.id == null) {
      setRows((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setConfirmDialog({
      title: "Hapus baris jam operasional?",
      message: `"${row.day_label || "Baris ini"}" akan dihapus permanen.`,
      onConfirm: async () => {
        try {
          await deleteOperationalHour(row.id as number);
          setRows((prev) => prev.filter((_, i) => i !== index));
          showToast("Baris dihapus", "success");
        } catch (error) {
          showToast(error instanceof Error ? error.message : "Gagal menghapus", "error");
        }
      },
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Simpan urutan sesuai posisi baris di layar (atas = lebih dulu).
      const saved: OperationalHour[] = [];
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (!r.day_label.trim()) continue; // lewati baris kosong tanpa label
        const payload = {
          day_label: r.day_label.trim(),
          open_time: r.is_24_hours ? null : r.open_time || null,
          close_time: r.is_24_hours ? null : r.close_time || null,
          is_24_hours: r.is_24_hours,
          note: r.note,
          sort_order: i,
        };
        const result = r.id == null
          ? await createOperationalHour(payload)
          : await updateOperationalHour(r.id, payload);
        saved.push(result);
      }
      setRows(saved.map(toRow));
      showToast("Jam operasional berhasil disimpan!", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Pengaturan jam operasional klinik</h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="jam" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <AdminHeader
            icon={<Clock className="h-5 w-5" />}
            title="Jam Operasional"
            subtitle="Atur jam buka klinik yang tampil di beranda"
          >
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className={adminPrimaryBtn}
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </AdminHeader>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-slate-900">
                    Daftar jam operasional
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Urutan baris = urutan tampil
                  </span>
                </div>

                {loading ? (
                  <p className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                    Memuat...
                  </p>
                ) : rows.length === 0 ? (
                  <p className="rounded-lg bg-slate-50 px-3 py-3 text-center text-[11px] text-slate-400">
                    Belum ada data. Klik &quot;Tambah baris&quot; untuk menambahkan.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {rows.map((row, index) => (
                      <div
                        key={row.id ?? `new-${index}`}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                          <input
                            value={row.day_label}
                            onChange={(e) => setRow(index, { day_label: e.target.value })}
                            placeholder="Hari, mis. Senin – Jumat / UGD"
                            className={inputCls}
                          />
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            aria-label="Hapus baris"
                            className="inline-flex h-9 w-9 items-center justify-center justify-self-end rounded-lg bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <label className="flex cursor-pointer items-center gap-2 text-[11px] font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={row.is_24_hours}
                              onChange={(e) => setRow(index, { is_24_hours: e.target.checked })}
                              className="h-4 w-4 rounded border-slate-300 text-sky-600"
                            />
                            24 Jam
                          </label>

                          {!row.is_24_hours ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={row.open_time}
                                onChange={(e) => setRow(index, { open_time: e.target.value })}
                                className={`${inputCls} w-32`}
                              />
                              <span className="text-[11px] text-slate-400">–</span>
                              <input
                                type="time"
                                value={row.close_time}
                                onChange={(e) => setRow(index, { close_time: e.target.value })}
                                className={`${inputCls} w-32`}
                              />
                            </div>
                          ) : null}

                          <input
                            value={row.note}
                            onChange={(e) => setRow(index, { note: e.target.value })}
                            placeholder="Catatan (opsional)"
                            className={`${inputCls} flex-1`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addRow}
                  className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-2 text-[10px] font-medium text-sky-600 hover:bg-sky-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tambah baris
                </button>
              </div>

              <div className="flex justify-end pb-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || loading}
                  className={adminPrimaryBtn}
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </main>
  );
}
