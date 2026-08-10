import {
	CHART_RADIUS,
} from "@/features/astrology/chart/constants/chart-layout";
import type { PlanetLayoutItem } from "@/features/astrology/chart/types/chart-geometry";
import { getAspectLineStyle } from "@/features/astrology/chart/utils/aspect-style";
import { longitudeToPoint } from "@/features/astrology/chart/utils/polar";
import {
	ASPECT_LABELS,
	PLANET_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import type { NatalAspect } from "@/features/astrology/types/natal-chart";
import { formatAspectOrb } from "@/features/astrology/components/chart-summary";

export function AspectLines({
	aspects,
	layouts,
	ascendantLongitude,
	selectedAspectIndex,
	onSelectAspect,
}: {
	aspects: NatalAspect[];
	layouts: PlanetLayoutItem[];
	ascendantLongitude: number;
	selectedAspectIndex: number | null;
	onSelectAspect: (aspect: NatalAspect, index: number) => void;
}) {
	const trueLongitudeByPlanet = new Map(
		layouts.map((layout) => [layout.planet, layout.trueLongitude]),
	);

	return (
		<g>
			{aspects.map((aspect, index) => {
				const lon1 = trueLongitudeByPlanet.get(aspect.body1);
				const lon2 = trueLongitudeByPlanet.get(aspect.body2);
				if (lon1 === undefined || lon2 === undefined) {
					return null;
				}

				const style = getAspectLineStyle(aspect.type, aspect.orb);
				const p1 = longitudeToPoint(lon1, ascendantLongitude, CHART_RADIUS.aspect);
				const p2 = longitudeToPoint(lon2, ascendantLongitude, CHART_RADIUS.aspect);
				const isSelected = selectedAspectIndex === index;
				const midX = (p1.x + p2.x) / 2;
				const midY = (p1.y + p2.y) / 2;

				return (
					<g key={`${aspect.body1}-${aspect.type}-${aspect.body2}-${index}`}>
						<line
							x1={p1.x}
							y1={p1.y}
							x2={p2.x}
							y2={p2.y}
							stroke={style.stroke}
							strokeOpacity={isSelected ? Math.min(1, style.opacity + 0.2) : style.opacity}
							strokeWidth={isSelected ? style.strokeWidth + 0.6 : style.strokeWidth}
							strokeDasharray={style.dashArray}
							aria-hidden="true"
						/>
						<circle
							cx={midX}
							cy={midY}
							r={10}
							fill="transparent"
							role="button"
							tabIndex={0}
							aria-label={`${PLANET_LABELS[aspect.body1]} ${ASPECT_LABELS[aspect.type]} ${PLANET_LABELS[aspect.body2]}, orb ${formatAspectOrb(aspect.orb)}`}
							style={{ cursor: "pointer" }}
							onClick={() => onSelectAspect(aspect, index)}
							onKeyDown={(event) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									onSelectAspect(aspect, index);
								}
							}}
						/>
					</g>
				);
			})}
		</g>
	);
}
