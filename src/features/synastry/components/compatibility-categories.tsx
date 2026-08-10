import {
	Check,
	Heart,
	MessageCircle,
	Orbit,
	Scale,
	TriangleAlert,
} from "lucide-react";
import { SYNASTRY_CATEGORY_LABELS } from "@/features/synastry/constants/synastry-labels";
import type { SynastryCategoryDetail } from "@/features/synastry/types/synastry";
import type { SynastryCategory } from "@/features/synastry/types/synastry";

const ICONS: Record<SynastryCategory, typeof Heart> = {
	emotional: Heart,
	communication: MessageCircle,
	attraction: Orbit,
	longTerm: Scale,
};

const ACCENT: Record<SynastryCategory, string> = {
	emotional:
		"bg-[color-mix(in_srgb,var(--lavender)_45%,white)] text-[color-mix(in_srgb,var(--primary)_85%,#1b2a4a)]",
	communication:
		"bg-[color-mix(in_srgb,var(--sky-blue)_50%,white)] text-[color-mix(in_srgb,var(--primary)_85%,#1b2a4a)]",
	attraction:
		"bg-[color-mix(in_srgb,var(--accent-gold)_22%,white)] text-[color-mix(in_srgb,var(--accent-gold)_70%,#1b2a4a)]",
	longTerm:
		"bg-[color-mix(in_srgb,var(--primary)_14%,white)] text-primary",
};

export function CompatibilityCategories({
	details,
}: {
	details: SynastryCategoryDetail[];
}) {
	return (
		<section aria-labelledby="synastry-categories-heading" className="space-y-4">
			<h2
				id="synastry-categories-heading"
				className="font-serif text-2xl tracking-tight text-foreground"
			>
				Kategori skorları
			</h2>
			<div className="grid gap-4 lg:grid-cols-2">
				{details.map((detail) => {
					const Icon = ICONS[detail.category];
					const techFactors = [
						...detail.supportiveFactors,
						...detail.challengingFactors,
					].filter((item, index, all) => {
						if (item.orb === undefined) {
							return false;
						}
						return all.findIndex((candidate) => candidate.id === item.id) === index;
					});

					return (
						<article
							key={detail.category}
							className="rounded-3xl border border-border/75 bg-card/95 p-5 shadow-sm sm:p-6"
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 items-center gap-2.5">
									<span
										className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ACCENT[detail.category]}`}
										aria-hidden="true"
									>
										<Icon className="h-4 w-4" strokeWidth={1.75} />
									</span>
									<h3 className="font-medium text-foreground">
										{SYNASTRY_CATEGORY_LABELS[detail.category]}
									</h3>
								</div>
								<p className="shrink-0 font-serif text-3xl text-foreground">
									%{detail.score}
								</p>
							</div>

							<p className="mt-2 text-xs font-medium uppercase tracking-wide text-foreground/50">
								{detail.bandLabel}
							</p>

							<div
								className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
								aria-hidden="true"
							>
								<div
									className="synastry-score-fill h-full rounded-full bg-[linear-gradient(90deg,var(--lavender),var(--primary))]"
									style={{ width: `${detail.score}%` }}
								/>
							</div>

							<div className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/75">
								{detail.summary.map((paragraph, index) => (
									<p key={`${detail.category}-summary-${index}`}>{paragraph}</p>
								))}
							</div>

							{detail.supportiveFactors.length > 0 ? (
								<div className="mt-4 rounded-2xl bg-[color-mix(in_srgb,var(--sky-blue)_28%,white)] px-3 py-3">
									<p className="text-xs font-medium uppercase tracking-wide text-foreground/55">
										Sizi destekleyen göstergeler
									</p>
									<ul className="mt-2 space-y-2 text-sm text-foreground/80">
										{detail.supportiveFactors.map((factor) => (
											<li key={factor.id} className="flex gap-2">
												<Check
													className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
													aria-hidden="true"
												/>
												<span className="min-w-0">
													<span className="font-medium">{factor.title}</span>
													{factor.description ? (
														<span className="mt-0.5 block text-xs leading-relaxed text-foreground/60">
															{factor.description}
														</span>
													) : null}
												</span>
											</li>
										))}
									</ul>
								</div>
							) : null}

							{detail.challengingFactors.length > 0 ? (
								<div className="mt-3 rounded-2xl border border-[color-mix(in_srgb,var(--accent-gold)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent-gold)_10%,white)] px-3 py-3">
									<p className="text-xs font-medium uppercase tracking-wide text-foreground/55">
										Dikkat gerektiren göstergeler
									</p>
									<ul className="mt-2 space-y-2 text-sm text-foreground/80">
										{detail.challengingFactors.map((factor) => (
											<li key={factor.id} className="flex gap-2">
												<TriangleAlert
													className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color-mix(in_srgb,var(--accent-gold)_75%,#1b2a4a)]"
													aria-hidden="true"
												/>
												<span className="min-w-0">
													<span className="font-medium">{factor.title}</span>
													{factor.description ? (
														<span className="mt-0.5 block text-xs leading-relaxed text-foreground/60">
															{factor.description}
														</span>
													) : null}
												</span>
											</li>
										))}
									</ul>
								</div>
							) : (
								<p className="mt-3 text-xs leading-relaxed text-foreground/55">
									Bu kategoride belirgin bir zorlayıcı açı bulunmuyor. Bu, hiç
									anlaşmazlık yaşamayacağınız anlamına gelmez.
								</p>
							)}

							{techFactors.length > 0 ? (
								<details className="mt-3 text-xs text-foreground/50">
									<summary className="cursor-pointer">Teknik ayrıntı</summary>
									<ul className="mt-2 space-y-1">
										{techFactors.map((item) => (
											<li key={`${item.id}-tech`}>
												{item.title}
												{item.orb !== undefined
													? ` · orb ${item.orb.toFixed(1)}°`
													: ""}
											</li>
										))}
									</ul>
								</details>
							) : null}
						</article>
					);
				})}
			</div>
		</section>
	);
}
