import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OperationalHour, SiteSetting } from "@/src/lib/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSettingValue(
  settings: SiteSetting[],
  keys: string[],
  fallback = "",
) {
  const loweredKeys = keys.map((key) => key.toLowerCase());

  for (const setting of settings) {
    const candidates = [setting.setting_key, setting.setting_group]
      .filter(Boolean)
      .map((value) => value.toLowerCase());

    if (candidates.some((value) => loweredKeys.some((key) => value.includes(key)))) {
      return setting.setting_value || fallback;
    }
  }

  return fallback;
}

export function formatOperationalHours(hours: OperationalHour[]) {
  return [...hours]
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((hour) => ({
      label: hour.day_label,
      value: hour.is_24_hours
        ? "24 Jam"
        : [hour.open_time, hour.close_time].filter(Boolean).join(" - "),
      badge: hour.is_24_hours,
    }))
    .filter((item) => item.label.trim().length > 0);
}

export function normalizePhoneNumber(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}
