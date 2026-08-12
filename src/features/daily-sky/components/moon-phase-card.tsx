import type { MoonPhase } from "@/features/daily-sky/types/daily-sky";

export function MoonPhaseCard({ moonPhase }: { moonPhase: MoonPhase }) {
	return (
		<section
			aria-labelledby="moon-phase-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="moon-phase-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Ay fazı
			</h2>
			<p className="mt-3 font-serif text-2xl text-foreground">{moonPhase.name}</p>
			<p className="mt-2 text-sm leading-relaxed text-foreground/70">
				Yaklaşık aydınlanma: %{moonPhase.illuminationPercent.toFixed(1)} ·
				Güneş–Ay açısı: {moonPhase.angle.toFixed(1)}°
			</p>
		</section>
	);
}
