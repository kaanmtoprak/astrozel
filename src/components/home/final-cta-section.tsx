import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
	return (
		<section
			aria-labelledby="final-cta-heading"
			className="relative py-14 sm:py-16"
		>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(160deg,#eef4fb_0%,#ebe6f7_55%,#f7f1ea_100%)]"
				aria-hidden="true"
			/>

			<Container>
				<Reveal className="relative mx-auto max-w-xl text-center">
					<h2
						id="final-cta-heading"
						className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl"
					>
						Doğduğun anın gökyüzünü keşfet.
					</h2>
					<a
						href="/dogum-haritasi"
						className={cn(
							buttonClassName({ size: "lg" }),
							"mt-8 touch-manipulation",
						)}
					>
						Harita Oluştur
					</a>
				</Reveal>
			</Container>
		</section>
	);
}
