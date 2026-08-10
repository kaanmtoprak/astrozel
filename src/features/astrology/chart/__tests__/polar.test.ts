import { describe, expect, it } from "vitest";
import {
	describeArc,
	longitudeToChartAngle,
	longitudeToPoint,
	midpointLongitude,
	polarToCartesian,
} from "@/features/astrology/chart/utils/polar";

describe("polar utilities", () => {
	it("0° sağ noktaya gider", () => {
		const point = polarToCartesian(400, 400, 100, 0);
		expect(point.x).toBeCloseTo(500, 5);
		expect(point.y).toBeCloseTo(400, 5);
	});

	it("90° üst noktaya gider", () => {
		const point = polarToCartesian(400, 400, 100, 90);
		expect(point.x).toBeCloseTo(400, 5);
		expect(point.y).toBeCloseTo(300, 5);
	});

	it("180° sol noktaya gider", () => {
		const point = polarToCartesian(400, 400, 100, 180);
		expect(point.x).toBeCloseTo(300, 5);
		expect(point.y).toBeCloseTo(400, 5);
	});

	it("270° alt noktaya gider", () => {
		const point = polarToCartesian(400, 400, 100, 270);
		expect(point.x).toBeCloseTo(400, 5);
		expect(point.y).toBeCloseTo(500, 5);
	});

	it("farklı radius ölçekler", () => {
		const a = polarToCartesian(0, 0, 10, 0);
		const b = polarToCartesian(0, 0, 20, 0);
		expect(b.x).toBeCloseTo(a.x * 2, 5);
	});

	it("finite olmayan değerleri reddeder", () => {
		expect(() => polarToCartesian(400, 400, Number.NaN, 0)).toThrow();
		expect(() => polarToCartesian(400, 400, 10, Number.POSITIVE_INFINITY)).toThrow();
		expect(() => longitudeToChartAngle(Number.NaN, 0)).toThrow();
	});

	it("midpointLongitude 360 wrap’ini doğru yönetir", () => {
		expect(midpointLongitude(340, 10)).toBeCloseTo(355, 5);
		expect(midpointLongitude(0, 30)).toBeCloseTo(15, 5);
	});

	it("describeArc geçerli path üretir", () => {
		const path = describeArc(400, 400, 100, 0, 90);
		expect(path.startsWith("M ")).toBe(true);
		expect(path.includes(" A ")).toBe(true);
	});

	it("longitudeToPoint ASC rotasyonu ile çalışır", () => {
		const left = longitudeToPoint(120, 120, 100, 400, 400);
		expect(left.x).toBeCloseTo(300, 5);
		expect(left.y).toBeCloseTo(400, 5);
	});
});
