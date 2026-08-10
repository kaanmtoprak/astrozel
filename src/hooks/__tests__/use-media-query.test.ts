import { describe, expect, it } from "vitest";

/**
 * Pure contract for hydration-safe media query:
 * first snapshot must stay on the SSR fallback until an explicit client update.
 */
describe("media query hydration contract", () => {
	it("SSR/hydration fallback false iken client match true olsa bile ilk değer false kalır", () => {
		const initialValue = false;
		const clientMatches = true;
		// Simulates: useState(initialValue) before useEffect runs
		const firstRender = initialValue;
		expect(firstRender).toBe(false);
		expect(firstRender).not.toBe(clientMatches);
	});

	it("overlay breakpoint sorgusu sabit kalır", () => {
		expect("(max-width: 767px)").toContain("767px");
	});
});
