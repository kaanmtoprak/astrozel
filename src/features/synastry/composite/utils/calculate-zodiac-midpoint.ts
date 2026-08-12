import {
	assertFiniteNumber,
	normalizeLongitude,
} from "@/features/astrology/utils/degrees";

/** Floating-point tolerance for detecting exact antipodal separation. */
const ANTIPODAL_EPSILON = 1e-9;

/**
 * Shortest signed angular difference from `from` to `to` in (−180, 180].
 * For exact antipodes prefer {@link calculateZodiacMidpoint}, which uses an
 * order-independent convention instead of this directed delta.
 */
export function signedShortestDelta(from: number, to: number): number {
	assertFiniteNumber(from, "Longitude from");
	assertFiniteNumber(to, "Longitude to");
	const a = normalizeLongitude(from);
	const b = normalizeLongitude(to);
	let diff = b - a;
	if (diff > 180) {
		diff -= 360;
	} else if (diff <= -180) {
		diff += 360;
	}
	return Object.is(diff, -0) ? 0 : diff;
}

function angularSeparation(a: number, b: number): number {
	const raw = Math.abs(a - b);
	const separation = Math.min(raw, 360 - raw);
	return Object.is(separation, -0) ? 0 : separation;
}

/**
 * Zodiac midpoint of two ecliptic longitudes.
 *
 * Non-antipodal: shortest-arc midpoint (order-independent).
 *
 * Antipodal (~180° apart): two geometric midpoints exist. This helper picks
 * the numerically smaller longitude among
 * `normalize(min(a,b) + 90)` and `normalize(that + 180)`.
 * That is an implementation convention for deterministic, person-order-independent
 * composites — not a claim that one midpoint is astrologically unique.
 */
export function calculateZodiacMidpoint(a: number, b: number): number {
	const na = normalizeLongitude(a);
	const nb = normalizeLongitude(b);
	const separation = angularSeparation(na, nb);

	if (Math.abs(separation - 180) < ANTIPODAL_EPSILON) {
		const lo = Math.min(na, nb);
		const candidateA = normalizeLongitude(lo + 90);
		const candidateB = normalizeLongitude(candidateA + 180);
		return Math.min(candidateA, candidateB);
	}

	return normalizeLongitude(na + signedShortestDelta(na, nb) / 2);
}
