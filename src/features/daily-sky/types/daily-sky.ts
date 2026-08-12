import type {
	AspectType,
	PlanetKey,
	ZodiacSign,
} from "@/features/astrology/types/astrology";

export type MoonPhaseKey =
	| "new_moon"
	| "waxing_crescent"
	| "first_quarter"
	| "waxing_gibbous"
	| "full_moon"
	| "waning_gibbous"
	| "last_quarter"
	| "waning_crescent";

export type DailySkyPlanet = {
	key: PlanetKey;
	name: string;
	symbol: string;
	longitude: number;
	sign: ZodiacSign;
	signLabel: string;
	degree: number;
	minute: number;
	isRetrograde: boolean;
};

export type DailySkyAspect = {
	planetA: PlanetKey;
	planetB: PlanetKey;
	planetAName: string;
	planetBName: string;
	type: AspectType;
	typeLabel: string;
	symbol: string;
	orb: number;
};

export type MoonPhase = {
	key: MoonPhaseKey;
	name: string;
	illumination: number;
	illuminationPercent: number;
	angle: number;
};

export type DailySkySummary = {
	sunSignLabel: string;
	moonSignLabel: string;
	moonPhaseName: string;
	retrogradeCount: number;
	highlightAspectLabel: string | null;
};

export type DailySkyInterpretation = {
	atmosphere: [string, string];
	themeTitle: string;
	themeBody: string;
	suggestion: string;
};

export type DailySkyResult = {
	date: string;
	referenceTime: string;
	displayDate: string;
	planets: DailySkyPlanet[];
	sun: DailySkyPlanet;
	moon: DailySkyPlanet;
	moonPhase: MoonPhase;
	retrogradePlanets: DailySkyPlanet[];
	aspects: DailySkyAspect[];
	summary: DailySkySummary;
	interpretation: DailySkyInterpretation;
};
