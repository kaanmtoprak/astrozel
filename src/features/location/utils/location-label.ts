function foldLocationToken(value: string): string {
	return value
		.trim()
		.toLocaleLowerCase("tr-TR")
		.replaceAll("ı", "i")
		.replaceAll("İ", "i")
		.normalize("NFD")
		.replace(/\p{M}/gu, "");
}

function labelsEquivalent(left: string, right: string): boolean {
	return foldLocationToken(left) === foldLocationToken(right);
}

export function buildLocationDisplayName(parts: {
	name: string;
	adminName1?: string;
	countryName: string;
}): string {
	const segments: string[] = [];

	const pushUnique = (value?: string) => {
		const trimmed = value?.trim();
		if (!trimmed) {
			return;
		}
		if (segments.some((item) => labelsEquivalent(item, trimmed))) {
			return;
		}
		segments.push(trimmed);
	};

	pushUnique(parts.name);
	pushUnique(parts.adminName1);
	pushUnique(parts.countryName);

	return segments.join(", ");
}

export function buildLocationOptionLabel(parts: {
	name: string;
	adminName1?: string;
	countryName: string;
}): string {
	return buildLocationDisplayName(parts);
}
