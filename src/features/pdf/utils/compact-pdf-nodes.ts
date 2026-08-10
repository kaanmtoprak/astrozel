/**
 * Remove undefined / null / false from PDF node collections.
 * Keeps 0 and empty string.
 */
export function compactPdfNodes<T>(nodes: Array<T | null | undefined | false>): T[] {
	return nodes.filter((node): node is T => node !== undefined && node !== null && node !== false);
}

const SKIP_DEEP_KEYS = new Set([
	"styles",
	"defaultStyle",
	"images",
	"border",
	"widths",
	"heights",
	"margin",
	"pageMargins",
	"pageSize",
	"headerRows",
	"layout",
]);

export function findInvalidPdfNodes(
	value: unknown,
	path = "root",
	hits: string[] = [],
): string[] {
	if (value === undefined || value === null || value === false) {
		hits.push(`${path}:${String(value)}`);
		return hits;
	}

	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			findInvalidPdfNodes(item, `${path}[${index}]`, hits);
		});
		return hits;
	}

	if (typeof value === "object") {
		for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
			if (SKIP_DEEP_KEYS.has(key)) {
				continue;
			}
			if (typeof child === "function") {
				// footer/header callbacks are valid at document root only
				if (path === "root" && (key === "footer" || key === "header" || key === "background")) {
					continue;
				}
				hits.push(`${path}.${key}:function`);
				continue;
			}
			findInvalidPdfNodes(child, `${path}.${key}`, hits);
		}
	}

	return hits;
}

export function assertValidPdfDocument(docDefinition: unknown): void {
	const hits = findInvalidPdfNodes(docDefinition);
	if (hits.length > 0) {
		throw new Error(`Invalid PDF node at ${hits[0]}`);
	}
}
