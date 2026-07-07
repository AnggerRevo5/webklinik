"use client";

import { Eye, EyeOff, Plus, ShieldAlert, ShieldCheck, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  adminCreateAdminUser,
  adminDeleteAdminUser,
  adminUpdateAdminUser,
  adminGetAdminUsers,
  getCurrentAdmin,
  type AdminUserItem,
  type CurrentAdmin,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import {
  AdminHeader,
  adminPrimaryBtn,
  ConfirmDialog,
  ToastContainer,
  useToast,
  type ConfirmDialogState,
} from "@/src/UiKecil/admin_ui";

type NewUserForm = { username: string; password: string; role: "superadmin" | "admin" };

const emptyForm: NewUserForm = { username: "", password: "", role: "admin" };

function formatDate(iso: string): string {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function KelolaAdmin() {
  const [me, setMe] = useState<CurrentAdmin>(null);
  const [meLoading, setMeLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    getCurrentAdmin().then((admin) => {
      setMe(admin);
      setMeLoading(false);
    });
    adminGetAdminUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSaveNew(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username.trim() || form.password.length < 8) {
      setFormError("Username wajib diisi, password minimal 8 karakter.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const res = await adminCreateAdminUser(form);
    if (res.success) {
      setModalOpen(false);
      showToast("Akun admin berhasil dibuat", "success");
      load();
    } else {
      setFormError(res.error ?? "Gagal menyimpan.");
    }
    setSaving(false);
  }

  async function handleToggleActive(u: AdminUserItem) {
    const res = await adminUpdateAdminUser(u.id, { is_active: !u.is_active });
    if (res.success) {
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: !x.is_active } : x)));
    } else {
      showToast(res.error ?? "Gagal mengubah status", "error");
    }
  }

  async function handleRoleChange(u: AdminUserItem, role: "superadmin" | "admin") {
    const res = await adminUpdateAdminUser(u.id, { role });
    if (res.success) {
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
    } else {
      showToast(res.error ?? "Gagal mengubah role", "error");
      load();
    }
  }

  function handleDelete(u: AdminUserItem) {
    setConfirmDialog({
      title: "Hapus akun admin?",
      message: `Akun "${u.username}" akan dihapus permanen.`,
      onConfirm: async () => {
        const res = await adminDeleteAdminUser(u.id);
        if (res.success) {
          setUsers((prev) => prev.filter((x) => x.id !== u.id));
          showToast("Akun berhasil dihapus", "success");
        } else {
          showToast(res.error ?? "Gagal menghapus akun", "error");
        }
      },
    });
  }

  if (!meLoading && me?.role !== "superadmin") {
    return (
      <main className="min-h-dvh w-full bg-[#F0F4FA] p-0">
        <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
          <SidebarAdmin activeKey="kelola-admin" />
          <section className="flex min-w-0 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShieldAlert className="h-10 w-10 text-amber-500" />
            <p className="text-sm font-semibold text-slate-700">Hanya superadmin yang bisa mengakses halaman ini</p>
            <p className="text-[11px] text-slate-400">Hubungi superadmin klinik kalau Anda butuh akses ke halaman ini.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="kelola-admin" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <AdminHeader
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Kelola Admin"
            subtitle="Akun & role admin — superadmin bisa akses semua, admin tidak bisa lihat audit log"
          >
            <button type="button" onClick={openAdd} className={adminPrimaryBtn}>
              <Plus className="h-3 w-3" />
              Tambah Admin
            </button>
          </AdminHeader>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              {loading ? (
                <div className="p-6 text-center text-[10px] text-slate-500">Memuat data...</div>
              ) : users.length === 0 ? (
                <div className="p-6 text-center text-[10px] text-slate-500">Belum ada akun admin.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="px-4 py-3">Username</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Dibuat</th>
                        <th className="px-4 py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((u) => {
                        const isSelf = u.username === me?.username;
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/70">
                            <td className="px-4 py-2.5 font-medium text-slate-800">
                              {u.username}
                              {isSelf ? <span className="ml-1.5 text-[9px] text-sky-500">(Anda)</span> : null}
                            </td>
                            <td className="px-4 py-2.5">
                              <select
                                value={u.role}
                                disabled={isSelf}
                                onChange={(e) => handleRoleChange(u, e.target.value as "superadmin" | "admin")}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-700 disabled:opacity-50"
                              >
                                <option value="superadmin">Superadmin</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${u.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                {u.is_active ? "Aktif" : "Nonaktif"}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-500">{formatDate(u.created_at)}</td>
                            <td className="px-4 py-2.5">
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  title={u.is_active ? "Nonaktifkan" : "Aktifkan"}
                                  disabled={isSelf}
                                  onClick={() => handleToggleActive(u)}
                                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-medium transition-all hover:-translate-y-0.5 disabled:opacity-40 ${u.is_active ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                                >
                                  {u.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </button>
                                <button
                                  type="button"
                                  title="Hapus akun"
                                  disabled={isSelf}
                                  onClick={() => handleDelete(u)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1.5 text-[9px] font-medium text-rose-600 transition-all hover:-translate-y-0.5 hover:bg-rose-100 disabled:opacity-40"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="text-[14px] font-semibold text-slate-900">Tambah Akun Admin</div>
              <button type="button" aria-label="Tutup modal" onClick={() => setModalOpen(false)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNew} className="space-y-3 p-5">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-slate-500">Username</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-slate-500">Password (min. 8 karakter)</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-slate-500">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "superadmin" | "admin" }))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                >
                  <option value="admin">Admin (kelola konten, tanpa audit log)</option>
                  <option value="superadmin">Superadmin (akses semua)</option>
                </select>
              </div>

              {formError ? <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">{formError}</div> : null}

              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500">
                  Batal
                </button>
                <button type="submit" disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2 text-[10px] font-medium text-white disabled:opacity-60">
                  {saving ? "Menyimpan..." : "Tambah Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
