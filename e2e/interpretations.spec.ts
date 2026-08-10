import { expect, test } from "@playwright/test";
import {
	fillCompleteBirthChartForm,
	mockLocationApis,
	openBirthChartForm,
	seedValidDraft,
	submitBirthChartForm,
} from "./helpers/birth-chart-form";
import { attachConsoleErrorCollector } from "./helpers/console-errors";

test.describe("Astrolojik yorumlar", () => {
	test.beforeEach(async ({ page }) => {
		await mockLocationApis(page);
	});

	test("gerçek natal sonuçta temel yorum bölümü görünür", async ({ page }) => {
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
		expect((await natalResponse).status()).toBe(200);

		await expect(
			page.getByRole("heading", { name: /Doğum haritanın temel yorumu/i }),
		).toBeVisible({ timeout: 30_000 });

		const section = page.getByTestId("interpretation-section");
		await expect(section).toBeVisible();

		await expect(section.getByText("Güneş Boğa", { exact: true })).toBeVisible();
		await expect(section.getByText("Ay Akrep", { exact: true })).toBeVisible();
		await expect(
			section.getByText("Yükselen Başak", { exact: true }),
		).toBeVisible();

		await expect(section.locator("[data-interpretation]")).toHaveCount(3);

		await expect(
			section.getByRole("heading", { name: /Gezegen yerleşimleri/i }),
		).toBeVisible();

		const mercuryDetails = section.locator("details").filter({
			hasText: "Merkür",
		});
		await expect(mercuryDetails).toBeVisible();
		await mercuryDetails.locator("summary").click();
		await expect(mercuryDetails).toHaveAttribute("open", "");
		await expect(mercuryDetails.getByText(/burcunda olması/i)).toBeVisible();
		await expect(mercuryDetails.getByText(/evde olması/i)).toBeVisible();

		const aspectCards = section.getByTestId("featured-aspect-interpretations").locator(
			"> li",
		);
		const aspectCount = await aspectCards.count();
		expect(aspectCount).toBeGreaterThan(0);
		expect(aspectCount).toBeLessThanOrEqual(6);

		await expect(
			section.getByText(
				/Astrolojik yorumlar sembolik ve geneldir/i,
			),
		).toBeVisible();

		await expect(page.getByText(/mock yorum/i)).toHaveCount(0);
		await expect(page.getByText(/örnek yorum/i)).toHaveCount(0);

		consoleGuard.assertNoUnexpectedErrors();
	});

	test("yorum bölümü mobilde yatay taşmaz", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.setViewportSize({ width: 375, height: 812 });
		await seedValidDraft(page);
		await page.goto("/dogum-haritasi/sonuc");

		const section = page.getByTestId("interpretation-section");
		await expect(section).toBeVisible({ timeout: 30_000 });

		const metrics = await page.evaluate(() => ({
			scrollWidth: document.documentElement.scrollWidth,
			innerWidth: window.innerWidth,
		}));
		expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1);

		const bigThree = section.locator("[data-interpretation]").first();
		const box = await bigThree.boundingBox();
		expect(box).toBeTruthy();
		expect(box!.x + box!.width).toBeLessThanOrEqual(376);

		const summary = section.locator("details summary").first();
		const summaryBox = await summary.boundingBox();
		expect(summaryBox).toBeTruthy();
		expect(summaryBox!.x + summaryBox!.width).toBeLessThanOrEqual(376);

		consoleGuard.assertNoUnexpectedErrors();
	});
});
