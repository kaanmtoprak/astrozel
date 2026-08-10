import { expect, test } from "@playwright/test";
import {
	mockLocationApis,
	openBirthChartForm,
	seedValidDraft,
	selectTime,
	searchAndSelectLocation,
} from "./helpers/birth-chart-form";
import { attachConsoleErrorCollector } from "./helpers/console-errors";

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
	const metrics = await page.evaluate(() => ({
		scrollWidth: document.documentElement.scrollWidth,
		innerWidth: window.innerWidth,
	}));
	expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);
}

test.describe("Mobil layout 375px", () => {
	test.use({ viewport: { width: 375, height: 812 } });

	test.beforeEach(async ({ page }) => {
		await mockLocationApis(page);
	});

	test("ana sayfa taşmaz", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.goto("/");
		await expect(page.getByRole("banner").or(page.locator("header")).first()).toBeVisible();
		await expect(
			page.getByRole("heading", { name: /Doğum bilgilerini gir/i }),
		).toBeVisible();
		await assertNoHorizontalOverflow(page);
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("form sayfası picker’lar ve combobox taşmaz", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await openBirthChartForm(page);
		await assertNoHorizontalOverflow(page);

		const dateTrigger = page.getByRole("button", { name: /Doğum tarih/i });
		await dateTrigger.click();
		const calendar = page.locator(".astrozel-day-picker");
		await expect(calendar).toBeVisible();
		const calendarBox = await calendar.boundingBox();
		expect(calendarBox).toBeTruthy();
		expect(calendarBox!.x).toBeGreaterThanOrEqual(-8);
		expect(calendarBox!.x + calendarBox!.width).toBeLessThanOrEqual(390);
		await page.keyboard.press("Escape");

		await selectTime(page, "08", "05");
		await page.getByRole("button", { name: /Doğum saati/i }).click();
		const timePopover = page.getByRole("listbox", { name: "Dakika" });
		await expect(timePopover).toBeVisible();
		const listBox = await timePopover.boundingBox();
		expect(listBox).toBeTruthy();
		expect(listBox!.x + listBox!.width).toBeLessThanOrEqual(390);
		await page.keyboard.press("Escape");

		await searchAndSelectLocation(page, "Kadıköy", /Kadıköy/i);
		await assertNoHorizontalOverflow(page);

		await expect(
			page.getByRole("button", { name: /Doğum Haritamı Hazırla/i }),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("sonuç sayfası SVG ve tablolar taşmaz", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await seedValidDraft(page);
		await page.goto("/dogum-haritasi/sonuc");
		await expect(
			page.getByRole("heading", { name: /Doğum haritan hazır/i }),
		).toBeVisible({ timeout: 30_000 });

		const chart = page.getByRole("img", { name: /Doğum haritası çemberi/i });
		await expect(chart).toBeVisible();
		const chartBox = await chart.boundingBox();
		expect(chartBox).toBeTruthy();
		expect(chartBox!.width).toBeLessThanOrEqual(375);
		expect(chartBox!.x + chartBox!.width).toBeLessThanOrEqual(376);

		await assertNoHorizontalOverflow(page);
		await expect(
			page.getByRole("link", { name: "Bilgileri Düzenle" }).first(),
		).toBeVisible();

		const technical = page.getByTestId("technical-details");
		await expect(technical).toBeVisible();
		await expect(technical.locator("details[open]")).toHaveCount(0);
		await technical.getByText("Gezegen konumları", { exact: true }).click();
		await expect(
			page.getByRole("table").filter({ hasText: "Gezegen" }),
		).toBeVisible();
		await assertNoHorizontalOverflow(page);

		const interpretation = page.getByTestId("interpretation-section");
		await expect(interpretation).toBeVisible();
		const interpretationBox = await interpretation.boundingBox();
		expect(interpretationBox).toBeTruthy();
		expect(interpretationBox!.x + interpretationBox!.width).toBeLessThanOrEqual(
			376,
		);

		consoleGuard.assertNoUnexpectedErrors();
	});
});

test.describe("Mobil layout 320px", () => {
	test.use({ viewport: { width: 320, height: 568 } });

	test("ana sayfa yatay taşmaz", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await mockLocationApis(page);
		await page.goto("/");
		await assertNoHorizontalOverflow(page);
		await expect(
			page.getByRole("button", { name: /Doğum Haritamı Hazırla/i }),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});
});
