"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { buildNatalChartPdfDefinition } from "@/features/pdf/builders/natal-chart-report";
import { buildSynastryPdfDefinition } from "@/features/pdf/builders/synastry-report";
import type { PdfReportInput } from "@/features/pdf/types/pdf-report";
import { cloneNatalChartSvgForPdf } from "@/features/pdf/utils/clone-natal-svg";
import { createPdfBlob } from "@/features/pdf/utils/load-pdf-library";
import {
	buildNatalPdfFileName,
	buildSynastryPdfFileName,
} from "@/features/pdf/utils/pdf-file-name";
import {
	canSharePdfFile,
	downloadBlob,
	sharePdfFile,
} from "@/features/pdf/utils/share-pdf";
import { Button } from "@/components/ui/button";

const PDF_TIMEOUT_MS = 45_000;

function detectShareSupport(): boolean {
	if (typeof navigator === "undefined") {
		return false;
	}
	if (typeof navigator.share !== "function") {
		return false;
	}
	const probe = new File(["probe"], "astrozel-probe.pdf", {
		type: "application/pdf",
	});
	return canSharePdfFile(probe);
}

function subscribeShareSupport() {
	return () => {};
}

function getShareSupportSnapshot(): boolean {
	return detectShareSupport();
}

function getServerShareSupportSnapshot(): boolean {
	return false;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	try {
		return await Promise.race([
			promise,
			new Promise<T>((_, reject) => {
				timeoutId = setTimeout(() => {
					reject(new Error("PDF_TIMEOUT"));
				}, ms);
			}),
		]);
	} finally {
		if (timeoutId !== undefined) {
			clearTimeout(timeoutId);
		}
	}
}

export function PdfActions({ input }: { input: PdfReportInput }) {
	const [status, setStatus] = useState<"idle" | "generating" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	/** SSR + hydration: false; sonrası gerçek navigator.canShare. */
	const shareSupported = useSyncExternalStore(
		subscribeShareSupport,
		getShareSupportSnapshot,
		getServerShareSupportSnapshot,
	);
	const busyRef = useRef(false);
	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const fileName =
		input.kind === "natal"
			? buildNatalPdfFileName(input.name)
			: buildSynastryPdfFileName(
					input.result.personA.label === "Birinci kişi"
						? undefined
						: input.result.personA.label,
					input.result.personB.label === "İkinci kişi"
						? undefined
						: input.result.personB.label,
				);

	async function buildBlob(): Promise<{ blob: Blob; file: File }> {
		async function fromDefinition(definition: unknown): Promise<Blob> {
			return withTimeout(createPdfBlob(definition), PDF_TIMEOUT_MS);
		}

		let blob: Blob;
		if (input.kind === "natal") {
			const chartSvg = cloneNatalChartSvgForPdf();
			const safeSvg =
				chartSvg && !/var\(|color-mix\(/i.test(chartSvg) ? chartSvg : null;
			try {
				blob = await fromDefinition(
					buildNatalChartPdfDefinition({
						...input,
						chartSvg: safeSvg,
					}),
				);
			} catch {
				blob = await fromDefinition(
					buildNatalChartPdfDefinition({
						...input,
						chartSvg: null,
					}),
				);
			}
		} else {
			blob = await fromDefinition(buildSynastryPdfDefinition(input));
		}

		const file = new File([blob], fileName, { type: "application/pdf" });
		return { blob, file };
	}

	function setSafeStatus(next: "idle" | "generating" | "error") {
		if (mountedRef.current) {
			setStatus(next);
		}
	}

	function setSafeError(message: string | null) {
		if (mountedRef.current) {
			setErrorMessage(message);
		}
	}

	async function handleDownload() {
		if (busyRef.current) {
			return;
		}
		busyRef.current = true;
		setSafeStatus("generating");
		setSafeError(null);
		try {
			const { blob } = await buildBlob();
			downloadBlob(blob, fileName);
			setSafeStatus("idle");
		} catch (error) {
			const message =
				error instanceof Error && error.message === "PDF_TIMEOUT"
					? "PDF hazırlanması beklenenden uzun sürdü. Lütfen tekrar dene."
					: "PDF hazırlanamadı. Lütfen tekrar dene.";
			setSafeStatus("error");
			setSafeError(message);
		} finally {
			busyRef.current = false;
		}
	}

	async function handleShare() {
		if (busyRef.current) {
			return;
		}
		busyRef.current = true;
		setSafeStatus("generating");
		setSafeError(null);
		try {
			const { file } = await buildBlob();
			const shareResult = await sharePdfFile(file, "Astrozel PDF Raporu");
			if (shareResult === "unsupported") {
				downloadBlob(file, fileName);
			}
			setSafeStatus("idle");
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				setSafeStatus("idle");
				return;
			}
			const message =
				error instanceof Error && error.message === "PDF_TIMEOUT"
					? "PDF hazırlanması beklenenden uzun sürdü. Lütfen tekrar dene."
					: "PDF hazırlanamadı. Lütfen tekrar dene.";
			setSafeStatus("error");
			setSafeError(message);
		} finally {
			busyRef.current = false;
		}
	}

	const isGenerating = status === "generating";

	return (
		<div className="flex flex-col gap-3 rounded-3xl border border-border/80 bg-card/95 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
			<div>
				<p className="font-medium text-foreground">PDF raporu</p>
				<p className="mt-1 text-sm text-foreground/65" aria-live="polite">
					{isGenerating
						? "PDF hazırlanıyor…"
						: "Raporu cihazınıza indirin veya desteklenen uygulamalarla paylaşın."}
				</p>
				{errorMessage ? (
					<p className="mt-2 text-sm text-red-600" role="alert">
						{errorMessage}
					</p>
				) : null}
			</div>
			<div className="flex flex-col gap-2 sm:flex-row">
				<Button
					type="button"
					onClick={() => {
						void handleDownload();
					}}
					disabled={isGenerating}
				>
					PDF İndir
				</Button>
				{shareSupported ? (
					<Button
						type="button"
						variant="secondary"
						onClick={() => {
							void handleShare();
						}}
						disabled={isGenerating}
					>
						PDF’i Paylaş
					</Button>
				) : null}
			</div>
		</div>
	);
}
