const WORD_PATTERN = /[\p{L}\p{N}’']+/gu;

export function countWords(text: string): number {
	const matches = text.match(WORD_PATTERN);
	return matches?.length ?? 0;
}

/** Approximate reading time in minutes (≈200 Turkish words/min). */
export function estimateReadingTimeMinutes(texts: string[]): number {
	const total = texts.reduce((sum, text) => sum + countWords(text), 0);
	return Math.max(1, Math.round(total / 200));
}
