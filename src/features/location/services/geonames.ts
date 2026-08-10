import "server-only";

import { getGeoNamesUsername, ServerEnvError } from "@/lib/server-env";
import { isValidIanaTimezone } from "@/features/location/schemas/location-search-schema";
import type { LocationSearchResult } from "@/features/location/types/location";
import { buildLocationDisplayName } from "@/features/location/utils/location-label";

const GEONAMES_TIMEOUT_MS = 10_000;
const GEONAMES_MAX_ATTEMPTS = 2;
const GEONAMES_RETRY_DELAY_MS = 400;

type GeoNamesEndpointKind = "search" | "timezone";

export class GeoNamesUpstreamError extends Error {
	readonly status: number;
	readonly code:
		| "UPSTREAM_ERROR"
		| "RATE_LIMITED"
		| "INVALID_UPSTREAM_RESPONSE";

	constructor(
		message: string,
		code:
			| "UPSTREAM_ERROR"
			| "RATE_LIMITED"
			| "INVALID_UPSTREAM_RESPONSE" = "UPSTREAM_ERROR",
		status = 502,
	) {
		super(message);
		this.name = "GeoNamesUpstreamError";
		this.code = code;
		this.status = status;
	}
}

type GeoNamesSearchGeoname = {
	geonameId?: unknown;
	name?: unknown;
	countryCode?: unknown;
	countryName?: unknown;
	adminName1?: unknown;
	lat?: unknown;
	lng?: unknown;
};

type GeoNamesSearchResponse = {
	geonames?: unknown;
	status?: {
		message?: unknown;
		value?: unknown;
	};
};

type GeoNamesTimezoneResponse = {
	timezoneId?: unknown;
	status?: {
		message?: unknown;
		value?: unknown;
	};
};

type GeoNamesStatusPayload = {
	status?: {
		message?: unknown;
		value?: unknown;
	};
};

function createTimeoutSignal(): { signal: AbortSignal; clear: () => void } {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		controller.abort();
	}, GEONAMES_TIMEOUT_MS);

	return {
		signal: controller.signal,
		clear: () => clearTimeout(timeoutId),
	};
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function logGeoNamesDev(info: {
	endpoint: GeoNamesEndpointKind;
	attempt: number;
	upstreamStatus: number | null;
	durationMs: number;
	errorName?: string;
}): void {
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	console.info("[geonames]", info);
}

function isAbortError(error: unknown): boolean {
	return error instanceof Error && error.name === "AbortError";
}

function isNetworkFetchError(error: unknown): boolean {
	if (error instanceof TypeError) {
		return true;
	}

	if (!(error instanceof Error)) {
		return false;
	}

	return /fetch failed|network|ECONNRESET|ETIMEDOUT|ENOTFOUND|ECONNREFUSED/i.test(
		error.message,
	);
}

function toFiniteNumber(value: unknown): number | null {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) {
			return parsed;
		}
	}

	return null;
}

type GeoNamesAppStatus =
	| { kind: "none" }
	| { kind: "auth" }
	| { kind: "rate_limited" }
	| { kind: "permanent" };

function classifyGeoNamesAppStatus(
	payload: GeoNamesStatusPayload,
): GeoNamesAppStatus {
	if (!payload.status) {
		return { kind: "none" };
	}

	const value =
		typeof payload.status.value === "number" ? payload.status.value : null;
	const message =
		typeof payload.status.message === "string"
			? payload.status.message.toLowerCase()
			: "";

	if (
		value === 10 ||
		message.includes("user does not exist") ||
		message.includes("invalid user")
	) {
		return { kind: "auth" };
	}

	if (value === 19 || message.includes("limit")) {
		return { kind: "rate_limited" };
	}

	return { kind: "permanent" };
}

function assertNoGeoNamesStatusError(payload: GeoNamesStatusPayload): void {
	const classification = classifyGeoNamesAppStatus(payload);

	if (classification.kind === "none") {
		return;
	}

	if (classification.kind === "auth") {
		throw new ServerEnvError("GEONAMES_USERNAME tanımlanmamış.");
	}

	if (classification.kind === "rate_limited") {
		throw new GeoNamesUpstreamError(
			"Konum servisi geçici olarak meşgul.",
			"RATE_LIMITED",
			429,
		);
	}

	throw new GeoNamesUpstreamError(
		"Konum servisine ulaşılamadı.",
		"UPSTREAM_ERROR",
		502,
	);
}

async function fetchGeoNamesJson(
	url: URL,
	endpoint: GeoNamesEndpointKind,
): Promise<Record<string, unknown>> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= GEONAMES_MAX_ATTEMPTS; attempt++) {
		const startedAt = Date.now();
		const { signal, clear } = createTimeoutSignal();
		let upstreamStatus: number | null = null;

		try {
			const response = await fetch(url, {
				method: "GET",
				signal,
				headers: {
					Accept: "application/json",
				},
			});

			upstreamStatus = response.status;

			let payload: Record<string, unknown> | null = null;
			try {
				const raw: unknown = await response.json();
				if (typeof raw === "object" && raw !== null) {
					payload = raw as Record<string, unknown>;
				}
			} catch {
				payload = null;
			}

			if (payload) {
				const appStatus = classifyGeoNamesAppStatus(
					payload as GeoNamesStatusPayload,
				);

				if (appStatus.kind === "auth") {
					throw new ServerEnvError("GEONAMES_USERNAME tanımlanmamış.");
				}

				if (appStatus.kind === "rate_limited") {
					logGeoNamesDev({
						endpoint,
						attempt,
						upstreamStatus,
						durationMs: Date.now() - startedAt,
						errorName: "RATE_LIMITED",
					});

					if (attempt < GEONAMES_MAX_ATTEMPTS) {
						await delay(GEONAMES_RETRY_DELAY_MS);
						continue;
					}

					throw new GeoNamesUpstreamError(
						"Konum servisi geçici olarak meşgul.",
						"RATE_LIMITED",
						429,
					);
				}

				if (appStatus.kind === "permanent") {
					throw new GeoNamesUpstreamError(
						"Konum servisine ulaşılamadı.",
						"UPSTREAM_ERROR",
						502,
					);
				}
			}

			if (
				response.status === 429 ||
				(response.status >= 500 && response.status <= 599)
			) {
				logGeoNamesDev({
					endpoint,
					attempt,
					upstreamStatus,
					durationMs: Date.now() - startedAt,
					errorName: `HTTP_${response.status}`,
				});

				if (attempt < GEONAMES_MAX_ATTEMPTS) {
					await delay(GEONAMES_RETRY_DELAY_MS);
					continue;
				}

				if (response.status === 429) {
					throw new GeoNamesUpstreamError(
						"Konum servisi geçici olarak meşgul.",
						"RATE_LIMITED",
						429,
					);
				}

				throw new GeoNamesUpstreamError(
					"Konum servisine ulaşılamadı.",
					"UPSTREAM_ERROR",
					502,
				);
			}

			if (
				response.status === 400 ||
				response.status === 401 ||
				response.status === 403
			) {
				throw new GeoNamesUpstreamError(
					"Konum servisine ulaşılamadı.",
					"UPSTREAM_ERROR",
					502,
				);
			}

			if (!response.ok) {
				throw new GeoNamesUpstreamError(
					"Konum servisine ulaşılamadı.",
					"UPSTREAM_ERROR",
					502,
				);
			}

			if (!payload) {
				throw new GeoNamesUpstreamError(
					"Konum servisi geçersiz yanıt döndürdü.",
					"INVALID_UPSTREAM_RESPONSE",
					502,
				);
			}

			logGeoNamesDev({
				endpoint,
				attempt,
				upstreamStatus,
				durationMs: Date.now() - startedAt,
			});

			return payload;
		} catch (error) {
			lastError = error;

			if (error instanceof ServerEnvError) {
				throw error;
			}

			if (error instanceof GeoNamesUpstreamError) {
				throw error;
			}

			const errorName =
				error instanceof Error ? error.name : "UnknownError";
			const retryable = isAbortError(error) || isNetworkFetchError(error);

			logGeoNamesDev({
				endpoint,
				attempt,
				upstreamStatus,
				durationMs: Date.now() - startedAt,
				errorName,
			});

			if (retryable && attempt < GEONAMES_MAX_ATTEMPTS) {
				await delay(GEONAMES_RETRY_DELAY_MS);
				continue;
			}

			if (isAbortError(error)) {
				throw new GeoNamesUpstreamError(
					"Konum servisi yanıt vermedi.",
					"UPSTREAM_ERROR",
					502,
				);
			}

			throw new GeoNamesUpstreamError(
				"Konum servisine ulaşılamadı.",
				"UPSTREAM_ERROR",
				502,
			);
		} finally {
			clear();
		}
	}

	if (lastError instanceof GeoNamesUpstreamError) {
		throw lastError;
	}

	throw new GeoNamesUpstreamError(
		"Konum servisine ulaşılamadı.",
		"UPSTREAM_ERROR",
		502,
	);
}

function normalizeSearchResult(
	raw: GeoNamesSearchGeoname,
): LocationSearchResult | null {
	const geonameId = toFiniteNumber(raw.geonameId);
	const latitude = toFiniteNumber(raw.lat);
	const longitude = toFiniteNumber(raw.lng);
	const name = typeof raw.name === "string" ? raw.name.trim() : "";
	const countryCode =
		typeof raw.countryCode === "string"
			? raw.countryCode.trim().toUpperCase()
			: "";
	const countryName =
		typeof raw.countryName === "string" ? raw.countryName.trim() : "";
	const adminName1 =
		typeof raw.adminName1 === "string" && raw.adminName1.trim() !== ""
			? raw.adminName1.trim()
			: undefined;

	if (
		geonameId === null ||
		!Number.isInteger(geonameId) ||
		geonameId <= 0 ||
		latitude === null ||
		longitude === null ||
		latitude < -90 ||
		latitude > 90 ||
		longitude < -180 ||
		longitude > 180 ||
		name.length === 0 ||
		countryCode.length !== 2 ||
		countryName.length === 0
	) {
		return null;
	}

	return {
		geonameId,
		name,
		displayName: buildLocationDisplayName({ name, adminName1, countryName }),
		countryCode,
		countryName,
		adminName1,
		latitude,
		longitude,
	};
}

export async function searchLocations(
	query: string,
): Promise<LocationSearchResult[]> {
	const username = getGeoNamesUsername();
	const url = new URL("http://api.geonames.org/searchJSON");
	url.searchParams.set("name_startsWith", query);
	url.searchParams.set("featureClass", "P");
	url.searchParams.set("maxRows", "8");
	url.searchParams.set("lang", "tr");
	url.searchParams.set("orderby", "relevance");
	url.searchParams.set("style", "FULL");
	url.searchParams.set("username", username);

	const payload = (await fetchGeoNamesJson(
		url,
		"search",
	)) as GeoNamesSearchResponse;
	assertNoGeoNamesStatusError(payload);

	if (!Array.isArray(payload.geonames)) {
		throw new GeoNamesUpstreamError(
			"Konum servisi geçersiz yanıt döndürdü.",
			"INVALID_UPSTREAM_RESPONSE",
			502,
		);
	}

	const results: LocationSearchResult[] = [];

	for (const item of payload.geonames) {
		if (typeof item !== "object" || item === null) {
			continue;
		}

		const normalized = normalizeSearchResult(item as GeoNamesSearchGeoname);
		if (normalized) {
			results.push(normalized);
		}

		if (results.length >= 8) {
			break;
		}
	}

	return results;
}

export async function fetchTimezone(
	latitude: number,
	longitude: number,
): Promise<string> {
	const username = getGeoNamesUsername();
	const url = new URL("http://api.geonames.org/timezoneJSON");
	url.searchParams.set("lat", String(latitude));
	url.searchParams.set("lng", String(longitude));
	url.searchParams.set("username", username);

	const payload = (await fetchGeoNamesJson(
		url,
		"timezone",
	)) as GeoNamesTimezoneResponse;
	assertNoGeoNamesStatusError(payload);

	const timezone =
		typeof payload.timezoneId === "string" ? payload.timezoneId.trim() : "";

	if (!timezone || !isValidIanaTimezone(timezone)) {
		throw new GeoNamesUpstreamError(
			"Saat dilimi alınamadı.",
			"INVALID_UPSTREAM_RESPONSE",
			502,
		);
	}

	return timezone;
}
