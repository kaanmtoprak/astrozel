import { Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

type BirthTimeInfoProps = {
	className?: string;
};

export function BirthTimeInfo({ className }: BirthTimeInfoProps) {
	return (
		<aside
			className={cn(
				"flex gap-3 rounded-2xl border border-border bg-muted/70 p-4 text-sm leading-relaxed text-foreground/80",
				className,
			)}
		>
			<span
				className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm"
				aria-hidden="true"
			>
				<Clock3 className="h-4 w-4" strokeWidth={1.75} />
			</span>
			<p>
				Yükselen burç ve evler doğum saatine göre değişir. En doğru sonuç için
				mümkün olduğunca kesin doğum saatini kullan.
			</p>
		</aside>
	);
}
