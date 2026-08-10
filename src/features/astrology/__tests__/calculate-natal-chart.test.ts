import { describe, expect, it } from "vitest";
import { MAJOR_ASPECT_TYPES } from "@/features/astrology/constants/astrology-settings";
import { CelestineAstrologyProvider } from "@/features/astrology/providers/celestine-astrology-provider";
import type { NatalChartCalculationInput } from "@/features/astrology/types/natal-chart";

const provider = new CelestineAstrologyProvider();
const majorAspectSet = new Set<string>(MAJOR_ASPECT_TYPES);

const istanbulCase: NatalChartCalculationInput = {
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

const londonCase: NatalChartCalculationInput = {
	birthDate: "2000-01-01",
	birthTime: "12:00",
	location: {
		geonameId: 2643743,
		name: "London",
		displayName: "London, United Kingdom",
		countryCode: "GB",
		countryName: "United Kingdom",
		adminName1: "England",
		latitude: 51.5074,
		longitude: -0.1278,
		timezone: "Europe/London",
	},
};

const newYorkCase: NatalChartCalculationInput = {
	birthDate: "1990-07-15",
	birthTime: "08:45",
	location: {
		geonameId: 5128581,
		name: "New York",
		displayName: "New York, United States",
		countryCode: "US",
		countryName: "United States",
		adminName1: "New York",
		latitude: 40.7128,
		longitude: -74.006,
		timezone: "America/New_York",
	},
};

async function expectValidNatalChart(
	input: NatalChartCalculationInput,
	expectedTimezone: string,
) {
	const result = await provider.calculateNatalChart(input);

	const asc = result.angles.find((angle) => angle.key === "ascendant");
	const mc = result.angles.find((angle) => angle.key === "midheaven");
	expect(asc).toBeDefined();
	expect(mc).toBeDefined();
	expect(asc!.position.longitude).toBeGreaterThanOrEqual(0);
	expect(asc!.position.longitude).toBeLessThan(360);
	expect(mc!.position.longitude).toBeGreaterThanOrEqual(0);
	expect(mc!.position.longitude).toBeLessThan(360);

	expect(result.houses).toHaveLength(12);
	expect(result.planets).toHaveLength(10);
	expect(result.planets.find((planet) => planet.key === "sun")).toBeDefined();
	expect(result.planets.find((planet) => planet.key === "moon")).toBeDefined();

	for (const planet of result.planets) {
		expect(planet.position.longitude).toBeGreaterThanOrEqual(0);
		expect(planet.position.longitude).toBeLessThan(360);
		expect(planet.house).toBeGreaterThanOrEqual(1);
		expect(planet.house).toBeLessThanOrEqual(12);
	}

	for (const aspect of result.aspects) {
		expect(majorAspectSet.has(aspect.type)).toBe(true);
	}

	expect(result.metadata.timezone).toBe(expectedTimezone);
	expect(result.metadata.houseSystem).toBe("placidus");
	expect(result.metadata.zodiacType).toBe("tropical");
	expect(() => new Date(result.metadata.utcInstant)).not.toThrow();
	expect(Number.isNaN(Date.parse(result.metadata.utcInstant))).toBe(false);

	return result;
}

describe("calculateNatalChart smoke", () => {
	it("İstanbul vakası geçerli sonuç üretir", async () => {
		await expectValidNatalChart(istanbulCase, "Europe/Istanbul");
	});

	it("Londra vakası geçerli sonuç üretir", async () => {
		await expectValidNatalChart(londonCase, "Europe/London");
	});

	it("New York vakası geçerli sonuç üretir", async () => {
		await expectValidNatalChart(newYorkCase, "America/New_York");
	});
});
