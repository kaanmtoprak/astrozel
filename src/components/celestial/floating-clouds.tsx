import { cn } from "@/lib/utils";

export function FloatingClouds({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0 overflow-hidden",
				className,
			)}
			aria-hidden="true"
		>
			<svg
				viewBox="0 0 800 320"
				className="celestial-cloud-drift absolute left-0 top-[12%] h-36 w-[65%] max-w-none opacity-70 sm:h-44"
				focusable="false"
			>
				<path
					d="M60 180c20-50 70-70 120-55 18-42 70-60 118-40 28-30 78-28 108 4 46-18 98 4 110 48 42 2 70 36 62 72H80c-30-8-40-40-20-70z"
					fill="color-mix(in srgb, white 82%, var(--sky-blue))"
				/>
			</svg>
			<svg
				viewBox="0 0 700 260"
				className="celestial-cloud-drift-slow absolute right-0 top-[38%] h-28 w-[50%] opacity-55 sm:h-36"
				focusable="false"
			>
				<path
					d="M40 150c22-40 68-55 110-40 20-36 66-48 108-28 30-26 74-20 98 10 40-14 86 10 92 48H70c-28-4-42-28-30-50z"
					fill="color-mix(in srgb, white 75%, var(--lavender))"
				/>
			</svg>
			<svg
				viewBox="0 0 640 200"
				className="celestial-cloud-drift absolute bottom-[8%] left-[12%] h-20 w-[44%] opacity-45"
				focusable="false"
			>
				<path
					d="M30 120c18-32 55-42 90-30 16-28 54-38 88-22 24-20 60-16 80 8 32-10 68 8 74 38H55c-22-2-34-20-25-34z"
					fill="color-mix(in srgb, white 78%, #f6e9f0)"
				/>
			</svg>
		</div>
	);
}
