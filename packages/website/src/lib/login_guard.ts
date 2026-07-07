// Guard sisi server untuk login admin: membatasi percobaan gagal per-IP
// guna mencegah brute-force pada /api/auth (route Next.js yang TIDAK melewati
// rate limiter Go). State disimpan in-memory — cukup untuk deployment 1
// instance; hitungan otomatis reset saat proses server restart.
//
// Hanya diimpor oleh route handler (server). Memakai API Node (crypto/Buffer),
// jadi route yang memakainya harus berjalan di runtime Node (default App Router).

import crypto from "crypto";

const MAX_FAILS = 5; // maksimal percobaan gagal sebelum dikunci
const WINDOW_MS = 15 * 60 * 1000; // jendela penghitungan percobaan (15 menit)
const LOCKOUT_MS = 15 * 60 * 1000; // durasi lockout setelah melewati batas

type AttemptRecord = {
  fails: number;
  firstFailAt: number;
  lockedUntil: number;
};

const attempts = new Map<string, AttemptRecord>();

// Bersihkan entri kadaluarsa sesekali agar Map tidak tumbuh tanpa batas.
let lastCleanup = 0;
function maybeCleanup(now: number): void {
  if (now - lastCleanup < WINDOW_MS) return;
  lastCleanup = now;
  for (const [ip, rec] of attempts) {
    if (rec.lockedUntil < now && now - rec.firstFailAt > WINDOW_MS) {
      attempts.delete(ip);
    }
  }
}

export type LoginGate =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

// Panggil SEBELUM memvalidasi kredensial. Menolak bila IP sedang terkunci.
export function checkLoginAllowed(ip: string): LoginGate {
  const now = Date.now();
  maybeCleanup(now);
  const rec = attempts.get(ip);
  if (rec && rec.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((rec.lockedUntil - now) / 1000),
    };
  }
  return { allowed: true };
}

// Panggil setelah login GAGAL. Menaikkan hitungan; mengunci bila melewati batas.
export function registerFailure(ip: string): void {
  const now = Date.now();
  let rec = attempts.get(ip);
  if (!rec || now - rec.firstFailAt > WINDOW_MS) {
    rec = { fails: 0, firstFailAt: now, lockedUntil: 0 };
  }
  rec.fails += 1;
  if (rec.fails >= MAX_FAILS) {
    rec.lockedUntil = now + LOCKOUT_MS;
  }
  attempts.set(ip, rec);
}

// Panggil setelah login BERHASIL. Reset hitungan untuk IP tersebut.
export function registerSuccess(ip: string): void {
  attempts.delete(ip);
}

// Ekstrak IP asli klien. Prioritas: CF-Connecting-IP (Cloudflare Tunnel) →
// X-Forwarded-For (ambil yang pertama) → "unknown". Selaras dengan
// services.GetRealIP di backend Go.
export function getClientIp(req: Request): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

// Perbandingan string constant-time untuk mencegah timing attack pada kredensial.
export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) {
    // Tetap jalankan satu operasi agar durasi tidak bergantung pada panjang.
    crypto.timingSafeEqual(ba, ba);
    return false;
  }
  return crypto.timingSafeEqual(ba, bb);
}
