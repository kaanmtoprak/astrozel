import type { ReactNode } from "react";
import { AspectsList } from "@/features/astrology/components/aspects-list";
import { HouseCuspsTable } from "@/features/astrology/components/house-cusps-table";
import { PlanetPositionsTable } from "@/features/astrology/components/planet-positions-table";
import type {
	NatalAspect,
	NatalHouseCusp,
	NatalPlanetPosition,
} from "@/features/astrology/types/natal-chart";

function DetailPanel({
	summary,
	children,
}: {
	summary: string;
	children: ReactNode;
}) {
	return (
		<details className="astrozel-details group rounded-3xl border border-border bg-card shadow-sm">
			<summary className="astrozel-details-summary flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
				<span className="font-serif text-lg text-foreground sm:text-xl">
					{summary}
				</span>
				<span className="shrink-0 text-sm font-medium text-primary">
					<span className="group-open:hidden">Göster</span>
					<span className="hidden group-open:inline">Gizle</span>
				</span>
			</summary>
			<div className="border-t border-border/70 px-4 pb-4 pt-3">
				<p className="mb-3 text-xs text-foreground/55 sm:hidden">
					Tabloyu yatay kaydırabilirsin.
				</p>
				{children}
			</div>
		</details>
	);
}

export function TechnicalDetailsSection({
	planets,
	houses,
	aspects,
}: {
	planets: NatalPlanetPosition[];
	houses: NatalHouseCusp[];
	aspects: NatalAspect[];
}) {
	return (
		<section
			aria-labelledby="technical-details-heading"
			className="space-y-4 border-t border-border/70 pt-8"
			data-testid="technical-details"
		>
			<div className="max-w-3xl">
				<h2
					id="technical-details-heading"
					className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
				>
					Teknik detaylar
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-foreground/70">
					Gezegen konumları, ev başlangıçları ve açı listesini buradan
					inceleyebilirsin.
				</p>
			</div>

			<div className="space-y-3">
				<DetailPanel summary="Gezegen konumları">
					<PlanetPositionsTable planets={planets} embedded />
				</DetailPanel>
				<DetailPanel summary="Ev başlangıçları">
					<HouseCuspsTable houses={houses} embedded />
				</DetailPanel>
				<DetailPanel summary="Açılar">
					<AspectsList aspects={aspects} embedded />
				</DetailPanel>
			</div>
		</section>
	);
}
