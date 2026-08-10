/**
 * Deterministic celestial backdrop for synastry pages.
 * Same DOM on server and client; mobile reduction is CSS-only.
 */

const STARS = [
	{ cx: 8, cy: 12, r: 1.1, opacity: 0.55 },
	{ cx: 18, cy: 28, r: 0.9, opacity: 0.4 },
	{ cx: 32, cy: 8, r: 1.2, opacity: 0.5 },
	{ cx: 48, cy: 22, r: 0.8, opacity: 0.35 },
	{ cx: 62, cy: 14, r: 1.0, opacity: 0.45 },
	{ cx: 74, cy: 34, r: 0.9, opacity: 0.38 },
	{ cx: 86, cy: 18, r: 1.15, opacity: 0.52 },
	{ cx: 12, cy: 48, r: 0.85, opacity: 0.32 },
	{ cx: 40, cy: 56, r: 1.0, opacity: 0.42 },
	{ cx: 58, cy: 68, r: 0.75, opacity: 0.3 },
	{ cx: 78, cy: 52, r: 1.05, opacity: 0.48 },
	{ cx: 92, cy: 72, r: 0.9, opacity: 0.36 },
] as const;

export function SynastrySkyBackground() {
	return (
		<div
			className="synastry-sky pointer-events-none absolute inset-0 -z-10 overflow-hidden"
			aria-hidden="true"
		>
			<div className="synastry-sky-gradient absolute inset-0" />
			<div className="synastry-sky-nebula synastry-sky-nebula-a absolute -left-[12%] top-[8%] h-[42%] w-[48%] rounded-full" />
			<div className="synastry-sky-nebula synastry-sky-nebula-b absolute -right-[10%] top-[18%] h-[38%] w-[44%] rounded-full" />
			<div className="synastry-sky-nebula synastry-sky-nebula-c absolute bottom-[6%] left-[28%] h-[28%] w-[40%] rounded-full" />

			<svg
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<ellipse
					className="synastry-sky-orbit synastry-sky-orbit-a"
					cx="72"
					cy="22"
					rx="22"
					ry="7"
					fill="none"
					stroke="var(--primary)"
					strokeOpacity="0.18"
					strokeWidth="0.35"
				/>
				<ellipse
					className="synastry-sky-orbit synastry-sky-orbit-b"
					cx="28"
					cy="78"
					rx="18"
					ry="6"
					fill="none"
					stroke="var(--lavender)"
					strokeOpacity="0.28"
					strokeWidth="0.3"
				/>
				<ellipse
					className="synastry-sky-orbit synastry-sky-orbit-c"
					cx="50"
					cy="46"
					rx="14"
					ry="4.5"
					fill="none"
					stroke="var(--sky-blue)"
					strokeOpacity="0.35"
					strokeWidth="0.28"
				/>

				{/* Two soft celestial points representing two people */}
				<circle cx="36" cy="40" r="1.8" fill="var(--lavender)" fillOpacity="0.55" />
				<circle cx="64" cy="40" r="1.8" fill="var(--sky-blue)" fillOpacity="0.6" />
				<path
					d="M38 40 C46 34, 54 34, 62 40"
					fill="none"
					stroke="var(--primary)"
					strokeOpacity="0.22"
					strokeWidth="0.35"
				/>

				{STARS.map((star, index) => (
					<circle
						key={`synastry-star-${index}`}
						className={
							index >= 8
								? "synastry-sky-star synastry-sky-star-dense"
								: "synastry-sky-star"
						}
						cx={star.cx}
						cy={star.cy}
						r={star.r}
						fill="var(--accent-gold)"
						fillOpacity={star.opacity}
						style={{ animationDelay: `${index * 0.7}s` }}
					/>
				))}
			</svg>
		</div>
	);
}
