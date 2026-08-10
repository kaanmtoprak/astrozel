import { getScoreBandLabel } from "@/features/synastry/utils/synastry-category-explanation";

export function CompatibilityScore({
	score,
	personALabel,
	personBLabel,
}: {
	score: number;
	personALabel: string;
	personBLabel: string;
}) {
	const clamped = Math.max(0, Math.min(100, score));
	const degrees = clamped * 3.6;
	const bandLabel = getScoreBandLabel(clamped);

	return (
		<section
			aria-labelledby="synastry-overall-heading"
			className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--lavender)_18%,white),color-mix(in_srgb,var(--sky-blue)_16%,white)_55%,white)] p-6 shadow-sm sm:p-8"
		>
			<div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
				<div className="min-w-0 rounded-2xl border border-border/50 bg-card/80 px-4 py-4 text-center lg:text-left">
					<p className="text-xs font-medium uppercase tracking-[0.14em] text-primary/70">
						Kişi A
					</p>
					<p className="mt-1 truncate font-serif text-xl text-foreground sm:text-2xl">
						{personALabel}
					</p>
				</div>

				<div className="relative mx-auto flex flex-col items-center">
					<div
						className="synastry-score-orbit absolute -inset-3 rounded-full border border-dashed border-primary/20"
						aria-hidden="true"
					/>
					<div
						className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full sm:h-44 sm:w-44"
						style={{
							background: `conic-gradient(from 210deg, color-mix(in srgb, var(--lavender) 70%, var(--primary)) ${degrees}deg, color-mix(in srgb, var(--sky-blue) 55%, white) 0deg)`,
						}}
						role="img"
						aria-label={`Genel sembolik uyum yüzde ${clamped}`}
					>
						<div className="flex h-[7.25rem] w-[7.25rem] flex-col items-center justify-center rounded-full bg-card text-center shadow-sm sm:h-32 sm:w-32">
							<span className="font-serif text-4xl tracking-tight text-foreground">
								%{clamped}
							</span>
							<span className="mt-1 max-w-[7rem] text-[0.65rem] font-medium uppercase tracking-wide text-foreground/50">
								sembolik değerlendirme
							</span>
						</div>
					</div>
					<h2
						id="synastry-overall-heading"
						className="mt-4 text-center font-serif text-xl tracking-tight text-foreground sm:text-2xl"
					>
						Genel sembolik uyum
					</h2>
					<p className="mt-1 text-center text-sm font-medium text-primary/85">
						{bandLabel}
					</p>
				</div>

				<div className="min-w-0 rounded-2xl border border-border/50 bg-card/80 px-4 py-4 text-center lg:text-right">
					<p className="text-xs font-medium uppercase tracking-[0.14em] text-primary/70">
						Kişi B
					</p>
					<p className="mt-1 truncate font-serif text-xl text-foreground sm:text-2xl">
						{personBLabel}
					</p>
				</div>
			</div>

			<p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-foreground/65 sm:text-base">
				Bu oran, iki doğum haritasındaki destekleyici ve zorlayıcı astrolojik
				göstergelerin ağırlıklı değerlendirmesidir. İlişkinin başarı ihtimalini
				veya geleceğini kesin olarak göstermez.
			</p>
		</section>
	);
}
