import {
	SYNASTRY_ASPECT_LABELS,
	SYNASTRY_BODY_LABELS,
	SYNASTRY_CATEGORY_LABELS,
} from "@/features/synastry/constants/synastry-labels";
import type { SynastryAspect } from "@/features/synastry/types/synastry";
import { getSynastryAspectCopy } from "@/features/synastry/utils/synastry-interpretation";

export function SynastryAspects({ aspects }: { aspects: SynastryAspect[] }) {
	if (aspects.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="synastry-aspects-heading" className="space-y-4">
			<h2
				id="synastry-aspects-heading"
				className="font-serif text-2xl tracking-tight text-foreground"
			>
				Önemli sinastri açıları
			</h2>
			<ul className="space-y-3">
				{aspects.map((aspect) => {
					const copy = getSynastryAspectCopy(
						aspect.interpretationKey,
						aspect.polarity,
					);
					return (
						<li
							key={`${aspect.interpretationKey}-${aspect.orb}`}
							className="rounded-2xl border border-border/60 bg-card/90 px-4 py-4 sm:px-5"
						>
							<p className="font-medium text-foreground">
								{SYNASTRY_BODY_LABELS[aspect.bodyA]} –{" "}
								{SYNASTRY_BODY_LABELS[aspect.bodyB]}
							</p>
							<p className="mt-0.5 text-sm text-foreground/55">
								{SYNASTRY_ASPECT_LABELS[aspect.aspectType]}
							</p>
							<p className="mt-2 text-sm leading-relaxed text-foreground/75">
								{copy.summary}
							</p>
							<p className="mt-3 text-[0.7rem] uppercase tracking-wide text-foreground/45">
								{SYNASTRY_CATEGORY_LABELS[aspect.category]} · orb{" "}
								{aspect.orb.toFixed(1)}°
							</p>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
