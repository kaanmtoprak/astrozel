import { describe, expect, it } from "vitest";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import type { PlanetKey } from "@/features/astrology/types/astrology";
import { longitudeToZodiacPosition } from "@/features/astrology/utils/degrees";
import { buildAllCategoryDetails } from "@/features/synastry/utils/synastry-category-explanation";
import {
	buildPlacementSummary,
	requirePlanetSign,
} from "@/features/synastry/utils/synastry-placements";
import { buildSynastryScores } from "@/features/synastry/utils/synastry-score";
import type { SynastryPersonSummary } from "@/features/synastry/types/synastry";

function chartFromLongitudes(
	planets: Partial<Record<PlanetKey, number>>,
	ascendant: number,
): NatalChartResult {
	const planetEntries = Object.entries(planets) as Array<[PlanetKey, number]>;
	return {
		metadata: {
			provider: "celestine",
			calculationVersion: 1,
			zodiacType: "tropical",
			houseSystem: "placidus",
			localDateTime: "2000-01-01T12:00:00",
			timezone: "Europe/Istanbul",
			utcInstant: "2000-01-01T09:00:00.000Z",
			utcOffsetMinutes: 180,
			latitude: 41,
			longitude: 29,
			locationDisplayName: "Test",
		},
		angles: [
			{
				key: "ascendant",
				abbrev: "ASC",
				position: longitudeToZodiacPosition(ascendant),
			},
		],
		planets: planetEntries.map(([key, longitude]) => ({
			key,
			position: longitudeToZodiacPosition(longitude),
			house: 1,
			isRetrograde: false,
		})),
		houses: [],
		aspects: [],
		warnings: [],
	};
}

function toPerson(
	chart: NatalChartResult,
	label: string,
): SynastryPersonSummary {
	return {
		label,
		birthDate: "1995-05-14",
		birthTime: "13:30",
		locationDisplayName: chart.metadata.locationDisplayName,
		sun: buildPlacementSummary(chart, "sun"),
		moon: buildPlacementSummary(chart, "moon"),
		ascendant: buildPlacementSummary(chart, "ascendant"),
		mercurySign: requirePlanetSign(chart, "mercury"),
		venusSign: requirePlanetSign(chart, "venus"),
		marsSign: requirePlanetSign(chart, "mars"),
	};
}

describe("synastry-category-explanation", () => {
	const chartA = chartFromLongitudes(
		{
			sun: 0,
			moon: 20,
			mercury: 40,
			venus: 60,
			mars: 80,
			jupiter: 100,
			saturn: 120,
			uranus: 140,
			neptune: 160,
			pluto: 180,
		},
		200,
	);
	const chartB = chartFromLongitudes(
		{
			sun: 120,
			moon: 0,
			mercury: 130,
			venus: 80,
			mars: 60,
			jupiter: 20,
			saturn: 210,
			uranus: 250,
			neptune: 280,
			pluto: 300,
		},
		15,
	);

	const scored = buildSynastryScores(chartA, chartB);
	const personA = toPerson(chartA, "Kaan");
	const personB = toPerson(chartB, "Ayse");

	it("compares both people and stays deterministic", () => {
		const details = buildAllCategoryDetails({
			categoryScores: scored.categoryScores,
			aspects: scored.aspects,
			personA,
			personB,
		});
		const again = buildAllCategoryDetails({
			categoryScores: scored.categoryScores,
			aspects: scored.aspects,
			personA,
			personB,
		});

		expect(details).toEqual(again);
		expect(details).toHaveLength(4);

		for (const detail of details) {
			const joined = detail.summary.join(" ");
			expect(joined).toContain("Kaan");
			expect(joined).toContain("Ayse");
			expect(joined.toLowerCase()).not.toMatch(/kadın|erkek|ruh eşi|kaderiniz/);
			expect(detail.summary.every((part) => part.trim().length > 0)).toBe(true);
			expect(detail.summary.length).toBeGreaterThanOrEqual(3);
			expect(detail.supportiveFactors.length).toBeLessThanOrEqual(2);
			expect(detail.challengingFactors.length).toBeLessThanOrEqual(2);
		}
	});

	it("does not invent factors when aspects are absent", () => {
		const sparseA = chartFromLongitudes({ sun: 0, moon: 10, mercury: 20, venus: 30, mars: 40 }, 50);
		const sparseB = chartFromLongitudes({ sun: 45, moon: 55, mercury: 65, venus: 75, mars: 85 }, 95);
		const sparseScore = buildSynastryScores(sparseA, sparseB);
		const details = buildAllCategoryDetails({
			categoryScores: sparseScore.categoryScores,
			aspects: sparseScore.aspects,
			personA: toPerson(sparseA, "Birinci kişi"),
			personB: toPerson(sparseB, "İkinci kişi"),
		});

		for (const detail of details) {
			if (detail.supportiveFactors.length === 0) {
				expect(
					detail.summary.some((line) => /destekleyici/i.test(line)),
				).toBe(false);
			}
			if (detail.challengingFactors.length === 0) {
				expect(
					detail.summary.join(" ").includes("belirgin bir zorlayıcı açı"),
				).toBe(true);
			}
		}
	});
});
