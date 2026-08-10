import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { ContentSection } from "@/components/content/content-section";
import { PrivacyOptionsButton } from "@/components/layout/privacy-options-button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
	title: "Çerez Politikası",
	description:
		"Astrozel’de çerez, sessionStorage, Google CMP izin kayıtları ve Google AdSense reklam teknolojileri hakkında açıklama.",
	alternates: { canonical: "/cerez-politikasi" },
};

export default function CookiePolicyPage() {
	return (
		<ContentPage
			title="Çerez Politikası"
			description="Cookie, sessionStorage ve üçüncü taraf reklam / izin teknolojileri ayrı ele alınır. Bu metin hukuki uyumluluk garantisi değildir."
			updatedAtLabel={siteConfig.legalUpdatedAtLabel}
		>
			<ContentSection title="Çerez nedir?">
				<p>
					Çerezler, bir sitenin tarayıcıda küçük veri parçaları saklamasına
					olanak tanıyan teknolojilerdir. Benzer amaçlarla yerel depolama
					(örneğin sessionStorage) veya üçüncü taraf betikler de kullanılabilir.
				</p>
			</ContentSection>

			<ContentSection title="Astrozel’in kullandığı depolama türleri">
				<p>
					Kodda şu depolama ve teknoloji türleri kullanılabilir veya
					etkinleştirilebilir:
				</p>
				<ul className="list-disc space-y-1 pl-5">
					<li>
						<strong>İşlevsel tarayıcı depolaması:</strong> doğum haritası ve
						çift uyumu form taslakları için{" "}
						<code className="rounded bg-muted px-1 py-0.5 text-[0.9em]">
							sessionStorage
						</code>
					</li>
					<li>
						<strong>Form düzenleme / geri dönüş durumu:</strong> sonuç
						sayfasından forma dönüşte taslağın bir kez doldurulması için kısa
						ömürlü bayraklar
					</li>
					<li>
						<strong>Google CMP izin kayıtları:</strong> uygun bölgelerde izin
						tercihlerini hatırlamak için Google’ın Privacy &amp; Messaging
						çözümü
					</li>
					<li>
						<strong>Google AdSense:</strong> reklam sunumu, ölçüm ve ilgili
						iş ortaklarının teknolojileri
					</li>
				</ul>
				<p>
					Ürün akışında zorunlu bir{" "}
					<code className="rounded bg-muted px-1 py-0.5 text-[0.9em]">
						localStorage
					</code>{" "}
					kullanımı bulunmamaktadır. Google Analytics kullanılmamaktadır.
				</p>
			</ContentSection>

			<ContentSection title="Çerez ve teknoloji kategorileri">
				<div className="overflow-x-auto rounded-xl border border-border/70">
					<table className="w-full min-w-[20rem] border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-border/70 bg-muted/40">
								<th className="px-3 py-2 font-medium text-foreground">
									Kategori
								</th>
								<th className="px-3 py-2 font-medium text-foreground">
									Örnek kullanım
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-b border-border/60 align-top">
								<td className="px-3 py-2 text-foreground/80">
									Zorunlu / işlevsel
								</td>
								<td className="px-3 py-2 text-foreground/70">
									Form taslağı ve kısa ömürlü geri yükleme bayrakları
									(sessionStorage); sitenin temel çalışması
								</td>
							</tr>
							<tr className="border-b border-border/60 align-top">
								<td className="px-3 py-2 text-foreground/80">
									Tercih ve izin yönetimi
								</td>
								<td className="px-3 py-2 text-foreground/70">
									Google CMP / Privacy &amp; Messaging izin seçimleri
								</td>
							</tr>
							<tr className="border-b border-border/60 align-top">
								<td className="px-3 py-2 text-foreground/80">Reklam</td>
								<td className="px-3 py-2 text-foreground/70">
									Google AdSense ve reklam iş ortaklarının sunum teknolojileri
								</td>
							</tr>
							<tr className="align-top">
								<td className="px-3 py-2 text-foreground/80">
									Ölçüm veya güvenlik (üçüncü taraf)
								</td>
								<td className="px-3 py-2 text-foreground/70">
									Reklam ölçümü, dolandırıcılık ve kötüye kullanım önleme;
									Cloudflare gibi altyapı güvenlik günlükleri
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</ContentSection>

			<ContentSection title="Kişiselleştirilmiş ve kişiselleştirilmemiş reklamlar">
				<p>
					Astrozel, Google AdSense aracılığıyla reklam gösterebilir. Uygun
					bölgelerde reklam türü, kullanıcının CMP tercihleriyle ilişkilidir.
				</p>
				<p>
					<strong>Kişiselleştirilmiş reklamlar</strong> önceki etkinlik,
					yaklaşık konum veya ilgi alanları gibi sinyallerden yararlanabilir.
				</p>
				<p>
					<strong>Kişiselleştirilmemiş reklamlar</strong> içerik, genel konum ve
					benzeri bağlamsal sinyallere göre gösterilebilir. Bu reklamlar da
					frekans sınırı, toplu reklam raporlama ile dolandırıcılık ve kötüye
					kullanım önleme gibi amaçlarla bazı teknolojiler kullanabilir; yani
					tamamen çerezsiz oldukları anlamına gelmez.
				</p>
			</ContentSection>

			<ContentSection title="Tercihleri yönetme">
				<p>Kullanıcılar:</p>
				<ul className="list-disc space-y-1 pl-5">
					<li>
						Uygun bölgelerde Google CMP mesajından izin verebilir, vermeyebilir
						veya seçenekleri yönetebilir
					</li>
					<li>
						Daha sonra “Gizlilik seçenekleri” denetimiyle tercih panelini
						yeniden açabilir
					</li>
					<li>Tarayıcı ayarlarından çerezleri temizleyebilir veya engelleyebilir</li>
				</ul>
				<p>
					<PrivacyOptionsButton className="inline-flex min-h-11 items-center rounded text-sm font-medium text-primary underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
				</p>
				<p>
					CMP mesajı henüz yayınlanmamışsa veya bulunduğunuz bölge için
					uygulanmıyorsa bu denetim bir panel açmayabilir. Mesaj yayınlandıktan
					sonra Google’ın resmi mekanizması devreye girer.
				</p>
			</ContentSection>

			<ContentSection title="Not">
				<p>
					Bu sayfa mevcut teknik durumu açıklar. Reklam ve izin teknolojilerinin
					ayrıntılı davranışı Google’ın kendi belgelerine de tabidir.
				</p>
			</ContentSection>
		</ContentPage>
	);
}
