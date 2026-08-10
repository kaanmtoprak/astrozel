import { BookOpen, MapPin, Sparkles, Timer } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const points = [
	{
		title: "Üyelik gerektirmez",
		description: "Haritanı oluşturmak için hesap açmana gerek yok.",
		icon: Sparkles,
	},
	{
		title: "Geçici saklama",
		description: "Bilgiler yalnızca bu sekmede, geçici olarak tutulur.",
		icon: Timer,
	},
	{
		title: "Gerçek konum verisi",
		description: "Doğum yeri koordinat ve saat dilimiyle seçilir.",
		icon: MapPin,
	},
	{
		title: "Sade Türkçe açıklamalar",
		description: "Sonuçlar anlaşılır ve sakin bir dille sunulur.",
		icon: BookOpen,
	},
] as const;

export function PrivacyTrustSection() {
	return (
		<section
			id="hakkinda"
			aria-labelledby="trust-heading"
			className="relative py-16 sm:py-20"
		>
			<Container>
				<Reveal className="mx-auto max-w-2xl text-center">
					<h2
						id="trust-heading"
						className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl"
					>
						Bilgilerin sende, haritan birkaç adım ötede.
					</h2>
				</Reveal>

				<ul className="mt-10 grid gap-4 sm:grid-cols-2">
					{points.map((point, index) => (
						<li key={point.title}>
							<Reveal delayMs={index * 60}>
								<article className="flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
									<span
										className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"
										aria-hidden="true"
									>
										<point.icon className="h-5 w-5" strokeWidth={1.75} />
									</span>
									<div className="min-w-0">
										<h3 className="font-medium text-foreground">{point.title}</h3>
										<p className="mt-1 text-sm leading-relaxed text-foreground/70">
											{point.description}
										</p>
									</div>
								</article>
							</Reveal>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
