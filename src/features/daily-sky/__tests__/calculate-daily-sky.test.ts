import { describe, expect, it } from "vitest";
import { calculateDailySky } from "@/features/daily-sky/services/calculate-daily-sky";

describe("calculateDailySky math sanity", () => {
	it("2026-08-10 snapshot has valid ranges", async () => {
		const result = await calculateDailySky("2026-08-10");

		expect(result.date).toBe("2026-08-10");
		expect(result.planets).toHaveLength(10);
		expect(result.sun.key).toBe("sun");
		expect(result.moon.key).toBe("moon");
		expect(result.moonPhase.name.length).toBeGreaterThan(0);
		expect(result.moonPhase.illuminationPercent).toBeGreaterThanOrEqual(0);
		expect(result.moonPhase.illuminationPercent).toBeLessThanOrEqual(100);

		for (const planet of result.planets) {
			expect(planet.longitude).toBeGreaterThanOrEqual(0);
			expect(planet.longitude).toBeLessThan(360);
			expect(planet.degree).toBeGreaterThanOrEqual(0);
			expect(planet.degree).toBeLessThanOrEqual(29);
			expect(planet.minute).toBeGreaterThanOrEqual(0);
			expect(planet.minute).toBeLessThanOrEqual(59);
			expect(typeof planet.isRetrograde).toBe("boolean");
			expect(Number.isFinite(planet.longitude)).toBe(true);
		}

		for (const aspect of result.aspects) {
			expect(aspect.orb).toBeGreaterThanOrEqual(0);
			expect(Number.isFinite(aspect.orb)).toBe(true);
		}

		expect(result.interpretation.atmosphere).toHaveLength(2);
		expect(result.interpretation.themeBody.length).toBeGreaterThan(0);
	});
});
