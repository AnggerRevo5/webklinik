import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/src/lib/session_store";

// GO_BACKEND_URL = "http://localhost:8080" (tanpa /api)
const GO_BACKEND = (
  process.env.GO_BACKEND_URL ??
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api$/, "")
);

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

const SESSION_COOKIE = "admin_session";

// Path mutasi yang boleh diakses publik tanpa sesi admin (disamakan dengan
// publicPOSTPrefixes di backend middleware/auth.go). Relatif terhadap path
// proxy (tanpa awalan "/api/").
const PUBLIC_MUTATION_PREFIXES = ["pendaftaran", "track/", "kontak"];

function isPublicMutation(path: string): boolean {
  return PUBLIC_MUTATION_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix),
  );
}

// Path yang WAJIB sesi admin untuk semua method, termasuk GET (data admin/PII).
// Selaras dengan isProtectedReadPath di backend middleware/auth.go. Relatif
// terhadap path proxy (tanpa awalan "/api/").
const PROTECTED_PREFIXES = ["admin/", "visitor-sessions", "event"];

function isProtectedPath(path: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix),
  );
}

async function proxy(
  req: NextRequest,
  pathParts: string[],
): Promise<NextResponse> {
  const path = pathParts.join("/");
  const search = req.nextUrl.search;
  const targetUrl = `${GO_BACKEND}/api/${path}${search}`;

  // Gerbang autentikasi: wajib cookie sesi admin valid untuk (a) request mutasi
  // selain path publik, dan (b) semua akses ke path admin/PII termasuk GET.
  // Tanpa ini, proxy akan menyuntikkan ADMIN_API_KEY untuk siapa pun → bypass auth.
  const method = req.method;
  const isRead = method === "GET" || method === "HEAD" || method === "OPTIONS";
  const requiresSession =
    isProtectedPath(path) || (!isRead && !isPublicMutation(path));

  let sessionRole: string | undefined;
  let sessionUsername: string | undefined;
  if (requiresSession) {
    const session = await validateSession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session.ok) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
    }
    sessionRole = session.role;
    sessionUsername = session.username;
  }

  const forwardHeaders: Record<string, string> = {};
  const contentType = req.headers.get("content-type");
  if (contentType) forwardHeaders["content-type"] = contentType;
  if (ADMIN_API_KEY) forwardHeaders["x-admin-key"] = ADMIN_API_KEY;
  // Role/identitas hasil resolusi sesi — cuma di-set oleh server Next.js ini
  // sendiri (bukan dari input klien), dipakai backend Go untuk role-gating
  // (mis. audit log & kelola akun admin, superadmin only).
  if (sessionRole) forwardHeaders["x-admin-role"] = sessionRole;
  if (sessionUsername) forwardHeaders["x-admin-username"] = sessionUsername;

  // Teruskan IP asli pengunjung ke backend Go. Tanpa ini, semua request yang
  // lewat proxy ini tampak berasal dari IP server Next.js, sehingga rate
  // limiter backend menghitung seluruh pengunjung sebagai satu IP.
  const clientIp =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for") ??
    "";
  if (clientIp) forwardHeaders["x-forwarded-for"] = clientIp;

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  const resp = await fetch(targetUrl, {
    method: req.method,
    headers: forwardHeaders,
    body,
  });

  const respBody = await resp.arrayBuffer();

  return new NextResponse(respBody, {
    status: resp.status,
    headers: {
      "content-type":
        resp.headers.get("content-type") ?? "application/json",
    },
  });
}

type RouteParams = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: RouteParams) {
  return proxy(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: RouteParams) {
  return proxy(req, (await params).path);
}
export async function PUT(req: NextRequest, { params }: RouteParams) {
  return proxy(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return proxy(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return proxy(req, (await params).path);
}
