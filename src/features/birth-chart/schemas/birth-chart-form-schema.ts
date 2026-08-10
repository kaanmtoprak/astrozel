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

	if (month < 1 || month > 12 || day < 1) {
		return false;
	}

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

export const birthChartFormSchema = z.object({
	// Keep empty string (do not coerce to undefined): JSON.stringify omits
	// undefined keys and older drafts would fail sessionStorage round-trips.
	name: z.preprocess(
		(value) => (value === undefined || value === null ? "" : value),
		z.string().trim().max(80, "İsim en fazla 80 karakter olabilir."),
	),
	birthDate: z
		.string({ error: "Doğum tarihini gir." })
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
					message:
						"MVP sürümünde 1900 yılından önceki tarihler desteklenmiyor.",
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
		.string({ error: "Doğum saatini gir." })
		.trim()
		.min(1, "Doğum saatini gir.")
		.regex(TIME_PATTERN, "Geçerli bir saat gir."),
	birthPlace: z
		.string({ error: "Doğum yerini gir." })
		.trim()
		.min(1, "Doğum yerini gir.")
		.min(2, "Doğum yeri en az 2 karakter olmalı.")
		.max(120, "Doğum yeri en fazla 120 karakter olabilir."),
	location: birthLocationSchema.nullable().refine(
		(value): value is NonNullable<typeof value> => value !== null,
		{
			message: "Doğum yerini arama sonuçlarından seç.",
		},
	),
});

export type BirthChartFormSchemaInput = z.input<typeof birthChartFormSchema>;
export type BirthChartFormSchemaOutput = z.output<typeof birthChartFormSchema>;
