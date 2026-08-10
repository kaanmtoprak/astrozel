import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import {
	SYNASTRY_CATEGORY_WEIGHTS,
	SYNASTRY_ELEMENT_MAX_TOTAL_DELTA,
	SYNASTRY_MAX_ASPECT_DELTA,
	SYNASTRY_SCORE_BASELINE,
} from "@/features/synastry/constants/synastry-settings";
import { findSynastryRules } from "@/features/synastry/constants/synastry-rules";
import { SYNASTRY_BODY_ORDER } from "@/features/synastry/constants/synastry-labels";
import type { ZodiacSign } from "@/features/astrology/types/astrology";
import type {
	SynastryAspect,
	SynastryBodyKey,
	SynastryCategory,
	SynastryCategoryScores,
	SynastryElement,
	SynastryPolarity,
} from "@/features/synastry/types/synastry";
import { detectSynastryAspect } from "@/features/synastry/utils/detect-synastry-aspect";
import { normalizeSynastryBodyPair } from "@/features/synastry/utils/synastry-priority";

const ELEMENT_BY_SIGN: Record<ZodiacSign, SynastryElement> = {
	aries: "fire",
	leo: "fire",
	sagittarius: "fire",
	taurus: "earth",
	virgo: "earth",
	capricorn: "earth",
	gemini: "air",
	libra: "air",
	aquarius: "air",
	cancer: "water",
	scorpio: "water",
	pisces: "water",
};

function clampScore(value: number): number {
	if (!Number.isFinite(value)) {
		return SYNASTRY_SCORE_BASELINE;
	}
	const rounded = Math.round(value);
	if (rounded < 0) {
		return 0;
	}
	if (rounded > 100) {
		return 100;
	}
	return rounded;
}

function polaritySign(polarity: SynastryPolarity): number {
	if (polarity === "supportive") {
		return 1;
	}
	if (polarity === "challenging") {
		return -1;
	}
	return 0.25;
}

function extractBodyLongitudes(
	chart: NatalChartResult,
): Partial<Record<SynastryBodyKey, number>> {
	const result: Partial<Record<SynastryBodyKey, number>> = {};

	for (const planet of chart.planets) {
		if ((SYNASTRY_BODY_ORDER as readonly string[]).includes(planet.key)) {
			result[planet.key as SynastryBodyKey] = planet.position.longitude;
		}
	}

	const asc = chart.angles.find((angle) => angle.key === "ascendant");
	if (asc) {
		result.ascendant = asc.position.longitude;
	}

	return result;
}

function getSign(
	chart: NatalChartResult,
	body: SynastryBodyKey,
): ZodiacSign | null {
	if (body === "ascendant") {
		return (
			chart.angles.find((angle) => angle.key === "ascendant")?.position.sign ??
			null
		);
	}
	return chart.planets.find((planet) => planet.key === body)?.position.sign ?? null;
}

function elementsCompatible(a: SynastryElement, b: SynastryElement): boolean {
	if (a === b) {
		return true;
	}
	return (
		(a === "fire" && b === "air") ||
		(a === "air" && b === "fire") ||
		(a === "earth" && b === "water") ||
		(a === "water" && b === "earth")
	);
}

function applyElementBaseline(
	chartA: NatalChartResult,
	chartB: NatalChartResult,
	deltas: Record<SynastryCategory, number>,
): void {
	const pairs: Array<{ body: SynastryBodyKey; category: SynastryCategory }> = [
		{ body: "sun", category: "longTerm" },
		{ body: "moon", category: "emotional" },
		{ body: "ascendant", category: "attraction" },
	];

	let spent = 0;
	for (const pair of pairs) {
		if (spent >= SYNASTRY_ELEMENT_MAX_TOTAL_DELTA) {
			break;
		}
		const signA = getSign(chartA, pair.body);
		const signB = getSign(chartB, pair.body);
		if (!signA || !signB) {
			continue;
		}
		const elementA = ELEMENT_BY_SIGN[signA];
		const elementB = ELEMENT_BY_SIGN[signB];
		const delta = elementsCompatible(elementA, elementB) ? 2 : -1;
		const remaining = SYNASTRY_ELEMENT_MAX_TOTAL_DELTA - spent;
		const applied = Math.max(-remaining, Math.min(remaining, delta));
		deltas[pair.category] += applied;
		spent += Math.abs(applied);
	}
}

export function collectSynastryAspects(
	chartA: NatalChartResult,
	chartB: NatalChartResult,
): SynastryAspect[] {
	const longitudesA = extractBodyLongitudes(chartA);
	const longitudesB = extractBodyLongitudes(chartB);

	type Candidate = SynastryAspect & { sourceKey: string };
	const candidates: Candidate[] = [];

	for (const bodyA of SYNASTRY_BODY_ORDER) {
		const lonA = longitudesA[bodyA];
		if (lonA === undefined) {
			continue;
		}
		for (const bodyB of SYNASTRY_BODY_ORDER) {
			const lonB = longitudesB[bodyB];
			if (lonB === undefined) {
				continue;
			}

			const detected = detectSynastryAspect(lonA, lonB, bodyA, bodyB);
			if (!detected) {
				continue;
			}

			const rules = findSynastryRules(bodyA, bodyB, detected.aspectType);
			if (rules.length === 0) {
				continue;
			}

			const [normA, normB] = normalizeSynastryBodyPair(bodyA, bodyB);
			for (const matched of rules) {
				candidates.push({
					bodyA: normA,
					bodyB: normB,
					aspectType: detected.aspectType,
					exactAngle: detected.exactAngle,
					actualAngle: detected.actualAngle,
					orb: Number(detected.orb.toFixed(4)),
					orbFactor: Number(detected.orbFactor.toFixed(4)),
					category: matched.category,
					polarity: matched.polarity,
					weight: matched.baseWeight,
					interpretationKey: matched.interpretationKey,
					sourceKey: `${normA}|${normB}|${detected.aspectType}|${matched.interpretationKey}`,
				});
			}
		}
	}

	const bestByKey = new Map<string, Candidate>();
	for (const candidate of candidates) {
		const existing = bestByKey.get(candidate.sourceKey);
		if (!existing || candidate.orb < existing.orb) {
			bestByKey.set(candidate.sourceKey, candidate);
		}
	}

	const aspects: SynastryAspect[] = [];
	for (const item of bestByKey.values()) {
		const { sourceKey: _ignored, ...aspect } = item;
		void _ignored;
		aspects.push(aspect);
	}

	return aspects;
}

function scoreDeltaForAspect(aspect: SynastryAspect): number {
	const signed =
		polaritySign(aspect.polarity) * aspect.weight * aspect.orbFactor * 0.85;
	if (signed > SYNASTRY_MAX_ASPECT_DELTA) {
		return SYNASTRY_MAX_ASPECT_DELTA;
	}
	if (signed < -SYNASTRY_MAX_ASPECT_DELTA) {
		return -SYNASTRY_MAX_ASPECT_DELTA;
	}
	return signed;
}

export function computeSynastryCategoryScores(
	aspects: SynastryAspect[],
	chartA: NatalChartResult,
	chartB: NatalChartResult,
): SynastryCategoryScores {
	const deltas: Record<SynastryCategory, number> = {
		emotional: 0,
		communication: 0,
		attraction: 0,
		longTerm: 0,
	};

	for (const aspect of aspects) {
		const primary = scoreDeltaForAspect(aspect);
		deltas[aspect.category] += primary;

		const rules = findSynastryRules(
			aspect.bodyA,
			aspect.bodyB,
			aspect.aspectType,
		);
		const matched = rules.find(
			(rule) => rule.interpretationKey === aspect.interpretationKey,
		);
		if (matched?.secondaryCategory) {
			deltas[matched.secondaryCategory] += primary * 0.35;
		}
	}

	applyElementBaseline(chartA, chartB, deltas);

	return {
		emotional: clampScore(SYNASTRY_SCORE_BASELINE + deltas.emotional),
		communication: clampScore(SYNASTRY_SCORE_BASELINE + deltas.communication),
		attraction: clampScore(SYNASTRY_SCORE_BASELINE + deltas.attraction),
		longTerm: clampScore(SYNASTRY_SCORE_BASELINE + deltas.longTerm),
	};
}

export function computeOverallSynastryScore(
	scores: SynastryCategoryScores,
): number {
	const weighted =
		scores.emotional * SYNASTRY_CATEGORY_WEIGHTS.emotional +
		scores.communication * SYNASTRY_CATEGORY_WEIGHTS.communication +
		scores.attraction * SYNASTRY_CATEGORY_WEIGHTS.attraction +
		scores.longTerm * SYNASTRY_CATEGORY_WEIGHTS.longTerm;
	return clampScore(weighted);
}

export function buildSynastryScores(
	chartA: NatalChartResult,
	chartB: NatalChartResult,
): {
	aspects: SynastryAspect[];
	categoryScores: SynastryCategoryScores;
	overallScore: number;
} {
	const aspects = collectSynastryAspects(chartA, chartB);
	const categoryScores = computeSynastryCategoryScores(
		aspects,
		chartA,
		chartB,
	);
	const overallScore = computeOverallSynastryScore(categoryScores);
	return { aspects, categoryScores, overallScore };
}
