import { describe, expect, it } from "vitest";
import { birthChartFormSchema } from "@/features/birth-chart/schemas/birth-chart-form-schema";
import { synastryFormSchema } from "@/features/synastry/schemas/synastry-form-schema";

const location = {
	geonameId: 6947639,
	name: "Kadıköy",
	displayName: "Kadıköy, İstanbul, Türkiye",
	countryCode: "TR",
	countryName: "Türkiye",
	adminName1: "İstanbul",
	latitude: 40.98333,
	longitude: 29.03333,
	timezone: "Europe/Istanbul",
};

describe("draft name round-trip", () => {
	it("persists empty optional name after JSON serialization", () => {
		const parsed = birthChartFormSchema.parse({
			name: "",
			birthDate: "1995-05-14",
			birthTime: "13:30",
			birthPlace: location.displayName,
			location,
		});

		const serialized = JSON.parse(
			JSON.stringify({
				name: parsed.name,
				birthDate: parsed.birthDate,
				birthTime: parsed.birthTime,
				birthPlace: parsed.birthPlace,
				location: parsed.location,
			}),
		) as Record<string, unknown>;

		expect(serialized.name).toBe("");
		const roundTrip = birthChartFormSchema.safeParse(serialized);
		expect(roundTrip.success).toBe(true);
		expect(roundTrip.data?.name).toBe("");
	});

	it("accepts missing name key from legacy drafts", () => {
		const roundTrip = birthChartFormSchema.safeParse({
			birthDate: "1995-05-14",
			birthTime: "13:30",
			birthPlace: location.displayName,
			location,
		});
		expect(roundTrip.success).toBe(true);
		expect(roundTrip.data?.name).toBe("");
	});

	it("accepts synastry draft without names after JSON serialization", () => {
		const parsed = synastryFormSchema.parse({
			personA: {
				name: "",
				birthDate: "1995-05-14",
				birthTime: "13:30",
				birthPlace: location.displayName,
				location,
			},
			personB: {
				name: "",
				birthDate: "1992-08-21",
				birthTime: "09:15",
				birthPlace: location.displayName,
				location,
			},
		});

		const serialized = JSON.parse(
			JSON.stringify({
				personA: {
					name: parsed.personA.name,
					birthDate: parsed.personA.birthDate,
					birthTime: parsed.personA.birthTime,
					birthPlace: parsed.personA.birthPlace,
					location: parsed.personA.location,
				},
				personB: {
					name: parsed.personB.name,
					birthDate: parsed.personB.birthDate,
					birthTime: parsed.personB.birthTime,
					birthPlace: parsed.personB.birthPlace,
					location: parsed.personB.location,
				},
			}),
		);

		expect(serialized.personA.name).toBe("");
		expect(serialized.personB.name).toBe("");
		const roundTrip = synastryFormSchema.safeParse(serialized);
		expect(roundTrip.success).toBe(true);
	});
});
