import type { DailySkyPlanet } from "@/features/daily-sky/types/daily-sky";
import { formatDegreeMinute } from "@/features/daily-sky/utils/daily-sky-format";

export function RetrogradeList({ planets }: { planets: DailySkyPlanet[] }) {
	return (
		<section
			aria-labelledby="retrograde-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="retrograde-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Retro gezegenler
			</h2>
			{planets.length === 0 ? (
				<p className="mt-3 text-sm leading-relaxed text-foreground/70">
					Bugün ana gezegenler arasında retro hareket görünmüyor.
				</p>
			) : (
				<ul className="mt-4 space-y-3">
					{planets.map((planet) => (
						<li key={planet.key} className="min-w-0 text-sm text-foreground">
							<span aria-hidden="true" className="mr-2 text-primary">
								{planet.symbol}
							</span>
							<span className="font-medium">{planet.name}</span>
							<span className="text-foreground/70">
								{" "}
								· {planet.signLabel}{" "}
								{formatDegreeMinute(planet.degree, planet.minute)}
							</span>
						</li>
					))}
				</ul>
			)}
			<p className="mt-4 text-sm leading-relaxed text-foreground/65">
				Retro dönemler çoğu zaman yeniden gözden geçirme ve ince ayar için
				uygun bir ritim sunar; korkutucu bir işaret değildir.
			</p>
		</section>
	);
}
