import { cn } from "@/lib/utils";

type FieldErrorProps = {
	id: string;
	message?: string;
	className?: string;
};

export function FieldError({ id, message, className }: FieldErrorProps) {
	if (!message) {
		return null;
	}

	return (
		<p id={id} role="alert" className={cn("text-sm text-red-600", className)}>
			{message}
		</p>
	);
}
