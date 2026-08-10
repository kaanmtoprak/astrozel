import {
	ASPECT_SYMBOLS,
	PLANET_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import { getAspectLineStyle } from "@/features/astrology/chart/utils/aspect-style";
import type { AspectInterpretation } from "@/features/astrology/interpretations/types/interpretation";

export function AspectInterpretations({
	items,
}: {
	items: AspectInterpretation[];
}) {
	return (
		<section aria-labelledby="aspect-interpretations-heading" className="space-y-4">
			<div>
				<h3
					id="aspect-interpretations-heading"
					className="font-serif text-xl text-foreground sm:text-2xl"
				>
					Öne çıkan açılar
				</h3>
				<p className="mt-1 text-sm text-foreground/65">
					Orb değeri daha yakın olan en fazla altı temel açı.
				</p>
			</div>

			{items.length === 0 ? (
				<p className="rounded-2xl border border-dashed border-border px-4 py-6 text-sm text-foreground/65">
					Bu hesaplamada yorumlanacak temel açı bulunamadı.
				</p>
			) : (
				<ul
					className="grid gap-3 sm:grid-cols-2"
					data-testid="featured-aspect-interpretations"
				>
					{items.map((item) => {
						const style = getAspectLineStyle(item.type, item.orb);
						return (
							<li
								key={item.id}
								className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm"
								style={{
									borderLeftWidth: 4,
									borderLeftColor: style.stroke,
								}}
							>
								<div className="flex flex-wrap items-center gap-2">
									<span className="font-medium text-foreground">
										{PLANET_LABELS[item.body1]}
									</span>
									<span
										className="text-lg text-foreground/70"
										aria-hidden="true"
									>
										{ASPECT_SYMBOLS[item.type]}
									</span>
									<span className="sr-only">{item.title}</span>
									<span className="font-medium text-foreground">
										{PLANET_LABELS[item.body2]}
									</span>
								</div>
								<p className="mt-1 text-sm text-foreground/65">
									{item.title} · {item.orb.toFixed(2)}° · {item.orbLabel}
								</p>
								<p className="mt-3 text-sm leading-relaxed text-foreground/80">
									{item.summary}
								</p>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}
