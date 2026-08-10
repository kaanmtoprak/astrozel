import type { ArticleDefinition } from "@/features/content/types/article";
import { ArticleHeader } from "@/features/content/components/article-header";
import { ArticleRelatedLinks } from "@/features/content/components/article-related-links";
import { ArticleSectionView } from "@/features/content/components/article-section";
import { ArticleTableOfContents } from "@/features/content/components/article-table-of-contents";
import { ArticleToolCta } from "@/features/content/components/article-tool-cta";
import { getRelatedArticles } from "@/features/content/data/articles";
import {
	buildArticleBreadcrumbJsonLd,
	buildArticleJsonLd,
} from "@/features/content/utils/article-structured-data";
import { Container } from "@/components/layout/container";

export function ArticlePage({ article }: { article: ArticleDefinition }) {
	const related = getRelatedArticles(article);
	const articleJsonLd = buildArticleJsonLd(article);
	const breadcrumbJsonLd = buildArticleBreadcrumbJsonLd(article);

	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-10 sm:pb-20 sm:pt-14"
		>
			<div
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--lavender)_28%,transparent),transparent_70%)]"
				aria-hidden="true"
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
			<Container>
				<article className="mx-auto max-w-[48rem] min-w-0 space-y-10">
					<ArticleHeader article={article} />
					<ArticleTableOfContents sections={article.sections} />
					<div className="space-y-10">
						{article.sections.map((section) => (
							<ArticleSectionView key={section.id} section={section} />
						))}
					</div>
					{article.toolCta ? <ArticleToolCta cta={article.toolCta} /> : null}
					<ArticleRelatedLinks articles={related} />
					<p className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm leading-relaxed text-foreground/60">
						Astrolojik yorumlar sembolik bir çerçeve sunar; kişilik, ilişki veya
						gelecek hakkında kesin sonuç vermez.
					</p>
				</article>
			</Container>
		</main>
	);
}
