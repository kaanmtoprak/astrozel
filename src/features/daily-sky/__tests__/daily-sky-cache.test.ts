import { describe, expect, it } from "vitest";
import {
	dailySkyCacheKey,
	dailySkyCacheTtlSeconds,
} from "@/features/daily-sky/utils/daily-sky-cache";

describe("dailySkyCacheKey", () => {
	it("is deterministic per UTC date", () => {
		expect(dailySkyCacheKey("2026-08-12")).toBe("daily-sky:2026-08-12");
		expect(dailySkyCacheKey("2026-08-11")).toBe("daily-sky:2026-08-11");
	});
});

describe("dailySkyCacheTtlSeconds", () => {
	it("uses a long TTL for dates other than UTC today", () => {
		const now = new Date("2026-08-12T15:00:00.000Z");
		expect(dailySkyCacheTtlSeconds("2026-08-11", now)).toBe(7 * 24 * 60 * 60);
		expect(dailySkyCacheTtlSeconds("2026-08-13", now)).toBe(7 * 24 * 60 * 60);
	});

	it("expires at the next UTC midnight for today", () => {
		const now = new Date("2026-08-12T15:00:00.000Z");
		expect(dailySkyCacheTtlSeconds("2026-08-12", now)).toBe(9 * 60 * 60);
	});
});
