import {
	CHART_RADIUS,
	PLANET_LANE_RADII,
} from "@/features/astrology/chart/constants/chart-layout";
import type { PlanetLayoutItem } from "@/features/astrology/chart/types/chart-geometry";
import { longitudeToPoint } from "@/features/astrology/chart/utils/polar";
import {
	PLANET_LABELS,
	PLANET_SYMBOLS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import type { NatalPlanetPosition } from "@/features/astrology/types/natal-chart";

export function PlanetRing({
	planets,
	layouts,
	ascendantLongitude,
	selectedPlanetKey,
	onSelectPlanet,
}: {
	planets: NatalPlanetPosition[];
	layouts: PlanetLayoutItem[];
	ascendantLongitude: number;
	selectedPlanetKey: string | null;
	onSelectPlanet: (planet: NatalPlanetPosition) => void;
}) {
	const planetByKey = new Map(planets.map((planet) => [planet.key, planet]));

	return (
		<g>
			{layouts.map((layout) => {
				const planet = planetByKey.get(layout.planet);
				if (!planet) {
					return null;
				}

				const laneRadius =
					PLANET_LANE_RADII[
						Math.min(layout.radialLane, PLANET_LANE_RADII.length - 1)
					];
				const truePoint = longitudeToPoint(
					layout.trueLongitude,
					ascendantLongitude,
					CHART_RADIUS.zodiacInner - 4,
				);
				const symbolPoint = longitudeToPoint(
					layout.displayLongitude,
					ascendantLongitude,
					laneRadius,
				);
				const isSelected = selectedPlanetKey === planet.key;
				const degreeLabel = `${planet.position.degree}°`;

				return (
					<g key={planet.key}>
						<line
							x1={truePoint.x}
							y1={truePoint.y}
							x2={symbolPoint.x}
							y2={symbolPoint.y}
							stroke="color-mix(in srgb, var(--foreground) 28%, transparent)"
							strokeWidth={0.8}
							aria-hidden="true"
						/>
						<circle
							cx={truePoint.x}
							cy={truePoint.y}
							r={2}
							fill="color-mix(in srgb, var(--accent-gold) 70%, var(--foreground))"
							aria-hidden="true"
						/>
						<g
							role="button"
							tabIndex={0}
							aria-label={`${PLANET_LABELS[planet.key]}, ${ZODIAC_SIGN_LABELS[planet.position.sign]} ${degreeLabel}, ${planet.house}. ev${planet.isRetrograde ? ", retro" : ""}`}
							aria-pressed={isSelected}
							style={{ cursor: "pointer" }}
							onClick={() => onSelectPlanet(planet)}
							onKeyDown={(event) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									onSelectPlanet(planet);
								}
							}}
						>
							<circle
								cx={symbolPoint.x}
								cy={symbolPoint.y}
								r={isSelected ? 16 : 14}
								fill={
									isSelected
										? "color-mix(in srgb, var(--secondary) 80%, white)"
										: "color-mix(in srgb, var(--card) 95%, white)"
								}
								stroke={
									isSelected
										? "var(--primary)"
										: "color-mix(in srgb, var(--border) 90%, transparent)"
								}
								strokeWidth={isSelected ? 1.8 : 1}
							/>
							<text
								x={symbolPoint.x}
								y={symbolPoint.y - 1}
								textAnchor="middle"
								dominantBaseline="middle"
								fontSize={16}
								fill="var(--foreground)"
								style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
							>
								{PLANET_SYMBOLS[planet.key]}
							</text>
							<text
								x={symbolPoint.x}
								y={symbolPoint.y + 12}
								textAnchor="middle"
								dominantBaseline="middle"
								fontSize={8}
								fill="color-mix(in srgb, var(--foreground) 65%, transparent)"
								style={{ fontFamily: "var(--font-sans), sans-serif" }}
							>
								{degreeLabel}
								{planet.isRetrograde ? " ℞" : ""}
							</text>
						</g>
					</g>
				);
			})}
		</g>
	);
}
