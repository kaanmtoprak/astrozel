import {
	ASPECT_SYMBOLS,
} from "@/features/astrology/constants/astrology-labels";
import {
	CORE_PLANET_KEYS,
	MAJOR_ASPECT_TYPES,
} from "@/features/astrology/constants/astrology-settings";
import type {
	AspectType,
	PlanetKey,
	ZodiacSign,
} from "@/features/astrology/types/astrology";
import type {
	NatalAngle,
	NatalAspect,
	NatalChartResult,
	NatalHouseCusp,
	NatalPlanetPosition,
} from "@/features/astrology/types/natal-chart";
import { longitudeToZodiacPosition } from "@/features/astrology/utils/degrees";

const PLANET_NAME_MAP: Record<string, PlanetKey> = {
	sun: "sun",
	moon: "moon",
	mercury: "mercury",
	venus: "venus",
	mars: "mars",
	jupiter: "jupiter",
	saturn: "saturn",
	uranus: "uranus",
	neptune: "neptune",
	pluto: "pluto",
};

const SIGN_NAME_MAP: Record<string, ZodiacSign> = {
	aries: "aries",
	taurus: "taurus",
	gemini: "gemini",
	cancer: "cancer",
	leo: "leo",
	virgo: "virgo",
	libra: "libra",
	scorpio: "scorpio",
	sagittarius: "sagittarius",
	capricorn: "capricorn",
	aquarius: "aquarius",
	pisces: "pisces",
};

const MAJOR_ASPECT_SET = new Set<string>(MAJOR_ASPECT_TYPES);

export class ProviderResponseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ProviderResponseError";
	}
}

function asRecord(value: unknown, label: string): Record<string, unknown> {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		throw new ProviderResponseError(`${label} beklenen nesne değil.`);
	}
	return value as Record<string, unknown>;
}

function asFiniteNumber(value: unknown, label: string): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new ProviderResponseError(`${label} geçerli değil.`);
	}
	return value;
}

function asString(value: unknown, label: string): string {
	if (typeof value !== "string" || value.trim() === "") {
		throw new ProviderResponseError(`${label} geçerli değil.`);
	}
	return value;
}

function mapPlanetKey(name: string): PlanetKey | null {
	return PLANET_NAME_MAP[name.trim().toLowerCase()] ?? null;
}

function mapAspectType(value: string): AspectType | null {
	const normalized = value.trim().toLowerCase();
	if (!MAJOR_ASPECT_SET.has(normalized)) {
		return null;
	}
	return normalized as AspectType;
}

function mapSignName(value: string): ZodiacSign | null {
	return SIGN_NAME_MAP[value.trim().toLowerCase()] ?? null;
}

function positionFromLongitude(longitude: number) {
	return longitudeToZodiacPosition(longitude);
}

export function normalizeCelestineChart(
	raw: unknown,
	metadata: NatalChartResult["metadata"],
): NatalChartResult {
	const chart = asRecord(raw, "Chart");
	const anglesRaw = asRecord(chart.angles, "Angles");
	const housesRaw = asRecord(chart.houses, "Houses");
	const aspectsRaw = asRecord(chart.aspects, "Aspects");

	if (!Array.isArray(chart.planets)) {
		throw new ProviderResponseError("Gezegen listesi eksik.");
	}
	if (!Array.isArray(housesRaw.cusps)) {
		throw new ProviderResponseError("Ev cusp listesi eksik.");
	}
	if (!Array.isArray(aspectsRaw.all)) {
		throw new ProviderResponseError("Açı listesi eksik.");
	}

	const houseSystem = asString(housesRaw.system, "House system");
	if (houseSystem !== "placidus") {
		throw new ProviderResponseError("Beklenen Placidus ev sistemi gelmedi.");
	}

	const angleDefs = [
		{ key: "ascendant", abbrev: "ASC" },
		{ key: "midheaven", abbrev: "MC" },
		{ key: "descendant", abbrev: "DSC" },
		{ key: "imumCoeli", abbrev: "IC" },
	] as const;

	const angles: NatalAngle[] = angleDefs.map((def) => {
		const angle = asRecord(anglesRaw[def.key], def.key);
		const longitude = asFiniteNumber(angle.longitude, `${def.key} longitude`);
		return {
			key: def.key,
			abbrev: def.abbrev,
			position: positionFromLongitude(longitude),
		};
	});

	const planetMap = new Map<PlanetKey, NatalPlanetPosition>();
	for (const item of chart.planets) {
		const planet = asRecord(item, "Planet");
		const key = mapPlanetKey(asString(planet.name, "Planet name"));
		if (!key) {
			continue;
		}

		const longitude = asFiniteNumber(planet.longitude, `${key} longitude`);
		const house = asFiniteNumber(planet.house, `${key} house`);
		if (!Number.isInteger(house) || house < 1 || house > 12) {
			throw new ProviderResponseError(`${key} ev numarası geçersiz.`);
		}

		const signName = mapSignName(asString(planet.signName, `${key} sign`));
		const position = positionFromLongitude(longitude);
		if (signName && signName !== position.sign) {
			// Prefer longitude-derived sign for consistency.
		}

		planetMap.set(key, {
			key,
			position,
			house,
			isRetrograde: Boolean(planet.isRetrograde),
		});
	}

	for (const key of CORE_PLANET_KEYS) {
		if (!planetMap.has(key)) {
			throw new ProviderResponseError(`Eksik gezegen: ${key}`);
		}
	}

	const planets = CORE_PLANET_KEYS.map((key) => planetMap.get(key)!);

	const cusps = housesRaw.cusps;
	if (cusps.length !== 12) {
		throw new ProviderResponseError("12 ev cusp bekleniyor.");
	}

	const houses: NatalHouseCusp[] = cusps.map((item, index) => {
		const cusp = asRecord(item, `House ${index + 1}`);
		const house = asFiniteNumber(cusp.house, "House number");
		if (!Number.isInteger(house) || house < 1 || house > 12) {
			throw new ProviderResponseError("Ev numarası geçersiz.");
		}
		const longitude = asFiniteNumber(cusp.longitude, `House ${house} longitude`);
		return {
			house,
			position: positionFromLongitude(longitude),
		};
	});

	houses.sort((a, b) => a.house - b.house);
	for (let i = 0; i < 12; i += 1) {
		if (houses[i]?.house !== i + 1) {
			throw new ProviderResponseError("Ev cusp numaraları eksik veya hatalı.");
		}
	}

	const aspects: NatalAspect[] = [];
	for (const item of aspectsRaw.all) {
		const aspect = asRecord(item, "Aspect");
		const type = mapAspectType(asString(aspect.type, "Aspect type"));
		if (!type) {
			continue;
		}

		const body1 = mapPlanetKey(asString(aspect.body1, "Aspect body1"));
		const body2 = mapPlanetKey(asString(aspect.body2, "Aspect body2"));
		if (!body1 || !body2) {
			continue;
		}

		const exactAngle = asFiniteNumber(aspect.angle, "Aspect angle");
		const orb = asFiniteNumber(aspect.deviation, "Aspect orb");
		if (orb < 0) {
			throw new ProviderResponseError("Aspect orb negatif olamaz.");
		}

		aspects.push({
			body1,
			body2,
			type,
			symbol: typeof aspect.symbol === "string" && aspect.symbol
				? aspect.symbol
				: ASPECT_SYMBOLS[type],
			exactAngle,
			orb,
		});
	}

	return {
		metadata,
		angles,
		planets,
		houses,
		aspects,
		warnings: [],
	};
}
