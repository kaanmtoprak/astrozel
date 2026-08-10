import type {
	SynastryAspectType,
	SynastryBodyKey,
	SynastryCategory,
	SynastryPolarity,
} from "@/features/synastry/types/synastry";
import { normalizeSynastryBodyPair } from "@/features/synastry/utils/synastry-priority";

export type SynastryRule = {
	bodyA: SynastryBodyKey;
	bodyB: SynastryBodyKey;
	aspectType: SynastryAspectType;
	category: SynastryCategory;
	/** Optional secondary category with smaller weight share. */
	secondaryCategory?: SynastryCategory;
	polarity: SynastryPolarity;
	baseWeight: number;
	interpretationKey: string;
};

function rule(
	bodyA: SynastryBodyKey,
	bodyB: SynastryBodyKey,
	aspectType: SynastryAspectType,
	category: SynastryCategory,
	polarity: SynastryPolarity,
	baseWeight: number,
	secondaryCategory?: SynastryCategory,
): SynastryRule {
	const [a, b] = normalizeSynastryBodyPair(bodyA, bodyB);
	return {
		bodyA: a,
		bodyB: b,
		aspectType,
		category,
		secondaryCategory,
		polarity,
		baseWeight,
		interpretationKey: `synastry.${a}.${b}.${aspectType}`,
	};
}

/**
 * Explicit meaningful pair+aspect rules used for scoring and copy.
 * Pairs are stored in deterministic body order.
 */
export const SYNASTRY_RULES: readonly SynastryRule[] = [
	// Sun–Moon
	rule("sun", "moon", "conjunction", "emotional", "supportive", 10),
	rule("sun", "moon", "trine", "emotional", "supportive", 11),
	rule("sun", "moon", "sextile", "emotional", "supportive", 8),
	rule("sun", "moon", "square", "emotional", "challenging", 9),
	rule("sun", "moon", "opposition", "emotional", "mixed", 9),

	// Moon–Moon
	rule("moon", "moon", "conjunction", "emotional", "supportive", 10, "longTerm"),
	rule("moon", "moon", "trine", "emotional", "supportive", 10, "longTerm"),
	rule("moon", "moon", "sextile", "emotional", "supportive", 7),
	rule("moon", "moon", "square", "emotional", "challenging", 9),
	rule("moon", "moon", "opposition", "emotional", "mixed", 8),

	// Moon–Venus / Moon–Mars
	rule("moon", "venus", "conjunction", "emotional", "supportive", 9),
	rule("moon", "venus", "trine", "emotional", "supportive", 9),
	rule("moon", "venus", "sextile", "emotional", "supportive", 7),
	rule("moon", "venus", "square", "emotional", "challenging", 7),
	rule("moon", "mars", "conjunction", "emotional", "mixed", 8, "attraction"),
	rule("moon", "mars", "trine", "emotional", "supportive", 8, "attraction"),
	rule("moon", "mars", "square", "emotional", "challenging", 8, "attraction"),
	rule("moon", "mars", "opposition", "emotional", "mixed", 8, "attraction"),

	// Mercury
	rule("mercury", "mercury", "conjunction", "communication", "supportive", 10),
	rule("mercury", "mercury", "trine", "communication", "supportive", 10),
	rule("mercury", "mercury", "sextile", "communication", "supportive", 8),
	rule("mercury", "mercury", "square", "communication", "challenging", 9),
	rule("mercury", "mercury", "opposition", "communication", "mixed", 8),
	rule("mercury", "sun", "conjunction", "communication", "supportive", 8),
	rule("mercury", "sun", "trine", "communication", "supportive", 8),
	rule("mercury", "sun", "square", "communication", "challenging", 7),
	rule("mercury", "moon", "conjunction", "communication", "supportive", 8),
	rule("mercury", "moon", "trine", "communication", "supportive", 8),
	rule("mercury", "moon", "square", "communication", "challenging", 8),
	rule("mercury", "venus", "trine", "communication", "supportive", 7),
	rule("mercury", "venus", "square", "communication", "challenging", 6),
	rule("mercury", "mars", "trine", "communication", "supportive", 7),
	rule("mercury", "mars", "square", "communication", "challenging", 8),

	// Venus / Mars attraction
	rule("venus", "venus", "conjunction", "attraction", "supportive", 9),
	rule("venus", "venus", "trine", "attraction", "supportive", 9),
	rule("venus", "venus", "square", "attraction", "challenging", 7),
	rule("venus", "mars", "conjunction", "attraction", "supportive", 12),
	rule("venus", "mars", "trine", "attraction", "supportive", 10),
	rule("venus", "mars", "sextile", "attraction", "supportive", 8),
	rule("venus", "mars", "square", "attraction", "mixed", 9),
	rule("venus", "mars", "opposition", "attraction", "mixed", 11),
	rule("mars", "mars", "conjunction", "attraction", "mixed", 8),
	rule("mars", "mars", "trine", "attraction", "supportive", 7),
	rule("mars", "mars", "square", "attraction", "challenging", 8),
	rule("mars", "mars", "opposition", "attraction", "mixed", 8),

	// Jupiter
	rule("jupiter", "sun", "conjunction", "longTerm", "supportive", 8),
	rule("jupiter", "sun", "trine", "longTerm", "supportive", 9),
	rule("jupiter", "sun", "square", "longTerm", "challenging", 6),
	rule("jupiter", "moon", "conjunction", "longTerm", "supportive", 8),
	rule("jupiter", "moon", "trine", "longTerm", "supportive", 8),
	rule("jupiter", "moon", "square", "longTerm", "challenging", 6),

	// Saturn
	rule("saturn", "sun", "conjunction", "longTerm", "mixed", 9),
	rule("saturn", "sun", "trine", "longTerm", "supportive", 10),
	rule("saturn", "sun", "sextile", "longTerm", "supportive", 7),
	rule("saturn", "sun", "square", "longTerm", "challenging", 10),
	rule("saturn", "sun", "opposition", "longTerm", "challenging", 9),
	rule("saturn", "moon", "conjunction", "longTerm", "mixed", 9, "emotional"),
	rule("saturn", "moon", "trine", "longTerm", "supportive", 8, "emotional"),
	rule("saturn", "moon", "square", "longTerm", "challenging", 9, "emotional"),
	rule("saturn", "venus", "conjunction", "longTerm", "mixed", 8, "attraction"),
	rule("saturn", "venus", "trine", "longTerm", "supportive", 8),
	rule("saturn", "venus", "square", "longTerm", "challenging", 8, "attraction"),
	rule("saturn", "mars", "trine", "longTerm", "supportive", 7),
	rule("saturn", "mars", "square", "longTerm", "challenging", 8),

	// Sun–Sun
	rule("sun", "sun", "conjunction", "longTerm", "supportive", 8),
	rule("sun", "sun", "trine", "longTerm", "supportive", 8),
	rule("sun", "sun", "square", "longTerm", "challenging", 7),
	rule("sun", "sun", "opposition", "longTerm", "mixed", 7),

	// Ascendant contacts
	rule("sun", "ascendant", "conjunction", "attraction", "supportive", 9),
	rule("sun", "ascendant", "trine", "attraction", "supportive", 8),
	rule("sun", "ascendant", "square", "attraction", "challenging", 7),
	rule("moon", "ascendant", "conjunction", "emotional", "supportive", 9),
	rule("moon", "ascendant", "trine", "emotional", "supportive", 8),
	rule("moon", "ascendant", "square", "emotional", "challenging", 7),
	rule("venus", "ascendant", "conjunction", "attraction", "supportive", 10),
	rule("venus", "ascendant", "trine", "attraction", "supportive", 9),
	rule("venus", "ascendant", "square", "attraction", "challenging", 7),
	rule("mars", "ascendant", "conjunction", "attraction", "mixed", 9),
	rule("mars", "ascendant", "trine", "attraction", "supportive", 8),
	rule("mars", "ascendant", "square", "attraction", "challenging", 8),
];

export function findSynastryRules(
	bodyA: SynastryBodyKey,
	bodyB: SynastryBodyKey,
	aspectType: SynastryAspectType,
): SynastryRule[] {
	const [a, b] = normalizeSynastryBodyPair(bodyA, bodyB);
	return SYNASTRY_RULES.filter(
		(item) =>
			item.bodyA === a && item.bodyB === b && item.aspectType === aspectType,
	);
}

export function getMaximumSynastryOrb(
	bodyA: SynastryBodyKey,
	bodyB: SynastryBodyKey,
): number {
	const bodies = new Set([bodyA, bodyB]);
	if (bodies.has("ascendant")) {
		return 5;
	}
	if (bodies.has("sun") || bodies.has("moon")) {
		return 8;
	}
	if (
		bodies.has("mercury") ||
		bodies.has("venus") ||
		bodies.has("mars")
	) {
		return 6;
	}
	return 4;
}
