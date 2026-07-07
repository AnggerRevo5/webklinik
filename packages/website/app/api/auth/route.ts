import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  checkLoginAllowed,
  getClientIp,
  registerFailure,
  registerSuccess,
  safeEqual,
} from "@/src/lib/login_guard";
import {
  cacheDbSession,
  createBreakGlassSession,
  destroySession,
  validateSession,
  SESSION_TTL_SECONDS,
} from "@/src/lib/session_store";

const SESSION_COOKIE = "admin_session";

const GO_BACKEND = (
  process.env.GO_BACKEND_URL ??
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api$/, "")
);
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

// Catat event login/logout ke audit log backend. Best-effort — kegagalan
// mencatat tidak boleh menggagalkan login/logout itu sendiri.
function recordAuditLog(actor: string, action: string, ip: string) {
  fetch(`${GO_BACKEND}/api/admin/audit-log`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_API_KEY },
    body: JSON.stringify({ actor, action, detail: `ip=${ip}` }),
  }).catch(() => {});
}

// Cek kredensial break-glass (akun darurat, murni env — lihat session_store.ts).
// Dicek lebih dulu karena murah (tanpa network) dan harus tetap jalan walau
// backend/database mati total.
async function checkBreakGlass(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME ?? "";
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  if (!adminUsername || !safeEqual(username, adminUsername)) return false;

  if (adminPasswordHash) {
    return bcrypt.compare(password, adminPasswordHash);
  }
  if (adminPassword) {
    console.warn(
      "[auth] ADMIN_PASSWORD_HASH belum di-set; memakai ADMIN_PASSWORD plaintext. " +
        "Generate hash bcrypt dan set ADMIN_PASSWORD_HASH untuk keamanan.",
    );
    return safeEqual(password, adminPassword);
  }
  return false;
}

// Login akun hierarki (superadmin/admin biasa) — divalidasi ke backend Go
// (tabel admin_users), TIDAK jalan kalau backend/database sedang tidak bisa
// diakses (beda dari break-glass yang murni lokal).
async function tryDbLogin(
  username: string,
  password: string,
): Promise<{ token: string; role: string } | null> {
  try {
    const res = await fetch(`${GO_BACKEND}/api/admin/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_API_KEY },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return { token: data.token, role: data.role };
  } catch {
    return null; // backend tidak terjangkau — bukan break-glass, jadi gagal
  }
}

// POST /api/auth — login
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Tolak lebih awal bila IP ini sedang terkunci karena terlalu banyak gagal.
  const gate = checkLoginAllowed(ip);
  if (!gate.allowed) {
    const menit = Math.ceil(gate.retryAfterSec / 60);
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${menit} menit.`,
      },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const { username, password } = (await req.json()) as {
    username?: string;
    password?: string;
  };
  const u = username ?? "";
  const p = password ?? "";

  let token: string;

  if (await checkBreakGlass(u, p)) {
    token = createBreakGlassSession(u);
  } else {
    const dbLogin = await tryDbLogin(u, p);
    if (!dbLogin) {
      registerFailure(ip);
      recordAuditLog(u || "(unknown)", "login_failed", ip);
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }
    cacheDbSession(dbLogin.token, dbLogin.role, u);
    token = dbLogin.token;
  }

  registerSuccess(ip);
  recordAuditLog(u, "login_success", ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}

// DELETE /api/auth — logout (invalidate sesi di server, bukan cuma hapus cookie)
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const current = await validateSession(token);
  await destroySession(token);
  recordAuditLog(current.ok ? current.username : "(unknown)", "logout", getClientIp(req));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
