import type { ArticleDefinition } from "@/features/content/types/article";

export const yukselenBurcNedirArticle: ArticleDefinition = {
	slug: "yukselen-burc-nedir",
	title: "Yükselen Burç Nedir? Doğum Saati Neden Önemlidir?",
	description:
		"Yükselen burcun neyi temsil ettiğini, nasıl hesaplandığını ve doğum saatindeki küçük farkların sonucu neden değiştirebildiğini öğrenin.",
	eyebrow: "Temel rehber",
	cardTitle: "Yükselen burç nedir?",
	cardDescription:
		"Doğum saati ve yerle hesaplanan yükseleni, Güneş burcundan farkıyla birlikte okuyun.",
	publishedAt: "2026-08-04",
	updatedAt: "2026-08-04",
	readingTime: 7,
	icon: "ascendant",
	relatedSlugs: [
		"dogum-haritasi-nedir",
		"astrolojide-evler",
		"ay-burcu-nedir",
		"sinastri-nedir",
	],
	toolCta: {
		title: "Yükselenini hesapla",
		description:
			"Doğum saati ve yer bilgisiyle yükselen burcunu ve birinci evini görün.",
		href: "/dogum-haritasi",
		label: "Yükselenini Hesapla",
	},
	sections: [
		{
			id: "nedir",
			title: "Yükselen burç nedir?",
			paragraphs: [
				"Yükselen burç (Ascendant), doğum anında doğu ufkunda yükselen zodyak derecesinin burcudur. [Doğum haritasında](/rehber/dogum-haritasi-nedir) haritanın başlangıç noktalarından biridir ve çoğu ev sisteminde birinci evin kapısını belirler.",
				"Sembolik olarak yükselen, kişinin dünyaya yaklaşım üslubu, ilk izlenim ve “kapıdan nasıl girildiği” ile ilişkilendirilir. Bu, Güneş burcunun anlattığı yön duygusundan farklı bir katmandır.",
			],
		},
		{
			id: "gunes-farki",
			title: "Güneş burcundan farkı",
			paragraphs: [
				"Güneş burcu çoğu zaman “ben kimim / neye yöneliyorum” sorusuna daha yakındır. Yükselen ise “nasıl görünürüm / nasıl başlarım / çevreye nasıl açılırım” sorularına daha yakındır.",
				"İkisi çelişiyormuş gibi görünebilir; aslında farklı katmanlardır. Örneğin içsel yön bir burçta, dışa yansıyan üslup başka bir burçta olabilir. Bu çelişkiyi “yanlış hesap” sanmak yerine katman farkı olarak okumak daha doğrudur.",
			],
		},
		{
			id: "ilk-izlenim",
			title: "İlk izlenim ve dış dünyaya yaklaşım",
			paragraphs: [
				"Yükselen, sosyal ortamlarda ilk teması, beden dilinin üslubunu ve yeni durumlara giriş biçimini yorumlamak için kullanılır. Bu, kişinin tüm kişiliği demek değildir; daha çok “eşik” davranışıdır.",
				"İlişkilerde de yükselen, karşı tarafın sizi ilk nasıl “okuduğu” ile ilgili sembolik ipuçları verebilir. Daha derin duygusal ihtiyaçlar için [Ay burcu](/rehber/ay-burcu-nedir) ve diğer harita katmanları gerekir.",
			],
		},
		{
			id: "saat",
			title: "Doğum saati neden gerekir?",
			paragraphs: [
				"Yükselen, yerel ufka bağlıdır. Ufuk, Dünya’nın dönüşüyle sürekli hareket ettiği için doğum saati olmadan yükselen güvenilir biçimde hesaplanamaz.",
				"Saat yaklaşık biliniyorsa “olası yükselen aralığı” düşünülebilir; fakat kesin bir yükselen burcu iddiası zayıf kalır. Nüfus kaydı, aile notu veya hastane belgesi gibi kaynaklar mümkün olduğunca karşılaştırılmalıdır.",
			],
			callout: {
				type: "info",
				text: "Saat dilimi dönüşümü de kritiktir. Yaz saati uygulamaları ve yerel saat kayıtları, aynı “görünen saat”in farklı UTC anlarına denk gelmesine yol açabilir.",
			},
		},
		{
			id: "konum",
			title: "Konum neden gerekir?",
			paragraphs: [
				"Aynı anda farklı enlem ve boylamlarda doğu ufku farklı burç derecelerine denk gelir. Bu yüzden yalnızca saat yetmez; doğum şehri veya mümkünse daha yakın yerleşim de gerekir.",
				"Astrozel konum seçiminde GeoNames verisini kullanarak enlem, boylam ve saat dilimini hesaba katar. Yaklaşık bir ülke merkezi seçmek yerine gerçek doğum yerine yakın bir nokta tercih etmek sonucu iyileştirir.",
			],
		},
		{
			id: "degisim-hizi",
			title: "Yükselen ne kadar sürede değişir?",
			paragraphs: [
				"Yükselen burcun değişim hızı sabit bir “her yerde iki saatte bir” kuralına indirgenemez. Enlem, tarih ve burçların yükseliş süreleri farkı etkiler. Bazı dönemlerde yükselen burç daha hızlı, bazılarında daha yavaş değişebilir.",
				"Bu nedenle “saatte birkaç dakika oynamanın hiçbir önemi yoktur” demek de, “her dakika mutlaka burç değiştirir” demek de aşırı genellemedir. Kritik olan, sizin doğum anınızın yükselen cusp’ına ne kadar yakın olduğudur.",
			],
		},
		{
			id: "saat-bilinmiyor",
			title: "Doğum saati bilinmiyorsa ne olur?",
			paragraphs: [
				"Saat yoksa Güneş burcu ve birçok gezegen burcu hâlâ hesaplanabilir; ancak yükselen ve evler güvenilir olmaktan çıkar. Bu durumda haritayı “saat bilinmeyen” bir çerçevede okumak ve yükselen iddiasından kaçınmak daha dürüst bir yaklaşımdır.",
				"Bazı yöntemler doğum saatini sonradan tahmin etmeye çalışır (rektifikasyon). Bu ileri düzey ve tartışmalı bir alandır; kesin sonuç vaat etmez.",
			],
		},
		{
			id: "birinci-ev",
			title: "Yükselen ile birinci ev ilişkisi",
			paragraphs: [
				"Placidus gibi sistemlerde yükselen, birinci evin başlangıcıdır. Birinci ev; benlik ifadesi, beden algısı ve kişisel başlangıçlarla ilişkilendirilir. Yükselen burç, bu evin “kapı burcudur”.",
				"[Evlerin genel anlamları](/rehber/astrolojide-evler) içinde birinci evin yeri daha net görünür. Ev sistemi değişirse bazı ev sınırları kayabilir; yükselen noktası ise doğum anı ve konumla hesaplanan astronomik bir referanstır.",
			],
		},
		{
			id: "yonetici",
			title: "Yükselen yöneticisi nedir?",
			paragraphs: [
				"Yükselen burcun geleneksel yöneticisi olan gezegen, “yükselen yöneticisi” olarak anılır. Örneğin yükselen Terazi ise Venüs, yükselen Koç ise Mars bu rolde düşünülür.",
				"Yöneticinin burcu, evi ve açıları; yükselen temasının nasıl desteklendiğini veya gerildiğini yorumlamak için ek bir katman sunar. Tek başına yönetici gezegeni okumak da eksik kalır; haritanın geri kalanıyla birlikte bakılır.",
			],
		},
		{
			id: "tek-basina",
			title: "Yükselen tek başına kişiliği açıklar mı?",
			paragraphs: [
				"Hayır. Yükselen faydalı bir giriş kapısıdır; kişiliğin tamamı değildir. Güneş, Ay, kişisel gezegenler, açılar ve yaşam deneyimi birlikte düşünülmelidir.",
				"Sosyal medyada yükseleni abartılı etiketlere indirgeyen içerikler sık görülür. Daha dengeli okuma, yükseleni “üslup” olarak tutup diğer katmanlara alan açmaktır.",
			],
		},
		{
			id: "site-farklari",
			title: "Yükselen neden farklı sitelerde değişebilir?",
			paragraphs: [
				"Farklı saat dilimi veritabanları, yaz saati varsayımları, yuvarlama kuralları veya hatalı konum seçimi yükseleni kaydırabilir. Ayrıca sidereal zodyak kullanan sistemler tropikal sonuçlardan bilinçli olarak ayrılır.",
				"Astrozel tropikal zodyak kullanır. Sonuçlar başka bir tropikal siteyle kıyaslanırken önce saat, yer ve saat diliminin aynı girildiğinden emin olun.",
			],
		},
	],
};
