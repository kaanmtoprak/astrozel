import type { DailySkySummary } from "@/features/daily-sky/types/daily-sky";

export function SkySummary({
	summary,
}: {
	summary: DailySkySummary;
}) {
	const items = [
		{ label: "Güneş", value: summary.sunSignLabel },
		{ label: "Ay", value: summary.moonSignLabel },
		{ label: "Ay Fazı", value: summary.moonPhaseName },
		{
			label: "Retro",
			value:
				summary.retrogradeCount === 0
					? "Yok"
					: `${summary.retrogradeCount} gezegen`,
		},
		{
			label: "Önemli açı",
			value: summary.highlightAspectLabel ?? "Belirgin major açı yok",
		},
	] as const;

	return (
		<section
			aria-labelledby="daily-sky-summary-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="daily-sky-summary-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Günün özeti
			</h2>
			<ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{items.map((item) => (
					<li
						key={item.label}
						className="min-w-0 rounded-2xl bg-muted/60 px-4 py-3"
					>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/55">
							{item.label}
						</p>
						<p className="mt-1 break-words text-sm font-medium text-foreground sm:text-base">
							{item.value}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}
