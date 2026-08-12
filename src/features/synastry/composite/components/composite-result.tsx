"use client";

import type { CompositeChartResult } from "@/features/synastry/composite/types/composite";
import { CompositeAspects } from "@/features/synastry/composite/components/composite-aspects";
import { CompositeChartVisual } from "@/features/synastry/composite/components/composite-chart-visual";
import { CompositeInterpretationSection } from "@/features/synastry/composite/components/composite-interpretation";
import { CompositePlanetList } from "@/features/synastry/composite/components/composite-planet-list";
import { CompositeSummary } from "@/features/synastry/composite/components/composite-summary";
import { formatCompositeDegreeMinute } from "@/features/synastry/composite/utils/composite-format";

export function CompositeResult({
	composite,
}: {
	composite: CompositeChartResult;
}) {
	return (
		<div className="space-y-8">
			<header className="space-y-3 text-center sm:text-left">
				<h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
					İlişki Haritası
				</h2>
				<p className="mx-auto max-w-2xl text-sm leading-relaxed text-foreground/70 sm:mx-0 sm:text-base">
					İki doğum haritasındaki aynı gezegen noktalarının orta konumlarından
					oluşturulan composite harita, ilişkinin ortak sembolik dinamiklerini
					gösterir.
				</p>
			</header>

			<div className="rounded-2xl border border-border/80 bg-secondary/40 px-4 py-3 text-sm leading-relaxed text-foreground/80">
				Sinastri iki kişinin birbirini nasıl etkilediğini inceler. İlişki
				Haritası ise ilişkinin kendisini ayrı bir bütün gibi yorumlar.
			</div>

			<div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground/70">
				İlişki Haritası bir uyum puanı üretmez. Çift Uyumu bireyler arasındaki
				etkileşimi karşılaştırırken İlişki Haritası ilişkinin ortak sembolik
				yapısını yorumlar.
			</div>

			<CompositeSummary composite={composite} />

			{(composite.ascendant || composite.midheaven) && (
				<section
					aria-labelledby="composite-angles-heading"
					className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
				>
					<h2
						id="composite-angles-heading"
						className="font-serif text-xl text-foreground sm:text-2xl"
					>
						Orta nokta açılar
					</h2>
					<p className="mt-2 text-sm text-foreground/65">
						Yükselen ve MC, iki natal haritadaki ilgili açıların shortest-arc
						midpoint’idir. Ev cusp’ları hesaplanmaz.
					</p>
					<ul className="mt-4 grid gap-3 sm:grid-cols-2">
						{composite.ascendant ? (
							<li className="rounded-2xl bg-muted/60 px-4 py-3">
								<p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/55">
									ASC
								</p>
								<p className="mt-1 font-medium text-foreground">
									{composite.ascendant.signLabel}{" "}
									{formatCompositeDegreeMinute(
										composite.ascendant.degree,
										composite.ascendant.minute,
									)}
								</p>
							</li>
						) : null}
						{composite.midheaven ? (
							<li className="rounded-2xl bg-muted/60 px-4 py-3">
								<p className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/55">
									MC
								</p>
								<p className="mt-1 font-medium text-foreground">
									{composite.midheaven.signLabel}{" "}
									{formatCompositeDegreeMinute(
										composite.midheaven.degree,
										composite.midheaven.minute,
									)}
								</p>
							</li>
						) : null}
					</ul>
				</section>
			)}

			<CompositeChartVisual composite={composite} />
			<CompositePlanetList planets={composite.planets} />
			<CompositeAspects aspects={composite.aspects} />
			<CompositeInterpretationSection
				interpretation={composite.interpretation}
			/>

			<p className="text-xs leading-relaxed text-foreground/55 sm:text-sm">
				Astrolojik yorumlar sembolik bir çerçeve sunar; ilişki hakkında kesin
				sonuç veya gelecek tahmini vermez.
			</p>
		</div>
	);
}

export function CompositeErrorState() {
	return (
		<div
			role="alert"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 text-sm leading-relaxed text-foreground/80 shadow-sm sm:p-6"
		>
			İlişki haritası şu anda oluşturulamadı.
		</div>
	);
}
