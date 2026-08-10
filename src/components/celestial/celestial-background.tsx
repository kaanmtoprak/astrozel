import { cn } from "@/lib/utils";

type CelestialBackgroundProps = {
	className?: string;
	variant?: "hero" | "cta";
};

export function CelestialBackground({
	className,
	variant = "hero",
}: CelestialBackgroundProps) {
	return (
		<div
			className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
			aria-hidden="true"
		>
			<div
				className={cn(
					"absolute -left-24 top-8 h-64 w-64 rounded-full blur-3xl",
					variant === "hero"
						? "bg-sky-blue/50"
						: "bg-lavender/60",
				)}
			/>
			<div
				className={cn(
					"absolute -right-16 top-24 h-72 w-72 rounded-full blur-3xl",
					variant === "hero"
						? "bg-lavender/45"
						: "bg-sky-blue/55",
				)}
			/>
			<div className="absolute bottom-0 left-1/3 h-48 w-80 rounded-full bg-sky-blue/30 blur-3xl" />

			<svg
				className="absolute inset-0 h-full w-full opacity-60"
				viewBox="0 0 1200 640"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<ellipse
					cx="980"
					cy="120"
					rx="180"
					ry="42"
					stroke="var(--sky-blue)"
					strokeOpacity="0.55"
					strokeWidth="1.2"
				/>
				<ellipse
					cx="980"
					cy="120"
					rx="110"
					ry="26"
					stroke="var(--lavender)"
					strokeOpacity="0.45"
					strokeWidth="1"
				/>
				<path
					d="M1048 92c18 10 28 28 24 46-16-8-34-8-48 0 8-20 12-34 24-46Z"
					fill="var(--primary)"
					fillOpacity="0.18"
				/>
				<circle cx="180" cy="90" r="1.6" fill="var(--accent-gold)" fillOpacity="0.7" />
				<circle cx="240" cy="150" r="1.2" fill="var(--primary)" fillOpacity="0.45" />
				<circle cx="420" cy="70" r="1.4" fill="var(--accent-gold)" fillOpacity="0.55" />
				<circle cx="680" cy="110" r="1.1" fill="var(--primary)" fillOpacity="0.4" />
				<circle cx="760" cy="180" r="1.5" fill="var(--accent-gold)" fillOpacity="0.5" />
				<circle cx="920" cy="260" r="1.2" fill="var(--primary)" fillOpacity="0.35" />
				<path
					d="M60 420c80-40 160-40 240 0s160 40 240 0 160-40 240 0 160 40 240 0"
					stroke="var(--sky-blue)"
					strokeOpacity="0.45"
					strokeWidth="1.4"
				/>
				<path
					d="M40 470c90-30 170-30 250 0s170 30 250 0 170-30 250 0 170 30 250 0"
					stroke="var(--lavender)"
					strokeOpacity="0.35"
					strokeWidth="1.2"
				/>
			</svg>
		</div>
	);
}
