import {
	SYNASTRY_ASPECT_LABELS,
	SYNASTRY_BODY_LABELS,
} from "@/features/synastry/constants/synastry-labels";
import type { SynastryInsight } from "@/features/synastry/types/synastry";

export function RelationshipStrengths({ items }: { items: SynastryInsight[] }) {
	if (items.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="synastry-strengths-heading" className="space-y-4">
			<h2
				id="synastry-strengths-heading"
				className="font-serif text-2xl tracking-tight text-foreground"
			>
				İlişkinizin güçlü yönleri
			</h2>
			<ul className="space-y-3">
				{items.map((item) => (
					<li
						key={`${item.interpretationKey}-strength`}
						className="border-l-[3px] border-[color-mix(in_srgb,var(--sky-blue)_80%,var(--primary))] bg-[color-mix(in_srgb,var(--sky-blue)_12%,white)] py-4 pl-4 pr-4 sm:pl-5"
					>
						<h3 className="font-medium text-foreground">{item.title}</h3>
						<p className="mt-2 text-sm leading-relaxed text-foreground/75">
							{item.summary}
						</p>
						<p className="mt-3 text-xs text-foreground/50">
							{SYNASTRY_BODY_LABELS[item.bodyA]} –{" "}
							{SYNASTRY_BODY_LABELS[item.bodyB]} ·{" "}
							{SYNASTRY_ASPECT_LABELS[item.aspectType]} · orb{" "}
							{item.orb.toFixed(1)}°
						</p>
					</li>
				))}
			</ul>
		</section>
	);
}
