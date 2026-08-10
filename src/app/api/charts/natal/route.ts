import { NextResponse } from "next/server";
import { AstrologyCalculationError } from "@/features/astrology/providers/celestine-astrology-provider";
import { natalChartRequestSchema } from "@/features/astrology/schemas/natal-chart-request-schema";
import { calculateNatalChart } from "@/features/astrology/services/calculate-natal-chart";
import {
	NATAL_NO_STORE_HEADERS,
	natalApiError,
} from "@/features/astrology/utils/api-response";

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return natalApiError(
			"INVALID_REQUEST",
			"Doğum bilgileri geçerli değil.",
			400,
		);
	}

	const parsed = natalChartRequestSchema.safeParse(body);
	if (!parsed.success) {
		const message =
			parsed.error.issues[0]?.message ?? "Doğum bilgileri geçerli değil.";
		return natalApiError("INVALID_REQUEST", message, 400);
	}

	try {
		const result = await calculateNatalChart(parsed.data);
		return NextResponse.json(
			{ result },
			{
				status: 200,
				headers: NATAL_NO_STORE_HEADERS,
			},
		);
	} catch (error) {
		if (error instanceof AstrologyCalculationError) {
			const statusByCode = {
				INVALID_TIMEZONE: 422,
				AMBIGUOUS_OR_INVALID_LOCAL_TIME: 422,
				HOUSE_SYSTEM_UNAVAILABLE: 422,
				INVALID_PROVIDER_RESPONSE: 502,
				CALCULATION_FAILED: 500,
			} as const;

			return natalApiError(
				error.code,
				error.message,
				statusByCode[error.code],
			);
		}

		return natalApiError(
			"CALCULATION_FAILED",
			"Doğum haritası hesaplanamadı.",
			500,
		);
	}
}
