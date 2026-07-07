import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/src/lib/session_store";

const SESSION_COOKIE = "admin_session";

// GET /api/auth/me — Next.js-only (TIDAK diproxy ke Go). Dipakai sidebar &
// halaman admin di sisi klien untuk tahu username/role sesi yang sedang
// aktif, supaya bisa menyembunyikan menu yang butuh role tertentu (mis.
// Audit Log, Kelola Admin — cuma untuk superadmin).
export async function GET(req: NextRequest) {
  const session = await validateSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session.ok) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }
  return NextResponse.json({ username: session.username, role: session.role });
}
