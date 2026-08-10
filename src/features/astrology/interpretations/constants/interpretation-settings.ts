import type { PlanetKey } from "@/features/astrology/types/astrology";
import { CORE_PLANET_KEYS } from "@/features/astrology/constants/astrology-settings";

/** Yorum bölümünde gösterilecek en fazla major açı sayısı. */
export const MAX_ASPECT_INTERPRETATIONS = 6;

/** Orb etiket eşikleri (derece). */
export const ORB_VERY_CLOSE_MAX = 1;
export const ORB_CLOSE_MAX = 3;

export const PLANET_INTERPRETATION_ORDER: readonly PlanetKey[] =
	CORE_PLANET_KEYS;

export const BIG_THREE_ROLE_LABELS = {
	sun: "Temel kimlik",
	moon: "Duygusal dünya",
	ascendant: "Dışarıdan yaklaşım",
} as const;

/** Güneş ve Ay için provider yanlışlıkla retro dönse bile yok sayılır. */
export const PLANETS_WITHOUT_RETROGRADE = new Set<PlanetKey>(["sun", "moon"]);
