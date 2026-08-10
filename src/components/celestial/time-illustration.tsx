export function TimeIllustration({ className }: { className?: string }) {
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
				fill="color-mix(in srgb, white 75%, var(--lavender))"
				stroke="color-mix(in srgb, var(--primary) 40%, white)"
				strokeWidth="2"
			/>
			<circle
				cx="48"
				cy="48"
				r="34"
				fill="none"
				stroke="color-mix(in srgb, var(--sky-blue) 70%, white)"
				strokeWidth="1.5"
				strokeDasharray="3 5"
			/>
			<path
				d="M48 48 L48 30"
				stroke="var(--primary)"
				strokeWidth="2.5"
				strokeLinecap="round"
			/>
			<path
				d="M48 48 L62 54"
				stroke="var(--accent-gold)"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<circle cx="48" cy="48" r="3" fill="var(--foreground)" opacity="0.55" />
			<path
				d="M18 70 Q48 86 78 70"
				fill="none"
				stroke="color-mix(in srgb, var(--lavender) 60%, white)"
				strokeWidth="3"
				strokeLinecap="round"
				opacity="0.8"
			/>
		</svg>
	);
}
