import {
	PLANET_LABELS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import type { NatalPlanetPosition } from "@/features/astrology/types/natal-chart";

export function PlanetPositionsTable({
	planets,
	embedded = false,
}: {
	planets: NatalPlanetPosition[];
	embedded?: boolean;
}) {
	const table = (
		<div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-border/80 bg-card">
			<table className="w-full min-w-[28rem] border-collapse text-left text-sm">
				<thead>
					<tr className="border-b border-border text-foreground/55">
						<th scope="col" className="px-4 py-3 font-medium">
							Gezegen
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Burç
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Derece
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Ev
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Hareket
						</th>
					</tr>
				</thead>
				<tbody>
					{planets.map((planet) => (
						<tr key={planet.key} className="border-b border-border/70">
							<td className="px-4 py-3 font-medium text-foreground">
								{PLANET_LABELS[planet.key]}
							</td>
							<td className="px-4 py-3 text-foreground/80">
								{ZODIAC_SIGN_LABELS[planet.position.sign]}
							</td>
							<td className="px-4 py-3 text-foreground/80">
								{planet.position.degree}°
								{String(planet.position.minute).padStart(2, "0")}′
							</td>
							<td className="px-4 py-3 text-foreground/80">{planet.house}. Ev</td>
							<td className="px-4 py-3 text-foreground/80">
								{planet.isRetrograde ? "Retro" : "Direkt"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);

	if (embedded) {
		return table;
	}

	return (
		<section aria-labelledby="planets-heading" className="space-y-4">
			<h2 id="planets-heading" className="font-serif text-2xl text-foreground">
				Gezegen konumları
			</h2>
			{table}
		</section>
	);
}
