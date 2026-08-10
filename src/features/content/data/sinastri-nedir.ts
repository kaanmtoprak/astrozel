import type { ArticleDefinition } from "@/features/content/types/article";

export const sinastriNedirArticle: ArticleDefinition = {
	slug: "sinastri-nedir",
	title: "Sinastri Nedir? İki Doğum Haritası Nasıl Karşılaştırılır?",
	description:
		"Sinastrinin ne olduğunu, iki kişinin haritasındaki gezegen açılarını ve ilişki dinamiklerini nasıl değerlendirdiğini sade bir dille öğrenin.",
	eyebrow: "İlişki astrolojisi",
	cardTitle: "Sinastri nedir?",
	cardDescription:
		"İki doğum haritasını karşılaştırarak ilişki dinamiklerine sembolik bakış.",
	publishedAt: "2026-08-04",
	updatedAt: "2026-08-04",
	readingTime: 8,
	icon: "synastry",
	relatedSlugs: [
		"dogum-haritasi-nedir",
		"ay-burcu-nedir",
		"astrolojide-acilar",
		"yukselen-burc-nedir",
	],
	toolCta: {
		title: "Çift uyumunu hesapla",
		description:
			"İki kişinin doğum bilgileriyle sinastri bağlantılarını ve sembolik uyum özetini görün.",
		href: "/cift-uyumu",
		label: "Çift Uyumunu Hesapla",
	},
	sections: [
		{
			id: "nedir",
			title: "Sinastri nedir?",
			paragraphs: [
				"Sinastri, iki kişinin [doğum haritasını](/rehber/dogum-haritasi-nedir) üst üste koyarak gezegenler arasındaki açıları inceleyen ilişki astrolojisi yöntemidir. Amaç, ilişkinin “kaderini ilan etmek” değil; olası dinamikleri sembolik dilde görünür kılmaktır.",
				"Bir ilişkiyi yalnızca sinastri ile açıklamak eksik kalır. İletişim alışkanlıkları, sınırlar, yaşam koşulları ve karşılıklı emek haritadan bağımsızdır.",
			],
		},
		{
			id: "nasil",
			title: "İki harita nasıl karşılaştırılır?",
			paragraphs: [
				"Her iki kişi için doğum tarihi, saati ve yeri hesaplanır. Ardından bir kişinin gezegenleri diğerinin gezegenleriyle açısal olarak karşılaştırılır. Örneğin A’nın Venüs’ü ile B’nin Mars’ı arasındaki mesafe incelenir.",
				"Bazı yaklaşımlar ayrıca bir kişinin gezegeninin diğerinin evine düşmesini de yorumlar. Astrozel’de odak, haritalar arası açısal bağlantılar ve bunlardan üretilen sembolik özet üzerinedir.",
			],
		},
		{
			id: "gunes-ay",
			title: "Güneş–Ay bağlantıları",
			paragraphs: [
				"Güneş–Ay açıları sıkça “tanıdıklık / tamamlayıcılık” temalarıyla okunur. Güneş yön ve ifade, Ay duygusal ihtiyaç tarafını temsil ettiği için bu bağlar ilişkide karşılıklı görünürlük hissiyle ilişkilendirilebilir.",
				"Her Güneş–Ay bağı “mükemmel uyum” demek değildir. Açı türü ve tüm harita bağlamı niteliği değiştirir.",
			],
		},
		{
			id: "ay",
			title: "Ay bağlantıları ve duygusal ihtiyaçlar",
			paragraphs: [
				"[Ay burcu](/rehber/ay-burcu-nedir) ve Ay açıları, güvenlik, rahatlık ve duygusal tepki dilini anlatır. Sinastride Ay’a yapılan açılar, “yanında nasıl sakinleşirim / nasıl tetiklenirim” sorularına sembolik kapı açabilir.",
				"Duygusal yoğun bağlar hem yakınlık hem kırılganlık getirebilir. Bu nedenle “güçlü Ay bağı = sorun yok” diye okunmamalıdır.",
			],
		},
		{
			id: "merkur",
			title: "Merkür ve iletişim",
			paragraphs: [
				"Merkür bağlantıları konuşma temposu, şaka dili, tartışma biçimi ve zihinsel uyumla ilişkilendirilir. Uyumlu açılar anlaşılmayı kolaylaştırabilir; gerilimli açılar ise yanlış anlaşılmaya veya zihin yarışına işaret edebilir.",
				"İletişim becerisi öğrenilebilir. Harita bir eğilim gösterir; diyalog pratiğinin yerini tutmaz.",
			],
		},
		{
			id: "venus-mars",
			title: "Venüs–Mars ve çekim",
			paragraphs: [
				"Venüs beğeni, değer ve yumuşak çekim; Mars istek, tempo ve hareketle ilişkilendirilir. Venüs–Mars bağları flört, arzı ve “karşılıklı kıvılcım” temalarında sık anılır.",
				"Çekim, ilişkinin sürdürülebilirliği demek değildir. Uzun vadeli yapı için Satürn ve genel harita dengesi de konuşulur.",
			],
		},
		{
			id: "saturn",
			title: "Satürn ve uzun vadeli yapı",
			paragraphs: [
				"Satürn bağları sorumluluk, sınır, zaman ve ciddiyet temalarını taşır. Bazen “ağır” hissedilebilir; bazen de ilişkiyi olgunlaştıran bir iskele gibi okunur.",
				"Satürn’ü yalnızca engel sanmak eksik kalır. Netlik, taahhüt ve gerçekçilik de Satürn alanına yakındır.",
			],
		},
		{
			id: "yukselen",
			title: "Yükselen bağlantıları",
			paragraphs: [
				"[Yükselen](/rehber/yukselen-burc-nedir) kişinin yaklaşım üslubunu anlattığı için, birinin gezegeninin diğerinin yükselene açı yapması “ilk izlenim ve ilişki kapısı” temalarını etkileyebilir.",
				"Yükselen hesabı doğum saatine bağlıdır. Saatlerden biri belirsizse yükselen bağlantıları zayıflatılmalı veya atlanmalıdır.",
			],
		},
		{
			id: "uyumlu-zorlayici",
			title: "Uyumlu ve zorlayıcı açılar",
			paragraphs: [
				"Üçgen ve sekstil gibi açılar çoğu zaman akış ve destekle; kare ve karşıtlık ise sürtünme ve farkındalıkla ilişkilendirilir. Kavuşum, gezegen çiftine göre hem yoğun kaynaşma hem baskınlaşma gibi okunabilir.",
				"[Açı türlerinin özeti](/rehber/astrolojide-acilar) için ayrı rehbere bakabilirsiniz. Önemli olan etiketi ezberlemek değil, hangi ihtiyaçların çatıştığını veya beslendiğini görmektir.",
			],
		},
		{
			id: "zor-aci",
			title: "Zorlayıcı açı neden otomatik olarak kötü değildir?",
			paragraphs: [
				"Gerilim, ilişkide büyüme, dürüstlük veya ortak hedef için yakıt olabilir. Sorun, gerilimin konuşulmadan birikmesi veya tek taraflı yük haline gelmesidir.",
				"Sinastride “zor açı = ayrılın” yaklaşımı hem abartılı hem yararsızdır. Bağlam, bilinç ve karşılıklı özen sonucu değiştirir.",
			],
			callout: {
				type: "warning",
				text: "Sinastri, ilişkinin geleceğini garanti etmez; “ruh eşi” veya “kesin evlilik” dili kullanmaz. Sembolik bir değerlendirme çerçevesidir.",
			},
		},
		{
			id: "skor",
			title: "Çok yüksek uyum skoru ne ifade eder?",
			paragraphs: [
				"Astrozel’deki skor, destekleyici ve zorlayıcı göstergelerin ağırlıklı, sembolik bir özetidir. Yüksek skor “sorunsuz ilişki” anlamına gelmez; düşük skor da “imkânsız ilişki” demek değildir.",
				"Skoru bir sohbet başlatıcı gibi kullanın: hangi temalar akıcı, hangi temalar dikkat istiyor?",
			],
		},
		{
			id: "gelecek",
			title: "Sinastri ilişkinin geleceğini tahmin eder mi?",
			paragraphs: [
				"Hayır. Sinastri olası dinamikleri anlatır; zaman çizelgesi veya kesin sonuç vermez. İlişkilerin gidişatı seçimler, iletişim ve yaşam koşullarıyla şekillenir.",
			],
		},
		{
			id: "saat-gerekli",
			title: "Doğum saati neden gerekir?",
			paragraphs: [
				"Yükselen ve ev bağlantıları saat olmadan güvenilir değildir. Saat yoksa bazı gezegen burç açıları hâlâ incelenebilir; fakat haritanın kişiye özel katmanları eksik kalır.",
				"Astrozel çift uyumunda her iki kişi için doğum saati ister; çünkü yükselen ve ev duyarlı bağlantılar hesaplamaya dahildir.",
			],
		},
		{
			id: "astrozel-skor",
			title: "Astrozel’deki sembolik skor nasıl anlaşılmalı?",
			paragraphs: [
				"Skor, başarı ihtimali veya gelecek tahmini değildir. Destekleyici ve zorlayıcı astrolojik göstergelerin ağırlıklı bir özetidir.",
				"Raporu okurken tek sayıya değil, kategori özetlerine, güçlü ve zorlayıcı temalara bakmak daha faydalıdır. Kararları skora bırakmak yerine, gördüğünüz temaları gerçek hayattaki iletişiminizle birlikte değerlendirin.",
			],
		},
	],
};
