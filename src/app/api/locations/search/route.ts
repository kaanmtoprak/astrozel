import { NextResponse } from "next/server";
import { ServerEnvError } from "@/lib/server-env";
import { locationSearchQuerySchema } from "@/features/location/schemas/location-search-schema";
import {
	GeoNamesUpstreamError,
	searchLocations,
} from "@/features/location/services/geonames";
import {
	apiErrorResponse,
	SUCCESS_CACHE_HEADERS,
} from "@/features/location/utils/api-response";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const parsed = locationSearchQuerySchema.safeParse({
			q: searchParams.get("q") ?? "",
		});

		if (!parsed.success) {
			const message =
				parsed.error.issues[0]?.message ?? "Geçersiz arama sorgusu.";
			return apiErrorResponse("INVALID_QUERY", message, 400);
		}

		const results = await searchLocations(parsed.data.q);

		return NextResponse.json(
			{ results },
			{
				status: 200,
				headers: SUCCESS_CACHE_HEADERS,
			},
		);
	} catch (error) {
		if (error instanceof ServerEnvError) {
			return apiErrorResponse(
				"SERVICE_NOT_CONFIGURED",
				"Konum arama servisi henüz yapılandırılmamış.",
				503,
			);
		}

		if (error instanceof GeoNamesUpstreamError) {
			return apiErrorResponse(error.code, error.message, error.status);
		}

		return apiErrorResponse(
			"UPSTREAM_ERROR",
			"Konum servisine ulaşılamadı. Tekrar deneyebilirsin.",
			500,
		);
	}
}
