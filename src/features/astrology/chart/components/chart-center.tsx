import {
	CHART_CENTER_X,
	CHART_CENTER_Y,
} from "@/features/astrology/chart/constants/chart-layout";

export function ChartCenter({
	name,
	birthDateLabel,
	birthTime,
	placeLabel,
}: {
	name?: string;
	birthDateLabel: string;
	birthTime: string;
	placeLabel: string;
}) {
	const title = name?.trim() ? name.trim() : "Doğum Haritası";

	return (
		<g aria-hidden="true">
			<text
				x={CHART_CENTER_X}
				y={CHART_CENTER_Y - 18}
				textAnchor="middle"
				dominantBaseline="middle"
				fontSize={14}
				fontWeight={600}
				fill="color-mix(in srgb, var(--foreground) 80%, transparent)"
				style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
			>
				{title.length > 22 ? `${title.slice(0, 20)}…` : title}
			</text>
			<text
				x={CHART_CENTER_X}
				y={CHART_CENTER_Y + 2}
				textAnchor="middle"
				dominantBaseline="middle"
				fontSize={10}
				fill="color-mix(in srgb, var(--foreground) 60%, transparent)"
				style={{ fontFamily: "var(--font-sans), sans-serif" }}
			>
				{birthDateLabel} · {birthTime}
			</text>
			<text
				x={CHART_CENTER_X}
				y={CHART_CENTER_Y + 18}
				textAnchor="middle"
				dominantBaseline="middle"
				fontSize={9}
				fill="color-mix(in srgb, var(--foreground) 50%, transparent)"
				style={{ fontFamily: "var(--font-sans), sans-serif" }}
			>
				{placeLabel.length > 28 ? `${placeLabel.slice(0, 26)}…` : placeLabel}
			</text>
		</g>
	);
}
