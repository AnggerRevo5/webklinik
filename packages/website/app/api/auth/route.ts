import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin_session";

// POST /api/auth — login
export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };

  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const sessionToken = process.env.ADMIN_SESSION_TOKEN ?? "";

  if (!adminPassword || !password || password !== adminPassword) {
    return NextResponse.json({ error: "Password salah" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
  return res;
}

// DELETE /api/auth — logout
export async function DELETE() {
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
