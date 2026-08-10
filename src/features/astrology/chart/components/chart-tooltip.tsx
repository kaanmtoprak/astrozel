"use client";

import {
	ASPECT_LABELS,
	PLANET_LABELS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import { formatAspectOrb } from "@/features/astrology/components/chart-summary";
import type { ChartSelection } from "@/features/astrology/chart/types/chart-geometry";

export function ChartTooltip({
	selection,
	onClose,
}: {
	selection: ChartSelection;
	onClose: () => void;
}) {
	if (!selection) {
		return (
			<div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-3 text-center text-sm text-foreground/55">
				Gezegen veya açı seçerek detay görebilirsin.
			</div>
		);
	}

	const liveText =
		selection.kind === "planet"
			? `${PLANET_LABELS[selection.planet.key]}, ${ZODIAC_SIGN_LABELS[selection.planet.position.sign]} ${selection.planet.position.degree}°, ${selection.planet.house}. ev, ${selection.planet.isRetrograde ? "Retro" : "Direkt"}`
			: `${PLANET_LABELS[selection.aspect.body1]} ${ASPECT_LABELS[selection.aspect.type]} ${PLANET_LABELS[selection.aspect.body2]}, orb ${formatAspectOrb(selection.aspect.orb)}`;

	return (
		<div
			className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm"
			aria-live="polite"
		>
			<div className="flex items-start justify-between gap-3">
				<div>
					{selection.kind === "planet" ? (
						<>
							<p className="font-medium text-foreground">
								{PLANET_LABELS[selection.planet.key]}
							</p>
							<p className="mt-1 text-sm text-foreground/70">
								{ZODIAC_SIGN_LABELS[selection.planet.position.sign]}{" "}
								{selection.planet.position.degree}°
								{String(selection.planet.position.minute).padStart(2, "0")}′ ·{" "}
								{selection.planet.house}. Ev ·{" "}
								{selection.planet.isRetrograde ? "Retro" : "Direkt"}
							</p>
						</>
					) : (
						<>
							<p className="font-medium text-foreground">
								{PLANET_LABELS[selection.aspect.body1]}{" "}
								{selection.aspect.symbol}{" "}
								{PLANET_LABELS[selection.aspect.body2]}
							</p>
							<p className="mt-1 text-sm text-foreground/70">
								{ASPECT_LABELS[selection.aspect.type]} · Orb{" "}
								{formatAspectOrb(selection.aspect.orb)}
							</p>
						</>
					)}
					<p className="sr-only">{liveText}</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="rounded-lg px-2 py-1 text-xs text-foreground/60 hover:bg-muted hover:text-foreground"
				>
					Kapat
				</button>
			</div>
		</div>
	);
}
