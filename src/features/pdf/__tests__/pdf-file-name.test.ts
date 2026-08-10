import { describe, expect, it } from "vitest";
import {
	buildNatalPdfFileName,
	buildSynastryPdfFileName,
	slugifyPdfToken,
} from "@/features/pdf/utils/pdf-file-name";

describe("pdf-file-name", () => {
	it("converts Turkish characters safely", () => {
		expect(slugifyPdfToken("Çiğdem Öğün")).toBe("cigdem-ogun");
		expect(buildNatalPdfFileName("Şule")).toBe(
			"astrozel-dogum-haritasi-sule.pdf",
		);
		expect(buildSynastryPdfFileName("Ayşe", "Gökçe")).toBe(
			"astrozel-cift-uyumu-ayse-gokce.pdf",
		);
	});

	it("falls back without names", () => {
		expect(buildNatalPdfFileName()).toBe("astrozel-dogum-haritasi.pdf");
		expect(buildSynastryPdfFileName()).toBe("astrozel-cift-uyumu.pdf");
	});
});
