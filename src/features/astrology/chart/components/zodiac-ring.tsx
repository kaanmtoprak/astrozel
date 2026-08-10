import type { ReactNode } from "react";
import {
	CHART_CENTER_X,
	CHART_CENTER_Y,
	CHART_RADIUS,
	ZODIAC_RING_FILLS,
	ZODIAC_SIGN_GLYPHS,
	ZODIAC_SIGN_ORDER,
} from "@/features/astrology/chart/constants/chart-layout";
import {
	longitudeToChartAngle,
	longitudeToPoint,
	polarToCartesian,
} from "@/features/astrology/chart/utils/polar";

function zodiacSectorPath(
	startLongitude: number,
	endLongitude: number,
	ascendantLongitude: number,
	innerRadius: number,
	outerRadius: number,
): string {
	const startOuterAngle = longitudeToChartAngle(
		startLongitude,
		ascendantLongitude,
	);
	const endOuterAngle = longitudeToChartAngle(endLongitude, ascendantLongitude);
	const startInnerAngle = endOuterAngle;
	const endInnerAngle = startOuterAngle;

	const startOuter = polarToCartesian(
		CHART_CENTER_X,
		CHART_CENTER_Y,
		outerRadius,
		startOuterAngle,
	);
	const endOuter = polarToCartesian(
		CHART_CENTER_X,
		CHART_CENTER_Y,
		outerRadius,
		endOuterAngle,
	);
	const startInner = polarToCartesian(
		CHART_CENTER_X,
		CHART_CENTER_Y,
		innerRadius,
		startInnerAngle,
	);
	const endInner = polarToCartesian(
		CHART_CENTER_X,
		CHART_CENTER_Y,
		innerRadius,
		endInnerAngle,
	);

	let sweep = endOuterAngle - startOuterAngle;
	while (sweep < 0) sweep += 360;
	while (sweep >= 360) sweep -= 360;
	const largeArc = sweep > 180 ? 1 : 0;

	return [
		`M ${startOuter.x} ${startOuter.y}`,
		`A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
		`L ${startInner.x} ${startInner.y}`,
		`A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
		"Z",
	].join(" ");
}

function DegreeTicks({ ascendantLongitude }: { ascendantLongitude: number }) {
	const ticks: ReactNode[] = [];

	for (let degree = 0; degree < 360; degree += 5) {
		const isSignBoundary = degree % 30 === 0;
		const isMajor = degree % 10 === 0;
		const outer = CHART_RADIUS.outer;
		const inner = isSignBoundary
			? CHART_RADIUS.zodiacInner
			: isMajor
				? CHART_RADIUS.tickMinor
				: CHART_RADIUS.tickTiny;
		const from = longitudeToPoint(degree, ascendantLongitude, outer);
		const to = longitudeToPoint(degree, ascendantLongitude, inner);

		ticks.push(
			<line
				key={`tick-${degree}`}
				x1={from.x}
				y1={from.y}
				x2={to.x}
				y2={to.y}
				stroke={
					isSignBoundary
						? "color-mix(in srgb, var(--foreground) 35%, transparent)"
						: "color-mix(in srgb, var(--foreground) 18%, transparent)"
				}
				strokeWidth={isSignBoundary ? 1.4 : isMajor ? 1 : 0.7}
				aria-hidden="true"
			/>,
		);
	}

	return <g aria-hidden="true">{ticks}</g>;
}

export function ZodiacRing({
	ascendantLongitude,
}: {
	ascendantLongitude: number;
}) {
	return (
		<g aria-hidden="true">
			{ZODIAC_SIGN_ORDER.map((sign, index) => {
				const startLon = index * 30;
				const endLon = startLon + 30;
				const midLon = startLon + 15;
				const symbolPoint = longitudeToPoint(
					midLon,
					ascendantLongitude,
					CHART_RADIUS.zodiacSymbol,
				);

				return (
					<g key={sign}>
						<path
							d={zodiacSectorPath(
								startLon,
								endLon,
								ascendantLongitude,
								CHART_RADIUS.zodiacInner,
								CHART_RADIUS.outer,
							)}
							fill={ZODIAC_RING_FILLS[index]}
							stroke="color-mix(in srgb, var(--border) 80%, transparent)"
							strokeWidth={0.8}
						/>
						<text
							x={symbolPoint.x}
							y={symbolPoint.y}
							textAnchor="middle"
							dominantBaseline="middle"
							fontSize={22}
							fill="color-mix(in srgb, var(--foreground) 72%, transparent)"
							style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
						>
							{ZODIAC_SIGN_GLYPHS[sign]}
						</text>
					</g>
				);
			})}
			<DegreeTicks ascendantLongitude={ascendantLongitude} />
			<circle
				cx={CHART_CENTER_X}
				cy={CHART_CENTER_Y}
				r={CHART_RADIUS.outer}
				fill="none"
				stroke="color-mix(in srgb, var(--foreground) 25%, transparent)"
				strokeWidth={1.5}
			/>
			<circle
				cx={CHART_CENTER_X}
				cy={CHART_CENTER_Y}
				r={CHART_RADIUS.zodiacInner}
				fill="color-mix(in srgb, var(--card) 92%, white)"
				stroke="color-mix(in srgb, var(--border) 90%, transparent)"
				strokeWidth={1}
			/>
		</g>
	);
}
