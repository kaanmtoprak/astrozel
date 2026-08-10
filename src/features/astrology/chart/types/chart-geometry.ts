import type { AspectType, PlanetKey } from "@/features/astrology/types/astrology";
import type {
	NatalAngle,
	NatalAspect,
	NatalHouseCusp,
	NatalPlanetPosition,
} from "@/features/astrology/types/natal-chart";

export interface CartesianPoint {
	x: number;
	y: number;
}

export interface PlanetLayoutInput {
	key: PlanetKey;
	longitude: number;
}

export interface PlanetLayoutItem {
	planet: PlanetKey;
	trueLongitude: number;
	displayLongitude: number;
	radialLane: number;
	displacement: number;
}

export interface AspectLineStyle {
	stroke: string;
	opacity: number;
	strokeWidth: number;
	dashArray?: string;
}

export interface ChartSelectionPlanet {
	kind: "planet";
	planet: NatalPlanetPosition;
}

export interface ChartSelectionAspect {
	kind: "aspect";
	aspect: NatalAspect;
}

export type ChartSelection = ChartSelectionPlanet | ChartSelectionAspect | null;

export interface ChartGeometryContext {
	ascendantLongitude: number;
	houses: NatalHouseCusp[];
	angles: NatalAngle[];
	planets: NatalPlanetPosition[];
	aspects: NatalAspect[];
	planetLayouts: PlanetLayoutItem[];
}

export type AngleAbbrev = "ASC" | "DSC" | "MC" | "IC";

export interface AspectStyleInput {
	type: AspectType;
	orb: number;
}
