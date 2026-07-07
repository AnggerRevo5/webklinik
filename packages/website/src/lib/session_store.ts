// Session store admin sisi server. Dua jenis sesi hidup berdampingan di sini:
//
// - "break-glass" (prefix token "bg_"): akun darurat, sama seperti sistem lama
//   — divalidasi 100% lokal (ADMIN_USERNAME/ADMIN_PASSWORD_HASH di .env),
//   tidak pernah menyentuh backend Go sama sekali. Sengaja TETAP hilang saat
//   proses Next.js restart — itu trade-off yang diterima demi tetap bisa
//   login walau backend/database mati total.
// - "hierarki" (prefix token "db_"): akun admin_users biasa (superadmin/admin),
//   divalidasi ke backend Go (yang menyimpan sesi permanen di tabel
//   admin_sessions). Di-cache singkat di sini supaya tidak menambah round-trip
//   jaringan di setiap request proxy — begitu proses restart, cache kosong,
//   tapi validasi berikutnya otomatis mengambil ulang dari database (jadi
//   TIDAK perlu login ulang, beda dengan break-glass).
//
// Hanya diimpor oleh route handler (runtime Node), bukan middleware Edge.

import crypto from "crypto";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari (break-glass, samakan dgn maxAge cookie)
export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

// Freshness window cache sesi hierarki — di dalam window ini, validate tidak
// perlu network call sama sekali; di luar window, divalidasi ulang ke backend.
const DB_CACHE_FRESH_MS = 60 * 1000;

const GO_BACKEND = (
  process.env.GO_BACKEND_URL ??
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api$/, "")
);
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

type CacheEntry = {
  role: string;
  username: string;
  source: "breakglass" | "db";
  expiresAt: number; // dipakai break-glass sebagai TTL keras; db cuma penanda cadangan
  validatedAt: number; // kapan terakhir dikonfirmasi valid (dipakai db utk freshness)
};

const sessions = new Map<string, CacheEntry>();

let lastCleanup = 0;
function maybeCleanup(now: number): void {
  if (now - lastCleanup < 60 * 60 * 1000) return; // paling sering tiap 1 jam
  lastCleanup = now;
  for (const [token, entry] of sessions) {
    if (entry.source === "breakglass" && entry.expiresAt <= now) {
      sessions.delete(token);
    }
  }
}

// createBreakGlassSession membuat sesi darurat — persis logika lama, murni lokal.
export function createBreakGlassSession(username: string): string {
  const now = Date.now();
  maybeCleanup(now);
  const token = "bg_" + crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    role: "superadmin",
    username,
    source: "breakglass",
    expiresAt: now + SESSION_TTL_MS,
    validatedAt: now,
  });
  return token;
}

// cacheDbSession menyimpan hasil login/validate dari backend Go supaya
// request berikutnya (dalam freshness window) tidak perlu network call lagi.
export function cacheDbSession(token: string, role: string, username: string): void {
  sessions.set(token, {
    role,
    username,
    source: "db",
    expiresAt: 0, // tidak dipakai — kadaluarsa sesungguhnya dikelola backend
    validatedAt: Date.now(),
  });
}

export type SessionResult =
  | { ok: true; role: string; username: string }
  | { ok: false };

// validateSession memeriksa token: break-glass divalidasi lokal saja; sesi
// hierarki (db_) divalidasi ke backend Go (dengan cache singkat supaya tidak
// menambah round-trip di setiap request).
export async function validateSession(
  token: string | undefined | null,
): Promise<SessionResult> {
  if (!token) return { ok: false };
  const now = Date.now();

  if (token.startsWith("bg_")) {
    const entry = sessions.get(token);
    if (!entry || entry.expiresAt <= now) {
      if (entry) sessions.delete(token);
      return { ok: false };
    }
    entry.expiresAt = now + SESSION_TTL_MS; // sliding refresh
    return { ok: true, role: entry.role, username: entry.username };
  }

  // Sesi hierarki (db_) — cek cache dulu.
  const cached = sessions.get(token);
  if (cached && now - cached.validatedAt < DB_CACHE_FRESH_MS) {
    return { ok: true, role: cached.role, username: cached.username };
  }

  try {
    const res = await fetch(`${GO_BACKEND}/api/admin/session/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_API_KEY },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (data.valid) {
      cacheDbSession(token, data.role, data.username);
      return { ok: true, role: data.role, username: data.username };
    }
    sessions.delete(token);
    return { ok: false };
  } catch {
    // Backend tidak terjangkau sesaat — kalau masih ada cache lama (walau
    // sudah lewat freshness window), tetap pakai itu daripada paksa logout
    // gara-gara hiccup jaringan sesaat. Kalau tidak ada cache sama sekali,
    // fail closed (tolak).
    if (cached) return { ok: true, role: cached.role, username: cached.username };
    return { ok: false };
  }
}

// destroySession menghapus sesi (dipanggil saat logout) — invalidate di server,
// bukan cuma hapus cookie. Untuk sesi hierarki, juga hapus baris di backend.
export async function destroySession(token: string | undefined | null): Promise<void> {
  if (!token) return;
  sessions.delete(token);
  if (token.startsWith("db_")) {
    try {
      await fetch(`${GO_BACKEND}/api/admin/session`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_API_KEY },
        body: JSON.stringify({ token }),
      });
    } catch {
      /* best-effort — cookie tetap dihapus di klien walau ini gagal */
    }
  }
}
