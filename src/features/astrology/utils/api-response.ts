import { NextResponse } from "next/server";
import type { AstrologyErrorCode } from "@/features/astrology/types/astrology";

export function natalApiError(
	code: AstrologyErrorCode,
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

export const NATAL_NO_STORE_HEADERS = {
	"Cache-Control": "no-store",
} as const;
