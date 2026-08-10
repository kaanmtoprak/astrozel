import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ContentPageProps = {
	title: string;
	description?: string;
	updatedAtLabel?: string;
	children: ReactNode;
	showCta?: boolean;
};

export function ContentPage({
	title,
	description,
	updatedAtLabel,
	children,
	showCta = true,
}: ContentPageProps) {
	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-10 sm:pb-20 sm:pt-14"
		>
			<Container className="relative z-10">
				<article className="mx-auto max-w-3xl min-w-0">
					<header className="mb-8 space-y-3 border-b border-border/70 pb-8 sm:mb-10">
						<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
							{title}
						</h1>
						{description ? (
							<p className="max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base">
								{description}
							</p>
						) : null}
						{updatedAtLabel ? (
							<p className="text-xs text-foreground/50">
								Son güncelleme: {updatedAtLabel}
							</p>
						) : null}
					</header>

					<div className="space-y-8 rounded-3xl border border-border/80 bg-card/80 p-6 shadow-sm sm:p-8">
						{children}
					</div>

					{showCta ? (
						<div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
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
					) : null}
				</article>
			</Container>
		</main>
	);
}
