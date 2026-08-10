import type { ArticleDefinition } from "@/features/content/types/article";

export function ArticleTableOfContents({
	sections,
}: {
	sections: ArticleDefinition["sections"];
}) {
	return (
		<nav
			aria-label="İçindekiler"
			className="rounded-2xl border border-border/80 bg-muted/35 p-4 sm:p-5"
		>
			<p className="text-xs font-medium uppercase tracking-[0.14em] text-foreground/50">
				İçindekiler
			</p>
			<ol className="mt-3 space-y-1.5">
				{sections.map((section, index) => (
					<li key={section.id}>
						<a
							href={`#${section.id}`}
							className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-foreground/75 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<span className="mr-2 text-foreground/40">{index + 1}.</span>
							{section.title}
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
