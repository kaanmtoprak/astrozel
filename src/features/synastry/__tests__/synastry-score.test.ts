import { describe, expect, it } from "vitest";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import type { PlanetKey, ZodiacSign } from "@/features/astrology/types/astrology";
import { longitudeToZodiacPosition } from "@/features/astrology/utils/degrees";
import {
	buildSynastryScores,
	computeOverallSynastryScore,
} from "@/features/synastry/utils/synastry-score";
import { SYNASTRY_CATEGORY_WEIGHTS } from "@/features/synastry/constants/synastry-settings";

function position(longitude: number) {
	return longitudeToZodiacPosition(longitude);
}

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
				position: position(ascendant),
			},
		],
		planets: planetEntries.map(([key, longitude]) => ({
			key,
			position: position(longitude),
			house: 1,
			isRetrograde: false,
		})),
		houses: [],
		aspects: [],
		warnings: [],
	};
}

describe("synastry-score", () => {
	const supportiveA = chartFromLongitudes(
		{
			sun: 0,
			moon: 10,
			mercury: 20,
			venus: 30,
			mars: 40,
			jupiter: 50,
			saturn: 60,
			uranus: 70,
			neptune: 80,
			pluto: 90,
		},
		100,
	);

	const supportiveB = chartFromLongitudes(
		{
			sun: 120,
			moon: 0,
			mercury: 140,
			venus: 40,
			mars: 30,
			jupiter: 50,
			saturn: 180,
			uranus: 200,
			neptune: 220,
			pluto: 240,
		},
		100,
	);

	it("keeps scores within 0–100 integers", () => {
		const { categoryScores, overallScore } = buildSynastryScores(
			supportiveA,
			supportiveB,
		);
		for (const score of Object.values(categoryScores)) {
			expect(Number.isInteger(score)).toBe(true);
			expect(score).toBeGreaterThanOrEqual(0);
			expect(score).toBeLessThanOrEqual(100);
		}
		expect(Number.isInteger(overallScore)).toBe(true);
		expect(overallScore).toBeGreaterThanOrEqual(0);
		expect(overallScore).toBeLessThanOrEqual(100);
	});

	it("gives tighter orbs more weight", () => {
		const tightB = chartFromLongitudes({ sun: 120, moon: 1 }, 0);
		const looseB = chartFromLongitudes({ sun: 120, moon: 7 }, 0);
		const baseA = chartFromLongitudes({ sun: 0, moon: 50 }, 10);

		const tight = buildSynastryScores(baseA, tightB);
		const loose = buildSynastryScores(baseA, looseB);

		expect(tight.categoryScores.emotional).toBeGreaterThanOrEqual(
			loose.categoryScores.emotional,
		);
	});

	it("supportive aspects can raise scores above baseline", () => {
		const a = chartFromLongitudes({ sun: 0, moon: 10 }, 20);
		const b = chartFromLongitudes({ sun: 100, moon: 120 }, 20);
		const { categoryScores } = buildSynastryScores(a, b);
		expect(categoryScores.emotional).toBeGreaterThan(50);
	});

	it("challenging aspects can lower scores", () => {
		const a = chartFromLongitudes({ sun: 0, moon: 10 }, 20);
		const b = chartFromLongitudes({ sun: 90, moon: 100 }, 20);
		const { categoryScores } = buildSynastryScores(a, b);
		expect(categoryScores.emotional).toBeLessThan(60);
	});

	it("does not zero attraction for Venus–Mars opposition", () => {
		const a = chartFromLongitudes({ venus: 0, mars: 10 }, 20);
		const b = chartFromLongitudes({ venus: 50, mars: 180 }, 20);
		const { categoryScores, aspects } = buildSynastryScores(a, b);
		const hasOpposition = aspects.some(
			(aspect) =>
				aspect.interpretationKey === "synastry.venus.mars.opposition",
		);
		expect(hasOpposition).toBe(true);
		expect(categoryScores.attraction).toBeGreaterThan(0);
	});

	it("does not penalize absence of aspects", () => {
		const a = chartFromLongitudes({ sun: 0 }, 10);
		const b = chartFromLongitudes({ sun: 45 }, 100);
		const { categoryScores, aspects } = buildSynastryScores(a, b);
		expect(aspects.length).toBe(0);
		expect(categoryScores.emotional).toBeGreaterThanOrEqual(40);
		expect(categoryScores.communication).toBeGreaterThanOrEqual(40);
	});

	it("overall score follows category weights", () => {
		const scores = {
			emotional: 80,
			communication: 60,
			attraction: 40,
			longTerm: 20,
		};
		const expected = Math.round(
			scores.emotional * SYNASTRY_CATEGORY_WEIGHTS.emotional +
				scores.communication * SYNASTRY_CATEGORY_WEIGHTS.communication +
				scores.attraction * SYNASTRY_CATEGORY_WEIGHTS.attraction +
				scores.longTerm * SYNASTRY_CATEGORY_WEIGHTS.longTerm,
		);
		expect(computeOverallSynastryScore(scores)).toBe(expected);
	});

	it("is deterministic and does not mutate inputs", () => {
		const clonePlanets = structuredClone(supportiveA.planets);
		const first = buildSynastryScores(supportiveA, supportiveB);
		const second = buildSynastryScores(supportiveA, supportiveB);
		expect(first).toEqual(second);
		expect(supportiveA.planets).toEqual(clonePlanets);
	});

	it("exposes sun signs as ZodiacSign values", () => {
		const sign = supportiveA.planets.find((p) => p.key === "sun")?.position
			.sign as ZodiacSign;
		expect(typeof sign).toBe("string");
	});
});
