import {
	PLANET_SYMBOLS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import type { BigThreeInterpretation } from "@/features/astrology/interpretations/types/interpretation";

const SYMBOL_BY_CATEGORY = {
	sun: PLANET_SYMBOLS.sun,
	moon: PLANET_SYMBOLS.moon,
	ascendant: "↑",
} as const;

export function BigThreeInterpretations({
	items,
}: {
	items: BigThreeInterpretation[];
}) {
	if (items.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="big-three-interpretations-heading" className="space-y-4">
			<h3
				id="big-three-interpretations-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Güneş, Ay ve yükselen
			</h3>
			<ul className="grid gap-4 md:grid-cols-3">
				{items.map((item) => (
					<li
						key={item.id}
						className="rounded-3xl border border-border bg-card p-5 shadow-sm"
						data-interpretation={item.category}
					>
						<p className="text-xs font-medium uppercase tracking-wide text-primary">
							{item.roleLabel}
						</p>
						<div className="mt-2 flex items-baseline gap-2">
							<span className="text-2xl text-foreground/80" aria-hidden="true">
								{SYMBOL_BY_CATEGORY[item.category]}
							</span>
							<h4 className="font-serif text-lg text-foreground">{item.title}</h4>
						</div>
						<p className="mt-1 text-sm text-foreground/65">
							{ZODIAC_SIGN_LABELS[item.sign]} · {item.degreeFormatted}
						</p>
						<p className="mt-3 text-sm leading-relaxed text-foreground/80">
							{item.summary}
						</p>
						<p className="mt-3 text-sm leading-relaxed text-foreground/70">
							<span className="font-medium text-foreground/85">Potansiyel: </span>
							{item.potential}
						</p>
						<p className="mt-2 text-sm leading-relaxed text-foreground/70">
							<span className="font-medium text-foreground/85">Denge: </span>
							{item.balance}
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}
