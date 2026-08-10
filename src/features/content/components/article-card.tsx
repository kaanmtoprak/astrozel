import Link from "next/link";
import type { ArticleDefinition } from "@/features/content/types/article";
import { ArticleIcon } from "@/features/content/components/article-icon";
import { getArticleHref } from "@/features/content/utils/article-slug";

export function ArticleCard({ article }: { article: ArticleDefinition }) {
	const href = getArticleHref(article.slug);

	return (
		<article className="flex h-full flex-col rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm transition-colors hover:border-primary/30 sm:p-6">
			<div className="flex items-start gap-3">
				<ArticleIcon icon={article.icon} />
				<div className="min-w-0">
					<h2 className="font-serif text-xl tracking-tight text-foreground">
						<Link
							href={href}
							className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							{article.cardTitle}
						</Link>
					</h2>
					<p className="mt-1 text-xs text-foreground/50">
						{article.readingTime} dk okuma
					</p>
				</div>
			</div>
			<p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/70">
				{article.cardDescription}
			</p>
			<Link
				href={href}
				className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			>
				Rehberi oku
				<span className="sr-only">: {article.cardTitle}</span>
			</Link>
		</article>
	);
}
