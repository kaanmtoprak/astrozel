import { cn } from "@/lib/utils";

const STARS = [
	{ cx: 12, cy: 18, r: 1.1 },
	{ cx: 28, cy: 8, r: 0.8 },
	{ cx: 46, cy: 22, r: 1.3 },
	{ cx: 62, cy: 10, r: 0.7 },
	{ cx: 78, cy: 26, r: 1 },
	{ cx: 18, cy: 42, r: 0.9 },
	{ cx: 38, cy: 48, r: 1.2 },
	{ cx: 58, cy: 40, r: 0.75 },
	{ cx: 84, cy: 48, r: 1.05 },
	{ cx: 8, cy: 68, r: 0.85 },
	{ cx: 32, cy: 72, r: 1.15 },
	{ cx: 52, cy: 64, r: 0.7 },
	{ cx: 72, cy: 76, r: 1 },
	{ cx: 90, cy: 66, r: 0.8 },
	{ cx: 22, cy: 88, r: 0.95 },
	{ cx: 48, cy: 92, r: 0.7 },
	{ cx: 68, cy: 88, r: 1.1 },
	{ cx: 88, cy: 90, r: 0.75 },
	{ cx: 40, cy: 34, r: 0.65 },
	{ cx: 70, cy: 58, r: 0.9 },
	{ cx: 14, cy: 56, r: 0.7 },
	{ cx: 94, cy: 34, r: 0.85 },
	{ cx: 55, cy: 16, r: 0.6 },
	{ cx: 6, cy: 32, r: 0.75 },
] as const;

const LINES = [
	[12, 18, 28, 8],
	[28, 8, 46, 22],
	[46, 22, 62, 10],
	[18, 42, 38, 48],
	[38, 48, 58, 40],
	[58, 40, 78, 26],
	[32, 72, 52, 64],
	[52, 64, 72, 76],
] as const;

export function ConstellationField({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 100 100"
			className={cn("h-full w-full", className)}
			aria-hidden="true"
			focusable="false"
		>
			{LINES.map(([x1, y1, x2, y2], index) => (
				<line
					key={`line-${index}`}
					x1={x1}
					y1={y1}
					x2={x2}
					y2={y2}
					stroke="color-mix(in srgb, var(--primary) 28%, white)"
					strokeWidth="0.35"
					strokeLinecap="round"
				/>
			))}
			{STARS.map((star, index) => (
				<circle
					key={`star-${index}`}
					cx={star.cx}
					cy={star.cy}
					r={star.r}
					fill="color-mix(in srgb, var(--accent-gold) 55%, white)"
					className={`celestial-twinkle celestial-twinkle-delay-${index % 7}`}
				/>
			))}
		</svg>
	);
}
