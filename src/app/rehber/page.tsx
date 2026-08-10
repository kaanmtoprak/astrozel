import type { Metadata } from "next";
import { ArticleList } from "@/features/content/components/article-list";
import { getAllArticles } from "@/features/content/data/articles";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
	title: "Astroloji Rehberi",
	description:
		"Doğum haritası, yükselen burç, evler, açılar ve ilişki astrolojisi gibi temel kavramları sade bir dille keşfedin.",
	alternates: { canonical: "/rehber" },
	openGraph: {
		title: "Astroloji Rehberi",
		description:
			"Doğum haritası, yükselen burç, evler, açılar ve ilişki astrolojisi gibi temel kavramları sade bir dille keşfedin.",
		url: "/rehber",
	},
};

export default function RehberIndexPage() {
	const articles = getAllArticles();

	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-10 sm:pb-20 sm:pt-14"
		>
			<div
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--sky-blue)_30%,transparent),transparent_70%)]"
				aria-hidden="true"
			/>
			<Container>
				<header className="mx-auto mb-10 max-w-2xl text-center">
					<p className="text-xs font-medium uppercase tracking-[0.16em] text-primary/80">
						Astrozel Rehber
					</p>
					<h1 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
						Astroloji Rehberi
					</h1>
					<p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
						Doğum haritası, yükselen burç, evler, açılar ve ilişki astrolojisi
						gibi temel kavramları sade bir dille keşfedin.
					</p>
				</header>
				<ArticleList articles={articles} />
			</Container>
		</main>
	);
}
