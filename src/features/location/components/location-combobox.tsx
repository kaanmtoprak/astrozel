"use client";

import {
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import { useIsMobileOverlay } from "@/hooks/use-media-query";
import { useLocationSearch } from "@/features/location/hooks/use-location-search";
import type { BirthLocation } from "@/features/location/types/location";
import { buildLocationOptionLabel } from "@/features/location/utils/location-label";
import { cn } from "@/lib/utils";

export type LocationComboboxProps = {
	id: string;
	label: string;
	value: string;
	selectedLocation: BirthLocation | null;
	onQueryChange: (value: string) => void;
	onLocationChange: (location: BirthLocation | null) => void;
	onBusyChange?: (busy: boolean) => void;
	hasError?: boolean;
	describedBy?: string;
	className?: string;
	/** Chrome iOS may inject __gcruniqueid before React hydration. */
	suppressBrowserHydrationWarning?: boolean;
};

type ListPosition = {
	top: number;
	left: number;
	width: number;
	maxHeight: number;
};

export function LocationCombobox({
	id,
	label,
	value,
	selectedLocation,
	onQueryChange,
	onLocationChange,
	onBusyChange,
	hasError = false,
	describedBy,
	className,
	suppressBrowserHydrationWarning = false,
}: LocationComboboxProps) {
	const isMobile = useIsMobileOverlay();
	const listboxId = useId();
	const statusId = useId();
	const optionIdPrefix = useId();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [desktopOpen, setDesktopOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [listPosition, setListPosition] = useState<ListPosition | null>(null);
	const [sheetQuery, setSheetQuery] = useState("");
	const rootRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const listRef = useRef<HTMLUListElement | null>(null);
	const searchInputRef = useRef<HTMLInputElement | null>(null);

	const activeQuery = isMobile && sheetOpen ? sheetQuery : value;

	const {
		status,
		results,
		activeIndex,
		setActiveIndex,
		isResolvingTimezone,
		statusMessage,
		handleQueryChange,
		selectResult,
	} = useLocationSearch({
		query: activeQuery,
		selectedLocation,
		onLocationChange,
		onQueryChange: isMobile && sheetOpen ? setSheetQuery : onQueryChange,
		onBusyChange,
	});

	useEffect(() => {
		const frame = window.requestAnimationFrame(() => setMounted(true));
		return () => window.cancelAnimationFrame(frame);
	}, []);

	const showDesktopList =
		!isMobile && desktopOpen && status === "results" && results.length > 0;

	const updateListPosition = () => {
		const input = inputRef.current;
		if (!input) {
			return;
		}
		const rect = input.getBoundingClientRect();
		const gutter = 12;
		const viewportH = window.innerHeight;
		const spaceBelow = viewportH - rect.bottom - gutter;
		const spaceAbove = rect.top - gutter;
		const preferBelow = spaceBelow >= 120 || spaceBelow >= spaceAbove;
		const maxHeight = Math.min(
			288,
			Math.max(120, preferBelow ? spaceBelow : spaceAbove),
		);
		const top = preferBelow
			? rect.bottom + 4
			: Math.max(gutter, rect.top - maxHeight - 4);

		setListPosition({
			top,
			left: Math.max(
				gutter,
				Math.min(rect.left, window.innerWidth - rect.width - gutter),
			),
			width: Math.min(rect.width, window.innerWidth - gutter * 2),
			maxHeight,
		});
	};

	useLayoutEffect(() => {
		if (!showDesktopList) {
			return;
		}
		updateListPosition();
		window.addEventListener("resize", updateListPosition);
		window.addEventListener("scroll", updateListPosition, true);
		return () => {
			window.removeEventListener("resize", updateListPosition);
			window.removeEventListener("scroll", updateListPosition, true);
		};
	}, [showDesktopList, results.length]);

	useEffect(() => {
		function handlePointerDown(event: PointerEvent) {
			const target = event.target as Node;
			if (
				rootRef.current?.contains(target) ||
				listRef.current?.contains(target)
			) {
				return;
			}
			setDesktopOpen(false);
			setActiveIndex(-1);
		}

		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [setActiveIndex]);

	async function onSelectOption(index: number) {
		const result = results[index];
		if (!result) {
			return;
		}
		const ok = await selectResult(result);
		setDesktopOpen(false);
		if (ok) {
			setSheetOpen(false);
			onQueryChange(result.displayName);
		}
	}

	function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "ArrowDown") {
			if (!desktopOpen && results.length > 0) {
				setDesktopOpen(true);
				setActiveIndex(0);
				event.preventDefault();
				return;
			}
			if (results.length > 0) {
				event.preventDefault();
				setDesktopOpen(true);
				setActiveIndex((current) =>
					current < results.length - 1 ? current + 1 : 0,
				);
			}
			return;
		}
		if (event.key === "ArrowUp") {
			if (results.length > 0) {
				event.preventDefault();
				setDesktopOpen(true);
				setActiveIndex((current) =>
					current > 0 ? current - 1 : results.length - 1,
				);
			}
			return;
		}
		if (event.key === "Enter") {
			if (desktopOpen && activeIndex >= 0 && results[activeIndex]) {
				event.preventDefault();
				void onSelectOption(activeIndex);
			}
			return;
		}
		if (event.key === "Escape") {
			if (desktopOpen) {
				event.preventDefault();
				setDesktopOpen(false);
				setActiveIndex(-1);
			}
		}
	}

	const activeOptionId =
		activeIndex >= 0 ? `${optionIdPrefix}-option-${activeIndex}` : undefined;

	const resultsList = (
		<ul
			ref={listRef}
			id={listboxId}
			role="listbox"
			aria-label="Konum sonuçları"
			className="astrozel-scroll space-y-0 overflow-y-auto overscroll-contain [touch-action:pan-y]"
		>
			{results.map((result, index) => {
				const selected = index === activeIndex;
				const secondary = [result.adminName1, result.countryName]
					.filter(Boolean)
					.join(", ");
				return (
					<li
						key={result.geonameId}
						id={`${optionIdPrefix}-option-${index}`}
						role="option"
						aria-selected={selected}
						data-mobile-target="location-option"
						className={cn(
							"cursor-pointer touch-manipulation px-3.5 py-3 text-base text-foreground sm:text-sm",
							selected ? "bg-secondary" : "hover:bg-muted",
						)}
						onMouseEnter={() => setActiveIndex(index)}
						onPointerDown={(event) => {
							event.preventDefault();
							void onSelectOption(index);
						}}
					>
						<p className="break-words font-medium leading-snug">{result.name}</p>
						{secondary ? (
							<p className="mt-0.5 break-words text-xs leading-snug text-foreground/60">
								{secondary}
							</p>
						) : null}
						<span className="sr-only">{buildLocationOptionLabel(result)}</span>
					</li>
				);
			})}
		</ul>
	);

	if (isMobile) {
		const triggerLabel = selectedLocation?.displayName ?? value;
		return (
			<div className={cn("relative z-10 min-w-0 space-y-2", className)}>
				<span className="block text-sm font-medium text-foreground">{label}</span>
				<button
					id={id}
					type="button"
					data-mobile-target="location-trigger"
					aria-haspopup="dialog"
					aria-expanded={sheetOpen}
					aria-label="Doğum Yeri"
					aria-describedby={describedBy}
					disabled={isResolvingTimezone}
					data-invalid={hasError ? "true" : undefined}
					className={cn(
						"astrozel-field-trigger inline-flex min-h-12 w-full items-center gap-3 rounded-2xl border bg-card px-4 text-left text-base shadow-sm",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
						hasError ? "border-red-400" : "border-border",
						triggerLabel ? "text-foreground" : "text-foreground/40",
					)}
					onClick={() => {
						setSheetQuery(selectedLocation ? "" : value);
						setSheetOpen(true);
					}}
				>
					<MapPin
						className="pointer-events-none h-5 w-5 shrink-0 text-primary"
						aria-hidden="true"
					/>
					<span className="min-w-0 flex-1 truncate break-words">
						{triggerLabel || "İlçe, şehir veya yerleşim yeri ara"}
					</span>
					<ChevronDown
						className="pointer-events-none h-4 w-4 shrink-0 text-primary/80"
						aria-hidden="true"
					/>
				</button>
				<div id={statusId} className="min-h-5 text-xs text-foreground/60">
					{selectedLocation ? (
						<span className="text-primary">
							Konum seçildi
							<span className="text-foreground/55">
								{" "}
								· Saat dilimi: {selectedLocation.timezone}
							</span>
						</span>
					) : null}
				</div>

				<MobileSheet
					open={sheetOpen}
					onOpenChange={(next) => {
						setSheetOpen(next);
						if (!next) {
							setSheetQuery("");
						}
					}}
					title="Doğum yeri"
					description="En az iki karakter yazarak yerleşim ara."
					variant="full"
					testId="location-sheet"
					initialFocusRef={searchInputRef}
				>
					<div className="space-y-3">
						{/* Chrome iOS may inject __gcruniqueid before React hydration.
						    Suppression is intentionally limited to this exact form/input surface. */}
						<Input
							ref={searchInputRef}
							data-mobile-target="location-search-input"
							type="text"
							role="combobox"
							autoComplete="off"
							spellCheck={false}
							placeholder="İlçe, şehir veya yerleşim yeri ara"
							value={sheetQuery}
							disabled={isResolvingTimezone}
							aria-autocomplete="list"
							aria-expanded={status === "results"}
							aria-controls={listboxId}
							suppressHydrationWarning={suppressBrowserHydrationWarning}
							onChange={(event) => {
								handleQueryChange(event.target.value);
								setDesktopOpen(true);
							}}
						/>
						<div className="min-h-5 text-xs text-foreground/60" aria-live="polite">
							{statusMessage}
						</div>
						{status === "results" && results.length > 0 ? (
							<div className="max-h-[min(50vh,20rem)] overflow-hidden rounded-2xl border border-border">
								{resultsList}
							</div>
						) : null}
					</div>
				</MobileSheet>
			</div>
		);
	}

	return (
		<div
			ref={rootRef}
			className={cn("relative z-10 min-w-0 space-y-2 overflow-visible", className)}
		>
			<label htmlFor={id} className="block text-sm font-medium text-foreground">
				{label}
			</label>

			{/* Chrome iOS may inject __gcruniqueid before React hydration.
			    Suppression is intentionally limited to this exact form/input surface. */}
			<Input
				ref={inputRef}
				id={id}
				type="text"
				role="combobox"
				autoComplete="off"
				spellCheck={false}
				data-mobile-target="location-input"
				placeholder="İlçe, şehir veya yerleşim yeri ara"
				value={value}
				hasError={hasError}
				aria-autocomplete="list"
				aria-expanded={showDesktopList}
				aria-controls={listboxId}
				aria-activedescendant={showDesktopList ? activeOptionId : undefined}
				aria-describedby={
					[describedBy, statusId].filter(Boolean).join(" ") || undefined
				}
				disabled={isResolvingTimezone}
				suppressHydrationWarning={suppressBrowserHydrationWarning}
				onChange={(event) => {
					handleQueryChange(event.target.value);
					setDesktopOpen(true);
				}}
				onKeyDown={handleKeyDown}
				onFocus={() => {
					if (results.length > 0 && !selectedLocation) {
						setDesktopOpen(true);
					}
				}}
			/>

			<div
				id={statusId}
				className="min-h-5 text-xs text-foreground/60"
				aria-live="polite"
			>
				{statusMessage}
				{!statusMessage && selectedLocation ? (
					<span className="text-primary">
						Konum seçildi
						<span className="text-foreground/55">
							{" "}
							· Saat dilimi: {selectedLocation.timezone}
						</span>
					</span>
				) : null}
			</div>

			{mounted && showDesktopList && listPosition
				? createPortal(
						<div
							className="astrozel-dropdown-surface fixed max-w-[calc(100%-1.5rem)] overflow-hidden rounded-2xl border border-border bg-card py-2 shadow-lg"
							style={{
								top: listPosition.top,
								left: listPosition.left,
								width: listPosition.width,
								maxHeight: listPosition.maxHeight,
								zIndex: "var(--astrozel-z-dropdown)",
							}}
						>
							{resultsList}
						</div>,
						document.body,
					)
				: null}
		</div>
	);
}
