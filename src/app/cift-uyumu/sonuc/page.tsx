import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SynastryResultView } from "@/features/synastry/components/synastry-result";
import { SynastrySkyBackground } from "@/features/synastry/components/synastry-sky-background";

export const metadata: Metadata = {
	title: "Çift Uyumu Sonucu",
	description: "İki doğum haritası arasındaki sembolik uyum değerlendirmesi.",
	robots: {
		index: false,
		follow: true,
	},
};

export default function SynastryResultPage() {
	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-10 sm:pb-20 sm:pt-14"
		>
			<SynastrySkyBackground />
			<Container className="relative z-10 mx-auto max-w-5xl min-w-0">
				<SynastryResultView />
			</Container>
		</main>
	);
}
