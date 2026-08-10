import { ConstellationField } from "@/components/celestial/constellation-field";
import { FloatingClouds } from "@/components/celestial/floating-clouds";
import { OrbitDecoration } from "@/components/celestial/orbit-decoration";
import { cn } from "@/lib/utils";

export function HeroSkyIllustration({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"pointer-events-none relative mx-auto aspect-square w-full max-w-lg overflow-hidden",
				className,
			)}
			aria-hidden="true"
		>
			<div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff8f0_0%,#e8f0fa_42%,#ddd6f3_78%,transparent_100%)] opacity-90" />
			<div className="absolute inset-[8%] opacity-70">
				<ConstellationField />
			</div>
			<div className="absolute inset-[6%] opacity-80">
				<OrbitDecoration />
			</div>
			<FloatingClouds className="rounded-full" />

			<svg
				viewBox="0 0 200 200"
				className="celestial-float absolute left-[18%] top-[16%] h-[52%] w-[52%] drop-shadow-sm"
				focusable="false"
			>
				<defs>
					<linearGradient id="astrozel-moon" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#fff9f0" />
						<stop offset="55%" stopColor="#f0e4c8" />
						<stop offset="100%" stopColor="#d8c4ef" />
					</linearGradient>
				</defs>
				<path
					d="M118 28c-46 8-78 50-74 98 4 52 48 90 100 86-38-14-64-52-60-94 3-34 26-62 34-90z"
					fill="url(#astrozel-moon)"
				/>
			</svg>

			<svg
				viewBox="0 0 100 100"
				className="absolute inset-[12%] opacity-25"
				focusable="false"
			>
				<path
					d="M10 70 Q50 40 90 70"
					fill="none"
					stroke="var(--primary)"
					strokeWidth="0.4"
				/>
				<path
					d="M15 80 Q50 52 85 80"
					fill="none"
					stroke="var(--primary)"
					strokeWidth="0.35"
				/>
				<path
					d="M20 55 Q50 30 80 55"
					fill="none"
					stroke="var(--accent-gold)"
					strokeWidth="0.3"
					opacity="0.7"
				/>
			</svg>

			<span className="celestial-float-delayed absolute right-[18%] top-[28%] h-4 w-4 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#b8954a)] shadow-sm" />
			<span className="celestial-float absolute bottom-[22%] left-[28%] h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#fff,#5b6fbf)]" />
			<span className="absolute inset-x-8 bottom-6 h-16 rounded-[100%] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--lavender)_45%,transparent),transparent_70%)] blur-md" />
		</div>
	);
}
