import { CORE_PLANET_KEYS } from "@/features/astrology/constants/astrology-settings";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import type { PlanetKey } from "@/features/astrology/types/astrology";
import type { CompositeChartResult } from "@/features/synastry/composite/types/composite";
import { buildCompositeInterpretation } from "@/features/synastry/composite/utils/build-composite-interpretation";
import { calculateZodiacMidpoint } from "@/features/synastry/composite/utils/calculate-zodiac-midpoint";
import {
	collectCompositeAspects,
	selectCompositeAspects,
	toCompositePlanet,
	toCompositePoint,
} from "@/features/synastry/composite/utils/composite-format";

function requirePlanetLongitude(
	chart: NatalChartResult,
	key: PlanetKey,
): number {
	const planet = chart.planets.find((item) => item.key === key);
	if (!planet) {
		throw new Error(`Eksik gezegen: ${key}`);
	}
	return planet.position.longitude;
}

function optionalAngleLongitude(
	chart: NatalChartResult,
	key: "ascendant" | "midheaven",
): number | null {
	const angle = chart.angles.find((item) => item.key === key);
	if (!angle) {
		return null;
	}
	return angle.position.longitude;
}

/**
 * Midpoint composite from two already-calculated natal charts.
 * No Celestine recalculation, houses, or location lookups.
 */
export function calculateCompositeChart(
	chartA: NatalChartResult,
	chartB: NatalChartResult,
): CompositeChartResult {
	const planets = CORE_PLANET_KEYS.map((key) => {
		const longitude = calculateZodiacMidpoint(
			requirePlanetLongitude(chartA, key),
			requirePlanetLongitude(chartB, key),
		);
		return toCompositePlanet(key, longitude);
	});

	const allAspects = collectCompositeAspects(planets);
	const aspects = selectCompositeAspects(allAspects);

	const sun = planets.find((planet) => planet.key === "sun");
	const moon = planets.find((planet) => planet.key === "moon");
	const venus = planets.find((planet) => planet.key === "venus");
	const mars = planets.find((planet) => planet.key === "mars");

	if (!sun || !moon || !venus || !mars) {
		throw new Error("Composite özet gezegenleri eksik.");
	}

	const ascA = optionalAngleLongitude(chartA, "ascendant");
	const ascB = optionalAngleLongitude(chartB, "ascendant");
	const mcA = optionalAngleLongitude(chartA, "midheaven");
	const mcB = optionalAngleLongitude(chartB, "midheaven");

	const ascendant =
		ascA !== null && ascB !== null
			? toCompositePoint(calculateZodiacMidpoint(ascA, ascB))
			: undefined;
	const midheaven =
		mcA !== null && mcB !== null
			? toCompositePoint(calculateZodiacMidpoint(mcA, mcB))
			: undefined;

	const interpretation = buildCompositeInterpretation({
		sun,
		moon,
		venus,
		mars,
		aspects,
	});

	return {
		planets,
		aspects,
		ascendant,
		midheaven,
		interpretation,
		summary: {
			sun,
			moon,
			venus,
			mars,
			highlightAspect: aspects[0] ?? null,
		},
	};
}
