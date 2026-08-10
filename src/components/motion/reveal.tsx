"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
	children: ReactNode;
	className?: string;
	delayMs?: number;
	as?: "div" | "section" | "article";
};

/**
 * Progressive scroll reveal. SSR’de içerik görünür kalır;
 * client’ta reduced-motion yoksa IntersectionObserver ile sınıf eklenir.
 */
export function Reveal({
	children,
	className,
	delayMs = 0,
	as: Tag = "div",
}: RevealProps) {
	const ref = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) {
			return;
		}

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (reduceMotion) {
			node.dataset.revealed = "true";
			return;
		}

		node.classList.add("motion-reveal");

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.classList.add("motion-reveal-visible");
						node.dataset.revealed = "true";
						observer.disconnect();
						break;
					}
				}
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const style = {
		"--reveal-delay": `${delayMs}ms`,
	} as CSSProperties;

	return (
		<Tag
			ref={ref as never}
			style={style}
			className={cn(className)}
			data-revealed="false"
		>
			{children}
		</Tag>
	);
}
