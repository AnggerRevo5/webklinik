"use client";

import { useEffect, useState } from "react";
import { Check, Home, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import Navbar from "@/src/components/navbar";
import {
  clearPendaftaranSession,
  loadPendaftaranSession,
  type PendaftaranSession,
} from "@/src/lib/api";

function formatTanggalKunjungan(dateStr: string): string {
  if (!dateStr) return "—";
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const d = new Date(dateStr + "T00:00:00");
  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

export default function LamanKonfirmasiPendaftaran() {
  const [session, setSession] = useState<PendaftaranSession>({});

  useEffect(() => {
    setSession(loadPendaftaranSession());
  }, []);

  const { result, step1, step2 } = session;

  const noReg = result?.no_reg ?? "—";
  const noRkm = result?.no_rkm_medis ?? "—";
  const tanggal = result?.tanggal_periksa ?? step2?.tanggal_periksa ?? "";
  const waktu = result?.waktu_kunjungan ?? step2?.waktu_kunjungan ?? "—";
  const nmDokter = result?.nm_dokter ?? step2?.nm_dokter ?? "—";
  const nmPoli = result?.nm_poli ?? step2?.nm_poli ?? "—";
  const noTlp = step1?.no_tlp ?? "—";

  // Waktu ringkas untuk tampilan (ambil hh:mm saja)
  const waktuRingkas = waktu.includes(" ")
    ? waktu.split(" ")[1]?.slice(0, 5)
    : waktu.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#f7f5f2]">
      <Navbar />

      <div className="section-wrap">
        <Card className="relative mx-auto w-full max-w-[920px] card-radius border border-[#e6e6e6] bg-[#f7f5f2] shadow-[0px_1px_4px_#0000000d]">
          <CardContent className="card-base">
            <section
              className="relative min-h-[560px] w-full overflow-hidden"
              aria-label="Laman konfirmasi pendaftaran"
            >
              {/* Background blur: ringkasan data */}
              <div className="relative w-full card-radius border border-black/10 bg-[#f7f5f2] px-5 py-5 opacity-40 shadow-sm">
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2 t-body-sm text-[#7f7f7f]">
                  <div>
                    <p className="font-medium">Nama</p>
                    <p className="text-black">{step1?.nm_pasien ?? "—"}</p>
                  </div>
                  <div>
                    <p className="font-medium">Poliklinik</p>
                    <p className="text-black">{nmPoli}</p>
                  </div>
                  <div>
                    <p className="font-medium">Dokter</p>
                    <p className="text-black">{nmDokter}</p>
                  </div>
                  <div>
                    <p className="font-medium">Tanggal</p>
                    <p className="text-black">{formatTanggalKunjungan(tanggal)}</p>
                  </div>
                </div>
              </div>

              {/* Main success info */}
              <section className="relative w-full pt-10">
                <div className="mx-auto max-w-[1253px]">
                  <Card className="card-radius border-0 bg-white shadow-[0px_4.07px_24.45px_-1.02px_#0000001c] backdrop-blur-[20.37px] backdrop-brightness-[100%]">
                    <CardContent className="card-base flex flex-col items-center text-center">
                      <div className="mb-6 flex h-[102px] w-[102px] items-center justify-center rounded-full bg-[#d9d9d9] sm:h-[120px] sm:w-[120px]">
                        <Check
                          className="h-10 w-10 text-[#6f8e42] sm:h-[50px] sm:w-[50px]"
                          strokeWidth={2.25}
                        />
                      </div>

                      <header className="flex flex-col items-center">
                        <h2 className="t-h2 font-normal text-black">Pendaftaran berhasil!</h2>
                        <p className="mt-4 max-w-[663px] t-body-lg font-normal text-[#6b6b6b]">
                          Terima kasih telah mendaftar di KRI Ampelgading Medical Centre
                        </p>
                      </header>

                      {/* Nomor registrasi */}
                      <div className="mt-6 inline-flex items-center justify-center rounded-[50px] bg-[#d7c6ff] px-6 py-3">
                        <span className="t-body-lg font-medium text-[#1e00a7]">
                          No. Registrasi: {noReg}
                        </span>
                      </div>

                      {/* Detail */}
                      <div className="mt-6 w-full max-w-[500px] rounded-[20px] border border-black/10 bg-[#f7f5f2] p-4 text-left">
                        <div className="grid grid-cols-1 gap-3 t-body-sm sm:grid-cols-2">
                          <div>
                            <p className="font-medium text-[#9b9b9b]">No. Rekam Medis</p>
                            <p className="font-semibold text-black">{noRkm}</p>
                          </div>
                          <div>
                            <p className="font-medium text-[#9b9b9b]">Poliklinik</p>
                            <p className="font-semibold text-black">{nmPoli}</p>
                          </div>
                          <div>
                            <p className="font-medium text-[#9b9b9b]">Dokter</p>
                            <p className="font-semibold text-black">{nmDokter}</p>
                          </div>
                          <div>
                            <p className="font-medium text-[#9b9b9b]">Tanggal Periksa</p>
                            <p className="font-semibold text-black">
                              {formatTanggalKunjungan(tanggal)}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="font-medium text-[#9b9b9b]">Waktu</p>
                            <p className="font-semibold text-black">{waktuRingkas} WIB</p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-5 max-w-[1190px] t-body font-normal text-[#6b6b6b]">
                        Harap datang{" "}
                        <span className="font-bold">15 menit sebelum</span> waktu
                        kunjungan. Tunjukkan nomor registrasi{" "}
                        <span className="font-bold">{noReg}</span> kepada petugas.
                      </p>

                      <p className="mt-3 max-w-[585px] t-body font-normal text-[#6b6b6b]">
                        Tim kami akan menghubungi Anda di{" "}
                        <span className="font-bold">{noTlp}</span> untuk konfirmasi
                        kunjungan.
                        <br />
                        <span className="t-body-sm text-amber-600">
                          Status: Menunggu konfirmasi petugas klinik.
                        </span>
                      </p>

                      <nav
                        className="mt-8 grid w-full max-w-[930px] grid-cols-1 sm:grid-cols-2"
                        style={{ gap: "var(--gap-cards)" }}
                      >
                        <Button
                          type="button"
                          asChild
                          onClick={clearPendaftaranSession}
                          className="h-12 w-full rounded-full px-6 t-body font-medium bg-[#00b4d8] text-white hover:bg-[#00a7c9]"
                        >
                          <Link href="/">
                            <span className="flex items-center justify-center gap-3">
                              <Home className="h-5 w-5" />
                              <span>Ke beranda</span>
                            </span>
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          asChild
                          className="h-12 w-full rounded-full px-6 t-body font-medium bg-[#008000] text-white hover:bg-[#0a720a]"
                        >
                          <Link
                            href="https://wa.me/6281225566055"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="flex items-center justify-center gap-3">
                              <MessageCircle className="h-5 w-5" />
                              <span>Whatsapp</span>
                            </span>
                          </Link>
                        </Button>
                      </nav>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
