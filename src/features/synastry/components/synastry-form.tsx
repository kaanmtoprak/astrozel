"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Info, Sparkles } from "lucide-react";
import { PersonBirthFields } from "@/features/synastry/components/person-birth-fields";
import {
	synastryFormSchema,
	type SynastryFormSchemaInput,
	type SynastryFormSchemaOutput,
} from "@/features/synastry/schemas/synastry-form-schema";
import {
	createSynastryDraft,
	saveSynastryDraft,
	takeSynastryDraftForForm,
} from "@/features/synastry/utils/synastry-draft";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { cn } from "@/lib/utils";

const emptyPerson = {
	name: "",
	birthDate: "",
	birthTime: "",
	birthPlace: "",
	location: null,
};

const emptyDefaults: SynastryFormSchemaInput = {
	personA: emptyPerson,
	personB: emptyPerson,
};

export type SynastryFormProps = {
	className?: string;
};

export function SynastryForm({ className }: SynastryFormProps) {
	const router = useRouter();
	const formId = useId();
	const [storageError, setStorageError] = useState<string | null>(null);
	const [isLocationBusy, setIsLocationBusy] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<SynastryFormSchemaInput, unknown, SynastryFormSchemaOutput>({
		resolver: zodResolver(synastryFormSchema),
		defaultValues: emptyDefaults,
		mode: "onSubmit",
	});

	useEffect(() => {
		const draft = takeSynastryDraftForForm();
		if (!draft) {
			return;
		}
		reset({
			personA: {
				name: draft.personA.name ?? "",
				birthDate: draft.personA.birthDate,
				birthTime: draft.personA.birthTime,
				birthPlace: draft.personA.birthPlace,
				location: draft.personA.location,
			},
			personB: {
				name: draft.personB.name ?? "",
				birthDate: draft.personB.birthDate,
				birthTime: draft.personB.birthTime,
				birthPlace: draft.personB.birthPlace,
				location: draft.personB.location,
			},
		});
	}, [reset]);

	const storageErrorId = `${formId}-storage-error`;

	const onSubmit = handleSubmit((values) => {
		setStorageError(null);
		try {
			const draft = createSynastryDraft({
				personA: {
					name: values.personA.name,
					birthDate: values.personA.birthDate,
					birthTime: values.personA.birthTime,
					birthPlace: values.personA.birthPlace,
					location: values.personA.location,
				},
				personB: {
					name: values.personB.name,
					birthDate: values.personB.birthDate,
					birthTime: values.personB.birthTime,
					birthPlace: values.personB.birthPlace,
					location: values.personB.location,
				},
			});
			saveSynastryDraft(draft);
			router.push("/cift-uyumu/sonuc");
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Bilgilerin kaydedilemedi. Lütfen tekrar dene.";
			setStorageError(message);
		}
	});

	return (
		// Chrome iOS may inject __gcruniqueid before React hydration.
		// Suppression is intentionally limited to this exact form/input surface.
		<form
			onSubmit={onSubmit}
			noValidate
			className={cn("space-y-8 overflow-visible", className)}
			aria-describedby={storageError ? storageErrorId : undefined}
			suppressHydrationWarning
		>
			<div className="grid min-w-0 items-stretch gap-4 overflow-visible lg:grid-cols-[1fr_auto_1fr] lg:gap-5">
				<PersonBirthFields
					personKey="personA"
					title="Birinci kişi"
					helper="Lavanta tonu · ilk harita"
					formId={formId}
					register={register}
					control={control}
					errors={errors}
					onLocationBusyChange={setIsLocationBusy}
				/>
				<div
					className="synastry-orbit-link mx-auto flex h-12 w-12 items-center justify-center self-center lg:h-full lg:w-16"
					aria-hidden="true"
				>
					<span className="synastry-orbit-ring relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-card/70">
						<span className="absolute inset-1 rounded-full border border-dashed border-primary/20" />
						<span className="h-2 w-2 rounded-full bg-primary/75" />
					</span>
				</div>
				<PersonBirthFields
					personKey="personB"
					title="İkinci kişi"
					helper="Gökyüzü tonu · ikinci harita"
					formId={formId}
					register={register}
					control={control}
					errors={errors}
					onLocationBusyChange={setIsLocationBusy}
				/>
			</div>

			<div className="flex gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-sm text-foreground/75">
				<Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
				<p>
					Doğum saati bilinmiyorsa yükselen ve ev bağlantıları güvenilir biçimde
					hesaplanamaz. Bu nedenle her iki kişi için doğum saati zorunludur.
				</p>
			</div>

			{storageError ? (
				<FieldError id={storageErrorId} message={storageError} />
			) : null}

			<div className="mx-auto flex w-full max-w-xl flex-col items-center gap-3 text-center">
				<p className="text-sm text-foreground/60">
					İki doğum haritasındaki astrolojik bağlantılar karşılaştırılır.
				</p>
				<Button
					type="submit"
					size="lg"
					className="synastry-cta-button min-h-12 w-full cursor-pointer shadow-md sm:min-w-[280px]"
					disabled={isSubmitting || isLocationBusy}
				>
					<Sparkles className="h-4 w-4" aria-hidden="true" />
					Uyumumuzu Hesapla
				</Button>
			</div>
		</form>
	);
}
