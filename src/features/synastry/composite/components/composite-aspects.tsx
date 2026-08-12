import type { CompositeAspect } from "@/features/synastry/composite/types/composite";

export function CompositeAspects({ aspects }: { aspects: CompositeAspect[] }) {
	return (
		<section
			aria-labelledby="composite-aspects-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="composite-aspects-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Önemli composite açılar
			</h2>
			{aspects.length === 0 ? (
				<p className="mt-3 text-sm leading-relaxed text-foreground/70">
					Bu composite haritada gösterilecek sıkı bir major açı bulunamadı.
				</p>
			) : (
				<ul className="mt-4 grid gap-3 sm:grid-cols-2">
					{aspects.map((aspect) => (
						<li
							key={`${aspect.planetA}-${aspect.type}-${aspect.planetB}-${aspect.orb}`}
							className="min-w-0 rounded-2xl bg-muted/60 px-4 py-3"
						>
							<p className="text-sm font-medium text-foreground">
								<span aria-hidden="true" className="mr-1.5 text-primary">
									{aspect.symbol}
								</span>
								{aspect.planetAName} {aspect.typeLabel} {aspect.planetBName}
							</p>
							<p className="mt-1 text-xs text-foreground/60">
								Orb: {aspect.orb.toFixed(2)}°
							</p>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
