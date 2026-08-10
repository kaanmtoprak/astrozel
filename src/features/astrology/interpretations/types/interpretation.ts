import type {
	AspectType,
	PlanetKey,
	ZodiacSign,
} from "@/features/astrology/types/astrology";

export type InterpretationCategory =
	| "sun"
	| "moon"
	| "ascendant"
	| "planet-sign"
	| "planet-house"
	| "aspect";

export type InterpretationElement = "fire" | "earth" | "air" | "water";
export type InterpretationModality = "cardinal" | "fixed" | "mutable";

export interface AstrologyInterpretation {
	id: string;
	category: InterpretationCategory;
	title: string;
	summary: string;
	detail?: string;
	priority: number;
	relatedKeys: string[];
}

export interface BigThreeInterpretation {
	id: string;
	category: "sun" | "moon" | "ascendant";
	sign: ZodiacSign;
	title: string;
	summary: string;
	potential: string;
	balance: string;
	roleLabel: string;
	degreeFormatted: string;
	priority: number;
	relatedKeys: string[];
}

export interface PlanetPlacementInterpretation {
	id: string;
	planet: PlanetKey;
	sign: ZodiacSign;
	house: number;
	isRetrograde: boolean;
	title: string;
	signSummary: string;
	houseSummary: string;
	retrogradeNote?: string;
	/** Güneş/Ay için büyük üçlüde uzun metin varken kısaltılmış özet. */
	isCompact: boolean;
	priority: number;
	relatedKeys: string[];
}

export interface AspectInterpretation {
	id: string;
	body1: PlanetKey;
	body2: PlanetKey;
	type: AspectType;
	title: string;
	summary: string;
	orb: number;
	orbLabel: string;
	priority: number;
	relatedKeys: string[];
}

export interface NatalInterpretationResult {
	overview: BigThreeInterpretation[];
	planets: PlanetPlacementInterpretation[];
	aspects: AspectInterpretation[];
	warnings: string[];
}
