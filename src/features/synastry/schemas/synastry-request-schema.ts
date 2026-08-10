import { natalChartRequestSchema } from "@/features/astrology/schemas/natal-chart-request-schema";
import { z } from "zod";

export const synastryRequestSchema = z.object({
	personA: natalChartRequestSchema,
	personB: natalChartRequestSchema,
	presentation: z
		.object({
			nameA: z.string().trim().max(80).optional(),
			nameB: z.string().trim().max(80).optional(),
		})
		.optional(),
});

export type SynastryRequest = z.infer<typeof synastryRequestSchema>;
