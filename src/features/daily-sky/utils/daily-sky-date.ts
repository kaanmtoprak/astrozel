import { parseDateOnly } from "@/lib/date";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Today's calendar date in UTC (YYYY-MM-DD). */
export function getUtcTodayDateOnly(now = new Date()): string {
	const year = now.getUTCFullYear();
	const month = String(now.getUTCMonth() + 1).padStart(2, "0");
	const day = String(now.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

/**
 * Resolve ?tarih= query. Invalid / missing values fall back to UTC today.
 */
export function resolveDailySkyDate(raw: string | string[] | undefined): string {
	const value = Array.isArray(raw) ? raw[0] : raw;
	if (!value || !DATE_ONLY_PATTERN.test(value.trim())) {
		return getUtcTodayDateOnly();
	}

	const trimmed = value.trim();
	const parsed = parseDateOnly(trimmed);
	if (!parsed) {
		return getUtcTodayDateOnly();
	}

	return trimmed;
}

export function shiftDailySkyDate(date: string, deltaDays: number): string {
	const parsed = parseDateOnly(date);
	if (!parsed) {
		return getUtcTodayDateOnly();
	}

	const shifted = new Date(
		Date.UTC(
			parsed.getFullYear(),
			parsed.getMonth(),
			parsed.getDate() + deltaDays,
		),
	);

	const year = shifted.getUTCFullYear();
	const month = String(shifted.getUTCMonth() + 1).padStart(2, "0");
	const day = String(shifted.getUTCDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function dailySkyHref(date: string): string {
	return `/bugunun-gokyuzu?tarih=${date}`;
}
