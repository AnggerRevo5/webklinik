export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export type ApiEnvelope<T> = {
  message?: string;
  data: T;
  error?: string;
};

export type Banner = {
  id: number;
  url: string;
};

export type Service = {
  id: number;
  url: string;
  nama_layanan: string;
};

export type CreateServicePayload = {
  nama_layanan: string;
  url: string;
};

export type Promo = {
  id: number;
  url: string;
  tampil: boolean;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
};

export type CreatePromoPayload = {
  url: string;
  tampil?: boolean;
  tanggal_mulai?: string | null;
  tanggal_selesai?: string | null;
};

export type Doctor = {
  id: number;
  url: string;
  nama_dokter: string;
  jadwal_praktek: string;
  kategori: string;
};

export type Gallery = {
  id: number;
  kategori: string;
  text: string;
  url: string;
};

export type CreateGalleryPayload = {
  kategori: string;
  text: string;
  url: string;
};

export type SocialLink = {
  id: number;
  label: string;
  url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OperationalHour = {
  id: number;
  day_label: string;
  open_time?: string | null;
  close_time?: string | null;
  is_24_hours: boolean;
  note: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSetting = {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_group: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type GoogleReview = {
  id: number;
  review_count: number;
  average_rating: number;
  recorded_at: string;
};

export type KlinikInfo = {
  id: number;
  rating_google: number;
  total_ulasan: number;
  link_gmaps: string;
};

export type HomeData = {
  banner: Banner[];
  layanan: Service[];
  dokter: Doctor[];
  promo: Promo[];
  galeri: Gallery[];
  event: unknown[];
  visitor_sessions: unknown[];
  social_media_engagement: unknown[];
  social_media_stats: unknown[];
  gbp_interactions: unknown[];
  google_reviews: GoogleReview[];
  site_settings?: SiteSetting[];
  operational_hours?: OperationalHour[];
  social_links?: SocialLink[];
  klinik_info?: KlinikInfo;
};

export type ContactMessagePayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
};

// ─── Media Library (Cloudinary via backend) ──────────────────────────────────

export type MediaFolder =
  | "dokter"
  | "layanan"
  | "promo"
  | "galeri"
  | "artikel"
  | "logo";

export type MediaItem = {
  id: number;
  url: string;
  public_id: string;
  nama_file: string;
  folder: MediaFolder;
  format: string;
  ukuran: number;
  lebar: number;
  tinggi: number;
  uploaded_at: string;
};

export type MediaPagination = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export async function getMedia(
  folder?: MediaFolder,
  page = 1,
  perPage = 24,
): Promise<{ data: MediaItem[]; pagination: MediaPagination }> {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (folder) params.set("folder", folder);
  const res = await fetch(`${API_BASE_URL}/media?${params}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  const json = await res.json();
  return {
    data: json.data ?? [],
    pagination: json.pagination ?? { page: 1, per_page: 24, total: 0, total_pages: 0 },
  };
}

export async function uploadMedia(
  file: File,
  folder: MediaFolder,
): Promise<{ success: boolean; data?: MediaItem; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  // JANGAN set Content-Type — browser set multipart/form-data dengan boundary
  const res = await fetch(`${API_BASE_URL}/media/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function deleteMedia(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/media/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  return res.json();
}

export async function syncCloudinaryMedia(): Promise<{
  success: boolean;
  total_found?: number;
  added?: number;
  skipped?: number;
  error?: string;
}> {
  const res = await fetch(`${API_BASE_URL}/admin/media/sync-cloudinary`, {
    method: "POST",
    headers: { Accept: "application/json" },
  });
  return res.json();
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file: File): string | null {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) return "Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF";
  if (file.size > 5 * 1024 * 1024) return "Ukuran file maksimal 5MB";
  return null;
}

// ─── Review (Google Review manual) ──────────────────────────────────────────

export type Review = {
  id: number;
  nama: string;
  rating: number;
  komentar: string;
  tanggal: string;
  tag: string;
  featured: boolean;
  tampil: boolean;
  urutan: number;
  created_at: string;
  updated_at: string;
};

export type ReviewSummary = {
  rating_google: number;
  total_ulasan: number;
  link_gmaps: string;
};

export type ReviewAdminData = {
  reviews: Review[];
  summary: ReviewSummary;
};

export async function getReview(): Promise<ReviewAdminData> {
  try {
    const res = await fetch(`${API_BASE_URL}/review`, { cache: "no-store" });
    const json = await res.json();
    return json.data ?? { reviews: [], summary: { rating_google: 0, total_ulasan: 0, link_gmaps: "" } };
  } catch {
    return { reviews: [], summary: { rating_google: 0, total_ulasan: 0, link_gmaps: "" } };
  }
}

export async function adminGetReview(): Promise<ReviewAdminData> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/review`, { cache: "no-store" });
    const json = await res.json();
    return { reviews: json.reviews ?? [], summary: json.summary ?? { rating_google: 0, total_ulasan: 0, link_gmaps: "" } };
  } catch {
    return { reviews: [], summary: { rating_google: 0, total_ulasan: 0, link_gmaps: "" } };
  }
}

export async function adminCreateReview(
  data: Omit<Review, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; data?: Review; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

export async function adminUpdateReview(
  id: number,
  data: Omit<Review, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/review/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

export async function adminToggleTampil(
  id: number,
): Promise<{ success: boolean; tampil: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/review/${id}/toggle-tampil`, {
    method: "PATCH",
    cache: "no-store",
  });
  return res.json();
}

export async function adminToggleFeatured(
  id: number,
): Promise<{ success: boolean; featured: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/review/${id}/toggle-featured`, {
    method: "PATCH",
    cache: "no-store",
  });
  return res.json();
}

export async function adminDeleteReview(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/review/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
  return res.json();
}

export async function adminUpdateReviewSummary(
  data: ReviewSummary,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/review/summary`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

// ─── Artikel ─────────────────────────────────────────────────────────────────

export const KATEGORI_ARTIKEL = [
  "Tips Kesehatan",
  "Edukasi",
  "Berita Klinik",
  "Ibu & Anak",
  "Pengumuman",
] as const;

export type Artikel = {
  id: number;
  judul: string;
  slug: string;
  ringkasan: string;
  konten?: string;
  kategori: string;
  foto_url: string;
  penulis: string;
  status: "draft" | "published";
  published_at: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
};

export type ArtikelPayload = {
  judul?: string;
  konten?: string;
  ringkasan?: string;
  kategori?: string;
  foto_url?: string;
  penulis?: string;
  status?: "draft" | "published";
};

// Public — list (tanpa konten)
export async function getArtikel(limit?: number, kategori?: string): Promise<Artikel[]> {
  try {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (kategori && kategori !== "Semua") params.set("kategori", kategori);
    const qs = params.toString();
    return await requestJson<Artikel[]>(`/artikel${qs ? `?${qs}` : ""}`);
  } catch {
    return [];
  }
}

// Public — detail (termasuk konten)
export async function getArtikelBySlug(slug: string): Promise<Artikel | null> {
  try {
    return await requestJson<Artikel>(`/artikel/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

// Admin — list
export async function adminGetArtikel(
  page = 1,
  status?: "draft" | "published" | "all",
): Promise<{ data: Artikel[]; pagination: { page: number; per_page: number; total: number; total_pages: number } }> {
  try {
    const params = new URLSearchParams({ page: String(page) });
    if (status && status !== "all") params.set("status", status);
    const res = await fetch(`${API_BASE_URL}/admin/artikel?${params}`, { cache: "no-store" });
    return res.json();
  } catch {
    return { data: [], pagination: { page: 1, per_page: 20, total: 0, total_pages: 0 } };
  }
}

// Admin — detail (termasuk konten penuh)
export async function adminGetArtikelDetail(id: number): Promise<{ success: boolean; data?: Artikel }> {
  const res = await fetch(`${API_BASE_URL}/admin/artikel/${id}`, { cache: "no-store" });
  return res.json();
}

// Admin — create
export async function adminCreateArtikel(
  data: ArtikelPayload,
): Promise<{ success: boolean; data?: Artikel; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/artikel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

// Admin — update
export async function adminUpdateArtikel(
  id: number,
  data: ArtikelPayload,
): Promise<{ success: boolean; data?: Artikel; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/artikel/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

// Admin — publish
export async function adminPublishArtikel(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/artikel/${id}/publish`, {
    method: "PATCH",
    cache: "no-store",
  });
  return res.json();
}

// Admin — tarik ke draft
export async function adminDraftArtikel(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/artikel/${id}/draft`, {
    method: "PATCH",
    cache: "no-store",
  });
  return res.json();
}

// Admin — hapus
export async function adminDeleteArtikel(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/artikel/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });
  return res.json();
}

// ─── Khanza SIK — Dokter Publik ─────────────────────────────────────────────

export type JadwalPublik = {
  hari_kerja: string;
  jam_mulai: string;
  jam_selesai: string;
  nm_poli: string;
};

export type DokterPublik = {
  kd_dokter: string;
  nm_dokter: string;
  jk: string;
  spesialis: string;
  no_telp: string;
  foto_url: string;
  jadwal: JadwalPublik[];
};

export type DokterAdmin = {
  kd_dokter: string;
  nm_dokter: string;
  jk: string;
  spesialis: string;
  no_telp: string;
  status: string;
  foto_url: string;
  tampil_website: boolean;
  jadwal: JadwalPublik[];
};

export async function getDokterPublik(): Promise<DokterPublik[]> {
  try {
    return await requestJson<DokterPublik[]>("/dokter-publik");
  } catch {
    return [];
  }
}

export async function adminGetDokter(): Promise<DokterAdmin[]> {
  try {
    return await requestJson<DokterAdmin[]>("/admin/dokter");
  } catch {
    return [];
  }
}

export async function adminToggleTampilDokter(
  kdDokter: string,
): Promise<{ success: boolean; tampil_website: boolean }> {
  const res = await fetch(
    `${API_BASE_URL}/admin/dokter/${encodeURIComponent(kdDokter)}/toggle-tampil`,
    { method: "PATCH", cache: "no-store", headers: { Accept: "application/json" } },
  );
  return res.json();
}

export async function updateDokterFoto(
  kdDokter: string,
  fotoUrl: string,
): Promise<{ success: boolean; data?: { kd_dokter: string; foto_url: string }; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/dokter-foto/${encodeURIComponent(kdDokter)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ foto_url: fotoUrl }),
    cache: "no-store",
  });
  return res.json();
}

// ─── Khanza SIK — Jadwal Dokter (Admin CRUD) ────────────────────────────────

export const HARI_KERJA = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "AKHAD"] as const;
export type HariKerja = (typeof HARI_KERJA)[number];

export type KhanzaJadwal = {
  kd_dokter: string;
  hari_kerja: string;
  jam_mulai: string;
  jam_selesai: string;
  kd_poli: string;
  kuota: number;
};

export async function adminGetJadwalDokter(kdDokter: string): Promise<KhanzaJadwal[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/jadwal-dokter?kd_dokter=${encodeURIComponent(kdDokter)}`,
      { cache: "no-store", headers: { Accept: "application/json" } },
    );
    return res.json();
  } catch {
    return [];
  }
}

export async function adminCreateJadwalDokter(
  data: KhanzaJadwal,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/jadwal-dokter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

export async function adminUpdateJadwalDokter(
  data: KhanzaJadwal & { old_hari_kerja: string; old_jam_mulai: string },
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/jadwal-dokter`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

export async function adminDeleteJadwalDokter(
  kdDokter: string,
  hariKerja: string,
  jamMulai: string,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/jadwal-dokter`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kd_dokter: kdDokter, hari_kerja: hariKerja, jam_mulai: jamMulai }),
    cache: "no-store",
  });
  return res.json();
}

// ─── Khanza SIK — CRUD Dokter (Admin) ───────────────────────────────────────

export type KhanzaSpesialis = {
  kd_sps: string;
  nm_sps: string;
};

export type KhanzaDokterInput = {
  kd_dokter: string;
  nm_dokter: string;
  jk: string;
  tmp_lahir: string;
  tgl_lahir: string;
  gol_drh: string;
  agama: string;
  almt_tgl: string;
  no_telp: string;
  email: string;
  stts_nikah: string;
  kd_sps: string;
  alumni: string;
  no_ijn_praktek: string;
};

export async function adminGetSpesialis(): Promise<KhanzaSpesialis[]> {
  try {
    return await requestJson<KhanzaSpesialis[]>("/admin/spesialis");
  } catch {
    return [];
  }
}

export async function adminCreateKhanzaDokter(
  input: KhanzaDokterInput,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/khanza/dokter`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  return res.json();
}

export async function adminUpdateKhanzaDokter(
  kdDokter: string,
  input: Omit<KhanzaDokterInput, "kd_dokter">,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(
    `${API_BASE_URL}/admin/khanza/dokter/${encodeURIComponent(kdDokter)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    },
  );
  return res.json();
}

export async function adminDeleteKhanzaDokter(
  kdDokter: string,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(
    `${API_BASE_URL}/admin/khanza/dokter/${encodeURIComponent(kdDokter)}`,
    {
      method: "DELETE",
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );
  return res.json();
}

// ─── Khanza SIK — Pendaftaran Online ────────────────────────────────────────

export type PasienKhanza = {
  no_rkm_medis: string;
  nm_pasien: string;
  no_ktp: string;
  jk: "L" | "P";
  tgl_lahir: string;
  no_tlp: string;
  alamat: string;
  kd_pj: string;
};

export type CekPasienResponse =
  | { success: true; found: true; data: PasienKhanza }
  | { success: true; found: false; message: string };

export type PoliKhanza = {
  kd_poli: string;
  nm_poli: string;
};

export type DokterJadwal = {
  kd_dokter: string;
  nm_dokter: string;
  jam_mulai: string;
  jam_selesai: string;
  kuota: number;
  sisa_kuota: number;
};

export type PenjabKhanza = {
  kd_pj: string;
  png_jawab: string;
  nama_perusahaan: string;
};

export type KuotaResponse = {
  success: boolean;
  kuota: number;
  terisi: number;
  sisa: number;
  tersedia: boolean;
  jam_mulai: string;
  jam_selesai: string;
};

export type PendaftaranPayload = {
  is_new_pasien: boolean;
  no_rkm_medis?: string;
  no_ktp: string;
  nm_pasien?: string;
  jk?: string;
  tmp_lahir?: string;
  tgl_lahir?: string;
  nm_ibu?: string;
  alamat?: string;
  gol_darah?: string;
  pekerjaan?: string;
  stts_nikah?: string;
  agama?: string;
  no_tlp?: string;
  pnd?: string;
  keluarga?: string;
  namakeluarga?: string;
  kd_pj: string;
  no_peserta?: string;
  kd_poli: string;
  kd_dokter: string;
  tanggal_periksa: string;
  waktu_kunjungan: string;
};

export type SubmitPendaftaranResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    no_reg: string;
    no_rkm_medis: string;
    tanggal_periksa: string;
    waktu_kunjungan: string;
    status: string;
  };
};

// State yang disimpan di sessionStorage selama proses pendaftaran
export type PendaftaranSession = {
  step1?: {
    isNewPasien: boolean;
    no_rkm_medis?: string;
    no_ktp: string;
    nm_pasien?: string;
    jk?: string;
    tgl_lahir?: string;
    tmp_lahir?: string;
    no_tlp?: string;
    alamat?: string;
    gol_darah?: string;
    agama?: string;
    stts_nikah?: string;
    pnd?: string;
    pekerjaan?: string;
    nm_ibu?: string;
    namakeluarga?: string;
    keluarga?: string;
  };
  step2?: {
    kd_pj: string;
    png_jawab: string;
    no_peserta: string;
    kd_poli: string;
    nm_poli: string;
    tanggal_periksa: string;
    kd_dokter: string;
    nm_dokter: string;
    waktu_kunjungan: string;
    jam_selesai: string;
  };
  result?: {
    no_reg: string;
    no_rkm_medis: string;
    tanggal_periksa: string;
    waktu_kunjungan: string;
    nm_dokter: string;
    nm_poli: string;
    status: string;
  };
};

export const SESSION_KEY = "pendaftaran_state";

export function savePendaftaranSession(patch: Partial<PendaftaranSession>) {
  if (typeof window === "undefined") return;
  const existing: PendaftaranSession = JSON.parse(
    sessionStorage.getItem(SESSION_KEY) ?? "{}",
  );
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...existing, ...patch }));
}

export function loadPendaftaranSession(): PendaftaranSession {
  if (typeof window === "undefined") return {};
  return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "{}");
}

export function clearPendaftaranSession() {
  if (typeof window !== "undefined") sessionStorage.removeItem(SESSION_KEY);
}

// Konversi Date ke nama hari format Khanza
export function getHariKhanza(date: Date): string {
  const map = ["AKHAD", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
  return map[date.getDay()];
}

export async function cekPasienByNIK(nik: string): Promise<CekPasienResponse> {
  const res = await fetch(
    `${API_BASE_URL}/pendaftaran/cek-pasien?nik=${encodeURIComponent(nik)}`,
    { cache: "no-store", headers: { Accept: "application/json" } },
  );
  return res.json();
}

export async function getPoliKhanza(): Promise<PoliKhanza[]> {
  return requestJson<PoliKhanza[]>("/pendaftaran/poli");
}

export async function getDokterKhanza(
  kdPoli: string,
  hari: string,
  tanggal?: string,
): Promise<DokterJadwal[]> {
  const params = new URLSearchParams({ kd_poli: kdPoli, hari });
  if (tanggal) params.set("tanggal", tanggal);
  return requestJson<DokterJadwal[]>(`/pendaftaran/dokter?${params}`);
}

export async function cekKuota(
  kdDokter: string,
  tanggal: string,
): Promise<KuotaResponse> {
  const res = await fetch(
    `${API_BASE_URL}/pendaftaran/kuota?kd_dokter=${encodeURIComponent(kdDokter)}&tanggal=${encodeURIComponent(tanggal)}`,
    { cache: "no-store", headers: { Accept: "application/json" } },
  );
  return res.json();
}

export async function getPenjamin(): Promise<PenjabKhanza[]> {
  return requestJson<PenjabKhanza[]>("/pendaftaran/penjamin");
}

export async function submitPendaftaran(
  data: PendaftaranPayload,
): Promise<SubmitPendaftaranResponse> {
  const res = await fetch(`${API_BASE_URL}/pendaftaran`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  return res.json();
}

// ─── Tracking & Stats ────────────────────────────────────────────────────────

export type VisitorStats = {
  success: boolean;
  total_sesi_minggu_ini: number;
  rata_rata_halaman: number;
  rata_rata_durasi_menit: number;
  device: Record<string, number>;
  source: { source: string; count: number }[];
  daily_trend: { date: string; count: number }[];
};

export type SocialClickStats = {
  success: boolean;
  total_minggu_ini: number;
  per_platform: { platform: string; count: number }[];
  all_time: { platform: string; count: number }[];
};

export type VisitorSessionItem = {
  id: number;
  session_id: string;
  ip_address: string;
  device: string;
  browser: string;
  pages_visited: number;
  duration_second: number;
  source: string;
  started_at: string;
  ended_at: string | null;
};

export async function adminGetVisitorStats(): Promise<VisitorStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats/visitor`, { cache: "no-store" });
    return res.json();
  } catch { return null; }
}

export async function adminGetSocialClickStats(): Promise<SocialClickStats | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats/social-clicks`, { cache: "no-store" });
    return res.json();
  } catch { return null; }
}

export async function adminGetVisitorSessions(
  page = 1,
  device?: string,
  source?: string,
  browser?: string,
): Promise<{ data: VisitorSessionItem[]; pagination: MediaPagination }> {
  const params = new URLSearchParams({ page: String(page), per_page: "20" });
  if (device) params.set("device", device);
  if (source) params.set("source", source);
  if (browser) params.set("browser", browser);
  try {
    const res = await fetch(`${API_BASE_URL}/admin/visitor-sessions?${params}`, { cache: "no-store" });
    const json = await res.json();
    return {
      data: json.data ?? [],
      pagination: json.pagination ?? { page: 1, per_page: 20, total: 0, total_pages: 0 },
    };
  } catch {
    return { data: [], pagination: { page: 1, per_page: 20, total: 0, total_pages: 0 } };
  }
}

// ─── Sosmed Snapshot CRUD ────────────────────────────────────────────────────

export type SocialMediaStatsItem = {
  id: number;
  platform: string;
  follower_count: number;
  engagement_rate: number;
  recorded_at: string;
};

export type SocialMediaEngagementItem = {
  id: number;
  platform: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  recorded_at: string;
};

export type GBPInteractionItem = {
  id: number;
  interaction_type: string;
  count: number;
  recorded_at: string;
};

// --- Social Media Stats ---
export async function adminGetSocialMediaStats(): Promise<SocialMediaStatsItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/social-media-stats`, { cache: "no-store" });
    const json = await res.json();
    return json.data ?? json ?? [];
  } catch { return []; }
}

export async function adminCreateSocialMediaStats(
  data: Omit<SocialMediaStatsItem, "id">,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/social-media-stats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdateSocialMediaStats(
  id: number,
  data: Omit<SocialMediaStatsItem, "id">,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/social-media-stats/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteSocialMediaStats(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/social-media-stats/${id}`, { method: "DELETE" });
  return res.json();
}

// --- Social Media Engagement ---
export async function adminGetSocialMediaEngagement(): Promise<SocialMediaEngagementItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/social-media-engagement`, { cache: "no-store" });
    const json = await res.json();
    return json.data ?? json ?? [];
  } catch { return []; }
}

export async function adminCreateSocialMediaEngagement(
  data: Omit<SocialMediaEngagementItem, "id">,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/social-media-engagement`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdateSocialMediaEngagement(
  id: number,
  data: Omit<SocialMediaEngagementItem, "id">,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/social-media-engagement/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteSocialMediaEngagement(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/social-media-engagement/${id}`, { method: "DELETE" });
  return res.json();
}

// --- GBP Interaction ---
export async function adminGetGBPInteraction(): Promise<GBPInteractionItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/gbp-interaction`, { cache: "no-store" });
    const json = await res.json();
    return json.data ?? json ?? [];
  } catch { return []; }
}

export async function adminCreateGBPInteraction(
  data: Omit<GBPInteractionItem, "id">,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/gbp-interaction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminUpdateGBPInteraction(
  id: number,
  data: Omit<GBPInteractionItem, "id">,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE_URL}/admin/gbp-interaction/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function adminDeleteGBPInteraction(id: number): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/admin/gbp-interaction/${id}`, { method: "DELETE" });
  return res.json();
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const errorMessage =
      (payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof (payload as Record<string, unknown>).error === "string"
        ? (payload as Record<string, string>).error
        : null) ??
      (payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof (payload as Record<string, unknown>).message === "string"
        ? (payload as Record<string, string>).message
        : null) ??
      (typeof payload === "string" && payload.trim().length > 0
        ? payload
        : null) ??
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

export async function fetchHomeData() {
  return requestJson<HomeData>("/home");
}

export async function createService(payload: CreateServicePayload) {
  return requestJson<Service>("/layanan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateService(id: number, payload: CreateServicePayload) {
  return requestJson<Service>(`/layanan/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...payload }),
  });
}

export async function deleteService(id: number) {
  return requestJson<{ message: string }>(`/layanan/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
}

export async function getPromo(): Promise<Promo[]> {
  return requestJson<Promo[]>("/promo");
}

export async function createPromo(payload: CreatePromoPayload) {
  return requestJson<Promo>("/promo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updatePromo(id: number, payload: CreatePromoPayload) {
  return requestJson<Promo>(`/promo/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...payload }),
  });
}

export async function deletePromo(id: number) {
  return requestJson<{ message: string }>(`/promo/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
}

export async function createGallery(payload: CreateGalleryPayload) {
  return requestJson<Gallery>("/galeri", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateGallery(id: number, payload: CreateGalleryPayload) {
  return requestJson<Gallery>(`/galeri/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...payload }),
  });
}

export async function deleteGallery(id: number) {
  return requestJson<{ message: string }>(`/galeri/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });
}

export async function getGaleri() {
  return requestJson<Gallery[]>("/galeri");
}

export async function fetchSiteSettings() {
  return requestJson<SiteSetting[]>("/site-settings");
}

export async function fetchOperationalHours() {
  return requestJson<OperationalHour[]>("/operational-hours");
}

export async function fetchSocialLinks() {
  return requestJson<SocialLink[]>("/social-links");
}

export async function createContactMessage(payload: ContactMessagePayload) {
  return requestJson<ContactMessagePayload>("/kontak", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      status: payload.status ?? "new",
    }),
  });
}
