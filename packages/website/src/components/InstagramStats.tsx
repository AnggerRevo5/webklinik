"use client";

import { Heart, MessageCircle, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getInstagramStats, type InstagramStatsData } from "@/src/lib/api";
import { cn } from "@/src/lib/utils";

/** Format angka ringkas ala Instagram: 1234 → "1.2K", 12000000 → "12M". */
function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function formatUpdatedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Widget ringkas statistik Instagram klinik (cache dari RapidAPI, refresh berkala). */
export default function InstagramStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<InstagramStatsData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getInstagramStats().then((data) => {
      if (active) {
        setStats(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className={cn("h-24 w-full animate-pulse rounded-2xl bg-[#f7f5f2]", className)} />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-linear-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] p-[1.5px]",
        className,
      )}
    >
      <div className="rounded-2xl bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f4f4f4]">
            <Image src="/assets/icons/instagram.svg" alt="Instagram" width={18} height={18} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#3f3f3f]">
              @{stats.username || "instagram"}
            </p>
            <p className="text-[10px] text-[#9a9a9a]">{stats.full_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-[#faf9f7] p-2">
            <div className="flex items-center justify-center gap-1 text-[#d62976]">
              <Users className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-[15px] font-bold text-[#3f3f3f]">
              {formatCompactNumber(stats.followers)}
            </p>
            <p className="text-[9px] text-[#9a9a9a]">Followers</p>
          </div>
          <div className="rounded-xl bg-[#faf9f7] p-2">
            <div className="flex items-center justify-center gap-1 text-[#d62976]">
              <Heart className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-[15px] font-bold text-[#3f3f3f]">
              {stats.engagement_rate.toFixed(2)}%
            </p>
            <p className="text-[9px] text-[#9a9a9a]">Engagement</p>
          </div>
          <div className="rounded-xl bg-[#faf9f7] p-2">
            <div className="flex items-center justify-center gap-1 text-[#d62976]">
              <MessageCircle className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-[15px] font-bold text-[#3f3f3f]">
              {formatCompactNumber(stats.avg_likes)}
            </p>
            <p className="text-[9px] text-[#9a9a9a]">Avg. Likes</p>
          </div>
        </div>

        <p className="mt-3 text-center text-[9px] text-[#bbb]">
          Terakhir diperbarui: {formatUpdatedAt(stats.updated_at)}
        </p>
      </div>
    </div>
  );
}
