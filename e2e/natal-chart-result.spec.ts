import { expect, test } from "@playwright/test";
import {
	fillCompleteBirthChartForm,
	mockLocationApis,
	openBirthChartForm,
	seedValidDraft,
	submitBirthChartForm,
} from "./helpers/birth-chart-form";
import { attachConsoleErrorCollector } from "./helpers/console-errors";

const CORE_PLANETS = [
	"Güneş",
	"Ay",
	"Merkür",
	"Venüs",
	"Mars",
	"Jüpiter",
	"Satürn",
	"Uranüs",
	"Neptün",
	"Plüton",
] as const;

test.describe("Natal chart sonuç akışı", () => {
	test.beforeEach(async ({ page }) => {
		await mockLocationApis(page);
	});

	test("formdan gerçek SVG haritaya kadar akış", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await openBirthChartForm(page);
		await fillCompleteBirthChartForm(page);

		const natalResponse = page.waitForResponse(
			(response) =>
				response.url().includes("/api/charts/natal") &&
				response.request().method() === "POST",
		);

		await submitBirthChartForm(page);
		await expect(page).toHaveURL(/\/dogum-haritasi\/sonuc/);

		const response = await natalResponse;
		expect(response.status()).toBe(200);

		await expect(
			page.getByRole("heading", { name: /Doğum haritan hazır/i }),
		).toBeVisible({ timeout: 30_000 });
		await expect(
			page.getByRole("heading", { name: /Doğum haritası hesaplanamadı/i }),
		).toHaveCount(0);

		await expect(page.getByText("Güneş", { exact: true }).first()).toBeVisible();
		await expect(page.getByText("Ay", { exact: true }).first()).toBeVisible();
		await expect(page.getByText("Yükselen", { exact: true }).first()).toBeVisible();
		await expect(page.getByText(/^MC/).first()).toBeVisible();

		await expect(
			page
				.getByRole("listitem")
				.filter({ has: page.getByText("Güneş", { exact: true }) })
				.getByText("Boğa", { exact: true }),
		).toBeVisible();
		await expect(
			page
				.getByRole("listitem")
				.filter({ has: page.getByText("Ay", { exact: true }) })
				.getByText("Akrep", { exact: true }),
		).toBeVisible();
		await expect(
			page
				.getByRole("listitem")
				.filter({ has: page.getByText("Yükselen", { exact: true }) })
				.getByText("Başak", { exact: true }),
		).toBeVisible();

		const technical = page.getByTestId("technical-details");
		await expect(
			page.getByRole("heading", { name: /Teknik detaylar/i }),
		).toBeVisible();
		await expect(technical.locator("details")).toHaveCount(3);
		await expect(technical.locator("details[open]")).toHaveCount(0);
		await expect(
			page.getByRole("table").filter({ hasText: "Gezegen" }),
		).toBeHidden();

		await technical.getByText("Gezegen konumları", { exact: true }).click();
		const planetTable = page.getByRole("table").filter({ hasText: "Gezegen" });
		await expect(planetTable).toBeVisible();
		for (const planet of CORE_PLANETS) {
			await expect(planetTable.getByText(planet, { exact: true })).toBeVisible();
		}

		await technical.getByText("Ev başlangıçları", { exact: true }).click();
		const houseTable = page
			.getByRole("table")
			.filter({ hasText: "Başlangıç derecesi" });
		await expect(houseTable).toBeVisible();
		for (let house = 1; house <= 12; house += 1) {
			await expect(
				houseTable.getByRole("cell", { name: new RegExp(`^${house}\\. Ev`) }),
			).toBeVisible();
		}

		await technical.getByText("Açılar", { exact: true }).click();
		await expect(technical.getByText(/Orb /i).first()).toBeVisible();

		await expect(
			page.getByRole("link", { name: "Bilgileri Düzenle" }).first(),
		).toBeVisible();

		const chart = page.getByRole("img", { name: /Doğum haritası çemberi/i });
		await expect(chart).toBeVisible();
		await expect(chart.locator("#natal-chart-title")).toHaveText(
			/Doğum haritası çemberi/i,
		);
		expect(await chart.locator("path").count()).toBeGreaterThanOrEqual(12);

		for (const planet of CORE_PLANETS) {
			await expect(
				chart.getByRole("button", { name: new RegExp(`^${planet},`) }),
			).toHaveCount(1);
		}

		await expect(page.getByText(/mock/i)).toHaveCount(0);
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("teknik detaylar kapalı kalır ve yenilemede korunur", async ({
		page,
	}) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await seedValidDraft(page);
		await page.goto("/dogum-haritasi/sonuc");
		await expect(
			page.getByRole("heading", { name: /Doğum haritan hazır/i }),
		).toBeVisible({ timeout: 30_000 });

		const technical = page.getByTestId("technical-details");
		await expect(technical.locator("details[open]")).toHaveCount(0);
		await page.reload();
		await expect(
			page.getByRole("heading", { name: /Doğum haritan hazır/i }),
		).toBeVisible({ timeout: 30_000 });
		await expect(page.getByTestId("technical-details").locator("details[open]")).toHaveCount(
			0,
		);
		consoleGuard.assertNoUnexpectedErrors();
	});

	test("SVG gezegen etkileşimi klavye ve mouse ile çalışır", async ({
		page,
	}) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await seedValidDraft(page);
		await page.goto("/dogum-haritasi/sonuc");

		await expect(
			page.getByRole("heading", { name: /Doğum haritan hazır/i }),
		).toBeVisible({ timeout: 30_000 });

		const sunButton = page.getByRole("button", {
			name: /^Güneş,/,
		});
		await sunButton.focus();
		await page.keyboard.press("Enter");

		const detailCard = page.locator('[aria-live="polite"]');
		await expect(detailCard.getByText("Güneş", { exact: true })).toBeVisible();
		await expect(detailCard.getByText(/\d+\. Ev/)).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(
			page.getByText("Gezegen veya açı seçerek detay görebilirsin."),
		).toBeVisible();

		await sunButton.click();
		await expect(page.getByRole("button", { name: "Kapat" })).toBeVisible();
		await page.getByRole("button", { name: "Kapat" }).click();
		await expect(
			page.getByText("Gezegen veya açı seçerek detay görebilirsin."),
		).toBeVisible();

		consoleGuard.assertNoUnexpectedErrors();
	});

	test("natal API loading ve hata/retry davranışı", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await seedValidDraft(page);

		let attempt = 0;
		await page.route("**/api/charts/natal", async (route) => {
			attempt += 1;
			if (attempt === 1) {
				await new Promise((resolve) => setTimeout(resolve, 800));
				await route.fulfill({
					status: 500,
					contentType: "application/json",
					body: JSON.stringify({
						error: {
							code: "CALCULATION_FAILED",
							message: "Doğum haritası hesaplanamadı.",
						},
					}),
				});
				return;
			}

			await route.continue();
		});

		await page.goto("/dogum-haritasi/sonuc");
		await expect(
			page.getByText("Doğum haritan hesaplanıyor…"),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: /Doğum haritası hesaplanamadı/i }),
		).toBeVisible();
		await expect(page.getByText(/stack|Error:|at Object/i)).toHaveCount(0);
		await expect(page.getByRole("button", { name: "Tekrar Dene" })).toBeVisible();
		await expect(
			page.getByRole("link", { name: "Bilgileri Düzenle" }).first(),
		).toBeVisible();

		await page.unroute("**/api/charts/natal");
		await page.getByRole("button", { name: "Tekrar Dene" }).click();
		await expect(
			page.getByRole("heading", { name: /Doğum haritan hazır/i }),
		).toBeVisible({ timeout: 30_000 });
		consoleGuard.assertNoUnexpectedErrors();
	});
});
