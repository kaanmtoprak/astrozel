import Link from "next/link";
import type { ArticleToolCta } from "@/features/content/types/article";
import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ArticleToolCta({ cta }: { cta: ArticleToolCta }) {
	return (
		<aside className="rounded-3xl border border-border bg-[linear-gradient(160deg,color-mix(in_srgb,var(--lavender)_22%,white),white_70%)] p-6 shadow-sm sm:p-7">
			<h2 className="font-serif text-2xl tracking-tight text-foreground">
				{cta.title}
			</h2>
			<p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
				{cta.description}
			</p>
			<div className="mt-5">
				<Link
					href={cta.href}
					className={cn(buttonClassName({ size: "lg" }), "min-h-11 cursor-pointer")}
				>
					{cta.label}
				</Link>
			</div>
		</aside>
	);
}
