import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import {
	DailySkyErrorState,
	DailySkyView,
} from "@/features/daily-sky/components/daily-sky-view";
import { calculateDailySky } from "@/features/daily-sky/services/calculate-daily-sky";
import { resolveDailySkyDate } from "@/features/daily-sky/utils/daily-sky-date";
import {
	buildDailySkyBreadcrumbJsonLd,
	buildDailySkyWebPageJsonLd,
} from "@/features/daily-sky/utils/daily-sky-structured-data";

export const metadata: Metadata = {
	title: {
		absolute: "Bugünün Gökyüzü | Gezegen Konumları ve Ay Fazı",
	},
	description:
		"Bugünün gezegen konumlarını, Ay burcunu, Ay fazını, retro gezegenleri ve önemli astrolojik açıları keşfedin.",
	alternates: {
		canonical: "/bugunun-gokyuzu",
	},
	openGraph: {
		title: "Bugünün Gökyüzü | Gezegen Konumları ve Ay Fazı",
		description:
			"Bugünün gezegen konumlarını, Ay burcunu, Ay fazını, retro gezegenleri ve önemli astrolojik açıları keşfedin.",
		url: "/bugunun-gokyuzu",
	},
};

type PageProps = {
	searchParams: Promise<{ tarih?: string | string[] }>;
};

export default async function BugununGokyuzuPage({ searchParams }: PageProps) {
	const params = await searchParams;
	const date = resolveDailySkyDate(params.tarih);
	const webPageJsonLd = buildDailySkyWebPageJsonLd();
	const breadcrumbJsonLd = buildDailySkyBreadcrumbJsonLd();

	let result = null;
	try {
		result = await calculateDailySky(date);
	} catch {
		result = null;
	}

	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-10 sm:pb-20 sm:pt-14"
		>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbJsonLd),
				}}
			/>
			<div
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--lavender)_28%,transparent),transparent_70%)]"
				aria-hidden="true"
			/>
			<Container>
				<div className="mx-auto max-w-3xl min-w-0">
					{result ? (
						<DailySkyView result={result} />
					) : (
						<DailySkyErrorState date={date} />
					)}
				</div>
			</Container>
		</main>
	);
}
