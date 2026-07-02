import { NextRequest, NextResponse } from "next/server";

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

async function proxy(
  req: NextRequest,
  pathParts: string[],
): Promise<NextResponse> {
  const path = pathParts.join("/");
  const search = req.nextUrl.search;
  const targetUrl = `${GO_BACKEND}/api/${path}${search}`;

  // Gerbang autentikasi: request mutasi (selain path publik) wajib membawa
  // cookie sesi admin yang valid. Tanpa ini, proxy akan menyuntikkan
  // ADMIN_API_KEY untuk siapa pun → bypass auth backend.
  const method = req.method;
  const isRead = method === "GET" || method === "HEAD" || method === "OPTIONS";
  if (!isRead && !isPublicMutation(path)) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    const expected = process.env.ADMIN_SESSION_TOKEN;
    if (!expected || !session || session !== expected) {
      return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
    }
  }

  const forwardHeaders: Record<string, string> = {};
  const contentType = req.headers.get("content-type");
  if (contentType) forwardHeaders["content-type"] = contentType;
  if (ADMIN_API_KEY) forwardHeaders["x-admin-key"] = ADMIN_API_KEY;

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
