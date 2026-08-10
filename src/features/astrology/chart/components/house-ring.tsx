import {
	CHART_CENTER_X,
	CHART_CENTER_Y,
	CHART_RADIUS,
} from "@/features/astrology/chart/constants/chart-layout";
import {
	longitudeToPoint,
	midpointLongitude,
} from "@/features/astrology/chart/utils/polar";
import type { NatalAngle, NatalHouseCusp } from "@/features/astrology/types/natal-chart";

export function HouseRing({
	houses,
	angles,
	ascendantLongitude,
}: {
	houses: NatalHouseCusp[];
	angles: NatalAngle[];
	ascendantLongitude: number;
}) {
	const sorted = [...houses].sort((a, b) => a.house - b.house);
	const angleByKey = new Map(angles.map((angle) => [angle.key, angle]));

	return (
		<g aria-hidden="true">
			{sorted.map((house, index) => {
				const next = sorted[(index + 1) % sorted.length];
				const isAngular = house.house === 1 || house.house === 4 || house.house === 7 || house.house === 10;
				const cuspPointOuter = longitudeToPoint(
					house.position.longitude,
					ascendantLongitude,
					CHART_RADIUS.zodiacInner,
				);
				const cuspPointInner = longitudeToPoint(
					house.position.longitude,
					ascendantLongitude,
					CHART_RADIUS.aspect * 0.55,
				);
				const midLon = midpointLongitude(
					house.position.longitude,
					next.position.longitude,
				);
				const numberPoint = longitudeToPoint(
					midLon,
					ascendantLongitude,
					CHART_RADIUS.houseNumber,
				);

				return (
					<g key={`house-${house.house}`}>
						<line
							x1={cuspPointOuter.x}
							y1={cuspPointOuter.y}
							x2={cuspPointInner.x}
							y2={cuspPointInner.y}
							stroke={
								isAngular
									? "color-mix(in srgb, var(--foreground) 45%, transparent)"
									: "color-mix(in srgb, var(--foreground) 22%, transparent)"
							}
							strokeWidth={isAngular ? 1.6 : 0.9}
						/>
						<text
							x={numberPoint.x}
							y={numberPoint.y}
							textAnchor="middle"
							dominantBaseline="middle"
							fontSize={13}
							fill="color-mix(in srgb, var(--foreground) 55%, transparent)"
							style={{ fontFamily: "var(--font-sans), sans-serif" }}
						>
							{house.house}
						</text>
					</g>
				);
			})}

			{(["ascendant", "descendant", "midheaven", "imumCoeli"] as const).map(
				(key) => {
					const angle = angleByKey.get(key);
					if (!angle) {
						return null;
					}

					const outer = longitudeToPoint(
						angle.position.longitude,
						ascendantLongitude,
						CHART_RADIUS.angleLabel,
					);
					const inner = longitudeToPoint(
						angle.position.longitude,
						ascendantLongitude,
						CHART_RADIUS.aspect * 0.35,
					);

					return (
						<g key={angle.abbrev}>
							<line
								x1={outer.x}
								y1={outer.y}
								x2={inner.x}
								y2={inner.y}
								stroke="color-mix(in srgb, var(--primary) 55%, var(--foreground))"
								strokeWidth={key === "ascendant" || key === "midheaven" ? 1.8 : 1.3}
							/>
							<text
								x={outer.x}
								y={outer.y}
								textAnchor="middle"
								dominantBaseline="middle"
								fontSize={11}
								fontWeight={600}
								fill="color-mix(in srgb, var(--primary) 80%, var(--foreground))"
								style={{ fontFamily: "var(--font-sans), sans-serif" }}
							>
								{angle.abbrev}
							</text>
						</g>
					);
				},
			)}

			<circle
				cx={CHART_CENTER_X}
				cy={CHART_CENTER_Y}
				r={CHART_RADIUS.aspect}
				fill="none"
				stroke="color-mix(in srgb, var(--border) 70%, transparent)"
				strokeWidth={0.8}
			/>
		</g>
	);
}
