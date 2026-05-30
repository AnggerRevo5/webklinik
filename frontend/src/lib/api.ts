"use client";

import { useEffect, useState } from "react";

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export type ApiEnvelope<T> = {
	message?: string;
	data: T;
	error?: string;
};

export type Doctor = {
	id: number;
	kd_dokter: string;
	nm_dokter: string;
	jk: string;
	tmp_lahir: string;
	tgl_lahir?: string | null;
	gol_drh: string;
	agama: string;
	almt_tgl: string;
	no_telp: string;
	email: string;
	stts_nikah: string;
	kd_sps: string;
	alumni: string;
	no_ijn_praktek: string;
	foto_url: string;
	short_desc: string;
	show_on_website: boolean;
	created_at: string;
	updated_at: string;
};

export type Service = {
	id: number;
	name: string;
	slug: string;
	thumbnail_url: string;
	short_desc: string;
	desc: string;
	sort_order: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

export type Promo = {
	id: number;
	title: string;
	slug: string;
	image_url: string;
	short_desc: string;
	desc: string;
	start_date?: string | null;
	end_date?: string | null;
	sort_order: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

export type Article = {
	id: number;
	title: string;
	slug: string;
	thumbnail_url: string;
	short_desc: string;
	desc: string;
	kategori_id?: number | null;
	is_active: boolean;
	published_at?: string | null;
	created_at: string;
	updated_at: string;
};

export type Gallery = {
	id: number;
	title: string;
	image_url: string;
	category: string;
	description: string;
	sort_order: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

export type SocialLink = {
	id: number;
	label: string;
	url: string;
	icon: string;
	sort_order: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

export type OperationalHour = {
	id: number;
	day_label: string;
	open_time?: string | null;
	close_time?: string | null;
	is_24_hours: boolean;
	note: string;
	sort_order: number;
	created_at: string;
	updated_at: string;
};

export type SiteSetting = {
	id: number;
	setting_key: string;
	setting_value: string;
	setting_group: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
};

export type HomeData = {
	doctors: Doctor[];
	rooms: unknown[];
	promos: Promo[];
	articles: Article[];
	services: Service[];
	gallery: Gallery[];
	article_categories: unknown[];
	doctor_schedules: unknown[];
	social_links: SocialLink[];
	operational_hours: OperationalHour[];
	site_settings: SiteSetting[];
};

export type ContactMessagePayload = {
	name: string;
	email: string;
	subject: string;
	message: string;
	status?: string;
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		cache: "no-store",
		headers: {
			Accept: "application/json",
			...(init?.headers ?? {}),
		},
		...init,
	});

	const text = await response.text();
	const payload = text ? JSON.parse(text) : null;

	if (!response.ok) {
		const errorMessage =
			(payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
				? payload.error
				: null) ??
			(payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
				? payload.message
				: null) ??
			`Request failed with status ${response.status}`;

		throw new Error(errorMessage);
	}

	if (payload && typeof payload === "object" && "data" in payload) {
		return (payload as ApiEnvelope<T>).data;
	}

	return payload as T;
}

export async function fetchHomeData() {
	return requestJson<HomeData>("/home");
}

export async function fetchSiteSettings() {
	return requestJson<SiteSetting[]>("/site-settings");
}

export async function fetchOperationalHours() {
	return requestJson<OperationalHour[]>("/operational-hours");
}

export async function fetchSocialLinks() {
	return requestJson<SocialLink[]>("/social-links");
}

export async function createContactMessage(payload: ContactMessagePayload) {
	return requestJson<ContactMessagePayload>("/kontak", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			...payload,
			status: payload.status ?? "new",
		}),
	});
}

export function useHomeData() {
	const [data, setData] = useState<HomeData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function loadHomeData() {
			try {
				setLoading(true);
				const nextData = await fetchHomeData();

				if (!cancelled) {
					setData(nextData);
					setError(null);
				}
			} catch (fetchError) {
				if (!cancelled) {
					setError(fetchError instanceof Error ? fetchError.message : "Gagal mengambil data API");
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadHomeData();

		return () => {
			cancelled = true;
		};
	}, []);

	return { data, loading, error };
}
