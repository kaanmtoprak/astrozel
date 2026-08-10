import {
	assertFiniteNumber,
	normalizeLongitude,
} from "@/features/astrology/utils/degrees";

/**
 * Converts ecliptic longitude to SVG screen angle degrees.
 * ASC sits at the left (180°), DSC at the right (0°),
 * ASC+90° at the bottom (270°), ASC-90° at the top (90°).
 */
export function longitudeToChartAngleDegrees(
	longitude: number,
	ascendantLongitude: number,
): number {
	assertFiniteNumber(longitude, "longitude");
	assertFiniteNumber(ascendantLongitude, "ascendantLongitude");

	const relative = normalizeLongitude(longitude - ascendantLongitude);
	return normalizeLongitude(relative + 180);
}

export function chartAnglePosition(
	angleDegrees: number,
): "left" | "right" | "top" | "bottom" | "other" {
	const angle = normalizeLongitude(angleDegrees);
	if (Math.abs(angle - 180) <= 0.5) {
		return "left";
	}
	if (angle <= 0.5 || angle >= 359.5) {
		return "right";
	}
	if (Math.abs(angle - 90) <= 0.5) {
		return "top";
	}
	if (Math.abs(angle - 270) <= 0.5) {
		return "bottom";
	}
	return "other";
}
