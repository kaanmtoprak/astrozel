"use client";

import { useEffect, useState } from "react";

/**
 * Hydration-safe media query.
 * SSR and the hydration render always use `false` (or `initialValue`) so the
 * server HTML and the first client tree match. The real matchMedia value is
 * applied only after mount.
 */
export function useMediaQuery(
	query: string,
	initialValue = false,
): boolean {
	const [matches, setMatches] = useState(initialValue);

	useEffect(() => {
		const media = window.matchMedia(query);
		const update = () => {
			setMatches(media.matches);
		};
		update();
		media.addEventListener("change", update);
		return () => media.removeEventListener("change", update);
	}, [query]);

	return matches;
}

/** Shared mobile breakpoint for overlay mode (max-width: 767px). */
export function useIsMobileOverlay(): boolean {
	return useMediaQuery("(max-width: 767px)", false);
}
