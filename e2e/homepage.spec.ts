import { expect, test } from "@playwright/test";
import { mockLocationApis } from "./helpers/birth-chart-form";
import { attachConsoleErrorCollector } from "./helpers/console-errors";

test.describe("Ana sayfa deneyimi", () => {
	test.beforeEach(async ({ page }) => {
		await mockLocationApis(page);
	});

	test("mock sonuç yok, gerçek form ve hero CTA mevcut", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.goto("/");

		await expect(
			page.getByRole("heading", {
				level: 1,
				name: /Gökyüzü, doğduğun anda sana özeldi/i,
			}),
		).toBeVisible();

		await expect(page.locator(".celestial-float").first()).toBeAttached();
		await expect(page.locator(".celestial-orbit-spin").first()).toBeAttached();

		await expect(page.getByRole("link", { name: /Örnek Sonucu Gör/i })).toHaveCount(0);
		await expect(page.getByText(/Örnek veri/i)).toHaveCount(0);
		await expect(page.getByText(/mock/i)).toHaveCount(0);
		await expect(
			page.getByRole("table").filter({ hasText: /Gezegen/i }),
		).toHaveCount(0);

		await expect(
			page.getByRole("heading", { name: /Doğum bilgilerini gir/i }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /Doğum Haritamı Hazırla/i }),
		).toBeVisible();

		const headerCta = page
			.getByRole("banner")
			.getByRole("link", { name: "Harita Oluştur" });
		await expect(headerCta).toHaveAttribute("href", "/dogum-haritasi");
		await expect(
			page.getByRole("banner").getByRole("link", { name: "Doğum Haritası" }),
		).toHaveCount(0);

		await expect(
			page.getByRole("heading", {
				name: /Haritanın başlangıç noktası doğru bilgilerdir/i,
			}),
		).toBeVisible();
		await expect(
			page.getByRole("heading", {
				name: /Bilgilerin sende, haritan birkaç adım ötede/i,
			}),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: /Doğduğun anın gökyüzünü keşfet/i }),
		).toBeVisible();

		await page.getByRole("link", { name: "Doğum Haritamı Oluştur" }).first().click();
		await expect(page.locator("#dogum-bilgileri")).toBeInViewport();

		consoleGuard.assertNoUnexpectedErrors();
	});

	test("reduced-motion altında içerik görünür", async ({ page }) => {
		const consoleGuard = attachConsoleErrorCollector(page);
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/");

		await expect(
			page.getByRole("heading", {
				name: /Gökyüzü, doğduğun anda sana özeldi/i,
			}),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: /Doğum bilgilerini gir/i }),
		).toBeVisible();
		await expect(
			page.getByRole("heading", {
				name: /Haritanın başlangıç noktası doğru bilgilerdir/i,
			}),
		).toBeVisible();

		consoleGuard.assertNoUnexpectedErrors();
	});
});
