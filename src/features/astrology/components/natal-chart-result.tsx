"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { CalculationError } from "@/features/astrology/components/calculation-error";
import { ChartSummary } from "@/features/astrology/components/chart-summary";
import { TechnicalDetailsSection } from "@/features/astrology/components/technical-details-section";
import { NatalChartWheel } from "@/features/astrology/chart/components/natal-chart-wheel";
import { InterpretationSection } from "@/features/astrology/interpretations/components/interpretation-section";
import { createNatalInterpretations } from "@/features/astrology/interpretations/utils/interpretation-engine";
import type { NatalChartResult } from "@/features/astrology/types/natal-chart";
import { BIRTH_CHART_DRAFT_STORAGE_KEY } from "@/features/birth-chart/constants/storage";
import type { BirthChartDraft } from "@/features/birth-chart/types/birth-chart";
import {
	getBirthChartDraft,
	markBirthChartRestoreOnce,
} from "@/features/birth-chart/utils/birth-chart-draft";
import { PdfActions } from "@/features/pdf/components/pdf-actions";
import { buttonClassName } from "@/components/ui/button";

type CalcState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "ready"; result: NatalChartResult }
	| { status: "error"; message: string };

type ApiSuccess = { result: NatalChartResult };
type ApiError = { error?: { message?: string } };

let draftSnapshotRaw: string | null | undefined = undefined;
let draftSnapshotValue: BirthChartDraft | null = null;

function readDraftSnapshot(): BirthChartDraft | null {
	if (typeof window === "undefined") {
		return null;
	}

	const raw = window.sessionStorage.getItem(BIRTH_CHART_DRAFT_STORAGE_KEY);
	if (raw === draftSnapshotRaw) {
		return draftSnapshotValue;
	}

	draftSnapshotRaw = raw;
	draftSnapshotValue = getBirthChartDraft();
	return draftSnapshotValue;
}

function subscribeDraftStore(onStoreChange: () => void) {
	window.addEventListener("storage", onStoreChange);
	return () => {
		window.removeEventListener("storage", onStoreChange);
	};
}

function getServerDraftSnapshot(): BirthChartDraft | null {
	return null;
}

function subscribeIsClient() {
	return () => {};
}

function useIsClient() {
	return useSyncExternalStore(subscribeIsClient, () => true, () => false);
}

export function NatalChartResultView() {
	const isClient = useIsClient();
	const draft = useSyncExternalStore(
		subscribeDraftStore,
		readDraftSnapshot,
		getServerDraftSnapshot,
	);
	const [calcState, setCalcState] = useState<CalcState>({ status: "idle" });
	const [retryToken, setRetryToken] = useState(0);
	const requestIdRef = useRef(0);

	useEffect(() => {
		if (!draft) {
			return;
		}

		const controller = new AbortController();
		const requestId = requestIdRef.current + 1;
		requestIdRef.current = requestId;
		let cancelled = false;

		void (async () => {
			setCalcState({ status: "loading" });

			try {
				const response = await fetch("/api/charts/natal", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					signal: controller.signal,
					body: JSON.stringify({
						birthDate: draft.birthDate,
						birthTime: draft.birthTime,
						location: draft.location,
					}),
				});

				if (cancelled || requestId !== requestIdRef.current) {
					return;
				}

				if (!response.ok) {
					let message = "Doğum haritası hesaplanamadı.";
					try {
						const payload = (await response.json()) as ApiError;
						if (payload.error?.message) {
							message = payload.error.message;
						}
					} catch {
						// ignore parse errors
					}
					setCalcState({ status: "error", message });
					return;
				}

				const payload = (await response.json()) as ApiSuccess;
				if (!payload.result) {
					setCalcState({
						status: "error",
						message: "Doğum haritası hesaplanamadı.",
					});
					return;
				}

				setCalcState({ status: "ready", result: payload.result });
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") {
					return;
				}
				if (cancelled || requestId !== requestIdRef.current) {
					return;
				}
				setCalcState({
					status: "error",
					message: "Doğum haritası hesaplanamadı.",
				});
			}
		})();

		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [draft, retryToken]);

	if (!isClient || calcState.status === "idle" || calcState.status === "loading") {
		if (isClient && !draft) {
			return (
				<div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
					<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
						Doğum bilgisi bulunamadı
					</h1>
					<p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base">
						Haritanı hazırlamak için önce doğum bilgilerini girmen gerekiyor.
					</p>
					<div className="mt-8 flex justify-center">
						<Link href="/dogum-haritasi" className={buttonClassName({ size: "lg" })}>
							Doğum Bilgilerini Gir
						</Link>
					</div>
				</div>
			);
		}

		return (
			<div
				className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm"
				aria-live="polite"
				aria-busy="true"
			>
				<p className="font-serif text-2xl text-foreground">
					Doğum haritan hesaplanıyor…
				</p>
				<p className="mt-3 text-sm text-foreground/70">
					Gezegen konumları, yükselen ve evler hazırlanıyor.
				</p>
			</div>
		);
	}

	if (calcState.status === "error") {
		return (
			<CalculationError
				message={calcState.message}
				onRetry={() => {
					setRetryToken((token) => token + 1);
				}}
			/>
		);
	}

	if (!draft) {
		return (
			<div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
				<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
					Doğum bilgisi bulunamadı
				</h1>
				<p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base">
					Haritanı hazırlamak için önce doğum bilgilerini girmen gerekiyor.
				</p>
				<div className="mt-8 flex justify-center">
					<Link href="/dogum-haritasi" className={buttonClassName({ size: "lg" })}>
						Doğum Bilgilerini Gir
					</Link>
				</div>
			</div>
		);
	}

	const interpretations = createNatalInterpretations(calcState.result);

	return (
		<div className="space-y-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
			<ChartSummary
				result={calcState.result}
				birthDate={draft.birthDate}
				birthTime={draft.birthTime}
			/>
			<PdfActions
				input={{
					kind: "natal",
					result: calcState.result,
					interpretations,
					name: draft.name,
					birthDate: draft.birthDate,
					birthTime: draft.birthTime,
				}}
			/>
			<NatalChartWheel
				result={calcState.result}
				name={draft.name}
				birthDate={draft.birthDate}
				birthTime={draft.birthTime}
			/>
			<InterpretationSection interpretations={interpretations} />
			<TechnicalDetailsSection
				planets={calcState.result.planets}
				houses={calcState.result.houses}
				aspects={calcState.result.aspects}
			/>
			<PdfActions
				input={{
					kind: "natal",
					result: calcState.result,
					interpretations,
					name: draft.name,
					birthDate: draft.birthDate,
					birthTime: draft.birthTime,
				}}
			/>
			<div className="flex flex-col items-stretch justify-center gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
				<Link
					href="/dogum-haritasi"
					onClick={() => {
						markBirthChartRestoreOnce();
					}}
					className={buttonClassName({ variant: "secondary", size: "lg" })}
				>
					Bilgileri Düzenle
				</Link>
				<Link href="/" className={buttonClassName({ size: "lg" })}>
					Ana Sayfaya Dön
				</Link>
			</div>
		</div>
	);
}
