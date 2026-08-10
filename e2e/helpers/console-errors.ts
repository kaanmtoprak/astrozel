import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

const ALLOWED_CONSOLE_PATTERNS: RegExp[] = [
	/WebSocket connection to .*\/_next\/webpack-hmr/i,
	/\[HMR\]/i,
	/Failed to load resource: the server responded with a status of 50[02]/i,
	/scroll-behavior: smooth/i,
];

export function attachConsoleErrorCollector(page: Page) {
	const errors: string[] = [];

	page.on("pageerror", (error) => {
		errors.push(`pageerror: ${error.message}`);
	});

	page.on("console", (message) => {
		if (message.type() !== "error") {
			return;
		}

		const text = message.text();
		const allowed = ALLOWED_CONSOLE_PATTERNS.some((pattern) =>
			pattern.test(text),
		);
		if (!allowed) {
			errors.push(`console.error: ${text}`);
		}
	});

	return {
		assertNoUnexpectedErrors() {
			expect(errors, errors.join("\n")).toEqual([]);
		},
		getErrors() {
			return [...errors];
		},
	};
}
