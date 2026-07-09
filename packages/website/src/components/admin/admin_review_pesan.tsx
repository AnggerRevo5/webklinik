"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  Edit3,
  X,
  Info,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  adminCreateReview,
  adminDeleteReview,
  adminGetGoogleHitStats,
  adminGetGoogleReviews,
  adminGetReview,
  adminRefreshGoogleBusiness,
  adminToggleFeatured,
  adminToggleTampil,
  adminToggleTampilGoogleReview,
  adminUpdateReview,
  adminUpdateReviewSummary,
  EMPTY_RATING_BREAKDOWN,
  type GoogleHitStats,
  type GoogleReviewItem,
  type MediaPagination,
  type Review,
  type ReviewSummary,
} from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import GoogleRating from "@/src/components/GoogleRating";
import {
  AdminHeader,
  adminPrimaryBtn,
  ConfirmDialog,
  ToastContainer,
  useToast,
  type ConfirmDialogState,
} from "@/src/UiKecil/admin_ui";

type ReviewForm = {
  nama: string;
  rating: number;
  komentar: string;
  tanggal: string;
  tag: string;
  featured: boolean;
  tampil: boolean;
  urutan: number;
};

const emptyForm: ReviewForm = {
  nama: "",
  rating: 5,
  komentar: "",
  tanggal: "",
  tag: "",
  featured: false,
  tampil: true,
  urutan: 0,
};

const TAG_OPTIONS = ["BPJS", "Umum", "Persalinan", "Pasien Lama", "Anak", "Gigi", "Bedah", "Lainnya"];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} bintang`}
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star
            className={`h-5 w-5 transition-colors ${n <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function AdminReviewPesan() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({ rating_google: 0, total_ulasan: 0, link_gmaps: "", rating_breakdown: EMPTY_RATING_BREAKDOWN });
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>(null);

  // Summary form
  const [summaryForm, setSummaryForm] = useState<ReviewSummary>({ rating_google: 0, total_ulasan: 0, link_gmaps: "", rating_breakdown: EMPTY_RATING_BREAKDOWN });
  const [savingSummary, setSavingSummary] = useState(false);
  const [summaryMsg, setSummaryMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Google Business (otomatis via RapidAPI)
  const [refreshingGoogle, setRefreshingGoogle] = useState(false);
  const [googleRefreshKey, setGoogleRefreshKey] = useState(0);
  const [googleReviews, setGoogleReviews] = useState<GoogleReviewItem[]>([]);
  const [googlePagination, setGooglePagination] = useState<MediaPagination>({ page: 1, per_page: 10, total: 0, total_pages: 0 });
  const [googlePage, setGooglePage] = useState(1);
  const [googleRatingFilter, setGoogleRatingFilter] = useState<number | null>(null);
  const [loadingGoogleReviews, setLoadingGoogleReviews] = useState(true);
  const [hitStats, setHitStats] = useState<GoogleHitStats | null>(null);

  function loadHitStats() {
    adminGetGoogleHitStats().then((stats) => setHitStats(stats));
  }

  useEffect(() => { loadHitStats(); }, []);

  function loadGoogleReviews() {
    adminGetGoogleReviews(googlePage, 10, googleRatingFilter ?? undefined).then((result) => {
      setGoogleReviews(result.data);
      setGooglePagination(result.pagination);
      setLoadingGoogleReviews(false);
    });
  }

  useEffect(() => { loadGoogleReviews(); }, [googlePage, googleRatingFilter]);

  function selectGoogleRatingFilter(rating: number | null) {
    setGoogleRatingFilter(rating);
    setGooglePage(1);
  }

  async function handleToggleTampilGoogleReview(r: GoogleReviewItem) {
    setGoogleReviews((prev) => prev.map((x) => x.id === r.id ? { ...x, tampil: !x.tampil } : x));
    await adminToggleTampilGoogleReview(r.id);
  }

  async function handleRefreshGoogle() {
    setRefreshingGoogle(true);
    const res = await adminRefreshGoogleBusiness();
    if (res.success) {
      showToast(res.message ?? "Data Google Business berhasil diperbarui", "success");
      setGoogleRefreshKey((k) => k + 1);
      loadGoogleReviews();
      loadHitStats();
    } else {
      showToast(res.error ?? "Gagal memperbarui data Google Business", "error");
    }
    setRefreshingGoogle(false);
  }

  // Modal add/edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Review | null>(null);
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Tab filter
  const [activeTab, setActiveTab] = useState<"semua" | "tampil" | "tersembunyi">("semua");

  // Pakai .then() (bukan async/await) supaya linter react-hooks bisa lihat
  // setState hanya terjadi di kelanjutan asinkron, bukan sinkron di efek.
  function loadData() {
    adminGetReview().then((data) => {
      setReviews(data.reviews);
      setSummary(data.summary);
      setSummaryForm(data.summary);
      setLoading(false);
    });
  }

  useEffect(() => { loadData(); }, []);

  async function handleToggleTampil(r: Review) {
    setReviews((prev) => prev.map((x) => x.id === r.id ? { ...x, tampil: !x.tampil } : x));
    await adminToggleTampil(r.id);
  }

  async function handleToggleFeatured(r: Review) {
    setReviews((prev) => prev.map((x) => x.id === r.id ? { ...x, featured: !x.featured } : x));
    await adminToggleFeatured(r.id);
  }

  function handleDelete(id: number, nama: string) {
    setConfirmDialog({
      title: "Hapus Review?",
      message: `Review dari "${nama}" akan dihapus permanen dan tidak bisa dikembalikan.`,
      onConfirm: async () => {
        setReviews((prev) => prev.filter((x) => x.id !== id));
        await adminDeleteReview(id);
        showToast("Review berhasil dihapus", "success");
      },
    });
  }

  async function handleSaveSummary(e: React.FormEvent) {
    e.preventDefault();
    setSavingSummary(true);
    setSummaryMsg(null);
    const res = await adminUpdateReviewSummary(summaryForm);
    if (res.success) {
      setSummary(summaryForm);
      setSummaryMsg({ ok: true, text: "Tersimpan." });
      showToast("Rating klinik berhasil disimpan!", "success");
    } else {
      setSummaryMsg({ ok: false, text: res.error ?? "Gagal menyimpan." });
      showToast(res.error ?? "Gagal menyimpan rating", "error");
    }
    setSavingSummary(false);
  }

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(r: Review) {
    setEditTarget(r);
    setForm({
      nama: r.nama,
      rating: r.rating,
      komentar: r.komentar,
      tanggal: r.tanggal,
      tag: r.tag,
      featured: r.featured,
      tampil: r.tampil,
      urutan: r.urutan,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSaveReview(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim() || !form.komentar.trim() || !form.tanggal) {
      setFormError("Nama, komentar, dan tanggal wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError(null);
    if (editTarget) {
      const res = await adminUpdateReview(editTarget.id, form);
      if (res.success) {
        setReviews((prev) => prev.map((x) => x.id === editTarget.id ? { ...x, ...form } : x));
        setModalOpen(false);
        showToast("Review berhasil diperbarui!", "success");
      } else {
        setFormError(res.error ?? "Gagal menyimpan.");
        showToast(res.error ?? "Gagal menyimpan review", "error");
      }
    } else {
      const res = await adminCreateReview(form);
      if (res.success && res.data) {
        setReviews((prev) => [res.data!, ...prev]);
        setModalOpen(false);
        showToast("Review berhasil ditambahkan!", "success");
      } else {
        setFormError(res.error ?? "Gagal menyimpan.");
        showToast(res.error ?? "Gagal menambah review", "error");
      }
    }
    setSaving(false);
  }

  const filtered = reviews.filter((r) => {
    if (activeTab === "tampil") return r.tampil;
    if (activeTab === "tersembunyi") return !r.tampil;
    return true;
  });

  const filteredActive = filtered.filter((r) => r.tampil);
  const filteredInactive = filtered.filter((r) => !r.tampil);

  const tampilCount = reviews.filter((r) => r.tampil).length;
  const tersembunyiCount = reviews.filter((r) => !r.tampil).length;

  function renderReviewCard(r: Review) {
    return (
      <article
        key={r.id}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[12px] font-bold text-white">
            {r.nama[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-900">{r.nama}</span>
              {r.tag ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] text-slate-500">{r.tag}</span>
              ) : null}
              {r.featured ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[8px] font-semibold text-amber-600">Featured</span>
              ) : null}
              {!r.tampil ? (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[8px] text-rose-500">Tersembunyi</span>
              ) : null}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <span className="text-[8px] text-slate-400">{r.tanggal}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-600">{r.komentar}</p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-1.5">
            <button
              type="button"
              title={r.featured ? "Unfeature" : "Jadikan featured"}
              onClick={() => handleToggleFeatured(r)}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-medium transition-all hover:-translate-y-0.5 ${r.featured ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
            >
              <Star className={`h-3 w-3 ${r.featured ? "fill-amber-400" : ""}`} />
            </button>
            <button
              type="button"
              title={r.tampil ? "Sembunyikan" : "Tampilkan"}
              onClick={() => handleToggleTampil(r)}
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-medium transition-all hover:-translate-y-0.5 ${r.tampil ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
            >
              {r.tampil ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </button>
            <button
              type="button"
              aria-label="Edit review"
              onClick={() => openEdit(r)}
              className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1.5 text-[9px] font-medium text-sky-600 transition-all hover:-translate-y-0.5 hover:bg-sky-100"
            >
              <Edit3 className="h-3 w-3" />
            </button>
            <button
              type="button"
              aria-label="Hapus review"
              title="Hapus review ini"
              onClick={() => handleDelete(r.id, r.nama)}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1.5 text-[9px] font-medium text-rose-600 transition-all hover:-translate-y-0.5 hover:bg-rose-100"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">Halaman admin review Google KRI AMC</h2>
      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="review" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <AdminHeader
            icon={<Star className="h-5 w-5" />}
            title="Review & Testimoni"
            subtitle="Input manual dari Google Maps — data tersimpan di database"
          >
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-[11px] text-slate-500 transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button type="button" onClick={openAdd} className={adminPrimaryBtn}>
              <Plus className="h-3 w-3" />
              Tambah Review
            </button>
          </AdminHeader>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4">
            {/* Summary card */}
            <form
              onSubmit={handleSaveSummary}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[13px] font-semibold text-slate-900">Rating Keseluruhan Klinik</div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-slate-500">Rating Google (1.0–5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={1}
                    max={5}
                    value={summaryForm.rating_google}
                    onChange={(e) => setSummaryForm((s) => ({ ...s, rating_google: parseFloat(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                    placeholder="4.8"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-slate-500">Total Ulasan Google</label>
                  <input
                    type="number"
                    min={0}
                    value={summaryForm.total_ulasan}
                    onChange={(e) => setSummaryForm((s) => ({ ...s, total_ulasan: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                    placeholder="23"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-slate-500">Link Google Maps</label>
                  <input
                    type="url"
                    value={summaryForm.link_gmaps}
                    onChange={(e) => setSummaryForm((s) => ({ ...s, link_gmaps: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={savingSummary}
                  className="rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-60"
                >
                  {savingSummary ? "Menyimpan..." : "Simpan Rating"}
                </button>
                {summary.link_gmaps ? (
                  <a
                    href={summary.link_gmaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[9px] text-sky-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Buka Google Maps
                  </a>
                ) : null}
                {summaryMsg ? (
                  <span className={`text-[9px] ${summaryMsg.ok ? "text-emerald-600" : "text-rose-600"}`}>
                    {summaryMsg.text}
                  </span>
                ) : null}
              </div>
            </form>

            {/* Google Business (otomatis via RapidAPI) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[13px] font-semibold text-slate-900">Google Business (Otomatis)</div>
                <button
                  type="button"
                  onClick={handleRefreshGoogle}
                  disabled={refreshingGoogle}
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-60"
                >
                  <RefreshCw className={`h-3 w-3 ${refreshingGoogle ? "animate-spin" : ""}`} />
                  {refreshingGoogle ? "Memperbarui..." : "Refresh Data"}
                </button>
              </div>

              {hitStats ? (
                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-slate-50 px-3 py-2 text-[9px] text-slate-500">
                  <span><strong className="text-slate-700">{hitStats.hits_this_month}</strong> hit RapidAPI bulan ini</span>
                  <span><strong className="text-slate-700">{hitStats.hits_total}</strong> hit sepanjang waktu</span>
                  {hitStats.last_hit_at ? (
                    <span>Terakhir: {new Date(hitStats.last_hit_at).toLocaleString("id-ID")}</span>
                  ) : null}
                  <span className="text-slate-400">Auto-refresh: tiap Senin 07:00 (~2 hit/minggu)</span>
                </div>
              ) : null}

              <GoogleRating key={googleRefreshKey} className="mb-4" />

              {/* Filter bintang */}
              <div className="mb-3 flex flex-wrap gap-2 text-[9px] font-medium">
                <button
                  type="button"
                  onClick={() => selectGoogleRatingFilter(null)}
                  className={`rounded-full border px-3 py-1.5 transition-all ${googleRatingFilter === null ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-sky-200"}`}
                >
                  Semua
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => selectGoogleRatingFilter(star)}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 transition-all ${googleRatingFilter === star ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-sky-200"}`}
                  >
                    {star} <Star className="h-2.5 w-2.5 fill-current" />
                  </button>
                ))}
              </div>

              {loadingGoogleReviews ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center text-[10px] text-slate-500">
                  Memuat ulasan Google...
                </div>
              ) : googleReviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-center text-[10px] text-slate-500">
                  Belum ada ulasan Google di kategori ini.
                </div>
              ) : (
                <div className="space-y-2">
                  {[...googleReviews].sort((a, b) => Number(b.tampil) - Number(a.tampil)).map((r) => (
                    <article key={r.id} className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex flex-wrap items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-semibold text-slate-900">
                              {r.reviewer_name || "Pengguna Google"}
                            </span>
                            {!r.tampil ? (
                              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[8px] text-rose-500">Tersembunyi</span>
                            ) : null}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                                />
                              ))}
                            </div>
                            <span className="text-[8px] text-slate-400">{r.review_date}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-600">{r.review_text}</p>
                        </div>
                        <button
                          type="button"
                          title={r.tampil ? "Sembunyikan dari website" : "Tampilkan di website"}
                          onClick={() => handleToggleTampilGoogleReview(r)}
                          className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-medium transition-all hover:-translate-y-0.5 ${r.tampil ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                        >
                          {r.tampil ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {googlePagination.total_pages > 1 && (
                <div className="mt-3 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGooglePage((p) => Math.max(1, p - 1))}
                    disabled={googlePage === 1}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:opacity-40 hover:enabled:bg-slate-50"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[9px] text-slate-400">
                    Halaman {googlePagination.page} dari {googlePagination.total_pages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGooglePage((p) => Math.min(googlePagination.total_pages, p + 1))}
                    disabled={googlePage === googlePagination.total_pages}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:opacity-40 hover:enabled:bg-slate-50"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Panduan */}
            <div className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
              <div className="text-[9px] text-sky-700">
                <p className="font-semibold">Cara tambah review dari Google Maps:</p>
                <ol className="mt-1 list-decimal pl-4 space-y-0.5">
                  <li>Buka Google Maps → cari <strong>KRI Ampelgading Medical Centre</strong></li>
                  <li>Klik tab <strong>Ulasan</strong></li>
                  <li>Copy nama, bintang, komentar, dan tanggal</li>
                  <li>Klik <strong>Tambah Review</strong> di atas dan paste datanya</li>
                  <li>Centang <strong>Featured</strong> jika ingin ditampilkan di posisi utama</li>
                </ol>
              </div>
            </div>

            {/* Tab + list */}
            <div>
              <div className="mb-3 flex flex-wrap gap-2 text-[9px] font-medium">
                {(["semua", "tampil", "tersembunyi"] as const).map((tab) => {
                  const label = tab === "semua" ? `Semua (${reviews.length})` : tab === "tampil" ? `Ditampilkan (${tampilCount})` : `Disembunyikan (${tersembunyiCount})`;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-full border px-3 py-1.5 transition-all ${activeTab === tab ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-sky-200"}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-[10px] text-slate-500">
                  Memuat data...
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-[10px] text-slate-500">
                  Belum ada review di kategori ini.
                </div>
              ) : (
                <div>
                  {/* Review ditampilkan di website */}
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
                      <div className="space-y-3">
                        {filteredActive.map((r) => renderReviewCard(r))}
                      </div>
                    </div>
                  )}

                  {/* Divider + review tersembunyi */}
                  {filteredInactive.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-[9px] font-medium text-slate-400">
                          Tidak Ditampilkan ({filteredInactive.length})
                        </span>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                      <div className="space-y-3">
                        {filteredInactive.map((r) => renderReviewCard(r))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />

      {/* Modal tambah/edit */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="text-[14px] font-semibold text-slate-900">
                {editTarget ? "Edit Review" : "Tambah Review dari Google Maps"}
              </div>
              <button
                type="button"
                aria-label="Tutup modal"
                onClick={() => setModalOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSaveReview} className="space-y-3 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-slate-500">Nama Reviewer *</label>
                  <input
                    value={form.nama}
                    onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                    placeholder="Nama dari Google Maps"
                  />
                </div>
                <div>
                  <label htmlFor="form-tanggal" className="mb-1 block text-[9px] font-medium text-slate-500">Tanggal *</label>
                  <input
                    id="form-tanggal"
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-medium text-slate-500">Rating *</label>
                <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-medium text-slate-500">Komentar *</label>
                <textarea
                  rows={4}
                  value={form.komentar}
                  onChange={(e) => setForm((f) => ({ ...f, komentar: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400 resize-none"
                  placeholder="Isi review dari Google Maps..."
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="form-tag" className="mb-1 block text-[9px] font-medium text-slate-500">Tag</label>
                  <select
                    id="form-tag"
                    value={form.tag}
                    onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                  >
                    <option value="">-- Pilih tag --</option>
                    {TAG_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-medium text-slate-500">Urutan tampil</label>
                  <input
                    type="number"
                    min={0}
                    value={form.urutan}
                    onChange={(e) => setForm((f) => ({ ...f, urutan: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] outline-none focus:border-sky-400"
                    placeholder="0 = pertama"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-[10px]">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="h-3.5 w-3.5 rounded"
                  />
                  <span className="text-slate-700">Featured (tampil paling menonjol)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.tampil}
                    onChange={(e) => setForm((f) => ({ ...f, tampil: e.target.checked }))}
                    className="h-3.5 w-3.5 rounded"
                  />
                  <span className="text-slate-700">Tampilkan di website</span>
                </label>
              </div>

              {formError ? (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-[9px] text-rose-600">{formError}</div>
              ) : null}

              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-[10px] font-medium text-white disabled:opacity-60"
                >
                  {saving ? "Menyimpan..." : editTarget ? "Simpan Perubahan" : "Tambah Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
