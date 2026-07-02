"use client";

import { useEffect, useState } from "react";
import {
  fetchHomeData,
  fetchSiteSettings,
  settingsToMap,
  SITE_DEFAULTS,
  type HomeData,
} from "@/src/lib/api";

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        setLoading(true);
        const nextData = await fetchHomeData();

        if (!cancelled) {
          setData(nextData);
          setError(null);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Gagal mengambil data API",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

/* Mengambil konten situs yang bisa diedit admin (nomor telepon, teks hero,
   Tentang Kami, dll). Selalu mengembalikan map lengkap karena di-merge dengan
   SITE_DEFAULTS, jadi komponen tidak pernah mendapat nilai undefined. */
export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({
    ...SITE_DEFAULTS,
  });

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings()
      .then((list) => {
        if (!cancelled) setSettings(settingsToMap(list));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return settings;
}
