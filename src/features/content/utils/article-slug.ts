import type { ArticleDefinition } from "@/features/content/types/article";

export function getArticleHref(slug: string): string {
	return `/rehber/${slug}`;
}

export function isValidArticleSlug(
	slug: string,
	articles: readonly ArticleDefinition[],
): boolean {
	return articles.some((article) => article.slug === slug);
}
