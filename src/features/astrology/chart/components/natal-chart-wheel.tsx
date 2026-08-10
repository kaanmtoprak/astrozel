"use client";

import { useEffect, useMemo, useState } from "react";
import { AspectLines } from "@/features/astrology/chart/components/aspect-lines";
import { ChartCenter } from "@/features/astrology/chart/components/chart-center";
import { ChartLegend } from "@/features/astrology/chart/components/chart-legend";
import { ChartTooltip } from "@/features/astrology/chart/components/chart-tooltip";
import { HouseRing } from "@/features/astrology/chart/components/house-ring";
import { PlanetRing } from "@/features/astrology/chart/components/planet-ring";
import { ZodiacRing } from "@/features/astrology/chart/components/zodiac-ring";
import {
	CHART_VIEWBOX_SIZE,
} from "@/features/astrology/chart/constants/chart-layout";
import type { ChartSelection } from "@/features/astrology/chart/types/chart-geometry";
import { layoutPlanets } from "@/features/astrology/chart/utils/planet-layout";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import { formatDateOnlyDisplay } from "@/lib/date";

export function NatalChartWheel({
	result,
	name,
	birthDate,
	birthTime,
}: {
	result: NatalChartResult;
	name?: string;
	birthDate: string;
	birthTime: string;
}) {
	const [selection, setSelection] = useState<ChartSelection>(null);

	const ascendant = result.angles.find((angle) => angle.key === "ascendant");
	const ascendantLongitude = ascendant?.position.longitude ?? 0;

	const planetLayouts = useMemo(
		() =>
			layoutPlanets(
				result.planets.map((planet) => ({
					key: planet.key,
					longitude: planet.position.longitude,
				})),
			),
		[result.planets],
	);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setSelection(null);
			}
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	return (
		<section className="space-y-4" aria-labelledby="natal-chart-wheel-heading">
			<div className="text-center">
				<h2
					id="natal-chart-wheel-heading"
					className="font-serif text-2xl text-foreground"
				>
					Doğum haritası çemberi
				</h2>
				<p className="mt-1 text-sm text-foreground/65">
					Burçlar, evler, gezegenler ve temel açılar
				</p>
			</div>

			<div className="mx-auto w-full max-w-[40rem]">
				<svg
					viewBox={`0 0 ${CHART_VIEWBOX_SIZE} ${CHART_VIEWBOX_SIZE}`}
					role="img"
					data-pdf-chart="natal"
					className="h-auto w-full"
					style={{ aspectRatio: "1 / 1" }}
					aria-labelledby="natal-chart-title natal-chart-desc"
				>
					<title id="natal-chart-title">Doğum haritası çemberi</title>
					<desc id="natal-chart-desc">
						Burçları, evleri, gezegen konumlarını ve gezegenler arası temel
						açıları gösteren astrolojik harita.
					</desc>

					<ZodiacRing ascendantLongitude={ascendantLongitude} />
					<HouseRing
						houses={result.houses}
						angles={result.angles}
						ascendantLongitude={ascendantLongitude}
					/>
					<AspectLines
						aspects={result.aspects}
						layouts={planetLayouts}
						ascendantLongitude={ascendantLongitude}
						selectedAspectIndex={
							selection?.kind === "aspect"
								? result.aspects.indexOf(selection.aspect)
								: null
						}
						onSelectAspect={(aspect) =>
							setSelection({ kind: "aspect", aspect })
						}
					/>
					<PlanetRing
						planets={result.planets}
						layouts={planetLayouts}
						ascendantLongitude={ascendantLongitude}
						selectedPlanetKey={
							selection?.kind === "planet" ? selection.planet.key : null
						}
						onSelectPlanet={(planet) =>
							setSelection({ kind: "planet", planet })
						}
					/>
					<ChartCenter
						name={name}
						birthDateLabel={formatDateOnlyDisplay(birthDate)}
						birthTime={birthTime}
						placeLabel={result.metadata.locationDisplayName}
					/>
				</svg>
			</div>

			<ChartLegend />
			<ChartTooltip selection={selection} onClose={() => setSelection(null)} />
		</section>
	);
}
