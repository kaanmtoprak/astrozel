import {
	CHART_CENTER_X,
	CHART_CENTER_Y,
} from "@/features/astrology/chart/constants/chart-layout";
import type { CartesianPoint } from "@/features/astrology/chart/types/chart-geometry";
import { longitudeToChartAngleDegrees } from "@/features/astrology/chart/utils/chart-rotation";
import {
	assertFiniteNumber,
	normalizeLongitude,
} from "@/features/astrology/utils/degrees";

function toRadians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

export function polarToCartesian(
	centerX: number,
	centerY: number,
	radius: number,
	angleDegrees: number,
): CartesianPoint {
	assertFiniteNumber(centerX, "centerX");
	assertFiniteNumber(centerY, "centerY");
	assertFiniteNumber(radius, "radius");
	assertFiniteNumber(angleDegrees, "angleDegrees");

	const radians = toRadians(angleDegrees);
	return {
		x: centerX + radius * Math.cos(radians),
		y: centerY - radius * Math.sin(radians),
	};
}

export function longitudeToChartAngle(
	longitude: number,
	ascendantLongitude: number,
): number {
	return longitudeToChartAngleDegrees(longitude, ascendantLongitude);
}

export function longitudeToPoint(
	longitude: number,
	ascendantLongitude: number,
	radius: number,
	centerX: number = CHART_CENTER_X,
	centerY: number = CHART_CENTER_Y,
): CartesianPoint {
	const angle = longitudeToChartAngle(longitude, ascendantLongitude);
	return polarToCartesian(centerX, centerY, radius, angle);
}

export function midpointLongitude(start: number, end: number): number {
	const startNorm = normalizeLongitude(start);
	const span = normalizeLongitude(end - startNorm);
	return normalizeLongitude(startNorm + span / 2);
}

export function describeArc(
	centerX: number,
	centerY: number,
	radius: number,
	startAngleDegrees: number,
	endAngleDegrees: number,
): string {
	assertFiniteNumber(centerX, "centerX");
	assertFiniteNumber(centerY, "centerY");
	assertFiniteNumber(radius, "radius");
	assertFiniteNumber(startAngleDegrees, "startAngleDegrees");
	assertFiniteNumber(endAngleDegrees, "endAngleDegrees");

	if (radius < 0) {
		throw new Error("radius negatif olamaz.");
	}

	const start = polarToCartesian(centerX, centerY, radius, startAngleDegrees);
	const end = polarToCartesian(centerX, centerY, radius, endAngleDegrees);
	let sweep = endAngleDegrees - startAngleDegrees;
	while (sweep < 0) sweep += 360;
	while (sweep >= 360) sweep -= 360;

	const largeArcFlag = sweep > 180 ? 1 : 0;
	// sweep-flag 0 draws clockwise in SVG when y increases downward;
	// our angle increases counter-clockwise in math space with y flipped via polarToCartesian.
	return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}
