"use client";

import { useEffect, useId, useMemo, useState, type ChangeEvent } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { DayPicker, type DropdownProps } from "react-day-picker";
import { tr as dayPickerTr } from "react-day-picker/locale";
import { useIsMobileOverlay } from "@/hooks/use-media-query";
import { MobileSheet } from "@/components/ui/mobile-sheet";
import {
	formatDateOnly,
	formatDateOnlyDisplay,
	getMaxBirthDate,
	getMinBirthDate,
	parseDateOnly,
} from "@/lib/date";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

export type DatePickerProps = {
	id: string;
	value: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	hasError?: boolean;
	describedBy?: string;
	disabled?: boolean;
	className?: string;
};

type SheetView = "calendar" | "month" | "year";

const MONTH_LABELS = Array.from({ length: 12 }, (_, index) =>
	format(new Date(2000, index, 1), "LLLL", { locale: tr }),
);

function CalendarDropdown({
	options,
	value,
	onChange,
	disabled,
	className,
	"aria-label": ariaLabel,
}: DropdownProps) {
	const stringValue = value === undefined || value === null ? "" : String(value);
	const safeOptions = options ?? [];

	return (
		<Select.Root
			value={stringValue || undefined}
			disabled={disabled || safeOptions.length === 0}
			onValueChange={(next) => {
				onChange?.({
					target: { value: next },
				} as ChangeEvent<HTMLSelectElement>);
			}}
		>
			<Select.Trigger
				aria-label={ariaLabel}
				className={cn(
					"inline-flex h-10 min-w-[5.5rem] flex-1 items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm",
					"hover:border-primary/40 hover:bg-[color-mix(in_srgb,var(--sky-blue)_25%,white)]",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
					"disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
			>
				<Select.Value placeholder="—" />
				<Select.Icon>
					<ChevronDown className="h-4 w-4 text-primary" aria-hidden="true" />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content
					position="popper"
					sideOffset={6}
					collisionPadding={16}
					className="astrozel-select-content max-h-56 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-card shadow-lg"
					style={{ zIndex: "var(--astrozel-z-sheet-nested)" }}
				>
					<Select.Viewport className="astrozel-scroll max-h-56 p-1">
						{safeOptions.map((option) => (
							<Select.Item
								key={String(option.value)}
								value={String(option.value)}
								disabled={option.disabled}
								className={cn(
									"relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none",
									"data-[highlighted]:bg-secondary data-[state=checked]:bg-lavender/55 data-[state=checked]:font-medium",
									"data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
								)}
							>
								<Select.ItemText>{option.label}</Select.ItemText>
							</Select.Item>
						))}
					</Select.Viewport>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	);
}

function MobileDateSheetBody({
	value,
	onChange,
	onClose,
}: {
	value: string;
	onChange: (value: string) => void;
	onClose: () => void;
}) {
	const startMonth = useMemo(() => getMinBirthDate(), []);
	const endMonth = useMemo(() => getMaxBirthDate(), []);
	const selectedDate = useMemo(() => parseDateOnly(value), [value]);
	const [view, setView] = useState<SheetView>("calendar");
	const [displayMonth, setDisplayMonth] = useState<Date>(
		() => selectedDate ?? endMonth,
	);
	const yearListId = useId();

	useEffect(() => {
		if (view !== "year") {
			return;
		}
		const selected = document.getElementById(
			`${yearListId}-y-${displayMonth.getFullYear()}`,
		);
		selected?.scrollIntoView({ block: "center" });
	}, [view, displayMonth, yearListId]);

	const minYear = startMonth.getFullYear();
	const maxYear = endMonth.getFullYear();
	const years = useMemo(() => {
		const list: number[] = [];
		for (let year = maxYear; year >= minYear; year -= 1) {
			list.push(year);
		}
		return list;
	}, [minYear, maxYear]);

	const displayLabel = selectedDate
		? formatDateOnlyDisplay(value)
		: "Doğum tarihini seç";

	return (
		<div className="space-y-3">
			<div className="border-b border-border/70 pb-3">
				<p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
					Seçilen tarih
				</p>
				<p className="mt-1 font-serif text-xl text-foreground">{displayLabel}</p>
			</div>

			{view === "calendar" ? (
				<>
					<div className="flex items-center gap-2">
						<button
							type="button"
							aria-label="Önceki ay"
							className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							onClick={() =>
								setDisplayMonth(
									new Date(
										displayMonth.getFullYear(),
										displayMonth.getMonth() - 1,
										1,
									),
								)
							}
						>
							<ChevronLeft className="pointer-events-none h-5 w-5" />
						</button>
						<button
							type="button"
							aria-label="Ay seç"
							className="inline-flex min-h-11 min-w-0 flex-1 touch-manipulation items-center justify-center rounded-xl border border-border px-2 text-sm font-medium capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							onClick={() => setView("month")}
						>
							{MONTH_LABELS[displayMonth.getMonth()]}
						</button>
						<button
							type="button"
							aria-label="Yıl seç"
							className="inline-flex min-h-11 min-w-[4.5rem] touch-manipulation items-center justify-center rounded-xl border border-border px-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							onClick={() => setView("year")}
						>
							{displayMonth.getFullYear()}
						</button>
						<button
							type="button"
							aria-label="Sonraki ay"
							className="inline-flex h-11 w-11 touch-manipulation items-center justify-center rounded-xl border border-border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							onClick={() =>
								setDisplayMonth(
									new Date(
										displayMonth.getFullYear(),
										displayMonth.getMonth() + 1,
										1,
									),
								)
							}
						>
							<ChevronRight className="pointer-events-none h-5 w-5" />
						</button>
					</div>

					<DayPicker
						mode="single"
						locale={dayPickerTr}
						weekStartsOn={1}
						month={displayMonth}
						onMonthChange={setDisplayMonth}
						hideNavigation
						selected={selectedDate}
						startMonth={startMonth}
						endMonth={endMonth}
						disabled={[{ before: startMonth }, { after: endMonth }]}
						onSelect={(date) => {
							if (!date) {
								return;
							}
							onChange(formatDateOnly(date));
							onClose();
						}}
						className="astrozel-day-picker w-full"
					/>
				</>
			) : null}

			{view === "month" ? (
				<div className="grid grid-cols-3 gap-2">
					{MONTH_LABELS.map((label, index) => (
						<button
							key={label}
							type="button"
							className={cn(
								"min-h-11 touch-manipulation rounded-xl border px-2 text-sm capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
								index === displayMonth.getMonth()
									? "border-primary bg-secondary font-medium"
									: "border-border",
							)}
							onClick={() => {
								setDisplayMonth(
									new Date(displayMonth.getFullYear(), index, 1),
								);
								setView("calendar");
							}}
						>
							{label}
						</button>
					))}
				</div>
			) : null}

			{view === "year" ? (
				<div
					className="astrozel-scroll max-h-64 overflow-y-auto overscroll-contain [touch-action:pan-y]"
					role="listbox"
					aria-label="Yıl"
				>
					{years.map((year) => {
						const selected = year === displayMonth.getFullYear();
						return (
							<button
								key={year}
								id={`${yearListId}-y-${year}`}
								type="button"
								role="option"
								aria-selected={selected}
								className={cn(
									"flex min-h-11 w-full touch-manipulation items-center justify-center rounded-xl text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
									selected
										? "bg-secondary font-semibold text-foreground"
										: "text-foreground/80 hover:bg-muted",
								)}
								onClick={() => {
									setDisplayMonth(new Date(year, displayMonth.getMonth(), 1));
									setView("calendar");
								}}
							>
								{year}
							</button>
						);
					})}
				</div>
			) : null}

			{view !== "calendar" ? (
				<button
					type="button"
					className="min-h-11 w-full touch-manipulation rounded-xl border border-border text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					onClick={() => setView("calendar")}
				>
					Takvime dön
				</button>
			) : null}
		</div>
	);
}

export function DatePicker({
	id,
	value,
	onChange,
	onBlur,
	hasError = false,
	describedBy,
	disabled = false,
	className,
}: DatePickerProps) {
	const isMobile = useIsMobileOverlay();
	const [open, setOpen] = useState(false);

	const selectedDate = useMemo(() => parseDateOnly(value), [value]);
	const startMonth = useMemo(() => getMinBirthDate(), []);
	const endMonth = useMemo(() => getMaxBirthDate(), []);
	const displayLabel = selectedDate
		? formatDateOnlyDisplay(value)
		: "Doğum tarihini seç";

	const trigger = (
		<button
			id={id}
			type="button"
			disabled={disabled}
			data-mobile-target="date-trigger"
			aria-describedby={describedBy}
			aria-haspopup="dialog"
			aria-expanded={open}
			aria-label={
				selectedDate ? `Doğum tarihi: ${displayLabel}` : "Doğum tarihini seç"
			}
			data-invalid={hasError ? "true" : undefined}
			onBlur={onBlur}
			onClick={() => {
				if (isMobile && !disabled) {
					setOpen(true);
				}
			}}
			className={cn(
				"astrozel-field-trigger group inline-flex min-h-12 w-full items-center gap-3 rounded-2xl border bg-card px-4 text-left text-base shadow-sm sm:text-sm",
				"hover:border-primary/35 hover:bg-[color-mix(in_srgb,var(--sky-blue)_18%,white)]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				"disabled:cursor-not-allowed disabled:opacity-50",
				hasError ? "border-red-400" : "border-border",
				open && "border-primary/45 ring-2 ring-primary/20",
				selectedDate ? "text-foreground" : "text-foreground/40",
				className,
			)}
		>
			<CalendarDays
				className="pointer-events-none h-5 w-5 shrink-0 text-primary"
				aria-hidden="true"
				strokeWidth={1.75}
			/>
			<span className="min-w-0 flex-1 truncate">{displayLabel}</span>
			<ChevronDown
				className={cn(
					"pointer-events-none h-4 w-4 shrink-0 text-primary/80 transition-transform",
					open && "rotate-180",
				)}
				aria-hidden="true"
			/>
		</button>
	);

	if (isMobile) {
		return (
			<>
				{trigger}
				<MobileSheet
					open={open}
					onOpenChange={setOpen}
					title="Doğum tarihi"
					description="Ay, yıl ve günü seç."
					variant="bottom"
					testId="date-sheet"
					footer={
						<div className="flex justify-end gap-2">
							<button
								type="button"
								className="min-h-11 rounded-xl px-4 text-sm font-medium text-foreground/70 touch-manipulation hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								onClick={() => setOpen(false)}
							>
								Kapat
							</button>
							<button
								type="button"
								className="min-h-11 rounded-xl px-4 text-sm font-medium text-primary touch-manipulation hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
								onClick={() => {
									onChange("");
									setOpen(false);
								}}
							>
								Temizle
							</button>
						</div>
					}
				>
					<MobileDateSheetBody
						value={value}
						onChange={onChange}
						onClose={() => setOpen(false)}
					/>
				</MobileSheet>
			</>
		);
	}

	return (
		<Popover.Root modal open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>{trigger}</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					align="start"
					sideOffset={8}
					collisionPadding={16}
					aria-label="Doğum tarihi seçici"
					className={cn(
						"astrozel-popover w-[min(calc(100%-1.5rem),24rem)] max-w-[calc(100%-1.5rem)] rounded-3xl border border-border/90 bg-card p-4 shadow-xl outline-none",
					)}
					style={{ zIndex: "var(--astrozel-z-dropdown)" }}
				>
					<div className="mb-3 border-b border-border/70 pb-3">
						<p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
							Seçilen tarih
						</p>
						<p className="mt-1 font-serif text-xl text-foreground">
							{selectedDate ? displayLabel : "Doğum tarihini seç"}
						</p>
					</div>

					<DayPicker
						mode="single"
						locale={dayPickerTr}
						weekStartsOn={1}
						captionLayout="dropdown"
						navLayout="after"
						reverseYears
						selected={selectedDate}
						defaultMonth={selectedDate ?? endMonth}
						startMonth={startMonth}
						endMonth={endMonth}
						disabled={[{ before: startMonth }, { after: endMonth }]}
						onSelect={(date) => {
							if (!date) {
								return;
							}
							onChange(formatDateOnly(date));
							setOpen(false);
						}}
						components={{
							Dropdown: CalendarDropdown,
						}}
						className="astrozel-day-picker w-full"
					/>

					<div className="mt-3 flex justify-end gap-2 border-t border-border/70 pt-3">
						<button
							type="button"
							className="rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							onClick={() => setOpen(false)}
						>
							Kapat
						</button>
						<button
							type="button"
							className="rounded-xl px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							onClick={() => {
								onChange("");
								setOpen(false);
							}}
						>
							Temizle
						</button>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
