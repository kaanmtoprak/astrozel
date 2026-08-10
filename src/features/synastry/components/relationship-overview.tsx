export function RelationshipOverview({ paragraphs }: { paragraphs: string[] }) {
	return (
		<section
			aria-labelledby="synastry-overview-heading"
			className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-6 shadow-sm sm:p-8"
		>
			<div
				className="pointer-events-none absolute bottom-0 left-0 top-0 w-1 bg-[linear-gradient(180deg,var(--lavender),var(--sky-blue),transparent)]"
				aria-hidden="true"
			/>
			<div className="pl-4 sm:pl-5">
				<div className="flex items-center gap-2">
					<span
						className="inline-block h-1.5 w-1.5 rounded-full bg-accent-gold/80"
						aria-hidden="true"
					/>
					<h2
						id="synastry-overview-heading"
						className="font-serif text-2xl tracking-tight text-foreground"
					>
						İlişkinizin genel dinamiği
					</h2>
				</div>
				<div className="mt-5 max-w-3xl space-y-4 text-sm leading-relaxed text-foreground/75 sm:text-base sm:leading-7">
					{paragraphs.map((paragraph) => (
						<p key={paragraph.slice(0, 48)}>{paragraph}</p>
					))}
				</div>
			</div>
		</section>
	);
}
