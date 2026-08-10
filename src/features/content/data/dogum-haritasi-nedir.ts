import type { ArticleDefinition } from "@/features/content/types/article";

export const dogumHaritasiNedirArticle: ArticleDefinition = {
	slug: "dogum-haritasi-nedir",
	title: "Doğum Haritası Nedir? Nasıl Hesaplanır ve Ne Anlatır?",
	description:
		"Doğum haritasının ne olduğunu, gezegenleri, burçları, evleri ve açıları nasıl bir araya getirdiğini sade bir dille öğrenin.",
	eyebrow: "Temel rehber",
	cardTitle: "Doğum haritası nedir?",
	cardDescription:
		"Gezegenler, burçlar, evler ve açıların bir araya geldiği doğum anı haritasını anlayın.",
	publishedAt: "2026-08-04",
	updatedAt: "2026-08-04",
	readingTime: 8,
	icon: "chart",
	relatedSlugs: [
		"yukselen-burc-nedir",
		"astrolojide-evler",
		"astrolojide-acilar",
		"ay-burcu-nedir",
	],
	toolCta: {
		title: "Kendi haritanı keşfet",
		description:
			"Doğum tarihi, saati ve yerini girerek yükselenini, evlerini ve gezegen konumlarını hesapla.",
		href: "/dogum-haritasi",
		label: "Doğum Haritanı Hesapla",
	},
	sections: [
		{
			id: "nedir",
			title: "Doğum haritası nedir?",
			paragraphs: [
				"Doğum haritası, doğduğunuz anda gökyüzündeki gezegenlerin Dünya’dan bakıldığında hangi burçlarda ve hangi evlerde durduğunu gösteren sembolik bir diyagramdır. Astrolojide bu harita, kişilik eğilimlerini, duygusal ihtiyaçları ve yaşam alanlarını yorumlamak için bir çerçeve olarak kullanılır.",
				"Harita bir “gelecek raporu” değildir. Daha çok, doğum anına ait gökyüzü düzeninin sembolik bir özeti gibidir. Aynı haritaya bakıldığında farklı astrologlar farklı vurgular seçebilir; bu da yorumun tek bir kesin sonuca indirgenemeyeceğini gösterir.",
			],
		},
		{
			id: "gerekli-bilgiler",
			title: "Hangi bilgiler gerekir?",
			paragraphs: [
				"Doğum haritası hesaplamak için üç temel bilgiye ihtiyaç vardır: doğum tarihi, doğum saati ve doğum yeri. Bu üçlü birlikte, gezegenlerin o andaki konumunu ve yerel gökyüzü yönelimini belirler.",
			],
			bullets: [
				"Doğum tarihi: Güneş’in ve diğer yavaş gezegenlerin burç yerleşimini büyük ölçüde belirler.",
				"Doğum saati: Özellikle yükselen burç ve ev sistemini etkiler.",
				"Doğum yeri: Aynı saatte farklı şehirlerde gökyüzü yönelimini değiştirir.",
			],
			callout: {
				type: "tip",
				text: "Saat ve yer bilgisi ne kadar net olursa, yükselen ve ev hesapları o kadar güvenilir olur. Saat bilinmiyorsa haritanın bazı katmanları sınırlı kalır.",
			},
		},
		{
			id: "tarih",
			title: "Tarih neden önemlidir?",
			paragraphs: [
				"Doğum tarihi, Güneş’in burç konumunu ve Ay’ın yaklaşık yerini belirleyen ana çerçeveyi kurar. Ayrıca Merkür, Venüs, Mars gibi gezegenlerin o gün hangi burçlarda gezindiğini de tarihe bağlar.",
				"Yalnızca tarihle bakıldığında bile Güneş burcu ve bazı gezegen yerleşimleri görülebilir. Ancak yükselen burç ve evler için tarih tek başına yeterli değildir.",
			],
		},
		{
			id: "saat",
			title: "Saat neden önemlidir?",
			paragraphs: [
				"Doğum saati, yerel ufuk çizgisini ve dolayısıyla yükselen burcu belirler. Yükselen burç, haritanın “kapısı” gibi düşünülebilir; evlerin sırası da büyük ölçüde bu kapıya göre yerleşir.",
				"Saatteki küçük farklar, özellikle yükselen burcun değiştiği dönemlerde sonucu belirgin biçimde değiştirebilir. Bu yüzden nüfus cüzdanı veya aile kaydındaki saati mümkün olduğunca doğrulamak faydalıdır.",
			],
		},
		{
			id: "yer",
			title: "Yer neden önemlidir?",
			paragraphs: [
				"Doğum yeri, aynı evrensel zamanda farklı coğrafyalarda gökyüzünün hangi yönünün “doğu ufku” sayılacağını değiştirir. İstanbul’da doğan biri ile aynı saatte Ankara’da doğan birinin yükseleni bazen aynı, bazen farklı olabilir.",
				"Astrozel’de konum aramasından seçilen yerleşim, enlem–boylam ve saat dilimi bilgisini hesaplamaya taşır. Bu da yerel saatin astronomik zamana doğru çevrilmesine yardımcı olur.",
			],
		},
		{
			id: "gezegenler",
			title: "Gezegenler neyi temsil eder?",
			paragraphs: [
				"Astrolojide gezegenler, farklı yaşam işlevlerini ve psikolojik eğilimleri sembolize eder. Örneğin Güneş kimlik ve yön duygusuyla, Ay duygusal ihtiyaçlarla, Merkür iletişimle ilişkilendirilir.",
				"Bu eşleşmeler kültür ve okul farklarına göre nüans kazanabilir. Önemli olan, gezegenleri “zorunlu kader işaretleri” gibi değil, yorumlanabilir semboller gibi okumaktır.",
			],
		},
		{
			id: "burclar",
			title: "Burçlar neyi anlatır?",
			paragraphs: [
				"Burçlar, gökyüzünün tropikal zodyakta on iki dilime ayrılmış nitelikleridir. Bir gezegenin burcu, o gezegenin sembolik “tonunu” anlatır: nasıl ifade edildiği, hangi üsluba büründüğü.",
				"Güneş burcu en bilinen katmandır; fakat harita yalnızca Güneş’ten ibaret değildir. Ay burcu, yükselen ve diğer gezegenler birlikte okunduğunda daha dengeli bir tablo çıkar. Daha fazla ayrıntı için [Ay burcunun anlamı](/rehber/ay-burcu-nedir) rehberine bakabilirsiniz.",
			],
		},
		{
			id: "evler",
			title: "Evler neyi gösterir?",
			paragraphs: [
				"Evler, yaşamın alanlarını temsil eden on iki bölümdür: benlik ve görünüm, gelir ve değerler, iletişim, ev-aile, yaratıcılık, günlük düzen, ilişkiler ve benzeri konular. Bir gezegen bir eve düştüğünde, o gezegenin teması o yaşam alanıyla ilişkilendirilir.",
				"[Astrolojide 12 evin anlamları](/rehber/astrolojide-evler) rehberi, her evi tek tek özetler. Ev sistemi seçimi (örneğin Placidus) ev sınırlarını değiştirebildiği için farklı sitelerde ev numaraları bazen farklı görünebilir.",
			],
		},
		{
			id: "acilar",
			title: "Açılar neyi ifade eder?",
			paragraphs: [
				"Açılar, iki gezegen arasındaki gökyüzü mesafesinin sembolik ilişkisidir. Kavuşum, kare, üçgen, karşıtlık gibi açılar; gezegen temalarının nasıl “konuştuğunu” anlatmak için kullanılır.",
				"Zorlayıcı görünen açılar otomatik olarak olumsuz sonuç demek değildir; çoğu zaman gerilim, motivasyon veya büyüme alanı olarak da okunur. Açı türlerini tablolu özet için [astrolojide açılar](/rehber/astrolojide-acilar) yazısına bakın.",
			],
		},
		{
			id: "buyuk-uclu",
			title: "Güneş, Ay ve Yükselen neden öne çıkar?",
			paragraphs: [
				"Birçok modern yaklaşımda Güneş, Ay ve Yükselen “büyük üçlü” olarak anılır. Güneş yön ve kimlik, Ay duygusal ihtiyaç, Yükselen ise dışa yansıyan üslup ve yaklaşımla ilişkilendirilir.",
				"Bu üçlü faydalı bir başlangıçtır; fakat haritanın tamamını temsil etmez. Evler, diğer gezegenler ve açılar olmadan okuma eksik kalır. Yükselenin saat ve yere nasıl bağlı olduğunu [yükselen burç rehberinde](/rehber/yukselen-burc-nedir) bulabilirsiniz.",
			],
		},
		{
			id: "kader-mi",
			title: "Doğum haritası kesin kader midir?",
			paragraphs: [
				"Hayır. Astrolojik harita, sembolik bir dil sunar; kişilik testinin veya gelecek kehanetinin yerine geçmez. İnsanlar seçimleri, koşulları ve deneyimleriyle haritadaki temaları farklı biçimlerde yaşar.",
				"Bu yüzden Astrozel’de harita sonuçları bilgilendirme ve keşif amaçlıdır. Sağlık, hukuk, finans veya ilişki kararlarını yalnızca haritaya dayandırmak doğru bir yaklaşım değildir.",
			],
			callout: {
				type: "warning",
				text: "Haritayı “kesin kader” veya “garanti sonuç” gibi okuyan yorumlardan uzak durun. Sembolik çerçeve ile kişisel sorumluluk birbirinin yerine geçmez.",
			},
		},
		{
			id: "farkliliklar",
			title: "Farklı sitelerde sonuç neden değişebilir?",
			paragraphs: [
				"Siteler farklı zodyak sistemleri (tropikal / sidereal), farklı ev sistemleri (Placidus, Whole Sign vb.), farklı orblar ve farklı yuvarlama kuralları kullanabilir. Ayrıca hatalı saat dilimi veya yaklaşık konum da fark yaratır.",
				"Sonuçlar birebir örtüşmediğinde bu genellikle “birinin doğru diğerinin yanlış” olduğu anlamına gelmez; kullanılan varsayımların farklılaştığını gösterir.",
			],
		},
		{
			id: "astrozel-sistem",
			title: "Astrozel hangi sistemi kullanıyor?",
			paragraphs: [
				"Astrozel tropikal zodyak ve Placidus ev sistemiyle hesaplama yapar. Tropikal zodyak, mevsimsel noktalara (ekinoks/gündönümü) dayanır. Placidus ise yaygın kullanılan bir zaman-uzay tabanlı ev sistemidir.",
				"Hesaplama sunucu tarafında yapılır; girdiğiniz doğum bilgileri bu varsayımlarla gezegen, ev ve temel açı çıktısına dönüştürülür.",
			],
			bullets: [
				"Zodyak: Tropikal",
				"Ev sistemi: Placidus",
				"Amaç: Sembolik bilgilendirme, kesin kehanet değil",
			],
		},
		{
			id: "nasil-okunur",
			title: "Harita nasıl okunmaya başlanır?",
			paragraphs: [
				"İlk adım olarak Güneş, Ay ve Yükselen’e bakmak işleri sadeleştirir. Ardından bu üçlünün hangi evlerde durduğuna ve aralarındaki açılara geçebilirsiniz.",
				"İkinci adımda Venüs, Mars ve Merkür gibi kişisel gezegenleri; üçüncü adımda ise Satürn ve dış gezegenlerin daha geniş temalarını inceleyebilirsiniz. Her katmanı tek cümlelik “etikete” indirgemek yerine, “hangi ihtiyaç / hangi üslup / hangi alan” sorularını sormak daha sağlıklıdır.",
				"Kendi doğum bilgilerinizle pratik yapmak isterseniz Astrozel’de haritanızı hesaplayıp gezegen ve ev özetlerini adım adım inceleyebilirsiniz.",
			],
		},
	],
};
