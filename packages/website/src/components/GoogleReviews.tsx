"use client";

import { ChevronLeft, ChevronRight, MessageSquareQuote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getGoogleReviews, type GoogleReviewItem, type MediaPagination } from "@/src/lib/api";
import { Card, CardContent } from "@/src/UiKecil/card";
import { cn } from "@/src/lib/utils";

const PER_PAGE = 6;

/**
 * Daftar ulasan Google asli (cache dari RapidAPI Local Business Data) —
 * berbeda dari testimoni klinik yang dikurasi manual admin (komponen Review).
 * Dipaginasi supaya jumlah card yang dirender sekaligus terbatas (halaman
 * publik sempat sulit di-scroll sampai footer saat semua ulasan tampil sekaligus).
 */
export default function GoogleReviews({ className }: { className?: string }) {
  const [reviews, setReviews] = useState<GoogleReviewItem[]>([]);
  const [pagination, setPagination] = useState<MediaPagination>({
    page: 1,
    per_page: PER_PAGE,
    total: 0,
    total_pages: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getGoogleReviews(page, PER_PAGE).then((result) => {
      if (active) {
        setReviews(result.data);
        setPagination(result.pagination);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [page]);

  if (loading) {
    return (
      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-radius h-40 animate-pulse bg-[#f7f5f2] shadow-sm" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
        {reviews.map((review) => (
          <Card key={review.id} className="card-radius h-full border-0 bg-white shadow-sm">
            <CardContent className="card-base flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="t-body-sm font-semibold text-[#3f3f3f]">
                  {review.reviewer_name || "Pengguna Google"}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < review.rating
                          ? "fill-[#ff8c00] text-[#ff8c00]"
                          : "fill-[#e5e5e5] text-[#e5e5e5]",
                      )}
                    />
                  ))}
                </div>
              </div>
              {review.review_date && (
                <span className="t-caption text-[#9a9a9a]">{review.review_date}</span>
              )}
              <p className="line-clamp-4 t-body-sm leading-relaxed text-[#5a5a5a]">
                {review.review_text}
              </p>
              {review.owner_reply && (
                <div className="mt-1 flex gap-2 rounded-xl bg-[#f2f6fb] p-3">
                  <MessageSquareQuote className="h-4 w-4 shrink-0 text-[#1a5fa0]" />
                  <p className="t-caption leading-relaxed text-[#4a5a6a]">
                    {review.owner_reply}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination.total_pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e0d8] bg-white text-[#5a5a5a] transition-colors disabled:opacity-40 hover:enabled:bg-[#f7f5f2]"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="t-caption text-[#9a9a9a]">
            Halaman {pagination.page} dari {pagination.total_pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
            disabled={page === pagination.total_pages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5e0d8] bg-white text-[#5a5a5a] transition-colors disabled:opacity-40 hover:enabled:bg-[#f7f5f2]"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
