import type {
	NatalChartCalculationInput,
	NatalChartResult,
} from "@/features/astrology/types/natal-chart";

export interface AstrologyProvider {
	calculateNatalChart(
		input: NatalChartCalculationInput,
	): Promise<NatalChartResult>;
}
