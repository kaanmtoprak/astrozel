import { AspectLine } from "@/features/astrology/components/chart-summary";
import type { NatalAspect } from "@/features/astrology/types/natal-chart";

export function AspectsList({
	aspects,
	embedded = false,
}: {
	aspects: NatalAspect[];
	embedded?: boolean;
}) {
	const body =
		aspects.length === 0 ? (
			<p className="text-sm text-foreground/65">
				Gösterilecek temel açı bulunamadı.
			</p>
		) : (
			<ul className="grid gap-3 sm:grid-cols-2">
				{aspects.map((aspect) => (
					<AspectLine
						key={`${aspect.body1}-${aspect.type}-${aspect.body2}-${aspect.orb}`}
						body1={aspect.body1}
						body2={aspect.body2}
						type={aspect.type}
						symbol={aspect.symbol}
						orb={aspect.orb}
					/>
				))}
			</ul>
		);

	if (embedded) {
		return body;
	}

	return (
		<section aria-labelledby="aspects-heading" className="space-y-4">
			<h2 id="aspects-heading" className="font-serif text-2xl text-foreground">
				Temel açılar
			</h2>
			{body}
		</section>
	);
}
