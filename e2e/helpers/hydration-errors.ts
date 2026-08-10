import type { ConsoleMessage, Page } from "@playwright/test";
import { expect } from "@playwright/test";

const HYDRATION_PATTERNS: RegExp[] = [
	/Hydration failed/i,
	/hydration mismatch/i,
	/server rendered HTML/i,
	/didn't match the client/i,
	/did not match/i,
	/tree hydrated but/i,
	/Text content does not match/i,
	/invalid HTML nesting/i,
	/A tree hydrated but some attributes/i,
];

const ALLOWED_CONSOLE_PATTERNS: RegExp[] = [
	/WebSocket connection to .*\/_next\/webpack-hmr/i,
	/\[HMR\]/i,
	/Failed to load resource: the server responded with a status of 50[02]/i,
	/scroll-behavior: smooth/i,
];

function isHydrationMessage(text: string): boolean {
	return HYDRATION_PATTERNS.some((pattern) => pattern.test(text));
}

function isAllowedConsoleError(text: string): boolean {
	return ALLOWED_CONSOLE_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Chrome iOS may inject __gcruniqueid before React hydration.
 * Only ignore hydration noise when that attribute is the sole added client attribute.
 */
function isChromeIosGcrHydrationNoise(text: string): boolean {
	if (!isHydrationMessage(text) || !/__gcruniqueid/i.test(text)) {
		return false;
	}

	const addedAttrs = [
		...text.matchAll(/^\s*\+\s*([A-Za-z_:][\w:.-]*)\s*=/gm),
		...text.matchAll(/\+\s*([A-Za-z_:][\w:.-]*)="/g),
	].map((match) => match[1]?.toLowerCase());

	const uniqueAttrs = [...new Set(addedAttrs.filter(Boolean))];
	if (uniqueAttrs.length === 0) {
		return true;
	}

	return uniqueAttrs.every((attr) => attr === "__gcruniqueid");
}

/**
 * Collects pageerror + console.error and fails on hydration / nesting mismatches.
 * Shared with general unexpected-error assertions for FAZ B.1.
 */
export function attachHydrationErrorCollector(page: Page) {
	const hydrationErrors: string[] = [];
	const otherErrors: string[] = [];

	const ingest = (source: string, text: string) => {
		const entry = `${source}: ${text}`;
		if (isChromeIosGcrHydrationNoise(text)) {
			return;
		}
		if (isHydrationMessage(text)) {
			hydrationErrors.push(entry);
			return;
		}
		if (source === "console.error" && isAllowedConsoleError(text)) {
			return;
		}
		otherErrors.push(entry);
	};

	page.on("pageerror", (error) => {
		ingest("pageerror", error.message);
	});

	page.on("console", (message: ConsoleMessage) => {
		if (message.type() !== "error") {
			return;
		}
		ingest("console.error", message.text());
	});

	return {
		assertNoHydrationErrors() {
			expect(hydrationErrors, hydrationErrors.join("\n")).toEqual([]);
		},
		assertNoUnexpectedErrors() {
			expect(
				[...hydrationErrors, ...otherErrors],
				[...hydrationErrors, ...otherErrors].join("\n"),
			).toEqual([]);
		},
		getHydrationErrors() {
			return [...hydrationErrors];
		},
		getErrors() {
			return [...hydrationErrors, ...otherErrors];
		},
	};
}
