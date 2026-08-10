import { AspectInterpretations } from "@/features/astrology/interpretations/components/aspect-interpretations";
import { BigThreeInterpretations } from "@/features/astrology/interpretations/components/big-three-interpretations";
import { InterpretationDisclaimer } from "@/features/astrology/interpretations/components/interpretation-disclaimer";
import { PlanetInterpretations } from "@/features/astrology/interpretations/components/planet-interpretations";
import type { NatalInterpretationResult } from "@/features/astrology/interpretations/types/interpretation";

export function InterpretationSection({
	interpretations,
}: {
	interpretations: NatalInterpretationResult;
}) {
	return (
		<section
			aria-labelledby="natal-interpretations-heading"
			className="space-y-9 border-t border-border/70 pt-8"
			data-testid="interpretation-section"
		>
			<div className="max-w-3xl">
				<h2
					id="natal-interpretations-heading"
					className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
				>
					Doğum haritanın temel yorumu
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-foreground/70 sm:text-base">
					Güneş, Ay, yükselen, gezegen yerleşimleri ve öne çıkan açılarının
					sembolik anlamlarını incele.
				</p>
			</div>

			<InterpretationDisclaimer />

			<BigThreeInterpretations items={interpretations.overview} />
			<PlanetInterpretations items={interpretations.planets} />
			<AspectInterpretations items={interpretations.aspects} />
		</section>
	);
}
