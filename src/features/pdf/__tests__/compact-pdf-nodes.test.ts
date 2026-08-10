import { describe, expect, it } from "vitest";
import {
	assertValidPdfDocument,
	compactPdfNodes,
	findInvalidPdfNodes,
} from "@/features/pdf/utils/compact-pdf-nodes";

describe("compact-pdf-nodes", () => {
	it("removes undefined null and false only", () => {
		expect(compactPdfNodes([0, "", false, null, undefined, { text: "a" }])).toEqual([
			0,
			"",
			{ text: "a" },
		]);
	});

	it("finds invalid nested nodes with path", () => {
		const hits = findInvalidPdfNodes({
			content: [{ text: "ok" }, undefined, { stack: [false, { text: "x" }] }],
		});
		expect(hits.some((hit) => hit.includes("content[1]"))).toBe(true);
		expect(hits.some((hit) => hit.includes("stack[0]"))).toBe(true);
	});

	it("assertValidPdfDocument throws on undefined content", () => {
		expect(() =>
			assertValidPdfDocument({ content: [undefined] }),
		).toThrow(/Invalid PDF node/);
	});

	it("allows pdfmake border false tuples", () => {
		const hits = findInvalidPdfNodes({
			content: [
				{
					table: {
						body: [
							[
								{
									text: "İsim",
									border: [false, false, false, false],
								},
							],
						],
					},
				},
			],
		});
		expect(hits).toEqual([]);
	});
});
