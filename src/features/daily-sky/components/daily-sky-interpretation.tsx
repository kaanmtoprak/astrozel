import type { DailySkyInterpretation } from "@/features/daily-sky/types/daily-sky";

export function DailySkyInterpretationSection({
	interpretation,
}: {
	interpretation: DailySkyInterpretation;
}) {
	return (
		<section
			aria-labelledby="daily-sky-interpretation-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="daily-sky-interpretation-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Günün sembolik yorumu
			</h2>

			<div className="mt-5 space-y-6">
				<div>
					<h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/55">
						Genel atmosfer
					</h3>
					<p className="mt-2 text-sm leading-relaxed text-foreground/80">
						{interpretation.atmosphere[0]}
					</p>
					<p className="mt-2 text-sm leading-relaxed text-foreground/80">
						{interpretation.atmosphere[1]}
					</p>
				</div>

				<div>
					<h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/55">
						Dikkat çeken tema
					</h3>
					<p className="mt-2 font-medium text-foreground">
						{interpretation.themeTitle}
					</p>
					<p className="mt-2 text-sm leading-relaxed text-foreground/80">
						{interpretation.themeBody}
					</p>
				</div>

				<div>
					<h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/55">
						Günün sembolik önerisi
					</h3>
					<p className="mt-2 text-sm leading-relaxed text-foreground/80">
						{interpretation.suggestion}
					</p>
				</div>
			</div>
		</section>
	);
}
