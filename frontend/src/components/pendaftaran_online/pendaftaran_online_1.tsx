"use client";

import {
	CalendarDays,
	Info,
	MessageCircle,
	UserRound,
	WalletCards,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Input } from "@/src/UiKecil/input";
import { ToggleGroup, ToggleGroupItem } from "@/src/UiKecil/toggle-group";
import { Textarea } from "@/src/UiKecil/textarea";
import Link from "next/link";
import Navbar from "@/src/components/navbar";

const personalFields = [
	{ id: "nama-lengkap", label: "NAMA LENGKAP", placeholder: "Nama Sesuai KTP" },
	{ id: "no-hp", label: "NO. HP/WHATSAPP", placeholder: "Contoh: 08123456789" },
	{ id: "tanggal-lahir", label: "TANGGAL LAHIR", placeholder: "Nama Sesuai KTP" },
	{ id: "nik", label: "NIK", placeholder: "16 Digit Nomor KTP" },
	{ id: "tanggal-kunjungan", label: "TANGGAL KUNJUNGAN", placeholder: "dd/mm/yyyy" },
	{ id: "waktu", label: "WAKTU", placeholder: "hh:mm" },
	{ id: "nama-orangtua", label: "NAMA ORANGTUA", placeholder: "Ayah / Ibu" },
	{ id: "penanggung-jawab", label: "PENANGGUNG JAWAB", placeholder: "Nama Wali" },
];

const textAreaFields = [
	{ id: "keluhan", label: "KELUHAN", placeholder: "Ceritakan keluhan Anda" },
	{ id: "alamat", label: "ALAMAT", placeholder: "Alamat Lengkap" },
];

const steps = [
	{ number: 1, label: "Data diri", active: true },
	{ number: 2, label: "Kunjungan", active: false },
	{ number: 3, label: "Konfirmasi", active: false },
];

const inputClass =
	"h-12 rounded-full border border-[#8f8f8f] bg-[#f7f5f2] px-4 t-body text-black placeholder:text-[#b3b3b3] focus-visible:ring-0";
const labelClass = "t-body-sm font-bold uppercase tracking-wide text-black";

export default function FormulirPendaftaran() {
	const [gender, setGender] = useState("Laki-Laki");
	const [patientType, setPatientType] = useState("BPJS");

	return (
		<main className="min-h-screen bg-[#f7f5f2]">
			<Navbar />
			<section className="section-wrap">
				<Card className="card-radius border border-black/5 bg-[#efefed] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]">
					<CardContent className="card-base">
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

						<div className="mx-auto mt-8 flex max-w-[820px] flex-wrap items-center justify-center gap-3 sm:gap-4">
							{steps.map((step, index) => (
								<div key={step.number} className="flex items-center">
									<button
										type="button"
										aria-current={step.active ? "step" : undefined}
										className="flex items-center gap-2"
									>
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
											className={`t-body-sm font-medium ${
												step.active ? "text-[#1117ff]" : "text-[#a4a4a4]"
											} max-[639px]:hidden`}
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

						<div
							className="mt-10 grid lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]"
							style={{ gap: "var(--gap-cards)" }}
						>
							<section aria-label="Formulir pendaftaran">
								<form className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
									{personalFields.slice(0, 2).map((field) => (
										<div key={field.id} className="space-y-2">
											<label htmlFor={field.id} className={labelClass}>
												{field.label}
											</label>
											<Input
												id={field.id}
												defaultValue=""
												placeholder={field.placeholder}
												className={inputClass}
											/>
										</div>
									))}

									<div className="space-y-2">
										<label htmlFor="tanggal-lahir" className={labelClass}>
											TANGGAL LAHIR
										</label>
										<Input
											id="tanggal-lahir"
											defaultValue=""
											placeholder="Nama Sesuai KTP"
											className={inputClass}
										/>
									</div>

									<div className="space-y-2">
										<fieldset>
											<legend className={labelClass}>JENIS KELAMIN</legend>
											<ToggleGroup
												type="single"
												value={gender}
												onValueChange={(v: string) => v && setGender(v)}
												className="mt-3 flex flex-wrap items-center gap-8"
											>
												{["Laki-Laki", "Perempuan"].map((option) => {
													const isSelected = gender === option;
													return (
														<div key={option} className="flex items-center gap-2">
															<ToggleGroupItem
																value={option}
																id={option}
																className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#d9d9d9] bg-transparent p-0 shadow-none data-[state=on]:border-[#1d19ff] data-[state=on]:bg-white"
															>
																<span
																	className={`h-3 w-3 rounded-full ${
																		isSelected ? "bg-[#1d19ff]" : "bg-transparent"
																	}`}
																/>
															</ToggleGroupItem>
															<label
																htmlFor={option}
																className="translate-y-[1px] t-body font-medium leading-none text-black"
															>
																{option}
															</label>
														</div>
													);
												})}
											</ToggleGroup>
										</fieldset>
									</div>

									<div className="space-y-2">
										<label htmlFor="nik" className={labelClass}>NIK</label>
										<Input
											id="nik"
											defaultValue=""
											placeholder="16 Digit Nomor KTP"
											className={inputClass}
										/>
									</div>

									<div className="space-y-2">
										<fieldset>
											<legend className={labelClass}>JENIS PASIEN</legend>
											<ToggleGroup
												type="single"
												value={patientType}
												onValueChange={(v: string) => v && setPatientType(v)}
												className="mt-3 flex flex-wrap items-center gap-8"
											>
												{["BPJS", "UMUM"].map((option) => {
													const isSelected = patientType === option;
													return (
														<div key={option} className="flex items-center gap-2">
															<ToggleGroupItem
																value={option}
																id={option}
																className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#d9d9d9] bg-transparent p-0 shadow-none data-[state=on]:border-[#1d19ff] data-[state=on]:bg-white"
															>
																<span
																	className={`h-3 w-3 rounded-full ${
																		isSelected ? "bg-[#1d19ff]" : "bg-transparent"
																	}`}
																/>
															</ToggleGroupItem>
															<label
																htmlFor={option}
																className="translate-y-[1px] t-body font-medium leading-none text-black"
															>
																{option}
															</label>
														</div>
													);
												})}
											</ToggleGroup>
										</fieldset>
									</div>

									{personalFields.slice(4).map((field) => (
										<div key={field.id} className="space-y-2">
											<label htmlFor={field.id} className={labelClass}>
												{field.label}
											</label>
											<Input
												id={field.id}
												defaultValue=""
												placeholder={field.placeholder}
												className={inputClass}
											/>
										</div>
									))}

									{textAreaFields.map((field) => (
										<div key={field.id} className="space-y-2">
											<label htmlFor={field.id} className={labelClass}>
												{field.label}
											</label>
											<Textarea
												id={field.id}
												defaultValue=""
												placeholder={field.placeholder}
												className="min-h-[96px] resize-none rounded-[18px] border border-[#8f8f8f] bg-[#f7f5f2] px-4 py-3 t-body text-black placeholder:text-[#b3b3b3] focus-visible:ring-0"
											/>
										</div>
									))}
								</form>
							</section>

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
													<div className="t-body text-black">
														KTP / Kartu Identitas
													</div>
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
														Kartu BPJS{" "}
														<span className="text-black/30">(jika ada)</span>
													</div>
													<div className="t-caption font-medium text-[#7f7f7f]">
														Untuk pasien peserta BPJS Kesehatan
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
											<h2 className="t-h4 font-medium text-white">
												Butuh bantuan?
											</h2>
										</div>
										<p className="mt-2 t-caption font-medium text-white/95">
											Kesulitan mengisi formulir? Hubungi kami via WhatsApp dan
											tim kami akan membantu proses pendaftaran Anda
										</p>
										<Button className="mt-4 h-11 rounded-full bg-[#008000] px-5 t-body-sm text-white hover:bg-[#007000]">
											<MessageCircle className="mr-2 h-4 w-4 fill-current" />
											Chat Whatsapp
										</Button>
									</CardContent>
								</Card>

								<div className="pt-2">
									<Button
										className="h-12 w-full rounded-full bg-[#08b4d8] t-body font-medium text-white shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#06a8ca]"
										asChild
									>
										<Link href="/pendaftaran_online_2">Daftar</Link>
									</Button>
								</div>
							</aside>

							<details className="rounded-2xl border border-[#8f8f8f] bg-[#f7f5f2] p-4 lg:hidden">
								<summary className="cursor-pointer t-body font-semibold text-black">
									Lihat info bantuan pendaftaran
								</summary>
								<div className="mt-4 space-y-3 t-body-sm text-[#5f5f5f]">
									<p>
										Siapkan KTP atau kartu identitas untuk verifikasi data
										pasien.
									</p>
									<p>
										Jika peserta BPJS, siapkan kartu BPJS saat datang ke
										klinik.
									</p>
									<Button
										className="h-11 rounded-full bg-[#08b4d8] px-5 t-body-sm text-white"
										asChild
									>
										<Link href="/pendaftaran_online_2">
											Lanjut ke kunjungan
										</Link>
									</Button>
								</div>
							</details>
						</div>
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
