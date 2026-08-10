import {
	ASPECT_LABELS,
	PLANET_LABELS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import { PDF_THEME } from "@/features/pdf/constants/pdf-theme";
import type { NatalPdfInput } from "@/features/pdf/types/pdf-report";
import {
	assertValidPdfDocument,
	compactPdfNodes,
} from "@/features/pdf/utils/compact-pdf-nodes";
import { formatDateOnlyDisplay } from "@/lib/date";

function pdfText(value: string | undefined | null, fallback = "—"): string {
	const trimmed = value?.trim();
	return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export function buildNatalChartPdfDefinition(input: NatalPdfInput) {
	const { result, interpretations, birthDate, birthTime } = input;
	const displayName = input.name?.trim() || "Doğum Haritası";
	const location = result.metadata.locationDisplayName;
	const created = new Date().toLocaleDateString("tr-TR");

	const planetRows = result.planets.map((planet) => [
		pdfText(PLANET_LABELS[planet.key]),
		pdfText(ZODIAC_SIGN_LABELS[planet.position.sign]),
		pdfText(planet.position.formatted),
		String(planet.house),
		planet.isRetrograde ? "Evet" : "Hayır",
	]);

	const houseRows = result.houses.map((house) => [
		String(house.house),
		pdfText(ZODIAC_SIGN_LABELS[house.position.sign]),
		pdfText(house.position.formatted),
	]);

	const aspectRows = result.aspects.slice(0, 12).map((aspect) => [
		`${pdfText(PLANET_LABELS[aspect.body1])} – ${pdfText(PLANET_LABELS[aspect.body2])}`,
		pdfText(ASPECT_LABELS[aspect.type]),
		`${aspect.orb.toFixed(1)}°`,
	]);

	const content = compactPdfNodes([
		{
			text: "Astrozel",
			style: "brand",
			margin: [0, 0, 0, 4],
		},
		{
			text: "Doğum Haritası Raporu",
			style: "h1",
			margin: [0, 0, 0, 12],
		},
		{
			table: {
				widths: ["*", "*"],
				body: [
					[
						{
							text: `İsim: ${displayName}`,
						},
						{
							text: `Tarih: ${formatDateOnlyDisplay(birthDate)}`,
						},
					],
					[
						{
							text: `Saat: ${pdfText(birthTime)}`,
						},
						{
							text: `Yer: ${pdfText(location)}`,
						},
					],
					[
						{
							text: "Tropikal Zodyak · Placidus Ev Sistemi",
							colSpan: 2,
						},
						{ text: "" },
					],
				],
			},
			layout: "noBorders",
			margin: [0, 0, 0, 16],
		},
		{ text: "Güneş, Ay, Yükselen ve MC", style: "h2", margin: [0, 8, 0, 8] },
		...interpretations.overview.map((item) => ({
			stack: compactPdfNodes([
				{ text: pdfText(item.title), style: "h3", margin: [0, 4, 0, 2] },
				{ text: pdfText(item.summary), style: "body" },
				{
					text: pdfText(item.potential),
					style: "muted",
					margin: [0, 2, 0, 6],
				},
			]),
			unbreakable: true,
		})),
		input.chartSvg
			? { text: "Doğum haritası çemberi", style: "h2", margin: [0, 12, 0, 8] }
			: false,
		input.chartSvg
			? {
					svg: input.chartSvg,
					width: 360,
					alignment: "center" as const,
					margin: [0, 0, 0, 12] as [number, number, number, number],
				}
			: {
					text: "Doğum haritası görseli bu rapora eklenemedi.",
					style: "muted",
					margin: [0, 8, 0, 12] as [number, number, number, number],
				},
		{ text: "Gezegen yerleşimleri", style: "h2", margin: [0, 8, 0, 8] },
		planetRows.length > 0
			? {
					table: {
						headerRows: 1,
						widths: ["*", "*", "*", 40, 40],
						body: [
							[
								{ text: "Gezegen", style: "tableHeader" },
								{ text: "Burç", style: "tableHeader" },
								{ text: "Konum", style: "tableHeader" },
								{ text: "Ev", style: "tableHeader" },
								{ text: "Retro", style: "tableHeader" },
							],
							...planetRows,
						],
					},
					layout: "lightHorizontalLines",
					margin: [0, 0, 0, 12],
				}
			: false,
		houseRows.length > 0
			? { text: "Ev başlangıçları", style: "h2", margin: [0, 8, 0, 8] }
			: false,
		houseRows.length > 0
			? {
					table: {
						headerRows: 1,
						widths: [40, "*", "*"],
						body: [
							[
								{ text: "Ev", style: "tableHeader" },
								{ text: "Burç", style: "tableHeader" },
								{ text: "Konum", style: "tableHeader" },
							],
							...houseRows,
						],
					},
					layout: "lightHorizontalLines",
					margin: [0, 0, 0, 12],
				}
			: false,
		aspectRows.length > 0
			? { text: "Öne çıkan açılar", style: "h2", margin: [0, 8, 0, 8] }
			: false,
		aspectRows.length > 0
			? {
					table: {
						headerRows: 1,
						widths: ["*", "*", 50],
						body: [
							[
								{ text: "Gezegenler", style: "tableHeader" },
								{ text: "Açı", style: "tableHeader" },
								{ text: "Orb", style: "tableHeader" },
							],
							...aspectRows,
						],
					},
					layout: "lightHorizontalLines",
					margin: [0, 0, 0, 12],
				}
			: false,
		{ text: "Seçilmiş yorumlar", style: "h2", margin: [0, 8, 0, 8] },
		...interpretations.planets.slice(0, 6).map((item) => ({
			stack: compactPdfNodes([
				{ text: pdfText(item.title), style: "h3", margin: [0, 4, 0, 2] },
				{
					text: pdfText(item.signSummary),
					style: "body",
					margin: [0, 0, 0, 6],
				},
			]),
			unbreakable: true,
		})),
		{
			text: "Bu rapor sembolik astrolojik göstergelere dayanır. Kesin gelecek tahmini veya profesyonel danışmanlık yerine geçmez.",
			style: "disclaimer",
			margin: [0, 16, 0, 0],
		},
		{
			text: `Oluşturma tarihi: ${created}`,
			style: "muted",
			margin: [0, 8, 0, 0],
		},
	]);

	const docDefinition = {
		pageSize: "A4" as const,
		pageMargins: PDF_THEME.pageMargins,
		footer: (currentPage: number, pageCount: number) => ({
			columns: [
				{
					text: PDF_THEME.siteUrl,
					color: PDF_THEME.colors.muted,
					fontSize: 8,
					margin: [40, 0, 0, 0],
				},
				{
					text: `Sayfa ${currentPage} / ${pageCount}`,
					alignment: "right" as const,
					color: PDF_THEME.colors.muted,
					fontSize: 8,
					margin: [0, 0, 40, 0],
				},
			],
			margin: [0, 20, 0, 0],
		}),
		content,
		styles: {
			brand: { fontSize: 11, color: PDF_THEME.colors.gold, bold: true },
			h1: { fontSize: 20, bold: true, color: PDF_THEME.colors.ink },
			h2: { fontSize: 14, bold: true, color: PDF_THEME.colors.ink },
			h3: { fontSize: 11, bold: true, color: PDF_THEME.colors.ink },
			body: { fontSize: 10, color: PDF_THEME.colors.ink, lineHeight: 1.35 },
			muted: { fontSize: 9, color: PDF_THEME.colors.muted },
			disclaimer: {
				fontSize: 9,
				color: PDF_THEME.colors.muted,
				italics: true,
			},
			tableHeader: {
				bold: true,
				fontSize: 9,
				color: PDF_THEME.colors.ink,
				fillColor: PDF_THEME.colors.lavender,
			},
		},
		defaultStyle: {
			font: "Roboto",
			fontSize: 10,
			color: PDF_THEME.colors.ink,
		},
	};

	assertValidPdfDocument(docDefinition);
	return docDefinition;
}
