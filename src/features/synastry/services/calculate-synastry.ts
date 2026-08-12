import "server-only";

import { AstrologyCalculationError } from "@/features/astrology/providers/celestine-astrology-provider";
import { calculateNatalChart } from "@/features/astrology/services/calculate-natal-chart";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import { calculateCompositeChart } from "@/features/synastry/composite/services/calculate-composite-chart";
import { SYNASTRY_CALCULATION_VERSION } from "@/features/synastry/constants/synastry-settings";
import type { SynastryRequest } from "@/features/synastry/schemas/synastry-request-schema";
import type {
	SynastryPersonSummary,
	SynastryResult,
} from "@/features/synastry/types/synastry";
import { buildAllCategoryDetails } from "@/features/synastry/utils/synastry-category-explanation";
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

function toPersonSummary(
	chart: NatalChartResult,
	label: string,
	birthDate: string,
	birthTime: string,
): SynastryPersonSummary {
	try {
		return {
			label,
			birthDate,
			birthTime,
			locationDisplayName: chart.metadata.locationDisplayName,
			sun: buildPlacementSummary(chart, "sun"),
			moon: buildPlacementSummary(chart, "moon"),
			ascendant: buildPlacementSummary(chart, "ascendant"),
			mercurySign: requirePlanetSign(chart, "mercury"),
			venusSign: requirePlanetSign(chart, "venus"),
			marsSign: requirePlanetSign(chart, "mars"),
		};
	} catch {
		throw new AstrologyCalculationError(
			"INVALID_PROVIDER_RESPONSE",
			"Doğum haritası özeti oluşturulamadı.",
		);
	}
}

export type CalculateSynastryOptions = {
	labelA?: string;
	labelB?: string;
};

export async function calculateSynastry(
	input: SynastryRequest,
	options: CalculateSynastryOptions = {},
): Promise<SynastryResult> {
	const [chartA, chartB] = await Promise.all([
		calculateNatalChart(input.personA),
		calculateNatalChart(input.personB),
	]);

	const personA = toPersonSummary(
		chartA,
		options.labelA?.trim() || "Birinci kişi",
		input.personA.birthDate,
		input.personA.birthTime,
	);
	const personB = toPersonSummary(
		chartB,
		options.labelB?.trim() || "İkinci kişi",
		input.personB.birthDate,
		input.personB.birthTime,
	);

	const { aspects, categoryScores, overallScore } = buildSynastryScores(
		chartA,
		chartB,
	);

	const highlighted = selectHighlightedAspects(aspects);
	const strengths = buildSynastryStrengths(aspects);
	const challenges = buildSynastryChallenges(aspects);
	const categoryDetails = buildAllCategoryDetails({
		categoryScores,
		aspects,
		personA,
		personB,
	});
	const overview = buildSynastryOverview({
		overallScore,
		categoryScores,
		aspects,
		personA,
		personB,
	});

	const warnings: string[] = [];
	for (const warning of [...chartA.warnings, ...chartB.warnings]) {
		if (!warnings.includes(warning.message)) {
			warnings.push(warning.message);
		}
	}

	let composite: SynastryResult["composite"];
	try {
		composite = calculateCompositeChart(chartA, chartB);
	} catch {
		composite = undefined;
	}

	return {
		metadata: {
			calculationVersion: SYNASTRY_CALCULATION_VERSION,
			zodiacType: "tropical",
			houseSystem: "placidus",
		},
		personA,
		personB,
		overallScore,
		categoryScores,
		categoryDetails,
		overview,
		strengths,
		challenges,
		aspects: highlighted,
		warnings,
		composite,
	};
}
