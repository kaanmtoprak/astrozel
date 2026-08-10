import { describe, expect, it } from "vitest";
import { detectSynastryAspect } from "@/features/synastry/utils/detect-synastry-aspect";

describe("detectSynastryAspect", () => {
	it("detects major aspects", () => {
		expect(detectSynastryAspect(10, 12, "sun", "moon")?.aspectType).toBe(
			"conjunction",
		);
		expect(detectSynastryAspect(10, 70, "mercury", "venus")?.aspectType).toBe(
			"sextile",
		);
		expect(detectSynastryAspect(10, 100, "mercury", "mars")?.aspectType).toBe(
			"square",
		);
		expect(detectSynastryAspect(10, 130, "sun", "moon")?.aspectType).toBe(
			"trine",
		);
		expect(detectSynastryAspect(10, 190, "sun", "moon")?.aspectType).toBe(
			"opposition",
		);
	});

	it("returns null outside orb", () => {
		expect(detectSynastryAspect(0, 20, "uranus", "neptune")).toBeNull();
	});

	it("handles wrap boundary conjunction", () => {
		const detected = detectSynastryAspect(359, 2, "sun", "moon");
		expect(detected?.aspectType).toBe("conjunction");
		expect(detected?.orb).toBeCloseTo(3, 5);
	});

	it("uses tighter ascendant orb", () => {
		expect(detectSynastryAspect(0, 6, "sun", "ascendant")).toBeNull();
		expect(detectSynastryAspect(0, 4, "sun", "ascendant")?.aspectType).toBe(
			"conjunction",
		);
	});
});
