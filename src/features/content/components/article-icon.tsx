import {
	Circle,
	HeartHandshake,
	Home,
	MoonStar,
	Orbit,
	Sunrise,
} from "lucide-react";
import type { ArticleDefinition } from "@/features/content/types/article";
import { cn } from "@/lib/utils";

const iconMap = {
	chart: Orbit,
	ascendant: Sunrise,
	houses: Home,
	synastry: HeartHandshake,
	moon: MoonStar,
	aspects: Circle,
} as const;

export function ArticleIcon({
	icon,
	className,
}: {
	icon: ArticleDefinition["icon"];
	className?: string;
}) {
	const Icon = iconMap[icon];
	return (
		<span
			className={cn(
				"inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--lavender)_45%,white)] text-primary",
				className,
			)}
			aria-hidden="true"
		>
			<Icon className="h-5 w-5" strokeWidth={1.75} />
		</span>
	);
}
