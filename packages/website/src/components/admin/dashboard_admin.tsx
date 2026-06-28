"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarDays,
  ClipboardList,
  Download,
  Eye,
  HeartPlus,
  Image as ImageIcon,
  MapPin,
  MousePointerClick,
  Star,
  Tag,
  Stethoscope,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useHomeData } from "@/src/lib/hooks";
import { getDokterPublik } from "@/src/lib/api";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";
import { CountUp } from "@/src/components/motion";

type DashboardTab = "overview" | "analytics";

/* ───────────────────────── Helpers ───────────────────────── */

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

/* Spark bar mini di kartu metrik */
function MetricSpark({
  bars,
  colorClass,
}: {
  bars?: number[];
  colorClass: string;
}) {
  if (!bars || bars.length === 0) return null;
  return (
    <div className="mt-3 flex h-6 items-end gap-[2px]">
      {bars.map((height, index) => (
        <div
          key={`${height}-${index}`}
          className={`w-full rounded-[2px] transition-all duration-500 ${index < bars.length - 2 ? "bg-slate-200" : colorClass}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

type ChartPoint = {
  label: string;
  value: number;
  color: string;
};

/* Bar chart vertikal */
function VerticalBarChart({
  data,
  label,
  icon: Icon,
}: {
  data: ChartPoint[];
  label: string;
  icon: LucideIcon;
}) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[11px] text-slate-500">
        Data chart tidak tersedia untuk saat ini.
      </div>
    );
  }
  const maxValue = Math.max(...data.map((point) => point.value), 1);
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-slate-900">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </div>
      <div className="flex h-40 items-end gap-3 px-1">
        {data.map((point) => {
          const height = Math.max((point.value / maxValue) * 100, 6);
          return (
            <div key={point.label} className="flex-1 text-center">
              <div className="relative mx-auto flex h-full w-full flex-col justify-end overflow-hidden rounded-xl bg-slate-50 p-1">
                <div
                  className={`mx-auto w-full rounded-lg ${point.color} transition-[height] duration-700 ease-out`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <div className="mt-2 truncate text-[10px] font-medium text-slate-600">
                {point.label}
              </div>
              <div className="text-[10px] font-semibold text-slate-900">
                {formatNumber(point.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Baris distribusi horizontal dengan progress bar */
function DistributionRow({
  label,
  value,
  max,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: LucideIcon;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-28 shrink-0 items-center gap-2 text-[11px] font-medium text-slate-600">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        {label}
      </div>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color} transition-[width] duration-700 ease-out`}
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
      <div className="w-8 shrink-0 text-right text-[12px] font-bold text-slate-900">
        {value}
      </div>
    </div>
  );
}

/* Tile statistik kecil */
function StatTile({
  label,
  value,
  sub,
  accent,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accent}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2 text-[20px] font-bold leading-none text-slate-900">
        {value}
      </div>
      {sub ? <div className="mt-1 text-[10px] text-slate-400">{sub}</div> : null}
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function DashboardAdmin() {
  const { data, loading } = useHomeData();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const isLoading = loading && data == null;

  // Jumlah dokter aktif diambil langsung dari section dokter (dokter publik / tampil di website)
  const [activeDoctorCount, setActiveDoctorCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    getDokterPublik().then((list) => {
      if (alive) setActiveDoctorCount(list.length);
    });
    return () => {
      alive = false;
    };
  }, []);

  /* ── Derivasi data ── */
  const visitorSessions = (data?.visitor_sessions ?? []) as Array<{
    pages_visited?: number;
    duration_second?: number;
  }>;
  const socialMediaStats = (data?.social_media_stats ?? []) as Array<{
    platform?: string;
    follower_count?: number;
    engagement_rate?: number;
  }>;
  const events = (data?.event ?? []) as Array<{ event_type?: string }>;

  const totalVisitorPages = visitorSessions.reduce(
    (total, session) => total + Number(session.pages_visited ?? 0),
    0,
  );
  const totalSessionDuration = visitorSessions.reduce(
    (total, session) => total + Number(session.duration_second ?? 0),
    0,
  );
  const averageSessionMinutes =
    visitorSessions.length > 0
      ? (totalSessionDuration / visitorSessions.length / 60).toFixed(1)
      : "0.0";
  const averagePagesPerSession =
    visitorSessions.length > 0
      ? (totalVisitorPages / visitorSessions.length).toFixed(1)
      : "0.0";
  const totalFollowers = socialMediaStats.reduce(
    (total, item) => total + Number(item.follower_count ?? 0),
    0,
  );
  const averageEngagementRate =
    socialMediaStats.length > 0
      ? (
          socialMediaStats.reduce(
            (total, item) => total + Number(item.engagement_rate ?? 0),
            0,
          ) / socialMediaStats.length
        ).toFixed(2)
      : "0.00";
  const latestReviewCount = data?.google_reviews?.[0]?.review_count ?? 0;
  const latestRating = data?.google_reviews?.[0]?.average_rating ?? 0;
  const topPlatform =
    [...socialMediaStats].sort(
      (left, right) =>
        Number(right.follower_count ?? 0) - Number(left.follower_count ?? 0),
    )[0]?.platform ?? "-";

  const socialMediaEngagementCount = data?.social_media_engagement?.length ?? 0;
  const socialMediaStatsCount = data?.social_media_stats?.length ?? 0;
  const gbpInteractionCount = data?.gbp_interactions?.length ?? 0;
  const googleReviewCount = data?.google_reviews?.length ?? 0;
  const googleReviews = (data?.google_reviews ?? []) as Array<{
    average_rating?: number;
  }>;
  const averageGoogleRating =
    googleReviewCount > 0
      ? (
          googleReviews.reduce(
            (total, review) => total + Number(review.average_rating ?? 0),
            0,
          ) / googleReviewCount
        ).toFixed(2)
      : "0.00";

  /* Hitungan konten (data paling andal) */
  const contentCounts = {
    banner: data?.banner?.length ?? 0,
    layanan: data?.layanan?.length ?? 0,
    // Dokter aktif diambil dari section dokter (dokter publik); fallback ke data home
    dokter: activeDoctorCount ?? data?.dokter?.length ?? 0,
    promo: data?.promo?.length ?? 0,
    galeri: data?.galeri?.length ?? 0,
  };
  const totalContent =
    contentCounts.banner +
    contentCounts.layanan +
    contentCounts.dokter +
    contentCounts.promo +
    contentCounts.galeri;

  const contentDistribution = [
    { label: "Banner", value: contentCounts.banner, color: "bg-sky-500", icon: Eye },
    { label: "Layanan", value: contentCounts.layanan, color: "bg-emerald-500", icon: HeartPlus },
    { label: "Dokter", value: contentCounts.dokter, color: "bg-amber-500", icon: Users },
    { label: "Promo", value: contentCounts.promo, color: "bg-violet-500", icon: Tag },
    { label: "Galeri", value: contentCounts.galeri, color: "bg-rose-500", icon: ImageIcon },
  ];
  const contentMax = Math.max(...contentDistribution.map((c) => c.value), 1);

  const socialPlatformData = socialMediaStats
    .filter((item) => typeof item.platform === "string")
    .map((item) => ({
      label: String(item.platform),
      value: Number(item.follower_count ?? 0),
      color: "bg-sky-500",
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const sessionChartData = visitorSessions.slice(-6).map((session, index) => ({
    label: `S${index + 1}`,
    value: Number(session.pages_visited ?? 0),
    color: "bg-emerald-500",
  }));

  /* ── KPI utama (overview hero) ── */
  const heroKpis = [
    {
      label: "Total Konten",
      value: totalContent,
      sub: "banner, layanan, dokter, promo, galeri",
      icon: ClipboardList,
      ring: "from-sky-500 to-cyan-400",
    },
    {
      label: "Sesi Pengunjung",
      value: visitorSessions.length,
      sub: `${averagePagesPerSession} halaman / sesi`,
      icon: Users,
      ring: "from-emerald-500 to-teal-400",
    },
    {
      label: "Rating Google",
      value: Number(latestRating.toFixed(1)),
      decimals: 1,
      sub: `${latestReviewCount} ulasan`,
      icon: Star,
      ring: "from-amber-500 to-orange-400",
    },
    {
      label: "Total Followers",
      value: totalFollowers,
      sub: topPlatform !== "-" ? `Top: ${topPlatform}` : "Sosial media",
      icon: TrendingUp,
      ring: "from-violet-500 to-fuchsia-400",
    },
  ];

  const metrics = [
    {
      title: "Banner aktif",
      value: String(contentCounts.banner),
      trend: contentCounts.banner ? "Sinkron" : "Kosong",
      icon: Eye,
      iconClassName: "text-sky-600",
      containerClassName: "bg-sky-50 text-sky-600",
      bars: [40, 55, 45, 70, 60, 85, 90],
      barClassName: "bg-sky-600",
    },
    {
      title: "Layanan",
      value: String(contentCounts.layanan),
      trend: contentCounts.layanan ? "Aktif" : "Kosong",
      icon: HeartPlus,
      iconClassName: "text-emerald-500",
      containerClassName: "bg-emerald-50 text-emerald-500",
      bars: [30, 45, 50, 40, 65, 70, 80],
      barClassName: "bg-emerald-500",
    },
    {
      title: "Dokter aktif",
      value: String(contentCounts.dokter),
      trend: contentCounts.dokter ? "Aktif" : "Kosong",
      icon: Users,
      iconClassName: "text-amber-600",
      containerClassName: "bg-amber-50 text-amber-600",
      bars: [25, 35, 50, 45, 60, 75, 90],
      barClassName: "bg-amber-600",
    },
    {
      title: "Promo",
      value: String(contentCounts.promo),
      trend: contentCounts.promo ? "Tersedia" : "Kosong",
      icon: Tag,
      iconClassName: "text-violet-600",
      containerClassName: "bg-violet-50 text-violet-600",
      bars: [22, 30, 42, 38, 56, 68, 74],
      barClassName: "bg-violet-600",
    },
    {
      title: "Galeri",
      value: String(contentCounts.galeri),
      trend: contentCounts.galeri ? "Tersedia" : "Kosong",
      icon: ImageIcon,
      iconClassName: "text-rose-600",
      containerClassName: "bg-rose-50 text-rose-600",
      bars: [20, 36, 44, 52, 60, 72, 84],
      barClassName: "bg-rose-600",
    },
  ];

  const socialCards = [
    {
      name: "Engagement",
      followers: String(socialMediaEngagementCount),
      delta: `${(data?.social_media_engagement?.[0] as { likes_count?: number } | undefined)?.likes_count ?? 0} like`,
      clicks: `${(data?.social_media_engagement?.[0] as { comments_count?: number } | undefined)?.comments_count ?? 0} komentar`,
      icon: Users,
      iconClassName: "text-pink-600",
      iconWrapClassName: "bg-pink-50 text-pink-600",
    },
    {
      name: "Statistik",
      followers: String(socialMediaStatsCount),
      delta: `${averageGoogleRating} rating`,
      clicks: "Ringkasan performa",
      icon: Star,
      iconClassName: "text-blue-600",
      iconWrapClassName: "bg-blue-50 text-blue-600",
    },
    {
      name: "GBP",
      followers: String(gbpInteractionCount),
      delta: `${(data?.gbp_interactions?.[0] as { count?: number } | undefined)?.count ?? 0} klik`,
      clicks: "Interaksi Google Business",
      icon: MapPin,
      iconClassName: "text-slate-900",
      iconWrapClassName: "bg-zinc-100 text-slate-900",
    },
    {
      name: "Review",
      followers: String(googleReviewCount),
      delta: `${averageGoogleRating}/5`,
      clicks: "Ulasan Google",
      icon: Star,
      iconClassName: "text-sky-600",
      iconWrapClassName: "bg-sky-50 text-sky-600",
    },
  ];

  /* ── Statistik untuk tab analytics ── */
  const statTiles = [
    { label: "Total Konten", value: formatNumber(totalContent), sub: "item dipublikasi", accent: "bg-sky-50 text-sky-600", icon: ClipboardList },
    { label: "Sesi Pengunjung", value: formatNumber(visitorSessions.length), sub: "sesi tercatat", accent: "bg-emerald-50 text-emerald-600", icon: Users },
    { label: "Halaman Dilihat", value: formatNumber(totalVisitorPages), sub: `${averagePagesPerSession} / sesi`, accent: "bg-rose-50 text-rose-600", icon: Eye },
    { label: "Durasi Rata-rata", value: `${averageSessionMinutes}m`, sub: "per sesi", accent: "bg-amber-50 text-amber-600", icon: CalendarDays },
    { label: "Total Followers", value: formatNumber(totalFollowers), sub: `${socialMediaStatsCount} platform`, accent: "bg-violet-50 text-violet-600", icon: TrendingUp },
    { label: "Engagement", value: `${averageEngagementRate}%`, sub: "rata-rata", accent: "bg-pink-50 text-pink-600", icon: Activity },
    { label: "Rating Google", value: `${averageGoogleRating}`, sub: `${googleReviewCount} snapshot`, accent: "bg-blue-50 text-blue-600", icon: Star },
    { label: "Event Tercatat", value: formatNumber(events.length), sub: "interaksi", accent: "bg-cyan-50 text-cyan-600", icon: MousePointerClick },
  ];

  /* Tabel ringkasan statistik */
  const statTable = [
    { metric: "Total konten website", value: formatNumber(totalContent), note: "semua kategori" },
    { metric: "Sesi pengunjung", value: formatNumber(visitorSessions.length), note: `${averagePagesPerSession} halaman/sesi` },
    { metric: "Total halaman dilihat", value: formatNumber(totalVisitorPages), note: "akumulasi" },
    { metric: "Durasi rata-rata sesi", value: `${averageSessionMinutes} menit`, note: "engagement waktu" },
    { metric: "Total followers sosial", value: formatNumber(totalFollowers), note: `${socialMediaStatsCount} platform` },
    { metric: "Engagement rate", value: `${averageEngagementRate}%`, note: "rata-rata platform" },
    { metric: "Rating Google", value: `${averageGoogleRating} / 5`, note: `${googleReviewCount} snapshot` },
    { metric: "Interaksi GBP", value: formatNumber(gbpInteractionCount), note: "Google Business" },
    { metric: "Event terdeteksi", value: formatNumber(events.length), note: "tracking" },
  ];

  const tabItems: Array<{
    key: DashboardTab;
    label: string;
    description: string;
  }> = [
    { key: "overview", label: "Overview", description: "ringkasan data utama" },
    { key: "analytics", label: "Analytics", description: "statistik dan insight" },
  ];
  const tabButtonClass =
    "rounded-md px-3 py-1 text-[11px] font-medium transition-all duration-200 ease-out motion-reduce:transition-none";

  function downloadCsv() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Unduh ringkasan statistik dashboard dalam format CSV?")
    ) {
      return;
    }

    const rows: string[][] = [
      ["kind", "label", "value", "details"],
      ["metric", "Banner aktif", String(contentCounts.banner), contentCounts.banner ? "Sinkron" : "Kosong"],
      ["metric", "Layanan", String(contentCounts.layanan), contentCounts.layanan ? "Aktif" : "Kosong"],
      ["metric", "Dokter", String(contentCounts.dokter), contentCounts.dokter ? "Tersedia" : "Kosong"],
      ["metric", "Promo", String(contentCounts.promo), contentCounts.promo ? "Tersedia" : "Kosong"],
      ["metric", "Galeri", String(contentCounts.galeri), contentCounts.galeri ? "Tersedia" : "Kosong"],
      ["separator", "", "", ""],
      ...statTable.map((row) => ["statistic", row.metric, row.value, row.note]),
    ];

    const csv = rows
      .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `webklinik-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 p-0">
      <h2 className="sr-only">
        Dashboard admin dengan overview dan analytics untuk KRI AMC
      </h2>

      <div className="grid min-h-dvh w-full grid-cols-1 gap-4 overflow-hidden bg-[#F0F4FA] shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
        <SidebarAdmin activeKey="dashboard" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-[15px] font-semibold text-slate-900">Dashboard</div>
                <div className="text-[10px] text-slate-400">Ringkasan data dan analitik KRI AMC</div>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-0.5">
                {tabItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`${tabButtonClass} ${activeTab === item.key ? "bg-white text-sky-600 shadow-sm" : "text-slate-400 hover:bg-white/70 hover:text-slate-600"}`}
                    title={item.description}
                    aria-pressed={activeTab === item.key}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-medium text-slate-600">
                <CalendarDays className="h-3 w-3" />
                30 hari terakhir
              </span>
              <button
                type="button"
                onClick={downloadCsv}
                className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-medium text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100 hover:shadow-sm"
              >
                <Download className="h-3 w-3" />
                Export CSV
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 lg:p-5">
            {/* ════════════ OVERVIEW ════════════ */}
            {activeTab === "overview" ? (
              <div className="space-y-4">
                {/* Hero KPI */}
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-[104px] animate-pulse rounded-2xl bg-white shadow-sm" />
                      ))
                    : heroKpis.map((kpi) => {
                        const Icon = kpi.icon;
                        return (
                          <article
                            key={kpi.label}
                            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className={`pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${kpi.ring} opacity-10 blur-xl`} />
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {kpi.label}
                              </span>
                              <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.ring} text-white shadow-sm`}>
                                <Icon className="h-4.5 w-4.5" />
                              </span>
                            </div>
                            <div className="mt-3 text-[30px] font-bold leading-none text-slate-900">
                              <CountUp to={kpi.value} decimals={kpi.decimals ?? 0} />
                            </div>
                            <div className="mt-1.5 truncate text-[10px] text-slate-400">{kpi.sub}</div>
                          </article>
                        );
                      })}
                </section>

                {/* Kartu metrik konten */}
                <section>
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-700">
                    <ClipboardList className="h-3.5 w-3.5 text-sky-500" />
                    Konten website
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
                    {isLoading
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <article key={index} className="h-[120px] animate-pulse rounded-xl bg-white shadow-sm" />
                        ))
                      : metrics.map((metric) => {
                          const Icon = metric.icon;
                          return (
                            <article
                              key={metric.title}
                              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${metric.containerClassName}`}>
                                  <Icon className={`h-4 w-4 ${metric.iconClassName}`} />
                                </div>
                                {metric.trend ? (
                                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600">
                                    {metric.trend}
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-[22px] font-bold leading-none text-slate-900">
                                {metric.value}
                              </div>
                              <div className="mt-1.5 text-[10px] font-medium text-slate-500">
                                {metric.title}
                              </div>
                              <MetricSpark bars={metric.bars} colorClass={metric.barClassName ?? "bg-slate-300"} />
                            </article>
                          );
                        })}
                  </div>
                </section>

                {/* Kanal & sosial */}
                <section>
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-700">
                    <Activity className="h-3.5 w-3.5 text-sky-500" />
                    Kanal & sosial media
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {isLoading
                      ? Array.from({ length: 4 }).map((_, index) => (
                          <article key={index} className="h-[132px] animate-pulse rounded-xl bg-white shadow-sm" />
                        ))
                      : socialCards.map((card) => {
                          const Icon = card.icon;
                          return (
                            <article
                              key={card.name}
                              className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    {card.name}
                                  </div>
                                  <div className={`flex h-9 w-9 items-center justify-center rounded-2xl ${card.iconWrapClassName}`}>
                                    <Icon className={`h-4 w-4 ${card.iconClassName}`} />
                                  </div>
                                </div>
                                <div className="mt-4 text-2xl font-semibold text-slate-900">
                                  {card.followers}
                                </div>
                                <div className="mt-1 text-sm text-slate-500">{card.delta}</div>
                              </div>
                              <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-sky-600">
                                <TrendingUp className="h-3 w-3" />
                                <span>{card.clicks}</span>
                              </div>
                            </article>
                          );
                        })}
                  </div>
                </section>

                {/* Aksi cepat */}
                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-sky-500" />
                    <span className="text-[13px] font-semibold text-slate-900">Aksi Cepat</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      { label: "Kelola Layanan", href: "/admin_layanan_crud", icon: ClipboardList },
                      { label: "Kelola Promo", href: "/admin_promo_page", icon: Tag },
                      { label: "Kelola Dokter", href: "/dokter_jadwal_admin", icon: Stethoscope },
                      { label: "Lihat Website", href: "/", icon: Eye },
                    ].map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <a
                          key={action.label}
                          href={action.href}
                          className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-sky-100">
                            <ActionIcon className="h-4 w-4 text-slate-600 group-hover:text-sky-600" />
                          </div>
                          <span className="text-xs font-medium text-slate-700 group-hover:text-sky-700">{action.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              </div>
            ) : null}

            {/* ════════════ ANALYTICS ════════════ */}
            {activeTab === "analytics" ? (
              <div className="space-y-4">
                {/* Statistik utama */}
                <section>
                  <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-700">
                    <Activity className="h-3.5 w-3.5 text-sky-500" />
                    Data statistik
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                    {isLoading
                      ? Array.from({ length: 8 }).map((_, index) => (
                          <div key={index} className="h-[86px] animate-pulse rounded-xl bg-white shadow-sm" />
                        ))
                      : statTiles.map((tile) => (
                          <StatTile
                            key={tile.label}
                            label={tile.label}
                            value={tile.value}
                            sub={tile.sub}
                            accent={tile.accent}
                            icon={tile.icon}
                          />
                        ))}
                  </div>
                </section>

                {/* Distribusi konten + charts */}
                <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                          <ClipboardList className="h-4 w-4" />
                        </span>
                        Distribusi konten
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {formatNumber(totalContent)} item
                      </span>
                    </div>
                    <div className="space-y-3">
                      {contentDistribution.map((row) => (
                        <DistributionRow
                          key={row.label}
                          label={row.label}
                          value={row.value}
                          max={contentMax}
                          color={row.color}
                          icon={row.icon}
                        />
                      ))}
                    </div>
                  </article>

                  {socialPlatformData.length > 0 ? (
                    <VerticalBarChart data={socialPlatformData} label="Platform sosial teratas" icon={TrendingUp} />
                  ) : (
                    <VerticalBarChart data={sessionChartData} label="Kunjungan sesi terakhir" icon={Users} />
                  )}
                </section>

                {/* GBP + Review tracker */}
                <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                          <MapPin className="h-4 w-4" />
                        </span>
                        Google Business Profile
                      </div>
                      <span className="text-[10px] text-slate-400">30 hari terakhir</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                      {[
                        { label: "Snapshot", num: formatNumber(gbpInteractionCount), color: "text-sky-600", trend: `${gbpInteractionCount} data` },
                        { label: "Halaman", num: formatNumber(totalVisitorPages), color: "text-rose-600", trend: "total" },
                        { label: "Sesi", num: formatNumber(visitorSessions.length), color: "text-emerald-600", trend: `${averageSessionMinutes}m` },
                        { label: "Followers", num: formatNumber(totalFollowers), color: "text-amber-600", trend: topPlatform },
                      ].map((item) => (
                        <div key={item.label} className="rounded-lg bg-slate-50 p-2.5 text-center">
                          <div className={`text-[16px] font-bold leading-none ${item.color}`}>{item.num}</div>
                          <div className="mt-1 text-[10px] text-slate-400">{item.label}</div>
                          <div className="mt-0.5 truncate text-[9px] font-medium text-emerald-600">{item.trend}</div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <Star className="h-4 w-4" />
                      </span>
                      Review tracker
                    </div>
                    <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="rounded-lg bg-slate-50 p-3 text-center">
                        <div className="text-[10px] text-slate-400">Snapshot terakhir</div>
                        <div className="text-[20px] font-bold text-slate-500">{latestReviewCount}</div>
                        <div className="text-[10px] text-slate-400">review</div>
                      </div>
                      <div className="text-lg font-semibold text-emerald-600">→</div>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
                        <div className="text-[10px] text-slate-500">Rata-rata rating</div>
                        <div className="flex items-center justify-center gap-1 text-[20px] font-bold text-amber-600">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          {latestRating.toFixed(1)}
                        </div>
                        <div className="text-[10px] text-amber-600">{socialMediaStatsCount} platform</div>
                      </div>
                    </div>
                  </article>
                </section>

                {/* Tabel statistik */}
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                    <MousePointerClick className="h-4 w-4 text-sky-500" />
                    Ringkasan statistik lengkap
                  </div>
                  <div className="overflow-hidden rounded-lg border border-slate-100">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-400">
                          <th className="px-3 py-2 font-semibold">Metrik</th>
                          <th className="px-3 py-2 text-right font-semibold">Nilai</th>
                          <th className="px-3 py-2 font-semibold">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statTable.map((row, index) => (
                          <tr
                            key={row.metric}
                            className={`text-[11px] ${index % 2 ? "bg-slate-50/40" : "bg-white"}`}
                          >
                            <td className="px-3 py-2 font-medium text-slate-700">{row.metric}</td>
                            <td className="px-3 py-2 text-right font-bold text-slate-900">{row.value}</td>
                            <td className="px-3 py-2 text-slate-400">{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
