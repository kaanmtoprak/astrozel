import type { ArticleCallout } from "@/features/content/types/article";
import { renderRichText } from "@/features/content/utils/render-rich-text";
import { cn } from "@/lib/utils";

const calloutStyles: Record<ArticleCallout["type"], string> = {
	info: "border-sky-blue/70 bg-[color-mix(in_srgb,var(--sky-blue)_28%,white)]",
	tip: "border-lavender/80 bg-[color-mix(in_srgb,var(--lavender)_30%,white)]",
	warning: "border-amber-200 bg-amber-50",
};

const calloutLabels: Record<ArticleCallout["type"], string> = {
	info: "Bilgi",
	tip: "İpucu",
	warning: "Dikkat",
};

export function ArticleCallout({ callout }: { callout: ArticleCallout }) {
	return (
		<aside
			className={cn(
				"rounded-2xl border px-4 py-3 text-sm leading-relaxed text-foreground/80",
				calloutStyles[callout.type],
			)}
		>
			<p className="mb-1 text-xs font-medium uppercase tracking-wide text-foreground/55">
				{calloutLabels[callout.type]}
			</p>
			<p>{renderRichText(callout.text)}</p>
		</aside>
	);
}
