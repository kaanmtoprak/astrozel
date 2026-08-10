"use client";

import Link from "next/link";
import { markBirthChartRestoreOnce } from "@/features/birth-chart/utils/birth-chart-draft";
import { buttonClassName, Button } from "@/components/ui/button";

export function CalculationError({
	message,
	onRetry,
}: {
	message: string;
	onRetry: () => void;
}) {
	return (
		<div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
			<h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
				Doğum haritası hesaplanamadı
			</h1>
			<p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base">
				{message}
			</p>
			<div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
				<Button type="button" size="lg" onClick={onRetry}>
					Tekrar Dene
				</Button>
				<Link
					href="/dogum-haritasi"
					onClick={() => {
						markBirthChartRestoreOnce();
					}}
					className={buttonClassName({ variant: "secondary", size: "lg" })}
				>
					Bilgileri Düzenle
				</Link>
			</div>
		</div>
	);
}
