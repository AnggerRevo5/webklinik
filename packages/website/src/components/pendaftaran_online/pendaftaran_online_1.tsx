"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Info,
  Loader2,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Button } from "@/src/UiKecil/button";
import { Input } from "@/src/UiKecil/input";
import { ToggleGroup, ToggleGroupItem } from "@/src/UiKecil/toggle-group";
import { Textarea } from "@/src/UiKecil/textarea";
import { cn } from "@/src/lib/utils";
import MobileJKNRedirect from "@/src/components/pendaftaran_online/mobile_jkn_redirect";
import {
  RegistrationShell,
  HelpCard,
  fieldClass,
  selectFieldClass,
  fieldLabelClass,
  softCardClass,
} from "@/src/components/pendaftaran_online/registration_shell";
import { Reveal } from "@/src/components/motion";
import {
  cekPasienByNIK,
  savePendaftaranSession,
  type PasienKhanza,
} from "@/src/lib/api";

const inputClass = fieldClass;
const labelClass = fieldLabelClass;
const selectClass = selectFieldClass;

const GOL_DARAH = ["", "A", "B", "O", "AB", "-"];
const AGAMA = ["", "Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "-"];
const STATUS_NIKAH = ["", "BELUM MENIKAH", "MENIKAH", "JANDA", "DUDHA", "JOMBLO"];
const PENDIDIKAN = ["", "TS", "TK", "SD", "SMP", "SMA", "SLTA/SEDERAJAT", "D1", "D2", "D3", "D4", "S1", "S2", "S3", "-"];
const HUBUNGAN = ["", "AYAH", "IBU", "ISTRI", "SUAMI", "SAUDARA", "ANAK", "DIRI SENDIRI", "LAIN-LAIN"];

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
      <RegistrationShell
        current={1}
        subtitle="Pilih jenis pasien untuk memulai pendaftaran kunjungan Anda"
      >
        <div className="mx-auto max-w-[760px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Reveal direction="up">
              <button
                type="button"
                onClick={() => setJenisPasien("umum")}
                className="group relative flex h-full w-full flex-col items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-[0_10px_30px_-18px_rgba(15,76,129,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#00b4d8] hover:shadow-[0_22px_46px_-20px_rgba(0,180,216,0.5)]"
              >
                <span className="pointer-events-none absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-[#00b4d8] to-[#0f4c81]" />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00b4d8]/10 text-[#00b4d8] transition-colors group-hover:bg-[#00b4d8] group-hover:text-white">
                  <UserRound className="h-8 w-8" />
                </div>
                <span className="t-h4 font-bold text-slate-900">Pasien Umum</span>
                <span className="t-body-sm text-slate-500">
                  Berbayar / Asuransi swasta
                </span>
                <span className="mt-1 inline-flex items-center gap-1 t-body-sm font-semibold text-[#00b4d8]">
                  Mulai daftar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </Reveal>

            <Reveal direction="up" delay={120}>
              <button
                type="button"
                onClick={() => setJenisPasien("bpjs")}
                className="group relative flex h-full w-full flex-col items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-[0_10px_30px_-18px_rgba(15,76,129,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-[0_22px_46px_-20px_rgba(16,185,129,0.45)]"
              >
                <span className="pointer-events-none absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <span className="t-h4 font-bold text-slate-900">Peserta BPJS</span>
                <span className="t-body-sm text-slate-500">BPJS Kesehatan</span>
                <span className="mt-1 inline-flex items-center gap-1 t-body-sm font-semibold text-emerald-600">
                  Via Mobile JKN
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </Reveal>
          </div>

          <p className="mt-6 text-center t-caption text-slate-400">
            Khusus pasien umum · Pasien BPJS diarahkan ke aplikasi Mobile JKN
          </p>
        </div>
      </RegistrationShell>
    );
  }

  // ── Render: BPJS Redirect ─────────────────────────────────────────────────
  if (jenisPasien === "bpjs") {
    return (
      <RegistrationShell
        current={1}
        subtitle="Pendaftaran peserta BPJS Kesehatan melalui Mobile JKN"
      >
        <div className="mx-auto max-w-[640px]">
          <MobileJKNRedirect onBack={() => setJenisPasien(null)} />
        </div>
      </RegistrationShell>
    );
  }

  // ── Render: Umum — NIK Check + Form ──────────────────────────────────────
  return (
    <RegistrationShell
      current={1}
      subtitle="Isi data diri Anda untuk melanjutkan ke pemilihan jadwal kunjungan"
    >
      <Reveal direction="up">
        <div
          className="grid lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]"
          style={{ gap: "var(--gap-cards)" }}
        >
          {/* ── Form Area ── */}
          <section aria-label="Formulir pendaftaran" className={cn(softCardClass, "p-5 sm:p-6")}>
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
                      className="btn-shine h-12 shrink-0 rounded-full bg-[#00b4d8] px-5 t-body font-medium text-white shadow-md shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#06a8ca] disabled:opacity-50 disabled:hover:translate-y-0"
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
                      className="btn-shine mt-4 h-12 w-full rounded-full bg-[#00b4d8] t-body font-medium text-white shadow-md shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#06a8ca]"
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
                      className="btn-shine h-12 w-full rounded-full bg-[#00b4d8] t-body font-medium text-white shadow-lg shadow-[#00b4d8]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#06a8ca]"
                    >
                      Lanjut ke Jadwal Kunjungan
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </section>

          {/* ── Sidebar ── */}
          <aside className="hidden flex-col gap-4 lg:sticky lg:top-6 lg:flex lg:self-start">
            <div className={cn(softCardClass, "p-5")}>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00b4d8]/10">
                  <Info className="h-5 w-5 text-[#00b4d8]" />
                </div>
                <h2 className="t-h4 font-bold text-slate-900">
                  Yang perlu disiapkan
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00b4d8]/10">
                    <UserRound className="h-4 w-4 text-[#0f4c81]" />
                  </div>
                  <div>
                    <div className="t-body font-medium text-slate-900">KTP / Kartu Identitas</div>
                    <div className="t-caption text-slate-500">
                      Untuk verifikasi data diri pasien
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8861e]/10">
                    <WalletCards className="h-4 w-4 text-[#e8861e]" />
                  </div>
                  <div>
                    <div className="t-body font-medium text-slate-900">
                      Kartu Asuransi{" "}
                      <span className="text-slate-400">(jika ada)</span>
                    </div>
                    <div className="t-caption text-slate-500">
                      Untuk pasien dengan asuransi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <HelpCard />
          </aside>

          {/* ── Mobile accordion ── */}
          <details className={cn(softCardClass, "p-4 lg:hidden")}>
            <summary className="cursor-pointer t-body font-semibold text-slate-900">
              Lihat info bantuan pendaftaran
            </summary>
            <div className="mt-4 space-y-3 t-body-sm text-slate-500">
              <p>Siapkan KTP untuk verifikasi data pasien.</p>
              <p>Khusus pasien umum, BPJS gunakan Mobile JKN.</p>
            </div>
          </details>
        </div>
      </Reveal>
    </RegistrationShell>
  );
}
