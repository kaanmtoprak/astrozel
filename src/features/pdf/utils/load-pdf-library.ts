type PdfMakeFactory = {
	createPdf: (docDefinition: unknown) => {
		getBlob: () => Promise<Blob>;
	};
	vfs?: Record<string, string>;
	addVirtualFileSystem?: (vfs: Record<string, string>) => void;
};

let pdfMakePromise: Promise<PdfMakeFactory> | null = null;

function isFontFileKey(key: string): boolean {
	return /\.(ttf|otf|woff2?)$/i.test(key);
}

function resolvePdfMakeVfs(fontsModule: unknown): Record<string, string> | null {
	if (!fontsModule || typeof fontsModule !== "object") {
		return null;
	}

	const root = fontsModule as Record<string, unknown>;
	const candidates: unknown[] = [
		root,
		root.default,
		(root.pdfMake as { vfs?: unknown } | undefined)?.vfs,
		(root.default as { pdfMake?: { vfs?: unknown } } | undefined)?.pdfMake?.vfs,
		root.vfs,
		(root.default as { vfs?: unknown } | undefined)?.vfs,
	];

	for (const candidate of candidates) {
		if (!candidate || typeof candidate !== "object") {
			continue;
		}
		const record = candidate as Record<string, unknown>;
		const fontKeys = Object.keys(record).filter(isFontFileKey);
		if (fontKeys.length === 0) {
			continue;
		}
		const vfs: Record<string, string> = {};
		for (const key of fontKeys) {
			const value = record[key];
			if (typeof value === "string") {
				vfs[key] = value;
			} else if (
				value &&
				typeof value === "object" &&
				typeof (value as { data?: unknown }).data === "string"
			) {
				vfs[key] = (value as { data: string }).data;
			}
		}
		if (Object.keys(vfs).length > 0) {
			return vfs;
		}
	}

	return null;
}

function registerVfs(pdfMake: PdfMakeFactory, vfs: Record<string, string>): void {
	if (typeof pdfMake.addVirtualFileSystem === "function") {
		pdfMake.addVirtualFileSystem(vfs);
		return;
	}
	pdfMake.vfs = vfs;
}

export async function loadPdfLibrary(): Promise<PdfMakeFactory> {
	if (!pdfMakePromise) {
		pdfMakePromise = (async () => {
			const pdfMakeModule = await import("pdfmake/build/pdfmake");
			const fontsModule = await import("pdfmake/build/vfs_fonts");
			const pdfMake = (pdfMakeModule.default ??
				pdfMakeModule) as PdfMakeFactory;
			const vfs = resolvePdfMakeVfs(fontsModule);
			if (!vfs) {
				throw new Error("PDF font dosyaları yüklenemedi.");
			}
			registerVfs(pdfMake, vfs);
			return pdfMake;
		})();
	}
	return pdfMakePromise;
}

export async function createPdfBlob(docDefinition: unknown): Promise<Blob> {
	const pdfMake = await loadPdfLibrary();
	const document = pdfMake.createPdf(docDefinition);
	return document.getBlob();
}
