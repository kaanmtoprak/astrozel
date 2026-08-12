import type { DailySkyPlanet } from "@/features/daily-sky/types/daily-sky";
import { formatDegreeMinute } from "@/features/daily-sky/utils/daily-sky-format";

export function LuminaryCards({
	sun,
	moon,
	moonPhaseName,
}: {
	sun: DailySkyPlanet;
	moon: DailySkyPlanet;
	moonPhaseName: string;
}) {
	return (
		<section
			aria-labelledby="luminaries-heading"
			className="grid gap-4 sm:grid-cols-2"
		>
			<h2 id="luminaries-heading" className="sr-only">
				Güneş ve Ay
			</h2>
			<article className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm">
				<p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/55">
					Güneş
				</p>
				<p className="mt-2 font-serif text-2xl text-foreground">
					<span aria-hidden="true" className="mr-2 text-primary">
						{sun.symbol}
					</span>
					{sun.signLabel}
				</p>
				<p className="mt-1 text-sm text-foreground/70">
					{formatDegreeMinute(sun.degree, sun.minute)}
				</p>
			</article>
			<article className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm">
				<p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/55">
					Ay
				</p>
				<p className="mt-2 font-serif text-2xl text-foreground">
					<span aria-hidden="true" className="mr-2 text-primary">
						{moon.symbol}
					</span>
					{moon.signLabel}
				</p>
				<p className="mt-1 text-sm text-foreground/70">
					{formatDegreeMinute(moon.degree, moon.minute)} · {moonPhaseName}
				</p>
			</article>
		</section>
	);
}
