import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "lg" | "sm";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
	primary:
		"bg-primary text-primary-foreground shadow-sm hover:bg-[color-mix(in_srgb,var(--primary)_90%,#1b2a4a)]",
	secondary:
		"bg-card text-foreground border border-border shadow-sm hover:bg-muted",
	ghost: "bg-transparent text-foreground hover:bg-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
	default: "h-11 px-5 text-sm",
	lg: "h-12 px-6 text-base",
	sm: "h-9 px-4 text-sm",
};

export function buttonClassName({
	variant = "primary",
	size = "default",
	className,
}: {
	variant?: ButtonVariant;
	size?: ButtonSize;
	className?: string;
} = {}) {
	return cn(
		"inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		"disabled:pointer-events-none disabled:opacity-50",
		variantClasses[variant],
		sizeClasses[size],
		className,
	);
}

export function Button({
	className,
	variant = "primary",
	size = "default",
	type = "button",
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			disabled={disabled}
			className={buttonClassName({ variant, size, className })}
			{...props}
		/>
	);
}
