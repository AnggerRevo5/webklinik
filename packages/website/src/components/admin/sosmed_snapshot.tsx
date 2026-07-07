"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AtSign,
  BarChart2,
  Edit2,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import InstagramStats from "@/src/components/InstagramStats";
import TiktokStats from "@/src/components/TiktokStats";
import FacebookStats from "@/src/components/FacebookStats";
import { AdminHeader, useToast, ToastContainer } from "@/src/UiKecil/admin_ui";
import {
  adminGetSocialMediaStats,
  adminCreateSocialMediaStats,
  adminUpdateSocialMediaStats,
  adminDeleteSocialMediaStats,
  adminGetSocialMediaEngagement,
  adminCreateSocialMediaEngagement,
  adminUpdateSocialMediaEngagement,
  adminDeleteSocialMediaEngagement,
  adminGetGBPInteraction,
  adminCreateGBPInteraction,
  adminUpdateGBPInteraction,
  adminDeleteGBPInteraction,
  adminRefreshInstagram,
  adminGetInstagramHitStats,
  adminRefreshTiktok,
  adminGetTiktokHitStats,
  adminRefreshFacebook,
  adminGetFacebookHitStats,
  type SocialMediaStatsItem,
  type SocialMediaEngagementItem,
  type GBPInteractionItem,
  type GoogleHitStats,
} from "@/src/lib/api";

type Tab = "instagram" | "tiktok" | "facebook" | "stats" | "engagement" | "gbp";

const PLATFORM_OPTIONS = ["instagram", "facebook", "tiktok", "youtube", "whatsapp"];
const GBP_TYPES = ["pencarian", "klik_rute", "klik_telepon", "tampil_foto", "pesan_langsung"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return iso; }
}

// ── Instagram (otomatis via RapidAPI) ───────────────────────────────────────────

function TabInstagram() {
  const { toasts, showToast, dismissToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hitStats, setHitStats] = useState<GoogleHitStats | null>(null);

  const loadHitStats = useCallback(() => {
    adminGetInstagramHitStats().then((stats) => setHitStats(stats));
  }, []);

  useEffect(() => { loadHitStats(); }, [loadHitStats]);

  async function handleRefresh() {
    setRefreshing(true);
    const res = await adminRefreshInstagram();
    if (res.success) {
      showToast(res.message ?? "Data Instagram berhasil diperbarui", "success");
      setRefreshKey((k) => k + 1);
      loadHitStats();
    } else {
      showToast(res.error ?? "Gagal memperbarui data Instagram", "error");
    }
    setRefreshing(false);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-slate-500">Statistik followers & engagement Instagram, ditarik otomatis dari RapidAPI.</p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Memperbarui..." : "Refresh Data"}
        </button>
      </div>

      {hitStats && (
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-slate-50 px-3 py-2 text-[9px] text-slate-500">
          <span><strong className="text-slate-700">{hitStats.hits_this_month}</strong> hit RapidAPI bulan ini</span>
          <span><strong className="text-slate-700">{hitStats.hits_total}</strong> hit sepanjang waktu</span>
          {hitStats.last_hit_at ? (
            <span>Terakhir: {new Date(hitStats.last_hit_at).toLocaleString("id-ID")}</span>
          ) : null}
          <span className="text-slate-400">Auto-refresh: tiap Senin 08:00 (~4-5 hit/bulan dari limit 50)</span>
        </div>
      )}

      <InstagramStats key={refreshKey} className="max-w-sm" />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ── TikTok (otomatis via RapidAPI) ──────────────────────────────────────────────

function TabTiktok() {
  const { toasts, showToast, dismissToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hitStats, setHitStats] = useState<GoogleHitStats | null>(null);

  const loadHitStats = useCallback(() => {
    adminGetTiktokHitStats().then((stats) => setHitStats(stats));
  }, []);

  useEffect(() => { loadHitStats(); }, [loadHitStats]);

  async function handleRefresh() {
    setRefreshing(true);
    const res = await adminRefreshTiktok();
    if (res.success) {
      showToast(res.message ?? "Data TikTok berhasil diperbarui", "success");
      setRefreshKey((k) => k + 1);
      loadHitStats();
    } else if (res.available === false) {
      showToast("TIKTOK_PROFILE_URL belum diatur di .env backend", "error");
    } else {
      showToast(res.error ?? "Gagal memperbarui data TikTok", "error");
    }
    setRefreshing(false);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-slate-500">Statistik followers & engagement TikTok, ditarik otomatis dari RapidAPI.</p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Memperbarui..." : "Refresh Data"}
        </button>
      </div>

      {hitStats && (
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-slate-50 px-3 py-2 text-[9px] text-slate-500">
          <span><strong className="text-slate-700">{hitStats.hits_this_month}</strong> hit RapidAPI bulan ini</span>
          <span><strong className="text-slate-700">{hitStats.hits_total}</strong> hit sepanjang waktu</span>
          {hitStats.last_hit_at ? (
            <span>Terakhir: {new Date(hitStats.last_hit_at).toLocaleString("id-ID")}</span>
          ) : null}
          <span className="text-slate-400">Auto-refresh: tiap Senin 08:00 (bareng Instagram & Facebook)</span>
        </div>
      )}

      <TiktokStats key={refreshKey} className="max-w-sm" />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ── Facebook (otomatis via RapidAPI) ────────────────────────────────────────────

function TabFacebook() {
  const { toasts, showToast, dismissToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [hitStats, setHitStats] = useState<GoogleHitStats | null>(null);

  const loadHitStats = useCallback(() => {
    adminGetFacebookHitStats().then((stats) => setHitStats(stats));
  }, []);

  useEffect(() => { loadHitStats(); }, [loadHitStats]);

  async function handleRefresh() {
    setRefreshing(true);
    const res = await adminRefreshFacebook();
    if (res.success) {
      showToast(res.message ?? "Data Facebook berhasil diperbarui", "success");
      setRefreshKey((k) => k + 1);
      loadHitStats();
    } else if (res.available === false) {
      showToast("FACEBOOK_PROFILE_URL belum diatur di .env backend", "error");
    } else {
      showToast(res.error ?? "Gagal memperbarui data Facebook", "error");
    }
    setRefreshing(false);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-slate-500">Statistik followers & engagement Facebook, ditarik otomatis dari RapidAPI.</p>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Memperbarui..." : "Refresh Data"}
        </button>
      </div>

      {hitStats && (
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg bg-slate-50 px-3 py-2 text-[9px] text-slate-500">
          <span><strong className="text-slate-700">{hitStats.hits_this_month}</strong> hit RapidAPI bulan ini</span>
          <span><strong className="text-slate-700">{hitStats.hits_total}</strong> hit sepanjang waktu</span>
          {hitStats.last_hit_at ? (
            <span>Terakhir: {new Date(hitStats.last_hit_at).toLocaleString("id-ID")}</span>
          ) : null}
          <span className="text-slate-400">Auto-refresh: tiap Senin 08:00 (bareng Instagram & TikTok)</span>
        </div>
      )}

      <FacebookStats key={refreshKey} className="max-w-sm" />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ── Stats Follower ────────────────────────────────────────────────────────────

type StatsForm = { platform: string; follower_count: number; engagement_rate: number; recorded_at: string };

function emptyStats(): StatsForm {
  return { platform: "instagram", follower_count: 0, engagement_rate: 0, recorded_at: today() };
}

function TabStats() {
  const [items, setItems] = useState<SocialMediaStatsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StatsForm>(emptyStats());
  const [error, setError] = useState("");

  // Logika fetch murni — TIDAK ada setState sinkron di level teratas, supaya
  // aman dipanggil langsung dari efek di bawah (react-hooks/set-state-in-effect).
  const fetchItems = useCallback(() => {
    return adminGetSocialMediaStats().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // Dipakai setelah create/update/delete — boleh setState sinkron karena
  // dipanggil dari event handler, bukan dari efek.
  const load = useCallback(() => {
    setLoading(true);
    fetchItems();
  }, [fetchItems]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function startAdd() {
    setEditId(null);
    setForm(emptyStats());
    setError("");
    setShowForm(true);
  }

  function startEdit(item: SocialMediaStatsItem) {
    setEditId(item.id);
    setForm({
      platform: item.platform,
      follower_count: item.follower_count,
      engagement_rate: item.engagement_rate,
      recorded_at: item.recorded_at?.slice(0, 10) ?? today(),
    });
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const payload = { ...form };
    const res = editId
      ? await adminUpdateSocialMediaStats(editId, payload)
      : await adminCreateSocialMediaStats(payload);
    if (res.success === false) {
      setError((res as { error?: string }).error ?? "Gagal menyimpan");
    } else {
      setShowForm(false);
      load();
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus data ini?")) return;
    await adminDeleteSocialMediaStats(id);
    load();
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">Rekap jumlah follower & engagement rate per platform.</p>
        <button
          type="button"
          onClick={startAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-sky-800">{editId ? "Edit data" : "Tambah data baru"}</span>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
              >
                {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">Follower</label>
              <input
                type="number"
                value={form.follower_count}
                onChange={(e) => setForm({ ...form, follower_count: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">Engagement (%)</label>
              <input
                type="number"
                step="0.01"
                value={form.engagement_rate}
                onChange={(e) => setForm({ ...form, engagement_rate: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">Tanggal</label>
              <input
                type="date"
                value={form.recorded_at}
                onChange={(e) => setForm({ ...form, recorded_at: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>
          {error && <p className="mt-2 text-[10px] text-red-500">{error}</p>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex h-24 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-[11px] text-slate-400">Belum ada data. Klik Tambah untuk menginput.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-2.5">Platform</th>
                <th className="px-4 py-2.5">Follower</th>
                <th className="px-4 py-2.5">Engagement</th>
                <th className="px-4 py-2.5">Tanggal</th>
                <th className="px-4 py-2.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium capitalize text-slate-800">{item.platform}</td>
                  <td className="px-4 py-2.5 text-slate-700">{item.follower_count.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2.5 text-slate-700">{item.engagement_rate}%</td>
                  <td className="px-4 py-2.5 text-slate-500">{formatDate(item.recorded_at)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600 transition-colors hover:bg-sky-100"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Engagement ────────────────────────────────────────────────────────────────

type EngagementForm = {
  platform: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  recorded_at: string;
};

function emptyEngagement(): EngagementForm {
  return { platform: "instagram", likes_count: 0, comments_count: 0, shares_count: 0, saves_count: 0, recorded_at: today() };
}

function TabEngagement() {
  const [items, setItems] = useState<SocialMediaEngagementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EngagementForm>(emptyEngagement());
  const [error, setError] = useState("");

  // Logika fetch murni — TIDAK ada setState sinkron di level teratas, supaya
  // aman dipanggil langsung dari efek di bawah (react-hooks/set-state-in-effect).
  const fetchItems = useCallback(() => {
    return adminGetSocialMediaEngagement().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // Dipakai setelah create/update/delete — boleh setState sinkron karena
  // dipanggil dari event handler, bukan dari efek.
  const load = useCallback(() => {
    setLoading(true);
    fetchItems();
  }, [fetchItems]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function startAdd() {
    setEditId(null);
    setForm(emptyEngagement());
    setError("");
    setShowForm(true);
  }

  function startEdit(item: SocialMediaEngagementItem) {
    setEditId(item.id);
    setForm({
      platform: item.platform,
      likes_count: item.likes_count,
      comments_count: item.comments_count,
      shares_count: item.shares_count,
      saves_count: item.saves_count,
      recorded_at: item.recorded_at?.slice(0, 10) ?? today(),
    });
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const res = editId
      ? await adminUpdateSocialMediaEngagement(editId, form)
      : await adminCreateSocialMediaEngagement(form);
    if (res.success === false) {
      setError((res as { error?: string }).error ?? "Gagal menyimpan");
    } else {
      setShowForm(false);
      load();
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus data ini?")) return;
    await adminDeleteSocialMediaEngagement(id);
    load();
  }

  function field(label: string, key: keyof EngagementForm) {
    return (
      <div key={key}>
        <label className="mb-1 block text-[10px] font-medium text-slate-600">{label}</label>
        <input
          type={key === "platform" ? "text" : key === "recorded_at" ? "date" : "number"}
          value={form[key] as string | number}
          onChange={(e) => setForm({ ...form, [key]: key === "platform" || key === "recorded_at" ? e.target.value : Number(e.target.value) })}
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">Data like, komentar, share, dan save per platform.</p>
        <button type="button" onClick={startAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700">
          <Plus className="h-3.5 w-3.5" /> Tambah
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-sky-800">{editId ? "Edit data" : "Tambah data baru"}</span>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">Platform</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400">
                {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {field("Likes", "likes_count")}
            {field("Komentar", "comments_count")}
            {field("Share", "shares_count")}
            {field("Saves", "saves_count")}
            {field("Tanggal", "recorded_at")}
          </div>
          {error && <p className="mt-2 text-[10px] text-red-500">{error}</p>}
          <button type="button" onClick={handleSave} disabled={saving}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50">
            <Save className="h-3.5 w-3.5" />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex h-24 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-[11px] text-slate-400">Belum ada data.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-2.5">Platform</th>
                <th className="px-4 py-2.5">Likes</th>
                <th className="px-4 py-2.5">Komentar</th>
                <th className="px-4 py-2.5">Share</th>
                <th className="px-4 py-2.5">Saves</th>
                <th className="px-4 py-2.5">Tanggal</th>
                <th className="px-4 py-2.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium capitalize text-slate-800">{item.platform}</td>
                  <td className="px-4 py-2.5 text-slate-700">{item.likes_count.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2.5 text-slate-700">{item.comments_count.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2.5 text-slate-700">{item.shares_count.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2.5 text-slate-700">{item.saves_count.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2.5 text-slate-500">{formatDate(item.recorded_at)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => startEdit(item)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600 transition-colors hover:bg-sky-100">
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button type="button" onClick={() => handleDelete(item.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── GBP Interaction ───────────────────────────────────────────────────────────

type GBPForm = { interaction_type: string; count: number; recorded_at: string };

function emptyGBP(): GBPForm {
  return { interaction_type: "pencarian", count: 0, recorded_at: today() };
}

function TabGBP() {
  const [items, setItems] = useState<GBPInteractionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<GBPForm>(emptyGBP());
  const [error, setError] = useState("");

  // Logika fetch murni — TIDAK ada setState sinkron di level teratas, supaya
  // aman dipanggil langsung dari efek di bawah (react-hooks/set-state-in-effect).
  const fetchItems = useCallback(() => {
    return adminGetGBPInteraction().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // Dipakai setelah create/update/delete — boleh setState sinkron karena
  // dipanggil dari event handler, bukan dari efek.
  const load = useCallback(() => {
    setLoading(true);
    fetchItems();
  }, [fetchItems]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function startAdd() {
    setEditId(null);
    setForm(emptyGBP());
    setError("");
    setShowForm(true);
  }

  function startEdit(item: GBPInteractionItem) {
    setEditId(item.id);
    setForm({
      interaction_type: item.interaction_type,
      count: item.count,
      recorded_at: item.recorded_at?.slice(0, 10) ?? today(),
    });
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const res = editId
      ? await adminUpdateGBPInteraction(editId, form)
      : await adminCreateGBPInteraction(form);
    if (res.success === false) {
      setError((res as { error?: string }).error ?? "Gagal menyimpan");
    } else {
      setShowForm(false);
      load();
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus data ini?")) return;
    await adminDeleteGBPInteraction(id);
    load();
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-500">Interaksi Google Business Profile (input manual dari GBP dashboard).</p>
        <button type="button" onClick={startAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700">
          <Plus className="h-3.5 w-3.5" /> Tambah
        </button>
      </div>

      {showForm && (
        <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-sky-800">{editId ? "Edit data" : "Tambah data baru"}</span>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4 text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">Tipe Interaksi</label>
              <select value={form.interaction_type} onChange={(e) => setForm({ ...form, interaction_type: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400">
                {GBP_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">Jumlah</label>
              <input type="number" value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium text-slate-600">Tanggal</label>
              <input type="date" value={form.recorded_at} onChange={(e) => setForm({ ...form, recorded_at: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400" />
            </div>
          </div>
          {error && <p className="mt-2 text-[10px] text-red-500">{error}</p>}
          <button type="button" onClick={handleSave} disabled={saving}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50">
            <Save className="h-3.5 w-3.5" />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex h-24 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-[11px] text-slate-400">Belum ada data.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-2.5">Tipe Interaksi</th>
                <th className="px-4 py-2.5">Jumlah</th>
                <th className="px-4 py-2.5">Tanggal</th>
                <th className="px-4 py-2.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium capitalize text-slate-800">
                    {item.interaction_type.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">{item.count.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2.5 text-slate-500">{formatDate(item.recorded_at)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => startEdit(item)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-50 text-sky-600 transition-colors hover:bg-sky-100">
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button type="button" onClick={() => handleDelete(item.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────

export default function SosmedSnapshot() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  const tabs: { key: Tab; label: string; icon: typeof BarChart2 }[] = [
    { key: "instagram", label: "Instagram (Otomatis)", icon: AtSign },
    { key: "tiktok", label: "TikTok (Otomatis)", icon: AtSign },
    { key: "facebook", label: "Facebook (Otomatis)", icon: AtSign },
    { key: "stats", label: "Statistik Follower", icon: BarChart2 },
    { key: "engagement", label: "Engagement", icon: BarChart2 },
    { key: "gbp", label: "GBP Interaction", icon: MapPin },
  ];

  return (
    <main className="min-h-dvh w-full bg-[#F0F4FA] p-0">
      <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="sosmed" />

        <section className="flex min-w-0 flex-col">
          <AdminHeader
            icon={<BarChart2 className="h-5 w-5" />}
            title="Snapshot Sosial Media & GBP"
            subtitle="Input manual data sosmed dan Google Business Profile untuk laporan"
          >
            <div className="flex rounded-lg bg-slate-100 p-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-white text-sky-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </AdminHeader>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              {activeTab === "instagram" && <TabInstagram />}
              {activeTab === "tiktok" && <TabTiktok />}
              {activeTab === "facebook" && <TabFacebook />}
              {activeTab === "stats" && <TabStats />}
              {activeTab === "engagement" && <TabEngagement />}
              {activeTab === "gbp" && <TabGBP />}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
