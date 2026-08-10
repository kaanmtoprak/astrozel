import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/features/content/components/article-page";
import {
	getAllArticles,
	getArticleBySlug,
} from "@/features/content/data/articles";
import { getArticleHref } from "@/features/content/utils/article-slug";

type PageProps = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const article = getArticleBySlug(slug);
	if (!article) {
		return {};
	}

	const path = getArticleHref(article.slug);

	return {
		title: article.title,
		description: article.description,
		alternates: { canonical: path },
		openGraph: {
			title: article.title,
			description: article.description,
			url: path,
			type: "article",
			publishedTime: article.publishedAt,
			modifiedTime: article.updatedAt,
		},
	};
}

export default async function RehberArticleRoute({ params }: PageProps) {
	const { slug } = await params;
	const article = getArticleBySlug(slug);
	if (!article) {
		notFound();
	}

	return <ArticlePage article={article} />;
}
