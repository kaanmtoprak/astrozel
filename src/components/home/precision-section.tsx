import { DateIllustration } from "@/components/celestial/date-illustration";
import { LocationIllustration } from "@/components/celestial/location-illustration";
import { TimeIllustration } from "@/components/celestial/time-illustration";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const items = [
	{
		title: "Tarih",
		description: "Gezegenlerin doğduğun gündeki konumunu belirler.",
		Illustration: DateIllustration,
	},
	{
		title: "Saat",
		description: "Yükselen ve evler gün içinde hızlı biçimde değişebilir.",
		Illustration: TimeIllustration,
	},
	{
		title: "Yer",
		description: "Gökyüzünün bulunduğun konumdan nasıl göründüğünü belirler.",
		Illustration: LocationIllustration,
	},
] as const;

export function PrecisionSection() {
	return (
		<section
			aria-labelledby="precision-heading"
			className="relative py-16 sm:py-20"
		>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--sky-blue)_22%,transparent)_40%,transparent)]"
				aria-hidden="true"
			/>
			<Container>
				<Reveal className="mx-auto max-w-2xl text-center">
					<h2
						id="precision-heading"
						className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl"
					>
						Haritanın başlangıç noktası doğru bilgilerdir.
					</h2>
				</Reveal>

				<ul className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
					{items.map((item, index) => (
						<li key={item.title}>
							<Reveal delayMs={index * 80} className="h-full">
								<article className="flex h-full flex-col items-center rounded-3xl border border-border bg-card px-5 py-6 text-center shadow-sm">
									<item.Illustration className="h-16 w-16" />
									<h3 className="mt-4 font-serif text-xl text-foreground">
										{item.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-foreground/70">
										{item.description}
									</p>
								</article>
							</Reveal>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
