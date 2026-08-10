import { expect, test } from "@playwright/test";
import {
	mockLocationApis,
	openBirthChartForm,
	submitBirthChartForm,
} from "./helpers/birth-chart-form";
import { attachConsoleErrorCollector } from "./helpers/console-errors";
import { KADIKOY_SEARCH } from "./fixtures/locations";

test.describe("Location combobox", () => {
	test("tek karakterde arama yapmaz, iki karakterde arar", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await mockLocationApis(page);
		await openBirthChartForm(page);

		const searchRequests: string[] = [];
		page.on("request", (request) => {
			if (request.url().includes("/api/locations/search")) {
				searchRequests.push(request.url());
			}
		});

		const input = page.getByRole("combobox", { name: "Doğum Yeri" });
		await input.fill("K");
		await expect(page.getByText(/en az 2 karakter/i)).toBeVisible();
		await expect.poll(() => searchRequests.length).toBe(0);

		await input.fill("Ka");
		await expect
			.poll(() => searchRequests.length, { timeout: 5_000 })
			.toBeGreaterThan(0);
		await expect(page.getByRole("listbox")).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("klavye ile seçim, timezone ve seçim temizleme", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await mockLocationApis(page);
		await openBirthChartForm(page);

		const timezoneRequests: string[] = [];
		page.on("request", (request) => {
			if (request.url().includes("/api/locations/timezone")) {
				timezoneRequests.push(request.url());
			}
		});

		const input = page.getByRole("combobox", { name: "Doğum Yeri" });
		await input.fill("Kadıköy");

		const listbox = page.getByRole("listbox", { name: "Konum sonuçları" });
		await expect(listbox).toBeVisible();
		await expect(listbox.getByRole("option").first()).toContainText(/Kadıköy/i);

		await input.press("ArrowDown");
		await input.press("Enter");

		await expect
			.poll(() => timezoneRequests.length, { timeout: 5_000 })
			.toBeGreaterThan(0);
		await expect(page.getByText(/Konum seçildi/i)).toBeVisible();
		await expect(page.getByText(/Europe\/Istanbul/)).toBeVisible();
		await expect(input).toHaveAttribute("aria-expanded", "false");

		await input.fill("Kadıköy değiştirildi");
		await expect(page.getByText(/Konum seçildi/i)).toHaveCount(0);

		await submitBirthChartForm(page);
		await expect(
			page.getByText("Doğum yerini arama sonuçlarından seç."),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("Escape listeyi kapatır ve mouse ile seçim çalışır", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await mockLocationApis(page);
		await openBirthChartForm(page);

		const input = page.getByRole("combobox", { name: "Doğum Yeri" });
		await input.fill("Paris");
		const listbox = page.getByRole("listbox");
		await expect(listbox).toBeVisible();
		await input.press("Escape");
		await expect(listbox).toBeHidden();

		await input.fill("");
		await input.fill("Paris");
		await expect(page.getByRole("listbox")).toBeVisible();
		await page.getByRole("option", { name: /Paris/i }).first().click();
		await expect(page.getByText(/Europe\/Paris/)).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("sonuç bulunamadı ve API hata mesajı", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await mockLocationApis(page, { emptyQuery: "xyzzyx" });
		await openBirthChartForm(page);

		const input = page.getByRole("combobox", { name: "Doğum Yeri" });
		await input.fill("xyzzyx");
		await expect(page.getByText("Eşleşen konum bulunamadı.")).toBeVisible();

		await page.unroute("**/api/locations/search**");
		await mockLocationApis(page, {
			searchError: {
				status: 502,
				message: "Konum servisine ulaşılamadı. Tekrar deneyebilirsin.",
			},
		});

		await input.fill("");
		await input.fill("Kadıköy");
		await expect(
			page.getByText("Konum servisine ulaşılamadı. Tekrar deneyebilirsin."),
		).toBeVisible();
		consoleGuard.assertNoUnexpectedErrors();
	});
});

test.describe("Location fixture koordinatları", () => {
	test("Kadıköy fixture sabitleri tutarlı", () => {
		expect(KADIKOY_SEARCH.geonameId).toBe(6947639);
		expect(KADIKOY_SEARCH.latitude).toBeCloseTo(40.98333, 5);
	});
});
