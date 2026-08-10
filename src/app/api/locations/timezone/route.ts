import { NextResponse } from "next/server";
import { ServerEnvError } from "@/lib/server-env";
import { locationTimezoneQuerySchema } from "@/features/location/schemas/location-search-schema";
import {
	fetchTimezone,
	GeoNamesUpstreamError,
} from "@/features/location/services/geonames";
import {
	apiErrorResponse,
	SUCCESS_CACHE_HEADERS,
} from "@/features/location/utils/api-response";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const parsed = locationTimezoneQuerySchema.safeParse({
			latitude: searchParams.get("latitude"),
			longitude: searchParams.get("longitude"),
		});

		if (!parsed.success) {
			const message =
				parsed.error.issues[0]?.message ?? "Geçersiz koordinatlar.";
			return apiErrorResponse("INVALID_COORDINATES", message, 400);
		}

		const timezone = await fetchTimezone(
			parsed.data.latitude,
			parsed.data.longitude,
		);

		return NextResponse.json(
			{ timezone },
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
