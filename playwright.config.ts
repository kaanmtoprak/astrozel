import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: [["list"], ["html", { open: "never" }]],
	timeout: 60_000,
	expect: {
		timeout: 10_000,
	},
	use: {
		baseURL: "http://127.0.0.1:3100",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
		locale: "tr-TR",
	},
	projects: [
		{
			name: "chromium",
			testIgnore: /mobile-overlay-flow\.spec\.ts/,
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "mobile-chrome",
			testMatch: /mobile-overlay-flow\.spec\.ts|hydration\.spec\.ts/,
			use: {
				...devices["Pixel 7"],
			},
		},
		{
			name: "mobile-webkit",
			testMatch: /mobile-overlay-flow\.spec\.ts|hydration\.spec\.ts/,
			use: {
				...devices["iPhone 13"],
			},
		},
	],
	webServer: {
		command: "npx next dev -H 127.0.0.1 -p 3100",
		url: "http://127.0.0.1:3100",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
