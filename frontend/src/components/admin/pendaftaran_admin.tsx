"use client";

import {
	ChevronLeft,
	ChevronRight,
	Check,
	ClipboardCheck,
	Download,
	Eye,
	MessageCircle,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import SidebarAdmin from "@/src/components/admin/sidebar_admin";

type RegistrationRow = {
	noReg: string;
	name: string;
	phone: string;
	service: string;
	doctor: string;
	date: string;
	type: string;
	status: "Menunggu" | "Dikonfirmasi" | "Selesai" | "Dibatalkan";
	avatar: string;
	avatarClassName: string;
};

const filterTabs = [
	{ label: "Semua", count: 48, active: true },
	{ label: "Menunggu", count: 12, active: false },
	{ label: "Dikonfirmasi", count: 18, active: false },
	{ label: "Selesai", count: 0, active: false },
	{ label: "Dibatalkan", count: 0, active: false },
] as const;

const rows: RegistrationRow[] = [
	{
		noReg: "REG-0048",
		name: "Ahmad Ridwan",
		phone: "0812-3456-7890",
		service: "Poli Umum",
		doctor: "dr. Angga",
		date: "12/05/26",
		type: "BPJS",
		status: "Menunggu",
		avatar: "AR",
		avatarClassName: "bg-sky-600",
	},
	{
		noReg: "REG-0047",
		name: "Rina Safitri",
		phone: "0856-1234-5678",
		service: "Poli Gigi",
		doctor: "drg. Dina",
		date: "12/05/26",
		type: "Umum",
		status: "Menunggu",
		avatar: "RS",
		avatarClassName: "bg-violet-600",
	},
	{
		noReg: "REG-0046",
		name: "Suhartini",
		phone: "0813-5678-9012",
		service: "Rawat Inap",
		doctor: "dr. Ikhwan",
		date: "11/05/26",
		type: "BPJS",
		status: "Dikonfirmasi",
		avatar: "SH",
		avatarClassName: "bg-emerald-600",
	},
	{
		noReg: "REG-0045",
		name: "Dewi Masruroh",
		phone: "0857-9012-3456",
		service: "Persalinan",
		doctor: "dr. Nikma",
		date: "10/05/26",
		type: "Umum",
		status: "Selesai",
		avatar: "DM",
		avatarClassName: "bg-amber-600",
	},
	{
		noReg: "REG-0044",
		name: "Budi Prasetyo",
		phone: "0878-3456-7890",
		service: "UGD",
		doctor: "dr. Angga",
		date: "10/05/26",
		type: "BPJS",
		status: "Dibatalkan",
		avatar: "BP",
		avatarClassName: "bg-rose-600",
	},
];

function StatusBadge({ status }: { status: RegistrationRow["status"] }) {
	const styles: Record<RegistrationRow["status"], string> = {
		Menunggu: "bg-amber-50 text-amber-600",
		Dikonfirmasi: "bg-emerald-50 text-emerald-600",
		Selesai: "bg-sky-50 text-sky-600",
		Dibatalkan: "bg-rose-50 text-rose-600",
	};

	return <span className={`inline-flex rounded-full px-2.5 py-1 text-[8px] font-semibold ${styles[status]}`}>{status}</span>;
}

function ActionButton({ icon: Icon, className }: { icon: typeof Check; className: string }) {
	return (
		<button type="button" className={`flex h-6 w-6 items-center justify-center rounded-md transition hover:scale-105 ${className}`}>
			<Icon className="h-3.5 w-3.5" />
		</button>
	);
}

export default function PendaftaranAdmin() {
	return (
		<main className="min-h-screen bg-slate-100 p-3 sm:p-4">
			<h2 className="sr-only">Halaman admin kelola pendaftaran pasien KRI AMC</h2>

			<div className="grid min-h-[700px] grid-cols-[56px_1fr] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
				<SidebarAdmin activeKey="pendaftaran" />

				<section className="flex min-w-0 flex-col bg-[#F0F4FA]">
		<section className="overflow-hidden border-b border-slate-200 bg-white shadow-sm">
			<div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<div className="text-[15px] font-semibold text-slate-900">Pendaftaran</div>
					<div className="text-[9px] text-slate-400">Kelola pendaftaran pasien online</div>
				</div>
				<div className="flex flex-wrap gap-2">
					<button type="button" className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-[10px] font-medium text-sky-600">
						<Download className="h-3 w-3" />
						Export
					</button>
					<button type="button" className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-medium text-white">
						<Plus className="h-3 w-3" />
						Tambah manual
					</button>
				</div>
			</div>

			<div className="p-4">
				<div className="mb-4 flex flex-wrap items-center gap-2">
					{filterTabs.map((tab) => (
						<button
							key={tab.label}
							type="button"
							className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-medium ${tab.active ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-white text-slate-400"}`}
						>
							{tab.label}
							{typeof tab.count === "number" ? (
								<span className={`rounded-full px-1.5 py-0.5 text-[8px] ${tab.active ? "bg-white/20 text-white" : "bg-amber-50 text-amber-600"}`}>
									{tab.count}
								</span>
							) : null}
						</button>
					))}
					<div className="ml-auto flex w-full items-center gap-2 md:w-auto">
						<div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 md:w-[220px] md:flex-none">
							<Search className="h-3.5 w-3.5 text-slate-400" />
							<input
								readOnly
								placeholder="Cari nama / no. REG..."
								className="w-full bg-transparent text-[10px] outline-none placeholder:text-slate-300"
							/>
						</div>
					</div>
				</div>

				<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
					<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
						<div className="overflow-x-auto">
							<table className="min-w-full border-collapse">
								<thead>
									<tr className="bg-slate-50 text-left text-[9px] uppercase tracking-[0.5px] text-slate-400">
										<th className="px-3 py-3">No. REG</th>
										<th className="px-3 py-3">Pasien</th>
										<th className="px-3 py-3">Layanan</th>
										<th className="px-3 py-3">Dokter</th>
										<th className="px-3 py-3">Tanggal</th>
										<th className="px-3 py-3">Jenis</th>
										<th className="px-3 py-3">Status</th>
										<th className="px-3 py-3">Aksi</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{rows.map((row) => (
										<tr key={row.noReg} className="text-[10px] text-slate-900 hover:bg-slate-50">
											<td className="px-3 py-3 font-medium text-sky-600">{row.noReg}</td>
											<td className="px-3 py-3">
												<div className="flex items-center gap-2">
													<div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-semibold text-white ${row.avatarClassName}`}>
														{row.avatar}
													</div>
													<div>
														<div className="font-medium text-slate-900">{row.name}</div>
														<div className="text-[8px] text-slate-400">{row.phone}</div>
													</div>
												</div>
											</td>
											<td className="px-3 py-3">{row.service}</td>
											<td className="px-3 py-3">{row.doctor}</td>
											<td className="px-3 py-3">{row.date}</td>
											<td className="px-3 py-3">
												<span className={`inline-flex rounded-full px-2 py-1 text-[8px] font-semibold ${row.type === "BPJS" ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"}`}>
													{row.type}
												</span>
											</td>
											<td className="px-3 py-3"><StatusBadge status={row.status} /></td>
											<td className="px-3 py-3">
												<div className="flex items-center gap-1.5">
													{row.status === "Menunggu" ? (
														<>
															<ActionButton icon={Check} className="bg-emerald-50 text-emerald-600" />
															<ActionButton icon={Eye} className="bg-sky-50 text-sky-600" />
															<ActionButton icon={X} className="bg-rose-50 text-rose-500" />
														</>
													) : row.status === "Dikonfirmasi" ? (
														<>
															<ActionButton icon={Eye} className="bg-sky-50 text-sky-600" />
															<ActionButton icon={MessageCircle} className="bg-emerald-50 text-emerald-500" />
														</>
													) : (
														<ActionButton icon={Eye} className="bg-sky-50 text-sky-600" />
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="flex items-center justify-between border-t border-slate-100 px-3 py-3">
							<div className="text-[9px] text-slate-400">Menampilkan 1-5 dari 48 pendaftaran</div>
							<div className="flex items-center gap-1">
								<button type="button" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-400">
									<ChevronLeft className="h-3 w-3" />
								</button>
								{["1", "2", "3", "...", "10"].map((item, index) => (
									<button
										key={`${item}-${index}`}
										type="button"
										className={`flex h-7 w-7 items-center justify-center rounded-md border text-[10px] ${item === "1" ? "border-sky-600 bg-sky-600 text-white" : "border-slate-200 bg-slate-50 text-slate-400"}`}
									>
										{item}
									</button>
								))}
								<button type="button" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-400">
									<ChevronRight className="h-3 w-3" />
								</button>
							</div>
						</div>
					</div>

					<aside className="rounded-xl border border-slate-200 bg-white shadow-sm">
						<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
							<div className="text-[12px] font-semibold text-slate-900">Detail — REG-0048</div>
							<button type="button" className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-400">
								<X className="h-3.5 w-3.5" />
							</button>
						</div>
						<div className="space-y-4 p-4 text-[10px]">
							<div>
								<div className="mb-2 text-[8px] font-medium uppercase tracking-[1px] text-slate-400">Data diri</div>
								<div className="space-y-1.5">
									{[
										["Nama", "Ahmad Ridwan"],
										["NIK", "3507••••••1234"],
										["Tgl lahir", "15/03/1990"],
										["Kelamin", "Laki-laki"],
										["No. HP", "0812-3456-7890"],
										["Jenis", "BPJS"],
										["Alamat", "Dsn. Krajan RT.01, Tirtomarto"],
									].map(([key, value]) => (
										<div key={key} className="flex justify-between gap-3 border-b border-slate-50 py-1.5 last:border-b-0">
											<span className="text-slate-400">{key}</span>
											<span className="text-right font-medium text-slate-900">{value}</span>
										</div>
									))}
								</div>
							</div>

							<div>
								<div className="mb-2 text-[8px] font-medium uppercase tracking-[1px] text-slate-400">Detail kunjungan</div>
								<div className="space-y-1.5">
									{[
										["Layanan", "Poli Umum"],
										["Dokter", "dr. M. Angga D.S."],
										["Tanggal", "12 Mei 2026"],
										["Waktu", "09:00 WIB"],
										["Keluhan", "Demam tinggi 2 hari, batuk pilek"],
									].map(([key, value]) => (
										<div key={key} className="flex justify-between gap-3 border-b border-slate-50 py-1.5 last:border-b-0">
											<span className="text-slate-400">{key}</span>
											<span className="text-right font-medium text-slate-900">{value}</span>
										</div>
									))}
								</div>
							</div>

							<div>
								<div className="mb-2 text-[8px] font-medium uppercase tracking-[1px] text-slate-400">Status</div>
								<span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-semibold text-amber-600">Menunggu konfirmasi</span>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-2 border-t border-slate-100 p-3">
							<button type="button" className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-2 text-[10px] font-medium text-white">
								<ClipboardCheck className="h-3.5 w-3.5" />
								Konfirmasi
							</button>
							<button type="button" className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500 px-2 py-2 text-[10px] font-medium text-white">
								<MessageCircle className="h-3.5 w-3.5" />
								WA
							</button>
							<button type="button" className="inline-flex items-center justify-center gap-1 rounded-lg bg-rose-50 px-2 py-2 text-[10px] font-medium text-rose-600">
								<Trash2 className="h-3.5 w-3.5" />
								Tolak
							</button>
						</div>
					</aside>
				</div>
			</div>
		</section>
				</section>
			</div>
		</main>
	);
}
