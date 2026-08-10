export function DateIllustration({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 96 96"
			className={className}
			aria-hidden="true"
			focusable="false"
		>
			<rect
				x="18"
				y="24"
				width="60"
				height="52"
				rx="10"
				fill="color-mix(in srgb, white 70%, var(--sky-blue))"
				stroke="color-mix(in srgb, var(--primary) 35%, white)"
				strokeWidth="2"
			/>
			<rect
				x="18"
				y="24"
				width="60"
				height="14"
				rx="8"
				fill="color-mix(in srgb, var(--lavender) 55%, white)"
			/>
			<circle cx="34" cy="52" r="4" fill="var(--primary)" opacity="0.55" />
			<circle cx="48" cy="52" r="4" fill="var(--accent-gold)" opacity="0.7" />
			<circle cx="62" cy="52" r="4" fill="var(--primary)" opacity="0.4" />
			<circle cx="34" cy="66" r="4" fill="var(--primary)" opacity="0.35" />
			<circle cx="48" cy="66" r="4" fill="var(--primary)" opacity="0.5" />
			<path
				d="M70 18c8 2 14 10 12 18-6-2-10-8-12-18z"
				fill="color-mix(in srgb, var(--accent-gold) 65%, white)"
			/>
			<circle cx="22" cy="18" r="2" fill="var(--accent-gold)" opacity="0.7" />
			<circle cx="78" cy="42" r="1.5" fill="var(--primary)" opacity="0.5" />
		</svg>
	);
}
