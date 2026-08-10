import type { ArticleDefinition } from "@/features/content/types/article";
import { ArticleCard } from "@/features/content/components/article-card";

export function ArticleList({ articles }: { articles: readonly ArticleDefinition[] }) {
	return (
		<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{articles.map((article) => (
				<li key={article.slug}>
					<ArticleCard article={article} />
				</li>
			))}
		</ul>
	);
}
