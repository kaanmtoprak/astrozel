import Link from "next/link";
import type { ReactNode } from "react";

const LINK_PATTERN = /\[([^\]]+)\]\((\/[^)]+)\)/g;

export function renderRichText(text: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	let key = 0;

	LINK_PATTERN.lastIndex = 0;
	while ((match = LINK_PATTERN.exec(text)) !== null) {
		if (match.index > lastIndex) {
			nodes.push(text.slice(lastIndex, match.index));
		}
		nodes.push(
			<Link
				key={`link-${key}`}
				href={match[2]}
				className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:text-primary/80 hover:decoration-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			>
				{match[1]}
			</Link>,
		);
		key += 1;
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}

	return nodes;
}
