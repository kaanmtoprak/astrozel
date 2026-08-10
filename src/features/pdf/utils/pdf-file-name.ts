const TR_MAP: Record<string, string> = {
	ç: "c",
	Ç: "C",
	ğ: "g",
	Ğ: "G",
	ı: "i",
	İ: "I",
	ö: "o",
	Ö: "O",
	ş: "s",
	Ş: "S",
	ü: "u",
	Ü: "U",
};

export function slugifyPdfToken(value: string, maxLength = 24): string {
	const mapped = value
		.trim()
		.split("")
		.map((char) => TR_MAP[char] ?? char)
		.join("")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, maxLength)
		.replace(/-+$/g, "");

	return mapped;
}

export function buildNatalPdfFileName(name?: string): string {
	const slug = name ? slugifyPdfToken(name) : "";
	return slug
		? `astrozel-dogum-haritasi-${slug}.pdf`
		: "astrozel-dogum-haritasi.pdf";
}

export function buildSynastryPdfFileName(
	nameA?: string,
	nameB?: string,
): string {
	const a = nameA ? slugifyPdfToken(nameA) : "";
	const b = nameB ? slugifyPdfToken(nameB) : "";
	if (a && b) {
		return `astrozel-cift-uyumu-${a}-${b}.pdf`;
	}
	if (a || b) {
		return `astrozel-cift-uyumu-${a || b}.pdf`;
	}
	return "astrozel-cift-uyumu.pdf";
}
