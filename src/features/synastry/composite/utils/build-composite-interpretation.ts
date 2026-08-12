import { ASPECT_CONTENT } from "@/features/astrology/interpretations/content/aspects";
import { ZODIAC_SIGN_CONTENT } from "@/features/astrology/interpretations/content/zodiac-signs";
import type {
	CompositeAspect,
	CompositeInterpretation,
	CompositePlanet,
} from "@/features/synastry/composite/types/composite";

function paragraphsForSignRole(
	planet: CompositePlanet,
	roleLead: string,
	roleFocus: string,
): string[] {
	const content = ZODIAC_SIGN_CONTENT[planet.sign];
	return [
		`Composite ${planet.name} ${planet.signLabel} burcunda yer alır. ${roleLead} ${content.approach} bir ortak ritim kurabilir; öne çıkan güç alanı ${content.strength} temalarıyla ilişkilendirilebilir.`,
		`${roleFocus} aynı zamanda ${content.challenge} eğilimi fark edilmezse ortak ritmi zorlayabilir. Bu yerleşim bir kader sonucu değil; ilişkinin birlikte nasıl hareket edebileceğine dair sembolik bir çerçevedir.`,
	];
}

function supportiveLines(aspects: CompositeAspect[]): string[] {
	const supportive = aspects.filter(
		(aspect) =>
			aspect.type === "trine" ||
			aspect.type === "sextile" ||
			(aspect.type === "conjunction" &&
				!(
					(aspect.planetA === "mars" && aspect.planetB === "saturn") ||
					(aspect.planetA === "saturn" && aspect.planetB === "mars") ||
					(aspect.planetA === "sun" && aspect.planetB === "saturn") ||
					(aspect.planetA === "saturn" && aspect.planetB === "sun")
				)),
	);

	if (supportive.length === 0) {
		return [
			"Bu composite haritada öne çıkan sıkı uyumlu major açı sınırlı görünüyor. Bu, ilişkinin ortak yapısının daha sakin veya daha az ‘açısal vurgulu’ olabileceğini sembolik olarak gösterebilir; yine de burç yerleşimleri tek başına bir ritmi tanımlar.",
		];
	}

	return supportive.slice(0, 3).map((aspect) => {
		const copy = ASPECT_CONTENT[aspect.type];
		return `${aspect.planetAName}–${aspect.planetBName} ${aspect.typeLabel.toLowerCase()} (${aspect.symbol}, orb ${aspect.orb.toFixed(1)}°): ${copy.dynamic} ${copy.potential}`;
	});
}

function challengingLines(aspects: CompositeAspect[]): string[] {
	const challenging = aspects.filter(
		(aspect) =>
			aspect.type === "square" ||
			aspect.type === "opposition" ||
			(aspect.type === "conjunction" &&
				(aspect.planetA === "mars" ||
					aspect.planetB === "mars" ||
					aspect.planetA === "saturn" ||
					aspect.planetB === "saturn" ||
					aspect.planetA === "pluto" ||
					aspect.planetB === "pluto")),
	);

	if (challenging.length === 0) {
		return [
			"Belirgin zorlayıcı major açı öne çıkmıyor. Bu, ilişkinin ortak haritasında sürtünmenin daha çok burç tonlarından veya gündelik pratikten gelebileceğini düşündürür; ‘sorunsuz’ anlamına gelmez.",
		];
	}

	return challenging.slice(0, 3).map((aspect) => {
		const copy = ASPECT_CONTENT[aspect.type];
		return `${aspect.planetAName}–${aspect.planetBName} ${aspect.typeLabel.toLowerCase()} (${aspect.symbol}, orb ${aspect.orb.toFixed(1)}°): ${copy.dynamic} ${copy.balance}`;
	});
}

function sharedTheme(
	sun: CompositePlanet,
	moon: CompositePlanet,
	venus: CompositePlanet,
	mars: CompositePlanet,
	aspects: CompositeAspect[],
): string[] {
	const sunContent = ZODIAC_SIGN_CONTENT[sun.sign];
	const moonContent = ZODIAC_SIGN_CONTENT[moon.sign];
	const top = aspects[0];
	const aspectHint = top
		? ` En sıkı major açı ${top.planetAName}–${top.planetBName} ${top.typeLabel.toLowerCase()} olarak öne çıkar; bu da ortak dinamikte şu potansiyeli sembolik olarak güçlendirebilir: ${ASPECT_CONTENT[top.type].potential}`
		: " Ortak haritada belirgin bir tek dominant açı yerine burç tonlarının daha dengeli dağılması mümkün görünür.";

	return [
		`İlişkinin ortak kimliği ${sun.signLabel} Güneş’iyle ${sunContent.strength} ekseninde; duygusal iklim ise ${moon.signLabel} Ay’ıyla ${moonContent.approach} bir ritimde okunabilir.`,
		`Yakınlık dili ${venus.signLabel} Venüs, tempo ve gerilim biçimi ${mars.signLabel} Mars üzerinden şekillenebilir.${aspectHint}`,
	];
}

/**
 * Deterministic composite interpretation. Speaks about the relationship as a whole —
 * not either partner’s natal personality and not a fate verdict.
 */
export function buildCompositeInterpretation(input: {
	sun: CompositePlanet;
	moon: CompositePlanet;
	venus: CompositePlanet;
	mars: CompositePlanet;
	aspects: CompositeAspect[];
}): CompositeInterpretation {
	return {
		character: paragraphsForSignRole(
			input.sun,
			"İlişkinin temel karakteri bu yerleşimle",
			"Ortak yön ve görünür amaç",
		),
		emotional: paragraphsForSignRole(
			input.moon,
			"Duygusal atmosfer bu yerleşimle",
			"Güvenlik ve bakım ritmi",
		),
		love: paragraphsForSignRole(
			input.venus,
			"Sevgi ve yakınlık dili bu yerleşimle",
			"Beğeni ve bağ kurma biçimi",
		),
		drive: paragraphsForSignRole(
			input.mars,
			"Hareket ve çatışma biçimi bu yerleşimle",
			"İstek, tempo ve sınır koyma",
		),
		supportiveDynamics: supportiveLines(input.aspects),
		challengingDynamics: challengingLines(input.aspects),
		sharedTheme: sharedTheme(
			input.sun,
			input.moon,
			input.venus,
			input.mars,
			input.aspects,
		),
	};
}
