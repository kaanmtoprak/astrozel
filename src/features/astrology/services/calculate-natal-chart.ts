import "server-only";

import { CelestineAstrologyProvider } from "@/features/astrology/providers/celestine-astrology-provider";
import type {
	NatalChartCalculationInput,
	NatalChartResult,
} from "@/features/astrology/types/natal-chart";

const provider = new CelestineAstrologyProvider();

export async function calculateNatalChart(
	input: NatalChartCalculationInput,
): Promise<NatalChartResult> {
	return provider.calculateNatalChart(input);
}
