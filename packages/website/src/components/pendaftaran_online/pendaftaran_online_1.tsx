"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  Info,
  Loader2,
  MessageCircle,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Input } from "@/src/UiKecil/input";
import { ToggleGroup, ToggleGroupItem } from "@/src/UiKecil/toggle-group";
import { Textarea } from "@/src/UiKecil/textarea";
import Navbar from "@/src/components/navbar";
import MobileJKNRedirect from "@/src/components/pendaftaran_online/mobile_jkn_redirect";
import {
  cekPasienByNIK,
  savePendaftaranSession,
  type PasienKhanza,
} from "@/src/lib/api";

const inputClass =
  "h-12 rounded-full border border-[#8f8f8f] bg-[#f7f5f2] px-4 t-body text-black placeholder:text-[#b3b3b3] focus-visible:ring-0";
const labelClass = "t-body-sm font-bold uppercase tracking-wide text-black";
const selectClass =
  "h-12 w-full rounded-full border border-[#8f8f8f] bg-[#f7f5f2] px-4 t-body text-black focus:outline-none cursor-pointer appearance-none";

const GOL_DARAH = ["", "A", "B", "O", "AB", "-"];
const AGAMA = ["", "Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "-"];
const STATUS_NIKAH = ["", "BELUM MENIKAH", "MENIKAH", "JANDA", "DUDHA", "JOMBLO"];
const PENDIDIKAN = ["", "TS", "TK", "SD", "SMP", "SMA", "SLTA/SEDERAJAT", "D1", "D2", "D3", "D4", "S1", "S2", "S3", "-"];
const HUBUNGAN = ["", "AYAH", "IBU", "ISTRI", "SUAMI", "SAUDARA", "ANAK", "DIRI SENDIRI", "LAIN-LAIN"];

const steps = [
  { number: 1, label: "Data diri", active: true },
  { number: 2, label: "Kunjungan", active: false },
  { number: 3, label: "Konfirmasi", active: false },
];

type PasienBaruForm = {
  nm_pasien: string;
  jk: "L" | "P" | "";
  tmp_lahir: string;
  tgl_lahir: string;
  gol_darah: string;
  agama: string;
  stts_nikah: string;
  pnd: string;
  pekerjaan: string;
  no_tlp: string;
  alamat: string;
  nm_ibu: string;
  namakeluarga: string;
  keluarga: string;
};

const emptyForm: PasienBaruForm = {
  nm_pasien: "",
  jk: "",
  tmp_lahir: "",
  tgl_lahir: "",
  gol_darah: "",
  agama: "",
  stts_nikah: "",
  pnd: "",
  pekerjaan: "",
  no_tlp: "",
  alamat: "",
  nm_ibu: "",
  namakeluarga: "",
  keluarga: "",
};

export default function FormulirPendaftaran() {
  const router = useRouter();

  // Jenis pasien: null = belum pilih, 'umum' = form, 'bpjs' = redirect
  const [jenisPasien, setJenisPasien] = useState<"umum" | "bpjs" | null>(null);

  // NIK check
  const [nik, setNik] = useState("");
  const [nikLoading, setNikLoading] = useState(false);
  const [nikError, setNikError] = useState("");
  const [pasienLama, setPasienLama] = useState<PasienKhanza | null>(null);
  const [nikChecked, setNikChecked] = useState(false);
  const [pasienFound, setPasienFound] = useState(false);

  // Form pasien baru
  const [form, setForm] = useState<PasienBaruForm>(emptyForm);

  const setField = (key: keyof PasienBaruForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleCekNIK = async () => {
    if (nik.length !== 16) {
      setNikError("NIK harus 16 digit");
      return;
    }
    setNikError("");
    setNikLoading(true);
    try {
      const res = await cekPasienByNIK(nik);
      setNikChecked(true);
      if (res.found) {
        setPasienLama(res.data);
        setPasienFound(true);
      } else {
        setPasienFound(false);
        setForm((prev) => ({ ...prev }));
      }
    } catch {
      setNikError("Gagal menghubungi server, coba lagi");
    } finally {
      setNikLoading(false);
    }
  };

  const handleLanjutLama = () => {
    if (!pasienLama) return;
    savePendaftaranSession({
      step1: {
        isNewPasien: false,
        no_rkm_medis: pasienLama.no_rkm_medis,
        no_ktp: pasienLama.no_ktp,
        nm_pasien: pasienLama.nm_pasien,
        jk: pasienLama.jk,
        tgl_lahir: pasienLama.tgl_lahir,
        no_tlp: pasienLama.no_tlp,
        alamat: pasienLama.alamat,
      },
    });
    router.push("/pendaftaran_online_2");
  };

  const handleLanjutBaru = () => {
    const required: (keyof PasienBaruForm)[] = [
      "nm_pasien", "jk", "tmp_lahir", "tgl_lahir",
      "nm_ibu", "no_tlp", "alamat", "namakeluarga",
    ];
    for (const f of required) {
      if (!form[f]) {
        alert(`Field "${f.replace(/_/g, " ")}" wajib diisi`);
        return;
      }
    }
    savePendaftaranSession({
      step1: {
        isNewPasien: true,
        no_ktp: nik,
        nm_pasien: form.nm_pasien,
        jk: form.jk,
        tmp_lahir: form.tmp_lahir,
        tgl_lahir: form.tgl_lahir,
        gol_darah: form.gol_darah,
        agama: form.agama,
        stts_nikah: form.stts_nikah,
        pnd: form.pnd,
        pekerjaan: form.pekerjaan,
        no_tlp: form.no_tlp,
        alamat: form.alamat,
        nm_ibu: form.nm_ibu,
        namakeluarga: form.namakeluarga,
        keluarga: form.keluarga,
      },
    });
    router.push("/pendaftaran_online_2");
  };

  // ── Render: Jenis Pasien Selector ─────────────────────────────────────────
  if (jenisPasien === null) {
    return (
      <main className="min-h-screen bg-[#f7f5f2]">
        <Navbar />
        <section className="section-wrap">
          <Card className="card-radius border border-black/5 bg-[#efefed] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]">
            <CardContent className="card-base">
              <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-6 w-6 text-[#4ea0db]" />
                  <h1 className="t-h2 font-medium tracking-wide text-[#08b4d8]">
                    PENDAFTARAN ONLINE
                  </h1>
                </div>
                <p className="mt-2 t-body font-medium text-black">
                  Pilih jenis pasien untuk melanjutkan
                </p>

                <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setJenisPasien("umum")}
                    className="group flex flex-col items-center gap-3 rounded-[20px] border-2 border-black bg-[#f7f5f2] p-6 transition-all hover:border-[#08b4d8] hover:bg-white"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5defc]">
                      <UserRound className="h-7 w-7 text-[#08b4d8]" />
                    </div>
                    <span className="t-h4 font-bold text-black">Pasien Umum</span>
                    <span className="t-body-sm font-medium text-[#7f7f7f]">
                      Berbayar / Asuransi swasta
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenisPasien("bpjs")}
                    className="group flex flex-col items-center gap-3 rounded-[20px] border-2 border-black bg-[#f7f5f2] p-6 transition-all hover:border-green-500 hover:bg-white"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                      <ShieldCheck className="h-7 w-7 text-green-600" />
                    </div>
                    <span className="t-h4 font-bold text-black">Peserta BPJS</span>
                    <span className="t-body-sm font-medium text-[#7f7f7f]">
                      BPJS Kesehatan
                    </span>
                  </button>
                </div>

                <p className="mt-6 t-caption font-medium text-[#b3b3b3]">
                  Khusus pasien umum · Pasien BPJS via Mobile JKN
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  // ── Render: BPJS Redirect ─────────────────────────────────────────────────
  if (jenisPasien === "bpjs") {
    return (
      <main className="min-h-screen bg-[#f7f5f2]">
        <Navbar />
        <section className="section-wrap">
          <MobileJKNRedirect onBack={() => setJenisPasien(null)} />
        </section>
      </main>
    );
  }

  // ── Render: Umum — NIK Check + Form ──────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f7f5f2]">
      <Navbar />
      <section className="section-wrap">
        <Card className="card-radius border border-black/5 bg-[#efefed] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]">
          <CardContent className="card-base">
            {/* Judul */}
            <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-6 w-6 text-[#4ea0db]" />
                <h1 className="t-h2 font-medium tracking-wide text-[#08b4d8]">
                  PENDAFTARAN ONLINE
                </h1>
              </div>
              <p className="mt-2 t-body font-medium text-black">
                Isi formulir di bawah untuk mendaftar
              </p>
            </div>

            {/* Step indicator */}
            <div className="mx-auto mt-8 flex max-w-[820px] flex-wrap items-center justify-center gap-3 sm:gap-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <button type="button" className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full t-body font-medium ${
                        step.active
                          ? "bg-[#1117ff] text-white"
                          : "bg-[#b4b4b4] text-[#494949]"
                      }`}
                    >
                      {step.number}
                    </span>
                    <span
                      className={`t-body-sm font-medium max-[639px]:hidden ${
                        step.active ? "text-[#1117ff]" : "text-[#a4a4a4]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="mx-3 hidden h-px w-16 bg-[#8cbf76] sm:block" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-center t-caption font-medium text-[#b3b3b3]">
              Khusus pasien umum · Pasien BPJS via Mobile JKN
            </p>

            <div
              className="mt-10 grid lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]"
              style={{ gap: "var(--gap-cards)" }}
            >
              {/* ── Form Area ── */}
              <section aria-label="Formulir pendaftaran">
                {/* CEK NIK */}
                <div className="mb-6 space-y-3">
                  <label htmlFor="nik-input" className={labelClass}>
                    NIK (Nomor Induk Kependudukan)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="nik-input"
                      value={nik}
                      onChange={(e) => {
                        setNik(e.target.value.replace(/\D/g, "").slice(0, 16));
                        setNikChecked(false);
                        setPasienLama(null);
                        setPasienFound(false);
                      }}
                      placeholder="16 Digit Nomor KTP"
                      className={`${inputClass} flex-1`}
                      maxLength={16}
                    />
                    <Button
                      type="button"
                      onClick={handleCekNIK}
                      disabled={nikLoading || nik.length !== 16}
                      className="h-12 shrink-0 rounded-full bg-[#08b4d8] px-5 t-body font-medium text-white hover:bg-[#06a8ca] disabled:opacity-50"
                    >
                      {nikLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">Cek</span>
                    </Button>
                  </div>
                  {nikError && (
                    <p className="t-body-sm text-red-500">{nikError}</p>
                  )}
                </div>

                {/* PASIEN LAMA — ditemukan */}
                {nikChecked && pasienFound && pasienLama && (
                  <div className="mb-6 rounded-[20px] border-2 border-green-400 bg-green-50 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="t-body font-bold text-green-700">
                        Pasien terdaftar ✓
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 t-body-sm text-black sm:grid-cols-2">
                      <div>
                        <span className="font-medium text-[#7f7f7f]">Nama: </span>
                        {pasienLama.nm_pasien}
                      </div>
                      <div>
                        <span className="font-medium text-[#7f7f7f]">Tgl lahir: </span>
                        {pasienLama.tgl_lahir}
                      </div>
                      <div>
                        <span className="font-medium text-[#7f7f7f]">Kelamin: </span>
                        {pasienLama.jk === "L" ? "Laki-laki" : "Perempuan"}
                      </div>
                      <div>
                        <span className="font-medium text-[#7f7f7f]">No. HP: </span>
                        {pasienLama.no_tlp}
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleLanjutLama}
                      className="mt-4 h-12 w-full rounded-full bg-[#08b4d8] t-body font-medium text-white hover:bg-[#06a8ca]"
                    >
                      Lanjutkan Pendaftaran
                    </Button>
                  </div>
                )}

                {/* PASIEN BARU — form lengkap */}
                {nikChecked && !pasienFound && (
                  <div className="space-y-5">
                    <div className="rounded-[16px] border border-[#08b4d8]/30 bg-blue-50 p-3">
                      <p className="t-body-sm font-medium text-blue-700">
                        NIK tidak ditemukan. Silakan isi data berikut untuk
                        mendaftar sebagai pasien baru.
                      </p>
                    </div>

                    <form className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                      {/* Identitas Diri */}
                      <div className="col-span-full">
                        <p className="t-body-sm font-bold uppercase tracking-wide text-[#08b4d8]">
                          Identitas Diri
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={form.nm_pasien}
                          onChange={(e) => setField("nm_pasien", e.target.value)}
                          placeholder="Sesuai KTP"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <fieldset>
                          <legend className={labelClass}>
                            Jenis Kelamin <span className="text-red-500">*</span>
                          </legend>
                          <ToggleGroup
                            type="single"
                            value={form.jk}
                            onValueChange={(v: string) =>
                              v && setField("jk", v)
                            }
                            className="mt-3 flex items-center gap-8"
                          >
                            {[
                              { value: "L", label: "Laki-laki" },
                              { value: "P", label: "Perempuan" },
                            ].map((opt) => (
                              <div key={opt.value} className="flex items-center gap-2">
                                <ToggleGroupItem
                                  value={opt.value}
                                  id={`jk-${opt.value}`}
                                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#d9d9d9] bg-transparent p-0 shadow-none data-[state=on]:border-[#1d19ff] data-[state=on]:bg-white"
                                >
                                  <span
                                    className={`h-3 w-3 rounded-full ${
                                      form.jk === opt.value
                                        ? "bg-[#1d19ff]"
                                        : "bg-transparent"
                                    }`}
                                  />
                                </ToggleGroupItem>
                                <label
                                  htmlFor={`jk-${opt.value}`}
                                  className="t-body font-medium text-black"
                                >
                                  {opt.label}
                                </label>
                              </div>
                            ))}
                          </ToggleGroup>
                        </fieldset>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>
                          Tempat Lahir <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={form.tmp_lahir}
                          onChange={(e) => setField("tmp_lahir", e.target.value)}
                          placeholder="Kota tempat lahir"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>
                          Tanggal Lahir <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={form.tgl_lahir}
                          onChange={(e) => setField("tgl_lahir", e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Golongan Darah</label>
                        <select
                          title="Golongan Darah"
                          value={form.gol_darah}
                          onChange={(e) => setField("gol_darah", e.target.value)}
                          className={selectClass}
                        >
                          {GOL_DARAH.map((v) => (
                            <option key={v} value={v}>
                              {v || "— Pilih —"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Agama</label>
                        <select
                          title="Agama"
                          value={form.agama}
                          onChange={(e) => setField("agama", e.target.value)}
                          className={selectClass}
                        >
                          {AGAMA.map((v) => (
                            <option key={v} value={v}>
                              {v || "— Pilih —"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Status Pernikahan</label>
                        <select
                          title="Status Pernikahan"
                          value={form.stts_nikah}
                          onChange={(e) => setField("stts_nikah", e.target.value)}
                          className={selectClass}
                        >
                          {STATUS_NIKAH.map((v) => (
                            <option key={v} value={v}>
                              {v || "— Pilih —"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Pendidikan Terakhir</label>
                        <select
                          title="Pendidikan Terakhir"
                          value={form.pnd}
                          onChange={(e) => setField("pnd", e.target.value)}
                          className={selectClass}
                        >
                          {PENDIDIKAN.map((v) => (
                            <option key={v} value={v}>
                              {v || "— Pilih —"}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Pekerjaan</label>
                        <Input
                          value={form.pekerjaan}
                          onChange={(e) => setField("pekerjaan", e.target.value)}
                          placeholder="Pekerjaan saat ini"
                          className={inputClass}
                        />
                      </div>

                      {/* Kontak */}
                      <div className="col-span-full mt-2">
                        <p className="t-body-sm font-bold uppercase tracking-wide text-[#08b4d8]">
                          Kontak
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>
                          No. HP / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={form.no_tlp}
                          onChange={(e) =>
                            setField("no_tlp", e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="Contoh: 08123456789"
                          className={inputClass}
                        />
                      </div>

                      <div className="col-span-full space-y-2">
                        <label className={labelClass}>
                          Alamat Lengkap <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          value={form.alamat}
                          onChange={(e) => setField("alamat", e.target.value)}
                          placeholder="Alamat sesuai KTP"
                          className="min-h-[96px] resize-none rounded-[18px] border border-[#8f8f8f] bg-[#f7f5f2] px-4 py-3 t-body text-black placeholder:text-[#b3b3b3] focus-visible:ring-0"
                        />
                      </div>

                      {/* Ibu Kandung */}
                      <div className="col-span-full mt-2">
                        <p className="t-body-sm font-bold uppercase tracking-wide text-[#08b4d8]">
                          Ibu Kandung
                        </p>
                      </div>

                      <div className="col-span-full space-y-2">
                        <label className={labelClass}>
                          Nama Ibu Kandung <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={form.nm_ibu}
                          onChange={(e) => setField("nm_ibu", e.target.value)}
                          placeholder="Nama ibu kandung"
                          className={inputClass}
                        />
                      </div>

                      {/* Penanggung Jawab */}
                      <div className="col-span-full mt-2">
                        <p className="t-body-sm font-bold uppercase tracking-wide text-[#08b4d8]">
                          Penanggung Jawab
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>
                          Nama Penanggung Jawab <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={form.namakeluarga}
                          onChange={(e) => setField("namakeluarga", e.target.value)}
                          placeholder="Nama penanggung jawab"
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={labelClass}>Hubungan dengan Pasien</label>
                        <select
                          title="Hubungan dengan Pasien"
                          value={form.keluarga}
                          onChange={(e) => setField("keluarga", e.target.value)}
                          className={selectClass}
                        >
                          {HUBUNGAN.map((v) => (
                            <option key={v} value={v}>
                              {v || "— Pilih —"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </form>

                    <Button
                      type="button"
                      onClick={handleLanjutBaru}
                      className="h-12 w-full rounded-full bg-[#08b4d8] t-body font-medium text-white shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#06a8ca]"
                    >
                      Lanjut ke Jadwal Kunjungan
                    </Button>
                  </div>
                )}
              </section>

              {/* ── Sidebar ── */}
              <aside className="hidden flex-col gap-4 lg:sticky lg:top-6 lg:flex lg:self-start">
                <Card className="card-radius border border-[#8f8f8f] bg-[#f7f5f2] shadow-none">
                  <CardContent className="card-base">
                    <div className="mb-4 flex items-center gap-2">
                      <Info className="h-5 w-5 fill-[#80aadf] text-[#80aadf]" />
                      <h2 className="t-h4 font-bold text-black">
                        Yang perlu disiapkan
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 rounded-[16px] bg-white/40 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#d9d9d9]">
                          <UserRound className="h-4 w-4 text-[#73a8d8]" />
                        </div>
                        <div>
                          <div className="t-body text-black">KTP / Kartu Identitas</div>
                          <div className="t-caption font-medium text-[#7f7f7f]">
                            Untuk verifikasi data diri pasien
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 rounded-[16px] bg-white/40 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#d9d9d9]">
                          <WalletCards className="h-4 w-4 text-[#e47c7c]" />
                        </div>
                        <div>
                          <div className="t-body text-black">
                            Kartu Asuransi{" "}
                            <span className="text-black/30">(jika ada)</span>
                          </div>
                          <div className="t-caption font-medium text-[#7f7f7f]">
                            Untuk pasien dengan asuransi
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-radius border-0 bg-[#08b4d8] shadow-[0px_4px_33px_6px_#4a445d29]">
                  <CardContent className="card-base">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-white" />
                      <h2 className="t-h4 font-medium text-white">Butuh bantuan?</h2>
                    </div>
                    <p className="mt-2 t-caption font-medium text-white/95">
                      Kesulitan mengisi formulir? Hubungi kami via WhatsApp
                    </p>
                    <a
                      href="https://wa.me/6281225566055"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="mt-4 h-11 rounded-full bg-[#008000] px-5 t-body-sm text-white hover:bg-[#007000]">
                        <MessageCircle className="mr-2 h-4 w-4 fill-current" />
                        Chat Whatsapp
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </aside>

              {/* ── Mobile accordion ── */}
              <details className="rounded-2xl border border-[#8f8f8f] bg-[#f7f5f2] p-4 lg:hidden">
                <summary className="cursor-pointer t-body font-semibold text-black">
                  Lihat info bantuan pendaftaran
                </summary>
                <div className="mt-4 space-y-3 t-body-sm text-[#5f5f5f]">
                  <p>Siapkan KTP untuk verifikasi data pasien.</p>
                  <p>Khusus pasien umum, BPJS gunakan Mobile JKN.</p>
                </div>
              </details>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
