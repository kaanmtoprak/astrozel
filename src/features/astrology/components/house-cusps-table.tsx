import { ZODIAC_SIGN_LABELS } from "@/features/astrology/constants/astrology-labels";
import type { NatalHouseCusp } from "@/features/astrology/types/natal-chart";

export function HouseCuspsTable({
	houses,
	embedded = false,
}: {
	houses: NatalHouseCusp[];
	embedded?: boolean;
}) {
	const table = (
		<div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-border/80 bg-card">
			<table className="w-full min-w-[22rem] border-collapse text-left text-sm">
				<thead>
					<tr className="border-b border-border text-foreground/55">
						<th scope="col" className="px-4 py-3 font-medium">
							Ev
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Burç
						</th>
						<th scope="col" className="px-4 py-3 font-medium">
							Başlangıç derecesi
						</th>
					</tr>
				</thead>
				<tbody>
					{houses.map((house) => (
						<tr key={house.house} className="border-b border-border/70">
							<td className="px-4 py-3 font-medium text-foreground">
								{house.house}. Ev
								{house.house === 1 ? (
									<span className="ml-2 text-xs font-normal text-primary">
										Yükselen
									</span>
								) : null}
							</td>
							<td className="px-4 py-3 text-foreground/80">
								{ZODIAC_SIGN_LABELS[house.position.sign]}
							</td>
							<td className="px-4 py-3 text-foreground/80">
								{house.position.degree}°
								{String(house.position.minute).padStart(2, "0")}′
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
		<section aria-labelledby="houses-heading" className="space-y-4">
			<h2 id="houses-heading" className="font-serif text-2xl text-foreground">
				Evler
			</h2>
			{table}
		</section>
	);
}
