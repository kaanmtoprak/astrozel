import {
	SYNASTRY_DRAFT_STORAGE_KEY,
	SYNASTRY_RESTORE_ONCE_KEY,
} from "@/features/synastry/constants/storage";
import { synastryFormSchema } from "@/features/synastry/schemas/synastry-form-schema";
import type {
	SynastryDraft,
	SynastryFormValues,
} from "@/features/synastry/types/synastry-form";

function canUseSessionStorage(): boolean {
	return (
		typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
	);
}

export function createSynastryDraft(values: SynastryFormValues): SynastryDraft {
	const parsed = synastryFormSchema.parse({
		personA: {
			name: values.personA.name ?? "",
			birthDate: values.personA.birthDate,
			birthTime: values.personA.birthTime,
			birthPlace: values.personA.birthPlace,
			location: values.personA.location,
		},
		personB: {
			name: values.personB.name ?? "",
			birthDate: values.personB.birthDate,
			birthTime: values.personB.birthTime,
			birthPlace: values.personB.birthPlace,
			location: values.personB.location,
		},
	});

	return {
		version: 1,
		createdAt: new Date().toISOString(),
		personA: {
			name: parsed.personA.name ?? "",
			birthDate: parsed.personA.birthDate,
			birthTime: parsed.personA.birthTime,
			birthPlace: parsed.personA.birthPlace,
			location: parsed.personA.location,
		},
		personB: {
			name: parsed.personB.name ?? "",
			birthDate: parsed.personB.birthDate,
			birthTime: parsed.personB.birthTime,
			birthPlace: parsed.personB.birthPlace,
			location: parsed.personB.location,
		},
	};
}

export function saveSynastryDraft(draft: SynastryDraft): void {
	if (!canUseSessionStorage()) {
		throw new Error("Tarayıcı depolaması kullanılamıyor.");
	}

	try {
		window.sessionStorage.setItem(
			SYNASTRY_DRAFT_STORAGE_KEY,
			JSON.stringify(draft),
		);
	} catch {
		throw new Error(
			"Bilgilerin kaydedilemedi. Tarayıcı depolama ayarlarını kontrol et.",
		);
	}
}

export function getSynastryDraft(): SynastryDraft | null {
	if (!canUseSessionStorage()) {
		return null;
	}

	try {
		const raw = window.sessionStorage.getItem(SYNASTRY_DRAFT_STORAGE_KEY);
		if (!raw) {
			return null;
		}

		const parsed: unknown = JSON.parse(raw);
		if (typeof parsed !== "object" || parsed === null) {
			return null;
		}

		const candidate = parsed as Record<string, unknown>;
		if (candidate.version !== 1) {
			return null;
		}
		if (
			typeof candidate.createdAt !== "string" ||
			candidate.createdAt.length === 0
		) {
			return null;
		}

		const fields = synastryFormSchema.safeParse({
			personA: candidate.personA,
			personB: candidate.personB,
		});
		if (!fields.success) {
			return null;
		}

		return {
			version: 1,
			createdAt: candidate.createdAt,
			personA: {
				name: fields.data.personA.name ?? "",
				birthDate: fields.data.personA.birthDate,
				birthTime: fields.data.personA.birthTime,
				birthPlace: fields.data.personA.birthPlace,
				location: fields.data.personA.location,
			},
			personB: {
				name: fields.data.personB.name ?? "",
				birthDate: fields.data.personB.birthDate,
				birthTime: fields.data.personB.birthTime,
				birthPlace: fields.data.personB.birthPlace,
				location: fields.data.personB.location,
			},
		};
	} catch {
		return null;
	}
}

export function removeSynastryDraft(): void {
	if (!canUseSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.removeItem(SYNASTRY_DRAFT_STORAGE_KEY);
	} catch {
		// Silme başarısız olsa bile akışı bozma.
	}
}

export function markSynastryRestoreOnce(): void {
	if (!canUseSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.setItem(SYNASTRY_RESTORE_ONCE_KEY, "1");
	} catch {
		// Flag yazılamazsa form boş açılır; sonucu bozma.
	}
}

function consumeSynastryRestoreOnce(): boolean {
	if (!canUseSessionStorage()) {
		return false;
	}

	try {
		const value = window.sessionStorage.getItem(SYNASTRY_RESTORE_ONCE_KEY);
		window.sessionStorage.removeItem(SYNASTRY_RESTORE_ONCE_KEY);
		return value === "1";
	} catch {
		return false;
	}
}

/** Survives Strict Mode / hydration remount within the same JS context. */
let synastryRestoreMemory: { draft: SynastryDraft; until: number } | null = null;

/**
 * Form mount: restore-once flag varsa draft döner; yoksa draft temizlenir.
 * Render sırasında çağırma — yalnızca effect içinde kullan.
 */
export function takeSynastryDraftForForm(): SynastryDraft | null {
	if (!canUseSessionStorage()) {
		return null;
	}

	if (consumeSynastryRestoreOnce()) {
		const draft = getSynastryDraft();
		synastryRestoreMemory = draft ? { draft, until: Date.now() + 2500 } : null;
		return draft;
	}

	if (synastryRestoreMemory && Date.now() < synastryRestoreMemory.until) {
		return synastryRestoreMemory.draft;
	}

	synastryRestoreMemory = null;
	removeSynastryDraft();
	return null;
}
