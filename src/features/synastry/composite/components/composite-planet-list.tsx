import type { CompositePlanet } from "@/features/synastry/composite/types/composite";
import { formatCompositeDegreeMinute } from "@/features/synastry/composite/utils/composite-format";

export function CompositePlanetList({ planets }: { planets: CompositePlanet[] }) {
	return (
		<section
			aria-labelledby="composite-planets-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="composite-planets-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Composite gezegen konumları
			</h2>
			<ul className="mt-4 divide-y divide-border/70">
				{planets.map((planet) => (
					<li
						key={planet.key}
						className="flex min-w-0 items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
					>
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground sm:text-base">
								<span aria-hidden="true" className="mr-2 text-primary">
									{planet.symbol}
								</span>
								{planet.name}
							</p>
							<p className="mt-0.5 text-sm text-foreground/70">
								{planet.signLabel}{" "}
								{formatCompositeDegreeMinute(planet.degree, planet.minute)}
							</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
