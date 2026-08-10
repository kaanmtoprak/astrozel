import { siteConfig } from "@/config/site";
import type { ArticleDefinition } from "@/features/content/types/article";
import { getArticleHref } from "@/features/content/utils/article-slug";

export function buildArticleJsonLd(article: ArticleDefinition) {
	const url = `${siteConfig.url}${getArticleHref(article.slug)}`;

	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.description,
		datePublished: article.publishedAt,
		dateModified: article.updatedAt,
		inLanguage: "tr-TR",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
		author: {
			"@type": "Organization",
			name: siteConfig.name,
			url: siteConfig.url,
		},
		publisher: {
			"@type": "Organization",
			name: siteConfig.name,
			url: siteConfig.url,
			logo: {
				"@type": "ImageObject",
				url: `${siteConfig.url}/brand/astrozel-logo.png`,
			},
		},
	};
}

export function buildArticleBreadcrumbJsonLd(article: ArticleDefinition) {
	const articleUrl = `${siteConfig.url}${getArticleHref(article.slug)}`;

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Ana Sayfa",
				item: siteConfig.url,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Rehber",
				item: `${siteConfig.url}/rehber`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: article.cardTitle,
				item: articleUrl,
			},
		],
	};
}
