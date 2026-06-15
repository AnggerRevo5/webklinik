import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getArtikelBySlug } from "@/src/lib/api";
import Navbar from "@/src/components/navbar";
import Footer from "@/src/components/footer";

export const revalidate = 60;

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artikel = await getArtikelBySlug(slug);

  if (!artikel || artikel.status !== "published") {
    notFound();
  }

  const publishedDate = artikel.published_at
    ? new Date(artikel.published_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#3f3f3f]">
      <Navbar />

      <article className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
        {/* Breadcrumb */}
        <Link
          href="/#artikel"
          className="mb-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#00b4d8] hover:underline"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Kembali ke Beranda
        </Link>

        {/* Kategori badge */}
        {artikel.kategori ? (
          <div className="mb-3">
            <span className="rounded-full bg-[#00b4d8] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {artikel.kategori}
            </span>
          </div>
        ) : null}

        {/* Judul */}
        <h1 className="text-[28px] font-bold leading-tight text-[#1a1a1a] sm:text-[36px]">
          {artikel.judul}
        </h1>

        {/* Meta: penulis + tanggal */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[#888]">
          {artikel.penulis ? (
            <span className="font-medium text-[#555]">{artikel.penulis}</span>
          ) : null}
          {publishedDate ? (
            <>
              <span className="h-1 w-1 rounded-full bg-[#ccc]" />
              <span>{publishedDate}</span>
            </>
          ) : null}
        </div>

        {/* Gambar cover */}
        {artikel.foto_url ? (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl shadow-[0_4px_24px_-6px_rgba(0,0,0,0.15)]">
            <Image
              src={artikel.foto_url}
              alt={artikel.judul}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : null}

        {/* Ringkasan (bila ada, tampilkan sebagai lead paragraph) */}
        {artikel.ringkasan ? (
          <p className="mt-6 text-[16px] font-medium leading-relaxed text-[#555]">
            {artikel.ringkasan}
          </p>
        ) : null}

        {/* Konten HTML dari Tiptap */}
        {artikel.konten ? (
          <div
            className="prose prose-slate mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: artikel.konten }}
          />
        ) : null}
      </article>

      <Footer />
    </main>
  );
}
