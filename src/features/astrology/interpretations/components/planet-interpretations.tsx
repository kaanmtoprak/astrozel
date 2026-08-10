import {
	PLANET_LABELS,
	PLANET_SYMBOLS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import type { PlanetPlacementInterpretation } from "@/features/astrology/interpretations/types/interpretation";

export function PlanetInterpretations({
	items,
}: {
	items: PlanetPlacementInterpretation[];
}) {
	if (items.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="planet-interpretations-heading" className="space-y-4">
			<div>
				<h3
					id="planet-interpretations-heading"
					className="font-serif text-xl text-foreground sm:text-2xl"
				>
					Gezegen yerleşimleri
				</h3>
				<p className="mt-1 text-sm text-foreground/65">
					Her gezegeni açarak burç ve ev yerleşiminin sembolik anlamını oku.
				</p>
			</div>
			<ul className="space-y-2">
				{items.map((item) => (
					<li key={item.id}>
						<details className="group rounded-3xl border border-border bg-card shadow-sm open:shadow-sm">
							<summary className="flex min-h-12 cursor-pointer list-none items-start gap-3 rounded-3xl px-4 py-3 text-left outline-none touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
								<span
									className="mt-0.5 text-lg text-foreground/70"
									aria-hidden="true"
								>
									{PLANET_SYMBOLS[item.planet]}
								</span>
								<span className="min-w-0 flex-1">
									<span className="flex flex-wrap items-center gap-x-2 gap-y-1">
										<span className="font-medium text-foreground">
											{PLANET_LABELS[item.planet]}
										</span>
										<span className="text-sm text-foreground/65">
											{ZODIAC_SIGN_LABELS[item.sign]} · {item.house}. Ev
										</span>
										{item.isRetrograde ? (
											<span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground/75">
												Retro
											</span>
										) : null}
									</span>
									<span className="mt-1 block text-xs text-foreground/55 group-open:hidden">
										Yorumu görmek için aç
									</span>
									<span className="mt-1 hidden text-xs text-foreground/55 group-open:block">
										Yorum açık — kapatmak için tekrar seç
									</span>
								</span>
							</summary>
							<div className="space-y-3 border-t border-border/70 px-4 py-4 text-sm leading-relaxed text-foreground/80">
								<p>{item.signSummary}</p>
								<p>{item.houseSummary}</p>
								{item.retrogradeNote ? (
									<p className="rounded-xl bg-muted/50 px-3 py-2 text-foreground/75">
										{item.retrogradeNote}
									</p>
								) : null}
							</div>
						</details>
					</li>
				))}
			</ul>
		</section>
	);
}
