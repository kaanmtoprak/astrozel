import { expect, test, type Locator, type Page } from "@playwright/test";
import { mockLocationApis } from "./helpers/birth-chart-form";
import { attachHydrationErrorCollector } from "./helpers/hydration-errors";

async function openDateOverlay(page: Page) {
	const trigger = page.locator('[data-mobile-target="date-trigger"]');
	await expect(trigger).toBeVisible();
	try {
		await trigger.tap({ timeout: 3_000 });
	} catch {
		await trigger.click();
	}

	const sheet = page.getByTestId("date-sheet");
	const popoverCalendar = page.locator(".astrozel-popover .astrozel-day-picker");
	await expect(sheet.or(popoverCalendar).first()).toBeVisible();
}

async function openTimeOverlay(page: Page) {
	const trigger = page.locator('[data-mobile-target="time-trigger"]');
	await expect(trigger).toBeVisible();
	try {
		await trigger.tap({ timeout: 3_000 });
	} catch {
		await trigger.click();
	}

	const sheet = page.getByTestId("time-sheet");
	const list = page.getByRole("listbox", { name: "Saat" });
	await expect(sheet.or(list).first()).toBeVisible();
}

async function openLocationOverlay(page: Page) {
	const mobile = page.locator('[data-mobile-target="location-trigger"]');
	const desktop = page.getByRole("combobox", { name: "Doğum Yeri" });
	const trigger: Locator =
		(await mobile.count()) > 0 && (await mobile.isVisible()) ? mobile : desktop;

	await expect(trigger).toBeVisible();
	try {
		await trigger.tap({ timeout: 3_000 });
	} catch {
		await trigger.click();
	}

	if ((await mobile.count()) > 0 && (await mobile.isVisible())) {
		await expect(page.getByTestId("location-sheet")).toBeVisible();
		return;
	}

	await desktop.fill("Ka");
	await expect(
		page.getByRole("listbox", { name: "Konum sonuçları" }),
	).toBeVisible();
}

test.describe("Hydration regression", () => {
	test.beforeEach(async ({ page }) => {
		await mockLocationApis(page);
	});

	test("ana sayfa hydrate olur ve overlay’ler açılır", async ({ page }) => {
		const guard = attachHydrationErrorCollector(page);
		await page.goto("/?v=hydration-fixed");

		await expect(
			page.getByRole("heading", {
				level: 1,
				name: /Gökyüzü, doğduğun anda sana özeldi/i,
			}),
		).toBeVisible();
		await expect(page.locator(".celestial-float").first()).toBeAttached();
		await expect(page.locator(".celestial-twinkle").first()).toBeAttached();
		await expect(
			page.getByRole("button", { name: /Doğum Haritamı Hazırla/i }),
		).toBeVisible();

		// Media-query effect settles after mount (hydration-safe false → real value).
		await page
			.locator('[data-mobile-target="date-trigger"]')
			.evaluate(
				() =>
					new Promise<void>((resolve) => {
						requestAnimationFrame(() => {
							requestAnimationFrame(() => resolve());
						});
					}),
			);

		const hamburger = page.locator('[data-mobile-target="hamburger"]');
		if (await hamburger.isVisible()) {
			await hamburger.tap();
			await expect(page.getByTestId("nav-sheet")).toBeVisible();
			await page.keyboard.press("Escape");
			await expect(page.getByTestId("nav-sheet")).toBeHidden();
		}

		await page.locator("#dogum-bilgileri").scrollIntoViewIfNeeded();
		await openDateOverlay(page);
		await page.keyboard.press("Escape");

		await openTimeOverlay(page);
		await page.keyboard.press("Escape");

		await openLocationOverlay(page);

		guard.assertNoHydrationErrors();
		guard.assertNoUnexpectedErrors();
	});

	test("dogum-haritasi hydrate olur", async ({ page }) => {
		const guard = attachHydrationErrorCollector(page);
		await page.goto("/dogum-haritasi?v=hydration-fixed");

		await expect(
			page.getByRole("heading", { name: /Doğum haritanı oluştur/i }),
		).toBeVisible();
		await expect(
			page.locator('[data-mobile-target="date-trigger"]'),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /Doğum Haritamı Hazırla/i }),
		).toBeVisible();

		await page
			.locator('[data-mobile-target="date-trigger"]')
			.evaluate(
				() =>
					new Promise<void>((resolve) => {
						requestAnimationFrame(() => {
							requestAnimationFrame(() => resolve());
						});
					}),
			);

		await openDateOverlay(page);

		guard.assertNoHydrationErrors();
		guard.assertNoUnexpectedErrors();
	});

	test("sonuc boş draft hydrate olur", async ({ page }) => {
		const guard = attachHydrationErrorCollector(page);
		await page.goto("/dogum-haritasi/sonuc?v=hydration-fixed");

		await expect(
			page.getByRole("heading", { name: /Doğum bilgisi bulunamadı/i }),
		).toBeVisible();
		await expect(
			page.getByRole("link", { name: /Doğum Bilgilerini Gir/i }),
		).toBeVisible();

		guard.assertNoHydrationErrors();
		guard.assertNoUnexpectedErrors();
	});
});
