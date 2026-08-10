import Link from "next/link";
import { ArticleCard } from "@/features/content/components/article-card";
import { getFeaturedArticles } from "@/features/content/data/articles";
import { Container } from "@/components/layout/container";

export function GuideSection() {
	const featured = getFeaturedArticles();

	return (
		<section
			aria-labelledby="home-guide-heading"
			className="relative overflow-hidden py-14 sm:py-16"
		>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--sky-blue)_18%,transparent)_40%,transparent)]"
				aria-hidden="true"
			/>
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2
						id="home-guide-heading"
						className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
					>
						Astrolojiyi Daha İyi Anlayın
					</h2>
					<p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
						Doğum haritası, yükselen ve ilişki astrolojisine dair kısa rehberlerle
						temel kavramları keşfedin.
					</p>
				</div>
				<ul className="mt-8 grid gap-5 md:grid-cols-3">
					{featured.map((article) => (
						<li key={article.slug}>
							<ArticleCard article={article} />
						</li>
					))}
				</ul>
				<div className="mt-8 text-center">
					<Link
						href="/rehber"
						className="inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					>
						Tüm rehberleri gör
					</Link>
				</div>
			</Container>
		</section>
	);
}
