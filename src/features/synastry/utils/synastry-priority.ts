import type { SynastryBodyKey } from "@/features/synastry/types/synastry";
import {
	PERSONAL_SYNASTRY_BODIES,
	SYNASTRY_BODY_ORDER,
} from "@/features/synastry/constants/synastry-labels";

export function synastryBodyRank(body: SynastryBodyKey): number {
	const index = SYNASTRY_BODY_ORDER.indexOf(body);
	return index === -1 ? 99 : index;
}

export function normalizeSynastryBodyPair(
	bodyA: SynastryBodyKey,
	bodyB: SynastryBodyKey,
): [SynastryBodyKey, SynastryBodyKey] {
	if (synastryBodyRank(bodyA) <= synastryBodyRank(bodyB)) {
		return [bodyA, bodyB];
	}
	return [bodyB, bodyA];
}

export function personalPlanetPriority(body: SynastryBodyKey): number {
	if (PERSONAL_SYNASTRY_BODIES.has(body)) {
		return 0;
	}
	if (body === "jupiter" || body === "saturn") {
		return 1;
	}
	return 2;
}

export function aspectHighlightScore(input: {
	weight: number;
	orbFactor: number;
	bodyA: SynastryBodyKey;
	bodyB: SynastryBodyKey;
}): number {
	const personal =
		(2 - personalPlanetPriority(input.bodyA)) +
		(2 - personalPlanetPriority(input.bodyB));
	return input.weight * 10 + input.orbFactor * 5 + personal;
}

export function compareAspectPriority(
	left: {
		weight: number;
		orbFactor: number;
		bodyA: SynastryBodyKey;
		bodyB: SynastryBodyKey;
	},
	right: {
		weight: number;
		orbFactor: number;
		bodyA: SynastryBodyKey;
		bodyB: SynastryBodyKey;
	},
): number {
	const scoreDiff =
		aspectHighlightScore(right) - aspectHighlightScore(left);
	if (scoreDiff !== 0) {
		return scoreDiff;
	}

	const weightDiff = right.weight - left.weight;
	if (weightDiff !== 0) {
		return weightDiff;
	}

	const orbDiff = right.orbFactor - left.orbFactor;
	if (orbDiff !== 0) {
		return orbDiff;
	}

	const personalDiff =
		personalPlanetPriority(left.bodyA) +
		personalPlanetPriority(left.bodyB) -
		(personalPlanetPriority(right.bodyA) +
			personalPlanetPriority(right.bodyB));
	if (personalDiff !== 0) {
		return personalDiff;
	}

	const bodyADiff = synastryBodyRank(left.bodyA) - synastryBodyRank(right.bodyA);
	if (bodyADiff !== 0) {
		return bodyADiff;
	}

	return synastryBodyRank(left.bodyB) - synastryBodyRank(right.bodyB);
}
