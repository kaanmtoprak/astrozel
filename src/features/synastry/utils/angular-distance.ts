import {
	assertFiniteNumber,
	normalizeLongitude,
} from "@/features/astrology/utils/degrees";

/**
 * Shortest angular distance between two ecliptic longitudes (0–180).
 */
export function angularDistance(a: number, b: number): number {
	assertFiniteNumber(a, "Longitude A");
	assertFiniteNumber(b, "Longitude B");
	const na = normalizeLongitude(a);
	const nb = normalizeLongitude(b);
	const raw = Math.abs(na - nb);
	const distance = Math.min(raw, 360 - raw);
	return Object.is(distance, -0) ? 0 : distance;
}
