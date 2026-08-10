export type ZodiacSign =
	| "aries"
	| "taurus"
	| "gemini"
	| "cancer"
	| "leo"
	| "virgo"
	| "libra"
	| "scorpio"
	| "sagittarius"
	| "capricorn"
	| "aquarius"
	| "pisces";

export type PlanetKey =
	| "sun"
	| "moon"
	| "mercury"
	| "venus"
	| "mars"
	| "jupiter"
	| "saturn"
	| "uranus"
	| "neptune"
	| "pluto";

export type AspectType =
	| "conjunction"
	| "sextile"
	| "square"
	| "trine"
	| "opposition";

export type HouseSystem = "placidus";
export type ZodiacType = "tropical";

export type AstrologyErrorCode =
	| "INVALID_REQUEST"
	| "INVALID_TIMEZONE"
	| "AMBIGUOUS_OR_INVALID_LOCAL_TIME"
	| "HOUSE_SYSTEM_UNAVAILABLE"
	| "CALCULATION_FAILED"
	| "INVALID_PROVIDER_RESPONSE";
