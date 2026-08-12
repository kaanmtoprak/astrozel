import type { PlanetKey } from "@/features/astrology/types/astrology";
import type {
	NatalAspect,
	ZodiacPosition,
} from "@/features/astrology/types/natal-chart";

export interface PlanetarySnapshotPlanet {
	key: PlanetKey;
	position: ZodiacPosition;
	isRetrograde: boolean;
}

export interface PlanetarySnapshotResult {
	/** ISO-8601 UTC instant used for the snapshot (…T12:00:00.000Z). */
	utcInstant: string;
	/** Calendar date in UTC (YYYY-MM-DD). */
	utcDate: string;
	planets: PlanetarySnapshotPlanet[];
	aspects: NatalAspect[];
}

export interface PlanetarySnapshotInput {
	/** UTC calendar date YYYY-MM-DD. Snapshot is always 12:00 UTC that day. */
	utcDate: string;
}
