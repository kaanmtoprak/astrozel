"use client";

import {
	useEffect,
	useId,
	useRef,
	useState,
	type KeyboardEvent,
} from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Clock } from "lucide-react";
import { useIsMobileOverlay } from "@/hooks/use-media-query";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import {
	buildHourOptions,
	buildMinuteOptions,
	formatTimeSelection,
	parseTimeSelection,
} from "@/lib/time-options";
import { cn } from "@/lib/utils";

export type TimePickerProps = {
	id: string;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	hasError?: boolean;
	describedBy?: string;
	disabled?: boolean;
	className?: string;
};

const HOURS = buildHourOptions();
const MINUTES = buildMinuteOptions();

function TimeColumn({
	label,
	options,
	value,
	listboxId,
	onSelect,
	maxHeightClass = "max-h-[min(9.5rem,26vh)]",
}: {
	label: string;
	options: string[];
	value: string | null;
	listboxId: string;
	onSelect: (next: string) => void;
	maxHeightClass?: string;
}) {
	const listRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const list = listRef.current;
		if (!list || !value) {
			return;
		}
		const selected = list.querySelector<HTMLElement>(
			`[data-value="${value}"]`,
		);
		selected?.scrollIntoView({ block: "nearest" });
	}, [value]);

	function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
		const current =
			value && options.includes(value) ? options.indexOf(value) : 0;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			const next = options[Math.min(options.length - 1, current + 1)];
			if (next) {
				onSelect(next);
			}
			return;
		}
		if (event.key === "ArrowUp") {
			event.preventDefault();
			const next = options[Math.max(0, current - 1)];
			if (next) {
				onSelect(next);
			}
			return;
		}
		if (event.key === "Home") {
			event.preventDefault();
			onSelect(options[0]!);
			return;
		}
		if (event.key === "End") {
			event.preventDefault();
			onSelect(options[options.length - 1]!);
			return;
		}
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			if (options[current]) {
				onSelect(options[current]!);
			}
		}
	}

	return (
		<div className="flex min-w-0 flex-1 flex-col">
			<p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-foreground/50">
				{label}
			</p>
			<div
				ref={listRef}
				id={listboxId}
				role="listbox"
				aria-label={label}
				tabIndex={0}
				aria-activedescendant={
					value ? `${listboxId}-opt-${value}` : undefined
				}
				onKeyDown={handleKeyDown}
				className={cn(
					"astrozel-scroll astrozel-scroll-y overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-border bg-[color-mix(in_srgb,var(--muted)_55%,white)] p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [touch-action:pan-y]",
					maxHeightClass,
				)}
			>
				{options.map((option) => {
					const selected = option === value;
					return (
						<div
							key={option}
							id={`${listboxId}-opt-${option}`}
							role="option"
							aria-selected={selected}
							data-value={option}
							className={cn(
								"flex min-h-11 cursor-pointer select-none items-center justify-center rounded-xl text-base font-medium sm:text-sm",
								selected
									? "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_88%,white),color-mix(in_srgb,var(--lavender)_70%,var(--primary)))] text-primary-foreground shadow-sm"
									: "text-foreground/80 hover:bg-secondary",
							)}
							onPointerDown={(event) => {
								if (event.button !== 0 && event.pointerType !== "touch") {
									return;
								}
								event.preventDefault();
								onSelect(option);
							}}
						>
							{option}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function TimePickerBody({
	draftHour,
	draftMinute,
	setDraftHour,
	setDraftMinute,
	hourListId,
	minuteListId,
	compact = false,
}: {
	draftHour: string | null;
	draftMinute: string | null;
	setDraftHour: (value: string) => void;
	setDraftMinute: (value: string) => void;
	hourListId: string;
	minuteListId: string;
	compact?: boolean;
}) {
	return (
		<>
			<div className={cn("text-center", compact ? "px-4 pb-2 pt-3" : "pb-3")}>
				<p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
					Seçilen saat
				</p>
				<p className="mt-0.5 font-serif text-2xl tracking-tight text-foreground">
					<span>{draftHour ?? "--"}</span>
					<span className="mx-1 text-foreground/40" aria-hidden="true">
						:
					</span>
					<span>{draftMinute ?? "--"}</span>
				</p>
			</div>
			<div className={cn("flex gap-3", compact && "px-4")}>
				<TimeColumn
					label="Saat"
					options={HOURS}
					value={draftHour}
					listboxId={hourListId}
					onSelect={setDraftHour}
					maxHeightClass={
						compact
							? "max-h-[min(9.5rem,26vh)]"
							: "max-h-[min(14rem,40vh)]"
					}
				/>
				<div
					className="flex items-center pt-7 text-xl font-medium text-foreground/35"
					aria-hidden="true"
				>
					:
				</div>
				<TimeColumn
					label="Dakika"
					options={MINUTES}
					value={draftMinute}
					listboxId={minuteListId}
					onSelect={setDraftMinute}
					maxHeightClass={
						compact
							? "max-h-[min(9.5rem,26vh)]"
							: "max-h-[min(14rem,40vh)]"
					}
				/>
			</div>
		</>
	);
}

export function TimePicker({
	id,
	value,
	onChange,
	onBlur,
	hasError = false,
	describedBy,
	disabled = false,
	className,
}: TimePickerProps) {
	const isMobile = useIsMobileOverlay();
	const [open, setOpen] = useState(false);
	const parsed = parseTimeSelection(value);
	const [draftHour, setDraftHour] = useState<string | null>(parsed.hour);
	const [draftMinute, setDraftMinute] = useState<string | null>(parsed.minute);
	const hourListId = useId();
	const minuteListId = useId();

	const display = formatTimeSelection(parsed.hour, parsed.minute);
	const draftComplete = Boolean(formatTimeSelection(draftHour, draftMinute));

	function handleOpenChange(next: boolean) {
		const synced = parseTimeSelection(value);
		setDraftHour(synced.hour);
		setDraftMinute(synced.minute);
		setOpen(next);
	}

	const trigger = (
		<button
			id={id}
			type="button"
			disabled={disabled}
			data-mobile-target="time-trigger"
			aria-describedby={describedBy}
			aria-haspopup="dialog"
			aria-expanded={open}
			aria-label={display ? `Doğum saati: ${display}` : "Doğum saatini seç"}
			data-invalid={hasError ? "true" : undefined}
			onBlur={onBlur}
			onClick={() => {
				if (isMobile && !disabled) {
					handleOpenChange(true);
				}
			}}
			className={cn(
				"astrozel-field-trigger inline-flex min-h-12 w-full items-center gap-3 rounded-2xl border bg-card px-4 text-left text-base shadow-sm sm:text-sm",
				"hover:border-primary/35 hover:bg-[color-mix(in_srgb,var(--sky-blue)_18%,white)]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				"disabled:cursor-not-allowed disabled:opacity-50",
				hasError ? "border-red-400" : "border-border",
				open && "border-primary/45 ring-2 ring-primary/20",
				display ? "text-foreground" : "text-foreground/40",
				className,
			)}
		>
			<Clock
				className="pointer-events-none h-5 w-5 shrink-0 text-primary"
				aria-hidden="true"
				strokeWidth={1.75}
			/>
			<span className="min-w-0 flex-1 truncate">
				{display ?? "Doğum saatini seç"}
			</span>
			<ChevronDown
				className={cn(
					"pointer-events-none h-4 w-4 shrink-0 text-primary/80 transition-transform",
					open && "rotate-180",
				)}
				aria-hidden="true"
			/>
		</button>
	);

	const footer = (
		<div className="flex justify-end gap-2">
			<button
				type="button"
				className="min-h-11 rounded-xl px-4 text-sm font-medium text-foreground/70 touch-manipulation hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
				onClick={() => {
					setDraftHour(null);
					setDraftMinute(null);
					onChange("");
					setOpen(false);
				}}
			>
				Temizle
			</button>
			<button
				type="button"
				disabled={!draftComplete}
				className="min-h-11 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground touch-manipulation hover:bg-[color-mix(in_srgb,var(--primary)_90%,#1b2a4a)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-45"
				onClick={() => {
					const next = formatTimeSelection(draftHour, draftMinute);
					if (!next) {
						return;
					}
					onChange(next);
					setOpen(false);
				}}
			>
				Tamam
			</button>
		</div>
	);

	if (isMobile) {
		return (
			<>
				{trigger}
				<MobileSheet
					open={open}
					onOpenChange={handleOpenChange}
					title="Doğum saati"
					description="Saat ve dakikayı seç, ardından Tamam’a dokun."
					variant="bottom"
					testId="time-sheet"
					footer={footer}
				>
					<TimePickerBody
						draftHour={draftHour}
						draftMinute={draftMinute}
						setDraftHour={setDraftHour}
						setDraftMinute={setDraftMinute}
						hourListId={hourListId}
						minuteListId={minuteListId}
					/>
				</MobileSheet>
			</>
		);
	}

	return (
		<Popover.Root modal open={open} onOpenChange={handleOpenChange}>
			<Popover.Trigger asChild>{trigger}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					align="start"
					sideOffset={8}
					collisionPadding={12}
					avoidCollisions
					aria-label="Doğum saati seçici"
					className="astrozel-popover flex max-h-[min(70dvh,28rem)] w-[min(calc(100%-1.5rem),22rem)] max-w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-3xl border border-border/90 bg-card shadow-xl outline-none"
					style={{ zIndex: "var(--astrozel-z-dropdown)" }}
				>
					<TimePickerBody
						draftHour={draftHour}
						draftMinute={draftMinute}
						setDraftHour={setDraftHour}
						setDraftMinute={setDraftMinute}
						hourListId={hourListId}
						minuteListId={minuteListId}
						compact
					/>
					<div className="mt-3 shrink-0 border-t border-border/70 bg-card px-4 py-3">
						{footer}
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
