import { Temporal } from "@js-temporal/polyfill";

export class BirthTimeError extends Error {
	readonly code: "INVALID_TIMEZONE" | "AMBIGUOUS_OR_INVALID_LOCAL_TIME";

	constructor(
		code: "INVALID_TIMEZONE" | "AMBIGUOUS_OR_INVALID_LOCAL_TIME",
		message: string,
	) {
		super(message);
		this.name = "BirthTimeError";
		this.code = code;
	}
}

export interface ResolvedBirthInstant {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	timezone: string;
	utcOffsetHours: number;
	utcOffsetMinutes: number;
	utcInstant: string;
	localDateTime: string;
}

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseParts(birthDate: string, birthTime: string) {
	const dateMatch = DATE_PATTERN.exec(birthDate.trim());
	const timeMatch = TIME_PATTERN.exec(birthTime.trim());

	if (!dateMatch || !timeMatch) {
		throw new BirthTimeError(
			"AMBIGUOUS_OR_INVALID_LOCAL_TIME",
			"Doğum tarihi veya saati geçerli değil.",
		);
	}

	return {
		year: Number(dateMatch[1]),
		month: Number(dateMatch[2]),
		day: Number(dateMatch[3]),
		hour: Number(timeMatch[1]),
		minute: Number(timeMatch[2]),
	};
}

export function resolveBirthInstant(
	birthDate: string,
	birthTime: string,
	timezone: string,
): ResolvedBirthInstant {
	const trimmedTimezone = timezone.trim();
	if (!trimmedTimezone) {
		throw new BirthTimeError("INVALID_TIMEZONE", "Saat dilimi geçerli değil.");
	}

	const parts = parseParts(birthDate, birthTime);

	let zoned: Temporal.ZonedDateTime;
	try {
		zoned = Temporal.ZonedDateTime.from(
			{
				timeZone: trimmedTimezone,
				year: parts.year,
				month: parts.month,
				day: parts.day,
				hour: parts.hour,
				minute: parts.minute,
				second: 0,
			},
			{ disambiguation: "reject" },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message.toLowerCase() : "";
		if (
			message.includes("time zone") ||
			message.includes("timezone") ||
			message.includes("invalid time zone")
		) {
			throw new BirthTimeError("INVALID_TIMEZONE", "Saat dilimi geçerli değil.");
		}

		throw new BirthTimeError(
			"AMBIGUOUS_OR_INVALID_LOCAL_TIME",
			"Seçtiğin doğum saati bu konumda yaz/kış saati geçişine denk geliyor. Doğum saatini kontrol ederek tekrar dene.",
		);
	}

	const utcOffsetMinutes = Math.round(zoned.offsetNanoseconds / 60_000_000_000);
	const utcOffsetHours = utcOffsetMinutes / 60;
	const instant = zoned.toInstant();

	return {
		year: parts.year,
		month: parts.month,
		day: parts.day,
		hour: parts.hour,
		minute: parts.minute,
		second: 0,
		timezone: trimmedTimezone,
		utcOffsetHours,
		utcOffsetMinutes,
		utcInstant: instant.toString(),
		localDateTime: `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:00`,
	};
}
