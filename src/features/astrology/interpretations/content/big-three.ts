import type { ZodiacSign } from "@/features/astrology/types/astrology";

export type BigThreeKind = "sun" | "moon" | "ascendant";

export interface BigThreeContent {
	kind: BigThreeKind;
	sign: ZodiacSign;
	title: string;
	summary: string;
	potential: string;
	balance: string;
}

const SUN: Record<ZodiacSign, Omit<BigThreeContent, "kind" | "sign">> = {
	aries: {
		title: "Güneş Koç",
		summary:
			"Güneşinin Koç’ta olması, yaşamda cesaretle öne çıkma ve kendi yolunu açma ihtiyacını güçlendirebilir. Yeni başlangıçlara doğal bir heves duyabilirsin. Astrolojik yorumda bu yerleşim, iradeni doğrudan ve canlı biçimde ortaya koyma eğilimini anlatır.",
		potential: "Hızlı karar alma ve öncü olma cesareti güçlü bir kaynak olabilir.",
		balance: "Acelecilik bazen sabır ve dinleme alanını daraltabilir.",
	},
	taurus: {
		title: "Güneş Boğa",
		summary:
			"Güneşinin Boğa’da olması, yaşamda güvenilir ve sürdürülebilir bir temel kurma ihtiyacını öne çıkarabilir. Kararlarını acele vermek yerine şartları değerlendirerek ilerlemeyi tercih edebilirsin. Sabır güçlü yanlarından biri olabilir; ancak alıştığın düzeni değiştirmek gerektiğinde esneklik göstermek zorlaşabilir.",
		potential: "Kalıcı değerler ve istikrarlı bir yön duygusu inşa edebilirsin.",
		balance: "Değişim gerektiğinde esnekliği bilinçli olarak güçlendirmek faydalı olabilir.",
	},
	gemini: {
		title: "Güneş İkizler",
		summary:
			"Güneşinin İkizler’de olması, kimliğini merak, öğrenme ve iletişim üzerinden kurmana işaret edebilir. Farklı konular arasında bağ kurmak seni canlı tutabilir. Astrolojik yorumda bu yerleşim, çok yönlü bir zihin ve paylaşmaya açık bir benlik ifadesini vurgular.",
		potential: "Öğrenme hızı ve fikirleri aktarma becerisi güçlü bir alan olabilir.",
		balance: "Odak dağıldığında derinleşmek için bilerek yavaşlamak gerekebilir.",
	},
	cancer: {
		title: "Güneş Yengeç",
		summary:
			"Güneşinin Yengeç’te olması, kendini koruyucu bağlar ve duygusal güvenlik üzerinden tanımlamana işaret edebilir. Yakın ilişkilerde bulunmak kimliğini besleyebilir. Haritanın bu bölümü, aidiyet ve şefkat ihtiyacına dikkat çeker.",
		potential: "Empati ve güvenli alan yaratma becerisi öne çıkabilir.",
		balance: "Aşırı korunmacılık bazen yeni deneyimlere mesafeyi artırabilir.",
	},
	leo: {
		title: "Güneş Aslan",
		summary:
			"Güneşinin Aslan’da olması, kendini yaratıcı ve görünür biçimde ortaya koyma arzusunu güçlendirebilir. Takdir görmek seni motive edebilir; ancak asıl güç, kendi ışığını içsel bir güvenle taşımanda bulunabilir. Astrolojik yorumda bu yerleşim, cömert bir kimlik ifadesini anlatır.",
		potential: "Yaratıcı liderlik ve sıcak bir varlık alanı geliştirebilirsin.",
		balance: "Onay arayışı bazen özgüveni dışarıya fazla bağımlı kılabilir.",
	},
	virgo: {
		title: "Güneş Başak",
		summary:
			"Güneşinin Başak’ta olması, kimliğini düzen, fayda ve ayrıntılara dikkat üzerinden kurmana işaret edebilir. İşleri iyileştirmek ve somut katkı sunmak seni tanımlayabilir. Bu yerleşim, pratik bir öz farkındalık eğilimini güçlendirebilir.",
		potential: "Analitik netlik ve hizmet bilinci güçlü kaynaklar olabilir.",
		balance: "Kendine karşı fazla eleştirel olmak motivasyonu azaltabilir.",
	},
	libra: {
		title: "Güneş Terazi",
		summary:
			"Güneşinin Terazi’de olması, kimliğini ilişki, denge ve adalet arayışı üzerinden biçimlendirebileceğini anlatır. Uyumlu ortamlar seni besler. Astrolojik yorumda bu yerleşim, karşılıklılığı önemseyen bir benlik ifadesini vurgular.",
		potential: "Diplomasi ve estetik duyarlılık güçlü yanların olabilir.",
		balance: "Herkesi memnun etme çabası kendi tercihlerini gölgeleyebilir.",
	},
	scorpio: {
		title: "Güneş Akrep",
		summary:
			"Güneşinin Akrep’te olması, kimliğini derinlik, yoğunluk ve dönüşüm üzerinden tanımlamana işaret edebilir. Yüzeysel ilişkilerden ziyade gerçek bağları tercih edebilirsin. Haritanın bu bölümü, içsel güce ve dürüstlüğe dikkat çeker.",
		potential: "Odaklanma ve duygusal cesaret güçlü bir alan oluşturabilir.",
		balance: "Kontrol ihtiyacı bazen esnekliği zorlaştırabilir.",
	},
	sagittarius: {
		title: "Güneş Yay",
		summary:
			"Güneşinin Yay’da olması, kendini anlam arayışı, keşif ve geniş bir bakış açısıyla ifade etme eğilimini güçlendirebilir. Öğrenmek ve ufku açmak kimliğini besleyebilir. Astrolojik yorumda bu yerleşim, umutlu ve dürüst bir benlik yönünü anlatır.",
		potential: "İlham veren bir vizyon ve keşif hevesi öne çıkabilir.",
		balance: "Aşırı genelleme bazen ayrıntıdaki gerçekliği kaçırabilir.",
	},
	capricorn: {
		title: "Güneş Oğlak",
		summary:
			"Güneşinin Oğlak’ta olması, kimliğini sorumluluk, hedef ve uzun vadeli yapı üzerinden kurmana işaret edebilir. Başarıyı sabırla inşa etmek seni tanımlayabilir. Bu yerleşim, olgun ve gerçekçi bir irade ifadesini vurgular.",
		potential: "Disiplin ve stratejik sabır güçlü kaynaklar olabilir.",
		balance: "Aşırı ciddiyet zaman zaman keyif ve esnekliği kısıtlayabilir.",
	},
	aquarius: {
		title: "Güneş Kova",
		summary:
			"Güneşinin Kova’da olması, kendini özgün düşünce ve toplumsal bir bakışla tanımlama eğilimini güçlendirebilir. Kalıplardan bağımsız durmak kimliğin için önemli olabilir. Astrolojik yorumda bu yerleşim, yenilikçi bir benlik ifadesini anlatır.",
		potential: "Bağımsız perspektif ve ileri görüşlülük öne çıkabilir.",
		balance: "Mesafe koyma bazen duygusal yakınlığı zorlaştırabilir.",
	},
	pisces: {
		title: "Güneş Balık",
		summary:
			"Güneşinin Balık’ta olması, kimliğini sezgi, hayal gücü ve duygusal akış üzerinden kurmana işaret edebilir. Sınırlar yumuşak hissedilebilir; bu da yaratıcılığı besleyebilir. Haritanın bu bölümü, şefkatli bir benlik yönüne dikkat çeker.",
		potential: "Empati ve yaratıcı duyarlılık güçlü alanlar olabilir.",
		balance: "Sınır belirsizliği bazen netlik ihtiyacını artırabilir.",
	},
};

const MOON: Record<ZodiacSign, Omit<BigThreeContent, "kind" | "sign">> = {
	aries: {
		title: "Ay Koç",
		summary:
			"Ay’ının Koç’ta olması, duygularını hızlı ve doğrudan yaşama eğilimini gösterebilir. İçsel güvenlik bazen harekete geçmekle gelir. Astrolojik yorumda bu yerleşim, duygusal dürüstlük ve ani tepkilere açıklık anlatır.",
		potential: "Cesurca hissetmek ve duygusal inisiyatif almak kolaylaşabilir.",
		balance: "Ani tepkiler bazen sakinleşme alanını daraltabilir.",
	},
	taurus: {
		title: "Ay Boğa",
		summary:
			"Ay’ının Boğa’da olması, duygusal güvenlik için istikrar, duyusal konfor ve güvenilir ritimler arayabileceğini anlatır. Alışkanlıklar seni yatıştırabilir. Bu yerleşim, sakin ve somut bir iç dünya ihtiyacını güçlendirebilir.",
		potential: "Sabırlı duygusal dayanıklılık güçlü bir kaynak olabilir.",
		balance: "Değişime direnç bazen duygusal esnekliği zorlaştırabilir.",
	},
	gemini: {
		title: "Ay İkizler",
		summary:
			"Ay’ının İkizler’de olması, duygularını konuşarak, yazarak veya düşünerek işlemeye yatkın olabileceğini gösterir. Zihinsel hareketlilik iç dünyanı rahatlatabilir. Astrolojik yorumda bu yerleşim, duygusal merak ve paylaşımı vurgular.",
		potential: "Duyguları sözle ifade etmek kolaylaşabilir.",
		balance: "Hisleri fazlaca zihinselleştirmek derinleşmeyi erteleyebilir.",
	},
	cancer: {
		title: "Ay Yengeç",
		summary:
			"Ay’ının Yengeç’te olması, duygusal ihtiyaçların güçlü ve belirgin olabileceğini anlatır. Aidiyet, yuva ve yakınlık iç güvenliğini besleyebilir. Haritanın bu bölümü, koruyucu bir duygusal dünyaya dikkat çeker.",
		potential: "Derin empati ve bağ kurma kapasitesi öne çıkabilir.",
		balance: "Duygusal dalgalanma bazen mesafe ihtiyacını da getirebilir.",
	},
	leo: {
		title: "Ay Aslan",
		summary:
			"Ay’ının Aslan’da olması, duygusal olarak takdir edilmeye, sıcaklığa ve yaratıcı ifadeye ihtiyaç duyabileceğini gösterir. İç dünyan görünür bir cömertlikle açılabilir. Astrolojik yorumda bu yerleşim, duygusal gurur ve samimiyeti anlatır.",
		potential: "Duyguları cömertçe ve yaratıcı biçimde paylaşmak güçlenebilir.",
		balance: "Görülmeme hissi bazen iç güvensizliği büyütebilir.",
	},
	virgo: {
		title: "Ay Başak",
		summary:
			"Ay’ının Başak’ta olması, duygusal güvenliği düzen, faydalılık ve küçük pratik adımlarla kurabileceğini anlatır. Yardım etmek veya işleri yoluna koymak seni sakinleştirebilir. Bu yerleşim, duyguları dikkatle süzme eğilimini güçlendirebilir.",
		potential: "Pratik şefkat ve dikkatli bakım becerisi öne çıkabilir.",
		balance: "Kendini fazla eleştirmek duygusal rahatlamayı geciktirebilir.",
	},
	libra: {
		title: "Ay Terazi",
		summary:
			"Ay’ının Terazi’de olması, duygusal denge için uyum, güzellik ve adil ilişkiler arayabileceğini gösterir. Çatışmadan uzak durmak seni rahatlatabilir. Astrolojik yorumda bu yerleşim, duygusal zarafet ve karşılıklılığı vurgular.",
		potential: "Barışçıl bağlar kurmak duygusal dünyanı besleyebilir.",
		balance: "Kendi ihtiyaçlarını ertelemek uzun vadede gerilim yaratabilir.",
	},
	scorpio: {
		title: "Ay Akrep",
		summary:
			"Ay’ının Akrep’te olması, duygularını yoğun, derin ve seçici biçimde yaşama eğilimini gösterebilir. Güven inşa etmek zaman alabilir; bir kez kurulduğunda bağ güçlü olabilir. Haritanın bu bölümü, duygusal dönüşüme dikkat çeker.",
		potential: "Duygusal derinlik ve sadakat güçlü bir alan oluşturabilir.",
		balance: "Şüphe veya kontrol ihtiyacı yakınlığı zorlaştırabilir.",
	},
	sagittarius: {
		title: "Ay Yay",
		summary:
			"Ay’ının Yay’da olması, duygusal olarak özgürlük, umut ve anlam arayışıyla beslenebileceğini anlatır. Dar alanlar iç dünyanı sıkabilir. Astrolojik yorumda bu yerleşim, duygusal keşif ve dürüst ifadeyi güçlendirebilir.",
		potential: "İyimserlik ve duygusal açıklık öne çıkabilir.",
		balance: "Kaçınma eğilimi bazen duygusal yüzleşmeyi erteleyebilir.",
	},
	capricorn: {
		title: "Ay Oğlak",
		summary:
			"Ay’ının Oğlak’ta olması, duyguları kontrollü ve sorumlu biçimde yönetmeye yatkın olabileceğini gösterir. İç güvenlik bazen başarı ve yapı ile ilişkilenebilir. Bu yerleşim, duygusal olgunluk eğilimini vurgular.",
		potential: "Zor zamanlarda duygusal dayanıklılık güçlenebilir.",
		balance: "Hisleri fazla bastırmak yakınlığı azaltabilir.",
	},
	aquarius: {
		title: "Ay Kova",
		summary:
			"Ay’ının Kova’da olması, duygusal ihtiyaçlarını özgünlük, dostluk ve zihinsel bağ üzerinden karşılayabileceğini anlatır. Aşırı yoğun duygusal ortamlar seni yorabilir. Astrolojik yorumda bu yerleşim, duygusal bağımsızlık ihtiyacını vurgular.",
		potential: "Objektif bakış ve dostane bağlar iç dünyanı destekleyebilir.",
		balance: "Mesafe bazen duygusal ihtiyaçların görülmesini geciktirebilir.",
	},
	pisces: {
		title: "Ay Balık",
		summary:
			"Ay’ının Balık’ta olması, duygularını sezgisel, akışkan ve empatik biçimde yaşama eğilimini gösterebilir. Sınırlar yumuşak olabilir; bu da hem şefkati hem de yorulmayı beraberinde getirebilir. Haritanın bu bölümü, duygusal duyarlılığa dikkat çeker.",
		potential: "Derin empati ve hayal gücü duygusal dünyanı zenginleştirebilir.",
		balance: "Sınır koymak bazen ekstra bilinçli çaba gerektirebilir.",
	},
};

const ASC: Record<ZodiacSign, Omit<BigThreeContent, "kind" | "sign">> = {
	aries: {
		title: "Yükselen Koç",
		summary:
			"Yükseleninin Koç olması, dışarıdan enerjik, doğrudan ve girişken bir izlenim bırakabileceğini anlatır. İlk temasta hızlı tepki vermen doğal görünebilir. Astrolojik yorumda bu yerleşim, hayata cesur bir yaklaşımı vurgular.",
		potential: "Öncü duruş ve net ilk izlenim güçlü olabilir.",
		balance: "Sabırsız görünmek bazen yumuşak geçişleri zorlaştırabilir.",
	},
	taurus: {
		title: "Yükselen Boğa",
		summary:
			"Yükseleninin Boğa olması, dışarıdan sakin, güvenilir ve ölçülü bir yaklaşım sergileyebileceğini gösterir. İlk izlenimde istikrar arayışın hissedilebilir. Bu yerleşim, hayata sabırlı bir giriş biçimini güçlendirebilir.",
		potential: "Güven veren bir varlık alanı oluşturabilirsin.",
		balance: "Değişime yavaş uyum bazen fırsatları erteleyebilir.",
	},
	gemini: {
		title: "Yükselen İkizler",
		summary:
			"Yükseleninin İkizler olması, dışarıdan meraklı, konuşkan ve çevik bir izlenim bırakabileceğini anlatır. İlk temasta bilgi alışverişi seni rahatlatabilir. Astrolojik yorumda bu yerleşim, esnek bir sosyal yaklaşımı vurgular.",
		potential: "İletişimde hızlı bağ kurmak kolaylaşabilir.",
		balance: "Dağınık görünmek bazen ciddiyet algısını zayıflatabilir.",
	},
	cancer: {
		title: "Yükselen Yengeç",
		summary:
			"Yükseleninin Yengeç olması, dışarıdan koruyucu, duyarlı ve yakınlık arayan bir yaklaşım gösterebileceğini anlatır. İlk izlenimde sıcaklık veya mesafeli ihtiyat bir arada bulunabilir. Haritanın bu bölümü, duygusal bir dış yüzeye dikkat çeker.",
		potential: "Güven veren ve şefkatli bir ilk izlenim oluşabilir.",
		balance: "Aşırı korunmacılık yeni insanlara açılmayı zorlaştırabilir.",
	},
	leo: {
		title: "Yükselen Aslan",
		summary:
			"Yükseleninin Aslan olması, dışarıdan sıcak, dikkat çeken ve özgüvenli bir izlenim bırakabileceğini gösterir. İlk temasta varlık alanın hissedilebilir. Astrolojik yorumda bu yerleşim, cömert bir dış yaklaşımı anlatır.",
		potential: "Karizmatik ve ilham verici bir ilk etki oluşabilir.",
		balance: "Görünürlük baskısı bazen doğal rahatlığı azaltabilir.",
	},
	virgo: {
		title: "Yükselen Başak",
		summary:
			"Yükseleninin Başak olması, dışarıdan dikkatli, düzenli ve yardımcı bir izlenim bırakabileceğini anlatır. İlk temasta ayrıntılara özen göstermen fark edilebilir. Bu yerleşim, pratik ve sakin bir dış yaklaşımı güçlendirebilir.",
		potential: "Güvenilir ve özenli bir ilk izlenim oluşturabilirsin.",
		balance: "Fazla eleştirel görünmek sıcaklığı azaltabilir.",
	},
	libra: {
		title: "Yükselen Terazi",
		summary:
			"Yükseleninin Terazi olması, dışarıdan zarif, dengeli ve uyumlu bir yaklaşım sergileyebileceğini gösterir. İlk izlenimde ilişki kurma becerisi öne çıkabilir. Astrolojik yorumda bu yerleşim, diplomatik bir dış yüzeyi vurgular.",
		potential: "Sosyal zarafet ve adil duruş güçlü olabilir.",
		balance: "Kararsız görünmek netlik ihtiyacını artırabilir.",
	},
	scorpio: {
		title: "Yükselen Akrep",
		summary:
			"Yükseleninin Akrep olması, dışarıdan yoğun, dikkatli ve derin bir izlenim bırakabileceğini anlatır. İlk temasta her şeyi hemen paylaşmayabilirsin. Haritanın bu bölümü, seçici ve güçlü bir dış yaklaşıma dikkat çeker.",
		potential: "Ciddiyet ve manyetik bir odak alanı oluşabilir.",
		balance: "Aşırı mesafeli görünmek yakınlaşmayı geciktirebilir.",
	},
	sagittarius: {
		title: "Yükselen Yay",
		summary:
			"Yükseleninin Yay olması, dışarıdan açık, iyimser ve keşfe hazır bir izlenim bırakabileceğini gösterir. İlk temasta samimi dürüstlük dikkat çekebilir. Astrolojik yorumda bu yerleşim, geniş ufuklu bir yaklaşımı anlatır.",
		potential: "İlham veren ve samimi bir ilk etki oluşabilir.",
		balance: "Aşırı doğrudanlık bazen inceliği azaltabilir.",
	},
	capricorn: {
		title: "Yükselen Oğlak",
		summary:
			"Yükseleninin Oğlak olması, dışarıdan ciddi, sorumlu ve olgun bir izlenim bırakabileceğini anlatır. İlk temasta güvenilirlik ön planda olabilir. Bu yerleşim, yapılandırılmış bir dış yaklaşımı güçlendirebilir.",
		potential: "Profesyonel ve güven veren bir varlık alanı oluşabilir.",
		balance: "Aşırı mesafeli ciddiyet sıcaklığı gizleyebilir.",
	},
	aquarius: {
		title: "Yükselen Kova",
		summary:
			"Yükseleninin Kova olması, dışarıdan özgün, bağımsız ve biraz sıra dışı bir izlenim bırakabileceğini gösterir. İlk temasta farklı bakış açın hissedilebilir. Astrolojik yorumda bu yerleşim, yenilikçi bir dış yüzeyi vurgular.",
		potential: "Özgün ve düşündürücü bir ilk etki oluşabilir.",
		balance: "Soğuk veya mesafeli görünmek yakınlığı zorlaştırabilir.",
	},
	pisces: {
		title: "Yükselen Balık",
		summary:
			"Yükseleninin Balık olması, dışarıdan yumuşak, sezgisel ve uyumlu bir izlenim bırakabileceğini anlatır. İlk temasta sınırlar akışkan hissedilebilir. Haritanın bu bölümü, empatik bir dış yaklaşıma dikkat çeker.",
		potential: "Şefkatli ve yaratıcı bir ilk izlenim oluşabilir.",
		balance: "Net sınır koymamak bazen yanlış anlaşılmaya yol açabilir.",
	},
};

function buildKind(
	kind: BigThreeKind,
	map: Record<ZodiacSign, Omit<BigThreeContent, "kind" | "sign">>,
): Record<ZodiacSign, BigThreeContent> {
	const result = {} as Record<ZodiacSign, BigThreeContent>;
	for (const sign of Object.keys(map) as ZodiacSign[]) {
		result[sign] = { kind, sign, ...map[sign] };
	}
	return result;
}

export const BIG_THREE_SUN = buildKind("sun", SUN);
export const BIG_THREE_MOON = buildKind("moon", MOON);
export const BIG_THREE_ASCENDANT = buildKind("ascendant", ASC);

export const BIG_THREE_BY_KIND = {
	sun: BIG_THREE_SUN,
	moon: BIG_THREE_MOON,
	ascendant: BIG_THREE_ASCENDANT,
} as const;

export const ALL_BIG_THREE_ENTRIES: BigThreeContent[] = [
	...Object.values(BIG_THREE_SUN),
	...Object.values(BIG_THREE_MOON),
	...Object.values(BIG_THREE_ASCENDANT),
];
