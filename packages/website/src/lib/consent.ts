// Utilitas consent cookie/analitik — dipakai oleh CookieConsent, SiteAnimations
// (gerbang tracking), dan halaman kebijakan privasi (tombol ubah preferensi).
// Semua fungsi guard SSR dengan pengecekan typeof window.
//
// Catatan: lokasi GPS presisi SENGAJA tidak dikumpulkan di situs publik —
// kota/provinsi dari IP (lihat services.EnrichIP di backend) sudah cukup
// untuk analitik agregat. GPS hanya masuk akal untuk kasus keamanan spesifik
// (mis. deteksi lokasi login admin), bukan untuk pengunjung umum.

export type ConsentState = {
  analytics: boolean;
  timestamp: string;
};

export const CONSENT_KEY = "kri_consent";
const REOPEN_EVENT = "kri:open-cookie-settings";
const CONSENT_CHANGED_EVENT = "kri:consent-changed";

export function loadConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function saveConsent(consent: ConsentState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: consent }));
}

export function onConsentChanged(cb: (consent: ConsentState) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<ConsentState>).detail);
  window.addEventListener(CONSENT_CHANGED_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handler);
}

/** Dipanggil dari halaman kebijakan privasi untuk membuka lagi modal preferensi cookie. */
export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(REOPEN_EVENT));
}

export function onOpenCookieSettings(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(REOPEN_EVENT, cb);
  return () => window.removeEventListener(REOPEN_EVENT, cb);
}
