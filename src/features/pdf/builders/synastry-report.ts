import { ZODIAC_SIGN_LABELS } from "@/features/astrology/constants/astrology-labels";
import {
	SYNASTRY_ASPECT_LABELS,
	SYNASTRY_BODY_LABELS,
	SYNASTRY_CATEGORY_LABELS,
} from "@/features/synastry/constants/synastry-labels";
import { getScoreBandLabel } from "@/features/synastry/utils/synastry-category-explanation";
import { PDF_THEME } from "@/features/pdf/constants/pdf-theme";
import type { SynastryPdfInput } from "@/features/pdf/types/pdf-report";
import {
	assertValidPdfDocument,
	compactPdfNodes,
} from "@/features/pdf/utils/compact-pdf-nodes";
import { formatDateOnlyDisplay } from "@/lib/date";

function pdfText(value: string | undefined | null, fallback = "—"): string {
	const trimmed = value?.trim();
	return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export function buildSynastryPdfDefinition(input: SynastryPdfInput) {
	const { result } = input;
	const created = new Date().toLocaleDateString("tr-TR");

	const personBlock = (side: "A" | "B") => {
		const person = side === "A" ? result.personA : result.personB;
		return {
			stack: compactPdfNodes([
				{ text: pdfText(person.label), style: "h3", margin: [0, 0, 0, 4] },
				{
					text: `${formatDateOnlyDisplay(person.birthDate)} · ${pdfText(person.birthTime)} · ${pdfText(person.locationDisplayName)}`,
					style: "muted",
					margin: [0, 0, 0, 6],
				},
				{
					text: `Güneş · ${ZODIAC_SIGN_LABELS[person.sun.sign]} ${person.sun.degreeInSign}°`,
					style: "body",
				},
				{
					text: pdfText(person.sun.shortDescription),
					style: "muted",
					margin: [0, 0, 0, 4],
				},
				{
					text: `Ay · ${ZODIAC_SIGN_LABELS[person.moon.sign]} ${person.moon.degreeInSign}°`,
					style: "body",
				},
				{
					text: pdfText(person.moon.shortDescription),
					style: "muted",
					margin: [0, 0, 0, 4],
				},
				{
					text: `Yükselen · ${ZODIAC_SIGN_LABELS[person.ascendant.sign]} ${person.ascendant.degreeInSign}°`,
					style: "body",
				},
				{
					text: pdfText(person.ascendant.shortDescription),
					style: "muted",
					margin: [0, 0, 0, 8],
				},
			]),
			unbreakable: true,
		};
	};

	const categoryBlocks = result.categoryDetails.map((detail) => ({
		stack: compactPdfNodes([
			{
				text: `${SYNASTRY_CATEGORY_LABELS[detail.category]} · %${detail.score}`,
				style: "h3",
				margin: [0, 6, 0, 2],
			},
			{ text: pdfText(detail.bandLabel), style: "muted", margin: [0, 0, 0, 4] },
			...detail.summary.map((paragraph) => ({
				text: pdfText(paragraph),
				style: "body",
				margin: [0, 0, 0, 3] as [number, number, number, number],
			})),
			detail.supportiveFactors.length > 0
				? {
						text: `Destekleyici: ${detail.supportiveFactors.map((f) => f.title).join("; ")}`,
						style: "muted",
						margin: [0, 2, 0, 2] as [number, number, number, number],
					}
				: false,
			detail.challengingFactors.length > 0
				? {
						text: `Dikkat: ${detail.challengingFactors.map((f) => f.title).join("; ")}`,
						style: "muted",
						margin: [0, 0, 0, 8] as [number, number, number, number],
					}
				: {
						text: "Bu kategoride belirgin bir zorlayıcı açı bulunmuyor.",
						style: "muted",
						margin: [0, 0, 0, 8] as [number, number, number, number],
					},
		]),
		unbreakable: true,
	}));

	const aspectTableBody =
		result.aspects.length > 0
			? [
					[
						{ text: "Kişi A", style: "tableHeader" },
						{ text: "Kişi B", style: "tableHeader" },
						{ text: "Açı", style: "tableHeader" },
						{ text: "Kategori", style: "tableHeader" },
					],
					...result.aspects.map((aspect) => [
						pdfText(SYNASTRY_BODY_LABELS[aspect.bodyA]),
						pdfText(SYNASTRY_BODY_LABELS[aspect.bodyB]),
						pdfText(SYNASTRY_ASPECT_LABELS[aspect.aspectType]),
						pdfText(SYNASTRY_CATEGORY_LABELS[aspect.category]),
					]),
				]
			: null;

	const content = compactPdfNodes([
		{ text: "Astrozel", style: "brand", margin: [0, 0, 0, 4] },
		{ text: "Çift Uyumu Raporu", style: "h1", margin: [0, 0, 0, 8] },
		{
			text: `${pdfText(result.personA.label)} & ${pdfText(result.personB.label)}`,
			style: "h2",
			margin: [0, 0, 0, 12],
		},
		{
			text: `Genel sembolik uyum: %${result.overallScore}`,
			style: "h2",
			margin: [0, 0, 0, 4],
		},
		{
			text: getScoreBandLabel(result.overallScore),
			style: "muted",
			margin: [0, 0, 0, 4],
		},
		{
			text: "Bu oran, iki doğum haritasındaki destekleyici ve zorlayıcı astrolojik göstergelerin ağırlıklı değerlendirmesidir. İlişkinin başarı ihtimalini veya geleceğini kesin olarak göstermez.",
			style: "body",
			margin: [0, 0, 0, 14],
		},
		{ text: "Haritalarınıza Kısa Bakış", style: "h2", margin: [0, 4, 0, 8] },
		{
			columns: [personBlock("A"), personBlock("B")],
			columnGap: 16,
			margin: [0, 0, 0, 12],
		},
		{ text: "Kategori detayları", style: "h2", margin: [0, 8, 0, 8] },
		...categoryBlocks,
		{ text: "İlişkinizin genel dinamiği", style: "h2", margin: [0, 8, 0, 8] },
		...result.overview.map((paragraph) => ({
			text: pdfText(paragraph),
			style: "body",
			margin: [0, 0, 0, 6] as [number, number, number, number],
		})),
		result.strengths.length > 0
			? { text: "İlişkinizin güçlü yönleri", style: "h2", margin: [0, 8, 0, 8] }
			: false,
		...result.strengths.map((item) => ({
			stack: compactPdfNodes([
				{ text: pdfText(item.title), style: "h3", margin: [0, 4, 0, 2] },
				{ text: pdfText(item.summary), style: "body", margin: [0, 0, 0, 6] },
			]),
			unbreakable: true,
		})),
		result.challenges.length > 0
			? {
					text: "Zorlanabileceğiniz alanlar",
					style: "h2",
					margin: [0, 8, 0, 8],
				}
			: false,
		...result.challenges.map((item) => ({
			stack: compactPdfNodes([
				{ text: pdfText(item.title), style: "h3", margin: [0, 4, 0, 2] },
				{ text: pdfText(item.summary), style: "body", margin: [0, 0, 0, 6] },
			]),
			unbreakable: true,
		})),
		aspectTableBody
			? { text: "Önemli sinastri açıları", style: "h2", margin: [0, 8, 0, 8] }
			: false,
		aspectTableBody
			? {
					table: {
						headerRows: 1,
						widths: ["*", "*", 50, "*"],
						body: aspectTableBody,
					},
					layout: "lightHorizontalLines",
					margin: [0, 0, 0, 12],
				}
			: false,
		{
			text: "Bu değerlendirme iki doğum haritasındaki sembolik astrolojik göstergelere dayanır. Yüzdeler ilişkinin başarı ihtimalini, geleceğini veya kişilerin gerçek davranışlarını kesin olarak göstermez.",
			style: "disclaimer",
			margin: [0, 12, 0, 0],
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
				fillColor: PDF_THEME.colors.sky,
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
