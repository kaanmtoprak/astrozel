export function ChartLegend() {
	return (
		<ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-foreground/65">
			<li className="inline-flex items-center gap-2">
				<span
					className="inline-block h-0.5 w-5 rounded"
					style={{ background: "color-mix(in srgb, var(--primary) 70%, #7aa7d9)" }}
					aria-hidden="true"
				/>
				Mavi açılar
			</li>
			<li className="inline-flex items-center gap-2">
				<span
					className="inline-block h-0.5 w-5 rounded"
					style={{ background: "color-mix(in srgb, #c46b6b 75%, white)" }}
					aria-hidden="true"
				/>
				Kırmızı açılar
			</li>
			<li className="inline-flex items-center gap-2">
				<span
					className="inline-block h-0.5 w-5 rounded"
					style={{ background: "color-mix(in srgb, var(--accent-gold) 80%, #8a6a2f)" }}
					aria-hidden="true"
				/>
				Kavuşum
			</li>
			<li className="inline-flex items-center gap-2">
				<span className="font-medium text-foreground/80" aria-hidden="true">
					℞
				</span>
				Retro
			</li>
		</ul>
	);
}
