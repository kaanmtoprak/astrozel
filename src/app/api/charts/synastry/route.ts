import { NextResponse } from "next/server";
import { AstrologyCalculationError } from "@/features/astrology/providers/celestine-astrology-provider";
import {
	NATAL_NO_STORE_HEADERS,
	natalApiError,
} from "@/features/astrology/utils/api-response";
import { synastryRequestSchema } from "@/features/synastry/schemas/synastry-request-schema";
import { calculateSynastry } from "@/features/synastry/services/calculate-synastry";

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

	const parsed = synastryRequestSchema.safeParse(body);
	if (!parsed.success) {
		const message =
			parsed.error.issues[0]?.message ?? "Doğum bilgileri geçerli değil.";
		return natalApiError("INVALID_REQUEST", message, 400);
	}

	try {
		const result = await calculateSynastry(parsed.data, {
			labelA: parsed.data.presentation?.nameA,
			labelB: parsed.data.presentation?.nameB,
		});
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
				"Çift uyumu hesaplanamadı.",
				statusByCode[error.code],
			);
		}

		return natalApiError(
			"CALCULATION_FAILED",
			"Çift uyumu hesaplanamadı.",
			500,
		);
	}
}
