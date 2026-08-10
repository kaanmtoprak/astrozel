"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
	ApiErrorBody,
	BirthLocation,
	LocationSearchResponse,
	LocationSearchResult,
	LocationTimezoneResponse,
} from "@/features/location/types/location";

export type LocationSearchStatus =
	| "idle"
	| "typing"
	| "searching"
	| "results"
	| "empty"
	| "resolving-timezone"
	| "error";

export type UseLocationSearchOptions = {
	selectedLocation: BirthLocation | null;
	onLocationChange: (location: BirthLocation | null) => void;
	onQueryChange: (value: string) => void;
	onBusyChange?: (busy: boolean) => void;
	query: string;
};

async function readApiError(response: Response): Promise<string> {
	try {
		const payload = (await response.json()) as ApiErrorBody;
		if (payload?.error?.message) {
			return payload.error.message;
		}
	} catch {
		// ignore
	}
	return "Konum servisine ulaşılamadı. Tekrar deneyebilirsin.";
}

/**
 * Shared location search + timezone resolution for desktop combobox and mobile sheet.
 */
export function useLocationSearch({
	selectedLocation,
	onLocationChange,
	onQueryChange,
	onBusyChange,
	query,
}: UseLocationSearchOptions) {
	const [status, setStatus] = useState<LocationSearchStatus>("idle");
	const [results, setResults] = useState<LocationSearchResult[]>([]);
	const [activeIndex, setActiveIndex] = useState(-1);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isResolvingTimezone, setIsResolvingTimezone] = useState(false);

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const searchAbortRef = useRef<AbortController | null>(null);
	const timezoneAbortRef = useRef<AbortController | null>(null);
	const requestIdRef = useRef(0);

	const clearSearchRequest = useCallback(() => {
		searchAbortRef.current?.abort();
		searchAbortRef.current = null;
	}, []);

	const clearTimezoneRequest = useCallback(() => {
		timezoneAbortRef.current?.abort();
		timezoneAbortRef.current = null;
	}, []);

	useEffect(() => {
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
			clearSearchRequest();
			clearTimezoneRequest();
		};
	}, [clearSearchRequest, clearTimezoneRequest]);

	const runSearch = useCallback(
		async (nextQuery: string) => {
			const trimmed = nextQuery.trim();
			if (trimmed.length < 2) {
				clearSearchRequest();
				setResults([]);
				setStatus(trimmed.length === 0 ? "idle" : "typing");
				setActiveIndex(-1);
				setErrorMessage(null);
				return;
			}

			clearSearchRequest();
			const controller = new AbortController();
			searchAbortRef.current = controller;
			const requestId = requestIdRef.current + 1;
			requestIdRef.current = requestId;

			setStatus("searching");
			setErrorMessage(null);

			try {
				const url = new URL("/api/locations/search", window.location.origin);
				url.searchParams.set("q", trimmed);

				const response = await fetch(url, {
					method: "GET",
					signal: controller.signal,
					headers: { Accept: "application/json" },
				});

				if (requestId !== requestIdRef.current) {
					return;
				}

				if (!response.ok) {
					const message = await readApiError(response);
					setResults([]);
					setStatus("error");
					setErrorMessage(message);
					setActiveIndex(-1);
					return;
				}

				const payload = (await response.json()) as LocationSearchResponse;
				const nextResults = Array.isArray(payload.results)
					? payload.results.slice(0, 8)
					: [];

				setResults(nextResults);
				setStatus(nextResults.length > 0 ? "results" : "empty");
				setActiveIndex(nextResults.length > 0 ? 0 : -1);
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") {
					return;
				}
				if (requestId !== requestIdRef.current) {
					return;
				}
				setResults([]);
				setStatus("error");
				setErrorMessage("Konum servisine ulaşılamadı. Tekrar deneyebilirsin.");
				setActiveIndex(-1);
			}
		},
		[clearSearchRequest],
	);

	const handleQueryChange = useCallback(
		(nextValue: string) => {
			onQueryChange(nextValue);

			if (selectedLocation) {
				onLocationChange(null);
			}

			clearTimezoneRequest();
			setIsResolvingTimezone(false);
			onBusyChange?.(false);

			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}

			const trimmed = nextValue.trim();
			if (trimmed.length < 2) {
				clearSearchRequest();
				setResults([]);
				setStatus(trimmed.length === 0 ? "idle" : "typing");
				setActiveIndex(-1);
				setErrorMessage(null);
				return;
			}

			setStatus("typing");
			debounceRef.current = setTimeout(() => {
				void runSearch(nextValue);
			}, 350);
		},
		[
			clearSearchRequest,
			clearTimezoneRequest,
			onBusyChange,
			onLocationChange,
			onQueryChange,
			runSearch,
			selectedLocation,
		],
	);

	const selectResult = useCallback(
		async (result: LocationSearchResult) => {
			clearSearchRequest();
			clearTimezoneRequest();
			setActiveIndex(-1);
			setResults([]);
			setErrorMessage(null);
			setStatus("resolving-timezone");
			setIsResolvingTimezone(true);
			onBusyChange?.(true);
			onQueryChange(result.displayName);

			const controller = new AbortController();
			timezoneAbortRef.current = controller;

			try {
				const url = new URL("/api/locations/timezone", window.location.origin);
				url.searchParams.set("latitude", String(result.latitude));
				url.searchParams.set("longitude", String(result.longitude));

				const response = await fetch(url, {
					method: "GET",
					signal: controller.signal,
					headers: { Accept: "application/json" },
				});

				if (!response.ok) {
					const message = await readApiError(response);
					onLocationChange(null);
					setStatus("error");
					setErrorMessage(message);
					setIsResolvingTimezone(false);
					onBusyChange?.(false);
					return false;
				}

				const payload = (await response.json()) as LocationTimezoneResponse;
				if (!payload.timezone || typeof payload.timezone !== "string") {
					onLocationChange(null);
					setStatus("error");
					setErrorMessage("Saat dilimi alınamadı. Tekrar deneyebilirsin.");
					setIsResolvingTimezone(false);
					onBusyChange?.(false);
					return false;
				}

				const location: BirthLocation = {
					...result,
					timezone: payload.timezone,
				};

				onLocationChange(location);
				setStatus("idle");
				setIsResolvingTimezone(false);
				onBusyChange?.(false);
				return true;
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") {
					return false;
				}
				onLocationChange(null);
				setStatus("error");
				setErrorMessage("Konum servisine ulaşılamadı. Tekrar deneyebilirsin.");
				setIsResolvingTimezone(false);
				onBusyChange?.(false);
				return false;
			}
		},
		[
			clearSearchRequest,
			clearTimezoneRequest,
			onBusyChange,
			onLocationChange,
			onQueryChange,
		],
	);

	const statusMessage = (() => {
		if (isResolvingTimezone || status === "resolving-timezone") {
			return "Saat dilimi belirleniyor…";
		}
		if (status === "typing" && query.trim().length === 1) {
			return "Aramak için en az 2 karakter gir.";
		}
		if (status === "searching") {
			return "Konumlar aranıyor…";
		}
		if (status === "empty") {
			return "Eşleşen konum bulunamadı.";
		}
		if (status === "error" && errorMessage) {
			return errorMessage;
		}
		return null;
	})();

	return {
		status,
		results,
		activeIndex,
		setActiveIndex,
		errorMessage,
		isResolvingTimezone,
		statusMessage,
		handleQueryChange,
		selectResult,
		runSearch,
	};
}
