import { format, isValid, parse } from "date-fns";
import { tr } from "date-fns/locale";

export const MIN_BIRTH_DATE = "1900-01-01";

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDateOnly(value: string): Date | undefined {
	const trimmed = value.trim();
	if (!DATE_ONLY_PATTERN.test(trimmed)) {
		return undefined;
	}

	const parsed = parse(trimmed, "yyyy-MM-dd", new Date());
	if (!isValid(parsed)) {
		return undefined;
	}

	const [year, month, day] = trimmed.split("-").map(Number);
	if (
		parsed.getFullYear() !== year ||
		parsed.getMonth() + 1 !== month ||
		parsed.getDate() !== day
	) {
		return undefined;
	}

	return parsed;
}

export function formatDateOnly(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function formatDateOnlyDisplay(value: string): string {
	const date = parseDateOnly(value);
	if (!date) {
		return value;
	}

	return format(date, "d MMMM yyyy", { locale: tr });
}

export function getTodayDateOnly(): string {
	return formatDateOnly(new Date());
}

export function getMinBirthDate(): Date {
	return parseDateOnly(MIN_BIRTH_DATE) ?? new Date(1900, 0, 1);
}

export function getMaxBirthDate(): Date {
	const today = new Date();
	return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}
