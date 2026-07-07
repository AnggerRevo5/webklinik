"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getGoogleBusiness, type GoogleBusinessInfo } from "@/src/lib/api";
import { cn } from "@/src/lib/utils";

/** Badge ringkas rating + jumlah ulasan dari cache Google Business. */
export default function GoogleRating({ className }: { className?: string }) {
  const [info, setInfo] = useState<GoogleBusinessInfo>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getGoogleBusiness().then((data) => {
      if (active) {
        setInfo(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className={cn("h-16 w-full animate-pulse rounded-xl bg-[#f7f5f2]", className)} />;
  }

  if (!info || info.rating <= 0) {
    return (
      <div className={cn("t-body-sm text-[#9a9a9a]", className)}>
        Belum ada data cache Google Business. Klik &quot;Refresh Data&quot; untuk menarik data terbaru.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="flex items-baseline gap-1">
        <span className="t-h3 font-bold text-[#3f3f3f]">{info.rating.toFixed(1)}</span>
        <span className="t-caption text-[#9a9a9a]">/ 5</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < Math.round(info.rating)
                ? "fill-[#ff8c00] text-[#ff8c00]"
                : "fill-[#e5e5e5] text-[#e5e5e5]",
            )}
          />
        ))}
      </div>
      <span className="t-body-sm text-[#5a5a5a]">{info.review_count} ulasan</span>
      <span className="t-caption text-[#9a9a9a]">
        Diperbarui: {new Date(info.updated_at).toLocaleString("id-ID")}
      </span>
    </div>
  );
}
