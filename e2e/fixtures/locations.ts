export interface LocationSearchResult {
	geonameId: number;
	name: string;
	displayName: string;
	countryCode: string;
	countryName: string;
	adminName1?: string;
	latitude: number;
	longitude: number;
}

export interface BirthLocation extends LocationSearchResult {
	timezone: string;
}

export const KADIKOY_SEARCH: LocationSearchResult = {
	geonameId: 6947639,
	name: "Kadıköy",
	displayName: "Kadıköy, İstanbul, Türkiye",
	countryCode: "TR",
	countryName: "Türkiye",
	adminName1: "İstanbul",
	latitude: 40.98333,
	longitude: 29.03333,
};

export const PARIS_SEARCH: LocationSearchResult = {
	geonameId: 2988507,
	name: "Paris",
	displayName: "Paris, Île-de-France, Fransa",
	countryCode: "FR",
	countryName: "Fransa",
	adminName1: "Île-de-France",
	latitude: 48.85341,
	longitude: 2.3488,
};

export const KADIKOY_TIMEZONE = "Europe/Istanbul";
export const PARIS_TIMEZONE = "Europe/Paris";

export const KADIKOY_LOCATION: BirthLocation = {
	...KADIKOY_SEARCH,
	timezone: KADIKOY_TIMEZONE,
};

export const PARIS_LOCATION: BirthLocation = {
	...PARIS_SEARCH,
	timezone: PARIS_TIMEZONE,
};

export const ISTANBUL_TEST_BIRTH = {
	name: "Test Kullanıcısı",
	birthDate: "1995-05-14",
	birthDateDisplay: "14 Mayıs 1995",
	birthTime: "13:30",
	location: KADIKOY_LOCATION,
} as const;
