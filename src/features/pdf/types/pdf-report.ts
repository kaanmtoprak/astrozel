import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import type { NatalInterpretationResult } from "@/features/astrology/interpretations/types/interpretation";
import type { SynastryResult } from "@/features/synastry/types/synastry";

export type NatalPdfInput = {
	kind: "natal";
	result: NatalChartResult;
	interpretations: NatalInterpretationResult;
	name?: string;
	birthDate: string;
	birthTime: string;
	chartSvg?: string | null;
};

export type SynastryPdfInput = {
	kind: "synastry";
	result: SynastryResult;
};

export type PdfReportInput = NatalPdfInput | SynastryPdfInput;
