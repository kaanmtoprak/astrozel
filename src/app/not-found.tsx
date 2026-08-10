import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-16 sm:pb-20 sm:pt-20"
		>
			<Container>
				<div className="mx-auto max-w-xl min-w-0 rounded-3xl border border-border/80 bg-card/90 p-8 text-center shadow-sm sm:p-10">
					<p className="text-sm font-medium uppercase tracking-wide text-foreground/50">
						404
					</p>
					<h1 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
						Sayfa bulunamadı
					</h1>
					<p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
						Aradığın sayfa taşınmış veya hiç var olmamış olabilir.
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
						<Link
							href="/"
							className={cn(buttonClassName({ variant: "secondary" }), "min-h-11")}
						>
							Ana sayfaya dön
						</Link>
						<Link
							href="/dogum-haritasi"
							className={cn(buttonClassName(), "min-h-11")}
						>
							Harita oluştur
						</Link>
					</div>
				</div>
			</Container>
		</main>
	);
}
