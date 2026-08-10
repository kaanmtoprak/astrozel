import { describe, expect, it } from "vitest";
import {
	BirthTimeError,
	resolveBirthInstant,
} from "@/features/astrology/utils/birth-time";

describe("resolveBirthInstant", () => {
	it("UTC timezone için offset 0 döner", () => {
		const resolved = resolveBirthInstant("2000-01-01", "12:00", "UTC");
		expect(resolved.utcOffsetMinutes).toBe(0);
		expect(resolved.utcOffsetHours).toBe(0);
		expect(resolved.utcInstant).toBe("2000-01-01T12:00:00Z");
	});

	it("Europe/Istanbul tarihsel offsetini doğru hesaplar", () => {
		const resolved = resolveBirthInstant(
			"1995-05-14",
			"13:30",
			"Europe/Istanbul",
		);
		expect(resolved.utcOffsetHours).toBe(3);
		expect(resolved.utcOffsetMinutes).toBe(180);
		expect(resolved.utcInstant).toBe("1995-05-14T10:30:00Z");
	});

	it("America/New_York yaz saati offsetini doğru hesaplar", () => {
		const resolved = resolveBirthInstant(
			"1990-07-15",
			"08:45",
			"America/New_York",
		);
		expect(resolved.utcOffsetHours).toBe(-4);
		expect(resolved.utcOffsetMinutes).toBe(-240);
		expect(resolved.utcInstant).toBe("1990-07-15T12:45:00Z");
	});

	it("geçersiz IANA timezone reddeder", () => {
		expect(() =>
			resolveBirthInstant("2000-01-01", "12:00", "Not/ARealZone"),
		).toThrow(BirthTimeError);

		try {
			resolveBirthInstant("2000-01-01", "12:00", "Not/ARealZone");
		} catch (error) {
			expect(error).toBeInstanceOf(BirthTimeError);
			expect((error as BirthTimeError).code).toBe("INVALID_TIMEZONE");
		}
	});

	it("DST nonexistent local time reddeder", () => {
		try {
			resolveBirthInstant("2024-03-10", "02:30", "America/New_York");
			expect.fail("Beklenen hata oluşmadı");
		} catch (error) {
			expect(error).toBeInstanceOf(BirthTimeError);
			expect((error as BirthTimeError).code).toBe(
				"AMBIGUOUS_OR_INVALID_LOCAL_TIME",
			);
		}
	});

	it("DST ambiguous local time reddeder", () => {
		try {
			resolveBirthInstant("2024-11-03", "01:30", "America/New_York");
			expect.fail("Beklenen hata oluşmadı");
		} catch (error) {
			expect(error).toBeInstanceOf(BirthTimeError);
			expect((error as BirthTimeError).code).toBe(
				"AMBIGUOUS_OR_INVALID_LOCAL_TIME",
			);
		}
	});
});
