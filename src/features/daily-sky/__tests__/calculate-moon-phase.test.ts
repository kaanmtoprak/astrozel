import { describe, expect, it } from "vitest";
import { calculateMoonPhase } from "@/features/daily-sky/utils/calculate-moon-phase";

describe("calculateMoonPhase", () => {
	it("elongation 0 → Yeni Ay", () => {
		const phase = calculateMoonPhase(100, 100);
		expect(phase.key).toBe("new_moon");
		expect(phase.name).toBe("Yeni Ay");
		expect(phase.angle).toBe(0);
		expect(phase.illuminationPercent).toBe(0);
	});

	it("~90 → İlk Dördün (waxing)", () => {
		const phase = calculateMoonPhase(0, 90);
		expect(phase.key).toBe("first_quarter");
		expect(phase.name).toBe("İlk Dördün");
		expect(phase.angle).toBe(90);
		expect(phase.illuminationPercent).toBe(50);
	});

	it("~180 → Dolunay", () => {
		const phase = calculateMoonPhase(10, 190);
		expect(phase.key).toBe("full_moon");
		expect(phase.name).toBe("Dolunay");
		expect(phase.angle).toBe(180);
		expect(phase.illuminationPercent).toBe(100);
	});

	it("~270 → Son Dördün (waning)", () => {
		const phase = calculateMoonPhase(0, 270);
		expect(phase.key).toBe("last_quarter");
		expect(phase.name).toBe("Son Dördün");
		expect(phase.angle).toBe(270);
		expect(phase.illuminationPercent).toBe(50);
	});

	it("distinguishes waxing vs waning crescents", () => {
		const waxing = calculateMoonPhase(0, 45);
		const waning = calculateMoonPhase(0, 315);
		expect(waxing.key).toBe("waxing_crescent");
		expect(waning.key).toBe("waning_crescent");
		expect(waxing.illuminationPercent).toBeGreaterThan(0);
		expect(waning.illuminationPercent).toBeGreaterThan(0);
		expect(waxing.illuminationPercent).toBeLessThan(50);
		expect(waning.illuminationPercent).toBeLessThan(50);
	});
});
