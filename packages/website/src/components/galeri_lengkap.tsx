"use client";

import { ChevronLeft, ChevronRight, ImageOff, Images, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";
import { Reveal, ScrollProgress, WordReveal } from "@/src/components/motion";
import { getGaleri, type Gallery } from "@/src/lib/api";
import { cn } from "@/src/lib/utils";

/* Jumlah foto yang ditampilkan per "batch" — sisanya dimuat saat klik
   "Muat lebih banyak" agar halaman tetap ringan dan tidak memuat semua
   gambar sekaligus. */
const PAGE_SIZE = 12;

const ALL = "Semua";

function formatKategori(kategori: string) {
  if (!kategori) return "Lainnya";
  return kategori
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function GaleriLengkap() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<string>(ALL);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getGaleri()
      .then((data) => setItems(data.filter((item) => item.url)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Daftar kategori dibangun dari data — "Semua" + kategori unik. */
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((i) => i.kategori).filter(Boolean)),
    );
    return [ALL, ...unique];
  }, [items]);

  const countByCat = useMemo(() => {
    const map: Record<string, number> = { [ALL]: items.length };
    for (const item of items) {
      map[item.kategori] = (map[item.kategori] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const filtered = useMemo(
    () =>
      activeCat === ALL
        ? items
        : items.filter((i) => i.kategori === activeCat),
    [items, activeCat],
  );

  /* Reset jumlah yang tampil setiap ganti kategori. */
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [activeCat]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  /* ── Kontrol lightbox ── */
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const showPrev = () =>
    setLightboxIndex((i) =>
      i === null ? i : (i - 1 + filtered.length) % filtered.length,
    );
  const showNext = () =>
    setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filtered.length]);

  const activeImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#3f3f3f]">
      <ScrollProgress />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-grid-soft">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="aurora-blob bg-[#00b4d8]/35"
            style={
              {
                top: "-10%",
                left: "-8%",
                width: "40vw",
                height: "40vw",
                ["--orb-dur" as string]: "18s",
              } as React.CSSProperties
            }
          />
          <div
            className="aurora-blob bg-[#e8861e]/20"
            style={
              {
                bottom: "-12%",
                right: "-6%",
                width: "34vw",
                height: "34vw",
                ["--orb-dur" as string]: "22s",
                ["--orb-delay" as string]: "2s",
              } as React.CSSProperties
            }
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f7f5f2]/10 via-[#f7f5f2]/40 to-[#f7f5f2]" />
        </div>

        <div className="section-container pb-8 pt-6 lg:pt-10">
          <Link
            href="/tentangkami#galeri"
            className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#00b4d8] hover:underline"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Kembali ke Tentang Kami
          </Link>

          <Reveal direction="up">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00b4d8]/20 bg-[#00b4d8]/8 px-3 py-1">
              <Images className="h-4 w-4 text-[#00b4d8]" aria-hidden />
              <span className="t-overline text-[#00b4d8]">GALERI</span>
            </div>
          </Reveal>

          <h1 className="t-h1 font-bold leading-[1.14]">
            <WordReveal
              as="span"
              text="Galeri"
              className="text-[#3f3f3f]"
              delay={120}
              step={70}
            />{" "}
            <WordReveal
              as="span"
              text="Klinik"
              wordClassName="text-gradient-brand"
              delay={300}
              step={70}
            />
          </h1>

          <Reveal direction="up" delay={160}>
            <p className="mt-4 max-w-[640px] t-body-lg text-[#52606a]">
              Dokumentasi fasilitas, layanan, kegiatan, dan tim KRI Ampelgading
              Medical Centre. Pilih kategori untuk menelusuri.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Konten galeri ── */}
      <section className="section-wrap pt-0">
        {/* Filter kategori */}
        {!loading && items.length > 0 && (
          <Reveal direction="up">
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = cat === activeCat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCat(cat)}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 t-body-sm font-medium transition-all",
                      isActive
                        ? "border-[#00b4d8] bg-[#00b4d8] text-white shadow-sm shadow-[#00b4d8]/30"
                        : "border-slate-200 bg-white text-[#5f6f7a] hover:border-[#00b4d8]/40 hover:text-[#00b4d8]",
                    )}
                  >
                    {cat === ALL ? cat : formatKategori(cat)}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {countByCat[cat] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <ImageOff className="mb-3 h-8 w-8 text-slate-300" />
            <p className="t-body text-slate-500">Belum ada foto di galeri.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((item, index) => (
                <Reveal
                  key={item.id}
                  direction="up"
                  delay={Math.min(index % PAGE_SIZE, 6) * 60}
                >
                  <button
                    type="button"
                    onClick={() => openLightbox(filtered.indexOf(item))}
                    className="group relative block w-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.text || formatKategori(item.kategori)}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00b4d8] backdrop-blur">
                        {formatKategori(item.kategori)}
                      </span>
                      {item.text ? (
                        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="line-clamp-2 t-body-sm font-medium text-white">
                            {item.text}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>

            {/* Muat lebih banyak */}
            {hasMore && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-[#00b4d8] px-6 py-3 t-body font-semibold text-white shadow-lg shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#00a3c5]"
                >
                  Muat lebih banyak
                </button>
                <span className="t-caption text-slate-400">
                  Menampilkan {shown.length} dari {filtered.length} foto
                </span>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />

      {/* ── Lightbox ── */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Tutup"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Foto berikutnya"
                className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <figure
            className="flex max-h-[88vh] w-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[78vh] w-full">
              <Image
                src={activeImage.url}
                alt={activeImage.text || formatKategori(activeImage.kategori)}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <figcaption className="mt-3 flex flex-col items-center gap-1 text-center">
              <span className="rounded-full bg-[#00b4d8]/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#5fd0e8]">
                {formatKategori(activeImage.kategori)}
              </span>
              {activeImage.text ? (
                <p className="t-body-sm text-white/90">{activeImage.text}</p>
              ) : null}
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
