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

export type ApiErrorCode =
	| "INVALID_QUERY"
	| "INVALID_COORDINATES"
	| "SERVICE_NOT_CONFIGURED"
	| "UPSTREAM_ERROR"
	| "RATE_LIMITED"
	| "INVALID_UPSTREAM_RESPONSE";

export interface ApiErrorBody {
	error: {
		code: ApiErrorCode;
		message: string;
	};
}

export interface LocationSearchResponse {
	results: LocationSearchResult[];
}

export interface LocationTimezoneResponse {
	timezone: string;
}
