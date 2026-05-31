"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  HeartPlus,
  Image as ImageIcon,
  MapPin,
  MousePointerClick,
  Search,
  Settings,
  Star,
  Tag,
  Stethoscope,
  Users,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { useHomeData } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type DashboardTab = "overview" | "analytics" | "konten";

type MetricCard = {
  title: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  iconClassName: string;
  containerClassName: string;
  barClassName?: string;
  bars?: number[];
};

type SocialCard = {
  name: string;
  followers: string;
  delta: string;
  clicks: string;
  icon: LucideIcon;
  iconClassName: string;
  iconWrapClassName: string;
};

type ContentCard = {
  title: string;
  date: string;
  status: string;
  statusClassName: string;
  gradient: string;
  icon: LucideIcon;
  iconClassName: string;
  previewPath: string;
  editPath: string;
};

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-sky-500" />
        <div className="text-[11px] font-semibold text-slate-900">{title}</div>
      </div>
      {subtitle ? (
        <div className="text-[8px] text-slate-400">{subtitle}</div>
      ) : null}
    </div>
  );
}

function MetricSpark({
  bars,
  colorClass,
}: {
  bars?: number[];
  colorClass: string;
}) {
  if (!bars || bars.length === 0) return null;

  return (
    <div className="mt-3 flex h-5 items-end gap-[2px]">
      {bars.map((height, index) => (
        <div
          key={`${height}-${index}`}
          className={`w-full rounded-[2px] ${index < bars.length - 2 ? "bg-slate-200" : colorClass}`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function escapeCsvValue(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export default function DashboardAdmin() {
  const { data, loading } = useHomeData();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const isLoading = loading && data == null;

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

  const metrics = [
    {
      title: "Banner aktif",
      value: String(data?.banner?.length ?? 0),
      trend: data?.banner?.length ? "Sinkron" : "Kosong",
      icon: Eye,
      iconClassName: "text-sky-600",
      containerClassName: "bg-sky-50 text-sky-600",
      bars: [40, 55, 45, 70, 60, 85, 90],
      barClassName: "bg-sky-600",
    },
    {
      title: "Layanan",
      value: String(data?.layanan?.length ?? 0),
      trend: data?.layanan?.length ? "Aktif" : "Kosong",
      icon: HeartPlus,
      iconClassName: "text-emerald-500",
      containerClassName: "bg-emerald-50 text-emerald-500",
      bars: [30, 45, 50, 40, 65, 70, 80],
      barClassName: "bg-emerald-500",
    },
    {
      title: "Dokter",
      value: String(data?.dokter?.length ?? 0),
      trend: data?.dokter?.length ? "Tersedia" : "Kosong",
      icon: Users,
      iconClassName: "text-amber-600",
      containerClassName: "bg-amber-50 text-amber-600",
      bars: [25, 35, 50, 45, 60, 75, 90],
      barClassName: "bg-amber-600",
    },
    {
      title: "Promo",
      value: String(data?.promo?.length ?? 0),
      trend: data?.promo?.length ? "Tersedia" : "Kosong",
      icon: Tag,
      iconClassName: "text-violet-600",
      containerClassName: "bg-violet-50 text-violet-600",
      bars: [22, 30, 42, 38, 56, 68, 74],
      barClassName: "bg-violet-600",
    },
    {
      title: "Galeri",
      value: String(data?.galeri?.length ?? 0),
      trend: data?.galeri?.length ? "Tersedia" : "Kosong",
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

  const contentCards = [
    {
      title: data?.banner?.[0]?.url ? "Banner utama" : "Banner belum diisi",
      date: `${data?.banner?.length ?? 0} item`,
      status: data?.banner?.length ? "Aktif" : "Kosong",
      statusClassName: data?.banner?.length
        ? "bg-emerald-50 text-emerald-600"
        : "bg-amber-50 text-amber-600",
      gradient: "from-cyan-200 to-sky-400",
      icon: Tag,
      iconClassName: "text-white/40",
      previewPath: "/#beranda",
      editPath: "/",
    },
    {
      title: data?.layanan?.[0]?.nama_layanan ?? "Layanan",
      date: `${data?.layanan?.length ?? 0} item`,
      status: data?.layanan?.length ? "Aktif" : "Kosong",
      statusClassName: data?.layanan?.length
        ? "bg-emerald-50 text-emerald-600"
        : "bg-amber-50 text-amber-600",
      gradient: "from-emerald-200 to-teal-400",
      icon: HeartPlus,
      iconClassName: "text-white/40",
      previewPath: "/#layanan",
      editPath: "/admin_layanan_crud",
    },
    {
      title: data?.dokter?.[0]?.nama_dokter ?? "Dokter",
      date: `${data?.dokter?.length ?? 0} item`,
      status: data?.dokter?.length ? "Aktif" : "Kosong",
      statusClassName: data?.dokter?.length
        ? "bg-emerald-50 text-emerald-600"
        : "bg-amber-50 text-amber-600",
      gradient: "from-violet-200 to-violet-400",
      icon: Stethoscope,
      iconClassName: "text-white/40",
      previewPath: "/#dokter",
      editPath: "/dokter_jadwal_admin",
    },
    {
      title: data?.promo?.[0]?.url ? "Promo utama" : "Promo",
      date: `${data?.promo?.length ?? 0} item`,
      status: data?.promo?.length ? "Aktif" : "Kosong",
      statusClassName: data?.promo?.length
        ? "bg-emerald-50 text-emerald-600"
        : "bg-amber-50 text-amber-600",
      gradient: "from-rose-200 to-rose-400",
      icon: Tag,
      iconClassName: "text-white/40",
      previewPath: "/#promo",
      editPath: "/admin_promo_page",
    },
    {
      title: data?.galeri?.[0]?.text ?? "Galeri",
      date: `${data?.galeri?.length ?? 0} item`,
      status: data?.galeri?.length ? "Aktif" : "Kosong",
      statusClassName: data?.galeri?.length
        ? "bg-emerald-50 text-emerald-600"
        : "bg-amber-50 text-amber-600",
      gradient: "from-amber-200 to-orange-400",
      icon: ImageIcon,
      iconClassName: "text-white/40",
      previewPath: "/tentangkami#galeri",
      editPath: "/galeri-artikel_admin",
    },
  ];

  const tabItems: Array<{
    key: DashboardTab;
    label: string;
    description: string;
  }> = [
    { key: "overview", label: "Overview", description: "ringkasan data utama" },
    {
      key: "analytics",
      label: "Analytics",
      description: "statistik dan insight",
    },
    { key: "konten", label: "Konten", description: "kelola konten website" },
  ];
  const tabButtonClass =
    "rounded-md px-3 py-1 text-[10px] font-medium transition-all duration-200 ease-out motion-reduce:transition-none";

  function downloadCsv() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Unduh ringkasan dashboard dalam format CSV?")
    ) {
      return;
    }

    const rows = [
      ["kind", "label", "value", "details"],
      [
        "metric",
        "Banner aktif",
        String(data?.banner?.length ?? 0),
        data?.banner?.length ? "Sinkron" : "Kosong",
      ],
      [
        "metric",
        "Layanan",
        String(data?.layanan?.length ?? 0),
        data?.layanan?.length ? "Aktif" : "Kosong",
      ],
      [
        "metric",
        "Dokter",
        String(data?.dokter?.length ?? 0),
        data?.dokter?.length ? "Tersedia" : "Kosong",
      ],
      [
        "metric",
        "Promo",
        String(data?.promo?.length ?? 0),
        data?.promo?.length ? "Tersedia" : "Kosong",
      ],
      [
        "metric",
        "Galeri",
        String(data?.galeri?.length ?? 0),
        data?.galeri?.length ? "Tersedia" : "Kosong",
      ],
      ["separator", "", "", ""],
      [
        "content",
        "Banner utama",
        data?.banner?.[0]?.url ?? "-",
        "Preview /#beranda",
      ],
      [
        "content",
        "Layanan",
        data?.layanan?.[0]?.nama_layanan ?? "-",
        "Preview /#layanan",
      ],
      [
        "content",
        "Dokter",
        data?.dokter?.[0]?.nama_dokter ?? "-",
        "Preview /#dokter",
      ],
      ["content", "Promo", data?.promo?.[0]?.url ?? "-", "Preview /#promo"],
      [
        "content",
        "Galeri",
        data?.galeri?.[0]?.text ?? "-",
        "Preview /tentangkami#galeri",
      ],
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
        Dashboard admin lengkap dengan analytics dan content management untuk
        KRI AMC
      </h2>

      <div className="grid min-h-dvh w-full grid-cols-1 overflow-hidden bg-[#F0F4FA] shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <SidebarAdmin activeKey="dashboard" />

        <section className="flex min-w-0 flex-col bg-[#F0F4FA]">
          <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="text-[15px] font-semibold text-slate-900">
                Dashboard
              </div>
              <div className="flex rounded-lg bg-slate-100 p-0.5">
                {tabItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`${tabButtonClass} ${activeTab === item.key ? "bg-white text-sky-600 shadow-sm scale-[1.02]" : "text-slate-400 hover:bg-white/70 hover:text-slate-600"}`}
                    title={item.description}
                    aria-pressed={activeTab === item.key}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-medium text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-200"
              >
                <CalendarDays className="h-3 w-3" />
                30 hari terakhir
              </button>
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
            {activeTab === "overview" ? (
              <>
                <section className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-5">
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <article
                          key={index}
                          className="animate-pulse rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="h-6 w-6 rounded-md bg-slate-100" />
                            <div className="h-3 w-10 rounded-full bg-slate-100" />
                          </div>
                          <div className="h-6 w-10 rounded bg-slate-100" />
                          <div className="mt-2 h-2 w-16 rounded bg-slate-100" />
                          <div className="mt-3 h-5 rounded bg-slate-100" />
                        </article>
                      ))
                    : metrics.map((metric) => {
                        const Icon = metric.icon;

                        return (
                          <article
                            key={metric.title}
                            className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-md ${metric.containerClassName}`}
                              >
                                <Icon
                                  className={`h-3.5 w-3.5 ${metric.iconClassName}`}
                                />
                              </div>
                              {metric.trend ? (
                                <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-600">
                                  {metric.trend}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-[20px] font-semibold leading-none text-slate-900">
                              {metric.value}
                            </div>
                            <div className="mt-1 text-[8px] text-slate-400">
                              {metric.title}
                            </div>
                            <MetricSpark
                              bars={metric.bars}
                              colorClass={metric.barClassName ?? "bg-slate-300"}
                            />
                          </article>
                        );
                      })}
                </section>

                <section className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <article
                          key={index}
                          className="animate-pulse rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"
                        >
                          <div className="mx-auto mb-2 h-7 w-7 rounded-lg bg-slate-100" />
                          <div className="mx-auto h-3 w-16 rounded bg-slate-100" />
                          <div className="mt-2 flex justify-center gap-2">
                            <div className="h-4 w-10 rounded bg-slate-100" />
                            <div className="h-4 w-10 rounded bg-slate-100" />
                          </div>
                          <div className="mx-auto mt-2 h-3 w-20 rounded bg-slate-100" />
                        </article>
                      ))
                    : socialCards.map((card) => {
                        const Icon = card.icon;

                        return (
                          <article
                            key={card.name}
                            className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm"
                          >
                            <div
                              className={`mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${card.iconWrapClassName}`}
                            >
                              <Icon
                                className={`h-4 w-4 ${card.iconClassName}`}
                              />
                            </div>
                            <div className="mb-1 text-[9px] font-medium text-slate-900">
                              {card.name}
                            </div>
                            <div className="flex justify-center gap-2">
                              <div>
                                <div className="text-[13px] font-semibold leading-none text-slate-900">
                                  {card.followers}
                                </div>
                                <div className="text-[7px] text-slate-400">
                                  Followers
                                </div>
                              </div>
                              <div>
                                <div className="text-[13px] font-semibold leading-none text-emerald-600">
                                  {card.delta}
                                </div>
                                <div className="text-[7px] text-slate-400">
                                  Baru
                                </div>
                              </div>
                            </div>
                            <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] font-medium text-sky-600">
                              <Search className="h-3 w-3" />
                              {card.clicks}
                            </div>
                          </article>
                        );
                      })}
                </section>
              </>
            ) : null}

            {activeTab === "analytics" ? (
              <>
                <section className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-2 transition-all duration-300 ease-out motion-reduce:transition-none">
                  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none">
                    <SectionTitle
                      icon={MapPin}
                      title="Google Business Profile"
                      subtitle="30 hari terakhir"
                    />
                    <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                      {[
                        {
                          label: "Pencarian",
                          num: formatNumber(gbpInteractionCount),
                          color: "text-sky-500",
                          trend: `${gbpInteractionCount} snapshot`,
                        },
                        {
                          label: "Klik rute",
                          num: formatNumber(totalVisitorPages),
                          color: "text-rose-500",
                          trend: "total halaman",
                        },
                        {
                          label: "Panggilan",
                          num: formatNumber(visitorSessions.length),
                          color: "text-emerald-500",
                          trend: `${averageSessionMinutes} menit`,
                        },
                        {
                          label: "Lihat profil",
                          num: formatNumber(totalFollowers),
                          color: "text-amber-500",
                          trend: topPlatform,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-lg bg-slate-50 p-2 text-center"
                        >
                          <div
                            className={`text-[16px] font-semibold leading-none ${item.color}`}
                          >
                            {item.num}
                          </div>
                          <div className="mt-0.5 text-[8px] text-slate-400">
                            {item.label}
                          </div>
                          <div className="mt-0.5 text-[7px] font-medium text-emerald-600">
                            {item.trend}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none">
                    <SectionTitle icon={Star} title="Review tracker" />
                    <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                      <div className="rounded-lg bg-slate-50 p-2 text-center">
                        <div className="text-[8px] text-slate-400">
                          Snapshot terakhir
                        </div>
                        <div className="text-[18px] font-semibold text-slate-400">
                          {latestReviewCount}
                        </div>
                        <div className="text-[8px] text-slate-400">review</div>
                      </div>
                      <div className="text-lg font-semibold text-emerald-600">
                        →
                      </div>
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-center">
                        <div className="text-[8px] text-slate-400">
                          Rata-rata rating
                        </div>
                        <div className="text-[18px] font-semibold text-emerald-600">
                          {latestRating.toFixed(1)}
                        </div>
                        <div className="text-[8px] text-emerald-600">
                          {socialMediaStatsCount} platform
                        </div>
                      </div>
                    </div>
                  </article>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out motion-reduce:transition-none">
                  <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                    <MousePointerClick className="h-4 w-4 text-sky-500" />
                    Insight cepat
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="rounded-lg bg-sky-50 p-3 text-[10px] text-slate-700">
                      Banner aktif: {data?.banner?.length ?? 0}
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-3 text-[10px] text-slate-700">
                      Layanan siap dikelola: {data?.layanan?.length ?? 0}
                    </div>
                    <div className="rounded-lg bg-violet-50 p-3 text-[10px] text-slate-700">
                      Event terdeteksi: {formatNumber(events.length)}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-3 text-[10px] text-slate-700">
                      Sesi visitor: {formatNumber(visitorSessions.length)}
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 text-[10px] text-slate-700">
                      Rata-rata durasi: {averageSessionMinutes} menit
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 text-[10px] text-slate-700">
                      Engagement rata-rata: {averageEngagementRate}%
                    </div>
                  </div>
                </section>
              </>
            ) : null}

            {activeTab === "konten" ? (
              <section>
                <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
                    <Tag className="h-4 w-4 text-amber-500" />
                    Kelola konten website
                  </div>
                </div>

                <div className="mb-3 rounded-xl border border-dashed border-slate-200 bg-white/70 px-3 py-2 text-[9px] text-slate-500">
                  Dashboard ini hanya menampilkan ringkasan konten. CRUD tetap
                  tersedia di laman masing-masing.
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                  {contentCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <article
                        key={card.title}
                        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div
                          className={`relative flex h-20 items-center justify-center bg-gradient-to-br ${card.gradient}`}
                        >
                          <span
                            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[7px] font-semibold ${card.statusClassName}`}
                          >
                            {card.status}
                          </span>
                          <Icon className={`h-6 w-6 ${card.iconClassName}`} />
                        </div>
                        <div className="p-2.5">
                          <div className="truncate text-[10px] font-medium text-slate-900">
                            {card.title}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-[8px] text-slate-400">
                            <CalendarDays className="h-2.5 w-2.5" />
                            {card.date}
                          </div>
                          <div className="mt-2 flex gap-1">
                            <button
                              type="button"
                              aria-label={`Buka pengelolaan ${card.title}`}
                              onClick={() => {
                                if (
                                  typeof window !== "undefined" &&
                                  !window.confirm(
                                    `Buka halaman kelola untuk ${card.title}?`,
                                  )
                                )
                                  return;
                                router.push(card.editPath);
                              }}
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-50 text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100"
                            >
                              <Workflow className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Buka preview ${card.title}`}
                              onClick={() => {
                                if (
                                  typeof window !== "undefined" &&
                                  !window.confirm(
                                    `Buka halaman preview ${card.title}?`,
                                  )
                                )
                                  return;
                                router.push(card.previewPath);
                              }}
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-50 text-slate-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Buka pengaturan ${card.title}`}
                              onClick={() => {
                                if (
                                  typeof window !== "undefined" &&
                                  !window.confirm(
                                    `Buka pengaturan untuk ${card.title}?`,
                                  )
                                )
                                  return;
                                router.push(card.editPath);
                              }}
                              className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-50 text-rose-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-100"
                            >
                              <Settings className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
