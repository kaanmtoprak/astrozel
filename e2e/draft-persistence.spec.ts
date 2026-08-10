import { expect, test } from "@playwright/test";
import {
	clearDraftStorage,
	DRAFT_STORAGE_KEY,
	fillCompleteBirthChartForm,
	mockLocationApis,
	openBirthChartForm,
	submitBirthChartForm,
} from "./helpers/birth-chart-form";
import { attachConsoleErrorCollector } from "./helpers/console-errors";

test.describe("Draft persistence", () => {
	test.beforeEach(async ({ page }) => {
		await mockLocationApis(page);
	});

	test.afterEach(async ({ page }) => {
		await clearDraftStorage(page).catch(() => undefined);
	});

	test("submit sonrası reload ve düzenleme draft’ı korur", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await openBirthChartForm(page);
		await fillCompleteBirthChartForm(page);
		await submitBirthChartForm(page);

		await expect(page).toHaveURL(/\/dogum-haritasi\/sonuc/);
		await expect(
			page.getByRole("heading", { name: /Doğum haritan hazır/i }),
		).toBeVisible({ timeout: 30_000 });

		await page.reload();
		await expect(
			page.getByRole("heading", { name: /Doğum haritan hazır/i }),
		).toBeVisible({ timeout: 30_000 });
		await expect(page.getByRole("img", { name: /Doğum haritası çemberi/i })).toBeVisible();

		await page.getByRole("link", { name: "Bilgileri Düzenle" }).first().click();
		await expect(page).toHaveURL(/\/dogum-haritasi\/?$/);

		await expect(
			page.getByRole("button", { name: /Doğum tarihi: 14 Mayıs 1995/i }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /Doğum saati: 13:30/i }),
		).toBeVisible();
		await expect(
			page.getByRole("combobox", { name: "Doğum Yeri" }),
		).toHaveValue(/Kadıköy/);
		await expect(page.getByText(/Europe\/Istanbul/)).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("bozuk draft JSON güvenli boş durum gösterir", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.addInitScript((key) => {
			window.sessionStorage.setItem(key, "{not-json");
		}, DRAFT_STORAGE_KEY);

		await page.goto("/dogum-haritasi/sonuc");
		await expect(
			page.getByRole("heading", { name: /Doğum bilgisi bulunamadı/i }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: /Doğum Bilgilerini Gir/i }),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});
});
