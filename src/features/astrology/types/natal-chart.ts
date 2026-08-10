import type { BirthLocation } from "@/features/location/types/location";
import type {
	AspectType,
	HouseSystem,
	PlanetKey,
	ZodiacSign,
	ZodiacType,
} from "@/features/astrology/types/astrology";

export interface ZodiacPosition {
	longitude: number;
	sign: ZodiacSign;
	signDegree: number;
	degree: number;
	minute: number;
	second: number;
	formatted: string;
}

export interface NatalPlanetPosition {
	key: PlanetKey;
	position: ZodiacPosition;
	house: number;
	isRetrograde: boolean;
}

export interface NatalAngle {
	key: "ascendant" | "midheaven" | "descendant" | "imumCoeli";
	abbrev: "ASC" | "MC" | "DSC" | "IC";
	position: ZodiacPosition;
}

export interface NatalHouseCusp {
	house: number;
	position: ZodiacPosition;
}

export interface NatalAspect {
	body1: PlanetKey;
	body2: PlanetKey;
	type: AspectType;
	symbol: string;
	exactAngle: number;
	orb: number;
}

export interface NatalChartWarning {
	code: string;
	message: string;
}

export interface NatalChartMetadata {
	provider: "celestine";
	calculationVersion: number;
	zodiacType: ZodiacType;
	houseSystem: HouseSystem;
	localDateTime: string;
	timezone: string;
	utcInstant: string;
	utcOffsetMinutes: number;
	latitude: number;
	longitude: number;
	locationDisplayName: string;
}

export interface NatalChartResult {
	metadata: NatalChartMetadata;
	angles: NatalAngle[];
	planets: NatalPlanetPosition[];
	houses: NatalHouseCusp[];
	aspects: NatalAspect[];
	warnings: NatalChartWarning[];
}

export interface NatalChartCalculationInput {
	birthDate: string;
	birthTime: string;
	location: BirthLocation;
}
