import { describe, expect, it } from "vitest";
import { calculateZodiacMidpoint } from "@/features/synastry/composite/utils/calculate-zodiac-midpoint";

describe("calculateZodiacMidpoint", () => {
	it("wraparound shortest-arc midpoints land at 0°", () => {
		expect(calculateZodiacMidpoint(359, 1)).toBeCloseTo(0, 9);
		expect(calculateZodiacMidpoint(1, 359)).toBeCloseTo(0, 9);
		expect(calculateZodiacMidpoint(350, 10)).toBeCloseTo(0, 9);
		expect(calculateZodiacMidpoint(10, 350)).toBeCloseTo(0, 9);
	});

	it("non-wrap midpoints land at 100°", () => {
		expect(calculateZodiacMidpoint(90, 110)).toBeCloseTo(100, 9);
		expect(calculateZodiacMidpoint(110, 90)).toBeCloseTo(100, 9);
	});

	it("is order-independent for antipodal pairs", () => {
		expect(calculateZodiacMidpoint(0, 180)).toBe(
			calculateZodiacMidpoint(180, 0),
		);
		expect(calculateZodiacMidpoint(90, 270)).toBe(
			calculateZodiacMidpoint(270, 90),
		);
		expect(calculateZodiacMidpoint(0, 180)).toBeCloseTo(90, 9);
		expect(calculateZodiacMidpoint(90, 270)).toBeCloseTo(0, 9);
	});
});
