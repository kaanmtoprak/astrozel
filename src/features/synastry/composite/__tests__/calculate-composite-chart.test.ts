import { describe, expect, it } from "vitest";
import { CelestineAstrologyProvider } from "@/features/astrology/providers/celestine-astrology-provider";
import type { NatalChartCalculationInput } from "@/features/astrology/types/natal-chart";
import { calculateCompositeChart } from "@/features/synastry/composite/services/calculate-composite-chart";

const provider = new CelestineAstrologyProvider();

const personA: NatalChartCalculationInput = {
	birthDate: "1995-05-14",
	birthTime: "13:30",
	location: {
		geonameId: 745044,
		name: "Istanbul",
		displayName: "Istanbul, Türkiye",
		countryCode: "TR",
		countryName: "Türkiye",
		adminName1: "Istanbul",
		latitude: 41.01384,
		longitude: 28.94966,
		timezone: "Europe/Istanbul",
	},
};

const personB: NatalChartCalculationInput = {
	birthDate: "1998-11-03",
	birthTime: "09:15",
	location: {
		geonameId: 745044,
		name: "Istanbul",
		displayName: "Istanbul, Türkiye",
		countryCode: "TR",
		countryName: "Türkiye",
		adminName1: "Istanbul",
		latitude: 41.01384,
		longitude: 28.94966,
		timezone: "Europe/Istanbul",
	},
};

describe("calculateCompositeChart", () => {
	it("is order-independent and has valid planet ranges without houses/retro", async () => {
		const [chartA, chartB] = await Promise.all([
			provider.calculateNatalChart(personA),
			provider.calculateNatalChart(personB),
		]);

		const ab = calculateCompositeChart(chartA, chartB);
		const ba = calculateCompositeChart(chartB, chartA);

		expect(ab.planets).toHaveLength(10);
		expect(Object.hasOwn(ab, "houses")).toBe(false);

		for (let i = 0; i < ab.planets.length; i++) {
			const planet = ab.planets[i]!;
			const mirrored = ba.planets[i]!;
			expect(planet.key).toBe(mirrored.key);
			expect(planet.longitude).toBeCloseTo(mirrored.longitude, 9);
			expect(planet.longitude).toBeGreaterThanOrEqual(0);
			expect(planet.longitude).toBeLessThan(360);
			expect(planet.degree).toBeGreaterThanOrEqual(0);
			expect(planet.degree).toBeLessThanOrEqual(29);
			expect(planet.minute).toBeGreaterThanOrEqual(0);
			expect(planet.minute).toBeLessThanOrEqual(59);
			expect("isRetrograde" in planet).toBe(false);
		}

		expect(ab.aspects.every((aspect) => aspect.orb >= 0)).toBe(true);
	});
});
