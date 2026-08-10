import type {
	SynastryAspectType,
	SynastryBodyKey,
	SynastryCategory,
} from "@/features/synastry/types/synastry";

export const SYNASTRY_BODY_LABELS: Record<SynastryBodyKey, string> = {
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
	ascendant: "Yükselen",
};

export const SYNASTRY_ASPECT_LABELS: Record<SynastryAspectType, string> = {
	conjunction: "Kavuşum",
	sextile: "Sekstil",
	square: "Kare",
	trine: "Üçgen",
	opposition: "Karşıt",
};

export const SYNASTRY_CATEGORY_LABELS: Record<SynastryCategory, string> = {
	emotional: "Duygusal uyum",
	communication: "İletişim",
	attraction: "Çekim",
	longTerm: "Uzun vadeli denge",
};

export const SYNASTRY_BODY_ORDER: readonly SynastryBodyKey[] = [
	"sun",
	"moon",
	"mercury",
	"venus",
	"mars",
	"jupiter",
	"saturn",
	"uranus",
	"neptune",
	"pluto",
	"ascendant",
] as const;

export const PERSONAL_SYNASTRY_BODIES = new Set<SynastryBodyKey>([
	"sun",
	"moon",
	"mercury",
	"venus",
	"mars",
	"ascendant",
]);
