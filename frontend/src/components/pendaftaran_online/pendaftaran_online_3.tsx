"use client";

import { ArrowLeft, ArrowRight, CalendarDays, Check, MessageCircle } from "lucide-react";
import { Button } from "@/src/UiKecil/button";
import { Card, CardContent } from "@/src/UiKecil/card";
import Link from "next/link";

function RegistrationSummarySection() {
	const personalInfoColumns = [
		[
			{ label: "NAMA LENGKAP", value: "Sandradinata" },
			{ label: "TANGGAL LAHIR", value: "25 AGUSTUS 2000" },
			{ label: "NO. HP / WHATSAPP", value: "0812-3456-7890" },
		],
		[
			{ label: "NIK", value: "2702********4321" },
			{ label: "JENIS KELAMIN", value: "Perempuan" },
			{ label: "JENIS PASIEN", value: "BPJS" },
		],
	];

	return (
		<section aria-label="Ringkasan data diri" className="w-full">
			<Card className="w-full card-radius border border-black bg-[#f7f5f2] shadow-none">
				<CardContent className="card-base">
					<div className="flex flex-col gap-5">
						<header className="flex items-start justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#d9d9d9]">
									<Check className="h-[18px] w-[18px] text-[#8f9aa3]" aria-hidden="true" />
								</div>
								<h2 className="t-h3 font-bold leading-none text-black">
									Data diri
								</h2>
							</div>
						</header>
						<div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
							{personalInfoColumns.map((column, columnIndex) => (
								<div key={`column-${columnIndex}`} className="space-y-3">
									{column.map((item) => (
										<dl key={item.label} className="space-y-0.5">
											<dt className="t-caption font-medium text-[#9b9b9b]">
												{item.label}
											</dt>
											<dd className="t-body font-normal text-black">
												{item.value}
											</dd>
										</dl>
									))}
								</div>
							))}
						</div>
						<dl className="space-y-0.5">
							<dt className="t-caption font-medium text-[#9b9b9b]">ALAMAT</dt>
							<dd className="t-body font-normal text-black">
								Dusun Krajan RT.01 RW.03, Desa Tirtomarto, Kec. Ampelgading,
								Kab. Malang
							</dd>
						</dl>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

function VisitDetailSummarySection() {
	const summaryFields = [
		{ label: "TANGGAL KUNJUNGAN", value: "Sabtu, 2 Mei 2026" },
		{ label: "WAKTU KUNJUNGAN", value: "10:00 WIB" },
	];

	const doctorInfo = {
		initials: "NF",
		name: "dr. Nikma Fitriasari, MMRS",
		specialty: "Dokter umum",
		schedule: ["Sabtu - minggu", "24 jam"],
	};

	return (
		<section className="relative w-full">
			<Card className="w-full card-radius border border-black bg-[#f7f5f2] shadow-none">
				<CardContent className="card-base">
					<div className="flex flex-col gap-5">
						<header className="flex items-start justify-between gap-4">
							<div className="flex min-w-0 items-center gap-3">
								<div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[10px] bg-[#ffc4c4]">
									<CalendarDays className="h-7 w-7 text-[#d25555]" />
								</div>
								<h2 className="t-h3 font-bold leading-snug text-black">
									Detail kunjungan
								</h2>
							</div>
						</header>
						<div>
							<div className="inline-flex items-center gap-2 rounded-[10px] bg-[#d9d9d9] px-3 py-1.5">
								<MessageCircle className="h-5 w-5 text-[#992525]" />
								<span className="t-body font-medium text-[#992525]">UGD</span>
							</div>
						</div>
						<div className="rounded-[20px] border border-white bg-[#80808033] px-4 py-4">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex min-w-0 items-center gap-3">
									<div className="flex h-[51px] w-[51px] shrink-0 items-center justify-center rounded-full bg-[#800080]">
										<span className="t-body font-medium leading-normal text-white">
											{doctorInfo.initials}
										</span>
									</div>
									<div className="min-w-0">
										<h3 className="t-h3 font-bold leading-snug text-black">
											{doctorInfo.name}
										</h3>
										<div className="t-body font-medium text-[#00000080]">
											{doctorInfo.specialty}
										</div>
									</div>
								</div>
								<div className="shrink-0 text-left sm:text-right">
									{doctorInfo.schedule.map((item) => (
										<div
											key={item}
											className="t-body font-medium text-[#00000080]"
										>
											{item}
										</div>
									))}
								</div>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
							{summaryFields.map((field, index) => (
								<div key={`${field.label}-${index}`} className="flex flex-col">
									<span className="t-caption font-medium text-[#b3b3b3]">
										{field.label}
									</span>
									<span className="t-body-lg font-normal text-black">
										{field.value}
									</span>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

function ConsentDeclarationSection() {
	return (
		<section className="w-full">
			<div className="flex items-start gap-3 t-body text-black">
				<div className="mt-1 flex h-5 w-5 items-center justify-center rounded border border-[#13c6f3] bg-[#13c6f3] text-white">
					<Check className="h-4 w-4" />
				</div>
				<div className="cursor-pointer t-body text-black">
					<span className="font-bold">
						Saya menyatakan data yang diisi sudah benar
					</span>
					<span className="font-medium">
						{" "}
						dan bersedia dihubungi oleh tim Klinik Rawat Inap Ampelgading
						Medical Centre untuk konfirmasi kunjungan.
					</span>
				</div>
			</div>
		</section>
	);
}

export default function PendaftaranOnlineKonfirmasiSection() {
	return (
		<section
			id="step-3"
			className="section-wrap card-radius bg-[#e7e7e752] shadow-[inset_0px_4px_4px_#0000001a]"
		>
			<div>
				<div className="flex flex-col items-center">
					<div className="flex items-center gap-3">
						<CalendarDays className="h-10 w-10 text-[#8da9c9]" />
						<h1 className="t-h2 font-medium uppercase tracking-wide text-[#00b4d8]">
							PENDAFTARAN ONLINE
						</h1>
					</div>
					<p className="mt-4 text-center t-body-lg font-medium text-black">
						Konfirmasi pendaftaran
						<br />
						Periksa kembali data anda sebelum mengirim
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
						{[
							{ number: 1, label: "Data diri", done: true },
							{ number: 2, label: "Kunjungan", done: true },
							{ number: 3, label: "Konfirmasi", done: false },
						].map((step, index) => (
							<div key={step.label} className="flex items-center">
								<div className="flex items-center gap-3">
									<div
										className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${
											step.done
												? "bg-[#008000]"
												: step.number === 3
													? "bg-[#1d19ff] text-white"
													: "bg-[#b4b4b4] text-[#494949]"
										}`}
									>
										{step.done ? (
											<Check className="h-4 w-4 text-white" />
										) : (
											<span className="t-body-sm font-medium">
												{step.number}
											</span>
										)}
									</div>
									<span
										className={`t-body-sm font-medium max-[639px]:hidden ${
											step.done
												? "text-[#008000]"
												: step.number === 3
													? "text-[#0000ff]"
													: "text-[#a4a4a4]"
										}`}
									>
										{step.label}
									</span>
								</div>
								{index < 2 && (
									<div
										className={`mx-5 hidden h-px w-[80px] md:block ${
											index === 0 ? "bg-[#7aa66e]" : "bg-[#9a9a9a]"
										}`}
									/>
								)}
							</div>
						))}
					</div>
				</div>

				<div className="mt-10" style={{ display: "grid", gap: "var(--gap-cards)" }}>
					<RegistrationSummarySection />
					<VisitDetailSummarySection />
				</div>

				<div className="mt-6 flex items-start gap-3">
					<div className="mt-1 flex h-[30px] w-[30px] items-center justify-center rounded-[10px] bg-[#00b4d8]">
						<Check className="h-[18px] w-[18px] text-white" />
					</div>
					<div className="flex-1">
						<ConsentDeclarationSection />
					</div>
				</div>

				<div className="mt-8 flex flex-col items-center justify-between gap-6 lg:flex-row">
					<div className="order-2 w-full lg:order-1 lg:w-auto">
						<p className="text-center t-body font-medium text-[#b3b3b3] lg:text-left">
							Data Anda aman dan hanya digunakan untuk keperluan administrasi
							klinik
						</p>
					</div>
					<div className="order-1 flex w-full flex-col gap-4 sm:flex-row sm:justify-end lg:order-2 lg:w-auto">
						<Button
							type="button"
							variant="outline"
							className="h-12 rounded-full border-2 border-black bg-transparent px-6 t-body font-medium text-black shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-transparent"
							asChild
						>
							<Link href="/pendaftaran_online_2">
								<ArrowLeft className="mr-2 h-5 w-5" />
								Kembali
							</Link>
						</Button>
						<Button
							type="button"
							className="h-12 rounded-full bg-[#00b4d8] px-6 t-body font-medium text-white shadow-[0px_4px_33px_6px_#4a445d29] hover:bg-[#00b4d8]/90"
							asChild
						>
							<Link href="/laman_konfirmasi_pendaftaran">
								Lanjut konfirmasi
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
