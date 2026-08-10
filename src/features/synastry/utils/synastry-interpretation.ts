import { ZODIAC_SIGN_LABELS } from "@/features/astrology/constants/astrology-labels";
import {
	SYNASTRY_ASPECT_LABELS,
	SYNASTRY_BODY_LABELS,
	SYNASTRY_CATEGORY_LABELS,
} from "@/features/synastry/constants/synastry-labels";
import {
	SYNASTRY_MAX_CHALLENGES,
	SYNASTRY_MAX_HIGHLIGHTED_ASPECTS,
	SYNASTRY_MAX_STRENGTHS,
} from "@/features/synastry/constants/synastry-settings";
import type {
	SynastryAspect,
	SynastryCategory,
	SynastryCategoryScores,
	SynastryInsight,
	SynastryPersonSummary,
	SynastryPolarity,
} from "@/features/synastry/types/synastry";
import { compareAspectPriority } from "@/features/synastry/utils/synastry-priority";

const FORBIDDEN_PHRASES = [
	"ruh eşi",
	"mükemmel çift",
	"kesin uyum",
	"kadın",
	"erkek",
	"eşiniz",
	"kaderiniz",
	"ayrılacaksınız",
	"evleneceksiniz",
] as const;

const ASPECT_COPY: Record<
	string,
	{ title: string; supportive: string; challenging: string; mixed: string }
> = {
	"synastry.sun.moon.trine": {
		title: "Güneş–Ay uyumu",
		supportive:
			"Güneş ve Ay arasındaki üçgen, duygusal yakınlık ve karşılıklı anlayış için destekleyici bir zemin sunabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.sun.moon.square": {
		title: "Güneş–Ay gerilimi",
		supportive: "",
		challenging:
			"Güneş ve Ay arasındaki kare, ihtiyaçlarınızı farklı ritimlerde ifade etmenize yol açabilir. Sabırlı dinlemek bu farkı yönetmeye yardımcı olur.",
		mixed: "",
	},
	"synastry.sun.moon.conjunction": {
		title: "Güneş–Ay kavuşumu",
		supportive:
			"Güneş ve Ay kavuşumu, kimlik ve duygusal ihtiyaçların birbirini tanımasına yardımcı olabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.sun.moon.opposition": {
		title: "Güneş–Ay karşıtı",
		supportive: "",
		challenging: "",
		mixed:
			"Güneş–Ay karşıtı, tamamlayıcı ama bazen zıt ihtiyaçlar getirebilir. Dengeli paylaşım bu bağı daha sürdürülebilir kılar.",
	},
	"synastry.sun.moon.sextile": {
		title: "Güneş–Ay sekstili",
		supportive:
			"Güneş–Ay sekstili, duygusal uyumu doğal ve hafif bir şekilde destekleyebilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.moon.moon.trine": {
		title: "Ay–Ay uyumu",
		supportive:
			"Ay’larınız arasındaki üçgen, duygusal güvenlik ve ev ortamı hissini güçlendirebilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.moon.moon.square": {
		title: "Ay–Ay farkı",
		supportive: "",
		challenging:
			"Ay’lar arasındaki kare, rahatlama ve bakım biçimlerinizde fark yaratabilir. Bu farkı konuşmak yakınlığı korur.",
		mixed: "",
	},
	"synastry.moon.moon.conjunction": {
		title: "Ay–Ay kavuşumu",
		supportive:
			"Ay kavuşumu, duygusal atmosferi paylaşmayı ve birbirinizi sezgisel biçimde anlama potansiyelini artırabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.mercury.mercury.trine": {
		title: "Merkür–Merkür uyumu",
		supportive:
			"Merkür üçgeni, düşünceleri ve günlük konuşmaları daha akıcı paylaşmanıza yardımcı olabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.mercury.mercury.square": {
		title: "Merkür–Merkür gerilimi",
		supportive: "",
		challenging:
			"Merkürler arasındaki kare, aynı konuyu farklı düşünme ve anlatma biçimleriyle ele almanıza neden olabilir. Varsayım yapmak yerine ne demek istediğinizi açıkça ifade etmek bu bağlantıyı daha yapıcı hâle getirebilir.",
		mixed: "",
	},
	"synastry.mercury.mercury.conjunction": {
		title: "Merkür–Merkür kavuşumu",
		supportive:
			"Merkür kavuşumu, benzer zihinsel ritim ve ortak merak alanları için destekleyici olabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.venus.mars.conjunction": {
		title: "Venüs–Mars çekimi",
		supportive:
			"Venüs–Mars kavuşumu, ilgi gösterme ve karşılık alma biçimlerinizi canlı tutabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.venus.mars.opposition": {
		title: "Venüs–Mars polaritesi",
		supportive: "",
		challenging: "",
		mixed:
			"Venüs–Mars karşıtı güçlü bir çekim yaratabilir; aynı zamanda tempo ve beklenti farklarını dengelemek gerekebilir.",
	},
	"synastry.venus.mars.trine": {
		title: "Venüs–Mars akışı",
		supportive:
			"Venüs–Mars üçgeni, çekim ve şefkat dengesini destekleyici biçimde taşıyabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.venus.mars.square": {
		title: "Venüs–Mars kıvılcımı",
		supportive: "",
		challenging: "",
		mixed:
			"Venüs–Mars karesi çekimi yoğunlaştırabilir; sınırlar ve tempo konusunda bilinçli olmak faydalıdır.",
	},
	"synastry.saturn.sun.trine": {
		title: "Güneş–Satürn istikrarı",
		supportive:
			"Güneş–Satürn üçgeni, sorumluluk ve uzun vadeli bağlılık için yapılandırıcı bir destek sunabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.saturn.sun.square": {
		title: "Güneş–Satürn baskısı",
		supportive: "",
		challenging:
			"Güneş–Satürn karesi, onay ve özgürlük temalarında baskı hissi yaratabilir. Net sınırlar ve karşılıklı saygı bu alanı yumuşatır.",
		mixed: "",
	},
	"synastry.saturn.moon.conjunction": {
		title: "Ay–Satürn ağırlığı",
		supportive: "",
		challenging: "",
		mixed:
			"Ay–Satürn kavuşumu güven ve sorumluluğu bir araya getirebilir; duygusal sıcaklığı bilinçli beslemek gerekir.",
	},
	"synastry.venus.ascendant.conjunction": {
		title: "Venüs–Yükselen çekimi",
		supportive:
			"Venüs’ün yükselenle kavuşumu, ilk izlenim ve yakınlık kurma biçiminde çekici bir etki bırakabilir.",
		challenging: "",
		mixed: "",
	},
	"synastry.moon.ascendant.conjunction": {
		title: "Ay–Yükselen yakınlığı",
		supportive:
			"Ay–yükselen kavuşumu, duygusal rahatlık ve doğal yakınlık hissini destekleyebilir.",
		challenging: "",
		mixed: "",
	},
};

export function getSynastryAspectCopy(
	key: string,
	polarity: SynastryPolarity,
): { title: string; summary: string } {
	const preset = ASPECT_COPY[key];
	if (preset) {
		const summary =
			polarity === "supportive"
				? preset.supportive || preset.mixed
				: polarity === "challenging"
					? preset.challenging || preset.mixed
					: preset.mixed || preset.supportive || preset.challenging;
		if (summary) {
			return { title: preset.title, summary };
		}
	}

	const parts = key.split(".");
	const bodyA = parts[1] as keyof typeof SYNASTRY_BODY_LABELS;
	const bodyB = parts[2] as keyof typeof SYNASTRY_BODY_LABELS;
	const aspect = parts[3] as keyof typeof SYNASTRY_ASPECT_LABELS;
	const labelA = SYNASTRY_BODY_LABELS[bodyA] ?? "Gezegen";
	const labelB = SYNASTRY_BODY_LABELS[bodyB] ?? "Gezegen";
	const aspectLabel = SYNASTRY_ASPECT_LABELS[aspect] ?? "Açı";

	if (polarity === "supportive") {
		return {
			title: `${labelA}–${labelB} ${aspectLabel.toLowerCase()}`,
			summary: `${labelA} ve ${labelB} arasındaki ${aspectLabel.toLowerCase()}, ilişkinizde destekleyici bir bağlantı olarak okunabilir.`,
		};
	}
	if (polarity === "challenging") {
		return {
			title: `${labelA}–${labelB} gerilimi`,
			summary: `${labelA} ve ${labelB} arasındaki ${aspectLabel.toLowerCase()}, zaman zaman dikkat ve bilinçli iletişim isteyebilir. Bu, ilişkinin yönetilemez olduğu anlamına gelmez.`,
		};
	}
	return {
		title: `${labelA}–${labelB} dinamiği`,
		summary: `${labelA} ve ${labelB} arasındaki ${aspectLabel.toLowerCase()}, hem çekim hem dengeleme ihtiyacı taşıyabilir.`,
	};
}

function scoreBandLabel(score: number): string {
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

function rankCategories(
	scores: SynastryCategoryScores,
): SynastryCategory[] {
	return (
		Object.entries(scores) as Array<[SynastryCategory, number]>
	)
		.sort((left, right) => {
			if (right[1] !== left[1]) {
				return right[1] - left[1];
			}
			return left[0].localeCompare(right[0]);
		})
		.map(([key]) => key);
}

function assertSafeText(text: string): string {
	const normalized = text.trim();
	if (!normalized) {
		return "Haritalarınızdaki göstergeler, ilişkinizde hem destekleyici hem de dikkat isteyen alanlar olabileceğini gösteriyor.";
	}
	const lower = normalized.toLowerCase();
	for (const phrase of FORBIDDEN_PHRASES) {
		if (lower.includes(phrase)) {
			return "Haritalarınızdaki göstergeler, ilişkinizde hem destekleyici hem de dikkat isteyen alanlar olabileceğini gösteriyor.";
		}
	}
	return normalized;
}

function toInsight(aspect: SynastryAspect): SynastryInsight {
	const copy = getSynastryAspectCopy(aspect.interpretationKey, aspect.polarity);
	return {
		title: assertSafeText(copy.title),
		summary: assertSafeText(copy.summary),
		bodyA: aspect.bodyA,
		bodyB: aspect.bodyB,
		aspectType: aspect.aspectType,
		orb: aspect.orb,
		category: aspect.category,
		polarity: aspect.polarity,
		interpretationKey: aspect.interpretationKey,
	};
}

function dedupeInsights(items: SynastryInsight[]): SynastryInsight[] {
	const seen = new Set<string>();
	const result: SynastryInsight[] = [];
	for (const item of items) {
		const key = `${item.interpretationKey}|${item.polarity}`;
		if (seen.has(key)) {
			continue;
		}
		seen.add(key);
		result.push(item);
	}
	return result;
}

export function selectHighlightedAspects(
	aspects: SynastryAspect[],
): SynastryAspect[] {
	return [...aspects]
		.sort(compareAspectPriority)
		.slice(0, SYNASTRY_MAX_HIGHLIGHTED_ASPECTS);
}

export function buildSynastryStrengths(
	aspects: SynastryAspect[],
): SynastryInsight[] {
	const supportive = aspects
		.filter(
			(aspect) =>
				aspect.polarity === "supportive" || aspect.polarity === "mixed",
		)
		.sort(compareAspectPriority)
		.map(toInsight);
	return dedupeInsights(supportive).slice(0, SYNASTRY_MAX_STRENGTHS);
}

export function buildSynastryChallenges(
	aspects: SynastryAspect[],
): SynastryInsight[] {
	const challenging = aspects
		.filter(
			(aspect) =>
				aspect.polarity === "challenging" || aspect.polarity === "mixed",
		)
		.sort(compareAspectPriority)
		.map(toInsight);
	return dedupeInsights(challenging).slice(0, SYNASTRY_MAX_CHALLENGES);
}

export function buildSynastryOverview(input: {
	overallScore: number;
	categoryScores: SynastryCategoryScores;
	aspects: SynastryAspect[];
	personA: SynastryPersonSummary;
	personB: SynastryPersonSummary;
}): string[] {
	const ranked = rankCategories(input.categoryScores);
	const highest = ranked[0];
	const lowest = ranked[ranked.length - 1];
	const supportive = [...input.aspects]
		.filter((aspect) => aspect.polarity === "supportive")
		.sort(compareAspectPriority);
	const challenging = [...input.aspects]
		.filter((aspect) => aspect.polarity === "challenging")
		.sort(compareAspectPriority);

	const topSupport = supportive[0];
	const topChallenge = challenging[0];
	const nameA = input.personA.label.replace(/[<>&"'`]/g, "");
	const nameB = input.personB.label.replace(/[<>&"'`]/g, "");
	const sunA = ZODIAC_SIGN_LABELS[input.personA.sun.sign];
	const sunB = ZODIAC_SIGN_LABELS[input.personB.sun.sign];
	const moonA = ZODIAC_SIGN_LABELS[input.personA.moon.sign];
	const moonB = ZODIAC_SIGN_LABELS[input.personB.moon.sign];
	const ascA = ZODIAC_SIGN_LABELS[input.personA.ascendant.sign];
	const ascB = ZODIAC_SIGN_LABELS[input.personB.ascendant.sign];

	const paragraphs: string[] = [];

	paragraphs.push(
		assertSafeText(
			`${nameA} (${sunA} Güneş, ${moonA} Ay, ${ascA} yükselen) ile ${nameB} (${sunB} Güneş, ${moonB} Ay, ${ascB} yükselen) arasındaki tablo, genel olarak “${scoreBandLabel(input.overallScore)}” bandında okunuyor. Bu oran, iki haritadaki destekleyici ve zorlayıcı göstergelerin ağırlıklı bir özetidir; ilişkinin geleceğini kesin olarak göstermez.`,
		),
	);

	paragraphs.push(
		assertSafeText(
			`Birbirlerinde neyi çekici bulabilecekleri, özellikle ilk izlenim ve yakınlık dilinde görünür: ${nameA} yükseleni ${ascA}, ${nameB} yükseleni ${ascB} ile günlük hayatta farklı bir “ilk karşılama” tarzı taşıyabilir. Güneş burçlarınız (${sunA}–${sunB}) ise kimlik ve yaşam yönünüzde ortak bir hikâyeyi nasıl kurduğunuzu etkiler.`,
		),
	);

	paragraphs.push(
		assertSafeText(
			`${SYNASTRY_CATEGORY_LABELS[highest]} alanında göstergeler daha belirgin. ` +
				(topSupport
					? `${SYNASTRY_BODY_LABELS[topSupport.bodyA]}–${SYNASTRY_BODY_LABELS[topSupport.bodyB]} ${SYNASTRY_ASPECT_LABELS[topSupport.aspectType].toLowerCase()} bağlantısı, burada birbirinizi daha kolay anlama veya birbirinizi besleme ihtimalini güçlendirebilir. `
					: "") +
				`Ay burçlarınız (${moonA} ve ${moonB}) duygusal güvenlik ihtiyacınızı ve rahatlama biçiminizi şekillendirir; kolay anlaştığınız anlar çoğu zaman bu ritmin uyumunda doğar.`,
		),
	);

	if (lowest !== highest) {
		paragraphs.push(
			assertSafeText(
				`${SYNASTRY_CATEGORY_LABELS[lowest]} tarafında skor daha temkinli görünüyor. ` +
					(topChallenge
						? `${SYNASTRY_BODY_LABELS[topChallenge.bodyA]}–${SYNASTRY_BODY_LABELS[topChallenge.bodyB]} ${SYNASTRY_ASPECT_LABELS[topChallenge.aspectType].toLowerCase()} zaman zaman farklı tepki hızları veya beklentiler üretebilir. `
						: "") +
					`Bu, ilişkinin yürümeyeceği anlamına gelmez; tartışma anında ne demek istediğinizi açıkça söylemek ve birbirinize kısa bir düşünme payı bırakmak dengeyi güçlendirebilir.`,
			),
		);
	}

	paragraphs.push(
		assertSafeText(
			`İlişkinin dengesi için pratik hat: güçlü görünen ${SYNASTRY_CATEGORY_LABELS[highest].toLowerCase()} alanını bilinçli beslemek, daha temkinli olan ${SYNASTRY_CATEGORY_LABELS[lowest].toLowerCase()} alanında ise varsayım yerine soru sormak. Haritayı sabit bir yargı gibi değil, konuşulabilir bir dil olarak kullanmak daha yapıcıdır.`,
		),
	);

	return paragraphs.slice(0, 5).filter(Boolean);
}

export function getCategoryBlurb(
	category: SynastryCategory,
	score: number,
): string {
	if (score >= 70) {
		return `${SYNASTRY_CATEGORY_LABELS[category]} göstergeleri destekleyici görünüyor.`;
	}
	if (score >= 50) {
		return `${SYNASTRY_CATEGORY_LABELS[category]} alanında karışık ama geliştirilebilir bir dinamik var.`;
	}
	return `${SYNASTRY_CATEGORY_LABELS[category]} için daha bilinçli denge faydalı olabilir.`;
}
