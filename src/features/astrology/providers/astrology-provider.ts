import type {
	NatalChartCalculationInput,
	NatalChartResult,
} from "@/features/astrology/types/natal-chart";
import type {
	PlanetarySnapshotInput,
	PlanetarySnapshotResult,
} from "@/features/astrology/types/planetary-snapshot";

export interface AstrologyProvider {
	calculateNatalChart(
		input: NatalChartCalculationInput,
	): Promise<NatalChartResult>;
	/** Location-independent planetary positions + major aspects at a UTC instant. */
	calculatePlanetarySnapshot(
		input: PlanetarySnapshotInput,
	): Promise<PlanetarySnapshotResult>;
}
