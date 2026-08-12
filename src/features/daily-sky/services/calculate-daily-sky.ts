import { CelestineAstrologyProvider } from "@/features/astrology/providers/celestine-astrology-provider";
import type { DailySkyResult } from "@/features/daily-sky/types/daily-sky";
import { buildDailySkyInterpretation } from "@/features/daily-sky/utils/build-daily-sky-interpretation";
import {
	logDailySkyCacheMiss,
	readDailySkyCache,
	writeDailySkyCache,
} from "@/features/daily-sky/utils/daily-sky-cache";
import {
	buildDailySkySummary,
	buildMoonPhaseFromSnapshot,
	formatDailySkyDisplayDate,
	selectDailySkyAspects,
	toDailySkyPlanet,
} from "@/features/daily-sky/utils/daily-sky-format";

const provider = new CelestineAstrologyProvider();

export async function calculateDailySky(
	utcDate: string,
): Promise<DailySkyResult> {
	const cached = await readDailySkyCache(utcDate);
	if (cached) {
		return cached;
	}

	logDailySkyCacheMiss(utcDate);
	const snapshot = await provider.calculatePlanetarySnapshot({ utcDate });
	const planets = snapshot.planets.map(toDailySkyPlanet);
	const sun = planets.find((planet) => planet.key === "sun");
	const moon = planets.find((planet) => planet.key === "moon");

	if (!sun || !moon) {
		throw new Error("Güneş veya Ay konumu eksik.");
	}

	const moonPhase = buildMoonPhaseFromSnapshot(snapshot);
	const aspects = selectDailySkyAspects(snapshot);
	const retrogradePlanets = planets.filter((planet) => planet.isRetrograde);
	const summary = buildDailySkySummary({
		sun,
		moon,
		moonPhaseName: moonPhase.name,
		retrogradeCount: retrogradePlanets.length,
		topAspect: aspects[0] ?? null,
	});
	const interpretation = buildDailySkyInterpretation({
		sun,
		moon,
		moonPhase,
		aspects,
		retrogradeCount: retrogradePlanets.length,
	});

	const result: DailySkyResult = {
		date: snapshot.utcDate,
		referenceTime: snapshot.utcInstant,
		displayDate: formatDailySkyDisplayDate(snapshot.utcDate),
		planets,
		sun,
		moon,
		moonPhase,
		retrogradePlanets,
		aspects,
		summary,
		interpretation,
	};

	await writeDailySkyCache(utcDate, result);
	return result;
}
