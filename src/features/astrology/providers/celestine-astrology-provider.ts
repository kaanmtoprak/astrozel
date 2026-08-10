import "server-only";

import {
	AspectType,
	calculateChart,
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
import {
	BirthTimeError,
	resolveBirthInstant,
} from "@/features/astrology/utils/birth-time";
import {
	normalizeCelestineChart,
	ProviderResponseError,
} from "@/features/astrology/utils/normalize-chart";

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
					aspectTypes: [
						AspectType.Conjunction,
						AspectType.Sextile,
						AspectType.Square,
						AspectType.Trine,
						AspectType.Opposition,
					],
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
}
