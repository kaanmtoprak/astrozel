import { ZODIAC_SIGN_CONTENT } from "@/features/astrology/interpretations/content/zodiac-signs";
import {
	SYNASTRY_ASPECT_LABELS,
	SYNASTRY_BODY_LABELS,
	SYNASTRY_CATEGORY_LABELS,
} from "@/features/synastry/constants/synastry-labels";
import type {
	SynastryAspect,
	SynastryBodyKey,
	SynastryCategory,
	SynastryCategoryDetail,
	SynastryCategoryScores,
	SynastryEvidence,
	SynastryPersonSummary,
} from "@/features/synastry/types/synastry";
import { compareAspectPriority } from "@/features/synastry/utils/synastry-priority";
import { getSynastryAspectCopy } from "@/features/synastry/utils/synastry-interpretation";

const CATEGORY_BODIES: Record<SynastryCategory, Set<SynastryBodyKey>> = {
	emotional: new Set([
		"sun",
		"moon",
		"venus",
		"mars",
		"saturn",
		"ascendant",
	]),
	communication: new Set(["sun", "moon", "mercury", "venus", "mars"]),
	attraction: new Set(["sun", "venus", "mars", "ascendant"]),
	longTerm: new Set(["sun", "moon", "jupiter", "saturn", "ascendant"]),
};

const FORBIDDEN = [
	"kadın",
	"erkek",
	"ruh eşi",
	"kaderiniz",
	"ayrılacaksınız",
	"evleneceksiniz",
] as const;

export function getScoreBandLabel(score: number): string {
	if (score <= 39) {
		return "Daha fazla bilinçli denge gerektiriyor";
	}
	if (score <= 59) {
		return "Karışık ve geliştirilebilir dinamik";
	}
	if (score <= 74) {
		return "Destekleyici bağlantılar öne çıkıyor";
	}
	if (score <= 89) {
		return "Güçlü sembolik uyum";
	}
	return "Çok yoğun destekleyici göstergeler";
}

function safe(text: string, fallback: string): string {
	const trimmed = text.trim();
	if (!trimmed) {
		return fallback;
	}
	const lower = trimmed.toLowerCase();
	for (const phrase of FORBIDDEN) {
		if (lower.includes(phrase)) {
			return fallback;
		}
	}
	return trimmed;
}

function escapeName(name: string): string {
	return name.replace(/[<>&"'`]/g, "");
}

function aspectTouchesCategory(
	aspect: SynastryAspect,
	category: SynastryCategory,
): boolean {
	if (aspect.category === category) {
		return true;
	}
	const bodies = CATEGORY_BODIES[category];
	return bodies.has(aspect.bodyA) && bodies.has(aspect.bodyB);
}

function toEvidence(
	aspect: SynastryAspect,
	category: SynastryCategory,
	listPolarity: "supportive" | "challenging",
): SynastryEvidence {
	const copy = getSynastryAspectCopy(aspect.interpretationKey, aspect.polarity);
	const orbRounded = Number(aspect.orb.toFixed(2));
	const id = [
		category,
		listPolarity,
		aspect.bodyA,
		aspect.bodyB,
		aspect.aspectType,
		String(orbRounded),
	].join("-");

	return {
		id,
		title: safe(
			`${SYNASTRY_BODY_LABELS[aspect.bodyA]}–${SYNASTRY_BODY_LABELS[aspect.bodyB]} ${SYNASTRY_ASPECT_LABELS[aspect.aspectType]}`,
			"Astrolojik bağlantı",
		),
		description: safe(copy.summary, "Bu bağlantı kategori dinamiğine katkı sağlar."),
		bodyA: aspect.bodyA,
		bodyB: aspect.bodyB,
		aspectType: aspect.aspectType,
		orb: aspect.orb,
		polarity: aspect.polarity,
	};
}

function pickFactors(
	aspects: SynastryAspect[],
	category: SynastryCategory,
	polarity: "supportive" | "challenging",
	limit: number,
	excludeKeys: Set<string> = new Set(),
): SynastryEvidence[] {
	const filtered = aspects
		.filter((aspect) => aspectTouchesCategory(aspect, category))
		.filter((aspect) =>
			polarity === "supportive"
				? aspect.polarity === "supportive" || aspect.polarity === "mixed"
				: aspect.polarity === "challenging" || aspect.polarity === "mixed",
		)
		.sort(compareAspectPriority);

	const seen = new Set<string>();
	const result: SynastryEvidence[] = [];
	for (const aspect of filtered) {
		const signature = `${aspect.bodyA}|${aspect.bodyB}|${aspect.aspectType}|${aspect.orb.toFixed(2)}`;
		if (excludeKeys.has(signature) || seen.has(signature)) {
			continue;
		}
		seen.add(signature);
		result.push(toEvidence(aspect, category, polarity));
		if (result.length >= limit) {
			break;
		}
	}
	return result;
}

function behaviorLine(
	category: SynastryCategory,
	person: SynastryPersonSummary,
): string {
	const name = escapeName(person.label);
	if (category === "emotional") {
		const moon = ZODIAC_SIGN_CONTENT[person.moon.sign];
		return safe(
			`${name}, duygularını ${moon.approach} yaşama eğilimindedir.`,
			`${name} duygusal ritmini kendi Ay yerleşimi üzerinden kurar.`,
		);
	}
	if (category === "communication") {
		const mercury = ZODIAC_SIGN_CONTENT[person.mercurySign];
		return safe(
			`${name}, düşüncelerini ${mercury.approach} aktarma eğilimindedir; ${mercury.strength} iletişimini besleyebilir.`,
			`${name} iletişimde kendi temposunu korur.`,
		);
	}
	if (category === "attraction") {
		const venus = ZODIAC_SIGN_CONTENT[person.venusSign];
		const mars = ZODIAC_SIGN_CONTENT[person.marsSign];
		return safe(
			`${name}, ilgiyi ${venus.approach} gösterirken isteğini ${mars.approach} ortaya koyabilir.`,
			`${name} yakınlık temposunu kendi tarzında kurar.`,
		);
	}
	const sun = ZODIAC_SIGN_CONTENT[person.sun.sign];
	const asc = ZODIAC_SIGN_CONTENT[person.ascendant.sign];
	return safe(
		`${name}, uzun vadede ${sun.approach} ilerlerken ilk izlenimde ${asc.approach} görünebilir.`,
		`${name} sorumluluk ve düzen kurma biçimini kendi haritasından taşır.`,
	);
}

function practicalLine(
	category: SynastryCategory,
	score: number,
	hasChallenge: boolean,
): string {
	const label = SYNASTRY_CATEGORY_LABELS[category];
	if (!hasChallenge && score >= 60) {
		return safe(
			`${label} alanında belirgin bir zorlayıcı açı öne çıkmıyor; yine de günlük hayatta küçük yanlış anlaşılmalar olabilir. Bu, haritada bu başlıkta güçlü bir gerilim göstergesi olmadığı anlamına gelir.`,
			"Bu alanda dengeli bir işbirliği potansiyeli görünüyor.",
		);
	}
	if (hasChallenge) {
		return safe(
			`Aranızdaki bağda ${label.toLowerCase()} için anlaşma potansiyeli var; gergin anlarda birbirinize düşünme süresi tanımak faydalı olabilir.`,
			"Bilinçli iletişim bu alanı daha yönetilebilir kılar.",
		);
	}
	return safe(
		`${label} göstergeleri karışık; küçük adımlarla ortak bir dil kurmak dengeyi güçlendirebilir.`,
		"Ortak bir dil kurmak faydalı olabilir.",
	);
}

function factorSentence(
	kind: "supportive" | "challenging",
	factor: SynastryEvidence | undefined,
	category: SynastryCategory,
): string | null {
	if (!factor) {
		if (kind === "supportive") {
			return null;
		}
		return safe(
			`Bu kategoride belirgin bir zorlayıcı açı bulunmuyor. Bu durum hiç anlaşmazlık yaşamayacağınız anlamına gelmez; yalnızca haritalarda ${SYNASTRY_CATEGORY_LABELS[category].toLowerCase()} başlığında güçlü bir gerilim göstergesi olmadığı anlamına gelir.`,
			"Bu kategoride belirgin bir zorlayıcı açı bulunmuyor.",
		);
	}
	if (kind === "supportive") {
		return safe(
			`${factor.title} gibi destekleyici bir gösterge, ${SYNASTRY_CATEGORY_LABELS[category].toLowerCase()} alanındaki ihtiyaçlarınızı daha kolay sezmenize yardımcı olabilir. ${factor.description}`,
			factor.description,
		);
	}
	return safe(
		`${factor.title} ise dikkat isteyen bir dinamik yaratabilir. ${factor.description}`,
		factor.description,
	);
}

export function buildSynastryCategoryDetail(input: {
	category: SynastryCategory;
	score: number;
	aspects: SynastryAspect[];
	personA: SynastryPersonSummary;
	personB: SynastryPersonSummary;
}): SynastryCategoryDetail {
	const supportiveFactors = pickFactors(
		input.aspects,
		input.category,
		"supportive",
		2,
	);
	const usedSignatures = new Set(
		supportiveFactors.map(
			(factor) =>
				`${factor.bodyA}|${factor.bodyB}|${factor.aspectType}|${(factor.orb ?? 0).toFixed(2)}`,
		),
	);
	const challengingFactors = pickFactors(
		input.aspects,
		input.category,
		"challenging",
		2,
		usedSignatures,
	);

	const summary: string[] = [];

	summary.push(behaviorLine(input.category, input.personA));
	summary.push(behaviorLine(input.category, input.personB));

	const supportSentence = factorSentence(
		"supportive",
		supportiveFactors[0],
		input.category,
	);
	if (supportSentence) {
		summary.push(supportSentence);
	}

	const challengeSentence = factorSentence(
		"challenging",
		challengingFactors[0],
		input.category,
	);
	if (challengeSentence) {
		summary.push(challengeSentence);
	}

	const practical = practicalLine(
		input.category,
		input.score,
		challengingFactors.length > 0,
	);
	summary.push(practical);

	return {
		category: input.category,
		score: input.score,
		bandLabel: getScoreBandLabel(input.score),
		summary: summary.filter(Boolean).slice(0, 5),
		supportiveFactors,
		challengingFactors,
		practicalSummary: practical,
	};
}

export function buildAllCategoryDetails(input: {
	categoryScores: SynastryCategoryScores;
	aspects: SynastryAspect[];
	personA: SynastryPersonSummary;
	personB: SynastryPersonSummary;
}): SynastryCategoryDetail[] {
	const order: SynastryCategory[] = [
		"emotional",
		"communication",
		"attraction",
		"longTerm",
	];
	return order.map((category) =>
		buildSynastryCategoryDetail({
			category,
			score: input.categoryScores[category],
			aspects: input.aspects,
			personA: input.personA,
			personB: input.personB,
		}),
	);
}
