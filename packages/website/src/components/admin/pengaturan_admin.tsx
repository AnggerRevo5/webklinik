"use client";

import { Plus, Save, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import ImagePicker from "@/src/UiKecil/image_picker";
import {
  AdminHeader,
  adminPrimaryBtn,
  ToastContainer,
  useToast,
} from "@/src/UiKecil/admin_ui";
import {
  adminGetSiteSettings,
  adminUpdateSiteSettings,
  parseTimeline,
  settingsToMap,
  type TimelineEntry,
} from "@/src/lib/api";

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200";
const labelCls =
  "mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-500";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint ? <p className="mt-1 text-[9px] text-slate-400">{hint}</p> : null}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[13px] font-semibold text-slate-900">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

export default function PengaturanAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const { toasts, showToast, dismissToast } = useToast();

  useEffect(() => {
    adminGetSiteSettings()
      .then((list) => {
        const map = settingsToMap(list);
        setForm(map);
        setTimeline(parseTimeline(map.timeline));
      })
      .finally(() => setLoading(false));
  }, []);

  function setField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateTimeline(index: number, key: keyof TimelineEntry, value: string) {
    setTimeline((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }

  function addTimeline() {
    setTimeline((prev) => [...prev, { year: "", title: "", description: "" }]);
  }

  function removeTimeline(index: number) {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const cleanedTimeline = timeline.filter(
        (t) => t.year.trim() || t.title.trim() || t.description.trim(),
      );
      const items = [
        { setting_key: "telepon", setting_value: form.telepon ?? "", setting_group: "kontak" },
        { setting_key: "whatsapp", setting_value: form.whatsapp ?? "", setting_group: "kontak" },
        { setting_key: "instagram", setting_value: form.instagram ?? "", setting_group: "kontak" },
        { setting_key: "facebook", setting_value: form.facebook ?? "", setting_group: "kontak" },
        { setting_key: "tiktok", setting_value: form.tiktok ?? "", setting_group: "kontak" },
        { setting_key: "email", setting_value: form.email ?? "", setting_group: "kontak" },
        { setting_key: "hero_subtitle", setting_value: form.hero_subtitle ?? "", setting_group: "beranda" },
        { setting_key: "hero_image", setting_value: form.hero_image ?? "", setting_group: "beranda" },
        { setting_key: "about_text", setting_value: form.about_text ?? "", setting_group: "tentang" },
        { setting_key: "about_image", setting_value: form.about_image ?? "", setting_group: "tentang" },
        { setting_key: "visi", setting_value: form.visi ?? "", setting_group: "tentang" },
        { setting_key: "misi", setting_value: form.misi ?? "", setting_group: "tentang" },
        { setting_key: "timeline", setting_value: JSON.stringify(cleanedTimeline), setting_group: "tentang" },
      ];
      const res = await adminUpdateSiteSettings(items);
      if (!res.success) throw new Error(res.error ?? "Gagal menyimpan");
      showToast("Pengaturan berhasil disimpan!", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Pengaturan konten situs</h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="pengaturan" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <AdminHeader
            icon={<Settings className="h-5 w-5" />}
            title="Pengaturan Konten"
            subtitle="Edit nomor kontak & teks yang tampil di website"
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
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-[11px] text-slate-500 shadow-sm">
                Memuat pengaturan...
              </div>
            ) : (
              <div className="mx-auto flex max-w-3xl flex-col gap-5">
                {/* Kontak */}
                <Card title="Kontak (dipakai di seluruh halaman)">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nomor Telepon" hint="Tampil di navbar, footer, dll. Contoh: 0812-2556-6055">
                      <input
                        value={form.telepon ?? ""}
                        onChange={(e) => setField("telepon", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Nomor WhatsApp" hint="Format internasional tanpa + atau spasi. Contoh: 6281225566055">
                      <input
                        value={form.whatsapp ?? ""}
                        onChange={(e) => setField("whatsapp", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Instagram" hint="Link profil Instagram, contoh: https://www.instagram.com/namaklinik">
                      <input
                        value={form.instagram ?? ""}
                        onChange={(e) => setField("instagram", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Facebook" hint="Link profil/halaman Facebook">
                      <input
                        value={form.facebook ?? ""}
                        onChange={(e) => setField("facebook", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="TikTok" hint="Link profil TikTok">
                      <input
                        value={form.tiktok ?? ""}
                        onChange={(e) => setField("tiktok", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Email" hint="Email kontak, tampil di footer & tombol email">
                      <input
                        value={form.email ?? ""}
                        onChange={(e) => setField("email", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </Card>

                {/* Beranda */}
                <Card title="Beranda — Hero">
                  <Field label="Subjudul / paragraf hero" hint="Teks di bawah judul 'Klinik Rawat Inap Ampelgading Medical Centre'.">
                    <textarea
                      rows={3}
                      value={form.hero_subtitle ?? ""}
                      onChange={(e) => setField("hero_subtitle", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </Card>

                {/* Gambar situs */}
                <Card title="Gambar Situs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Gambar Hero (Beranda)" hint="Foto besar di bagian atas halaman beranda.">
                      <ImagePicker
                        value={form.hero_image ?? ""}
                        onChange={(url) => setField("hero_image", url)}
                        label=""
                      />
                    </Field>
                    <Field label="Gambar Hero (Tentang Kami)" hint="Foto di section atas halaman Tentang Kami.">
                      <ImagePicker
                        value={form.about_image ?? ""}
                        onChange={(url) => setField("about_image", url)}
                        label=""
                      />
                    </Field>
                  </div>
                </Card>

                {/* Tentang Kami */}
                <Card title="Tentang Kami">
                  <Field label="Teks Tentang Kami">
                    <textarea
                      rows={4}
                      value={form.about_text ?? ""}
                      onChange={(e) => setField("about_text", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Visi">
                    <textarea
                      rows={3}
                      value={form.visi ?? ""}
                      onChange={(e) => setField("visi", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Misi">
                    <textarea
                      rows={3}
                      value={form.misi ?? ""}
                      onChange={(e) => setField("misi", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </Card>

                {/* Timeline */}
                <Card title="Timeline Perjalanan Klinik">
                  {timeline.length === 0 ? (
                    <p className="rounded-lg bg-slate-50 px-3 py-2 text-[10px] text-slate-400">
                      Belum ada item timeline.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {timeline.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                        >
                          <div className="grid gap-2 sm:grid-cols-[90px_1fr_auto]">
                            <input
                              value={item.year}
                              onChange={(e) => updateTimeline(index, "year", e.target.value)}
                              placeholder="Tahun"
                              className={inputCls}
                            />
                            <input
                              value={item.title}
                              onChange={(e) => updateTimeline(index, "title", e.target.value)}
                              placeholder="Judul"
                              className={inputCls}
                            />
                            <button
                              type="button"
                              onClick={() => removeTimeline(index)}
                              aria-label="Hapus item timeline"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => updateTimeline(index, "description", e.target.value)}
                            placeholder="Deskripsi"
                            className={`${inputCls} mt-2`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={addTimeline}
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-2 text-[10px] font-medium text-sky-600 hover:bg-sky-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah item
                  </button>
                </Card>

                <div className="flex justify-end pb-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className={adminPrimaryBtn}
                  >
                    <Save className="h-3.5 w-3.5" />
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
