/** Saat seçenekleri: 00–23 */
export function buildHourOptions(): string[] {
	return Array.from({ length: 24 }, (_, index) =>
		String(index).padStart(2, "0"),
	);
}

/** Dakika seçenekleri: 00–59 */
export function buildMinuteOptions(): string[] {
	return Array.from({ length: 60 }, (_, index) =>
		String(index).padStart(2, "0"),
	);
}

export function parseTimeSelection(value: string): {
	hour: string | null;
	minute: string | null;
} {
	const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
	if (!match) {
		return { hour: null, minute: null };
	}
	return { hour: match[1], minute: match[2] };
}

export function formatTimeSelection(
	hour: string | null,
	minute: string | null,
): string | null {
	if (!hour || !minute) {
		return null;
	}
	if (!/^([01]\d|2[0-3])$/.test(hour) || !/^[0-5]\d$/.test(minute)) {
		return null;
	}
	return `${hour}:${minute}`;
}

/** Doğum tarihi yıl listesi: maxYear → minYear (yeni yıllar üstte). */
export function buildBirthYearOptions(
	minYear: number,
	maxYear: number,
): number[] {
	if (!Number.isFinite(minYear) || !Number.isFinite(maxYear) || maxYear < minYear) {
		return [];
	}
	const years: number[] = [];
	for (let year = maxYear; year >= minYear; year -= 1) {
		years.push(year);
	}
	return years;
}
