import type { AspectType } from "@/features/astrology/types/astrology";
import type { AspectLineStyle } from "@/features/astrology/chart/types/chart-geometry";
import { assertFiniteNumber } from "@/features/astrology/utils/degrees";

const BASE_STYLES: Record<
	AspectType,
	Omit<AspectLineStyle, "opacity" | "strokeWidth"> & {
		baseOpacity: number;
		baseWidth: number;
	}
> = {
	trine: {
		stroke: "color-mix(in srgb, var(--primary) 70%, #7aa7d9)",
		baseOpacity: 0.72,
		baseWidth: 1.35,
	},
	sextile: {
		stroke: "color-mix(in srgb, #5f9ea8 65%, white)",
		baseOpacity: 0.68,
		baseWidth: 1.2,
	},
	square: {
		stroke: "color-mix(in srgb, #c46b6b 75%, white)",
		baseOpacity: 0.7,
		baseWidth: 1.3,
	},
	opposition: {
		stroke: "color-mix(in srgb, #b25555 80%, white)",
		baseOpacity: 0.74,
		baseWidth: 1.4,
	},
	conjunction: {
		stroke: "color-mix(in srgb, var(--accent-gold) 80%, #8a6a2f)",
		baseOpacity: 0.78,
		baseWidth: 1.5,
		dashArray: "2 3",
	},
};

/**
 * Smaller orb → slightly stronger stroke; larger orb → softer.
 * Never fully invisible.
 */
export function getAspectLineStyle(
	type: AspectType,
	orb: number,
): AspectLineStyle {
	assertFiniteNumber(orb, "orb");
	if (orb < 0) {
		throw new Error("orb negatif olamaz.");
	}

	const base = BASE_STYLES[type];
	const tightness = Math.max(0, Math.min(1, 1 - orb / 10));
	const opacity = Math.min(0.92, Math.max(0.42, base.baseOpacity - 0.18 + tightness * 0.28));
	const strokeWidth = base.baseWidth + tightness * 0.35;

	return {
		stroke: base.stroke,
		opacity,
		strokeWidth,
		dashArray: base.dashArray,
	};
}
