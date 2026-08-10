import type { ArticleSection } from "@/features/content/types/article";
import { ArticleCallout } from "@/features/content/components/article-callout";
import { renderRichText } from "@/features/content/utils/render-rich-text";

export function ArticleSectionView({ section }: { section: ArticleSection }) {
	return (
		<section id={section.id} className="scroll-mt-28 space-y-4">
			<h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-[1.65rem]">
				{section.title}
			</h2>
			{section.paragraphs.map((paragraph) => (
				<p
					key={paragraph.slice(0, 48)}
					className="text-base leading-relaxed text-foreground/78"
				>
					{renderRichText(paragraph)}
				</p>
			))}
			{section.bullets && section.bullets.length > 0 ? (
				<ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground/78">
					{section.bullets.map((item) => (
						<li key={item.slice(0, 48)}>{renderRichText(item)}</li>
					))}
				</ul>
			) : null}
			{section.table ? (
				<div className="overflow-x-auto rounded-2xl border border-border/80">
					<table className="w-full min-w-[20rem] border-collapse text-left text-sm">
						<caption className="border-b border-border/70 bg-muted/40 px-4 py-3 text-left text-xs font-medium text-foreground/60">
							{section.table.caption}
						</caption>
						<thead>
							<tr className="border-b border-border/70 text-foreground/55">
								{section.table.headers.map((header) => (
									<th
										key={header}
										scope="col"
										className="px-4 py-3 font-medium"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{section.table.rows.map((row) => (
								<tr
									key={row.join("-")}
									className="border-b border-border/50 last:border-b-0"
								>
									{row.map((cell, index) => (
										<td
											key={`${row[0]}-${index}`}
											className="px-4 py-3 text-foreground/75"
										>
											{cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : null}
			{section.callout ? <ArticleCallout callout={section.callout} /> : null}
		</section>
	);
}
