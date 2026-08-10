import type {
	AspectType,
	PlanetKey,
	ZodiacSign,
} from "@/features/astrology/types/astrology";

export const ZODIAC_SIGN_LABELS: Record<ZodiacSign, string> = {
	aries: "Koç",
	taurus: "Boğa",
	gemini: "İkizler",
	cancer: "Yengeç",
	leo: "Aslan",
	virgo: "Başak",
	libra: "Terazi",
	scorpio: "Akrep",
	sagittarius: "Yay",
	capricorn: "Oğlak",
	aquarius: "Kova",
	pisces: "Balık",
};

export const PLANET_LABELS: Record<PlanetKey, string> = {
	sun: "Güneş",
	moon: "Ay",
	mercury: "Merkür",
	venus: "Venüs",
	mars: "Mars",
	jupiter: "Jüpiter",
	saturn: "Satürn",
	uranus: "Uranüs",
	neptune: "Neptün",
	pluto: "Plüton",
};

export const ASPECT_LABELS: Record<AspectType, string> = {
	conjunction: "Kavuşum",
	sextile: "Sekstil",
	square: "Kare",
	trine: "Üçgen",
	opposition: "Karşıt",
};

export const ASPECT_SYMBOLS: Record<AspectType, string> = {
	conjunction: "☌",
	sextile: "⚹",
	square: "□",
	trine: "△",
	opposition: "☍",
};

export const PLANET_SYMBOLS: Record<PlanetKey, string> = {
	sun: "☉",
	moon: "☽",
	mercury: "☿",
	venus: "♀",
	mars: "♂",
	jupiter: "♃",
	saturn: "♄",
	uranus: "♅",
	neptune: "♆",
	pluto: "♇",
};
