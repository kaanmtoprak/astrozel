import { expect, test } from "@playwright/test";
import {
	mockLocationApis,
	selectDate,
	selectTime,
	searchAndSelectLocation,
} from "./helpers/birth-chart-form";
import { attachConsoleErrorCollector } from "./helpers/console-errors";
import {
	assertNoHorizontalOverflow,
	assertPointerTargetIsReachable,
} from "./helpers/pointer-target";

test.describe("Mobil overlay akışı", () => {
	test.beforeEach(async ({ page }) => {
		await mockLocationApis(page);
	});

	test("hamburger sheet tap ve Escape", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.goto("/");

		const hamburger = page.locator('[data-mobile-target="hamburger"]');
		await expect(hamburger).toBeVisible();
		await assertPointerTargetIsReachable(page, hamburger, "Hamburger");

		await hamburger.tap();
		const sheet = page.getByTestId("nav-sheet");
		await expect(sheet).toBeVisible();
		await expect(hamburger).toHaveAttribute("aria-expanded", "true");
		const menu = page.getByRole("navigation", { name: "Mobil menü" });
		await expect(menu.getByRole("link", { name: "Harita Oluştur" })).toBeVisible();

		await menu.getByRole("link", { name: "Harita Oluştur" }).tap();
		await expect(sheet).toBeHidden();

		await hamburger.tap();
		await expect(sheet).toBeVisible();
		await page.getByTestId("nav-sheet").locator('[aria-label="Kapat"]').tap();
		await expect(sheet).toBeHidden();

		await hamburger.tap();
		await expect(sheet).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(sheet).toBeHidden();
		await expect(hamburger).toHaveAttribute("aria-expanded", "false");

		consoleGuard.assertNoUnexpectedErrors();
	});

	test("DatePicker mobil sheet ile tarih seçilir", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.goto("/");
		await page.locator("#dogum-bilgileri").scrollIntoViewIfNeeded();

		const trigger = page.locator('[data-mobile-target="date-trigger"]');
		await assertPointerTargetIsReachable(page, trigger, "DatePicker trigger");
		await selectDate(page, {
			year: "1995",
			monthLabel: "Mayıs",
			day: "14",
		});
		await expect(trigger).toContainText("1995");
		await assertNoHorizontalOverflow(page);
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("TimePicker mobil sheet ile 13:30 seçilir", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.goto("/");
		await page.locator("#dogum-bilgileri").scrollIntoViewIfNeeded();

		const trigger = page.getByRole("button", { name: /Doğum saati/i });
		await assertPointerTargetIsReachable(page, trigger, "TimePicker trigger");
		await selectTime(page, "13", "30");
		await expect(
			page.getByRole("button", { name: /Doğum saati: 13:30/i }),
		).toBeVisible();
		await assertNoHorizontalOverflow(page);
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("Location mobil sheet ile Kadıköy seçilir", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.goto("/");
		await page.locator("#dogum-bilgileri").scrollIntoViewIfNeeded();

		const trigger = page.getByRole("button", { name: "Doğum Yeri" });
		await assertPointerTargetIsReachable(page, trigger, "Location trigger");
		await searchAndSelectLocation(page, "Kadıköy", /Kadıköy/i);
		await expect(trigger).toContainText(/Kadıköy/i);
		await expect(page.getByText(/Europe\/Istanbul/)).toBeVisible();
		await assertNoHorizontalOverflow(page);
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("tek overlay ve yatay overflow durumları", async ({ page }) => {
		await page.goto("/");
		await assertNoHorizontalOverflow(page);

		const hamburger = page.locator('[data-mobile-target="hamburger"]');
		await hamburger.tap();
		await expect(page.getByTestId("nav-sheet")).toBeVisible();
		await expect(page.getByTestId("date-sheet")).toHaveCount(0);
		await assertNoHorizontalOverflow(page);
		await page.keyboard.press("Escape");

		await page.locator("#dogum-bilgileri").scrollIntoViewIfNeeded();
		await page.locator('[data-mobile-target="date-trigger"]').tap();
		await expect(page.getByTestId("date-sheet")).toBeVisible();
		await expect(page.getByTestId("time-sheet")).toHaveCount(0);
		await assertNoHorizontalOverflow(page);
		await page.keyboard.press("Escape");

		await page.locator('[data-mobile-target="time-trigger"]').tap();
		await expect(page.getByTestId("time-sheet")).toBeVisible();
		await assertNoHorizontalOverflow(page);
		await page.keyboard.press("Escape");

		await page.locator('[data-mobile-target="location-trigger"]').tap();
		await expect(page.getByTestId("location-sheet")).toBeVisible();
		await assertNoHorizontalOverflow(page);
	});
});
