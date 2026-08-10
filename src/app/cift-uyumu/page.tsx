import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SynastryForm } from "@/features/synastry/components/synastry-form";
import { SynastrySkyBackground } from "@/features/synastry/components/synastry-sky-background";

export const metadata: Metadata = {
	title: "Çift Uyumu Hesaplama",
	description:
		"İki doğum haritası arasındaki astrolojik bağlantıları, duygusal uyumu, iletişimi ve ilişkinin güçlü yönlerini inceleyin.",
	alternates: { canonical: "/cift-uyumu" },
};

export default function SynastryPage() {
	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-10 sm:pb-20 sm:pt-14"
		>
			<SynastrySkyBackground />
			<Container className="relative z-10 min-w-0 overflow-visible">
				<header className="mx-auto mb-10 max-w-2xl min-w-0 text-center">
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
						Astrozel · Sinastri
					</p>
					<h1 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
						Çift Uyumu Hesaplama
					</h1>
					<p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
						İki doğum haritası arasındaki astrolojik bağlantıları inceleyerek
						ilişkinizin güçlü yönlerini ve zorlanabileceği alanları keşfedin.
					</p>
				</header>
				<div className="mx-auto max-w-5xl min-w-0 overflow-visible">
					<SynastryForm />
				</div>
			</Container>
		</main>
	);
}
