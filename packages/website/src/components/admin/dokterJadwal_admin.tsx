"use client";

import { CalendarDays, Info, Camera, Eye, EyeOff, Plus, Pencil, Trash2, Clock, Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
  adminGetDokter,
  adminToggleTampilDokter,
  updateDokterFoto,
  adminGetSpesialis,
  adminCreateKhanzaDokter,
  adminUpdateKhanzaDokter,
  adminDeleteKhanzaDokter,
  adminGetJadwalDokter,
  adminCreateJadwalDokter,
  adminDeleteJadwalDokter,
  getPoliKhanza,
  HARI_KERJA,
  type DokterAdmin,
  type KhanzaSpesialis,
  type KhanzaDokterInput,
  type KhanzaJadwal,
  type PoliKhanza,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import ImagePicker from "@/src/UiKecil/image_picker";
import { ToastContainer, useToast, ConfirmDialog, type ConfirmDialogState } from "@/src/UiKecil/admin_ui";

const EMPTY_FORM: KhanzaDokterInput = {
  kd_dokter: "",
  nm_dokter: "",
  jk: "L",
  tmp_lahir: "",
  tgl_lahir: "",
  gol_drh: "-",
  agama: "",
  almt_tgl: "",
  no_telp: "",
  email: "",
  stts_nikah: "",
  kd_sps: "",
  alumni: "",
  no_ijn_praktek: "",
};

type FormModal =
  | { mode: "create"; data: KhanzaDokterInput; initialFotoUrl: string }
  | { mode: "edit"; kdDokter: string; data: KhanzaDokterInput; initialFotoUrl: string };

const EMPTY_JADWAL: KhanzaJadwal = {
  kd_dokter: "",
  hari_kerja: "SENIN",
  jam_mulai: "08:00",
  jam_selesai: "10:00",
  kd_poli: "",
  kuota: 30,
};

function DokterFormModal({
  modal,
  spesialis,
  onClose,
  onSaved,
}: {
  modal: FormModal;
  spesialis: KhanzaSpesialis[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<KhanzaDokterInput>(modal.data);
  const [fotoUrl, setFotoUrl] = useState(modal.initialFotoUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Jadwal state (hanya mode edit) ──
  const [jadwalList, setJadwalList] = useState<KhanzaJadwal[]>([]);
  const [poliList, setPoliList] = useState<PoliKhanza[]>([]);
  const [jadwalLoading, setJadwalLoading] = useState(false);
  const [showAddJadwal, setShowAddJadwal] = useState(false);
  const [jadwalForm, setJadwalForm] = useState<KhanzaJadwal>({ ...EMPTY_JADWAL });
  const [jadwalSubmitting, setJadwalSubmitting] = useState(false);
  const [jadwalError, setJadwalError] = useState<string | null>(null);
  const [deletingJadwal, setDeletingJadwal] = useState<string | null>(null);

  useEffect(() => {
    if (modal.mode !== "edit") return;
    setJadwalLoading(true);
    Promise.all([
      adminGetJadwalDokter(modal.kdDokter),
      getPoliKhanza(),
    ]).then(([jadwal, poli]) => {
      setJadwalList(jadwal);
      setPoliList(poli);
      setJadwalLoading(false);
    });
  }, [modal]);

  function getNmPoli(kdPoli: string) {
    return poliList.find((p) => p.kd_poli === kdPoli)?.nm_poli ?? kdPoli;
  }

  function handleJadwalFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setJadwalForm((prev) => ({ ...prev, [name]: name === "kuota" ? Number(value) : value }));
  }

  async function handleAddJadwal() {
    if (modal.mode !== "edit") return;
    setJadwalSubmitting(true);
    setJadwalError(null);
    try {
      const res = await adminCreateJadwalDokter({ ...jadwalForm, kd_dokter: modal.kdDokter });
      if (!res.success) throw new Error(res.error ?? "Gagal menambah jadwal");
      const updated = await adminGetJadwalDokter(modal.kdDokter);
      setJadwalList(updated);
      setShowAddJadwal(false);
      setJadwalForm({ ...EMPTY_JADWAL });
    } catch (err) {
      setJadwalError(err instanceof Error ? err.message : "Gagal menambah jadwal");
    } finally {
      setJadwalSubmitting(false);
    }
  }

  async function handleDeleteJadwal(j: KhanzaJadwal) {
    const key = `${j.hari_kerja}-${j.jam_mulai}`;
    setDeletingJadwal(key);
    try {
      await adminDeleteJadwalDokter(j.kd_dokter, j.hari_kerja, j.jam_mulai);
      setJadwalList((prev) => prev.filter((x) => !(x.hari_kerja === j.hari_kerja && x.jam_mulai === j.jam_mulai)));
    } finally {
      setDeletingJadwal(null);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      let res: { success: boolean; error?: string };
      let kdDokter: string;
      if (modal.mode === "create") {
        res = await adminCreateKhanzaDokter(form);
        kdDokter = form.kd_dokter;
      } else {
        const { kd_dokter: _kd, ...rest } = form;
        void _kd;
        res = await adminUpdateKhanzaDokter(modal.kdDokter, rest);
        kdDokter = modal.kdDokter;
      }
      if (!res.success) throw new Error(res.error ?? "Gagal menyimpan");
      if (fotoUrl !== modal.initialFotoUrl) {
        await updateDokterFoto(kdDokter, fotoUrl);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200";
  const labelCls = "mb-1 block text-[9px] font-semibold uppercase tracking-wider text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="text-[14px] font-semibold text-slate-900">
            {modal.mode === "create" ? "Tambah Dokter Baru" : `Edit — ${modal.data.nm_dokter}`}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[10px] text-slate-400 hover:bg-slate-100"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          {/* Kode dokter — hanya di create */}
          {modal.mode === "create" && (
            <div>
              <label className={labelCls}>
                Kode Dokter <span className="text-rose-500">*</span>
              </label>
              <input
                name="kd_dokter"
                value={form.kd_dokter}
                onChange={handleChange}
                placeholder="contoh: D001"
                maxLength={20}
                required
                className={inputCls}
              />
              <p className="mt-1 text-[9px] text-slate-400">Kode unik, maks 20 karakter. Tidak bisa diubah setelah disimpan.</p>
            </div>
          )}

          {/* Foto */}
          <div className="sm:col-span-2">
            <label className={labelCls}>Foto Dokter</label>
            <ImagePicker
              value={fotoUrl}
              onChange={setFotoUrl}
              folder="dokter"
              label=""
            />
          </div>

          {/* Nama */}
          <div className={modal.mode === "edit" ? "sm:col-span-2" : ""}>
            <label className={labelCls}>
              Nama Dokter <span className="text-rose-500">*</span>
            </label>
            <input
              name="nm_dokter"
              value={form.nm_dokter}
              onChange={handleChange}
              placeholder="dr. Nama Lengkap, Sp.X"
              maxLength={50}
              required
              className={inputCls}
            />
          </div>

          {/* Jenis kelamin */}
          <div>
            <label className={labelCls}>Jenis Kelamin</label>
            <select name="jk" value={form.jk} onChange={handleChange} className={inputCls}>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Spesialis */}
          <div>
            <label className={labelCls}>Spesialis / Poli</label>
            <select name="kd_sps" value={form.kd_sps} onChange={handleChange} className={inputCls}>
              <option value="">— Pilih spesialis —</option>
              {spesialis.map((s) => (
                <option key={s.kd_sps} value={s.kd_sps}>
                  {s.nm_sps}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              maxLength={70}
              required
              className={inputCls}
            />
          </div>

          {/* No. telepon */}
          <div>
            <label className={labelCls}>No. Telepon</label>
            <input
              name="no_telp"
              value={form.no_telp}
              onChange={handleChange}
              maxLength={13}
              className={inputCls}
            />
          </div>

          {/* No. izin praktik */}
          <div className="sm:col-span-2">
            <label className={labelCls}>No. Izin Praktik (SIP)</label>
            <input
              name="no_ijn_praktek"
              value={form.no_ijn_praktek}
              onChange={handleChange}
              maxLength={120}
              className={inputCls}
            />
          </div>

          {/* Tempat lahir */}
          <div>
            <label className={labelCls}>Tempat Lahir</label>
            <input
              name="tmp_lahir"
              value={form.tmp_lahir}
              onChange={handleChange}
              maxLength={20}
              className={inputCls}
            />
          </div>

          {/* Tanggal lahir */}
          <div>
            <label className={labelCls}>Tanggal Lahir</label>
            <input
              type="date"
              name="tgl_lahir"
              value={form.tgl_lahir}
              onChange={handleChange}
              className={inputCls}
            />
          </div>

          {/* Gol. darah */}
          <div>
            <label className={labelCls}>Gol. Darah</label>
            <select name="gol_drh" value={form.gol_drh} onChange={handleChange} className={inputCls}>
              {["-", "A", "B", "O", "AB"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Status nikah */}
          <div>
            <label className={labelCls}>Status Pernikahan</label>
            <select name="stts_nikah" value={form.stts_nikah} onChange={handleChange} className={inputCls}>
              <option value="">— Pilih —</option>
              <option value="BELUM KAWIN">Belum Kawin</option>
              <option value="KAWIN">Kawin</option>
              <option value="JANDA">Janda</option>
              <option value="DUDA">Duda</option>
            </select>
          </div>

          {/* Agama */}
          <div>
            <label className={labelCls}>Agama</label>
            <input
              name="agama"
              value={form.agama}
              onChange={handleChange}
              maxLength={12}
              className={inputCls}
            />
          </div>

          {/* Alamat */}
          <div className="sm:col-span-2">
            <label className={labelCls}>Alamat</label>
            <input
              name="almt_tgl"
              value={form.almt_tgl}
              onChange={handleChange}
              maxLength={60}
              className={inputCls}
            />
          </div>

          {/* Alumni */}
          <div className="sm:col-span-2">
            <label className={labelCls}>Alumni / Pendidikan</label>
            <input
              name="alumni"
              value={form.alumni}
              onChange={handleChange}
              maxLength={60}
              className={inputCls}
            />
          </div>

          {/* ── Jadwal Praktek (hanya mode edit) ── */}
          {modal.mode === "edit" && (
            <div className="sm:col-span-2 border-t border-slate-100 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[11px] font-semibold text-slate-700">Jadwal Praktek</div>
                <button
                  type="button"
                  onClick={() => { setShowAddJadwal((v) => !v); setJadwalError(null); }}
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1.5 text-[9px] font-medium text-sky-600 hover:bg-sky-100"
                >
                  <Plus className="h-3 w-3" />
                  Tambah
                </button>
              </div>

              {jadwalLoading ? (
                <div className="text-[9px] text-slate-400">Memuat jadwal...</div>
              ) : jadwalList.length === 0 ? (
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-[9px] text-slate-400">
                  Belum ada jadwal terdaftar.
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {jadwalList.map((j) => {
                    const key = `${j.hari_kerja}-${j.jam_mulai}`;
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                      >
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                        <span className="w-16 text-[10px] font-medium text-slate-700">{j.hari_kerja}</span>
                        <Clock className="h-3 w-3 shrink-0 text-slate-300" />
                        <span className="text-[10px] text-slate-500">
                          {j.jam_mulai}–{j.jam_selesai}
                        </span>
                        <span className="flex-1 truncate rounded-full bg-white px-2 py-0.5 text-[9px] text-slate-500 border border-slate-200">
                          {getNmPoli(j.kd_poli) || j.kd_poli}
                        </span>
                        <span className="text-[9px] text-slate-400">kuota {j.kuota}</span>
                        <button
                          type="button"
                          disabled={deletingJadwal === key}
                          onClick={() => handleDeleteJadwal(j)}
                          className="ml-1 text-rose-400 disabled:opacity-40 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {showAddJadwal && (
                <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 flex flex-col gap-2">
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
                    Tambah Jadwal Baru
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">Hari</label>
                      <select
                        name="hari_kerja"
                        value={jadwalForm.hari_kerja}
                        onChange={handleJadwalFormChange}
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px]"
                      >
                        {HARI_KERJA.map((h) => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">Jam Mulai</label>
                      <input
                        type="time"
                        name="jam_mulai"
                        value={jadwalForm.jam_mulai}
                        onChange={handleJadwalFormChange}
                        required
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">Jam Selesai</label>
                      <input
                        type="time"
                        name="jam_selesai"
                        value={jadwalForm.jam_selesai}
                        onChange={handleJadwalFormChange}
                        required
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">Poli</label>
                      <select
                        name="kd_poli"
                        value={jadwalForm.kd_poli}
                        onChange={handleJadwalFormChange}
                        required
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px]"
                      >
                        <option value="">— Pilih poli —</option>
                        {poliList.map((p) => (
                          <option key={p.kd_poli} value={p.kd_poli}>{p.nm_poli}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[9px] font-semibold uppercase tracking-wider text-slate-500">Kuota</label>
                      <input
                        type="number"
                        name="kuota"
                        value={jadwalForm.kuota}
                        onChange={handleJadwalFormChange}
                        min={0}
                        required
                        className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px]"
                      />
                    </div>
                  </div>
                  {jadwalError && (
                    <div className="rounded bg-rose-50 px-2 py-1.5 text-[9px] text-rose-600">{jadwalError}</div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowAddJadwal(false); setJadwalError(null); }}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[9px] text-slate-500"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={jadwalSubmitting}
                      onClick={handleAddJadwal}
                      className="rounded-lg bg-sky-600 px-3 py-1.5 text-[9px] font-medium text-white disabled:opacity-60"
                    >
                      {jadwalSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="sm:col-span-2 rounded-lg bg-rose-50 px-3 py-2 text-[10px] text-rose-600">
              {error}
            </div>
          )}

          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-medium text-slate-500 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-sky-600 px-4 py-2 text-[10px] font-medium text-white disabled:opacity-60 hover:bg-sky-700"
            >
              {isSubmitting ? "Menyimpan..." : modal.mode === "create" ? "Tambah Dokter" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DokterJadwalAdmin() {
  const [doctors, setDoctors] = useState<DokterAdmin[]>([]);
  const [spesialis, setSpesialis] = useState<KhanzaSpesialis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKd, setSelectedKd] = useState<string | null>(null);
  const [editFoto, setEditFoto] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formModal, setFormModal] = useState<FormModal | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDialogState>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toasts, showToast, dismissToast } = useToast();

  const loadDokter = useCallback(() => {
    setLoading(true);
    adminGetDokter().then((list) => {
      setDoctors(list);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadDokter();
    adminGetSpesialis().then(setSpesialis);
  }, [loadDokter]);

  useEffect(() => {
    const dok = doctors.find((d) => d.kd_dokter === selectedKd);
    if (dok) {
      setEditFoto(dok.foto_url ?? "");
      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [selectedKd, doctors]);

  async function handleToggleTampil(kdDokter: string) {
    setToggling(kdDokter);
    setDoctors((prev) =>
      prev.map((d) =>
        d.kd_dokter === kdDokter ? { ...d, tampil_website: !d.tampil_website } : d,
      ),
    );
    try {
      const res = await adminToggleTampilDokter(kdDokter);
      setDoctors((prev) =>
        prev.map((d) =>
          d.kd_dokter === kdDokter ? { ...d, tampil_website: res.tampil_website } : d,
        ),
      );
    } catch {
      setDoctors((prev) =>
        prev.map((d) =>
          d.kd_dokter === kdDokter ? { ...d, tampil_website: !d.tampil_website } : d,
        ),
      );
    } finally {
      setToggling(null);
    }
  }

  async function handleSaveFoto(event: React.SyntheticEvent) {
    event.preventDefault();
    if (!selectedKd) return;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await updateDokterFoto(selectedKd, editFoto);
      if (!res.success) throw new Error(res.error ?? "Gagal menyimpan foto");
      setDoctors((prev) =>
        prev.map((d) =>
          d.kd_dokter === selectedKd ? { ...d, foto_url: editFoto } : d,
        ),
      );
      setSaveSuccess(true);
      showToast("Foto dokter berhasil disimpan!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan foto";
      setSaveError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  }

  function openCreateModal() {
    setFormModal({ mode: "create", data: { ...EMPTY_FORM }, initialFotoUrl: "" });
  }

  function openEditModal(dok: DokterAdmin) {
    setFormModal({
      mode: "edit",
      kdDokter: dok.kd_dokter,
      initialFotoUrl: dok.foto_url ?? "",
      data: {
        kd_dokter: dok.kd_dokter,
        nm_dokter: dok.nm_dokter,
        jk: dok.jk ?? "L",
        tmp_lahir: "",
        tgl_lahir: "",
        gol_drh: "-",
        agama: "",
        almt_tgl: "",
        no_telp: dok.no_telp ?? "",
        email: "",
        stts_nikah: "",
        kd_sps: "",
        alumni: "",
        no_ijn_praktek: "",
      },
    });
  }

  function handleDeleteClick(dok: DokterAdmin) {
    setConfirmDelete({
      title: "Nonaktifkan Dokter",
      message: `dr. ${dok.nm_dokter} akan dinonaktifkan di SIK Khanza (soft-delete). Data historis tetap aman. Lanjutkan?`,
      type: "danger",
      onConfirm: async () => {
        setConfirmDelete(null);
        try {
          const res = await adminDeleteKhanzaDokter(dok.kd_dokter);
          if (!res.success) throw new Error(res.error ?? "Gagal menonaktifkan");
          showToast(`${dok.nm_dokter} berhasil dinonaktifkan.`, "success");
          loadDokter();
        } catch (err) {
          showToast(err instanceof Error ? err.message : "Gagal menonaktifkan dokter", "error");
        }
      },
    });
  }

  const selectedDoctor = doctors.find((d) => d.kd_dokter === selectedKd) ?? null;
  const totalTampil = doctors.filter((d) => d.tampil_website).length;

  function matchSearch(dok: DokterAdmin) {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return dok.nm_dokter.toLowerCase().includes(q) || dok.kd_dokter.toLowerCase().includes(q);
  }

  const filteredActive = doctors.filter((d) => d.tampil_website && matchSearch(d));
  const filteredInactive = doctors.filter((d) => !d.tampil_website && matchSearch(d));

  function renderDokterCard(dok: DokterAdmin) {
    const isSelected = dok.kd_dokter === selectedKd;
    const isToggling = toggling === dok.kd_dokter;
    const colorHash = dok.kd_dokter.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
    const avatarColor = ["bg-sky-600", "bg-emerald-600", "bg-amber-600"][colorHash];
    const initials =
      dok.nm_dokter
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("") || "DR";

    return (
      <article
        key={dok.kd_dokter}
        className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${
          isSelected
            ? "border-sky-400 ring-1 ring-sky-300"
            : dok.tampil_website
              ? "border-emerald-200"
              : "border-slate-200"
        }`}
      >
        {/* Strip aktif */}
        {dok.tampil_website && (
          <div className="flex items-center gap-1.5 bg-emerald-50 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-semibold text-emerald-700">Aktif — ditampilkan di website</span>
          </div>
        )}

        <div className="flex items-start gap-3 p-4">
          {dok.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dok.foto_url}
              alt={dok.nm_dokter}
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold text-white ${avatarColor}`}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-slate-900">
              {dok.nm_dokter}
            </div>
            <div className="text-[10px] text-slate-400">{dok.spesialis || "Umum"}</div>
            <div className="mt-1 text-[9px] text-slate-400">
              kd: {dok.kd_dokter}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            {/* Toggle tampil website */}
            <button
              type="button"
              disabled={isToggling}
              onClick={() => handleToggleTampil(dok.kd_dokter)}
              aria-label={dok.tampil_website ? "Sembunyikan dari website" : "Tampilkan di website"}
              title={dok.tampil_website ? "Klik untuk sembunyikan dari website" : "Klik untuk tampilkan di website"}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 ${
                dok.tampil_website
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
            >
              {dok.tampil_website ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {dok.tampil_website ? "Ditampilkan" : "Tersembunyi"}
            </button>
            {/* Tombol aksi */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSelectedKd(dok.kd_dokter)}
                className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1.5 text-[9px] font-medium text-amber-600 transition-all hover:-translate-y-0.5 hover:bg-amber-100"
              >
                <Camera className="h-3 w-3" />
                Foto
              </button>
              <button
                type="button"
                onClick={() => openEditModal(dok)}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1.5 text-[9px] font-medium text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-slate-200"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(dok)}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1.5 text-[9px] font-medium text-rose-500 transition-all hover:-translate-y-0.5 hover:bg-rose-100"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {dok.jadwal && dok.jadwal.length > 0 ? (
          <div className="border-t border-slate-100 px-4 pb-3 pt-2">
            <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-slate-400">
              Jadwal Praktek
            </div>
            <div className="flex flex-col gap-1">
              {dok.jadwal.map((j, ji) => (
                <div key={ji} className="flex items-center gap-2 text-[10px] text-slate-600">
                  <CalendarDays className="h-3 w-3 shrink-0 text-sky-400" />
                  <span className="font-medium">{j.hari_kerja}</span>
                  <span className="text-slate-400">{j.jam_mulai}–{j.jam_selesai}</span>
                  {j.nm_poli ? (
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-500">
                      {j.nm_poli}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    );
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin dokter & jadwal</h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="dokter" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[15px] font-semibold text-slate-900">Dokter & Jadwal</div>
              <div className="text-[10px] text-slate-400">Data dari SIK Khanza — kelola dokter, atur visibilitas & foto</div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {!loading && doctors.length > 0 && (
                <div className="flex items-center gap-2 text-[9px] text-slate-500">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                    {totalTampil} ditampilkan di website
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">
                    {doctors.length - totalTampil} disembunyikan
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white hover:bg-sky-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Dokter
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            {/* Notice */}
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <p className="text-[10px] text-sky-700">
                Data dokter disimpan langsung ke SIK Khanza. Hapus berarti menonaktifkan (soft-delete) — data historis tetap aman. Jadwal praktek dapat dikelola melalui tombol Edit pada masing-masing dokter.
              </p>
            </div>

            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                Memuat data dokter...
              </div>
            ) : doctors.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                Tidak ada data dokter aktif dari SIK Khanza.
              </div>
            ) : (
              <>
                {/* Search bar */}
                <div className="relative mb-5">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Cari nama atau kode dokter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-[11px] text-slate-700 placeholder-slate-400 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200"
                  />
                </div>

                {/* Dokter aktif (ditampilkan di website) */}
                {filteredActive.length > 0 && (
                  <div className="mb-5">
                    <div className="mb-2.5 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Ditampilkan di Website
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
                        {filteredActive.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {filteredActive.map((dok) => renderDokterCard(dok))}
                    </div>
                  </div>
                )}

                {/* Divider + Dokter tersembunyi */}
                {filteredInactive.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-[9px] font-medium text-slate-400">
                        Tidak Ditampilkan ({filteredInactive.length})
                      </span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {filteredInactive.map((dok) => renderDokterCard(dok))}
                    </div>
                  </div>
                )}

                {/* Tidak ada hasil pencarian */}
                {filteredActive.length === 0 && filteredInactive.length === 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                    Tidak ditemukan dokter dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </>
            )}

            {/* Edit foto panel */}
            {selectedDoctor ? (
              <form
                onSubmit={handleSaveFoto}
                className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="text-[13px] font-semibold text-slate-900">
                    Ubah foto — {selectedDoctor.nm_dokter}
                  </div>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[8px] font-semibold text-amber-600">
                    PUT /api/dokter-foto/{selectedDoctor.kd_dokter}
                  </span>
                </div>

                <ImagePicker
                  value={editFoto}
                  onChange={setEditFoto}
                  folder="dokter"
                  label="Foto Dokter"
                />

                {saveError ? (
                  <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">
                    {saveError}
                  </div>
                ) : null}
                {saveSuccess ? (
                  <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[9px] text-emerald-600">
                    Foto berhasil disimpan.
                  </div>
                ) : null}

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedKd(null);
                      setSaveError(null);
                      setSaveSuccess(false);
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-60"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan foto"}
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </section>
      </div>

      {/* Form modal create/edit */}
      {formModal && (
        <DokterFormModal
          modal={formModal}
          spesialis={spesialis}
          onClose={() => setFormModal(null)}
          onSaved={() => {
            showToast(
              formModal.mode === "create" ? "Dokter baru berhasil ditambahkan." : "Data dokter berhasil diperbarui.",
              "success",
            );
            loadDokter();
          }}
        />
      )}

      <ConfirmDialog dialog={confirmDelete} onClose={() => setConfirmDelete(null)} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
