import { z } from "zod";
import { birthLocationSchema } from "@/features/location/schemas/location-search-schema";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MIN_BIRTH_DATE = "1900-01-01";

function isValidCalendarDate(value: string): boolean {
	const match = DATE_PATTERN.exec(value);
	if (!match) {
		return false;
	}

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(Date.UTC(year, month - 1, day));

	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day
	);
}

function getTodayLocalDateString(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export const natalChartRequestSchema = z.object({
	birthDate: z
		.string()
		.trim()
		.min(1, "Doğum tarihini gir.")
		.superRefine((value, context) => {
			if (!DATE_PATTERN.test(value) || !isValidCalendarDate(value)) {
				context.addIssue({
					code: "custom",
					message: "Geçerli bir doğum tarihi gir.",
				});
				return;
			}
			if (value < MIN_BIRTH_DATE) {
				context.addIssue({
					code: "custom",
					message: "MVP sürümünde 1900 yılından önceki tarihler desteklenmiyor.",
				});
				return;
			}
			if (value > getTodayLocalDateString()) {
				context.addIssue({
					code: "custom",
					message: "Doğum tarihi gelecekte olamaz.",
				});
			}
		}),
	birthTime: z
		.string()
		.trim()
		.min(1, "Doğum saatini gir.")
		.regex(TIME_PATTERN, "Geçerli bir saat gir."),
	location: birthLocationSchema,
});

export type NatalChartRequest = z.infer<typeof natalChartRequestSchema>;
