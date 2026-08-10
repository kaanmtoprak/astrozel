export const SYNASTRY_SCORE_BASELINE = 50;

export const SYNASTRY_CATEGORY_WEIGHTS = {
	emotional: 0.3,
	communication: 0.25,
	attraction: 0.25,
	longTerm: 0.2,
} as const;

/** Cap absolute score delta from a single aspect contribution. */
export const SYNASTRY_MAX_ASPECT_DELTA = 12;

/** Soft element/modality contribution ceiling across all categories. */
export const SYNASTRY_ELEMENT_MAX_TOTAL_DELTA = 6;

export const SYNASTRY_MAX_STRENGTHS = 6;
export const SYNASTRY_MAX_CHALLENGES = 6;
export const SYNASTRY_MAX_HIGHLIGHTED_ASPECTS = 8;

export const SYNASTRY_CALCULATION_VERSION = 1;
