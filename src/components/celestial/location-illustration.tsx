export function LocationIllustration({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 96 96"
			className={className}
			aria-hidden="true"
			focusable="false"
		>
			<circle
				cx="48"
				cy="48"
				r="28"
				fill="color-mix(in srgb, white 70%, var(--sky-blue))"
				stroke="color-mix(in srgb, var(--primary) 35%, white)"
				strokeWidth="2"
			/>
			<path
				d="M20 48 H76 M48 20 V76"
				stroke="color-mix(in srgb, var(--primary) 25%, white)"
				strokeWidth="1.2"
			/>
			<ellipse
				cx="48"
				cy="48"
				rx="14"
				ry="28"
				fill="none"
				stroke="color-mix(in srgb, var(--primary) 30%, white)"
				strokeWidth="1.2"
			/>
			<path
				d="M48 26c-8 10-12 18-12 26 0 10 6 16 12 22 6-6 12-12 12-22 0-8-4-16-12-26z"
				fill="color-mix(in srgb, var(--primary) 55%, white)"
			/>
			<circle cx="48" cy="48" r="4" fill="white" />
			<circle cx="72" cy="24" r="2" fill="var(--accent-gold)" opacity="0.75" />
		</svg>
	);
}
