import {
	ASPECT_LABELS,
	PLANET_LABELS,
	PLANET_SYMBOLS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import type { PlanetarySnapshotResult } from "@/features/astrology/types/planetary-snapshot";
import type {
	DailySkyAspect,
	DailySkyPlanet,
	DailySkySummary,
} from "@/features/daily-sky/types/daily-sky";
import { calculateMoonPhase } from "@/features/daily-sky/utils/calculate-moon-phase";
import { formatDateOnlyDisplay } from "@/lib/date";

export const DAILY_SKY_MAX_ASPECTS = 8;

export function toDailySkyPlanet(
	planet: PlanetarySnapshotResult["planets"][number],
): DailySkyPlanet {
	return {
		key: planet.key,
		name: PLANET_LABELS[planet.key],
		symbol: PLANET_SYMBOLS[planet.key],
		longitude: planet.position.longitude,
		sign: planet.position.sign,
		signLabel: ZODIAC_SIGN_LABELS[planet.position.sign],
		degree: planet.position.degree,
		minute: planet.position.minute,
		isRetrograde: planet.isRetrograde,
	};
}

export function selectDailySkyAspects(
	snapshot: PlanetarySnapshotResult,
): DailySkyAspect[] {
	return [...snapshot.aspects]
		.sort((a, b) => a.orb - b.orb)
		.slice(0, DAILY_SKY_MAX_ASPECTS)
		.map((aspect) => ({
			planetA: aspect.body1,
			planetB: aspect.body2,
			planetAName: PLANET_LABELS[aspect.body1],
			planetBName: PLANET_LABELS[aspect.body2],
			type: aspect.type,
			typeLabel: ASPECT_LABELS[aspect.type],
			symbol: aspect.symbol,
			orb: aspect.orb,
		}));
}

export function buildDailySkySummary(input: {
	sun: DailySkyPlanet;
	moon: DailySkyPlanet;
	moonPhaseName: string;
	retrogradeCount: number;
	topAspect: DailySkyAspect | null;
}): DailySkySummary {
	return {
		sunSignLabel: input.sun.signLabel,
		moonSignLabel: input.moon.signLabel,
		moonPhaseName: input.moonPhaseName,
		retrogradeCount: input.retrogradeCount,
		highlightAspectLabel: input.topAspect
			? `${input.topAspect.planetAName} ${input.topAspect.typeLabel} ${input.topAspect.planetBName}`
			: null,
	};
}

export function formatDegreeMinute(degree: number, minute: number): string {
	return `${degree}° ${String(minute).padStart(2, "0")}′`;
}

export function formatDailySkyDisplayDate(date: string): string {
	return formatDateOnlyDisplay(date);
}

export function buildMoonPhaseFromSnapshot(
	snapshot: PlanetarySnapshotResult,
) {
	const sun = snapshot.planets.find((planet) => planet.key === "sun");
	const moon = snapshot.planets.find((planet) => planet.key === "moon");
	if (!sun || !moon) {
		throw new Error("Güneş veya Ay konumu eksik.");
	}
	return calculateMoonPhase(sun.position.longitude, moon.position.longitude);
}
