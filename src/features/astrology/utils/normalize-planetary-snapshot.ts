import { ASPECT_SYMBOLS } from "@/features/astrology/constants/astrology-labels";
import {
	CORE_PLANET_KEYS,
	MAJOR_ASPECT_TYPES,
} from "@/features/astrology/constants/astrology-settings";
import type {
	AspectType,
	PlanetKey,
} from "@/features/astrology/types/astrology";
import type { NatalAspect } from "@/features/astrology/types/natal-chart";
import type {
	PlanetarySnapshotPlanet,
	PlanetarySnapshotResult,
} from "@/features/astrology/types/planetary-snapshot";
import { ProviderResponseError } from "@/features/astrology/utils/normalize-chart";
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

const MAJOR_ASPECT_SET = new Set<string>(MAJOR_ASPECT_TYPES);

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

export function normalizeCelestinePlanets(
	rawPlanets: unknown,
): PlanetarySnapshotPlanet[] {
	if (!Array.isArray(rawPlanets)) {
		throw new ProviderResponseError("Gezegen listesi eksik.");
	}

	const planetMap = new Map<PlanetKey, PlanetarySnapshotPlanet>();

	for (const item of rawPlanets) {
		const planet = asRecord(item, "Planet");
		const key = mapPlanetKey(asString(planet.name, "Planet name"));
		if (!key) {
			continue;
		}

		const longitude = asFiniteNumber(planet.longitude, `${key} longitude`);
		planetMap.set(key, {
			key,
			position: longitudeToZodiacPosition(longitude),
			isRetrograde: Boolean(planet.isRetrograde),
		});
	}

	for (const key of CORE_PLANET_KEYS) {
		if (!planetMap.has(key)) {
			throw new ProviderResponseError(`Eksik gezegen: ${key}`);
		}
	}

	return CORE_PLANET_KEYS.map((key) => planetMap.get(key)!);
}

export function normalizeCelestineAspectList(rawAspects: unknown): NatalAspect[] {
	if (!Array.isArray(rawAspects)) {
		throw new ProviderResponseError("Açı listesi eksik.");
	}

	const aspects: NatalAspect[] = [];

	for (const item of rawAspects) {
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
		const orb = asFiniteNumber(
			aspect.deviation !== undefined ? aspect.deviation : aspect.orb,
			"Aspect orb",
		);
		if (orb < 0) {
			throw new ProviderResponseError("Aspect orb negatif olamaz.");
		}

		aspects.push({
			body1,
			body2,
			type,
			symbol:
				typeof aspect.symbol === "string" && aspect.symbol
					? aspect.symbol
					: ASPECT_SYMBOLS[type],
			exactAngle,
			orb,
		});
	}

	return aspects;
}

export function buildPlanetarySnapshotResult(input: {
	utcDate: string;
	utcInstant: string;
	rawPlanets: unknown;
	rawAspects: unknown;
}): PlanetarySnapshotResult {
	return {
		utcDate: input.utcDate,
		utcInstant: input.utcInstant,
		planets: normalizeCelestinePlanets(input.rawPlanets),
		aspects: normalizeCelestineAspectList(input.rawAspects),
	};
}
