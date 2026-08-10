import {
	ASPECT_LABELS,
	PLANET_LABELS,
	ZODIAC_SIGN_LABELS,
} from "@/features/astrology/constants/astrology-labels";
import { CORE_PLANET_KEYS } from "@/features/astrology/constants/astrology-settings";
import { ASPECT_CONTENT } from "@/features/astrology/interpretations/content/aspects";
import { BIG_THREE_BY_KIND } from "@/features/astrology/interpretations/content/big-three";
import { HOUSE_CONTENT } from "@/features/astrology/interpretations/content/houses";
import { PLANET_CONTENT } from "@/features/astrology/interpretations/content/planets";
import { ZODIAC_SIGN_CONTENT } from "@/features/astrology/interpretations/content/zodiac-signs";
import {
	BIG_THREE_ROLE_LABELS,
	MAX_ASPECT_INTERPRETATIONS,
	PLANETS_WITHOUT_RETROGRADE,
	PLANET_INTERPRETATION_ORDER,
} from "@/features/astrology/interpretations/constants/interpretation-settings";
import type {
	AspectInterpretation,
	BigThreeInterpretation,
	NatalInterpretationResult,
	PlanetPlacementInterpretation,
} from "@/features/astrology/interpretations/types/interpretation";
import {
	aspectContentKey,
	bigThreeContentKey,
	planetHouseContentKey,
	planetSignContentKey,
} from "@/features/astrology/interpretations/utils/interpretation-key";
import {
	getOrbLabel,
	prioritizeAspectsForInterpretation,
} from "@/features/astrology/interpretations/utils/interpretation-priority";
import type {
	PlanetKey,
	ZodiacSign,
} from "@/features/astrology/types/astrology";
import type {
	NatalChartResult,
	NatalPlanetPosition,
} from "@/features/astrology/types/natal-chart";

function capitalize(value: string): string {
	if (!value) {
		return value;
	}
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function formatDegree(position: {
	degree: number;
	minute: number;
}): string {
	return `${position.degree}°${String(position.minute).padStart(2, "0")}′`;
}

function buildPlanetSignSummary(planet: PlanetKey, sign: ZodiacSign): string {
	const p = PLANET_CONTENT[planet];
	const z = ZODIAC_SIGN_CONTENT[sign];
	const signLabel = ZODIAC_SIGN_LABELS[sign];

switch (p.signTemplate) {
		case "identity":
			return `Güneş’in ${signLabel} burcunda olması, ${p.functionFocus} ${z.approach} biçimlendirebileceğini anlatır. ${capitalize(z.strength)} güçlü bir alan olabilir. ${capitalize(z.challenge)} ise zaman zaman denge gerektirebilir.`;
		case "emotion":
			return `Ay’ın ${signLabel} burcunda olması, duygularını ${z.approach} yaşama eğilimini gösterebilir. ${capitalize(z.strength)} iç dünyanı besleyebilir. ${capitalize(z.challenge)} duygusal ritmi zorlaştırabilir.`;
		case "mind":
			return `Merkür’ün ${signLabel} burcunda olması, düşüncelerini ${z.approach} düzenlemeye eğilim gösterebileceğini anlatır. ${capitalize(z.strength)} iletişimde öne çıkabilir. ${capitalize(z.challenge)} ise karar vermeyi zaman zaman yavaşlatabilir.`;
		case "relation":
			return `Venüs’ün ${signLabel} burcunda olması, ilişkilerde ve değerlerde ${z.approach} hareket etmeye yatkın olabileceğini gösterir. ${capitalize(z.strength)} bağ kurmayı destekleyebilir. ${capitalize(z.challenge)} yakınlıkta fark edilmesi faydalı olabilir.`;
		case "drive":
			return `Mars’ın ${signLabel} burcunda olması, isteklerini ve mücadeleni ${z.approach} yönlendirme eğilimini güçlendirebilir. ${capitalize(z.strength)} harekete geçmede kaynak olabilir. ${capitalize(z.challenge)} ise sabır alanını zorlayabilir.`;
		case "growth":
			return `Jüpiter’in ${signLabel} burcunda olması, gelişim ve anlam arayışını ${z.approach} genişletebileceğini anlatır. ${capitalize(z.strength)} büyüme yolunda destek olabilir. ${capitalize(z.challenge)} ölçüyü kaçırmamak için dikkat isteyebilir.`;
		case "structure":
			return `Satürn’ün ${signLabel} burcunda olması, sorumluluk ve sınırları ${z.approach} kurma eğilimini vurgulayabilir. ${capitalize(z.strength)} yapı oluşturmada güçlenebilir. ${capitalize(z.challenge)} esnekliği bilerek beslemeyi gerektirebilir.`;
		case "freedom":
			return `Uranüs’ün ${signLabel} burcunda olması, özgürlük ve özgünlük ihtiyacını ${z.approach} yaşatma eğilimini gösterebilir. ${capitalize(z.strength)} yenilik arayışını besleyebilir. ${capitalize(z.challenge)} ilişkilerde mesafe yaratabilir.`;
		case "vision":
			return `Neptün’ün ${signLabel} burcunda olması, hayal gücü ve ideallerini ${z.approach} besleyebileceğini anlatır. ${capitalize(z.strength)} sezgisel alanda öne çıkabilir. ${capitalize(z.challenge)} netlik ihtiyacını artırabilir.`;
		case "depth":
			return `Plüton’un ${signLabel} burcunda olması, dönüşüm ve derinlik ihtiyacını ${z.approach} deneyimleme eğilimini güçlendirebilir. ${capitalize(z.strength)} içsel güç alanında kaynak olabilir. ${capitalize(z.challenge)} yumuşak bırakmayı zorlaştırabilir.`;
		default: {
			const _exhaustive: never = p.signTemplate;
			return _exhaustive;
		}
	}
}

function buildCompactPlanetSignSummary(
	planet: PlanetKey,
	sign: ZodiacSign,
): string {
	const p = PLANET_CONTENT[planet];
	const z = ZODIAC_SIGN_CONTENT[sign];
	const signLabel = ZODIAC_SIGN_LABELS[sign];
	return `${p.compactPlacementLead} ${signLabel} burcunda ${z.approach} şekillenmeye yatkın olabilir.`;
}

function buildPlanetHouseSummary(planet: PlanetKey, house: number): string | null {
	if (!Number.isInteger(house) || house < 1 || house > 12) {
		return null;
	}
	const houseContent = HOUSE_CONTENT[house];
	if (!houseContent) {
		return null;
	}
	const p = PLANET_CONTENT[planet];
	return `${p.label}’ün ${house}. evde olması; ${p.role} ile ${houseContent.lifeArea} arasındaki bağlantıyı gösteren sembolik bir yerleşimdir.`;
}

function buildBigThree(
	chart: NatalChartResult,
	warnings: string[],
): BigThreeInterpretation[] {
	const overview: BigThreeInterpretation[] = [];

	const sun = chart.planets.find((planet) => planet.key === "sun");
	if (sun) {
		const content = BIG_THREE_BY_KIND.sun[sun.position.sign];
		const key = bigThreeContentKey("sun", sun.position.sign);
		overview.push({
			id: key,
			category: "sun",
			sign: sun.position.sign,
			title: content.title,
			summary: content.summary,
			potential: content.potential,
			balance: content.balance,
			roleLabel: BIG_THREE_ROLE_LABELS.sun,
			degreeFormatted: formatDegree(sun.position),
			priority: 1,
			relatedKeys: [key],
		});
	} else {
		warnings.push("Güneş konumu bulunamadığı için Güneş yorumu üretilemedi.");
	}

	const moon = chart.planets.find((planet) => planet.key === "moon");
	if (moon) {
		const content = BIG_THREE_BY_KIND.moon[moon.position.sign];
		const key = bigThreeContentKey("moon", moon.position.sign);
		overview.push({
			id: key,
			category: "moon",
			sign: moon.position.sign,
			title: content.title,
			summary: content.summary,
			potential: content.potential,
			balance: content.balance,
			roleLabel: BIG_THREE_ROLE_LABELS.moon,
			degreeFormatted: formatDegree(moon.position),
			priority: 2,
			relatedKeys: [key],
		});
	} else {
		warnings.push("Ay konumu bulunamadığı için Ay yorumu üretilemedi.");
	}

	const asc = chart.angles.find((angle) => angle.key === "ascendant");
	if (asc) {
		const content = BIG_THREE_BY_KIND.ascendant[asc.position.sign];
		const key = bigThreeContentKey("ascendant", asc.position.sign);
		overview.push({
			id: key,
			category: "ascendant",
			sign: asc.position.sign,
			title: content.title,
			summary: content.summary,
			potential: content.potential,
			balance: content.balance,
			roleLabel: BIG_THREE_ROLE_LABELS.ascendant,
			degreeFormatted: formatDegree(asc.position),
			priority: 3,
			relatedKeys: [key],
		});
	} else {
		warnings.push("Yükselen bulunamadığı için yükselen yorumu üretilemedi.");
	}

	return overview;
}

function resolveRetrograde(
	planet: NatalPlanetPosition,
	warnings: string[],
): boolean {
	if (!planet.isRetrograde) {
		return false;
	}
	if (PLANETS_WITHOUT_RETROGRADE.has(planet.key)) {
		warnings.push(
			`${PLANET_LABELS[planet.key]} için beklenmeyen retro bayrağı yok sayıldı.`,
		);
		return false;
	}
	return true;
}

function buildPlanetPlacements(
	chart: NatalChartResult,
	warnings: string[],
): PlanetPlacementInterpretation[] {
	const byKey = new Map(chart.planets.map((planet) => [planet.key, planet]));
	const placements: PlanetPlacementInterpretation[] = [];

	for (const [index, key] of PLANET_INTERPRETATION_ORDER.entries()) {
		const planet = byKey.get(key);
		if (!planet) {
			warnings.push(`${PLANET_LABELS[key]} bulunamadığı için yerleşim yorumu atlandı.`);
			continue;
		}

		const houseSummary = buildPlanetHouseSummary(planet.key, planet.house);
		if (!houseSummary) {
			warnings.push(
				`${PLANET_LABELS[key]} için geçersiz ev numarası nedeniyle ev yorumu atlandı.`,
			);
		}

		const isCompact = key === "sun" || key === "moon";
		const signKey = planetSignContentKey(planet.key, planet.position.sign);
		const houseKey = planetHouseContentKey(planet.key, planet.house);
		const isRetrograde = resolveRetrograde(planet, warnings);
		const planetContent = PLANET_CONTENT[planet.key];

		placements.push({
			id: `planet_placement.${planet.key}`,
			planet: planet.key,
			sign: planet.position.sign,
			house: planet.house,
			isRetrograde,
			title: `${planetContent.label} · ${ZODIAC_SIGN_LABELS[planet.position.sign]} · ${planet.house}. Ev`,
			signSummary: isCompact
				? buildCompactPlanetSignSummary(planet.key, planet.position.sign)
				: buildPlanetSignSummary(planet.key, planet.position.sign),
			houseSummary:
				houseSummary ??
				"Bu gezegen için geçerli bir ev yorumu üretilemedi.",
			retrogradeNote: isRetrograde ? planetContent.retrogradeNote : undefined,
			isCompact,
			priority: 10 + index,
			relatedKeys: [signKey, houseKey],
		});
	}

	return placements;
}

function buildAspectInterpretations(
	chart: NatalChartResult,
): AspectInterpretation[] {
	const selected = prioritizeAspectsForInterpretation(
		chart.aspects,
		MAX_ASPECT_INTERPRETATIONS,
	);

	return selected.map((aspect, index) => {
		const content = ASPECT_CONTENT[aspect.type];
		const label1 = PLANET_LABELS[aspect.body1];
		const label2 = PLANET_LABELS[aspect.body2];
		const role1 = PLANET_CONTENT[aspect.body1].role;
		const role2 = PLANET_CONTENT[aspect.body2].role;
		const key = aspectContentKey(aspect.body1, aspect.body2, aspect.type);

		const summary = `${label1} ile ${label2} arasındaki ${content.label.toLowerCase()}, ${role1} ile ${role2} ${content.bridgePhrase} anlatır. ${content.potential} ${content.balance}`;

		return {
			id: key,
			body1: aspect.body1,
			body2: aspect.body2,
			type: aspect.type,
			title: `${label1} ${ASPECT_LABELS[aspect.type]} ${label2}`,
			summary,
			orb: aspect.orb,
			orbLabel: getOrbLabel(aspect.orb),
			priority: 100 + index,
			relatedKeys: [key],
		};
	});
}

/**
 * Normalize edilmiş NatalChartResult’tan deterministic yorum üretir.
 * Input mutate edilmez; React / browser / Celestine bağımlılığı yoktur.
 */
export function createNatalInterpretations(
	chart: NatalChartResult,
): NatalInterpretationResult {
	const warnings: string[] = [];
	const overview = buildBigThree(chart, warnings);
	const planets = buildPlanetPlacements(chart, warnings);
	const aspects = buildAspectInterpretations(chart);

	return {
		overview,
		planets,
		aspects,
		warnings,
	};
}

export function listExpectedCorePlanets(): readonly PlanetKey[] {
	return CORE_PLANET_KEYS;
}
