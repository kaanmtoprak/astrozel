import type { Metadata } from "next";
import { CelestialBackground } from "@/components/celestial/celestial-background";
import { Container } from "@/components/layout/container";
import { BirthChartForm } from "@/features/birth-chart/components/birth-chart-form";

export const metadata: Metadata = {
	title: "Doğum Haritası Oluştur",
	description:
		"Yükselen burcunu, evlerini ve gezegen konumlarını hesaplamak için doğum bilgilerini gir.",
	alternates: { canonical: "/dogum-haritasi" },
};

export default function BirthChartPage() {
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
			<Container className="relative z-10 min-w-0 overflow-visible">
				<div className="mx-auto mb-8 max-w-2xl min-w-0 text-center">
					<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
						Doğum haritanı oluştur
					</h1>
					<p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
						Yükselen burcunu, evlerini ve gezegen konumlarını hesaplamak için
						doğum bilgilerini gir.
					</p>
				</div>

				<div className="relative z-10 mx-auto max-w-3xl min-w-0 overflow-visible rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
					<BirthChartForm variant="full" showTimeInfo />

					<p className="mt-6 border-t border-border/70 pt-5 text-xs leading-relaxed text-foreground/55 sm:text-sm">
						Bu aşamada bilgiler yalnızca mevcut tarayıcı sekmesinde geçici olarak
						tutulur.
					</p>
				</div>
			</Container>
		</main>
	);
}
