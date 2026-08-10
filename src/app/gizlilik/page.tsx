import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { ContentSection } from "@/components/content/content-section";
import { PrivacyOptionsButton } from "@/components/layout/privacy-options-button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: "Gizlilik",
	description:
		"Astrozel’in form verilerini, GeoNames konum aramasını, Google AdSense reklamlarını ve izin tercihlerini nasıl kullandığına dair açıklama.",
	alternates: { canonical: "/gizlilik" },
};

export default function PrivacyPage() {
	return (
		<ContentPage
			title="Gizlilik"
			description="Bu metin mevcut teknik davranışı özetler. Sistem değiştikçe güncellenir. Hukuki uyumluluk taahhüdü veya garanti metni değildir."
			updatedAtLabel={siteConfig.legalUpdatedAtLabel}
		>
			<ContentSection title="Hizmet kapsamında işlenen bilgiler">
				<p>
					Astrozel hesaplama formlarında kullanıcı tarafından şu bilgiler
					girilebilir:
				</p>
				<ul className="list-disc space-y-1 pl-5">
					<li>İsim veya isteğe bağlı ad</li>
					<li>Doğum tarihi</li>
					<li>Doğum saati</li>
					<li>Doğum yeri</li>
					<li>Konum koordinatları</li>
					<li>Saat dilimi</li>
					<li>
						İlişki uyumu (sinastri) için ikinci kişiye ait aynı tür bilgiler
					</li>
				</ul>
				<p>
					Bu bilgiler astrolojik hesaplama üretmek amacıyla kullanılır. İsim
					alanı isteğe bağlıdır ve hesaplama için zorunlu değildir.
				</p>
			</ContentSection>

			<ContentSection title="Saklama ve tarayıcı depolaması">
				<p>
					Astrozel’de kullanıcı hesabı yoktur. Form veya sonuç verileri bir
					veritabanına kalıcı olarak kaydedilmez.
				</p>
				<p>
					Doğum haritası ve çift uyumu form taslakları tarayıcının{" "}
					<code className="rounded bg-muted px-1 py-0.5 text-[0.9em]">
						sessionStorage
					</code>{" "}
					alanında tutulabilir. Bu veri mevcut tarayıcı sekmesine aittir; sekme
					kapanınca genellikle silinir. “Bilgileri düzenle” gibi akışlarda
					taslağın bir kez geri yüklenmesi için kısa ömürlü bir bayrak da
					kullanılabilir.
				</p>
				<p>
					Hesaplama isteği sunucu API route’larına gönderilir; yanıt üretilir ve
					istemciye döner. İstek gövdesi kalıcı bir kullanıcı profili olarak
					saklanmaz.
				</p>
			</ContentSection>

			<ContentSection title="Konum hizmeti (GeoNames)">
				<p>Konum araması GeoNames hizmeti üzerinden yapılır.</p>
				<p>
					Astrozel sunucusu GeoNames’e arama metnini veya seçilen konumun
					koordinatlarını (saat dilimi sorgusu için enlem/boylam) gönderebilir.
					Kişi adı, doğum tarihi veya doğum saati GeoNames’e gönderilmez.
					GeoNames kullanıcı adı yalnızca sunucu tarafında tutulur.
				</p>
			</ContentSection>

			<ContentSection title="Google AdSense ve reklamlar">
				<p>
					Astrozel, Google AdSense aracılığıyla reklam gösterebilir. Onay ve
					yerleşim süreci Google tarafında ilerleyebilir; bu metin reklamların
					her zaman veya her sayfada göründüğünü garanti etmez.
				</p>
				<p>
					Google ve reklam iş ortakları, reklam sunumu ve ölçümü için çerezler
					veya benzer teknolojiler kullanabilir. Reklamlar, kullanıcının izin
					tercihlerine ve bulunduğu bölgeye göre kişiselleştirilmiş veya
					kişiselleştirilmemiş olabilir.
				</p>
				<p>
					Kişiselleştirilmiş reklamlar önceki etkinlik, yaklaşık konum veya
					ilgi alanları gibi sinyallerden yararlanabilir.
					Kişiselleştirilmemiş reklamlar içerik, genel konum ve benzeri
					bağlamsal sinyallere göre gösterilebilir.
					Kişiselleştirilmemiş reklamların tamamen çerezsiz olduğu anlamına
					gelmez.
				</p>
			</ContentSection>

			<ContentSection title="Google CMP ve izin tercihleri">
				<p>
					AEA, Birleşik Krallık ve İsviçre’deki uygun kullanıcılara Google’ın
					sertifikalı izin yönetim mesajı (Privacy &amp; Messaging / Google CMP)
					gösterilebilir. Kullanıcılar izin verebilir, izin vermeyebilir veya
					seçeneklerini ayrıntılı biçimde yönetebilir.
				</p>
				<p>
					Tercihler daha sonra sitedeki “Gizlilik seçenekleri” denetimiyle
					yeniden açılabilir. Bu denetim Google’ın resmi izin iptali / tercih
					yeniden gösterme mekanizmasını kullanır.
				</p>
				<p>
					<PrivacyOptionsButton className="inline-flex min-h-11 items-center rounded text-sm font-medium text-primary underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
				</p>
			</ContentSection>

			<ContentSection title="Üçüncü taraf hizmetler">
				<p>Hizmetin işleyişinde şu üçüncü taraflar kullanılabilir:</p>
				<ul className="list-disc space-y-1 pl-5">
					<li>Google AdSense (reklam sunumu ve ölçümü)</li>
					<li>Google Privacy &amp; Messaging / Google CMP (izin mesajları)</li>
					<li>GeoNames (konum araması ve saat dilimi)</li>
					<li>Cloudflare (barındırma, ağ ve güvenlik altyapısı)</li>
				</ul>
				<p>
					Google Analytics bu sitede kullanılmamaktadır. Cloudflare gibi
					altyapı sağlayıcıları teknik ve güvenlik amaçlı günlükler tutabilir.
				</p>
			</ContentSection>

			<ContentSection title="Haklar ve tercihler">
				<p>Kullanıcılar:</p>
				<ul className="list-disc space-y-1 pl-5">
					<li>Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilir</li>
					<li>
						Uygun bölgelerde reklam / izin tercihlerini Google CMP üzerinden
						değiştirebilir
					</li>
					<li>
						Siteyle{" "}
						<a
							href="/iletisim"
							className="rounded underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							İletişim
						</a>{" "}
						sayfası üzerinden ulaşabilir
					</li>
				</ul>
				<p>
					Şu anda herkese açık bir iletişim e-posta adresi yayımlanmamaktadır.
					İletişim sayfasındaki bilgi güncellendiğinde bu politika da
					güncellenir.
				</p>
			</ContentSection>

			<ContentSection title="Not">
				<p>
					Bu sayfa yasal bir uyumluluk belgesi değildir; yalnızca mevcut teknik
					davranışı açıklar. Reklam, izin veya altyapı davranışları Google ve
					diğer sağlayıcıların kendi politikalarına da tabidir.
				</p>
			</ContentSection>
		</ContentPage>
	);
}
