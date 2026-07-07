import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard_admin",
  "/admin_audit_log",
  "/admin_laporan_pengunjung",
  "/admin_layanan_crud",
  "/admin_media",
  "/admin_pengaturan",
  "/admin_promo_page",
  "/admin_review_pesan",
  "/admin_sosmed_snapshot",
  "/artikel_admin",
  "/dokter_jadwal_admin",
  "/galeri-artikel_admin",
  "/jam_operasional_admin",
  "/staff_admin",
];

const SESSION_COOKIE = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  if (!isProtected) return NextResponse.next();

  // middleware berjalan di Edge runtime yang tidak bisa mengakses session store
  // (in-memory di proses Node). Di sini cukup cek keberadaan cookie sebagai gerbang
  // tampilan halaman; validasi otoritatif (store + invalidasi) dilakukan di proxy
  // /api/backend, tempat semua DATA admin lewat — cookie palsu hanya dapat shell
  // kosong dengan 401 pada setiap request data.
  const session = req.cookies.get(SESSION_COOKIE);

  if (!session || !session.value) {
    const loginUrl = new URL("/admin_login_page", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard_admin/:path*",
    "/admin_audit_log/:path*",
    "/admin_laporan_pengunjung/:path*",
    "/admin_layanan_crud/:path*",
    "/admin_media/:path*",
    "/admin_pengaturan/:path*",
    "/admin_promo_page/:path*",
    "/admin_review_pesan/:path*",
    "/admin_sosmed_snapshot/:path*",
    "/artikel_admin/:path*",
    "/dokter_jadwal_admin/:path*",
    "/galeri-artikel_admin/:path*",
    "/jam_operasional_admin/:path*",
    "/staff_admin/:path*",
  ],
};
