import { expect, test } from "@playwright/test";
import { attachHydrationErrorCollector } from "./helpers/hydration-errors";
import { KADIKOY_SEARCH, KADIKOY_TIMEZONE } from "./fixtures/locations";

const DRAFT_KEY = "astrozel.synastry-draft.v1";

function buildDraft() {
	const location = {
		...KADIKOY_SEARCH,
		timezone: KADIKOY_TIMEZONE,
	};

	return {
		version: 1,
		createdAt: new Date().toISOString(),
		personA: {
			name: "Ayşe",
			birthDate: "1995-05-14",
			birthTime: "13:30",
			birthPlace: location.displayName,
			location,
		},
		personB: {
			name: "Can",
			birthDate: "1998-11-03",
			birthTime: "09:15",
			birthPlace: location.displayName,
			location,
		},
	};
}

test.describe("Daily Sky smoke", () => {
	test("route renders sections and date navigation updates URL", async ({
		page,
	}) => {
		const hydration = attachHydrationErrorCollector(page);
		await page.goto("/bugunun-gokyuzu?tarih=2026-08-10");

		await expect(
			page.getByRole("heading", { name: /Bugünün Gökyüzü/i }),
		).toBeVisible();
		await expect(page.getByText(/10 Ağustos 2026/i).first()).toBeVisible();
		await expect(page.getByText(/Güneş/i).first()).toBeVisible();
		await expect(page.getByText(/Ay/i).first()).toBeVisible();
		await expect(page.locator('input[type="date"]')).toHaveCount(0);
		await expect(
			page.locator('[data-mobile-target="date-trigger"]'),
		).toBeVisible();

		await page.getByRole("link", { name: /Sonraki gün/i }).click();
		await expect(page).toHaveURL(/tarih=2026-08-11/);
		await expect(page.getByText(/11 Ağustos 2026/i).first()).toBeVisible();

		hydration.assertNoHydrationErrors();
	});
});

test.describe("Composite / İlişki Haritası smoke", () => {
	test("synastry result switches to composite view", async ({ page }) => {
		const hydration = attachHydrationErrorCollector(page);

		await page.addInitScript(
			({ key, draft }) => {
				window.sessionStorage.setItem(key, JSON.stringify(draft));
			},
			{ key: DRAFT_KEY, draft: buildDraft() },
		);

		await page.goto("/cift-uyumu/sonuc");

		await expect(page.getByRole("tab", { name: /Çift Uyumu/i })).toBeVisible({
			timeout: 45_000,
		});
		await expect(
			page.getByRole("tab", { name: /İlişki Haritası/i }),
		).toBeVisible();

		// Default synastry panel should show a score-like signal.
		await expect(page.getByText(/\d+\s*\/\s*100|Genel|uyum/i).first()).toBeVisible({
			timeout: 45_000,
		});

		await page.getByRole("tab", { name: /İlişki Haritası/i }).click();
		await expect(
			page.getByRole("heading", { name: "İlişki Haritası", exact: true }),
		).toBeVisible();
		await expect(page.getByText(/uyum puanı üretmez/i)).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "İlişki haritası çemberi" }),
		).toBeVisible();
		await expect(page.getByRole("img").first()).toBeVisible();

		await page.getByRole("tab", { name: /Çift Uyumu/i }).click();
		await expect(page.getByRole("tab", { name: /Çift Uyumu/i })).toHaveAttribute(
			"aria-selected",
			"true",
		);

		hydration.assertNoHydrationErrors();
	});
});
