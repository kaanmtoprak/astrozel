import { ayBurcuNedirArticle } from "@/features/content/data/ay-burcu-nedir";
import { astrolojideAcilarArticle } from "@/features/content/data/astrolojide-acilar";
import { astrolojideEvlerArticle } from "@/features/content/data/astrolojide-evler";
import { dogumHaritasiNedirArticle } from "@/features/content/data/dogum-haritasi-nedir";
import { sinastriNedirArticle } from "@/features/content/data/sinastri-nedir";
import { yukselenBurcNedirArticle } from "@/features/content/data/yukselen-burc-nedir";
import type { ArticleDefinition } from "@/features/content/types/article";

export const articles: readonly ArticleDefinition[] = [
	dogumHaritasiNedirArticle,
	yukselenBurcNedirArticle,
	astrolojideEvlerArticle,
	sinastriNedirArticle,
	ayBurcuNedirArticle,
	astrolojideAcilarArticle,
] as const;

export const featuredArticleSlugs = [
	"dogum-haritasi-nedir",
	"yukselen-burc-nedir",
	"sinastri-nedir",
] as const;

export function getAllArticles(): readonly ArticleDefinition[] {
	return articles;
}

export function getArticleBySlug(slug: string): ArticleDefinition | undefined {
	return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(
	article: ArticleDefinition,
): ArticleDefinition[] {
	return article.relatedSlugs
		.map((slug) => getArticleBySlug(slug))
		.filter((item): item is ArticleDefinition => Boolean(item));
}

export function getFeaturedArticles(): ArticleDefinition[] {
	return featuredArticleSlugs
		.map((slug) => getArticleBySlug(slug))
		.filter((item): item is ArticleDefinition => Boolean(item));
}
