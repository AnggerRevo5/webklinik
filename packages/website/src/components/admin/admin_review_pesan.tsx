"use client";

import { Eye, Mail, RefreshCw, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHomeData } from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type ReviewTab = "review" | "ringkasan" | "ditampilkan" | "disembunyikan";

export default function AdminReviewPesan() {
  const { data } = useHomeData();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ReviewTab>("review");
  const reviews = data?.google_reviews ?? [];
  const googleSummary = reviews[0] ?? null;
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.average_rating ?? 0),
            0,
          ) / reviews.length
        ).toFixed(1)
      : "0.0";
  const totalReviews = reviews.reduce(
    (total, review) => total + Number(review.review_count ?? 0),
    0,
  );
  const activeReviewCount = reviews.length;
  const hiddenReviewCount = 0;
  const tabItems: Array<{ key: ReviewTab; label: string; badge?: string }> = [
    { key: "review", label: "Google Review" },
    { key: "ringkasan", label: "Ringkasan" },
    {
      key: "ditampilkan",
      label: "Ditampilkan",
      badge: String(activeReviewCount),
    },
    {
      key: "disembunyikan",
      label: "Disembunyikan",
      badge: String(hiddenReviewCount),
    },
  ];
  const tabButtonClass =
    "rounded-md px-3 py-1 text-[10px] font-medium transition-all duration-200 ease-out motion-reduce:transition-none";

  function openGoogleMaps() {
    if (typeof window === "undefined") return;
    window.open("https://maps.google.com", "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">
        Halaman admin review testimoni dan pesan masuk KRI AMC
      </h2>
      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="review" />
        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <div className="text-[15px] font-semibold text-slate-900">
                  Review & Pesan
                </div>
                <div className="text-[9px] text-slate-500">
                  Rating Google tersedia, daftar pesan belum punya tabel di
                  schema
                </div>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-0.5">
                {tabItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`${tabButtonClass} ${activeTab === item.key ? "bg-white text-sky-600 shadow-sm scale-[1.02]" : "text-slate-400 hover:bg-white/70 hover:text-slate-600"}`}
                    aria-pressed={activeTab === item.key}
                  >
                    {item.key === "review" ? (
                      <Star className="mr-1 inline h-3 w-3" />
                    ) : (
                      <Mail className="mr-1 inline h-3 w-3" />
                    )}
                    {item.label}
                    {item.badge ? (
                      <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[7px] text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex items-center gap-1 text-[10px] text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-slate-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync Google
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none">
              <div className="grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
                <div className="text-center">
                  <div className="text-[36px] font-bold leading-none text-slate-900">
                    {googleSummary
                      ? googleSummary.average_rating.toFixed(1)
                      : "0.0"}
                  </div>
                  <div className="my-1 flex justify-center gap-1 text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {googleSummary
                      ? `${googleSummary.review_count} ulasan Google`
                      : "Belum ada ringkasan review"}
                  </div>
                </div>
                <div className="space-y-1 text-[9px] text-slate-500">
                  {[
                    ["5", "20", "85%"],
                    ["4", "2", "10%"],
                    ["3", "1", "3%"],
                    ["2", "0", "0%"],
                    ["1", "0", "0%"],
                  ].map(([score, count, width]) => (
                    <div key={score} className="flex items-center gap-2">
                      <span className="w-3 text-right">{score}</span>
                      <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width }}
                        />
                      </div>
                      <span className="w-4 text-right">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-2 text-[9px] font-medium text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                  >
                    <Eye className="h-3 w-3" />
                    Buka Google Maps
                  </button>
                  <button
                    type="button"
                    onClick={() => router.refresh()}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-[9px] font-medium text-emerald-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-100"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Sync ulasan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("ditampilkan")}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-[9px] font-medium text-amber-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-100"
                  >
                    <Star className="h-3 w-3" />
                    {activeReviewCount} featured aktif
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2 text-[9px] font-medium">
              {tabItems.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full border px-3 py-1.5 transition-all duration-200 ease-out motion-reduce:transition-none ${activeTab === tab.key ? "border-sky-600 bg-sky-600 text-white shadow-sm scale-[1.02]" : "border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:text-slate-700"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "ringkasan" ? (
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none">
                  <div className="text-[8px] text-slate-400">
                    Rata-rata rating
                  </div>
                  <div className="mt-1 text-[28px] font-bold text-slate-900">
                    {averageRating}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    berdasarkan {reviews.length} snapshot
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none">
                  <div className="text-[8px] text-slate-400">
                    Total review tercatat
                  </div>
                  <div className="mt-1 text-[28px] font-bold text-slate-900">
                    {totalReviews}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    di seluruh snapshot Google
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none">
                  <div className="text-[8px] text-slate-400">Status pesan</div>
                  <div className="mt-1 text-[28px] font-bold text-slate-900">
                    0
                  </div>
                  <div className="text-[9px] text-slate-500">
                    belum ada tabel pesan masuk
                  </div>
                </div>
              </div>
            ) : activeTab === "disembunyikan" ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none">
                Tidak ada kolom visibilitas di schema, jadi review yang
                disembunyikan belum bisa dipisah dari database.
              </div>
            ) : (
              <div className="space-y-3 transition-all duration-300 ease-out motion-reduce:transition-none">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-[11px] font-semibold text-white">
                          G
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-slate-900">
                            Review ID {review.id}
                          </div>
                          <div className="text-[8px] text-slate-400">
                            {review.recorded_at}
                          </div>
                        </div>
                        <div className="ml-auto flex gap-0.5 text-amber-400">
                          {Array.from({
                            length: Math.max(
                              1,
                              Math.min(5, Math.round(review.average_rating)),
                            ),
                          }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className="h-3 w-3 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] leading-6 text-slate-600">
                        {review.review_count} review tercatat pada snapshot ini.
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-600">
                          Terkini
                        </span>
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-[8px] font-semibold text-amber-700">
                          Rating {review.average_rating.toFixed(1)}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-[10px] text-slate-500 shadow-sm">
                    Belum ada ringkasan review Google di database.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
