"use client";

import { Check, Home, MessageCircle, Pencil, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import Navbar from "@/src/components/navbar";

const personalInfoLeft = [
	{ label: "NAMA LENGKAP", value: "Sandradinata" },
	{ label: "TANGGAL LAHIR", value: "25 AGUSTUS 2000" },
	{ label: "NO. HP / WHATSAPP", value: "0812-3456-7890" },
];

const personalInfoRight = [
	{ label: "NIK", value: "2702********4321" },
	{ label: "JENIS KELAMIN", value: "Perempuan" },
	{ label: "JENIS PASIEN", value: "BPJS" },
];

const actionButtons = [
	{
		label: "Ke beranda",
		icon: Home,
		href: "/",
		external: false,
		className: "bg-[#00b4d8] text-white hover:bg-[#00a7c9]",
	},
	{
		label: "Whatsapp",
		icon: MessageCircle,
		href: "https://wa.me/6281225566055",
		external: true,
		className: "bg-[#008000] text-white hover:bg-[#0a720a]",
	},
] as const;

export default function LamanKonfirmasiPendaftaran() {
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
							<div className="relative w-full card-radius border border-black/10 bg-[#f7f5f2] px-5 py-5 opacity-50 shadow-sm">
								<Card className="w-full border-0 bg-transparent shadow-none">
									<CardContent className="p-0">
										<header className="mb-6 flex items-start justify-between gap-4">
											<div className="flex min-w-0 items-center gap-3">
												<div className="flex h-[50px] w-[50px] items-center justify-center rounded-[10px] bg-[#d9d9d9]">
													<User className="h-7 w-7 text-black" />
												</div>
												<h2 className="t-h3 font-bold leading-none text-black">
													Data diri
												</h2>
											</div>
											<Button
												type="button"
												variant="ghost"
												className="h-auto p-0 t-body font-medium text-[#00b4d8] hover:bg-transparent hover:text-[#00b4d8]"
											>
												<Pencil className="mr-2 h-5 w-5" />
												ubah
											</Button>
										</header>

										<div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
											<div className="grid gap-y-6">
												{personalInfoLeft.map((field) => (
													<div key={field.label} className="min-w-0">
														<p className="t-caption font-medium text-[#b3b3b3]">
															{field.label}
														</p>
														<p className="t-body-lg font-normal text-black">
															{field.value}
														</p>
													</div>
												))}

												<div className="min-w-0">
													<p className="t-caption font-medium text-[#b3b3b3]">
														ALAMAT
													</p>
													<p className="t-body-lg font-normal text-black">
														Dusun Krajan RT.01 RW.03, Desa Tirtomarto, Kec.
														Ampelgading, Kab. Malang
													</p>
												</div>
											</div>

											<div className="grid content-start gap-y-6">
												{personalInfoRight.map((field) => (
													<div key={field.label} className="min-w-0">
														<p className="t-caption font-medium text-[#b3b3b3]">
															{field.label}
														</p>
														<p className="t-body-lg font-normal text-black">
															{field.value}
														</p>
													</div>
												))}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							<section className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center px-4 pt-6">
								<Card className="w-full max-w-[744px] card-radius border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
									<CardContent className="card-base flex flex-col items-center text-center">
										<div className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#d9d9d9]">
											<Check
												className="h-9 w-9 text-[#6d8f46]"
												strokeWidth={2.2}
											/>
										</div>
										<h3 className="t-h3 font-medium text-black">
											Pendaftaran berhasil!
										</h3>
										<p className="mt-3 t-body font-normal text-[#6f6f6f]">
											Terima kasih telah mendaftar di KRI Ampelgading Medical
											Centre
										</p>
									</CardContent>
								</Card>
							</section>

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
												<h2 className="t-h2 font-normal text-black">
													Pendaftaran berhasil!
												</h2>
												<p className="mt-4 max-w-[663px] t-body-lg font-normal text-[#6b6b6b]">
													Terima kasih telah mendaftar di KRI Ampelgading
													Medical Centre
												</p>
											</header>
											<div className="mt-6 inline-flex items-center justify-center rounded-[50px] bg-[#d7c6ff] px-6 py-3">
												<span className="t-body-lg font-medium text-[#1e00a7]">
													# REG-20260502-0021
												</span>
											</div>
											<p className="mt-6 max-w-[1190px] t-body font-normal text-[#6b6b6b]">
												Tim kami akan menghubungi Anda via WhatsApp di nomor{" "}
												<span className="font-bold">0812-3456-7890</span> dalam
												waktu <span className="font-bold">1×24 jam</span> untuk
												konfirmasi jadwal kunjungan.
											</p>
											<p className="mt-4 max-w-[585px] t-body font-normal text-[#6b6b6b]">
												Harap membawa KTP dan Kartu BPJS saat datang ke klinik
											</p>
											<nav
												className="mt-8 grid w-full max-w-[930px] grid-cols-1 sm:grid-cols-2"
												style={{ gap: "var(--gap-cards)" }}
											>
												{actionButtons.map((action) => {
													const Icon = action.icon;
													const linkProps = action.external
														? {
																target: "_blank",
																rel: "noopener noreferrer",
															}
														: {};

													return (
														<Button
															key={action.label}
															type="button"
															asChild
															className={`h-12 w-full rounded-full px-6 t-body font-medium ${action.className}`}
														>
															<Link href={action.href} {...linkProps}>
																<span className="flex items-center justify-center gap-3">
																	<Icon className="h-5 w-5" />
																	<span>{action.label}</span>
																</span>
															</Link>
														</Button>
													);
												})}
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
