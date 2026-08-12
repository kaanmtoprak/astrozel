import type { DailySkyPlanet } from "@/features/daily-sky/types/daily-sky";
import { formatDegreeMinute } from "@/features/daily-sky/utils/daily-sky-format";

export function PlanetPositionList({ planets }: { planets: DailySkyPlanet[] }) {
	return (
		<section
			aria-labelledby="planet-positions-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="planet-positions-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Gezegen konumları
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
								{planet.signLabel} {formatDegreeMinute(planet.degree, planet.minute)}
							</p>
						</div>
						{planet.isRetrograde ? (
							<span className="shrink-0 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
								Retro
							</span>
						) : null}
					</li>
				))}
			</ul>
		</section>
	);
}
