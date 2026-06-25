import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard_admin",
  "/admin_laporan_pengunjung",
  "/admin_layanan_crud",
  "/admin_media",
  "/admin_promo_page",
  "/admin_review_pesan",
  "/admin_sosmed_snapshot",
  "/artikel_admin",
  "/dokter_jadwal_admin",
  "/galeri-artikel_admin",
];

const SESSION_COOKIE = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get(SESSION_COOKIE);
  const expected = process.env.ADMIN_SESSION_TOKEN;

  if (!expected || !session || session.value !== expected) {
    const loginUrl = new URL("/admin_login_page", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard_admin/:path*",
    "/admin_laporan_pengunjung/:path*",
    "/admin_layanan_crud/:path*",
    "/admin_media/:path*",
    "/admin_promo_page/:path*",
    "/admin_review_pesan/:path*",
    "/admin_sosmed_snapshot/:path*",
    "/artikel_admin/:path*",
    "/dokter_jadwal_admin/:path*",
    "/galeri-artikel_admin/:path*",
  ],
};
