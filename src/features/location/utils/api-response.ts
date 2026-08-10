import { NextResponse } from "next/server";
import type { ApiErrorCode } from "@/features/location/types/location";

export function apiErrorResponse(
	code: ApiErrorCode,
	message: string,
	status: number,
) {
	return NextResponse.json(
		{
			error: {
				code,
				message,
			},
		},
		{
			status,
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
}

export const SUCCESS_CACHE_HEADERS = {
	"Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
} as const;
