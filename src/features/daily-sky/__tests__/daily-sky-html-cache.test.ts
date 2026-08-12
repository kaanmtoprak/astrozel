import { describe, expect, it } from "vitest";
import {
	applyDailySkyEdgeCacheHeaders,
	buildDailySkyEdgeCacheControl,
	buildDailySkyHtmlCacheHeaders,
	dailySkyHtmlEdgeTtlSeconds,
	dailySkyHtmlStaleWhileRevalidateSeconds,
	DAILY_SKY_HTML_FUTURE_TTL_SECONDS,
	DAILY_SKY_HTML_PAST_TTL_SECONDS,
	secondsUntilNextUtcMidnight,
} from "@/features/daily-sky/utils/daily-sky-html-cache";

describe("secondsUntilNextUtcMidnight", () => {
	it("returns remaining seconds before the next UTC midnight", () => {
		const now = new Date("2026-08-12T15:00:00.000Z");
		expect(secondsUntilNextUtcMidnight(now)).toBe(9 * 60 * 60);
	});

	it("returns 0 in the final sub-second before UTC midnight", () => {
		const now = new Date("2026-08-12T23:59:59.100Z");
		expect(secondsUntilNextUtcMidnight(now)).toBe(0);
	});
});

describe("dailySkyHtmlEdgeTtlSeconds", () => {
	const now = new Date("2026-08-12T15:00:00.000Z");

	it("uses seconds until UTC midnight for today", () => {
		expect(dailySkyHtmlEdgeTtlSeconds("2026-08-12", now)).toBe(9 * 60 * 60);
	});

	it("uses a long TTL for past dates", () => {
		expect(dailySkyHtmlEdgeTtlSeconds("2026-08-11", now)).toBe(
			DAILY_SKY_HTML_PAST_TTL_SECONDS,
		);
	});

	it("uses a one-day TTL for future dates", () => {
		expect(dailySkyHtmlEdgeTtlSeconds("2026-08-13", now)).toBe(
			DAILY_SKY_HTML_FUTURE_TTL_SECONDS,
		);
	});
});

describe("dailySkyHtmlStaleWhileRevalidateSeconds", () => {
	const now = new Date("2026-08-12T15:00:00.000Z");

	it("disables SWR for today", () => {
		expect(dailySkyHtmlStaleWhileRevalidateSeconds("2026-08-12", now)).toBe(0);
	});

	it("allows a short SWR window for other dates", () => {
		expect(dailySkyHtmlStaleWhileRevalidateSeconds("2026-08-11", now)).toBe(
			3600,
		);
	});
});

describe("buildDailySkyEdgeCacheControl", () => {
	it("omits edge caching in the final sub-second before UTC midnight", () => {
		const now = new Date("2026-08-12T23:59:59.100Z");
		expect(buildDailySkyEdgeCacheControl("2026-08-12", now)).toBeNull();
	});

	it("builds max-age without SWR for today", () => {
		const now = new Date("2026-08-12T15:00:00.000Z");
		expect(buildDailySkyEdgeCacheControl("2026-08-12", now)).toBe(
			"public, max-age=32400",
		);
	});

	it("includes SWR for past dates", () => {
		const now = new Date("2026-08-12T15:00:00.000Z");
		expect(buildDailySkyEdgeCacheControl("2026-08-11", now)).toBe(
			`public, max-age=${DAILY_SKY_HTML_PAST_TTL_SECONDS}, stale-while-revalidate=3600`,
		);
	});
});

describe("buildDailySkyHtmlCacheHeaders", () => {
	it("keeps browser cache short and edge cache dated", () => {
		const now = new Date("2026-08-12T15:00:00.000Z");
		expect(buildDailySkyHtmlCacheHeaders("2026-08-12", now)).toEqual({
			"Cache-Control": "public, max-age=0, must-revalidate",
			"CDN-Cache-Control": "public, max-age=32400",
			"Cloudflare-CDN-Cache-Control": "public, max-age=32400",
		});
	});
});

describe("applyDailySkyEdgeCacheHeaders", () => {
	const now = new Date("2026-08-12T15:00:00.000Z");

	it("applies headers only to Daily Sky GET 200 responses", async () => {
		const request = new Request(
			"https://astrozel.com/bugunun-gokyuzu?tarih=2026-08-12",
		);
		const response = new Response("<html>ok</html>", { status: 200 });
		const cached = applyDailySkyEdgeCacheHeaders(request, response, now);

		expect(cached.headers.get("Cache-Control")).toBe(
			"public, max-age=0, must-revalidate",
		);
		expect(cached.headers.get("CDN-Cache-Control")).toBe(
			"public, max-age=32400",
		);
		expect(await cached.text()).toBe("<html>ok</html>");
	});

	it("leaves other routes unchanged", () => {
		const request = new Request("https://astrozel.com/api/charts/natal", {
			method: "POST",
		});
		const response = new Response("{}", {
			status: 200,
			headers: { "Cache-Control": "no-store" },
		});
		const next = applyDailySkyEdgeCacheHeaders(request, response, now);
		expect(next.headers.get("Cache-Control")).toBe("no-store");
		expect(next.headers.get("CDN-Cache-Control")).toBeNull();
	});

	it("skips caching when Set-Cookie is present", () => {
		const request = new Request("https://astrozel.com/bugunun-gokyuzu");
		const response = new Response("<html>ok</html>", {
			status: 200,
			headers: { "Set-Cookie": "x=1" },
		});
		const next = applyDailySkyEdgeCacheHeaders(request, response, now);
		expect(next.headers.get("CDN-Cache-Control")).toBeNull();
	});
});
