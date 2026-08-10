import { describe, expect, it } from "vitest";
import {
	decimalDegreeToDms,
	longitudeToSignDegree,
	longitudeToZodiacPosition,
	longitudeToZodiacSign,
	normalizeLongitude,
} from "@/features/astrology/utils/degrees";

describe("degrees utilities", () => {
	it("0 → Koç 0°", () => {
		expect(normalizeLongitude(0)).toBe(0);
		expect(longitudeToZodiacSign(0)).toBe("aries");
		expect(longitudeToSignDegree(0)).toBe(0);
		const position = longitudeToZodiacPosition(0);
		expect(position.sign).toBe("aries");
		expect(position.degree).toBe(0);
		expect(position.minute).toBe(0);
	});

	it("29.999 → Koç", () => {
		expect(longitudeToZodiacSign(29.999)).toBe("aries");
		expect(longitudeToSignDegree(29.999)).toBeCloseTo(29.999, 6);
	});

	it("30 → Boğa 0°", () => {
		expect(longitudeToZodiacSign(30)).toBe("taurus");
		expect(longitudeToSignDegree(30)).toBe(0);
		const position = longitudeToZodiacPosition(30);
		expect(position.sign).toBe("taurus");
		expect(position.degree).toBe(0);
	});

	it("359.999 → Balık", () => {
		expect(longitudeToZodiacSign(359.999)).toBe("pisces");
	});

	it("360 → Koç 0°", () => {
		expect(normalizeLongitude(360)).toBe(0);
		expect(longitudeToZodiacSign(360)).toBe("aries");
		const position = longitudeToZodiacPosition(360);
		expect(position.longitude).toBe(0);
		expect(position.sign).toBe("aries");
		expect(position.degree).toBe(0);
	});

	it("-1 → Balık 29°", () => {
		expect(normalizeLongitude(-1)).toBe(359);
		expect(longitudeToZodiacSign(-1)).toBe("pisces");
		const position = longitudeToZodiacPosition(-1);
		expect(position.sign).toBe("pisces");
		expect(position.degree).toBe(29);
		expect(position.minute).toBe(0);
	});

	it("720 → Koç 0°", () => {
		expect(normalizeLongitude(720)).toBe(0);
		expect(longitudeToZodiacSign(720)).toBe("aries");
	});

	it("saniye yuvarlamasında carry uygular", () => {
		const dms = decimalDegreeToDms(29 + 59 / 60 + 59.6 / 3600);
		expect(dms.degree).toBe(30);
		expect(dms.minute).toBe(0);
		expect(dms.second).toBe(0);

		const position = longitudeToZodiacPosition(29 + 59 / 60 + 59.6 / 3600);
		expect(position.sign).toBe("taurus");
		expect(position.degree).toBe(0);
		expect(position.minute).toBe(0);
		expect(position.second).toBe(0);
	});

	it("NaN reddeder", () => {
		expect(() => normalizeLongitude(Number.NaN)).toThrow();
	});

	it("Infinity reddeder", () => {
		expect(() => normalizeLongitude(Number.POSITIVE_INFINITY)).toThrow();
		expect(() => normalizeLongitude(Number.NEGATIVE_INFINITY)).toThrow();
	});
});
