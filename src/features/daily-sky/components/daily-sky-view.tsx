import Link from "next/link";
import type { DailySkyResult } from "@/features/daily-sky/types/daily-sky";
import { DateNavigation } from "@/features/daily-sky/components/date-navigation";
import { DailySkyCta } from "@/features/daily-sky/components/daily-sky-cta";
import { DailySkyInterpretationSection } from "@/features/daily-sky/components/daily-sky-interpretation";
import { DailySkyRelatedGuides } from "@/features/daily-sky/components/daily-sky-related-guides";
import { LuminaryCards } from "@/features/daily-sky/components/luminary-cards";
import { MajorAspectsList } from "@/features/daily-sky/components/major-aspects-list";
import { MoonPhaseCard } from "@/features/daily-sky/components/moon-phase-card";
import { PlanetPositionList } from "@/features/daily-sky/components/planet-position-list";
import { RetrogradeList } from "@/features/daily-sky/components/retrograde-list";
import { SkySummary } from "@/features/daily-sky/components/sky-summary";
import { formatDailySkyDisplayDate } from "@/features/daily-sky/utils/daily-sky-format";

export function DailySkyHeader({ displayDate }: { displayDate: string }) {
	return (
		<header className="space-y-4">
			<nav aria-label="Breadcrumb" className="text-sm text-foreground/60">
				<ol className="flex flex-wrap items-center gap-2">
					<li>
						<Link
							href="/"
							className="rounded underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							Ana Sayfa
						</Link>
					</li>
					<li aria-hidden="true">→</li>
					<li className="text-foreground/80">Bugünün Gökyüzü</li>
				</ol>
			</nav>
			<div className="space-y-2">
				<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
					Bugünün Gökyüzü
				</h1>
				<p className="max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">
					{displayDate} gökyüzü görünümü
				</p>
			</div>
		</header>
	);
}

export function DailySkyView({ result }: { result: DailySkyResult }) {
	return (
		<div className="space-y-8">
			<DailySkyHeader displayDate={result.displayDate} />
			<DateNavigation date={result.date} />
			<p className="text-xs leading-relaxed text-foreground/55 sm:text-sm">
				Gezegen konumları seçilen gün için 12:00 UTC referans alınarak
				hesaplanır.
			</p>
			<SkySummary summary={result.summary} />
			<LuminaryCards
				sun={result.sun}
				moon={result.moon}
				moonPhaseName={result.moonPhase.name}
			/>
			<MoonPhaseCard moonPhase={result.moonPhase} />
			<PlanetPositionList planets={result.planets} />
			<RetrogradeList planets={result.retrogradePlanets} />
			<MajorAspectsList aspects={result.aspects} />
			<DailySkyInterpretationSection interpretation={result.interpretation} />
			<DailySkyRelatedGuides />
			<DailySkyCta />
			<p className="text-xs leading-relaxed text-foreground/55 sm:text-sm">
				Astrolojik yorumlar sembolik bir çerçeve sunar; günlük olaylar veya
				gelecek hakkında kesin sonuç vermez.
			</p>
		</div>
	);
}

export function DailySkyErrorState({ date }: { date: string }) {
	return (
		<div className="space-y-8">
			<DailySkyHeader displayDate={formatDailySkyDisplayDate(date)} />
			<DateNavigation date={date} />
			<div
				role="alert"
				className="rounded-3xl border border-border/80 bg-card/90 p-5 text-sm leading-relaxed text-foreground/80 shadow-sm sm:p-6"
			>
				Gökyüzü bilgileri şu anda hesaplanamadı. Lütfen kısa süre sonra tekrar
				deneyin.
			</div>
			<DailySkyRelatedGuides />
			<DailySkyCta />
		</div>
	);
}
