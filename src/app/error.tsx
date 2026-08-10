"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main
			id="main-content"
			className="relative overflow-visible pb-16 pt-16 sm:pb-20 sm:pt-20"
		>
			<Container>
				<div className="mx-auto max-w-xl min-w-0 rounded-3xl border border-border/80 bg-card/90 p-8 text-center shadow-sm sm:p-10">
					<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
						Bir sorun oluştu
					</h1>
					<p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
						Beklenmeyen bir hata meydana geldi. Tekrar deneyebilir veya ana
						sayfaya dönebilirsin.
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
						<button
							type="button"
							onClick={reset}
							className={cn(buttonClassName(), "min-h-11")}
						>
							Tekrar dene
						</button>
						<Link
							href="/"
							className={cn(
								buttonClassName({ variant: "secondary" }),
								"min-h-11",
							)}
						>
							Ana sayfaya dön
						</Link>
					</div>
				</div>
			</Container>
		</main>
	);
}
