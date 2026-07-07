/** @type {import('next').NextConfig} */

// Origin backend Go untuk connect-src CSP, diturunkan dari NEXT_PUBLIC_API_URL.
// tracking.ts memanggil backend langsung dari browser, jadi origin-nya harus
// diizinkan di connect-src agar tracking tidak diblokir CSP.
function backendOrigin() {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL || "").origin;
  } catch {
    return "";
  }
}

// CSP pragmatis:
// - script-src 'unsafe-inline' 'unsafe-eval' WAJIB untuk hydration Next.js & HMR dev.
//   Karena itu CSP di sini bersifat defense-in-depth (batasi sumber eksternal,
//   object, base-uri, framing); penangkal XSS konten artikel ada di sanitasi
//   server-side (bluemonday), bukan di CSP ini.
// - style-src 'unsafe-inline' untuk style inline dari GSAP & Tailwind.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  "frame-src https://www.google.com",
  `connect-src 'self'${backendOrigin() ? " " + backendOrigin() : ""}`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  experimental: {
    optimizePackageImports: ["@radix-ui/react-*"],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 3,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
