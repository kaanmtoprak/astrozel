import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function DailySkySection() {
	return (
		<section
			aria-labelledby="home-daily-sky-heading"
			className="relative overflow-hidden py-14 sm:py-16"
		>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--lavender)_20%,transparent)_45%,transparent)]"
				aria-hidden="true"
			/>
			<Container>
				<Reveal className="mx-auto max-w-2xl text-center">
					<h2
						id="home-daily-sky-heading"
						className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl"
					>
						Bugünün Gökyüzü
					</h2>
					<p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
						Gezegenlerin bugünkü konumlarını, Ay fazını ve öne çıkan açıları
						keşfedin.
					</p>
					<div className="mt-6">
						<Link
							href="/bugunun-gokyuzu"
							className={cn(buttonClassName(), "min-h-11")}
						>
							Bugünün gökyüzünü gör
						</Link>
					</div>
				</Reveal>
			</Container>
		</section>
	);
}
