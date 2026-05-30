"use client";

import { useEffect, useState } from "react";

export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export type ApiEnvelope<T> = {
	message?: string;
	data: T;
	error?: string;
};

export type Banner = {
	id: number;
	url: string;
};

export type Service = {
	id: number;
	url: string;
	nama_layanan: string;
};

export type CreateServicePayload = {
	nama_layanan: string;
	url: string;
};

export type Promo = {
	id: number;
	url: string;
};

export type CreatePromoPayload = {
	url: string;
};

export type Doctor = {
	id: number;
	url: string;
	nama_dokter: string;
	jadwal_praktek: string;
	kategori: string;
};

export type CreateDoctorPayload = {
	url: string;
	nama_dokter: string;
	jadwal_praktek: string;
	kategori: string;
};

export type Gallery = {
	id: number;
	kategori: string;
	text: string;
	url: string;
};

export type CreateGalleryPayload = {
	kategori: string;
	text: string;
	url: string;
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

export type GoogleReview = {
	id: number;
	review_count: number;
	average_rating: number;
	recorded_at: string;
};

export type HomeData = {
	banner: Banner[];
	layanan: Service[];
	dokter: Doctor[];
	promo: Promo[];
	galeri: Gallery[];
	event: unknown[];
	visitor_sessions: unknown[];
	social_media_engagement: unknown[];
	social_media_stats: unknown[];
	gbp_interactions: unknown[];
	google_reviews: GoogleReview[];
	site_settings?: SiteSetting[];
	operational_hours?: OperationalHour[];
	social_links?: SocialLink[];
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
	let payload: unknown = null;

	if (text) {
		try {
			payload = JSON.parse(text);
		} catch {
			payload = text;
		}
	}

	if (!response.ok) {
		const errorMessage =
			(payload && typeof payload === "object" && "error" in payload && typeof (payload as Record<string, unknown>).error === "string"
				? (payload as Record<string, string>).error
				: null) ??
			(payload && typeof payload === "object" && "message" in payload && typeof (payload as Record<string, unknown>).message === "string"
				? (payload as Record<string, string>).message
				: null) ??
			(typeof payload === "string" && payload.trim().length > 0 ? payload : null) ??
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

export async function createService(payload: CreateServicePayload) {
	return requestJson<Service>("/layanan", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function updateService(id: number, payload: CreateServicePayload) {
	return requestJson<Service>("/layanan", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, ...payload }),
	});
}

export async function deleteService(id: number) {
	return requestJson<{ message: string }>("/layanan", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id }),
	});
}

export async function createDoctor(payload: CreateDoctorPayload) {
	return requestJson<Doctor>("/dokter", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function updateDoctor(id: number, payload: CreateDoctorPayload) {
	return requestJson<Doctor>("/dokter", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, ...payload }),
	});
}

export async function deleteDoctor(id: number) {
	return requestJson<{ message: string }>("/dokter", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id }),
	});
}

export async function createPromo(payload: CreatePromoPayload) {
	return requestJson<Promo>("/promo", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function updatePromo(id: number, payload: CreatePromoPayload) {
	return requestJson<Promo>("/promo", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, ...payload }),
	});
}

export async function deletePromo(id: number) {
	return requestJson<{ message: string }>("/promo", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id }),
	});
}

export async function createGallery(payload: CreateGalleryPayload) {
	return requestJson<Gallery>("/galeri", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
}

export async function updateGallery(id: number, payload: CreateGalleryPayload) {
	return requestJson<Gallery>("/galeri", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id, ...payload }),
	});
}

export async function deleteGallery(id: number) {
	return requestJson<{ message: string }>("/galeri", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id }),
	});
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
