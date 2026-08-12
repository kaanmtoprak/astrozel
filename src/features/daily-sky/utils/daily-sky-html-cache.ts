import {
	getUtcTodayDateOnly,
	resolveDailySkyDate,
} from "@/features/daily-sky/utils/daily-sky-date";

export const DAILY_SKY_PATH = "/bugunun-gokyuzu";

/** Past dates: snapshot is immutable for a given UTC day. */
export const DAILY_SKY_HTML_PAST_TTL_SECONDS = 7 * 24 * 60 * 60;

/** Future dates: deterministic 12:00 UTC snapshot; keep edge TTL modest. */
export const DAILY_SKY_HTML_FUTURE_TTL_SECONDS = 24 * 60 * 60;

/** No long stale window for "today" so midnight cannot serve yesterday. */
export const DAILY_SKY_HTML_TODAY_SWR_SECONDS = 0;

/** Past/future may briefly serve stale while revalidating. */
export const DAILY_SKY_HTML_OTHER_SWR_SECONDS = 3600;

/**
 * Browser-facing Cache-Control: avoid long private browser caches.
 * Edge TTL is expressed via CDN-Cache-Control / Cloudflare-CDN-Cache-Control.
 */
export const DAILY_SKY_HTML_BROWSER_CACHE_CONTROL =
	"public, max-age=0, must-revalidate";

export function secondsUntilNextUtcMidnight(now = new Date()): number {
	const nextUtcMidnight = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate() + 1,
	);
	return Math.max(0, Math.floor((nextUtcMidnight - now.getTime()) / 1000));
}

/**
 * Edge freshness window for Daily Sky HTML.
 * Today (and queryless → today) never extends past the next UTC midnight.
 */
export function dailySkyHtmlEdgeTtlSeconds(
	date: string,
	now = new Date(),
): number {
	const today = getUtcTodayDateOnly(now);
	if (date === today) {
		return secondsUntilNextUtcMidnight(now);
	}
	if (date > today) {
		return DAILY_SKY_HTML_FUTURE_TTL_SECONDS;
	}
	return DAILY_SKY_HTML_PAST_TTL_SECONDS;
}

export function dailySkyHtmlStaleWhileRevalidateSeconds(
	date: string,
	now = new Date(),
): number {
	if (date === getUtcTodayDateOnly(now)) {
		return DAILY_SKY_HTML_TODAY_SWR_SECONDS;
	}
	return DAILY_SKY_HTML_OTHER_SWR_SECONDS;
}

export function buildDailySkyEdgeCacheControl(
	date: string,
	now = new Date(),
): string | null {
	const maxAge = dailySkyHtmlEdgeTtlSeconds(date, now);
	if (maxAge <= 0) {
		return null;
	}

	const swr = dailySkyHtmlStaleWhileRevalidateSeconds(date, now);
	if (swr > 0) {
		return `public, max-age=${maxAge}, stale-while-revalidate=${swr}`;
	}
	return `public, max-age=${maxAge}`;
}

export type DailySkyHtmlCacheHeaders = {
	"Cache-Control": string;
	"CDN-Cache-Control"?: string;
	"Cloudflare-CDN-Cache-Control"?: string;
};

export function buildDailySkyHtmlCacheHeaders(
	date: string,
	now = new Date(),
): DailySkyHtmlCacheHeaders {
	const edge = buildDailySkyEdgeCacheControl(date, now);
	if (!edge) {
		return {
			"Cache-Control": DAILY_SKY_HTML_BROWSER_CACHE_CONTROL,
		};
	}

	return {
		"Cache-Control": DAILY_SKY_HTML_BROWSER_CACHE_CONTROL,
		"CDN-Cache-Control": edge,
		"Cloudflare-CDN-Cache-Control": edge,
	};
}

/**
 * Apply edge-cacheable headers to Daily Sky HTML only.
 * Other routes are returned unchanged (natal/synastry stay no-store).
 */
export function applyDailySkyEdgeCacheHeaders(
	request: Request,
	response: Response,
	now = new Date(),
): Response {
	const method = request.method.toUpperCase();
	if (method !== "GET" && method !== "HEAD") {
		return response;
	}

	let url: URL;
	try {
		url = new URL(request.url);
	} catch {
		return response;
	}

	if (url.pathname !== DAILY_SKY_PATH) {
		return response;
	}

	if (response.status !== 200) {
		return response;
	}

	// Workers Cache bypasses Set-Cookie responses; do not mark cacheable.
	if (response.headers.has("Set-Cookie")) {
		return response;
	}

	const date = resolveDailySkyDate(
		url.searchParams.get("tarih") ?? undefined,
	);
	const cacheHeaders = buildDailySkyHtmlCacheHeaders(date, now);
	const headers = new Headers(response.headers);

	for (const [key, value] of Object.entries(cacheHeaders)) {
		if (value) {
			headers.set(key, value);
		}
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}
