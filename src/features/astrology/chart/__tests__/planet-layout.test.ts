import { describe, expect, it } from "vitest";
import { layoutPlanets } from "@/features/astrology/chart/utils/planet-layout";

describe("layoutPlanets", () => {
	it("birbirinden uzak gezegenler değişmeden kalır", () => {
		const result = layoutPlanets([
			{ key: "sun", longitude: 10 },
			{ key: "moon", longitude: 100 },
			{ key: "mars", longitude: 200 },
		]);

		expect(result).toHaveLength(3);
		for (const item of result) {
			expect(item.displayLongitude).toBeCloseTo(item.trueLongitude, 5);
			expect(item.displacement).toBeCloseTo(0, 5);
		}
	});

	it("aynı longitude’daki iki gezegen ayrılır", () => {
		const result = layoutPlanets([
			{ key: "sun", longitude: 50 },
			{ key: "moon", longitude: 50 },
		]);

		expect(result).toHaveLength(2);
		const separation = Math.abs(
			result[0].displayLongitude - result[1].displayLongitude,
		);
		expect(Math.min(separation, 360 - separation)).toBeGreaterThanOrEqual(7.9);
	});

	it("üç yakın gezegen minimum ayrımı korur", () => {
		const result = layoutPlanets([
			{ key: "sun", longitude: 20 },
			{ key: "moon", longitude: 21 },
			{ key: "mercury", longitude: 22 },
		]);

		const displays = result.map((item) => item.displayLongitude).sort((a, b) => a - b);
		expect(displays[1] - displays[0]).toBeGreaterThanOrEqual(7.9);
		expect(displays[2] - displays[1]).toBeGreaterThanOrEqual(7.9);
	});

	it("359°, 1° ve 3° aynı küme olarak ele alınır", () => {
		const result = layoutPlanets([
			{ key: "sun", longitude: 359 },
			{ key: "moon", longitude: 1 },
			{ key: "mercury", longitude: 3 },
		]);

		const displays = result.map((item) => item.displayLongitude);
		const sorted = [...displays].sort((a, b) => a - b);
		// Wrap-aware: after layout they should not all stay at 359/1/3 cramped
		const pairwise = [
			Math.min(
				Math.abs(sorted[1] - sorted[0]),
				360 - Math.abs(sorted[1] - sorted[0]),
			),
			Math.min(
				Math.abs(sorted[2] - sorted[1]),
				360 - Math.abs(sorted[2] - sorted[1]),
			),
		];
		expect(pairwise.every((value) => value >= 7.9)).toBe(true);
	});

	it("sonuç longitude değerleri normalize edilir", () => {
		const result = layoutPlanets([
			{ key: "sun", longitude: 370 },
			{ key: "moon", longitude: -5 },
		]);

		for (const item of result) {
			expect(item.trueLongitude).toBeGreaterThanOrEqual(0);
			expect(item.trueLongitude).toBeLessThan(360);
			expect(item.displayLongitude).toBeGreaterThanOrEqual(0);
			expect(item.displayLongitude).toBeLessThan(360);
		}
	});

	it("aynı input aynı sonucu üretir", () => {
		const input = [
			{ key: "sun" as const, longitude: 12 },
			{ key: "moon" as const, longitude: 14 },
			{ key: "venus" as const, longitude: 200 },
		];
		const a = layoutPlanets(input);
		const b = layoutPlanets(input);
		expect(a).toEqual(b);
	});

	it("girdiler mutate edilmez", () => {
		const input = [
			{ key: "sun" as const, longitude: 10 },
			{ key: "moon" as const, longitude: 11 },
		];
		const frozen = structuredClone(input);
		layoutPlanets(input);
		expect(input).toEqual(frozen);
	});

	it("boş liste çalışır", () => {
		expect(layoutPlanets([])).toEqual([]);
	});

	it("tek gezegen çalışır", () => {
		const result = layoutPlanets([{ key: "sun", longitude: 123.45 }]);
		expect(result).toHaveLength(1);
		expect(result[0].trueLongitude).toBeCloseTo(123.45, 5);
		expect(result[0].displayLongitude).toBeCloseTo(123.45, 5);
		expect(result[0].radialLane).toBe(0);
	});
});
