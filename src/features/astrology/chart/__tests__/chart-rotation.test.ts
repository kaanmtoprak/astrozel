import { describe, expect, it } from "vitest";
import {
	chartAnglePosition,
	longitudeToChartAngleDegrees,
} from "@/features/astrology/chart/utils/chart-rotation";
import { normalizeLongitude } from "@/features/astrology/utils/degrees";

describe("chart rotation", () => {
	it("ASC longitude sol noktaya düşer", () => {
		const angle = longitudeToChartAngleDegrees(154.87, 154.87);
		expect(angle).toBeCloseTo(180, 5);
		expect(chartAnglePosition(angle)).toBe("left");
	});

	it("DSC longitude sağ noktaya düşer", () => {
		const asc = 154.87;
		const dsc = normalizeLongitude(asc + 180);
		const angle = longitudeToChartAngleDegrees(dsc, asc);
		expect(angle).toBeCloseTo(0, 5);
		expect(chartAnglePosition(angle)).toBe("right");
	});

	it("ASC + 90° alt noktaya düşer", () => {
		const asc = 100;
		const angle = longitudeToChartAngleDegrees(asc + 90, asc);
		expect(angle).toBeCloseTo(270, 5);
		expect(chartAnglePosition(angle)).toBe("bottom");
	});

	it("ASC - 90° üst noktaya düşer", () => {
		const asc = 100;
		const angle = longitudeToChartAngleDegrees(asc - 90, asc);
		expect(angle).toBeCloseTo(90, 5);
		expect(chartAnglePosition(angle)).toBe("top");
	});

	it("360 wrap ile çalışır", () => {
		const angle = longitudeToChartAngleDegrees(370, 10);
		expect(angle).toBeCloseTo(180, 5);
	});

	it("negatif longitude normalize edilir", () => {
		const angle = longitudeToChartAngleDegrees(-10, 0);
		expect(angle).toBeCloseTo(170, 5);
	});
});
