import {
	BIRTH_CHART_DRAFT_STORAGE_KEY,
	BIRTH_CHART_RESTORE_ONCE_KEY,
	LEGACY_BIRTH_CHART_DRAFT_STORAGE_KEY,
} from "@/features/birth-chart/constants/storage";
import { birthChartFormSchema } from "@/features/birth-chart/schemas/birth-chart-form-schema";
import type {
	BirthChartDraft,
	BirthChartFormValues,
} from "@/features/birth-chart/types/birth-chart";

function canUseSessionStorage(): boolean {
	return (
		typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
	);
}

export function createBirthChartDraft(
	values: BirthChartFormValues,
): BirthChartDraft {
	const parsed = birthChartFormSchema.parse({
		name: values.name ?? "",
		birthDate: values.birthDate,
		birthTime: values.birthTime,
		birthPlace: values.birthPlace,
		location: values.location,
	});

	return {
		version: 2,
		createdAt: new Date().toISOString(),
		name: parsed.name ?? "",
		birthDate: parsed.birthDate,
		birthTime: parsed.birthTime,
		birthPlace: parsed.birthPlace,
		location: parsed.location,
	};
}

export function saveBirthChartDraft(draft: BirthChartDraft): void {
	if (!canUseSessionStorage()) {
		throw new Error("Tarayıcı depolaması kullanılamıyor.");
	}

	try {
		window.sessionStorage.setItem(
			BIRTH_CHART_DRAFT_STORAGE_KEY,
			JSON.stringify(draft),
		);
		window.sessionStorage.removeItem(LEGACY_BIRTH_CHART_DRAFT_STORAGE_KEY);
	} catch {
		throw new Error(
			"Bilgilerin kaydedilemedi. Tarayıcı depolama ayarlarını kontrol et.",
		);
	}
}

export function getBirthChartDraft(): BirthChartDraft | null {
	if (!canUseSessionStorage()) {
		return null;
	}

	try {
		const raw = window.sessionStorage.getItem(BIRTH_CHART_DRAFT_STORAGE_KEY);
		if (!raw) {
			return null;
		}

		const parsed: unknown = JSON.parse(raw);
		if (typeof parsed !== "object" || parsed === null) {
			return null;
		}

		const candidate = parsed as Record<string, unknown>;
		if (candidate.version !== 2) {
			return null;
		}

		if (
			typeof candidate.createdAt !== "string" ||
			candidate.createdAt.length === 0
		) {
			return null;
		}

		const fields = birthChartFormSchema.safeParse({
			name: typeof candidate.name === "string" ? candidate.name : "",
			birthDate: candidate.birthDate,
			birthTime: candidate.birthTime,
			birthPlace: candidate.birthPlace,
			location: candidate.location,
		});

		if (!fields.success) {
			return null;
		}

		return {
			version: 2,
			createdAt: candidate.createdAt,
			name: fields.data.name ?? "",
			birthDate: fields.data.birthDate,
			birthTime: fields.data.birthTime,
			birthPlace: fields.data.birthPlace,
			location: fields.data.location,
		};
	} catch {
		return null;
	}
}

export function removeBirthChartDraft(): void {
	if (!canUseSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.removeItem(BIRTH_CHART_DRAFT_STORAGE_KEY);
		window.sessionStorage.removeItem(LEGACY_BIRTH_CHART_DRAFT_STORAGE_KEY);
	} catch {
		// Silme başarısız olsa bile akışı bozma.
	}
}

export function markBirthChartRestoreOnce(): void {
	if (!canUseSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.setItem(BIRTH_CHART_RESTORE_ONCE_KEY, "1");
	} catch {
		// Flag yazılamazsa form boş açılır; sonucu bozma.
	}
}

function consumeBirthChartRestoreOnce(): boolean {
	if (!canUseSessionStorage()) {
		return false;
	}

	try {
		const value = window.sessionStorage.getItem(BIRTH_CHART_RESTORE_ONCE_KEY);
		window.sessionStorage.removeItem(BIRTH_CHART_RESTORE_ONCE_KEY);
		return value === "1";
	} catch {
		return false;
	}
}

/** Survives Strict Mode / hydration remount within the same JS context. */
let birthChartRestoreMemory: { draft: BirthChartDraft; until: number } | null =
	null;

/**
 * Form mount: restore-once flag varsa draft döner; yoksa draft temizlenir.
 * Render sırasında çağırma — yalnızca effect içinde kullan.
 */
export function takeBirthChartDraftForForm(): BirthChartDraft | null {
	if (!canUseSessionStorage()) {
		return null;
	}

	if (consumeBirthChartRestoreOnce()) {
		const draft = getBirthChartDraft();
		birthChartRestoreMemory = draft
			? { draft, until: Date.now() + 2500 }
			: null;
		return draft;
	}

	if (birthChartRestoreMemory && Date.now() < birthChartRestoreMemory.until) {
		return birthChartRestoreMemory.draft;
	}

	birthChartRestoreMemory = null;
	removeBirthChartDraft();
	return null;
}
