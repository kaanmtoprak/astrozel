"use client";

import { BirthChartForm } from "@/features/birth-chart/components/birth-chart-form";
import { Container } from "@/components/layout/container";
import { HeroSkyIllustration } from "@/components/celestial/hero-sky-illustration";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
	return (
		<section
			aria-labelledby="hero-heading"
			className="relative pb-6 pt-8 sm:pb-10 sm:pt-12"
		>
			{/* Dekorasyon ayrı clip katmanında — form/metin overflow-visible kalır */}
			<div
				className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip overflow-y-hidden"
				aria-hidden="true"
			>
				<div className="absolute inset-0 bg-[linear-gradient(165deg,#f7fafc_0%,#eef4fb_38%,#ebe6f7_72%,#f8f3f0_100%)]" />
				<div className="absolute -left-16 top-10 h-56 w-56 max-w-[45vw] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--lavender)_55%,transparent),transparent_70%)] blur-2xl" />
				<div className="absolute -right-12 top-24 h-64 w-64 max-w-[50vw] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--sky-blue)_60%,transparent),transparent_70%)] blur-2xl" />
				<div className="absolute bottom-0 left-0 right-0 h-24 bg-[linear-gradient(to_top,var(--background),transparent)]" />
			</div>

			<Container className="relative z-10 grid min-w-0 items-center gap-10 overflow-visible lg:grid-cols-2 lg:gap-14">
				<div className="min-w-0 space-y-5 text-center lg:space-y-6 lg:text-left">
					<p className="font-serif text-3xl tracking-tight text-primary sm:text-4xl">
						Astrozel
					</p>
					<div className="mx-auto max-w-[22rem] space-y-3 sm:max-w-xl lg:mx-0 lg:max-w-none">
						<h1
							id="hero-heading"
							className="font-serif text-[1.75rem] leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.65rem]"
						>
							Gökyüzü, doğduğun anda sana özeldi.
						</h1>
						<p className="font-serif text-xl text-primary sm:text-2xl">
							Doğum haritanı keşfet.
						</p>
					</div>
					<p className="mx-auto max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg lg:mx-0">
						Doğum tarihini, saatini ve yerini gir. Yükselenini, evlerini ve
						gökyüzünün doğduğun andaki konumunu hesapla.
					</p>
					<div className="flex justify-center lg:justify-start">
						<a
							href="#dogum-bilgileri"
							className={cn(buttonClassName({ size: "lg" }), "touch-manipulation")}
						>
							Doğum Haritamı Oluştur
						</a>
					</div>
				</div>

				<div className="relative mx-auto w-full min-w-0 max-w-md lg:max-w-none">
					<HeroSkyIllustration className="max-lg:max-w-sm" />
				</div>
			</Container>
		</section>
	);
}

export function HeroBirthChartForm() {
	return (
		<section
			id="dogum-bilgileri"
			aria-labelledby="home-form-heading"
			className="relative z-10 scroll-mt-24 overflow-visible pb-16 pt-4 sm:pb-20 sm:pt-6"
		>
			<Container className="overflow-visible">
				<div className="relative z-10 mx-auto max-w-3xl min-w-0 overflow-visible rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
					<div className="relative z-10 space-y-2 text-center sm:text-left">
						<h2
							id="home-form-heading"
							className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
						>
							Doğum bilgilerini gir
						</h2>
						<p className="text-sm leading-relaxed text-foreground/70 sm:text-base">
							En doğru yükselen ve ev hesaplaması için doğum saatini ve mümkün
							olan en yakın yerleşim yerini seç.
						</p>
					</div>
					<div className="relative z-10 mt-6 min-w-0 overflow-visible">
						<BirthChartForm variant="compact" />
					</div>
					<p className="relative z-10 mt-6 border-t border-border/70 pt-5 text-xs leading-relaxed text-foreground/55 sm:text-sm">
						Bu aşamada bilgiler yalnızca mevcut tarayıcı sekmesinde geçici olarak
						tutulur.
					</p>
				</div>
			</Container>
		</section>
	);
}
