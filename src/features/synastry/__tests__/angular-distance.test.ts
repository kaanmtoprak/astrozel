import { describe, expect, it } from "vitest";
import { angularDistance } from "@/features/synastry/utils/angular-distance";

describe("angularDistance", () => {
	it("wraps across 0°", () => {
		expect(angularDistance(359, 1)).toBe(2);
		expect(angularDistance(10, 350)).toBe(20);
	});

	it("handles opposition and sextile distances", () => {
		expect(angularDistance(0, 180)).toBe(180);
		expect(angularDistance(30, 90)).toBe(60);
	});

	it("normalizes negative longitudes", () => {
		expect(angularDistance(-10, 10)).toBe(20);
		expect(angularDistance(370, 10)).toBe(0);
	});

	it("rejects NaN and Infinity", () => {
		expect(() => angularDistance(Number.NaN, 10)).toThrow();
		expect(() => angularDistance(10, Number.POSITIVE_INFINITY)).toThrow();
	});
});
