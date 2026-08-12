import type { CompositeChartResult } from "@/features/synastry/composite/types/composite";
import { formatCompositeDegreeMinute } from "@/features/synastry/composite/utils/composite-format";

export function CompositeSummary({
	composite,
}: {
	composite: CompositeChartResult;
}) {
	const { sun, moon, venus, mars, highlightAspect } = composite.summary;
	const items = [
		{ label: "Güneş", planet: sun },
		{ label: "Ay", planet: moon },
		{ label: "Venüs", planet: venus },
		{ label: "Mars", planet: mars },
	] as const;

	return (
		<section
			aria-labelledby="composite-summary-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="composite-summary-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Öne çıkan yerleşimler
			</h2>
			<ul className="mt-4 grid gap-3 sm:grid-cols-2">
				{items.map((item) => (
					<li
						key={item.label}
						className="min-w-0 rounded-2xl bg-muted/60 px-4 py-3"
					>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/55">
							{item.label}
						</p>
						<p className="mt-1 font-serif text-lg text-foreground">
							<span aria-hidden="true" className="mr-1.5 text-primary">
								{item.planet.symbol}
							</span>
							{item.planet.signLabel}
						</p>
						<p className="mt-0.5 text-sm text-foreground/70">
							{formatCompositeDegreeMinute(
								item.planet.degree,
								item.planet.minute,
							)}
						</p>
					</li>
				))}
			</ul>
			{highlightAspect ? (
				<p className="mt-4 text-sm leading-relaxed text-foreground/75">
					<strong className="font-medium text-foreground">
						En güçlü major açı:
					</strong>{" "}
					{highlightAspect.symbol} {highlightAspect.planetAName}{" "}
					{highlightAspect.typeLabel} {highlightAspect.planetBName} (orb{" "}
					{highlightAspect.orb.toFixed(2)}°)
				</p>
			) : null}
		</section>
	);
}
