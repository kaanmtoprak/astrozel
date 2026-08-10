import { z } from "zod";

export const locationSearchQuerySchema = z.object({
	q: z
		.string({ error: "Arama metni gerekli." })
		.trim()
		.min(2, "En az 2 karakter gir.")
		.max(80, "Arama metni en fazla 80 karakter olabilir."),
});

export const locationTimezoneQuerySchema = z.object({
	latitude: z.coerce
		.number({ error: "Geçerli bir enlem gir." })
		.finite("Geçerli bir enlem gir.")
		.min(-90, "Enlem -90 ile 90 arasında olmalı.")
		.max(90, "Enlem -90 ile 90 arasında olmalı."),
	longitude: z.coerce
		.number({ error: "Geçerli bir boylam gir." })
		.finite("Geçerli bir boylam gir.")
		.min(-180, "Boylam -180 ile 180 arasında olmalı.")
		.max(180, "Boylam -180 ile 180 arasında olmalı."),
});

export function isValidIanaTimezone(timezone: string): boolean {
	try {
		Intl.DateTimeFormat(undefined, { timeZone: timezone });
		return true;
	} catch {
		return false;
	}
}

export const birthLocationSchema = z.object({
	geonameId: z.number().int().positive(),
	name: z.string().trim().min(1),
	displayName: z.string().trim().min(1),
	countryCode: z
		.string()
		.trim()
		.length(2)
		.regex(/^[A-Z]{2}$/, "Geçersiz ülke kodu."),
	countryName: z.string().trim().min(1),
	adminName1: z.string().trim().min(1).optional(),
	latitude: z.number().finite().min(-90).max(90),
	longitude: z.number().finite().min(-180).max(180),
	timezone: z
		.string()
		.trim()
		.min(1, "Saat dilimi gerekli.")
		.refine(isValidIanaTimezone, "Geçersiz saat dilimi."),
});
