"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ElementSnapshot = {
	tagName: string;
	id: string;
	className: string;
	dataMobileTarget: string;
	pointerEvents: string;
	position: string;
	zIndex: string;
	overflow: string;
	rect: string;
};

type EventSnapshot = {
	type: string;
	target: ElementSnapshot | null;
	fromPoint: ElementSnapshot | null;
	composedPath: string[];
	clientX: number;
	clientY: number;
};

type ProbeResult = {
	selector: string;
	expectedTarget: string;
	center: { x: number; y: number };
	fromPoint: ElementSnapshot | null;
	isExpectedOrDescendant: boolean;
	blockerSummary: string;
	pseudoBefore: Record<string, string> | null;
	pseudoAfter: Record<string, string> | null;
};

type OverflowHit = {
	tagName: string;
	id: string;
	className: string;
	dataMobileTarget: string;
	left: number;
	right: number;
	width: number;
	scrollWidth: number;
	clientWidth: number;
	position: string;
	transform: string;
};

const TARGETS = [
	{ key: "hamburger", label: "Hamburger" },
	{ key: "date-trigger", label: "DatePicker" },
	{ key: "time-trigger", label: "TimePicker" },
	{ key: "location-input", label: "Location input" },
	{ key: "location-option", label: "Location option" },
	{ key: "submit", label: "Submit" },
] as const;

function describeElement(el: Element | null): ElementSnapshot | null {
	if (!(el instanceof Element)) {
		return null;
	}

	const htmlEl = el as HTMLElement;
	const style = window.getComputedStyle(htmlEl);
	const rect = htmlEl.getBoundingClientRect();

	return {
		tagName: el.tagName.toLowerCase(),
		id: el.id || "(yok)",
		className: (el.getAttribute("class") || "(yok)").slice(0, 160),
		dataMobileTarget: el.getAttribute("data-mobile-target") || "(yok)",
		pointerEvents: style.pointerEvents,
		position: style.position,
		zIndex: style.zIndex,
		overflow: `${style.overflow}/${style.overflowX}/${style.overflowY}`,
		rect: `${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}x${Math.round(rect.height)}`,
	};
}

function pathLabel(el: EventTarget | null): string {
	if (!(el instanceof Element)) {
		return String(el);
	}
	const target = el.getAttribute("data-mobile-target");
	const id = el.id ? `#${el.id}` : "";
	const cls = el.classList?.[0] ? `.${el.classList[0]}` : "";
	const mark = target ? `[${target}]` : "";
	return `${el.tagName.toLowerCase()}${id}${cls}${mark}`;
}

function readPseudo(el: Element, which: "::before" | "::after") {
	const style = window.getComputedStyle(el, which);
	const content = style.content;
	if (!content || content === "none" || content === "normal") {
		return null;
	}
	return {
		content,
		position: style.position,
		pointerEvents: style.pointerEvents,
		zIndex: style.zIndex,
		width: style.width,
		height: style.height,
		inset: `${style.top}/${style.right}/${style.bottom}/${style.left}`,
	};
}

function summarizeBlocker(expected: Element, found: Element | null): string {
	if (!found) {
		return "elementFromPoint null döndü";
	}
	if (found === expected || expected.contains(found) || found.contains(expected)) {
		return "beklenen hedef veya descendant";
	}
	const parts = [
		found.tagName.toLowerCase(),
		found.getAttribute("data-mobile-target")
			? `data=${found.getAttribute("data-mobile-target")}`
			: null,
		found.classList.contains("pointer-events-none")
			? "class:pointer-events-none"
			: null,
		found.getAttribute("aria-hidden") === "true" ? "aria-hidden" : null,
	].filter(Boolean);
	return `ENGEL: ${parts.join(" ")}`;
}

export function MobileDebugPanel() {
	const searchParams = useSearchParams();
	const enabled = searchParams.get("mobileDebug") === "1";

	const [open, setOpen] = useState(true);
	const [viewport, setViewport] = useState({ w: 0, h: 0 });
	const [scrollWidth, setScrollWidth] = useState(0);
	const [scrollX, setScrollX] = useState(0);
	const [lastEvents, setLastEvents] = useState<{
		touchstart: EventSnapshot | null;
		pointerdown: EventSnapshot | null;
		click: EventSnapshot | null;
	}>({
		touchstart: null,
		pointerdown: null,
		click: null,
	});
	const [probe, setProbe] = useState<ProbeResult | null>(null);
	const [overflowHits, setOverflowHits] = useState<OverflowHit[]>([]);

	const refreshMetrics = useCallback(() => {
		setViewport({ w: window.innerWidth, h: window.innerHeight });
		setScrollWidth(document.documentElement.scrollWidth);
		setScrollX(window.scrollX);
	}, []);

	useEffect(() => {
		if (!enabled || process.env.NODE_ENV !== "development") {
			return;
		}

		const frame = window.requestAnimationFrame(() => {
			refreshMetrics();
		});
		window.addEventListener("resize", refreshMetrics);
		window.addEventListener("scroll", refreshMetrics, { passive: true });

		function capture(event: Event) {
			const anyEvent = event as MouseEvent & TouchEvent & PointerEvent;
			let clientX = 0;
			let clientY = 0;
			if ("clientX" in anyEvent && typeof anyEvent.clientX === "number") {
				clientX = anyEvent.clientX;
				clientY = anyEvent.clientY;
			} else if (anyEvent.touches?.[0]) {
				clientX = anyEvent.touches[0].clientX;
				clientY = anyEvent.touches[0].clientY;
			}

			const targetEl =
				event.target instanceof Element ? event.target : null;
			const fromPoint =
				clientX || clientY
					? document.elementFromPoint(clientX, clientY)
					: null;
			const path = event.composedPath?.() ?? [];
			const snapshot: EventSnapshot = {
				type: event.type,
				target: describeElement(targetEl),
				fromPoint: describeElement(fromPoint),
				composedPath: path.slice(0, 6).map(pathLabel),
				clientX,
				clientY,
			};

			setLastEvents((prev) => ({
				...prev,
				[event.type as "touchstart" | "pointerdown" | "click"]: snapshot,
			}));
			refreshMetrics();
		}

		document.addEventListener("touchstart", capture, true);
		document.addEventListener("pointerdown", capture, true);
		document.addEventListener("click", capture, true);

		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("resize", refreshMetrics);
			window.removeEventListener("scroll", refreshMetrics);
			document.removeEventListener("touchstart", capture, true);
			document.removeEventListener("pointerdown", capture, true);
			document.removeEventListener("click", capture, true);
		};
	}, [enabled, refreshMetrics]);

	const probeTarget = useCallback((key: string) => {
		const expected = document.querySelector(
			`[data-mobile-target="${key}"]`,
		);
		if (!(expected instanceof HTMLElement)) {
			setProbe({
				selector: key,
				expectedTarget: "(bulunamadı)",
				center: { x: 0, y: 0 },
				fromPoint: null,
				isExpectedOrDescendant: false,
				blockerSummary: "işaretli element DOM’da yok",
				pseudoBefore: null,
				pseudoAfter: null,
			});
			return;
		}

		const rect = expected.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;
		const found = document.elementFromPoint(x, y);
		const ownerForPseudo =
			found instanceof Element ? found : expected;

		setProbe({
			selector: key,
			expectedTarget: pathLabel(expected),
			center: { x: Math.round(x), y: Math.round(y) },
			fromPoint: describeElement(found),
			isExpectedOrDescendant: Boolean(
				found &&
					(found === expected ||
						expected.contains(found) ||
						found.contains(expected)),
			),
			blockerSummary: summarizeBlocker(expected, found),
			pseudoBefore: readPseudo(ownerForPseudo, "::before"),
			pseudoAfter: readPseudo(ownerForPseudo, "::after"),
		});
		refreshMetrics();
	}, [refreshMetrics]);

	const scanOverflow = useCallback(() => {
		const vw = window.innerWidth;
		const hits: OverflowHit[] = [];
		const all = document.body.querySelectorAll("*");

		for (const el of all) {
			if (!(el instanceof HTMLElement)) {
				continue;
			}
			if (el.closest("[data-mobile-debug-panel]")) {
				continue;
			}

			const rect = el.getBoundingClientRect();
			const overflowsRect =
				rect.right > vw + 1 || rect.left < -1;
			const overflowsScroll =
				el.scrollWidth > el.clientWidth + 1;

			if (!overflowsRect && !overflowsScroll) {
				continue;
			}

			const style = window.getComputedStyle(el);
			hits.push({
				tagName: el.tagName.toLowerCase(),
				id: el.id || "",
				className: (el.getAttribute("class") || "").slice(0, 120),
				dataMobileTarget: el.getAttribute("data-mobile-target") || "",
				left: Math.round(rect.left * 10) / 10,
				right: Math.round(rect.right * 10) / 10,
				width: Math.round(rect.width * 10) / 10,
				scrollWidth: el.scrollWidth,
				clientWidth: el.clientWidth,
				position: style.position,
				transform: style.transform,
			});

			if (hits.length >= 30) {
				break;
			}
		}

		setOverflowHits(hits);
		refreshMetrics();
	}, [refreshMetrics]);

	const latest = useMemo(() => {
		return (
			lastEvents.click ||
			lastEvents.pointerdown ||
			lastEvents.touchstart
		);
	}, [lastEvents]);

	if (process.env.NODE_ENV !== "development" || !enabled) {
		return null;
	}

	return (
		<div
			data-mobile-debug-panel="1"
			className="fixed bottom-10 right-2 z-[40] max-w-[min(100vw-1rem,22rem)] font-mono text-[10px] leading-snug"
		>
			{!open ? (
				<button
					type="button"
					className="rounded border border-lime-400/60 bg-black/85 px-3 py-2 text-lime-200"
					onClick={() => setOpen(true)}
				>
					Mobil Debug
				</button>
			) : (
				<div className="flex max-h-[45vh] w-[min(100vw-1rem,22rem)] max-w-full flex-col overflow-hidden rounded border border-lime-400/50 bg-black/92 text-lime-100 shadow-lg">
					<div className="flex shrink-0 items-center justify-between gap-2 border-b border-lime-400/30 px-2 py-1.5">
						<span className="font-semibold text-lime-300">
							Mobil Debug 6.7A
						</span>
						<button
							type="button"
							className="rounded px-2 py-0.5 text-lime-200 hover:bg-white/10"
							onClick={() => setOpen(false)}
						>
							Kapat
						</button>
					</div>

					<div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-2 [touch-action:pan-y]">
						<section className="space-y-0.5 break-words">
							<p>viewport: {viewport.w}×{viewport.h}</p>
							<p>scrollWidth: {scrollWidth}</p>
							<p>scrollX: {scrollX}</p>
						</section>

						<section className="space-y-1 border-t border-lime-400/20 pt-2">
							<p className="text-lime-300">Son eventler</p>
							{(
								["touchstart", "pointerdown", "click"] as const
							).map((type) => {
								const snap = lastEvents[type];
								return (
									<div key={type} className="rounded bg-white/5 p-1.5">
										<p className="text-lime-300">{type}</p>
										{snap ? (
											<>
												<p>
													target: {snap.target?.tagName}{" "}
													[{snap.target?.dataMobileTarget}] z=
													{snap.target?.zIndex} pe=
													{snap.target?.pointerEvents}
												</p>
												<p>
													fromPoint: {snap.fromPoint?.tagName}{" "}
													[{snap.fromPoint?.dataMobileTarget}] z=
													{snap.fromPoint?.zIndex} pe=
													{snap.fromPoint?.pointerEvents}
												</p>
												<p>
													path: {snap.composedPath.join(" > ")}
												</p>
												<p>
													pos={snap.target?.position} overflow=
													{snap.target?.overflow}
												</p>
												<p>rect: {snap.target?.rect}</p>
												<p>
													class: {snap.target?.className}
												</p>
											</>
										) : (
											<p>(henüz yok)</p>
										)}
									</div>
								);
							})}
							{latest ? (
								<p className="text-lime-200/80">
									Son birleşik: {latest.type} @ {latest.clientX},
									{latest.clientY}
								</p>
							) : null}
						</section>

						<section className="space-y-1 border-t border-lime-400/20 pt-2">
							<p className="text-lime-300">Hedefi Kontrol Et</p>
							<div className="flex flex-wrap gap-1">
								{TARGETS.map((item) => (
									<button
										key={item.key}
										type="button"
										className="rounded border border-lime-400/40 px-1.5 py-1 text-lime-100 hover:bg-white/10"
										onClick={() => probeTarget(item.key)}
									>
										{item.label}
									</button>
								))}
							</div>
							{probe ? (
								<div className="rounded bg-white/5 p-1.5 break-words">
									<p>
										{probe.selector} merkez ({probe.center.x},
										{probe.center.y})
									</p>
									<p>beklenen: {probe.expectedTarget}</p>
									<p>
										fromPoint: {probe.fromPoint?.tagName} [
										{probe.fromPoint?.dataMobileTarget}] z=
										{probe.fromPoint?.zIndex} pe=
										{probe.fromPoint?.pointerEvents}
									</p>
									<p>
										eşleşme:{" "}
										{probe.isExpectedOrDescendant
											? "EVET"
											: "HAYIR"}
									</p>
									<p>{probe.blockerSummary}</p>
									{probe.fromPoint ? (
										<>
											<p>pos={probe.fromPoint.position}</p>
											<p>overflow={probe.fromPoint.overflow}</p>
											<p>class={probe.fromPoint.className}</p>
											<p>rect={probe.fromPoint.rect}</p>
										</>
									) : null}
									{probe.pseudoBefore ? (
										<p>
											::before {JSON.stringify(probe.pseudoBefore)}
										</p>
									) : null}
									{probe.pseudoAfter ? (
										<p>
											::after {JSON.stringify(probe.pseudoAfter)}
										</p>
									) : null}
								</div>
							) : null}
						</section>

						<section className="space-y-1 border-t border-lime-400/20 pt-2">
							<button
								type="button"
								className="rounded border border-lime-400/40 px-2 py-1.5 text-lime-100 hover:bg-white/10"
								onClick={scanOverflow}
							>
								Taşan Elementleri Tara
							</button>
							{overflowHits.length > 0 ? (
								<ul className="space-y-1">
									{overflowHits.map((hit, index) => (
										<li
											key={`${hit.tagName}-${index}-${hit.left}`}
											className="rounded bg-white/5 p-1.5 break-words"
										>
											<p>
												#{index + 1} {hit.tagName}
												{hit.id ? `#${hit.id}` : ""} [
												{hit.dataMobileTarget || "-"}]
											</p>
											<p>
												L{hit.left} R{hit.right} W{hit.width} sw=
												{hit.scrollWidth} cw={hit.clientWidth}
											</p>
											<p>
												pos={hit.position} tf={hit.transform}
											</p>
											<p>class={hit.className || "(yok)"}</p>
										</li>
									))}
								</ul>
							) : (
								<p className="text-lime-200/70">
									Tarama sonucu burada listelenir (SVG/absolute
									gizlenmez).
								</p>
							)}
						</section>
					</div>
				</div>
			)}
		</div>
	);
}
