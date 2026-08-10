import Link from "next/link";
import type { ArticleDefinition } from "@/features/content/types/article";

function formatDisplayDate(value: string): string {
	const [year, month, day] = value.split("-").map(Number);
	if (!year || !month || !day) {
		return value;
	}
	const date = new Date(year, month - 1, day);
	return new Intl.DateTimeFormat("tr-TR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

export function ArticleHeader({ article }: { article: ArticleDefinition }) {
	return (
		<header className="space-y-4 border-b border-border/70 pb-8">
			<nav aria-label="Sayfa konumu">
				<ol className="flex flex-wrap items-center gap-2 text-sm text-foreground/55">
					<li>
						<Link
							href="/"
							className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							Ana Sayfa
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li>
						<Link
							href="/rehber"
							className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							Rehber
						</Link>
					</li>
					<li aria-hidden="true">/</li>
					<li className="text-foreground/70">{article.cardTitle}</li>
				</ol>
			</nav>

			{article.eyebrow ? (
				<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary/80">
					{article.eyebrow}
				</p>
			) : null}

			<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
				{article.title}
			</h1>
			<p className="max-w-2xl text-base leading-relaxed text-foreground/70">
				{article.description}
			</p>
			<p className="text-sm text-foreground/50">
				Güncellenme: {formatDisplayDate(article.updatedAt)} ·{" "}
				{article.readingTime} dakika okuma
			</p>
		</header>
	);
}
