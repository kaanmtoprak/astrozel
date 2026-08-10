import { cn } from "@/lib/utils";

export function OrbitDecoration({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 320 320"
			className={cn("h-full w-full", className)}
			aria-hidden="true"
			focusable="false"
		>
			<g className="celestial-orbit-spin origin-center">
				<ellipse
					cx="160"
					cy="160"
					rx="118"
					ry="78"
					fill="none"
					stroke="color-mix(in srgb, var(--primary) 35%, white)"
					strokeWidth="1.2"
					strokeDasharray="4 6"
				/>
				<circle cx="278" cy="160" r="5" fill="color-mix(in srgb, var(--accent-gold) 70%, white)" />
			</g>
			<g className="celestial-orbit-spin-reverse origin-center">
				<ellipse
					cx="160"
					cy="160"
					rx="92"
					ry="132"
					fill="none"
					stroke="color-mix(in srgb, var(--lavender) 55%, white)"
					strokeWidth="1"
				/>
				<circle
					cx="160"
					cy="28"
					r="4"
					fill="color-mix(in srgb, var(--primary) 45%, white)"
				/>
			</g>
			<circle
				cx="160"
				cy="160"
				r="54"
				fill="none"
				stroke="color-mix(in srgb, var(--sky-blue) 60%, white)"
				strokeWidth="1.4"
			/>
		</svg>
	);
}
