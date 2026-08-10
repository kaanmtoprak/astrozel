import { describe, expect, it } from "vitest";
import {
	buildBirthYearOptions,
	buildHourOptions,
	buildMinuteOptions,
	formatTimeSelection,
	parseTimeSelection,
} from "@/lib/time-options";

describe("time-options", () => {
	it("saat listesi 00–23 üretir", () => {
		const hours = buildHourOptions();
		expect(hours).toHaveLength(24);
		expect(hours[0]).toBe("00");
		expect(hours[12]).toBe("12");
		expect(hours[23]).toBe("23");
	});

	it("dakika listesi 00–59 üretir", () => {
		const minutes = buildMinuteOptions();
		expect(minutes).toHaveLength(60);
		expect(minutes[0]).toBe("00");
		expect(minutes[30]).toBe("30");
		expect(minutes[59]).toBe("59");
	});

	it("geçici seçimi HH:mm’ye dönüştürür", () => {
		expect(formatTimeSelection("08", "05")).toBe("08:05");
		expect(formatTimeSelection("23", "59")).toBe("23:59");
		expect(formatTimeSelection("08", null)).toBeNull();
		expect(formatTimeSelection(null, "05")).toBeNull();
		expect(formatTimeSelection("24", "00")).toBeNull();
	});

	it("HH:mm değerini parçalar", () => {
		expect(parseTimeSelection("13:30")).toEqual({ hour: "13", minute: "30" });
		expect(parseTimeSelection("")).toEqual({ hour: null, minute: null });
		expect(parseTimeSelection("9:30")).toEqual({ hour: null, minute: null });
	});

	it("yıl listesini yeni→eski üretir", () => {
		const years = buildBirthYearOptions(1900, 1902);
		expect(years).toEqual([1902, 1901, 1900]);
		expect(buildBirthYearOptions(2000, 1999)).toEqual([]);
	});
});
