"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, Edit3, Eye, EyeOff, FileText, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  adminCreateArtikel,
  adminDeleteArtikel,
  adminDraftArtikel,
  adminGetArtikel,
  adminGetArtikelDetail,
  adminPublishArtikel,
  adminUpdateArtikel,
  type Artikel,
  type ArtikelPayload,
  KATEGORI_ARTIKEL,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import ImagePicker from "@/src/UiKecil/image_picker";
import { AdminHeader, adminPrimaryBtn } from "@/src/UiKecil/admin_ui";

// Tiptap tidak bisa di-SSR
const ArtikelEditor = dynamic(() => import("@/src/components/admin/artikel_editor"), { ssr: false });

type FilterStatus = "all" | "draft" | "published";

const EMPTY_FORM: ArtikelPayload = {
  judul: "",
  konten: "",
  ringkasan: "",
  kategori: "",
  foto_url: "",
  penulis: "",
  status: "draft",
};

function StatusBadge({ status }: { status: string }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Draft
    </span>
  );
}

export default function ArtikelAdmin() {
  const [mode, setMode] = useState<"list" | "editor">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ArtikelPayload>(EMPTY_FORM);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await adminGetArtikel(1, filterStatus === "all" ? undefined : filterStatus);
    setArtikelList(res.data ?? []);
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  function handleNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
    setMode("editor");
  }

  async function handleEdit(id: number) {
    setError(null);
    const res = await adminGetArtikelDetail(id);
    if (res.success && res.data) {
      setForm({
        judul: res.data.judul,
        konten: res.data.konten ?? "",
        ringkasan: res.data.ringkasan,
        kategori: res.data.kategori,
        foto_url: res.data.foto_url,
        penulis: res.data.penulis,
        status: res.data.status,
      });
      setEditingId(id);
      setMode("editor");
    }
  }

  async function handleSave(targetStatus: "draft" | "published") {
    if (!form.judul?.trim()) {
      setError("Judul artikel wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload: ArtikelPayload = { ...form, status: targetStatus };
    const res = editingId
      ? await adminUpdateArtikel(editingId, payload)
      : await adminCreateArtikel(payload);
    setSaving(false);
    if (res.success) {
      setMode("list");
      fetchList();
    } else {
      setError(res.error ?? "Gagal menyimpan artikel.");
    }
  }

  async function handleToggleStatus(id: number, currentStatus: string) {
    if (currentStatus === "published") {
      await adminDraftArtikel(id);
    } else {
      await adminPublishArtikel(id);
    }
    fetchList();
  }

  async function handleDelete(id: number, judul: string) {
    if (!window.confirm(`Hapus artikel "${judul}"?`)) return;
    await adminDeleteArtikel(id);
    fetchList();
  }

  const FILTERS: { label: string; key: FilterStatus }[] = [
    { label: "Semua", key: "all" },
    { label: "Draft", key: "draft" },
    { label: "Published", key: "published" },
  ];

  /* ── EDITOR MODE ─────────────────────────────────────────────────────────── */
  if (mode === "editor") {
    return (
      <main className="min-h-dvh w-full bg-slate-100 p-0">
        <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] lg:grid-cols-[240px_minmax(0,1fr)]">
          <SidebarAdmin activeKey="artikel" />

          <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
            <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
              <button
                type="button"
                onClick={() => { setMode("list"); setError(null); }}
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-medium text-slate-600 hover:bg-slate-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali
              </button>
              <div>
                <div className="text-[15px] font-semibold text-slate-900">
                  {editingId ? "Edit Artikel" : "Tulis Artikel Baru"}
                </div>
                <div className="text-[9px] text-slate-400">db_klinik.artikel</div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 lg:p-5">
              <div className="mx-auto max-w-3xl space-y-4">
                {error ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-[10px] text-rose-700">
                    {error}
                  </div>
                ) : null}

                {/* Judul */}
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Judul Artikel *
                  </label>
                  <input
                    type="text"
                    value={form.judul ?? ""}
                    onChange={(e) => setForm((p) => ({ ...p, judul: e.target.value }))}
                    placeholder="Tulis judul artikel..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] font-semibold text-slate-900 placeholder:text-slate-300 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200"
                  />
                </div>

                {/* Gambar cover + meta */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      Gambar Cover
                    </label>
                    <ImagePicker
                      value={form.foto_url ?? ""}
                      onChange={(url) => setForm((p) => ({ ...p, foto_url: url }))}
                      folder="artikel"
                      label="Pilih gambar cover"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Kategori
                      </label>
                      <select
                        value={form.kategori ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, kategori: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12px] text-slate-700 focus:border-sky-400 focus:outline-none"
                      >
                        <option value="">-- Pilih kategori --</option>
                        {KATEGORI_ARTIKEL.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Penulis
                      </label>
                      <input
                        type="text"
                        value={form.penulis ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, penulis: e.target.value }))}
                        placeholder="Nama penulis / staff"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[12px] text-slate-700 placeholder:text-slate-300 focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        Ringkasan <span className="normal-case text-slate-400">(opsional, auto-generate)</span>
                      </label>
                      <textarea
                        value={form.ringkasan ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, ringkasan: e.target.value }))}
                        rows={3}
                        placeholder="1-2 kalimat ringkasan artikel..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] text-slate-700 placeholder:text-slate-300 focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Editor konten */}
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Konten Artikel
                  </label>
                  <ArtikelEditor
                    value={form.konten ?? ""}
                    onChange={(html) => setForm((p) => ({ ...p, konten: html }))}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => handleSave("draft")}
                    disabled={saving}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {saving ? "Menyimpan..." : "Simpan Draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave("published")}
                    disabled={saving}
                    className="rounded-xl bg-sky-600 px-5 py-2.5 text-[11px] font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
                  >
                    {saving ? "Memproses..." : "Publish →"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode("list"); setError(null); }}
                    className="ml-auto text-[10px] text-slate-400 hover:text-slate-600"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  /* ── LIST MODE ───────────────────────────────────────────────────────────── */
  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="artikel" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <AdminHeader
            icon={<FileText className="h-5 w-5" />}
            title="Artikel"
            subtitle="Kelola artikel untuk website publik"
          >
            <button type="button" onClick={handleNew} className={adminPrimaryBtn}>
              <Plus className="h-3.5 w-3.5" />
              Tulis Artikel Baru
            </button>
          </AdminHeader>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            {/* Filter tabs */}
            <div className="mb-4 flex gap-1.5">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilterStatus(f.key)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all ${
                    filterStatus === f.key
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-white text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-white shadow-sm" />
                ))}
              </div>
            ) : artikelList.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white py-12 text-center shadow-sm">
                <FileText className="h-8 w-8 text-slate-300" />
                <div className="text-[12px] font-medium text-slate-500">Belum ada artikel</div>
                <button
                  type="button"
                  onClick={handleNew}
                  className="rounded-xl bg-sky-600 px-4 py-2 text-[11px] font-semibold text-white"
                >
                  Tulis Artikel Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {artikelList.map((a) => (
                  <article
                    key={a.id}
                    className="flex items-start gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    {/* Gambar cover kecil */}
                    {a.foto_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.foto_url}
                        alt={a.judul}
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <FileText className="h-6 w-6 text-slate-300" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={a.status} />
                        {a.kategori ? (
                          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-medium text-sky-700">
                            {a.kategori}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 truncate text-[13px] font-semibold text-slate-900">
                        {a.judul}
                      </div>
                      {a.ringkasan ? (
                        <div className="mt-0.5 line-clamp-1 text-[10px] text-slate-500">
                          {a.ringkasan}
                        </div>
                      ) : null}
                      <div className="mt-1 text-[9px] text-slate-400">
                        {a.penulis ? `${a.penulis} · ` : ""}
                        {a.published_at
                          ? `Published ${new Date(a.published_at).toLocaleDateString("id-ID")}`
                          : `Draft · ${new Date(a.created_at).toLocaleDateString("id-ID")}`}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(a.id, a.status)}
                        title={a.status === "published" ? "Tarik ke Draft" : "Publish"}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                          a.status === "published"
                            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {a.status === "published" ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(a.id)}
                        title="Edit"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id, a.judul)}
                        title="Hapus"
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
