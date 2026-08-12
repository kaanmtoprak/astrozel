import Link from "next/link";

const relatedGuides = [
	{
		href: "/rehber/astrolojide-acilar",
		label: "Astrolojide açılar",
	},
	{
		href: "/rehber/ay-burcu-nedir",
		label: "Ay burcu nedir?",
	},
	{
		href: "/rehber/dogum-haritasi-nedir",
		label: "Doğum haritası nedir?",
	},
] as const;

export function DailySkyRelatedGuides() {
	return (
		<section
			aria-labelledby="daily-sky-guides-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="daily-sky-guides-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				İlgili rehberler
			</h2>
			<ul className="mt-4 flex flex-col gap-2">
				{relatedGuides.map((guide) => (
					<li key={guide.href}>
						<Link
							href={guide.href}
							className="inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							{guide.label}
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
