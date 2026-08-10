import { describe, expect, it } from "vitest";
import { visualViewportStyle } from "@/hooks/use-visual-viewport";

describe("visualViewportStyle", () => {
	it("height 0 iken 100dvh fallback kullanır", () => {
		expect(
			visualViewportStyle({ height: 0, offsetTop: 0, width: 0 }),
		).toEqual({
			"--astrozel-visual-viewport-height": "100dvh",
			"--astrozel-visual-viewport-offset-top": "0px",
		});
	});

	it("ölçülen yüksekliği px CSS değişkenine yazar", () => {
		expect(
			visualViewportStyle({ height: 640, offsetTop: 24, width: 390 }),
		).toEqual({
			"--astrozel-visual-viewport-height": "640px",
			"--astrozel-visual-viewport-offset-top": "24px",
		});
	});
});
