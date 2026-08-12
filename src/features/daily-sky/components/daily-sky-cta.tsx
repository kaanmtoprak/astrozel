import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DailySkyCta() {
	return (
		<section
			aria-labelledby="daily-sky-cta-heading"
			className="rounded-3xl border border-border/80 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--sky-blue)_35%,var(--card)),var(--card))] p-5 shadow-sm sm:p-6"
		>
			<h2
				id="daily-sky-cta-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				Kişisel haritanı da keşfet
			</h2>
			<p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/70">
				Bugünün gökyüzü genel bir bakış sunar. Doğum bilgilerinle yükselenini,
				evlerini ve ilişki uyumunu hesaplayabilirsin.
			</p>
			<div className="mt-5 flex flex-col gap-3 sm:flex-row">
				<Link
					href="/dogum-haritasi"
					className={cn(buttonClassName(), "min-h-11")}
				>
					Doğum Haritanı Hesapla
				</Link>
				<Link
					href="/cift-uyumu"
					className={cn(buttonClassName({ variant: "secondary" }), "min-h-11")}
				>
					Çift Uyumunu Keşfet
				</Link>
			</div>
		</section>
	);
}
