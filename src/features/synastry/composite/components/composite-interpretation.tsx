import type { CompositeInterpretation } from "@/features/synastry/composite/types/composite";

function InterpretationBlock({
	headingId,
	title,
	paragraphs,
}: {
	headingId: string;
	title: string;
	paragraphs: string[];
}) {
	return (
		<div>
			<h3
				id={headingId}
				className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground/55"
			>
				{title}
			</h3>
			{paragraphs.map((paragraph) => (
				<p
					key={paragraph.slice(0, 48)}
					className="mt-2 text-sm leading-relaxed text-foreground/80"
				>
					{paragraph}
				</p>
			))}
		</div>
	);
}

export function CompositeInterpretationSection({
	interpretation,
}: {
	interpretation: CompositeInterpretation;
}) {
	return (
		<section
			aria-labelledby="composite-interpretation-heading"
			className="rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6"
		>
			<h2
				id="composite-interpretation-heading"
				className="font-serif text-xl text-foreground sm:text-2xl"
			>
				İlişki haritası yorumu
			</h2>
			<div className="mt-5 space-y-6">
				<InterpretationBlock
					headingId="composite-character"
					title="İlişkinin temel karakteri"
					paragraphs={interpretation.character}
				/>
				<InterpretationBlock
					headingId="composite-emotional"
					title="Duygusal atmosfer"
					paragraphs={interpretation.emotional}
				/>
				<InterpretationBlock
					headingId="composite-love"
					title="Sevgi ve yakınlık dili"
					paragraphs={interpretation.love}
				/>
				<InterpretationBlock
					headingId="composite-drive"
					title="Hareket ve çatışma biçimi"
					paragraphs={interpretation.drive}
				/>
				<InterpretationBlock
					headingId="composite-supportive"
					title="Güçlü dinamikler"
					paragraphs={interpretation.supportiveDynamics}
				/>
				<InterpretationBlock
					headingId="composite-challenging"
					title="Zorlayıcı dinamikler"
					paragraphs={interpretation.challengingDynamics}
				/>
				<InterpretationBlock
					headingId="composite-theme"
					title="Ortak ilişki teması"
					paragraphs={interpretation.sharedTheme}
				/>
			</div>
		</section>
	);
}
