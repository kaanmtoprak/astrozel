import Link from "next/link";
import type { ArticleDefinition } from "@/features/content/types/article";
import { getArticleHref } from "@/features/content/utils/article-slug";

export function ArticleRelatedLinks({
	articles,
}: {
	articles: ArticleDefinition[];
}) {
	if (articles.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="related-guides-heading" className="space-y-4">
			<h2
				id="related-guides-heading"
				className="font-serif text-2xl tracking-tight text-foreground"
			>
				İlgili rehberler
			</h2>
			<ul className="space-y-3">
				{articles.map((article) => (
					<li key={article.slug}>
						<Link
							href={getArticleHref(article.slug)}
							className="group flex min-h-11 flex-col rounded-2xl border border-border/70 bg-card/70 px-4 py-3 transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<span className="font-medium text-foreground group-hover:text-primary">
								{article.cardTitle}
							</span>
							<span className="mt-1 text-sm text-foreground/60">
								{article.cardDescription}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
