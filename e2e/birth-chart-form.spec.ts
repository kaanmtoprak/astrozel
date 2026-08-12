import { expect, test } from "@playwright/test";
import {
	mockLocationApis,
	openBirthChartForm,
	selectDate,
	selectTime,
	submitBirthChartForm,
} from "./helpers/birth-chart-form";
import { attachConsoleErrorCollector } from "./helpers/console-errors";

test.describe("Doğum haritası formu", () => {
	test.beforeEach(async ({ page }) => {
		await mockLocationApis(page);
	});

	test("boş form validasyon hatalarını gösterir ve yönlendirmez", async ({
		page,
	}) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await openBirthChartForm(page);

		await expect(page.locator('input[type="date"]')).toHaveCount(0);
		await expect(page.locator('input[type="time"]')).toHaveCount(0);

		await submitBirthChartForm(page);

		await expect(page.getByRole("alert").filter({ hasText: /Doğum tarihini gir/i })).toBeVisible();
		await expect(page.getByRole("alert").filter({ hasText: /Doğum saatini gir/i })).toBeVisible();
		await expect(
			page.getByRole("alert").filter({
				hasText: /Doğum yerini arama sonuçlarından seç|Doğum yerini gir/i,
			}),
		).toBeVisible();
		await expect(page).toHaveURL(/\/dogum-haritasi\/?$/);
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("DatePicker ile tarih seçilir ve native date input yoktur", async ({
		page,
	}) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await openBirthChartForm(page);

		const trigger = page.locator('[data-mobile-target="date-trigger"]');
		await trigger.click();

		const calendar = page.locator(".astrozel-day-picker");
		await expect(calendar).toBeVisible();
		await expect(calendar.getByRole("combobox")).toHaveCount(2);

		await selectDate(page, { year: "1995", monthLabel: "Mayıs", day: "14" });
		await expect(
			page.getByRole("button", { name: /Doğum tarihi: 14 Mayıs 1995/i }),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("TimePicker 08:05 değerini seçer", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await openBirthChartForm(page);

		await selectTime(page, "08", "05");
		await expect(
			page.getByRole("button", { name: /Doğum saati: 08:05/i }),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("DatePicker sınırları ve leap day", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await openBirthChartForm(page);

		const trigger = page.locator('[data-mobile-target="date-trigger"]');
		await trigger.click();
		const calendar = page.locator(".astrozel-day-picker");
		await expect(calendar).toBeVisible();

		const yearCombo = calendar.getByRole("combobox", { name: /Yıl/i });
		await yearCombo.click();
		await expect(page.getByRole("option", { name: "1899", exact: true })).toHaveCount(0);
		await expect(page.getByRole("option", { name: "1900", exact: true })).toBeVisible();
		await page.keyboard.press("Escape");

		await page.keyboard.press("Escape");
		await expect(calendar).toBeHidden();

		await selectDate(page, { year: "2024", monthLabel: "Şubat", day: "29" });
		await expect(
			page.getByRole("button", { name: /Doğum tarihi: 29 Şubat 2024/i }),
		).toBeVisible();

		await trigger.click();
		await page.getByRole("button", { name: "Temizle" }).click();
		await expect(
			page.getByRole("button", { name: "Doğum tarihini seç" }),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("TimePicker saat/dakika aralıkları ve kısmi seçim", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await openBirthChartForm(page);

		const trigger = page.getByRole("button", { name: /Doğum saati/i });
		await trigger.click();

		const hourList = page.getByRole("listbox", { name: "Saat" });
		const minuteList = page.getByRole("listbox", { name: "Dakika" });
		await expect(hourList.getByRole("option", { name: "00", exact: true })).toBeVisible();
		await expect(hourList.getByRole("option", { name: "12", exact: true })).toBeVisible();
		await expect(hourList.getByRole("option", { name: "23", exact: true })).toBeVisible();
		await expect(minuteList.getByRole("option", { name: "00", exact: true })).toBeVisible();
		await expect(minuteList.getByRole("option", { name: "30", exact: true })).toBeVisible();
		await expect(minuteList.getByRole("option", { name: "59", exact: true })).toBeVisible();

		await hourList.getByRole("option", { name: "23", exact: true }).click();
		await expect(page.getByRole("button", { name: "Tamam" })).toBeDisabled();
		await page.keyboard.press("Escape");

		await selectDate(page, { year: "1995", monthLabel: "Mayıs", day: "14" });
		const input = page.getByRole("combobox", { name: "Doğum Yeri" });
		await input.fill("Kadıköy");
		await expect(page.getByRole("listbox")).toBeVisible();
		await page.keyboard.press("Escape");

		await submitBirthChartForm(page);
		await expect(
			page.getByRole("alert").filter({ hasText: /Doğum saatini gir/i }),
		).toBeVisible();

		await selectTime(page, "23", "59");
		await expect(
			page.getByRole("button", { name: /Doğum saati: 23:59/i }),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("draft tarihi bir gün kaymadan gösterilir", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.addInitScript(() => {
			// Form yalnızca restore-once bayrağı varken draft’ı geri yükler.
			window.sessionStorage.setItem("astrozel.birth-chart-restore-once", "1");
			window.sessionStorage.setItem(
				"astrozel.birth-chart-draft.v2",
				JSON.stringify({
					version: 2,
					createdAt: new Date().toISOString(),
					name: "",
					birthDate: "1995-05-14",
					birthTime: "13:30",
					birthPlace: "Kadıköy, İstanbul, Türkiye",
					location: {
						geonameId: 6947639,
						name: "Kadıköy",
						displayName: "Kadıköy, İstanbul, Türkiye",
						countryCode: "TR",
						countryName: "Türkiye",
						adminName1: "İstanbul",
						latitude: 40.98333,
						longitude: 29.03333,
						timezone: "Europe/Istanbul",
					},
				}),
			);
		});

		await page.goto("/dogum-haritasi");
		await expect(
			page.getByRole("button", { name: /Doğum tarihi: 14 Mayıs 1995/i }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /Doğum saati: 13:30/i }),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});
});
