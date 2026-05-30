"use client";

import type { LucideIcon } from "lucide-react";
import {
	ChartBar,
	HeartPlus,
	Image as ImageIcon,
	LayoutDashboard,
	Star,
	Stethoscope,
	Tag,
} from "lucide-react";
import Link from "next/link";

export type SidebarKey =
	| "dashboard"
	| "dokter"
	| "layanan"
	| "promo"
	| "galeri"
	| "review";

type SidebarItem = {
	icon: LucideIcon;
	href?: string;
	dot?: boolean;
	key?: SidebarKey;
};

const sidebarItems: SidebarItem[] = [
	{ icon: LayoutDashboard, href: "/dashboard_admin", key: "dashboard" },
	{ icon: Stethoscope, href: "/dokter_jadwal_admin", key: "dokter" },
	{ icon: HeartPlus, href: "/admin_layanan_crud", key: "layanan" },
	{ icon: Tag, href: "/admin_promo_page", key: "promo" },
	{ icon: ImageIcon, href: "/galeri-artikel_admin", key: "galeri" },
	{ icon: Star, href: "/admin_review_pesan", key: "review" },
];

export default function SidebarAdmin({ activeKey }: { activeKey?: SidebarKey }) {
	return (
		<aside className="flex flex-col items-center gap-2 bg-[#0D1B2A] py-3">
			<div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] border-2 border-[#E8861E] bg-gradient-to-br from-sky-600 to-sky-800 text-[8px] font-bold text-[#E8861E]">
				AMC
			</div>
			{sidebarItems.map((item, index) => {
				const Icon = item.icon;
				const isActive = activeKey != null && item.key === activeKey;
				const baseClassName = `relative flex h-9 w-9 items-center justify-center rounded-[10px] text-[15px] transition-colors ${
					isActive ? "bg-sky-600 text-white" : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
				}`;

				if (item.href) {
					return (
						<Link
							key={`${Icon.displayName ?? Icon.name}-${index}`}
							href={item.href}
							className={baseClassName}
							aria-label={`Menu ${index + 1}`}
						>
							<Icon className="h-4 w-4" />
							{item.dot ? <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" /> : null}
						</Link>
					);
				}

				return (
					<button
						key={`${Icon.displayName ?? Icon.name}-${index}`}
						type="button"
						className={baseClassName}
					>
						<Icon className="h-4 w-4" />
						{item.dot ? <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" /> : null}
					</button>
				);
			})}
			<div className="my-1 h-px w-6 bg-slate-800" />
			<div className="mt-auto flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-sky-600 text-[10px] font-semibold text-white">
				A
			</div>
		</aside>
	);
}
