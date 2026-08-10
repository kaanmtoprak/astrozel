import { describe, expect, it } from "vitest";
import { createNatalInterpretations } from "@/features/astrology/interpretations/utils/interpretation-engine";
import { aspectContentKey } from "@/features/astrology/interpretations/utils/interpretation-key";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import type { PlanetKey, ZodiacSign } from "@/features/astrology/types/astrology";

function position(sign: ZodiacSign, degree = 10, minute = 0) {
	return {
		longitude: 0,
		sign,
		signDegree: degree,
		degree,
		minute,
		second: 0,
		formatted: `${degree}°${String(minute).padStart(2, "0")}′ ${sign}`,
	};
}

function planet(
	key: PlanetKey,
	sign: ZodiacSign,
	house: number,
	isRetrograde = false,
) {
	return {
		key,
		position: position(sign),
		house,
		isRetrograde,
	};
}

/** İstanbul/Kadıköy 1995-05-14 13:30 senaryosuna yakın sabit fixture. */
function istanbulLikeChart(overrides?: Partial<NatalChartResult>): NatalChartResult {
	const base: NatalChartResult = {
		metadata: {
			provider: "celestine",
			calculationVersion: 1,
			zodiacType: "tropical",
			houseSystem: "placidus",
			localDateTime: "1995-05-14T13:30:00",
			timezone: "Europe/Istanbul",
			utcInstant: "1995-05-14T10:30:00Z",
			utcOffsetMinutes: 180,
			latitude: 40.98333,
			longitude: 29.03333,
			locationDisplayName: "Kadıköy, İstanbul, Türkiye",
		},
		angles: [
			{
				key: "ascendant",
				abbrev: "ASC",
				position: position("virgo", 12, 5),
			},
			{
				key: "midheaven",
				abbrev: "MC",
				position: position("gemini", 5, 0),
			},
			{
				key: "descendant",
				abbrev: "DSC",
				position: position("pisces", 12, 5),
			},
			{
				key: "imumCoeli",
				abbrev: "IC",
				position: position("sagittarius", 5, 0),
			},
		],
		planets: [
			planet("sun", "taurus", 9),
			planet("moon", "scorpio", 3),
			planet("mercury", "taurus", 9),
			planet("venus", "gemini", 10),
			planet("mars", "leo", 12, true),
			planet("jupiter", "sagittarius", 4),
			planet("saturn", "pisces", 7),
			planet("uranus", "capricorn", 5),
			planet("neptune", "capricorn", 5),
			planet("pluto", "scorpio", 3),
		],
		houses: Array.from({ length: 12 }, (_, index) => ({
			house: index + 1,
			position: position("aries", index),
		})),
		aspects: [
			{
				body1: "sun",
				body2: "jupiter",
				type: "trine",
				symbol: "△",
				exactAngle: 120,
				orb: 2.4,
			},
			{
				body1: "moon",
				body2: "pluto",
				type: "conjunction",
				symbol: "☌",
				exactAngle: 0,
				orb: 0.5,
			},
			{
				body1: "mercury",
				body2: "saturn",
				type: "sextile",
				symbol: "⚹",
				exactAngle: 60,
				orb: 3.1,
			},
			{
				body1: "venus",
				body2: "mars",
				type: "square",
				symbol: "□",
				exactAngle: 90,
				orb: 1.2,
			},
			{
				body1: "mars",
				body2: "neptune",
				type: "opposition",
				symbol: "☍",
				exactAngle: 180,
				orb: 4.5,
			},
			{
				body1: "jupiter",
				body2: "uranus",
				type: "trine",
				symbol: "△",
				exactAngle: 120,
				orb: 5.2,
			},
			{
				body1: "saturn",
				body2: "pluto",
				type: "trine",
				symbol: "△",
				exactAngle: 120,
				orb: 6.0,
			},
			{
				body1: "sun",
				body2: "moon",
				type: "opposition",
				symbol: "☍",
				exactAngle: 180,
				orb: 0.8,
			},
		],
		warnings: [],
	};

	return { ...base, ...overrides };
}

describe("createNatalInterpretations", () => {
	it("Güneş, Ay ve yükselen için üç yorum üretir", () => {
		const result = createNatalInterpretations(istanbulLikeChart());
		expect(result.overview).toHaveLength(3);
		expect(result.overview.map((item) => item.category)).toEqual([
			"sun",
			"moon",
			"ascendant",
		]);
	});

	it("İstanbul test vakasında Boğa / Akrep / Başak içeriklerini seçer", () => {
		const result = createNatalInterpretations(istanbulLikeChart());
		expect(result.overview[0]?.title).toBe("Güneş Boğa");
		expect(result.overview[0]?.summary).toContain("Boğa");
		expect(result.overview[1]?.title).toBe("Ay Akrep");
		expect(result.overview[1]?.summary).toContain("Akrep");
		expect(result.overview[2]?.title).toBe("Yükselen Başak");
		expect(result.overview[2]?.summary).toContain("Başak");
	});

	it("on gezegen için yerleşim yorumu üretir", () => {
		const result = createNatalInterpretations(istanbulLikeChart());
		expect(result.planets).toHaveLength(10);
		expect(result.planets.every((item) => item.signSummary.length > 0)).toBe(
			true,
		);
		expect(result.planets.every((item) => item.houseSummary.length > 0)).toBe(
			true,
		);
	});

	it("ev numarasını yorumda doğru kullanır", () => {
		const result = createNatalInterpretations(istanbulLikeChart());
		const venus = result.planets.find((item) => item.planet === "venus");
		expect(venus?.house).toBe(10);
		expect(venus?.houseSummary).toContain("10. ev");
		expect(venus?.houseSummary).toContain("kariyer");
	});

	it("retro gezegen için retro notu üretir", () => {
		const result = createNatalInterpretations(istanbulLikeChart());
		const mars = result.planets.find((item) => item.planet === "mars");
		expect(mars?.isRetrograde).toBe(true);
		expect(mars?.retrogradeNote).toBeTruthy();
		expect(mars?.retrogradeNote).toContain("Mars");
	});

	it("direkt gezegen için retro notu üretmez", () => {
		const result = createNatalInterpretations(istanbulLikeChart());
		const venus = result.planets.find((item) => item.planet === "venus");
		expect(venus?.isRetrograde).toBe(false);
		expect(venus?.retrogradeNote).toBeUndefined();
	});

	it("Güneş/Ay yanlışlıkla retro olsa bile UI notu üretmez", () => {
		const chart = istanbulLikeChart();
		const planets = chart.planets.map((item) =>
			item.key === "sun" ? { ...item, isRetrograde: true } : item,
		);
		const result = createNatalInterpretations({ ...chart, planets });
		const sun = result.planets.find((item) => item.planet === "sun");
		expect(sun?.isRetrograde).toBe(false);
		expect(sun?.retrogradeNote).toBeUndefined();
		expect(result.warnings.some((warning) => warning.includes("Güneş"))).toBe(
			true,
		);
	});

	it("açı yorumlarını orb’a göre sıralar ve en fazla altı üretir", () => {
		const result = createNatalInterpretations(istanbulLikeChart());
		expect(result.aspects.length).toBeLessThanOrEqual(6);
		expect(result.aspects.length).toBe(6);
		for (let index = 1; index < result.aspects.length; index += 1) {
			expect(result.aspects[index]!.orb).toBeGreaterThanOrEqual(
				result.aspects[index - 1]!.orb,
			);
		}
	});

	it("yalnızca desteklenen major aspect türlerini işler", () => {
		const chart = istanbulLikeChart({
			aspects: [
				{
					body1: "sun",
					body2: "moon",
					type: "opposition",
					symbol: "☍",
					exactAngle: 180,
					orb: 1,
				},
				{
					body1: "sun",
					body2: "venus",
					// @ts-expect-error kasıtlı geçersiz tür
					type: "quincunx",
					symbol: "⚻",
					exactAngle: 150,
					orb: 0.1,
				},
			],
		});
		const result = createNatalInterpretations(chart);
		expect(result.aspects).toHaveLength(1);
		expect(result.aspects[0]?.type).toBe("opposition");
	});

	it("input’u mutate etmez", () => {
		const chart = istanbulLikeChart();
		const snapshot = structuredClone(chart);
		createNatalInterpretations(chart);
		expect(chart).toEqual(snapshot);
	});

	it("aynı input aynı çıktıyı üretir", () => {
		const chart = istanbulLikeChart();
		const first = createNatalInterpretations(chart);
		const second = createNatalInterpretations(chart);
		expect(first).toEqual(second);
	});

	it("açı anahtarı gezegen sırasından bağımsızdır", () => {
		expect(aspectContentKey("sun", "jupiter", "trine")).toBe(
			aspectContentKey("jupiter", "sun", "trine"),
		);
		expect(aspectContentKey("sun", "jupiter", "trine")).toBe(
			"aspect.sun.jupiter.trine",
		);
	});

	it("Güneş ve Ay için kompakt yerleşim metni kullanır", () => {
		const result = createNatalInterpretations(istanbulLikeChart());
		const sun = result.planets.find((item) => item.planet === "sun");
		const mercury = result.planets.find((item) => item.planet === "mercury");
		expect(sun?.isCompact).toBe(true);
		expect(mercury?.isCompact).toBe(false);
		expect(sun?.signSummary.length ?? 0).toBeLessThan(
			mercury?.signSummary.length ?? 0,
		);
	});
});
