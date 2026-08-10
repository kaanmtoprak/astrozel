import { Compass, Moon, Sun } from "lucide-react";
import { ZODIAC_SIGN_LABELS } from "@/features/astrology/constants/astrology-labels";
import { SYNASTRY_BODY_LABELS } from "@/features/synastry/constants/synastry-labels";
import type {
	SynastryPersonSummary,
	SynastryPlacementSummary,
} from "@/features/synastry/types/synastry";
import { formatDateOnlyDisplay } from "@/lib/date";

function PlacementIcon({ body }: { body: SynastryPlacementSummary["body"] }) {
	if (body === "sun") {
		return <Sun className="h-4 w-4" strokeWidth={1.75} />;
	}
	if (body === "moon") {
		return <Moon className="h-4 w-4" strokeWidth={1.75} />;
	}
	return <Compass className="h-4 w-4" strokeWidth={1.75} />;
}

function PlacementRow({ placement }: { placement: SynastryPlacementSummary }) {
	const label = SYNASTRY_BODY_LABELS[placement.body];
	const sign = ZODIAC_SIGN_LABELS[placement.sign];
	return (
		<li className="grid gap-2 border-t border-border/55 py-3 first:border-t-0 first:pt-0 sm:grid-cols-[auto_1fr] sm:gap-3">
			<div className="flex items-start gap-2.5">
				<span
					className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
					aria-hidden="true"
				>
					<PlacementIcon body={placement.body} />
				</span>
				<div className="min-w-0">
					<p className="text-sm font-medium text-foreground">
						{label}
						<span className="text-foreground/45"> · </span>
						{sign}
					</p>
					<p className="text-xs text-foreground/50">{placement.degreeInSign}°</p>
				</div>
			</div>
			<p className="text-sm leading-relaxed text-foreground/70 sm:pt-1">
				{placement.shortDescription}
			</p>
		</li>
	);
}

function PersonCard({
	person,
	tone,
}: {
	person: SynastryPersonSummary;
	tone: "lavender" | "sky";
}) {
	const toneClass =
		tone === "lavender"
			? "bg-[linear-gradient(165deg,color-mix(in_srgb,var(--lavender)_24%,white),white_78%)]"
			: "bg-[linear-gradient(165deg,color-mix(in_srgb,var(--sky-blue)_24%,white),white_78%)]";

	return (
		<article
			className={`synastry-person-card min-w-0 rounded-3xl border border-border/75 p-5 shadow-sm sm:p-6 ${toneClass}`}
		>
			<h3 className="truncate font-serif text-xl tracking-tight text-foreground">
				{person.label}
			</h3>
			<p className="mt-1 break-words text-xs leading-relaxed text-foreground/55">
				{formatDateOnlyDisplay(person.birthDate)} · {person.birthTime} ·{" "}
				{person.locationDisplayName}
			</p>
			<ul className="mt-4">
				<PlacementRow placement={person.sun} />
				<PlacementRow placement={person.moon} />
				<PlacementRow placement={person.ascendant} />
			</ul>
		</article>
	);
}

export function PersonGlance({
	personA,
	personB,
}: {
	personA: SynastryPersonSummary;
	personB: SynastryPersonSummary;
}) {
	return (
		<section aria-labelledby="synastry-glance-heading" className="space-y-4">
			<h2
				id="synastry-glance-heading"
				className="font-serif text-2xl tracking-tight text-foreground"
			>
				Haritalarınıza Kısa Bakış
			</h2>
			<div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
				<PersonCard person={personA} tone="lavender" />
				<div
					className="synastry-orbit-link mx-auto flex h-12 w-12 items-center justify-center lg:h-full lg:w-16"
					aria-hidden="true"
				>
					<span className="synastry-orbit-ring relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-card/80">
						<span className="h-2 w-2 rounded-full bg-primary/70" />
					</span>
				</div>
				<PersonCard person={personB} tone="sky" />
			</div>
		</section>
	);
}
