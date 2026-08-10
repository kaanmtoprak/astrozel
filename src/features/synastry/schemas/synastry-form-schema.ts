import { birthChartFormSchema } from "@/features/birth-chart/schemas/birth-chart-form-schema";
import { z } from "zod";

export const synastryPersonFormSchema = birthChartFormSchema;

export const synastryFormSchema = z.object({
	personA: synastryPersonFormSchema,
	personB: synastryPersonFormSchema,
});

export type SynastryFormSchemaInput = z.input<typeof synastryFormSchema>;
export type SynastryFormSchemaOutput = z.output<typeof synastryFormSchema>;
