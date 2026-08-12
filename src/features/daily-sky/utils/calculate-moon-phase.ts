import { normalizeLongitude } from "@/features/astrology/utils/degrees";
import type {
	MoonPhase,
	MoonPhaseKey,
} from "@/features/daily-sky/types/daily-sky";

const PHASE_DEFINITIONS: ReadonlyArray<{
	key: MoonPhaseKey;
	name: string;
	minExclusive: number;
	maxInclusive: number;
}> = [
	{ key: "waxing_crescent", name: "Büyüyen Hilal", minExclusive: 22.5, maxInclusive: 67.5 },
	{ key: "first_quarter", name: "İlk Dördün", minExclusive: 67.5, maxInclusive: 112.5 },
	{
		key: "waxing_gibbous",
		name: "Büyüyen Şişkin Ay",
		minExclusive: 112.5,
		maxInclusive: 157.5,
	},
	{ key: "full_moon", name: "Dolunay", minExclusive: 157.5, maxInclusive: 202.5 },
	{
		key: "waning_gibbous",
		name: "Küçülen Şişkin Ay",
		minExclusive: 202.5,
		maxInclusive: 247.5,
	},
	{ key: "last_quarter", name: "Son Dördün", minExclusive: 247.5, maxInclusive: 292.5 },
	{
		key: "waning_crescent",
		name: "Küçülen Hilal",
		minExclusive: 292.5,
		maxInclusive: 337.5,
	},
];

/**
 * Moon phase from Sun–Moon ecliptic elongation (moon − sun), normalized 0–360°.
 * Illumination ≈ (1 − cos θ) / 2.
 */
export function calculateMoonPhase(
	sunLongitude: number,
	moonLongitude: number,
): MoonPhase {
	const angle = normalizeLongitude(moonLongitude - sunLongitude);
	const angleRadians = (angle * Math.PI) / 180;
	const illumination = (1 - Math.cos(angleRadians)) / 2;
	const illuminationPercent = Math.round(illumination * 1000) / 10;

	let key: MoonPhaseKey = "new_moon";
	let name = "Yeni Ay";

	if (angle > 337.5 || angle <= 22.5) {
		key = "new_moon";
		name = "Yeni Ay";
	} else {
		const match = PHASE_DEFINITIONS.find(
			(phase) => angle > phase.minExclusive && angle <= phase.maxInclusive,
		);
		if (match) {
			key = match.key;
			name = match.name;
		}
	}

	return {
		key,
		name,
		illumination,
		illuminationPercent,
		angle,
	};
}
