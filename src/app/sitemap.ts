import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllArticles } from "@/features/content/data/articles";
import { getArticleHref } from "@/features/content/utils/article-slug";

const publicPaths = [
	"/",
	"/dogum-haritasi",
	"/cift-uyumu",
	"/bugunun-gokyuzu",
	"/rehber",
	"/hakkinda",
	"/sss",
	"/gizlilik",
	"/kullanim-kosullari",
	"/cerez-politikasi",
	"/iletisim",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date(`${siteConfig.sitemapLastModified}T00:00:00.000Z`);

	const baseEntries: MetadataRoute.Sitemap = publicPaths.map((path) => ({
		url: `${siteConfig.url}${path === "/" ? "" : path}`,
		lastModified,
		changeFrequency:
			path === "/" ||
			path === "/dogum-haritasi" ||
			path === "/cift-uyumu" ||
			path === "/bugunun-gokyuzu" ||
			path === "/rehber"
				? "weekly"
				: "monthly",
		priority:
			path === "/"
				? 1
				: path === "/dogum-haritasi" ||
					  path === "/cift-uyumu" ||
					  path === "/bugunun-gokyuzu"
					? 0.9
					: path === "/rehber"
						? 0.8
						: 0.6,
	}));

	const articleEntries: MetadataRoute.Sitemap = getAllArticles().map(
		(article) => ({
			url: `${siteConfig.url}${getArticleHref(article.slug)}`,
			lastModified: new Date(`${article.updatedAt}T00:00:00.000Z`),
			changeFrequency: "monthly",
			priority: 0.7,
		}),
	);

	return [...baseEntries, ...articleEntries];
}
