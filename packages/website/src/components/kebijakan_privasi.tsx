"use client";

import * as React from "react";
import { Cookie, Database, Eye, Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import PageFooter from "@/src/components/page_footer";
import Navbar from "@/src/components/navbar";
import { ScrollProgress } from "@/src/components/motion";
import { Section, SectionHeader } from "@/src/UiKecil/section";
import { useSiteSettings } from "@/src/lib/hooks";
import { openCookieSettings } from "@/src/lib/consent";

const BERLAKU_SEJAK = "5 Juli 2026";

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00b4d8]/10 text-[#00b4d8]">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="t-h4 font-bold text-slate-900">{title}</h3>
      </div>
      <div className="t-body-sm space-y-2 leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

export default function KebijakanPrivasi() {
  const settings = useSiteSettings();

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#3f3f3f]">
      <ScrollProgress />
      <Navbar />
      <Section className="pt-32">
          <SectionHeader
            label="Legal"
            title="Kebijakan Privasi"
            subtitle={`Berlaku sejak ${BERLAKU_SEJAK}. Halaman ini menjelaskan data apa saja yang kami kumpulkan dari pengunjung situs web KRI Ampelgading Medical Centre, untuk apa, dan hak Anda atas data tersebut sesuai UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).`}
          />

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Block icon={ShieldCheck} title="Siapa Pengelola Data Ini">
              <p>
                <strong>PT. Banar Medika Mandiri</strong>, penyelenggara KRI Ampelgading Medical
                Centre, beralamat di Dsn. Krajan RT.013 RW.005, Desa Tirtomarto, Kec. Ampelgading,
                Kab. Malang 65183.
              </p>
              <p>
                Kami adalah pengendali data (data controller) untuk data yang dikumpulkan melalui
                situs web ini.
              </p>
            </Block>

            <Block icon={Database} title="Data yang Kami Kumpulkan">
              <p className="font-semibold text-slate-700">1. Saat Anda mendaftar berobat online</p>
              <p>
                NIK, nama, tempat/tanggal lahir, nama ibu kandung, alamat, nomor HP, dan data medis
                dasar yang Anda isi sendiri di formulir pendaftaran. Data ini masuk langsung ke
                sistem rekam medis klinik (Khanza SIK) dan diperlakukan sebagai rekam medis
                rahasia sesuai Peraturan Menteri Kesehatan — <strong>bukan</strong> bagian dari
                cookie/analitik di bawah ini.
              </p>
              <p className="font-semibold text-slate-700">2. Saat Anda sekadar menjelajah situs</p>
              <p>
                Alamat IP, kota/provinsi perkiraan (dari IP, bukan lokasi presisi), jenis
                perangkat &amp; browser, halaman yang dikunjungi, durasi kunjungan, dan sumber
                kunjungan (mis. dari Google/Instagram) — <strong>hanya jika</strong> Anda menyetujui
                cookie analitik.
              </p>
              <p className="t-caption text-slate-400">
                Kami tidak pernah meminta lokasi GPS presisi pengunjung situs — kota/provinsi
                dari IP di atas sudah cukup untuk kebutuhan analitik kami.
              </p>
            </Block>

            <Block icon={Eye} title="Untuk Apa Data Ini Dipakai">
              <ul className="list-disc space-y-1 pl-4">
                <li>Memproses pendaftaran kunjungan &amp; rekam medis Anda di klinik.</li>
                <li>Memahami dari mana pengunjung situs berasal dan halaman apa yang paling
                  bermanfaat, untuk perbaikan layanan &amp; konten.</li>
                <li>Mendeteksi penyalahgunaan (mis. percobaan akses berulang yang mencurigakan)
                  demi keamanan sistem pendaftaran.</li>
              </ul>
              <p>
                Data pengunjung <strong>tidak pernah dijual atau dibagikan ke pihak ketiga untuk
                kepentingan iklan.</strong>
              </p>
            </Block>

            <Block icon={Cookie} title="Cookie & Cara Menonaktifkannya">
              <p>
                Kami memakai penyimpanan lokal browser (localStorage/sessionStorage) untuk
                mengingat pilihan consent Anda dan sesi kunjungan — bukan cookie pelacakan iklan
                pihak ketiga.
              </p>
              <p>
                Anda bisa mengubah pilihan kapan saja lewat tombol di bawah, atau menghapusnya
                manual lewat pengaturan browser (biasanya di menu &ldquo;Privasi &amp; Keamanan&rdquo;).
              </p>
              <button
                type="button"
                onClick={() => openCookieSettings()}
                className="btn-shine mt-2 inline-flex h-10 items-center rounded-full bg-[#00b4d8] px-5 t-body-sm font-semibold text-white shadow-md shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#06a8ca]"
              >
                Ubah Preferensi Cookie
              </button>
            </Block>

            <Block icon={Lock} title="Bagaimana Data Dilindungi">
              <ul className="list-disc space-y-1 pl-4">
                <li>Koneksi ke situs ini terenkripsi (HTTPS).</li>
                <li>Data rekam medis pendaftaran online disimpan di sistem SIMRS internal
                  klinik, terpisah dari data analitik pengunjung.</li>
                <li>Akses ke data admin/rekam medis dibatasi dengan autentikasi &amp; dicatat
                  dalam log aktivitas (audit log) untuk penelusuran bila terjadi
                  penyalahgunaan.</li>
                <li>Setiap percobaan login admin dicatat beserta kota/negara asal (dari alamat
                  IP, bukan GPS) untuk mendeteksi login mencurigakan dari lokasi tidak biasa.</li>
                <li>Percobaan verifikasi identitas pasien dibatasi jumlahnya per periode waktu
                  untuk mencegah penyalahgunaan otomatis.</li>
              </ul>
            </Block>

            <Block icon={ShieldCheck} title="Hak Anda Sesuai UU PDP">
              <p>Sesuai UU No. 27 Tahun 2022, Anda berhak untuk:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Mengetahui data pribadi apa saja tentang Anda yang kami simpan.</li>
                <li>Meminta koreksi data yang tidak akurat.</li>
                <li>Meminta penghapusan data, sepanjang tidak bertentangan dengan kewajiban
                  penyimpanan rekam medis menurut peraturan Kemenkes.</li>
                <li>Menarik consent analitik kapan saja tanpa memengaruhi akses Anda ke
                  layanan klinik.</li>
                <li>Mengajukan keberatan atau pengaduan ke otoritas pelindungan data pribadi
                  yang berwenang bila hak Anda tidak dipenuhi.</li>
              </ul>
            </Block>

            <Block icon={Database} title="Layanan Pihak Ketiga">
              <p>
                Untuk memperkirakan kota/provinsi pengunjung dari alamat IP (bukan lokasi
                presisi), kami menggunakan layanan pencarian IP publik <strong>ip-api.com</strong>.
                Alamat IP dikirim ke layanan ini hanya bila Anda menyetujui cookie analitik.
                Kami tidak mengirimkan data pribadi lain (nama, NIK, dll.) ke layanan ini.
              </p>
            </Block>

            <Block icon={Phone} title="Hubungi Kami Soal Privasi">
              <p>Ada pertanyaan tentang data Anda atau ingin mengajukan hak di atas? Hubungi:</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#00b4d8]" />
                <a href={`tel:${settings.telepon?.replace(/[^0-9]/g, "")}`} className="hover:underline">
                  {settings.telepon}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00b4d8]" />
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp Klinik
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00b4d8]" />
                <span>Dsn. Krajan RT.013 RW.005, Desa Tirtomarto, Kec. Ampelgading, Kab. Malang 65183</span>
              </div>
            </Block>
          </div>

          <p className="mt-10 text-center t-caption text-slate-400">
            Kebijakan ini dapat diperbarui sewaktu-waktu mengikuti perubahan layanan atau
            peraturan yang berlaku. Versi terbaru selalu tersedia di halaman ini.
          </p>
      </Section>
      <PageFooter />
    </main>
  );
}
