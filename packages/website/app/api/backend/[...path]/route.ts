import { NextRequest, NextResponse } from "next/server";

// GO_BACKEND_URL = "http://localhost:8080" (tanpa /api)
const GO_BACKEND = (
  process.env.GO_BACKEND_URL ??
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api").replace(/\/api$/, "")
);

const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";

async function proxy(
  req: NextRequest,
  pathParts: string[],
): Promise<NextResponse> {
  const path = pathParts.join("/");
  const search = req.nextUrl.search;
  const targetUrl = `${GO_BACKEND}/api/${path}${search}`;

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
