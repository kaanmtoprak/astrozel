import type { DailySkyResult } from "@/features/daily-sky/types/daily-sky";
import { getUtcTodayDateOnly } from "@/features/daily-sky/utils/daily-sky-date";

const CACHE_NAME = "astrozel-daily-sky";
const CACHE_KEY_PREFIX = "https://astrozel.com/__daily-sky-cache__/";
const LONG_TTL_SECONDS = 7 * 24 * 60 * 60;
const MIN_TTL_SECONDS = 60;

export function dailySkyCacheKey(date: string): string {
	return `daily-sky:${date}`;
}

export function dailySkyCacheTtlSeconds(
	date: string,
	now = new Date(),
): number {
	if (date !== getUtcTodayDateOnly(now)) {
		return LONG_TTL_SECONDS;
	}

	const nextUtcMidnight = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate() + 1,
	);

	return Math.max(
		MIN_TTL_SECONDS,
		Math.ceil((nextUtcMidnight - now.getTime()) / 1000),
	);
}

function cacheRequest(date: string): Request {
	return new Request(`${CACHE_KEY_PREFIX}${dailySkyCacheKey(date)}`);
}

function logCache(event: "hit" | "miss", date: string): void {
	if (process.env.NODE_ENV !== "development") {
		return;
	}
	console.info(`[daily-sky-cache] ${event} ${date}`);
}

async function getCache(): Promise<Cache | null> {
	try {
		if (typeof caches === "undefined" || typeof caches.open !== "function") {
			return null;
		}
		return await caches.open(CACHE_NAME);
	} catch {
		return null;
	}
}

export async function readDailySkyCache(
	date: string,
): Promise<DailySkyResult | null> {
	const cache = await getCache();
	if (!cache) {
		return null;
	}

	try {
		const cached = await cache.match(cacheRequest(date));
		if (!cached) {
			return null;
		}
		const result = (await cached.json()) as DailySkyResult;
		if (!result || result.date !== date || !Array.isArray(result.planets)) {
			return null;
		}
		logCache("hit", date);
		return result;
	} catch {
		return null;
	}
}

export async function writeDailySkyCache(
	date: string,
	result: DailySkyResult,
): Promise<void> {
	const cache = await getCache();
	if (!cache) {
		return;
	}

	try {
		const ttl = dailySkyCacheTtlSeconds(date);
		await cache.put(
			cacheRequest(date),
			new Response(JSON.stringify(result), {
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": `public, max-age=${ttl}`,
				},
			}),
		);
	} catch {
		// Cache is an optimization; calculation still succeeded.
	}
}

export function logDailySkyCacheMiss(date: string): void {
	logCache("miss", date);
}
