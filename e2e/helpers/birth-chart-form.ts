import type { Page, Route } from "@playwright/test";
import { expect } from "@playwright/test";
import {
	ISTANBUL_TEST_BIRTH,
	KADIKOY_SEARCH,
	KADIKOY_TIMEZONE,
	PARIS_SEARCH,
	PARIS_TIMEZONE,
	type LocationSearchResult,
} from "../fixtures/locations";

type LocationMockOptions = {
	searchResults?: LocationSearchResult[];
	searchError?: { status: number; message: string };
	emptyQuery?: string;
};

export async function mockLocationApis(
	page: Page,
	options: LocationMockOptions = {},
) {
	const searchResults = options.searchResults ?? [KADIKOY_SEARCH, PARIS_SEARCH];
	const emptyQuery = options.emptyQuery ?? "__empty__";

	await page.unroute("**/api/locations/search**").catch(() => undefined);
	await page.unroute("**/api/locations/timezone**").catch(() => undefined);

	await page.route("**/api/locations/search**", async (route: Route) => {
		const url = new URL(route.request().url());
		const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();

		if (options.searchError) {
			await route.fulfill({
				status: options.searchError.status,
				contentType: "application/json",
				body: JSON.stringify({
					error: {
						code: "UPSTREAM_ERROR",
						message: options.searchError.message,
					},
				}),
			});
			return;
		}

		if (q.includes(emptyQuery.toLowerCase())) {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ results: [] }),
			});
			return;
		}

		const filtered = searchResults.filter((result) => {
			const haystack = `${result.name} ${result.displayName}`.toLowerCase();
			return haystack.includes(q);
		});

		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				results: filtered,
			}),
		});
	});

	await page.route("**/api/locations/timezone**", async (route: Route) => {
		const url = new URL(route.request().url());
		const latitude = Number(url.searchParams.get("latitude"));
		const longitude = Number(url.searchParams.get("longitude"));

		let timezone = KADIKOY_TIMEZONE;
		if (
			Math.abs(latitude - PARIS_SEARCH.latitude) < 0.01 &&
			Math.abs(longitude - PARIS_SEARCH.longitude) < 0.01
		) {
			timezone = PARIS_TIMEZONE;
		}

		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ timezone }),
		});
	});
}

export async function openBirthChartForm(page: Page) {
	await page.goto("/dogum-haritasi");
	await expect(
		page.getByRole("heading", { name: /Doğum haritanı oluştur/i }),
	).toBeVisible();
}

export async function selectDate(
	page: Page,
	options: { year: string; monthLabel: string; day: string },
) {
	const trigger = page.locator('[data-mobile-target="date-trigger"]');
	const sheet = page.getByTestId("date-sheet");
	const calendar = page.locator(".astrozel-day-picker");

	if (!(await calendar.isVisible()) && !(await sheet.isVisible())) {
		try {
			await trigger.tap({ timeout: 3_000 });
		} catch {
			await trigger.click();
		}
	}

	if (await sheet.isVisible()) {
		await sheet.getByRole("button", { name: "Yıl seç" }).click();
		await sheet
			.getByRole("option", { name: options.year, exact: true })
			.click();

		await sheet.getByRole("button", { name: "Ay seç" }).click();
		await sheet
			.getByRole("button", {
				name: new RegExp(`^${options.monthLabel}$`, "i"),
			})
			.click();

		await expect(calendar).toBeVisible();
		const dayNum = Number(options.day);
		await calendar
			.getByRole("gridcell")
			.filter({ hasText: new RegExp(`^${dayNum}$`) })
			.locator("button")
			.first()
			.click();

		await expect(trigger).toContainText(options.year);
		return;
	}

	await expect(calendar).toBeVisible();

	const yearCombo = calendar.getByRole("combobox", { name: /Yıl/i });
	const monthCombo = calendar.getByRole("combobox", { name: /Ay/i });

	await yearCombo.click();
	await page.getByRole("option", { name: options.year, exact: true }).click();

	await monthCombo.click();
	await page
		.getByRole("option", {
			name: new RegExp(`^${options.monthLabel}$`, "i"),
		})
		.click();

	const day = options.day.padStart(2, "0");
	const monthNames = [
		"ocak",
		"şubat",
		"mart",
		"nisan",
		"mayıs",
		"haziran",
		"temmuz",
		"ağustos",
		"eylül",
		"ekim",
		"kasım",
		"aralık",
	];
	const monthIndex = monthNames.findIndex((name) =>
		name.includes(options.monthLabel.toLocaleLowerCase("tr-TR")),
	);
	expect(monthIndex).toBeGreaterThanOrEqual(0);
	const monthNumber = String(monthIndex + 1).padStart(2, "0");
	const dataDay = `${options.year}-${monthNumber}-${day}`;

	const dayButton = calendar.locator(`button[data-day="${dataDay}"]`);
	if ((await dayButton.count()) > 0) {
		await dayButton.click();
	} else {
		await calendar
			.getByRole("gridcell")
			.filter({ hasText: new RegExp(`^${Number(options.day)}$`) })
			.locator("button")
			.first()
			.click();
	}

	await expect(trigger).toContainText(options.year);
}

export async function selectTime(page: Page, hour: string, minute: string) {
	const trigger = page.getByRole("button", { name: /Doğum saati/i });
	try {
		await trigger.tap({ timeout: 3_000 });
	} catch {
		await trigger.click();
	}

	const hourList = page.getByRole("listbox", { name: "Saat" });
	const minuteList = page.getByRole("listbox", { name: "Dakika" });
	await expect(hourList).toBeVisible();
	await expect(minuteList).toBeVisible();

	const hourOption = hourList.getByRole("option", { name: hour, exact: true });
	const minuteOption = minuteList.getByRole("option", {
		name: minute,
		exact: true,
	});
	try {
		await hourOption.tap({ timeout: 3_000 });
	} catch {
		await hourOption.click();
	}
	try {
		await minuteOption.tap({ timeout: 3_000 });
	} catch {
		await minuteOption.click();
	}

	const confirm = page.getByRole("button", { name: "Tamam" });
	await expect(confirm).toBeVisible();
	await confirm.scrollIntoViewIfNeeded();
	try {
		await confirm.tap({ timeout: 3_000 });
	} catch {
		try {
			await confirm.click({ force: true, timeout: 3_000 });
		} catch {
			await confirm.evaluate((el: HTMLElement) => el.click());
		}
	}

	await expect(trigger).toContainText(`${hour}:${minute}`);
}

export async function searchAndSelectLocation(
	page: Page,
	query: string,
	optionName: string | RegExp,
) {
	const mobileTrigger = page.getByRole("button", { name: "Doğum Yeri" });
	const desktopInput = page.getByRole("combobox", { name: "Doğum Yeri" });

	if ((await mobileTrigger.count()) > 0 && (await mobileTrigger.isVisible())) {
		try {
			await mobileTrigger.tap({ timeout: 3_000 });
		} catch {
			await mobileTrigger.click();
		}
		const sheet = page.getByTestId("location-sheet");
		await expect(sheet).toBeVisible();
		const search = sheet.locator('[data-mobile-target="location-search-input"]');
		await search.fill(query);
		const listbox = sheet.getByRole("listbox", { name: "Konum sonuçları" });
		await expect(listbox).toBeVisible();
		const option = listbox.getByRole("option", { name: optionName }).first();
		try {
			await option.tap({ timeout: 3_000 });
		} catch {
			await option.click();
		}
		await expect(page.getByText(/Konum seçildi/i)).toBeVisible();
		return;
	}

	await desktopInput.fill(query);
	const listbox = page.getByRole("listbox", { name: "Konum sonuçları" });
	await expect(listbox).toBeVisible();
	await listbox.getByRole("option", { name: optionName }).first().click();
	await expect(page.getByText(/Konum seçildi/i)).toBeVisible();
}

export async function fillCompleteBirthChartForm(page: Page) {
	await page.getByLabel(/^İsim/).fill(ISTANBUL_TEST_BIRTH.name);
	await selectDate(page, {
		year: "1995",
		monthLabel: "Mayıs",
		day: "14",
	});
	await selectTime(page, "13", "30");
	await searchAndSelectLocation(
		page,
		"Kadıköy",
		/Kadıköy/i,
	);
	await expect(page.getByText(/Europe\/Istanbul/)).toBeVisible();
}

export async function submitBirthChartForm(page: Page) {
	await page.getByRole("button", { name: /Doğum Haritamı Hazırla/i }).click();
}

export const DRAFT_STORAGE_KEY = "astrozel.birth-chart-draft.v2";

export async function seedValidDraft(page: Page) {
	await page.addInitScript(
		({ key, draft }) => {
			window.sessionStorage.setItem(key, JSON.stringify(draft));
		},
		{
			key: DRAFT_STORAGE_KEY,
			draft: {
				version: 2,
				createdAt: new Date().toISOString(),
				name: ISTANBUL_TEST_BIRTH.name,
				birthDate: ISTANBUL_TEST_BIRTH.birthDate,
				birthTime: ISTANBUL_TEST_BIRTH.birthTime,
				birthPlace: ISTANBUL_TEST_BIRTH.location.displayName,
				location: ISTANBUL_TEST_BIRTH.location,
			},
		},
	);
}

export async function clearDraftStorage(page: Page) {
	await page.evaluate((key) => {
		window.sessionStorage.removeItem(key);
	}, DRAFT_STORAGE_KEY);
}
