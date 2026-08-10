import type { BirthLocation } from "@/features/location/types/location";

export interface BirthChartFormValues {
	name?: string;
	birthDate: string;
	birthTime: string;
	birthPlace: string;
	location: BirthLocation;
}

export interface BirthChartDraft extends BirthChartFormValues {
	version: 2;
	createdAt: string;
}
