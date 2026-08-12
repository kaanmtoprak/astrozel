import "server-only";

import {
	AspectType,
	calculateAspects,
	calculateChart,
	calculatePlanets,
	houses as celestineHouses,
} from "celestine";
import {
	ASTROLOGY_CALCULATION_VERSION,
	ASTROLOGY_PROVIDER_ID,
	DEFAULT_HOUSE_SYSTEM,
	DEFAULT_ZODIAC_TYPE,
} from "@/features/astrology/constants/astrology-settings";
import type { AstrologyProvider } from "@/features/astrology/providers/astrology-provider";
import type {
	NatalChartCalculationInput,
	NatalChartResult,
} from "@/features/astrology/types/natal-chart";
import type {
	PlanetarySnapshotInput,
	PlanetarySnapshotResult,
} from "@/features/astrology/types/planetary-snapshot";
import {
	BirthTimeError,
	resolveBirthInstant,
} from "@/features/astrology/utils/birth-time";
import {
	normalizeCelestineChart,
	ProviderResponseError,
} from "@/features/astrology/utils/normalize-chart";
import { buildPlanetarySnapshotResult } from "@/features/astrology/utils/normalize-planetary-snapshot";
import { parseDateOnly } from "@/lib/date";

const MAJOR_ASPECT_TYPES_CELESTINE = [
	AspectType.Conjunction,
	AspectType.Sextile,
	AspectType.Square,
	AspectType.Trine,
	AspectType.Opposition,
] as const;

/** Technical geographic origin for planet-only ephemeris (Celestine API requires coords). */
const PLANETARY_SNAPSHOT_ORIGIN = {
	latitude: 0,
	longitude: 0,
} as const;

export class AstrologyCalculationError extends Error {
	readonly code:
		| "INVALID_TIMEZONE"
		| "AMBIGUOUS_OR_INVALID_LOCAL_TIME"
		| "HOUSE_SYSTEM_UNAVAILABLE"
		| "CALCULATION_FAILED"
		| "INVALID_PROVIDER_RESPONSE";

	constructor(
		code:
			| "INVALID_TIMEZONE"
			| "AMBIGUOUS_OR_INVALID_LOCAL_TIME"
			| "HOUSE_SYSTEM_UNAVAILABLE"
			| "CALCULATION_FAILED"
			| "INVALID_PROVIDER_RESPONSE",
		message: string,
	) {
		super(message);
		this.name = "AstrologyCalculationError";
		this.code = code;
	}
}

export class CelestineAstrologyProvider implements AstrologyProvider {
	async calculateNatalChart(
		input: NatalChartCalculationInput,
	): Promise<NatalChartResult> {
		const { location } = input;

		if (
			!celestineHouses.isHouseSystemAvailable(
				DEFAULT_HOUSE_SYSTEM,
				location.latitude,
			)
		) {
			throw new AstrologyCalculationError(
				"HOUSE_SYSTEM_UNAVAILABLE",
				"Bu doğum konumunda Placidus ev sistemi hesaplanamadı.",
			);
		}

		let resolved;
		try {
			resolved = resolveBirthInstant(
				input.birthDate,
				input.birthTime,
				location.timezone,
			);
		} catch (error) {
			if (error instanceof BirthTimeError) {
				throw new AstrologyCalculationError(error.code, error.message);
			}
			throw new AstrologyCalculationError(
				"CALCULATION_FAILED",
				"Doğum haritası hesaplanamadı.",
			);
		}

		let rawChart: unknown;
		try {
			rawChart = calculateChart(
				{
					year: resolved.year,
					month: resolved.month,
					day: resolved.day,
					hour: resolved.hour,
					minute: resolved.minute,
					second: resolved.second,
					timezone: resolved.utcOffsetHours,
					latitude: location.latitude,
					longitude: location.longitude,
				},
				{
					houseSystem: DEFAULT_HOUSE_SYSTEM,
					aspectTypes: [...MAJOR_ASPECT_TYPES_CELESTINE],
					includeAsteroids: false,
					includeChiron: false,
					includeLilith: false,
					includeNodes: false,
					includeLots: false,
					includePatterns: false,
				},
			);
		} catch (error) {
			const message =
				error instanceof Error ? error.message.toLowerCase() : "";
			if (message.includes("placidus") || message.includes("house")) {
				throw new AstrologyCalculationError(
					"HOUSE_SYSTEM_UNAVAILABLE",
					"Bu doğum konumunda Placidus ev sistemi hesaplanamadı.",
				);
			}
			throw new AstrologyCalculationError(
				"CALCULATION_FAILED",
				"Doğum haritası hesaplanamadı.",
			);
		}

		try {
			return normalizeCelestineChart(rawChart, {
				provider: ASTROLOGY_PROVIDER_ID,
				calculationVersion: ASTROLOGY_CALCULATION_VERSION,
				zodiacType: DEFAULT_ZODIAC_TYPE,
				houseSystem: DEFAULT_HOUSE_SYSTEM,
				localDateTime: resolved.localDateTime,
				timezone: resolved.timezone,
				utcInstant: resolved.utcInstant,
				utcOffsetMinutes: resolved.utcOffsetMinutes,
				latitude: location.latitude,
				longitude: location.longitude,
				locationDisplayName: location.displayName,
			});
		} catch (error) {
			if (error instanceof ProviderResponseError) {
				throw new AstrologyCalculationError(
					"INVALID_PROVIDER_RESPONSE",
					"Hesaplama sonucu doğrulanamadı.",
				);
			}
			throw new AstrologyCalculationError(
				"CALCULATION_FAILED",
				"Doğum haritası hesaplanamadı.",
			);
		}
	}

	async calculatePlanetarySnapshot(
		input: PlanetarySnapshotInput,
	): Promise<PlanetarySnapshotResult> {
		const parsed = parseDateOnly(input.utcDate);
		if (!parsed) {
			throw new AstrologyCalculationError(
				"CALCULATION_FAILED",
				"Gökyüzü bilgileri şu anda hesaplanamadı.",
			);
		}

		const year = parsed.getFullYear();
		const month = parsed.getMonth() + 1;
		const day = parsed.getDate();
		const utcInstant = `${input.utcDate}T12:00:00.000Z`;

		let rawPlanets: unknown;
		try {
			rawPlanets = calculatePlanets(
				{
					year,
					month,
					day,
					hour: 12,
					minute: 0,
					second: 0,
					timezone: 0,
					latitude: PLANETARY_SNAPSHOT_ORIGIN.latitude,
					longitude: PLANETARY_SNAPSHOT_ORIGIN.longitude,
				},
				{
					includeAsteroids: false,
					includeChiron: false,
					includeLilith: false,
					includeNodes: false,
					includeLots: false,
					includePatterns: false,
				},
			);
		} catch {
			throw new AstrologyCalculationError(
				"CALCULATION_FAILED",
				"Gökyüzü bilgileri şu anda hesaplanamadı.",
			);
		}

		if (!Array.isArray(rawPlanets)) {
			throw new AstrologyCalculationError(
				"INVALID_PROVIDER_RESPONSE",
				"Gökyüzü bilgileri şu anda hesaplanamadı.",
			);
		}

		const aspectBodies = rawPlanets
			.filter(
				(item): item is Record<string, unknown> =>
					typeof item === "object" && item !== null && !Array.isArray(item),
			)
			.map((planet) => ({
				name: String(planet.name ?? ""),
				longitude: Number(planet.longitude),
				longitudeSpeed:
					typeof planet.longitudeSpeed === "number"
						? planet.longitudeSpeed
						: undefined,
			}))
			.filter(
				(body) =>
					body.name.length > 0 && Number.isFinite(body.longitude),
			);

		let rawAspects: unknown;
		try {
			const aspectResult = calculateAspects(aspectBodies, {
				aspectTypes: [...MAJOR_ASPECT_TYPES_CELESTINE],
			});
			rawAspects = aspectResult.aspects;
		} catch {
			throw new AstrologyCalculationError(
				"CALCULATION_FAILED",
				"Gökyüzü bilgileri şu anda hesaplanamadı.",
			);
		}

		try {
			return buildPlanetarySnapshotResult({
				utcDate: input.utcDate,
				utcInstant,
				rawPlanets,
				rawAspects,
			});
		} catch (error) {
			if (error instanceof ProviderResponseError) {
				throw new AstrologyCalculationError(
					"INVALID_PROVIDER_RESPONSE",
					"Gökyüzü bilgileri şu anda hesaplanamadı.",
				);
			}
			throw new AstrologyCalculationError(
				"CALCULATION_FAILED",
				"Gökyüzü bilgileri şu anda hesaplanamadı.",
			);
		}
	}
}
