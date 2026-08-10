import type { Metadata } from "next";
import { CelestialBackground } from "@/components/celestial/celestial-background";
import { Container } from "@/components/layout/container";
import { NatalChartResultView } from "@/features/astrology/components/natal-chart-result";

export const metadata: Metadata = {
	title: "Doğum Haritası Sonucu",
	description: "Doğum bilgilerine göre hesaplanan yükselen, evler ve gezegen konumları.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function BirthChartResultPage() {
	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-10 sm:pb-20 sm:pt-14"
		>
			<div
				className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip overflow-y-hidden"
				aria-hidden="true"
			>
				<CelestialBackground variant="hero" />
			</div>
			<Container className="relative z-10 mx-auto max-w-5xl min-w-0">
				<NatalChartResultView />
			</Container>
		</main>
	);
}
