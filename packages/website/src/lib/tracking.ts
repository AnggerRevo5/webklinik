// Utilitas tracking sesi pengunjung — dipakai di client components saja.
// Semua fungsi guard terhadap SSR dengan pengecekan typeof window.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
const SESSION_KEY = "vsk"; // visitor session key

function detectSource(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source");
    if (utm) return utm;
    const ref = document.referrer;
    if (!ref) return "direct";
    if (ref.includes("google.")) return "google";
    if (ref.includes("instagram.com")) return "instagram";
    if (ref.includes("facebook.com") || ref.includes("fb.com")) return "facebook";
    if (ref.includes("tiktok.com")) return "tiktok";
    if (ref.includes("youtube.com")) return "youtube";
    return "referral";
  } catch {
    return "direct";
  }
}

/** Mulai sesi baru. Idempotent — tidak melakukan apa-apa jika sesi sudah ada di sessionStorage. */
export async function startSession(): Promise<void> {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(SESSION_KEY)) return;

  try {
    const res = await fetch(`${API_BASE}/track/session/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: detectSource() }),
    });
    const data = await res.json();
    if (data.session_id) {
      sessionStorage.setItem(SESSION_KEY, data.session_id);
    }
  } catch { /* silent — jangan rusak pengalaman user kalau tracking gagal */ }
}

/** Catat pageview tambahan (panggil setiap kali route berubah, bukan saat pertama load). */
export function trackPageview(): void {
  if (typeof window === "undefined") return;
  const sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) return;

  fetch(`${API_BASE}/track/session/pageview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  }).catch(() => {});
}

/**
 * Akhiri sesi dan hitung durasi di backend.
 * Pakai navigator.sendBeacon supaya tetap terkirim saat tab sedang ditutup.
 */
export function endSession(): void {
  if (typeof window === "undefined") return;
  const sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) return;

  const url = `${API_BASE}/track/session/end`;
  const payload = JSON.stringify({ session_id: sessionId });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch { /* silent */ }
}

/** Catat klik ikon sosial media. Fire-and-forget — tidak menghambat navigasi ke link. */
export function trackSocialClick(platform: string): void {
  if (typeof window === "undefined") return;
  const sessionId = sessionStorage.getItem(SESSION_KEY) ?? "";

  fetch(`${API_BASE}/track/social-click`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform, session_id: sessionId }),
  }).catch(() => {});
}
