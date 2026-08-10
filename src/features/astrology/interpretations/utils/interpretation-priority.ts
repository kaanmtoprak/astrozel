import type { NatalAspect } from "@/features/astrology/types/natal-chart";
import type { PlanetKey } from "@/features/astrology/types/astrology";
import { MAJOR_ASPECT_TYPES } from "@/features/astrology/constants/astrology-settings";
import {
	MAX_ASPECT_INTERPRETATIONS,
	ORB_CLOSE_MAX,
	ORB_VERY_CLOSE_MAX,
	PLANET_INTERPRETATION_ORDER,
} from "@/features/astrology/interpretations/constants/interpretation-settings";

const MAJOR_ASPECT_SET = new Set<string>(MAJOR_ASPECT_TYPES);

function planetRank(key: PlanetKey): number {
	const index = PLANET_INTERPRETATION_ORDER.indexOf(key);
	return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function isValidOrb(orb: number): boolean {
	return Number.isFinite(orb) && orb >= 0;
}

/**
 * Major açıları orb (küçük önce), sonra gezegen sırasına göre deterministic sıralar.
 * Geçersiz orb’lar sona atılır. En fazla MAX_ASPECT_INTERPRETATIONS döner.
 */
export function prioritizeAspectsForInterpretation(
	aspects: readonly NatalAspect[],
	limit: number = MAX_ASPECT_INTERPRETATIONS,
): NatalAspect[] {
	const major = aspects.filter((aspect) => MAJOR_ASPECT_SET.has(aspect.type));

	const sorted = [...major].sort((a, b) => {
		const aValid = isValidOrb(a.orb);
		const bValid = isValidOrb(b.orb);

		if (aValid && !bValid) {
			return -1;
		}
		if (!aValid && bValid) {
			return 1;
		}
		if (aValid && bValid && a.orb !== b.orb) {
			return a.orb - b.orb;
		}

		const body1Diff = planetRank(a.body1) - planetRank(b.body1);
		if (body1Diff !== 0) {
			return body1Diff;
		}

		const body2Diff = planetRank(a.body2) - planetRank(b.body2);
		if (body2Diff !== 0) {
			return body2Diff;
		}

		return a.type.localeCompare(b.type);
	});

	const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 0;
	return sorted.slice(0, safeLimit);
}

export function getOrbLabel(orb: number): string {
	if (!isValidOrb(orb)) {
		return "Orb bilgisi belirsiz";
	}
	if (orb <= ORB_VERY_CLOSE_MAX) {
		return "Çok yakın açı";
	}
	if (orb <= ORB_CLOSE_MAX) {
		return "Yakın açı";
	}
	return "Daha geniş orb";
}
