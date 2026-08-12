"use client";

import { useMemo, useState } from "react";
import { AspectLines } from "@/features/astrology/chart/components/aspect-lines";
import { ZodiacRing } from "@/features/astrology/chart/components/zodiac-ring";
import {
	CHART_RADIUS,
	CHART_VIEWBOX_SIZE,
	PLANET_LANE_RADII,
} from "@/features/astrology/chart/constants/chart-layout";
import { layoutPlanets } from "@/features/astrology/chart/utils/planet-layout";
import { longitudeToPoint } from "@/features/astrology/chart/utils/polar";
import {
	PLANET_LABELS,
	PLANET_SYMBOLS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import type { NatalAspect } from "@/features/astrology/types/natal-chart";
import type { CompositeChartResult } from "@/features/synastry/composite/types/composite";
import { formatCompositeDegreeMinute } from "@/features/synastry/composite/utils/composite-format";

export function CompositeChartVisual({
	composite,
}: {
	composite: CompositeChartResult;
}) {
	const [selectedPlanetKey, setSelectedPlanetKey] = useState<string | null>(
		null,
	);
	const [selectedAspectIndex, setSelectedAspectIndex] = useState<number | null>(
		null,
	);

	const ascendantLongitude = composite.ascendant?.longitude ?? 0;

	const layouts = useMemo(
		() =>
			layoutPlanets(
				composite.planets.map((planet) => ({
					key: planet.key,
					longitude: planet.longitude,
				})),
			),
		[composite.planets],
	);

	const natalAspects: NatalAspect[] = useMemo(
		() =>
			composite.aspects.map((aspect) => ({
				body1: aspect.planetA,
				body2: aspect.planetB,
				type: aspect.type,
				symbol: aspect.symbol,
				exactAngle: aspect.exactAngle,
				orb: aspect.orb,
			})),
		[composite.aspects],
	);

	const planetByKey = useMemo(
		() => new Map(composite.planets.map((planet) => [planet.key, planet])),
		[composite.planets],
	);

	return (
		<section
			aria-labelledby="composite-chart-heading"
			className="space-y-4 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<div className="text-center">
				<h2
					id="composite-chart-heading"
					className="font-serif text-xl text-foreground sm:text-2xl"
				>
					İlişki haritası çemberi
				</h2>
				<p className="mt-1 text-sm text-foreground/65">
					Burçlar, composite gezegenler ve major açılar
					{composite.ascendant ? " · ASC midpoint yönelimi" : ""}
				</p>
			</div>

			<div className="mx-auto w-full max-w-[36rem] overflow-hidden">
				<svg
					viewBox={`0 0 ${CHART_VIEWBOX_SIZE} ${CHART_VIEWBOX_SIZE}`}
					role="img"
					className="h-auto w-full"
					style={{ aspectRatio: "1 / 1" }}
					aria-labelledby="composite-chart-title composite-chart-desc"
				>
					<title id="composite-chart-title">İlişki haritası çemberi</title>
					<desc id="composite-chart-desc">
						Composite gezegen konumlarını ve aralarındaki major açıları gösteren
						harita. Ev sistemi gösterilmez.
					</desc>

					<ZodiacRing ascendantLongitude={ascendantLongitude} />
					<AspectLines
						aspects={natalAspects}
						layouts={layouts}
						ascendantLongitude={ascendantLongitude}
						selectedAspectIndex={selectedAspectIndex}
						onSelectAspect={(_aspect, index) => {
							setSelectedAspectIndex(index);
							setSelectedPlanetKey(null);
						}}
					/>

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
									aria-label={`${PLANET_LABELS[planet.key]}, ${ZODIAC_SIGN_LABELS[planet.sign]} ${planet.degree}°`}
									aria-pressed={isSelected}
									style={{ cursor: "pointer" }}
									onClick={() => {
										setSelectedPlanetKey(planet.key);
										setSelectedAspectIndex(null);
									}}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === " ") {
											event.preventDefault();
											setSelectedPlanetKey(planet.key);
											setSelectedAspectIndex(null);
										}
									}}
								>
									<circle
										cx={symbolPoint.x}
										cy={symbolPoint.y}
										r={isSelected ? 16 : 14}
										fill={
											isSelected
												? "color-mix(in srgb, var(--secondary) 85%, white)"
												: "var(--card)"
										}
										stroke="var(--border)"
										strokeWidth={1.2}
									/>
									<text
										x={symbolPoint.x}
										y={symbolPoint.y + 1}
										textAnchor="middle"
										dominantBaseline="middle"
										fontSize={16}
										fill="var(--foreground)"
										aria-hidden="true"
									>
										{PLANET_SYMBOLS[planet.key]}
									</text>
								</g>
							</g>
						);
					})}
				</svg>
			</div>

			{selectedPlanetKey ? (
				(() => {
					const planet = planetByKey.get(selectedPlanetKey as never);
					if (!planet) {
						return null;
					}
					return (
						<p className="text-center text-sm text-foreground/75" role="status">
							{planet.symbol} {planet.name} · {planet.signLabel}{" "}
							{formatCompositeDegreeMinute(planet.degree, planet.minute)}
						</p>
					);
				})()
			) : null}
		</section>
	);
}
