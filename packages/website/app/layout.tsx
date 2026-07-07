import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteAnimations from "@/src/hooks/site-animations";
import CookieConsent from "@/src/components/cookie_consent";
import SmoothScroll from "@/src/components/smooth_scroll";

export const metadata: Metadata = {
  title: "Klinik Ampelgading Medical Centre",
  description: "Pelayanan kesehatan terpadu — UGD 24 jam, rawat inap, persalinan, laboratorium, dan apotek. Menerima BPJS dan pasien umum.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll>
          <SiteAnimations />
          {children}
          <CookieConsent />
        </SmoothScroll>
      </body>
    </html>
  );
}
