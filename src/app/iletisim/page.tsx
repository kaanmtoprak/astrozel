import type { Metadata } from "next";
import { ContentPage } from "@/components/content/content-page";
import { ContentSection } from "@/components/content/content-section";

export const metadata: Metadata = {
	title: "İletişim",
	description: "Astrozel iletişim bilgileri.",
	alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
	return (
		<ContentPage
			title="İletişim"
			description="Şimdilik yalnızca bilgilendirme amaçlı bir sayfa."
		>
			<ContentSection>
				<p>
					Kaan Toprak hakkında daha fazla bilgi ve iletişim kanalları için{" "}
					<a
						href="https://kaantoprak.net"
						target="_blank"
						rel="noopener noreferrer"
						className="underline underline-offset-2 hover:text-foreground"
					>
						kaantoprak.net
					</a>{" "}
					adresini ziyaret edebilirsiniz.
				</p>
			</ContentSection>
		</ContentPage>
	);
}
