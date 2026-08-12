import type { AspectType, PlanetKey } from "@/features/astrology/types/astrology";
import {
	ASPECT_LABELS,
	ASPECT_SYMBOLS,
	PLANET_LABELS,
	PLANET_SYMBOLS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import { MAJOR_ASPECT_TYPES } from "@/features/astrology/constants/astrology-settings";
import { longitudeToZodiacPosition } from "@/features/astrology/utils/degrees";
import type {
	CompositeAspect,
	CompositePlanet,
	CompositePoint,
} from "@/features/synastry/composite/types/composite";
import { getMaximumSynastryOrb } from "@/features/synastry/constants/synastry-rules";
import type { SynastryBodyKey } from "@/features/synastry/types/synastry";
import { angularDistance } from "@/features/synastry/utils/angular-distance";

export const COMPOSITE_MAX_ASPECTS = 8;

const COMPOSITE_ASPECT_DEFINITIONS: ReadonlyArray<{
	type: AspectType;
	exactAngle: number;
}> = MAJOR_ASPECT_TYPES.map((type) => {
	const exactAngle =
		type === "conjunction"
			? 0
			: type === "sextile"
				? 60
				: type === "square"
					? 90
					: type === "trine"
						? 120
						: 180;
	return { type, exactAngle };
});

export function toCompositePlanet(
	key: PlanetKey,
	longitude: number,
): CompositePlanet {
	const position = longitudeToZodiacPosition(longitude);
	return {
		key,
		name: PLANET_LABELS[key],
		symbol: PLANET_SYMBOLS[key],
		longitude: position.longitude,
		sign: position.sign,
		signLabel: ZODIAC_SIGN_LABELS[position.sign],
		degree: position.degree,
		minute: position.minute,
	};
}

export function toCompositePoint(longitude: number): CompositePoint {
	const position = longitudeToZodiacPosition(longitude);
	return {
		longitude: position.longitude,
		sign: position.sign,
		signLabel: ZODIAC_SIGN_LABELS[position.sign],
		degree: position.degree,
		minute: position.minute,
	};
}

export function formatCompositeDegreeMinute(
	degree: number,
	minute: number,
): string {
	return `${degree}° ${String(minute).padStart(2, "0")}′`;
}

/**
 * Detect a major aspect between two composite planet longitudes.
 * Reuses synastry orb tiers via planet body keys (no ASC involvement).
 */
export function detectCompositeAspect(
	longitudeA: number,
	longitudeB: number,
	planetA: PlanetKey,
	planetB: PlanetKey,
): Omit<
	CompositeAspect,
	"planetAName" | "planetBName" | "typeLabel" | "symbol"
> | null {
	const actualAngle = angularDistance(longitudeA, longitudeB);
	const maxOrb = getMaximumSynastryOrb(
		planetA as SynastryBodyKey,
		planetB as SynastryBodyKey,
	);

	let best: {
		type: AspectType;
		exactAngle: number;
		orb: number;
	} | null = null;

	for (const definition of COMPOSITE_ASPECT_DEFINITIONS) {
		const orb = Math.abs(actualAngle - definition.exactAngle);
		if (orb > maxOrb) {
			continue;
		}
		if (
			!best ||
			orb < best.orb ||
			(orb === best.orb && definition.exactAngle < best.exactAngle)
		) {
			best = {
				type: definition.type,
				exactAngle: definition.exactAngle,
				orb,
			};
		}
	}

	if (!best) {
		return null;
	}

	return {
		planetA,
		planetB,
		type: best.type,
		orb: best.orb,
		exactAngle: best.exactAngle,
	};
}

export function collectCompositeAspects(
	planets: CompositePlanet[],
): CompositeAspect[] {
	const aspects: CompositeAspect[] = [];

	for (let i = 0; i < planets.length; i += 1) {
		for (let j = i + 1; j < planets.length; j += 1) {
			const a = planets[i];
			const b = planets[j];
			const detected = detectCompositeAspect(
				a.longitude,
				b.longitude,
				a.key,
				b.key,
			);
			if (!detected) {
				continue;
			}
			aspects.push({
				...detected,
				planetAName: PLANET_LABELS[detected.planetA],
				planetBName: PLANET_LABELS[detected.planetB],
				typeLabel: ASPECT_LABELS[detected.type],
				symbol: ASPECT_SYMBOLS[detected.type],
			});
		}
	}

	return aspects.sort((left, right) => left.orb - right.orb);
}

export function selectCompositeAspects(
	aspects: CompositeAspect[],
): CompositeAspect[] {
	return aspects.slice(0, COMPOSITE_MAX_ASPECTS);
}
