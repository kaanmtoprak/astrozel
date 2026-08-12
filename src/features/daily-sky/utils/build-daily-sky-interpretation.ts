import { ASPECT_CONTENT } from "@/features/astrology/interpretations/content/aspects";
import { ZODIAC_SIGN_CONTENT } from "@/features/astrology/interpretations/content/zodiac-signs";
import type {
	DailySkyAspect,
	DailySkyInterpretation,
	DailySkyPlanet,
	MoonPhase,
} from "@/features/daily-sky/types/daily-sky";

function atmosphereFromSigns(
	sun: DailySkyPlanet,
	moon: DailySkyPlanet,
	moonPhase: MoonPhase,
): [string, string] {
	const sunContent = ZODIAC_SIGN_CONTENT[sun.sign];
	const moonContent = ZODIAC_SIGN_CONTENT[moon.sign];

	const first = `Güneş ${sun.signLabel} burcundayken gökyüzü ${sunContent.approach} bir ritim taşır; öne çıkan güç ${sunContent.strength} alanındadır.`;
	const second = `Ay ${moon.signLabel} burcunda ve ${moonPhase.name} fazındayken duygusal iklim ${moonContent.approach} şekillenir; ${moonContent.strength} temaları daha hissedilir olabilir.`;

	return [first, second];
}

function themeFromAspectOrPhase(
	topAspects: DailySkyAspect[],
	moonPhase: MoonPhase,
): { title: string; body: string } {
	const top = topAspects[0];
	if (top) {
		const aspectContent = ASPECT_CONTENT[top.type];
		return {
			title: `${top.planetAName}–${top.planetBName} ${top.typeLabel}`,
			body: `${top.planetAName} ile ${top.planetBName} arasındaki ${top.typeLabel.toLowerCase()} (${top.symbol}) bugünün en sıkı açılarından biri. ${aspectContent.dynamic} ${aspectContent.potential}`,
		};
	}

	const phaseThemes: Record<MoonPhase["key"], { title: string; body: string }> = {
		new_moon: {
			title: "Yeni Ay vurgusu",
			body: "Ay–Güneş kavuşumu civarında gökyüzü sadeleşme ve yeni bir niyet çerçevesi kurma temasına yakın durur; acele etmek yerine yönü netleştirmek daha uyumlu olabilir.",
		},
		waxing_crescent: {
			title: "Büyüyen hilal ritmi",
			body: "Ay ışığı artarken gökyüzü küçük adımlarla ilerleme ve fikirleri somutlaştırma temasına işaret eder; fazla yüklenmeden ilerlemek daha dengeli olabilir.",
		},
		first_quarter: {
			title: "İlk dördün gerilimi",
			body: "Ay–Güneş karesi civarında gökyüzü karar ve yön düzeltmesi isteyen bir tempo taşır; engelleri kişisel başarısızlık gibi değil, ayar noktası gibi okumak daha yapıcıdır.",
		},
		waxing_gibbous: {
			title: "Büyüyen şişkin Ay",
			body: "Dolunaya yaklaşırken gökyüzü ayrıntı, ince ayar ve görünürlük temalarını öne çıkarabilir; işleri bitirmek yerine kaliteyi yükseltmek daha uygun olabilir.",
		},
		full_moon: {
			title: "Dolunay netliği",
			body: "Ay–Güneş karşıtlığı civarında gökyüzü görünürlük, dengeleme ve sonuçları fark etme temasına yakındır; aşırı yorum yerine gözlem daha sağlıklıdır.",
		},
		waning_gibbous: {
			title: "Küçülen şişkin Ay",
			body: "Işık azalırken gökyüzü paylaşma, değerlendirme ve gereksiz yükleri bırakma temasına kayabilir; tamamlamak ile bırakmak arasında seçim yapmak kolaylaşabilir.",
		},
		last_quarter: {
			title: "Son dördün sadeleşmesi",
			body: "Ay–Güneş karesinin küçülen tarafında gökyüzü gözden geçirme ve kapanış ritmine yakın durur; yeni işe koşmak yerine mevcut yükleri sadeleştirmek daha verimli olabilir.",
		},
		waning_crescent: {
			title: "Küçülen hilal dinlenmesi",
			body: "Yeni Aya yaklaşırken gökyüzü dinlenme, içe bakış ve bir sonraki döngüye yer açma temasına işaret eder; tempo düşürmek yetersizlik değil, ritme uymaktır.",
		},
	};

	return phaseThemes[moonPhase.key];
}

function suggestionFromContext(input: {
	moonPhase: MoonPhase;
	retrogradeCount: number;
	topAspect: DailySkyAspect | null;
}): string {
	if (input.topAspect?.type === "square" || input.topAspect?.type === "opposition") {
		return "Planları hızlandırmak yerine öncelikleri sadeleştirmek ve tek bir net adıma odaklanmak daha verimli olabilir.";
	}
	if (input.retrogradeCount >= 3) {
		return "Yeni başlangıçları ertelemek zorunda değilsiniz; ancak gözden geçirme, düzeltme ve yeniden düzenleme için ekstra zaman bırakmak iyi gelebilir.";
	}
	if (
		input.moonPhase.key === "new_moon" ||
		input.moonPhase.key === "waning_crescent"
	) {
		return "Gürültüyü azaltıp bir niyeti yazılı hale getirmek, günün ritmine daha uyumlu bir adım olabilir.";
	}
	if (
		input.moonPhase.key === "full_moon" ||
		input.moonPhase.key === "waxing_gibbous"
	) {
		return "Görünür sonuçları not etmek ve fazla yüklenen işleri ayıklamak, günün enerjisini daha dengeli kullanmanıza yardım edebilir.";
	}
	return "Küçük, tamamlanabilir bir iş seçmek ve iletişimi net tutmak bugünün gökyüzü ritmine daha yakın durabilir.";
}

/**
 * Deterministic, data-driven daily sky copy. Speaks about the sky — not the user.
 */
export function buildDailySkyInterpretation(input: {
	sun: DailySkyPlanet;
	moon: DailySkyPlanet;
	moonPhase: MoonPhase;
	aspects: DailySkyAspect[];
	retrogradeCount: number;
}): DailySkyInterpretation {
	const atmosphere = atmosphereFromSigns(input.sun, input.moon, input.moonPhase);
	const theme = themeFromAspectOrPhase(input.aspects, input.moonPhase);
	const suggestion = suggestionFromContext({
		moonPhase: input.moonPhase,
		retrogradeCount: input.retrogradeCount,
		topAspect: input.aspects[0] ?? null,
	});

	return {
		atmosphere,
		themeTitle: theme.title,
		themeBody: theme.body,
		suggestion,
	};
}
