"use client";

import { useId, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import {
	dailySkyHref,
	shiftDailySkyDate,
} from "@/features/daily-sky/utils/daily-sky-date";
import { formatDailySkyDisplayDate } from "@/features/daily-sky/utils/daily-sky-format";
import { getMinBirthDate, parseDateOnly } from "@/lib/date";
import { cn } from "@/lib/utils";

const navLinkClassName = cn(
	"inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center gap-1 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground",
	"transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
);

/** Wide calendar window for sky snapshots (not birth-date capped at today). */
const DAILY_SKY_MAX_DATE = new Date(2200, 11, 31);

export function DateNavigation({ date }: { date: string }) {
	const router = useRouter();
	const datePickerId = useId();
	const previousDate = shiftDailySkyDate(date, -1);
	const nextDate = shiftDailySkyDate(date, 1);
	const displayDate = formatDailySkyDisplayDate(date);
	const minDate = useMemo(() => getMinBirthDate(), []);
	const maxDate = useMemo(() => DAILY_SKY_MAX_DATE, []);

	return (
		<nav
			aria-label="Tarih navigasyonu"
			className="flex min-w-0 flex-col gap-3"
		>
			<div className="flex min-w-0 items-stretch gap-2">
				<Link
					href={dailySkyHref(previousDate)}
					className={cn(navLinkClassName, "flex-1")}
					prefetch={false}
				>
					<ChevronLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
					<span className="truncate">Önceki gün</span>
				</Link>
				<Link
					href={dailySkyHref(nextDate)}
					className={cn(navLinkClassName, "flex-1")}
					prefetch={false}
				>
					<span className="truncate">Sonraki gün</span>
					<ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
				</Link>
			</div>

			<p className="text-center font-serif text-xl tracking-tight text-foreground">
				{displayDate}
			</p>

			<div className="min-w-0 space-y-2">
				<label
					htmlFor={datePickerId}
					className="block text-sm font-medium text-foreground"
				>
					Tarih seç
				</label>
				<DatePicker
					id={datePickerId}
					value={date}
					minDate={minDate}
					maxDate={maxDate}
					placeholder="Tarih seç"
					dialogTitle="Tarih seç"
					dialogDescription="Gökyüzü görünümü için günü seç."
					allowClear={false}
					onChange={(next) => {
						if (!next || !parseDateOnly(next)) {
							return;
						}
						if (next === date) {
							return;
						}
						router.push(dailySkyHref(next));
					}}
				/>
			</div>
		</nav>
	);
}
