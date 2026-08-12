"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
	CompositeErrorState,
	CompositeResult,
} from "@/features/synastry/composite/components/composite-result";
import { CompatibilityCategories } from "@/features/synastry/components/compatibility-categories";
import { CompatibilityScore } from "@/features/synastry/components/compatibility-score";
import { PersonGlance } from "@/features/synastry/components/person-glance";
import { RelationshipChallenges } from "@/features/synastry/components/relationship-challenges";
import { RelationshipOverview } from "@/features/synastry/components/relationship-overview";
import { RelationshipStrengths } from "@/features/synastry/components/relationship-strengths";
import { SynastryAspects } from "@/features/synastry/components/synastry-aspects";
import { SynastryDisclaimer } from "@/features/synastry/components/synastry-disclaimer";
import { SynastryError } from "@/features/synastry/components/synastry-error";
import { SYNASTRY_DRAFT_STORAGE_KEY } from "@/features/synastry/constants/storage";
import type { SynastryResult } from "@/features/synastry/types/synastry";
import type { SynastryDraft } from "@/features/synastry/types/synastry-form";
import {
	getSynastryDraft,
	markSynastryRestoreOnce,
} from "@/features/synastry/utils/synastry-draft";
import { PdfActions } from "@/features/pdf/components/pdf-actions";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CalcState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "ready"; result: SynastryResult }
	| { status: "error"; message: string };

type ApiSuccess = { result: SynastryResult };
type ApiError = { error?: { message?: string } };

type ResultView = "synastry" | "composite";

let draftSnapshotRaw: string | null | undefined = undefined;
let draftSnapshotValue: SynastryDraft | null = null;

function readDraftSnapshot(): SynastryDraft | null {
	if (typeof window === "undefined") {
		return null;
	}

	const raw = window.sessionStorage.getItem(SYNASTRY_DRAFT_STORAGE_KEY);
	if (raw === draftSnapshotRaw) {
		return draftSnapshotValue;
	}

	draftSnapshotRaw = raw;
	draftSnapshotValue = getSynastryDraft();
	return draftSnapshotValue;
}

function subscribeDraftStore(onStoreChange: () => void) {
	window.addEventListener("storage", onStoreChange);
	return () => {
		window.removeEventListener("storage", onStoreChange);
	};
}

function getServerDraftSnapshot(): SynastryDraft | null {
	return null;
}

function subscribeIsClient() {
	return () => {};
}

function useIsClient() {
	return useSyncExternalStore(subscribeIsClient, () => true, () => false);
}

function ResultViewSwitch({
	view,
	onChange,
}: {
	view: ResultView;
	onChange: (next: ResultView) => void;
}) {
	const labelId = useId();

	return (
		<div className="space-y-2">
			<p id={labelId} className="sr-only">
				Sonuç görünümü
			</p>
			<div
				role="tablist"
				aria-labelledby={labelId}
				className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-muted/50 p-1"
			>
				<button
					type="button"
					role="tab"
					aria-selected={view === "synastry"}
					className={cn(
						"inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl px-3 text-sm font-medium transition-colors",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
						view === "synastry"
							? "bg-card text-foreground shadow-sm"
							: "text-foreground/70 hover:bg-card/60 hover:text-foreground",
					)}
					onClick={() => onChange("synastry")}
				>
					Çift Uyumu
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={view === "composite"}
					className={cn(
						"inline-flex min-h-11 touch-manipulation items-center justify-center rounded-xl px-3 text-sm font-medium transition-colors",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
						view === "composite"
							? "bg-card text-foreground shadow-sm"
							: "text-foreground/70 hover:bg-card/60 hover:text-foreground",
					)}
					onClick={() => onChange("composite")}
				>
					İlişki Haritası
				</button>
			</div>
		</div>
	);
}

function SynastryPanels({ result }: { result: SynastryResult }) {
	return (
		<div className="space-y-10">
			<CompatibilityScore
				score={result.overallScore}
				personALabel={result.personA.label}
				personBLabel={result.personB.label}
			/>
			<PdfActions input={{ kind: "synastry", result }} />
			<PersonGlance personA={result.personA} personB={result.personB} />
			<CompatibilityCategories details={result.categoryDetails} />
			<RelationshipOverview paragraphs={result.overview} />
			<RelationshipStrengths items={result.strengths} />
			<RelationshipChallenges items={result.challenges} />
			<SynastryAspects aspects={result.aspects} />
			<SynastryDisclaimer />
			<PdfActions input={{ kind: "synastry", result }} />
		</div>
	);
}

export function SynastryResultView() {
	const isClient = useIsClient();
	const draft = useSyncExternalStore(
		subscribeDraftStore,
		readDraftSnapshot,
		getServerDraftSnapshot,
	);
	const [calcState, setCalcState] = useState<CalcState>({ status: "idle" });
	const [retryToken, setRetryToken] = useState(0);
	const [view, setView] = useState<ResultView>("synastry");
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
				const response = await fetch("/api/charts/synastry", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					signal: controller.signal,
					body: JSON.stringify({
						personA: {
							birthDate: draft.personA.birthDate,
							birthTime: draft.personA.birthTime,
							location: draft.personA.location,
						},
						personB: {
							birthDate: draft.personB.birthDate,
							birthTime: draft.personB.birthTime,
							location: draft.personB.location,
						},
						presentation: {
							nameA: draft.personA.name || undefined,
							nameB: draft.personB.name || undefined,
						},
					}),
				});

				if (cancelled || requestId !== requestIdRef.current) {
					return;
				}

				if (!response.ok) {
					let message = "Çift uyumu hesaplanamadı.";
					try {
						const payload = (await response.json()) as ApiError;
						if (payload.error?.message) {
							message = payload.error.message;
						}
					} catch {
						// ignore
					}
					setCalcState({ status: "error", message });
					return;
				}

				const payload = (await response.json()) as ApiSuccess;
				if (!payload.result) {
					setCalcState({
						status: "error",
						message: "Çift uyumu hesaplanamadı.",
					});
					return;
				}

				setCalcState({
					status: "ready",
					result: payload.result,
				});
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") {
					return;
				}
				if (cancelled || requestId !== requestIdRef.current) {
					return;
				}
				setCalcState({
					status: "error",
					message: "Çift uyumu hesaplanamadı.",
				});
			}
		})();

		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [draft, retryToken]);

	// Avoid flashing "bilgi bulunamadı" during SSR/hydration when draft exists client-side.
	if (!isClient || calcState.status === "idle" || calcState.status === "loading") {
		if (isClient && !draft) {
			return (
				<div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
					<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
						Çift bilgisi bulunamadı
					</h1>
					<p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base">
						Uyumu hesaplamak için önce iki kişinin doğum bilgilerini girmen
						gerekiyor.
					</p>
					<div className="mt-8 flex justify-center">
						<Link href="/cift-uyumu" className={buttonClassName({ size: "lg" })}>
							Bilgileri Gir
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
					Çift uyumunuz hesaplanıyor…
				</p>
				<p className="mt-3 text-sm text-foreground/70">
					İki doğum haritası ve aralarındaki astrolojik bağlantılar inceleniyor.
				</p>
			</div>
		);
	}

	if (calcState.status === "error") {
		return (
			<SynastryError
				message={calcState.message}
				onRetry={() => {
					setRetryToken((token) => token + 1);
				}}
			/>
		);
	}

	const { result } = calcState;

	return (
		<div className="space-y-10">
			<header className="space-y-2 text-center">
				<p className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
					Çift uyumu sonucu
				</p>
				<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
					<span className="inline-block max-w-full truncate align-bottom">
						{result.personA.label}
					</span>
					<span className="mx-2 text-primary/50" aria-hidden="true">
						&
					</span>
					<span className="inline-block max-w-full truncate align-bottom">
						{result.personB.label}
					</span>
				</h1>
				<p className="text-sm text-foreground/65 sm:text-base">
					{view === "synastry"
						? "İki doğum haritası arasındaki sembolik bağlantılar"
						: "İlişkinin ortak sembolik yapısı (composite)"}
				</p>
			</header>

			<ResultViewSwitch view={view} onChange={setView} />

			{view === "synastry" ? (
				<SynastryPanels result={result} />
			) : result.composite ? (
				<CompositeResult composite={result.composite} />
			) : (
				<CompositeErrorState />
			)}

			{result.warnings.length > 0 ? (
				<ul className="space-y-1 text-xs text-foreground/55">
					{result.warnings.map((warning) => (
						<li key={warning}>{warning}</li>
					))}
				</ul>
			) : null}

			<div className="flex flex-col gap-3 sm:flex-row">
				<Link
					href="/cift-uyumu"
					onClick={() => {
						markSynastryRestoreOnce();
					}}
					className={buttonClassName({ variant: "secondary", size: "lg" })}
				>
					Bilgileri Düzenle
				</Link>
				<Link href="/" className={buttonClassName({ size: "lg" })}>
					Ana sayfaya dön
				</Link>
			</div>
		</div>
	);
}
