"use client";

import {
	ArrowLeft,
	ArrowRight,
	Baby,
	CalendarDays,
	Check,
	ClipboardList,
	FlaskConical,
	Hospital,
	MessageCircle,
	Phone,
	Stethoscope,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import { Separator } from "@/src/UiKecil/separator";
import Link from "next/link";
import Navbar from "@/src/components/navbar";

const services = [
	{ id: "ugd", title: "UGD", subtitle: "Gawat darurat 24 jam", icon: SirenIcon, selected: true },
	{ id: "poli-umum", title: "Poli umum", subtitle: "Pemeriksaan & konsultasi", icon: Stethoscope, selected: false },
	{ id: "poli-gigi", title: "Poli gigi", subtitle: "Pemeriksaan & konsultasi", icon: ClipboardList, selected: false },
	{ id: "rawat-inap", title: "Rawat inap", subtitle: "Perawatan menginap", icon: Hospital, selected: false },
	{ id: "persalinan", title: "Persalinan", subtitle: "Proses bersalin", icon: Baby, selected: false },
	{ id: "laboratorium", title: "Laboratorium", subtitle: "Cek darah & urine", icon: FlaskConical, selected: false },
] as const;

const doctors = [
	{ id: "nikma-fitriasari", initials: "NF", name: "dr. Nikma Fitriasari, MMRS", specialty: "Dokter umum", schedule: "Sabtu - minggu\n24 jam", selected: true, avatarClass: "bg-[#8e24aa]" },
	{ id: "dina-andriana", initials: "DA", name: "drg. Dina Andriana", specialty: "Dokter gigi", schedule: "Rab-Jum 15:00-21:00\nSab-Min 08.00-14.00", selected: false, avatarClass: "bg-[#41a62a]" },
	{ id: "ikhwan-rizki-rasyit", initials: "DA", name: "dr. Ikhwan Rizki Rasyit T.", specialty: "Dokter umum", schedule: "Rab-Jum 15:00-21:00\nSab-Min 08.00-14.00", selected: false, avatarClass: "bg-[#41a62a]" },
	{ id: "m-angga-dewa-sudin", initials: "DA", name: "dr. M. Angga Dewa Sudin", specialty: "Dokter umum", schedule: "Rab-Jum 15:00-21:00\nSab-Min 08.00-14.00", selected: false, avatarClass: "bg-[#41a62a]" },
] as const;

const summaryRows = [
	{ label: "Nama", value: "Sandradinata" },
	{ label: "Nik", value: "2702********4321" },
	{ label: "Tgl lahir", value: "25/08/2000" },
	{ label: "Jenis kelamin", value: "Perempuan" },
	{ label: "NO. HP", value: "0812-3456-7890" },
	{ label: "Jenis pasien", value: "BPJS" },
] as const;

export default function FormulirPendaftaran() {
	const [selectedService, setSelectedService] = React.useState<(typeof services)[number]["id"]>(services[0].id);
	const [selectedDoctor, setSelectedDoctor] = React.useState<(typeof doctors)[number]["id"]>(doctors[0].id);

	return (
		<main className="min-h-screen bg-[#f7f5f2]">
			<Navbar />

			<div className="section-wrap">
				<section className="card-radius border border-black/5 bg-[#e7e7e752] shadow-[inset_0px_4px_4px_#0000001a]">
					<div className="card-base">
						<div className="mx-auto flex max-w-[1360px] flex-col items-center">
							<div className="mb-2 flex items-center gap-3">
								<CalendarDays className="h-10 w-10 text-[#87a8d9]" />
								<h1 className="t-h2 text-center font-medium uppercase tracking-wide text-[#00b4d8]">
									Pendaftaran Online
								</h1>
							</div>
							<p className="mb-8 text-center t-body-lg font-medium text-black">
								Pilih layanan dan dokter
							</p>

							<div className="mb-11 flex flex-wrap items-center justify-center gap-4">
								<div className="flex items-center gap-3">
									<div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#008000]">
										<Check className="h-4 w-4 text-white" />
									</div>
									<span className="t-body-sm font-medium text-[#008000]">
										Data diri
									</span>
								</div>
								<div className="hidden h-px w-[74px] bg-[#77b36c] sm:block" />
								<div className="flex items-center gap-3">
									<div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#1d19ff] text-white">
										<span className="t-body-sm font-medium">2</span>
									</div>
									<span className="t-body-sm font-medium text-[#0000ff]">
										Kunjungan
									</span>
								</div>
								<div className="hidden h-px w-[74px] bg-[#9a9a9a] sm:block" />
								<div className="flex items-center gap-3">
									<div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#b4b4b4] text-[#494949]">
										<span className="t-body-sm font-medium">3</span>
									</div>
									<span className="t-body-sm font-medium text-[#0000ff]">
										Konfirmasi
									</span>
								</div>
							</div>

							<div
								className="grid w-full max-w-[1370px] grid-cols-1 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]"
								style={{ gap: "var(--gap-cards)" }}
							>
								<section>
									<div
										className="grid grid-cols-1 sm:grid-cols-2"
										style={{ gap: "var(--gap-cards)" }}
									>
										{services.map((service) => {
											const IconComponent = service.icon;
											const isSelected = selectedService === service.id;

											return (
												<button
													key={service.id}
													type="button"
													onClick={() => setSelectedService(service.id)}
													className="text-left"
												>
													<Card
														className={`card-radius border shadow-none ${
															isSelected
																? "border-[#5d5dff] bg-[#0000ff33]"
																: "border-black bg-[#f7f5f2]"
														}`}
													>
														<CardContent className="flex min-h-[84px] items-center gap-3 px-4 py-4">
															<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#e5defc]">
																<IconComponent
																	className={`h-[22px] w-[22px] ${
																		service.id === "ugd"
																			? "text-[#d95b4f]"
																			: "text-[#87a8d9]"
																	}`}
																/>
															</div>
															<div className="min-w-0 flex-1">
																<h3 className="t-h4 font-bold leading-tight text-black">
																	{service.title}
																</h3>
																<div className="t-body-sm font-medium leading-tight text-black/50">
																	{service.subtitle}
																</div>
															</div>
															<div
																className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-black ${
																	isSelected ? "bg-[#0000ff]" : "bg-[#d9d9d9]"
																}`}
															>
																{isSelected ? (
																	<Check className="h-3.5 w-3.5 text-white" />
																) : null}
															</div>
														</CardContent>
													</Card>
												</button>
											);
										})}
									</div>

									<div className="mt-2 pt-5">
										<Separator className="mb-4 bg-black/50" />
										<div className="mb-4 flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#e5defc]">
												<Stethoscope className="h-5 w-5 text-[#87a8d9]" />
											</div>
											<h2 className="t-h2 font-bold leading-tight text-black">
												Pilih dokter
											</h2>
										</div>

										<div className="space-y-3">
											{doctors.map((doctor) => {
												const isSelected = selectedDoctor === doctor.id;

												return (
													<button
														key={doctor.id}
														type="button"
														onClick={() => setSelectedDoctor(doctor.id)}
														className="block w-full text-left"
													>
														<Card
															className={`card-radius border shadow-none ${
																isSelected
																	? "border-[#5d5dff] bg-[#0000ff33]"
																	: "border-black bg-[#f7f5f2]"
															}`}
														>
															<CardContent className="flex min-h-[84px] items-center gap-3 px-4 py-4">
																<div
																	className={`flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full t-body-sm font-medium text-white ${doctor.avatarClass}`}
																>
																	{doctor.initials}
																</div>
																<div className="min-w-0 flex-1">
																	<h3 className="t-h4 font-bold leading-tight text-black">
																		{doctor.name}
																	</h3>
																	<div className="t-body-sm font-medium leading-tight text-black/50">
																		{doctor.specialty}
																	</div>
																</div>
																<div className="min-w-[146px] pr-1 text-right t-body-sm font-medium leading-snug whitespace-pre-line text-black/50">
																	{doctor.schedule}
																</div>
																<div
																	className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-black ${
																		isSelected ? "bg-[#0000ff]" : "bg-[#d9d9d9]"
																	}`}
																>
																	{isSelected ? (
																		<Check className="h-3.5 w-3.5 text-white" />
																	) : null}
																</div>
															</CardContent>
														</Card>
													</button>
												);
											})}
										</div>

										<div className="mt-6 flex flex-wrap items-center gap-3">
											<Button
												variant="outline"
												className="h-12 rounded-full border-2 border-black bg-[#f7f5f2] px-6 t-body font-medium text-black shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#f2efea]"
												asChild
											>
												<Link href="/pendaftaran_online_1">
													<ArrowLeft className="mr-2 h-5 w-5" />
													Kembali
												</Link>
											</Button>
											<Button
												className="h-12 rounded-full bg-[#00b4d8] px-6 t-body font-medium text-white shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#05abce]"
												asChild
											>
												<Link href="/pendaftaran_online_3">
													Lanjut konfirmasi
													<ArrowRight className="ml-2 h-5 w-5" />
												</Link>
											</Button>
										</div>
									</div>
								</section>

								<aside className="hidden flex-col gap-5 lg:flex">
									<Card className="card-radius border border-black bg-[#f7f5f2] shadow-none">
										<CardContent className="card-base">
											<div className="mb-3 flex items-center gap-3">
												<ClipboardList className="h-6 w-6 text-[#87a8d9]" />
												<h3 className="t-h3 font-bold text-black">
													Ringkasan data diri
												</h3>
											</div>
											<div>
												{summaryRows.map((row, index) => (
													<div key={row.label}>
														<div className="grid grid-cols-[140px_1fr] items-center gap-4 py-2 t-body">
															<div className="font-medium text-[#b3b3b3]">
																{row.label}
															</div>
															<div className="text-right text-black">
																{row.value}
															</div>
														</div>
														{index < summaryRows.length - 1 ? (
															<Separator className="bg-black/20" />
														) : null}
													</div>
												))}
											</div>
										</CardContent>
									</Card>

									<Card className="card-radius border-0 bg-[#00b4d8] text-white shadow-[0px_4px_33px_6px_#4a445d29]">
										<CardContent className="card-base">
											<div className="mb-3 flex items-center gap-2">
												<Phone className="h-5 w-5" />
												<h3 className="t-h3 font-medium">Butuh bantuan?</h3>
											</div>
											<p className="mb-5 max-w-[430px] t-body font-medium text-white">
												Tim kami siap membantu Anda memilih layanan yang tepat
											</p>
											<Button
												className="h-12 rounded-full bg-[#0d8f1f] px-5 t-body font-medium text-white shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#0b831b]"
												asChild
											>
												<Link
													href="https://wa.me/6281225566055"
													target="_blank"
													rel="noopener noreferrer"
												>
													<MessageCircle className="mr-2 h-5 w-5 fill-white text-white" />
													Chat Whatsapp
												</Link>
											</Button>
										</CardContent>
									</Card>
								</aside>

								<details className="rounded-2xl border border-black/20 bg-[#f7f5f2] p-4 lg:hidden">
									<summary className="cursor-pointer t-body font-semibold text-black">
										Lihat ringkasan data
									</summary>
									<div className="mt-3 space-y-2 t-body-sm text-[#5f5f5f]">
										{summaryRows.slice(0, 4).map((row) => (
											<div key={row.label} className="flex justify-between gap-3">
												<span>{row.label}</span>
												<span className="font-medium text-black">
													{row.value}
												</span>
											</div>
										))}
									</div>
								</details>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

function SirenIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path d="M8 14V11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M6 14H18V17C18 17.5523 17.5523 18 17 18H7C6.44772 18 6 17.5523 6 17V14Z" stroke="currentColor" strokeWidth="1.8" />
			<path d="M4 18H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M12 3V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M5 7L6.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<path d="M19 7L17.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
		</svg>
	);
}
