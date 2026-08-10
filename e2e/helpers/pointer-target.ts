import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Merkez noktada elementFromPoint sonucunun locator (veya descendant) olduğunu doğrular.
 * Dekoratif overlay tıklamayı engelliyorsa anlamlı hata üretir.
 */
export async function assertPointerTargetIsReachable(
	page: Page,
	locator: Locator,
	label: string,
) {
	await expect(locator, `${label} görünür olmalı`).toBeVisible();
	const box = await locator.boundingBox();
	expect(box, `${label} bounding box`).toBeTruthy();

	const x = box!.x + box!.width / 2;
	const y = box!.y + box!.height / 2;

	const hit = await page.evaluate(
		({ px, py }) => {
			const el = document.elementFromPoint(px, py);
			if (!el) {
				return { tag: null, className: null, id: null, text: null };
			}
			return {
				tag: el.tagName.toLowerCase(),
				className: typeof el.className === "string" ? el.className : "",
				id: el.id || null,
				text: (el.textContent ?? "").trim().slice(0, 80),
			};
		},
		{ px: x, py: y },
	);

	const handle = await locator.elementHandle();
	expect(handle, `${label} handle`).toBeTruthy();

	const isMatch = await page.evaluate(
		({ px, py, target }) => {
			const el = document.elementFromPoint(px, py);
			if (!el || !target) {
				return false;
			}
			return target === el || target.contains(el) || el.contains(target);
		},
		{ px: x, py: y, target: handle },
	);

	expect(
		isMatch,
		`${label} merkezinde beklenen hedef yerine şunu buldum: <${hit.tag} class="${hit.className}" id="${hit.id}"> ${hit.text}`,
	).toBe(true);
}

export async function listHorizontalOverflowCulprits(
	page: Page,
): Promise<string[]> {
	return page.evaluate(() => {
		const viewport = window.innerWidth;
		const tolerance = 1;
		const culprits: string[] = [];

		for (const el of document.querySelectorAll("body *")) {
			const rect = el.getBoundingClientRect();
			if (rect.width === 0 && rect.height === 0) {
				continue;
			}
			if (rect.right > viewport + tolerance || rect.left < -tolerance) {
				const tag = el.tagName.toLowerCase();
				const cls =
					typeof (el as HTMLElement).className === "string"
						? (el as HTMLElement).className.slice(0, 60)
						: "";
				culprits.push(
					`<${tag}.${cls}> left=${rect.left.toFixed(1)} right=${rect.right.toFixed(1)}`,
				);
			}
		}

		return culprits.slice(0, 12);
	});
}

export async function assertNoHorizontalOverflow(page: Page) {
	const metrics = await page.evaluate(() => ({
		scrollWidth: document.documentElement.scrollWidth,
		innerWidth: window.innerWidth,
		scrollX: window.scrollX,
	}));

	if (metrics.scrollWidth > metrics.innerWidth + 1) {
		const culprits = await listHorizontalOverflowCulprits(page);
		expect(
			metrics.scrollWidth,
			`Yatay taşma. scrollWidth=${metrics.scrollWidth} innerWidth=${metrics.innerWidth}. Örnekler: ${culprits.join(" | ")}`,
		).toBeLessThanOrEqual(metrics.innerWidth + 1);
	}

	expect(metrics.scrollX).toBe(0);
}
