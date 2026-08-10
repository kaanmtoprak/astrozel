import { ZODIAC_SIGN_CONTENT } from "@/features/astrology/interpretations/content/zodiac-signs";
import type { ZodiacSign } from "@/features/astrology/types/astrology";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import type { SynastryPlacementSummary } from "@/features/synastry/types/synastry";

const FORBIDDEN = ["kadın", "erkek", "kader", "ruh eşi"] as const;

function assertSafe(text: string, fallback: string): string {
	const trimmed = text.trim();
	if (!trimmed) {
		return fallback;
	}
	const lower = trimmed.toLowerCase();
	for (const phrase of FORBIDDEN) {
		if (lower.includes(phrase)) {
			return fallback;
		}
	}
	return trimmed;
}

/**
 * Short third-person placement blurbs derived from shared zodiac content
 * (not a copy of full natal big-three essays).
 */
export function buildPlacementShortDescription(
	body: "sun" | "moon" | "ascendant",
	sign: ZodiacSign,
): string {
	const content = ZODIAC_SIGN_CONTENT[sign];
	const fallback =
		"Bu yerleşim, kişisel ritmi ve ifade biçimini şekillendirebilir.";

	if (body === "sun") {
		return assertSafe(
			`Hayata ${content.approach} yaklaşabilir; ${content.strength} öne çıkabilir.`,
			fallback,
		);
	}
	if (body === "moon") {
		return assertSafe(
			`Duygularını ve yakınlık ihtiyacını ${content.approach} yaşama eğilimindedir.`,
			fallback,
		);
	}
	return assertSafe(
		`İlk izlenimde ${content.approach} görünebilir.`,
		fallback,
	);
}

export function requirePlanetSign(
	chart: NatalChartResult,
	key: "sun" | "moon" | "mercury" | "venus" | "mars",
): ZodiacSign {
	const planet = chart.planets.find((item) => item.key === key);
	if (!planet) {
		throw new Error("Gezegen bilgisi eksik.");
	}
	return planet.position.sign;
}

export function buildPlacementSummary(
	chart: NatalChartResult,
	body: "sun" | "moon" | "ascendant",
): SynastryPlacementSummary {
	if (body === "ascendant") {
		const asc = chart.angles.find((angle) => angle.key === "ascendant");
		if (!asc) {
			throw new Error("Yükselen bilgisi eksik.");
		}
		return {
			body,
			sign: asc.position.sign,
			longitude: asc.position.longitude,
			degreeInSign: Math.floor(asc.position.signDegree),
			shortDescription: buildPlacementShortDescription(body, asc.position.sign),
		};
	}

	const planet = chart.planets.find((item) => item.key === body);
	if (!planet) {
		throw new Error("Gezegen bilgisi eksik.");
	}
	return {
		body,
		sign: planet.position.sign,
		longitude: planet.position.longitude,
		degreeInSign: Math.floor(planet.position.signDegree),
		shortDescription: buildPlacementShortDescription(body, planet.position.sign),
	};
}
