import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ContentSectionProps = {
	title?: string;
	children: ReactNode;
	className?: string;
};

export function ContentSection({
	title,
	children,
	className,
}: ContentSectionProps) {
	return (
		<section className={cn("space-y-3", className)}>
			{title ? (
				<h2 className="font-serif text-xl tracking-tight text-foreground sm:text-2xl">
					{title}
				</h2>
			) : null}
			<div className="space-y-3 text-sm leading-relaxed text-foreground/75 sm:text-base">
				{children}
			</div>
		</section>
	);
}
