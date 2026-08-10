import type { SynastryAspectType, SynastryBodyKey } from "@/features/synastry/types/synastry";
import { getMaximumSynastryOrb } from "@/features/synastry/constants/synastry-rules";
import { angularDistance } from "@/features/synastry/utils/angular-distance";

export const SYNASTRY_ASPECT_DEFINITIONS: ReadonlyArray<{
	type: SynastryAspectType;
	exactAngle: number;
}> = [
	{ type: "conjunction", exactAngle: 0 },
	{ type: "sextile", exactAngle: 60 },
	{ type: "square", exactAngle: 90 },
	{ type: "trine", exactAngle: 120 },
	{ type: "opposition", exactAngle: 180 },
];

export type DetectedSynastryAspect = {
	aspectType: SynastryAspectType;
	exactAngle: number;
	actualAngle: number;
	orb: number;
	orbFactor: number;
	maxOrb: number;
};

function clamp01(value: number): number {
	if (value < 0) {
		return 0;
	}
	if (value > 1) {
		return 1;
	}
	return value;
}

export function detectSynastryAspect(
	longitudeA: number,
	longitudeB: number,
	bodyA: SynastryBodyKey,
	bodyB: SynastryBodyKey,
): DetectedSynastryAspect | null {
	const actualAngle = angularDistance(longitudeA, longitudeB);
	const maxOrb = getMaximumSynastryOrb(bodyA, bodyB);

	let best: DetectedSynastryAspect | null = null;

	for (const definition of SYNASTRY_ASPECT_DEFINITIONS) {
		const orb = Math.abs(actualAngle - definition.exactAngle);
		if (orb > maxOrb) {
			continue;
		}

		const candidate: DetectedSynastryAspect = {
			aspectType: definition.type,
			exactAngle: definition.exactAngle,
			actualAngle,
			orb,
			orbFactor: clamp01(1 - orb / maxOrb),
			maxOrb,
		};

		if (
			!best ||
			candidate.orb < best.orb ||
			(candidate.orb === best.orb &&
				candidate.exactAngle < best.exactAngle)
		) {
			best = candidate;
		}
	}

	return best;
}
