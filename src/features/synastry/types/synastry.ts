import type { ZodiacSign } from "@/features/astrology/types/astrology";
import type { CompositeChartResult } from "@/features/synastry/composite/types/composite";

export type SynastryBodyKey =
	| "sun"
	| "moon"
	| "mercury"
	| "venus"
	| "mars"
	| "jupiter"
	| "saturn"
	| "uranus"
	| "neptune"
	| "pluto"
	| "ascendant";

export type SynastryAspectType =
	| "conjunction"
	| "sextile"
	| "square"
	| "trine"
	| "opposition";

export type SynastryCategory =
	| "emotional"
	| "communication"
	| "attraction"
	| "longTerm";

export type SynastryPolarity = "supportive" | "challenging" | "mixed";

export type SynastryElement = "fire" | "earth" | "air" | "water";

export interface SynastryCategoryScores {
	emotional: number;
	communication: number;
	attraction: number;
	longTerm: number;
}

export interface SynastryPlacementSummary {
	body: "sun" | "moon" | "ascendant";
	sign: ZodiacSign;
	longitude: number;
	degreeInSign: number;
	shortDescription: string;
}

export interface SynastryPersonSummary {
	label: string;
	birthDate: string;
	birthTime: string;
	locationDisplayName: string;
	sun: SynastryPlacementSummary;
	moon: SynastryPlacementSummary;
	ascendant: SynastryPlacementSummary;
	mercurySign: ZodiacSign;
	venusSign: ZodiacSign;
	marsSign: ZodiacSign;
}

export interface SynastryEvidence {
	id: string;
	title: string;
	description: string;
	bodyA?: SynastryBodyKey;
	bodyB?: SynastryBodyKey;
	aspectType?: SynastryAspectType;
	orb?: number;
	polarity?: SynastryPolarity;
}

export interface SynastryCategoryDetail {
	category: SynastryCategory;
	score: number;
	bandLabel: string;
	summary: string[];
	supportiveFactors: SynastryEvidence[];
	challengingFactors: SynastryEvidence[];
	practicalSummary?: string;
}

export interface SynastryMetadata {
	calculationVersion: number;
	zodiacType: "tropical";
	houseSystem: "placidus";
}

export interface SynastryAspect {
	bodyA: SynastryBodyKey;
	bodyB: SynastryBodyKey;
	aspectType: SynastryAspectType;
	exactAngle: number;
	actualAngle: number;
	orb: number;
	orbFactor: number;
	category: SynastryCategory;
	polarity: SynastryPolarity;
	weight: number;
	interpretationKey: string;
}

export interface SynastryInsight {
	title: string;
	summary: string;
	bodyA: SynastryBodyKey;
	bodyB: SynastryBodyKey;
	aspectType: SynastryAspectType;
	orb: number;
	category: SynastryCategory;
	polarity: SynastryPolarity;
	interpretationKey: string;
}

export interface SynastryResult {
	metadata: SynastryMetadata;
	personA: SynastryPersonSummary;
	personB: SynastryPersonSummary;
	overallScore: number;
	categoryScores: SynastryCategoryScores;
	categoryDetails: SynastryCategoryDetail[];
	overview: string[];
	strengths: SynastryInsight[];
	challenges: SynastryInsight[];
	aspects: SynastryAspect[];
	warnings: string[];
	/** Optional midpoint composite; omitted when composite transform fails. */
	composite?: CompositeChartResult;
}
