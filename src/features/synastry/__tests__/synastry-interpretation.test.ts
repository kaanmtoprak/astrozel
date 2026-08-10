import { describe, expect, it } from "vitest";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import type { PlanetKey } from "@/features/astrology/types/astrology";
import { longitudeToZodiacPosition } from "@/features/astrology/utils/degrees";
import {
	buildSynastryChallenges,
	buildSynastryOverview,
	buildSynastryStrengths,
	selectHighlightedAspects,
} from "@/features/synastry/utils/synastry-interpretation";
import {
	buildPlacementSummary,
	requirePlanetSign,
} from "@/features/synastry/utils/synastry-placements";
import { buildSynastryScores } from "@/features/synastry/utils/synastry-score";

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

describe("synastry-interpretation", () => {
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
	const personA = {
		label: "Birinci kişi",
		birthDate: "1995-05-14",
		birthTime: "13:30",
		locationDisplayName: "Test",
		sun: buildPlacementSummary(chartA, "sun"),
		moon: buildPlacementSummary(chartA, "moon"),
		ascendant: buildPlacementSummary(chartA, "ascendant"),
		mercurySign: requirePlanetSign(chartA, "mercury"),
		venusSign: requirePlanetSign(chartA, "venus"),
		marsSign: requirePlanetSign(chartA, "mars"),
	};
	const personB = {
		label: "İkinci kişi",
		birthDate: "1997-08-22",
		birthTime: "09:15",
		locationDisplayName: "Test",
		sun: buildPlacementSummary(chartB, "sun"),
		moon: buildPlacementSummary(chartB, "moon"),
		ascendant: buildPlacementSummary(chartB, "ascendant"),
		mercurySign: requirePlanetSign(chartB, "mercury"),
		venusSign: requirePlanetSign(chartB, "venus"),
		marsSign: requirePlanetSign(chartB, "mars"),
	};

	it("builds overview mentioning highest and lowest categories", () => {
		const overview = buildSynastryOverview({
			overallScore: scored.overallScore,
			categoryScores: scored.categoryScores,
			aspects: scored.aspects,
			personA,
			personB,
		});

		expect(overview.length).toBeGreaterThanOrEqual(3);
		expect(overview.length).toBeLessThanOrEqual(5);
		const joined = overview.join(" ");
		expect(joined.length).toBeGreaterThan(0);
		expect(joined.toLowerCase()).not.toMatch(/kadın|erkek|kaderiniz|ruh eşi/);
		expect(overview.every((part) => part.trim().length > 0)).toBe(true);

		const ranked = Object.entries(scored.categoryScores).sort(
			(a, b) => b[1] - a[1],
		);
		const highestLabelMap = {
			emotional: "Duygusal uyum",
			communication: "İletişim",
			attraction: "Çekim",
			longTerm: "Uzun vadeli denge",
		} as const;
		expect(joined).toContain(
			highestLabelMap[ranked[0]![0] as keyof typeof highestLabelMap],
		);
		if (ranked[0]![0] !== ranked[ranked.length - 1]![0]) {
			expect(joined).toContain(
				highestLabelMap[
					ranked[ranked.length - 1]![0] as keyof typeof highestLabelMap
				],
			);
		}
	});

	it("limits strengths, challenges and highlighted aspects", () => {
		const strengths = buildSynastryStrengths(scored.aspects);
		const challenges = buildSynastryChallenges(scored.aspects);
		const highlighted = selectHighlightedAspects(scored.aspects);

		expect(strengths.length).toBeLessThanOrEqual(6);
		expect(challenges.length).toBeLessThanOrEqual(6);
		expect(highlighted.length).toBeLessThanOrEqual(8);
		expect(strengths.every((item) => item.summary.trim().length > 0)).toBe(
			true,
		);
		expect(challenges.every((item) => item.summary.trim().length > 0)).toBe(
			true,
		);
	});
});
