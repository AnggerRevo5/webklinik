"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Images } from "lucide-react";
import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";
import { cn } from "@/src/lib/utils";
import { getGaleri, type Gallery } from "@/src/lib/api";

const FILTER_TABS = ["Semua", "Kegiatan", "Layanan", "Fasilitas", "Poli", "Staff"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function HalamanGaleri() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Semua");
  const [photos, setPhotos] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const kategori = activeTab === "Semua" ? undefined : activeTab;
    getGaleri(kategori)
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[#f2f0ed] text-[#3f3f3f]">
      <Navbar />

      {/* ── Hero header ── */}
      <div className="border-b border-[#e5e3e0] bg-white">
        <div className="section-container py-8 sm:py-10">
          <Link
            href="/tentangkami"
            className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#00b4d8] transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Tentang Kami
          </Link>

          <div className="flex items-end justify-between gap-6">
            <div>
              <span className="mb-2 inline-block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00b4d8]">
                Galeri Klinik
              </span>
              <h1 className="t-h2 font-bold text-[#3f3f3f]">
                Semua{" "}
                <span className="italic text-[#00b4d8]">foto</span>{" "}
                klinik
              </h1>
              <p className="mt-2 text-[13px] text-[#888]">
                Dokumentasi kegiatan, fasilitas, layanan, dan tim medis kami
              </p>
            </div>

            {!loading && photos.length > 0 && (
              <div className="hidden shrink-0 text-right sm:block">
                <div className="text-[32px] font-bold leading-none text-[#00b4d8]">
                  {photos.length}
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#b0b0b0]">
                  foto
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky filter tabs ── */}
      <div className="sticky top-16 z-30 border-b border-[#e5e3e0] bg-[#f2f0ed]/95 shadow-sm backdrop-blur-sm lg:top-34">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto py-3">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all duration-200",
                  activeTab === tab
                    ? "bg-[#00b4d8] text-white shadow-sm"
                    : "border border-[#ddd] bg-white text-[#6b7280] hover:border-[#00b4d8]/40 hover:text-[#3f3f3f]",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="section-container py-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "animate-pulse rounded-2xl bg-[#e7e7e7]",
                  i === 0 ? "col-span-2 aspect-video" : "aspect-square",
                )}
              />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-28">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <Images className="h-7 w-7 text-[#c8c8c8]" />
            </div>
            <p className="text-[13px] text-[#9a9a9a]">
              Belum ada foto di kategori ini
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl bg-[#e0dedd] shadow-sm ring-1 ring-black/5",
                    idx % 7 === 0
                      ? "col-span-2 aspect-video"
                      : "aspect-square",
                  )}
                >
                  <Image
                    src={item.url}
                    alt={item.text || item.kategori}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Badge kategori — selalu terlihat */}
                  <div className="absolute left-3 top-3">
                    <span className="inline-block rounded-full bg-black/30 px-2.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                      {item.kategori}
                    </span>
                  </div>

                  {/* Overlay hover dengan judul */}
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/65 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {item.text && (
                      <p className="line-clamp-2 px-3 pb-3 text-[11px] font-medium leading-snug text-white">
                        {item.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-[11px] text-[#aaa]">
              Menampilkan {photos.length} foto
              {activeTab !== "Semua" && (
                <>
                  {" "}dalam kategori{" "}
                  <span className="font-semibold text-[#3f3f3f]">{activeTab}</span>
                </>
              )}
            </p>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
