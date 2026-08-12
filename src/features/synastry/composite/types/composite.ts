import type {
	AspectType,
	PlanetKey,
	ZodiacSign,
} from "@/features/astrology/types/astrology";

export type CompositePlanet = {
	key: PlanetKey;
	name: string;
	symbol: string;
	longitude: number;
	sign: ZodiacSign;
	signLabel: string;
	degree: number;
	minute: number;
};

export type CompositeAspect = {
	planetA: PlanetKey;
	planetB: PlanetKey;
	planetAName: string;
	planetBName: string;
	type: AspectType;
	typeLabel: string;
	symbol: string;
	orb: number;
	exactAngle: number;
};

export type CompositePoint = {
	longitude: number;
	sign: ZodiacSign;
	signLabel: string;
	degree: number;
	minute: number;
};

export type CompositeInterpretation = {
	character: string[];
	emotional: string[];
	love: string[];
	drive: string[];
	supportiveDynamics: string[];
	challengingDynamics: string[];
	sharedTheme: string[];
};

export type CompositeChartResult = {
	planets: CompositePlanet[];
	aspects: CompositeAspect[];
	ascendant?: CompositePoint;
	midheaven?: CompositePoint;
	interpretation: CompositeInterpretation;
	summary: {
		sun: CompositePlanet;
		moon: CompositePlanet;
		venus: CompositePlanet;
		mars: CompositePlanet;
		highlightAspect: CompositeAspect | null;
	};
};
