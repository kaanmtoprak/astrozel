import { describe, expect, it } from "vitest";
import { MAX_ASPECT_INTERPRETATIONS } from "@/features/astrology/interpretations/constants/interpretation-settings";
import { prioritizeAspectsForInterpretation } from "@/features/astrology/interpretations/utils/interpretation-priority";
import type { NatalAspect } from "@/features/astrology/types/natal-chart";

function aspect(
	body1: NatalAspect["body1"],
	body2: NatalAspect["body2"],
	type: NatalAspect["type"],
	orb: number,
): NatalAspect {
	return {
		body1,
		body2,
		type,
		symbol: "△",
		exactAngle: 120,
		orb,
	};
}

describe("prioritizeAspectsForInterpretation", () => {
	it("küçük orb önce gelir", () => {
		const sorted = prioritizeAspectsForInterpretation([
			aspect("sun", "mars", "square", 4),
			aspect("moon", "venus", "trine", 0.5),
			aspect("mercury", "jupiter", "sextile", 2),
		]);
		expect(sorted.map((item) => item.orb)).toEqual([0.5, 2, 4]);
	});

	it("eşit orb durumunda deterministic gezegen sırası kullanılır", () => {
		const sorted = prioritizeAspectsForInterpretation([
			aspect("mars", "jupiter", "trine", 1),
			aspect("sun", "moon", "conjunction", 1),
			aspect("mercury", "venus", "sextile", 1),
		]);
		expect(sorted.map((item) => `${item.body1}-${item.body2}`)).toEqual([
			"sun-moon",
			"mercury-venus",
			"mars-jupiter",
		]);
	});

	it("en fazla altı sonuç döner", () => {
		const aspects = Array.from({ length: 10 }, (_, index) =>
			aspect("sun", "moon", "trine", index),
		);
		const sorted = prioritizeAspectsForInterpretation(aspects);
		expect(sorted).toHaveLength(MAX_ASPECT_INTERPRETATIONS);
	});

	it("input sırası değişse bile sonuç sırası değişmez", () => {
		const a = [
			aspect("pluto", "neptune", "conjunction", 3),
			aspect("sun", "jupiter", "trine", 1),
			aspect("moon", "mars", "square", 2),
		];
		const b = [...a].reverse();
		expect(prioritizeAspectsForInterpretation(a)).toEqual(
			prioritizeAspectsForInterpretation(b),
		);
	});

	it("NaN veya negatif orb güvenli biçimde sona atılır", () => {
		const sorted = prioritizeAspectsForInterpretation([
			aspect("sun", "moon", "opposition", Number.NaN),
			aspect("venus", "mars", "square", -1),
			aspect("mercury", "jupiter", "trine", 1.5),
			aspect("saturn", "uranus", "sextile", 0.2),
		]);
		expect(sorted[0]?.orb).toBe(0.2);
		expect(sorted[1]?.orb).toBe(1.5);
		expect(sorted.slice(2).every((item) => !Number.isFinite(item.orb) || item.orb < 0)).toBe(
			true,
		);
	});

	it("limit 0 veya geçersizse boş dizi döner", () => {
		expect(
			prioritizeAspectsForInterpretation(
				[aspect("sun", "moon", "trine", 1)],
				0,
			),
		).toEqual([]);
		expect(
			prioritizeAspectsForInterpretation(
				[aspect("sun", "moon", "trine", 1)],
				Number.NaN,
			),
		).toEqual([]);
	});
});
