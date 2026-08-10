import type { BirthLocation } from "@/features/location/types/location";

export interface SynastryPersonInput {
	name?: string;
	birthDate: string;
	birthTime: string;
	birthPlace: string;
	location: BirthLocation;
}

export interface SynastryFormValues {
	personA: SynastryPersonInput;
	personB: SynastryPersonInput;
}

export interface SynastryDraft {
	version: 1;
	createdAt: string;
	personA: SynastryPersonInput;
	personB: SynastryPersonInput;
}
