export function canSharePdfFile(file: File): boolean {
	if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
		return false;
	}
	if (typeof navigator.canShare !== "function") {
		return false;
	}
	try {
		return navigator.canShare({ files: [file] });
	} catch {
		return false;
	}
}

export async function sharePdfFile(file: File, title: string): Promise<"shared" | "cancelled" | "unsupported"> {
	if (!canSharePdfFile(file)) {
		return "unsupported";
	}
	try {
		await navigator.share({
			files: [file],
			title,
			text: title,
		});
		return "shared";
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return "cancelled";
		}
		throw error;
	}
}

export function downloadBlob(blob: Blob, fileName: string): void {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = fileName;
	anchor.rel = "noopener";
	document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
