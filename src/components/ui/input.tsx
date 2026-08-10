import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	ref?: Ref<HTMLInputElement>;
	hasError?: boolean;
};

export function Input({ className, hasError = false, ref, ...props }: InputProps) {
	return (
		<input
			ref={ref}
			aria-invalid={hasError || undefined}
			className={cn(
				/* text-base (≥16px) prevents iOS Safari focus zoom + horizontal jump */
				"h-12 w-full min-w-0 max-w-full rounded-2xl border bg-card px-4 text-base text-foreground shadow-sm sm:text-sm",
				"touch-manipulation placeholder:text-foreground/40",
				"hover:border-primary/35",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				"disabled:cursor-not-allowed disabled:opacity-50",
				hasError ? "border-red-400" : "border-border",
				className,
			)}
			{...props}
		/>
	);
}
