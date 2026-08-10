import { describe, expect, it } from "vitest";
import { ALL_ASPECT_TYPES, ASPECT_CONTENT } from "@/features/astrology/interpretations/content/aspects";
import {
	ALL_BIG_THREE_ENTRIES,
	BIG_THREE_ASCENDANT,
	BIG_THREE_MOON,
	BIG_THREE_SUN,
} from "@/features/astrology/interpretations/content/big-three";
import {
	ALL_HOUSE_NUMBERS,
	HOUSE_CONTENT,
} from "@/features/astrology/interpretations/content/houses";
import {
	ALL_PLANET_KEYS,
	PLANET_CONTENT,
} from "@/features/astrology/interpretations/content/planets";
import {
	ALL_ZODIAC_SIGNS,
	ZODIAC_SIGN_CONTENT,
} from "@/features/astrology/interpretations/content/zodiac-signs";
import {
	aspectContentKey,
	bigThreeContentKey,
	planetHouseContentKey,
	planetSignContentKey,
} from "@/features/astrology/interpretations/utils/interpretation-key";
import type {
	AspectType,
	PlanetKey,
	ZodiacSign,
} from "@/features/astrology/types/astrology";
import {
	CORE_PLANET_KEYS,
	MAJOR_ASPECT_TYPES,
} from "@/features/astrology/constants/astrology-settings";

const EXPECTED_SIGNS: ZodiacSign[] = [
	"aries",
	"taurus",
	"gemini",
	"cancer",
	"leo",
	"virgo",
	"libra",
	"scorpio",
	"sagittarius",
	"capricorn",
	"aquarius",
	"pisces",
];

describe("interpretation content coverage", () => {
	it("12 burç içeriğinin tamamını kapsar", () => {
		expect(ALL_ZODIAC_SIGNS.sort()).toEqual([...EXPECTED_SIGNS].sort());
		for (const sign of EXPECTED_SIGNS) {
			const content = ZODIAC_SIGN_CONTENT[sign];
			expect(content.sign).toBe(sign);
			expect(content.approach.trim().length).toBeGreaterThan(0);
			expect(content.strength.trim().length).toBeGreaterThan(0);
			expect(content.challenge.trim().length).toBeGreaterThan(0);
			expect(["fire", "earth", "air", "water"]).toContain(content.element);
			expect(["cardinal", "fixed", "mutable"]).toContain(content.modality);
		}
	});

	it("10 gezegen içeriğinin tamamını kapsar", () => {
		expect([...ALL_PLANET_KEYS].sort()).toEqual([...CORE_PLANET_KEYS].sort());
		for (const key of CORE_PLANET_KEYS) {
			const content = PLANET_CONTENT[key];
			expect(content.key).toBe(key);
			expect(content.label.trim().length).toBeGreaterThan(0);
			expect(content.role.trim().length).toBeGreaterThan(0);
			expect(content.functionFocus.trim().length).toBeGreaterThan(0);
			expect(content.compactPlacementLead.trim().length).toBeGreaterThan(0);
			if (key !== "sun" && key !== "moon") {
				expect(content.retrogradeNote.trim().length).toBeGreaterThan(0);
			}
		}
	});

	it("12 ev içeriğinin tamamını kapsar", () => {
		expect([...ALL_HOUSE_NUMBERS]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
		for (const house of ALL_HOUSE_NUMBERS) {
			const content = HOUSE_CONTENT[house];
			expect(content.house).toBe(house);
			expect(content.title.trim().length).toBeGreaterThan(0);
			expect(content.description.trim().length).toBeGreaterThan(0);
			expect(content.lifeArea.trim().length).toBeGreaterThan(0);
			expect(content.themes.length).toBeGreaterThan(0);
		}
	});

	it("5 major açı içeriğinin tamamını kapsar", () => {
		expect([...ALL_ASPECT_TYPES].sort()).toEqual([...MAJOR_ASPECT_TYPES].sort());
		for (const type of MAJOR_ASPECT_TYPES) {
			const content = ASPECT_CONTENT[type as AspectType];
			expect(content.type).toBe(type);
			expect(content.label.trim().length).toBeGreaterThan(0);
			expect(content.dynamic.trim().length).toBeGreaterThan(0);
			expect(content.potential.trim().length).toBeGreaterThan(0);
			expect(content.balance.trim().length).toBeGreaterThan(0);
			expect(content.bridgePhrase.trim().length).toBeGreaterThan(0);
		}
	});

	it("12 Güneş, 12 Ay ve 12 yükselen yorumu bulunur", () => {
		expect(Object.keys(BIG_THREE_SUN)).toHaveLength(12);
		expect(Object.keys(BIG_THREE_MOON)).toHaveLength(12);
		expect(Object.keys(BIG_THREE_ASCENDANT)).toHaveLength(12);
		expect(ALL_BIG_THREE_ENTRIES).toHaveLength(36);

		for (const sign of EXPECTED_SIGNS) {
			expect(BIG_THREE_SUN[sign].title).toContain("Güneş");
			expect(BIG_THREE_MOON[sign].title).toContain("Ay");
			expect(BIG_THREE_ASCENDANT[sign].title).toContain("Yükselen");
		}
	});

	it("zorunlu title ve summary alanları boş değildir", () => {
		for (const entry of ALL_BIG_THREE_ENTRIES) {
			expect(entry.title.trim().length).toBeGreaterThan(0);
			expect(entry.summary.trim().length).toBeGreaterThan(20);
			expect(entry.potential.trim().length).toBeGreaterThan(0);
			expect(entry.balance.trim().length).toBeGreaterThan(0);
		}
	});

	it("içerik anahtarları stabil ve benzersizdir", () => {
		const keys = new Set<string>();

		for (const sign of EXPECTED_SIGNS) {
			for (const kind of ["sun", "moon", "ascendant"] as const) {
				const key = bigThreeContentKey(kind, sign);
				expect(keys.has(key)).toBe(false);
				keys.add(key);
			}
		}

		for (const planet of CORE_PLANET_KEYS) {
			for (const sign of EXPECTED_SIGNS) {
				const key = planetSignContentKey(planet as PlanetKey, sign);
				expect(keys.has(key)).toBe(false);
				keys.add(key);
			}
			for (const house of ALL_HOUSE_NUMBERS) {
				const key = planetHouseContentKey(planet as PlanetKey, house);
				expect(keys.has(key)).toBe(false);
				keys.add(key);
			}
		}

		for (const type of MAJOR_ASPECT_TYPES) {
			const key = aspectContentKey("sun", "moon", type as AspectType);
			expect(key).toBe(`aspect.sun.moon.${type}`);
			expect(keys.has(key)).toBe(false);
			keys.add(key);
		}

		expect(keys.size).toBeGreaterThan(36 + 120 + 120);
	});

	it("büyük üçlü title’ları tekrar etmez", () => {
		const titles = ALL_BIG_THREE_ENTRIES.map((entry) => entry.title);
		expect(new Set(titles).size).toBe(titles.length);
	});
});
