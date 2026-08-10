const PDF_SAFE_FONT = "Roboto";

function paintValue(value: string): string | null {
	const trimmed = value.trim();
	if (
		!trimmed ||
		trimmed === "none" ||
		trimmed === "transparent" ||
		trimmed.startsWith("url(")
	) {
		return null;
	}
	return trimmed;
}

function applyComputedPresentation(source: Element, target: Element): void {
	if (!(source instanceof SVGElement) || !(target instanceof SVGElement)) {
		return;
	}

	const computed = window.getComputedStyle(source);
	const fill = paintValue(computed.fill);
	const stroke = paintValue(computed.stroke);

	if (fill) {
		target.setAttribute("fill", fill);
	} else if (target.hasAttribute("fill")) {
		target.setAttribute("fill", "none");
	}

	if (stroke) {
		target.setAttribute("stroke", stroke);
	} else if (target.hasAttribute("stroke")) {
		target.setAttribute("stroke", "none");
	}

	if (computed.strokeWidth) {
		target.setAttribute("stroke-width", computed.strokeWidth);
	}
	if (computed.strokeOpacity && computed.strokeOpacity !== "1") {
		target.setAttribute("stroke-opacity", computed.strokeOpacity);
	}
	if (computed.fillOpacity && computed.fillOpacity !== "1") {
		target.setAttribute("fill-opacity", computed.fillOpacity);
	}
	if (computed.opacity && computed.opacity !== "1") {
		target.setAttribute("opacity", computed.opacity);
	}

	if (target instanceof SVGTextElement || target instanceof SVGTSpanElement) {
		if (computed.fontSize) {
			target.setAttribute("font-size", computed.fontSize);
		}
		target.setAttribute("font-family", PDF_SAFE_FONT);
		if (computed.fontWeight) {
			target.setAttribute("font-weight", computed.fontWeight);
		}
		if (computed.textAnchor && computed.textAnchor !== "start") {
			target.setAttribute("text-anchor", computed.textAnchor);
		}
	}

	target.removeAttribute("class");
	target.removeAttribute("style");
}

/**
 * Clone the on-screen natal wheel into a pdfmake-safe SVG string.
 * Resolves CSS variables / color-mix to concrete paints before serialization.
 */
export function cloneNatalChartSvgForPdf(): string | null {
	if (typeof document === "undefined" || typeof window === "undefined") {
		return null;
	}

	const source = document.querySelector(
		'svg[data-pdf-chart="natal"]',
	) as SVGSVGElement | null;
	if (!source) {
		return null;
	}

	const clone = source.cloneNode(true) as SVGSVGElement;
	clone.removeAttribute("class");
	clone.removeAttribute("style");
	clone.setAttribute("width", "480");
	clone.setAttribute("height", "480");
	clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

	const sourceNodes = [source, ...Array.from(source.querySelectorAll("*"))];
	const cloneNodes = [clone, ...Array.from(clone.querySelectorAll("*"))];

	const count = Math.min(sourceNodes.length, cloneNodes.length);
	for (let index = 0; index < count; index += 1) {
		applyComputedPresentation(sourceNodes[index]!, cloneNodes[index]!);
	}

	const interactive = clone.querySelectorAll(
		"[onclick],[onmouseenter],[onmouseleave],[tabindex],[role='button']",
	);
	interactive.forEach((node) => {
		node.removeAttribute("onclick");
		node.removeAttribute("onmouseenter");
		node.removeAttribute("onmouseleave");
		node.removeAttribute("tabindex");
		node.removeAttribute("role");
	});

	const serializer = new XMLSerializer();
	return serializer.serializeToString(clone);
}
