"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Info } from "lucide-react";
import { BirthTimeInfo } from "@/features/birth-chart/components/birth-time-info";
import {
	birthChartFormSchema,
	type BirthChartFormSchemaInput,
	type BirthChartFormSchemaOutput,
} from "@/features/birth-chart/schemas/birth-chart-form-schema";
import {
	createBirthChartDraft,
	saveBirthChartDraft,
	takeBirthChartDraftForForm,
} from "@/features/birth-chart/utils/birth-chart-draft";
import { LocationCombobox } from "@/features/location/components/location-combobox";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";

export type BirthChartFormProps = {
	variant?: "compact" | "full";
	className?: string;
	showTimeInfo?: boolean;
};

const emptyDefaults: BirthChartFormSchemaInput = {
	name: "",
	birthDate: "",
	birthTime: "",
	birthPlace: "",
	location: null,
};

export function BirthChartForm({
	variant = "compact",
	className,
	showTimeInfo = false,
}: BirthChartFormProps) {
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
	} = useForm<BirthChartFormSchemaInput, unknown, BirthChartFormSchemaOutput>({
		resolver: zodResolver(birthChartFormSchema),
		defaultValues: emptyDefaults,
		mode: "onSubmit",
	});

	useEffect(() => {
		const draft = takeBirthChartDraftForForm();
		if (!draft) {
			return;
		}

		reset({
			name: draft.name ?? "",
			birthDate: draft.birthDate,
			birthTime: draft.birthTime,
			birthPlace: draft.birthPlace,
			location: draft.location,
		});
	}, [reset]);

	const nameId = `${formId}-name`;
	const birthDateId = `${formId}-birth-date`;
	const birthTimeId = `${formId}-birth-time`;
	const birthPlaceId = `${formId}-birth-place`;
	const nameErrorId = `${nameId}-error`;
	const birthDateErrorId = `${birthDateId}-error`;
	const birthTimeErrorId = `${birthTimeId}-error`;
	const birthPlaceErrorId = `${birthPlaceId}-error`;
	const birthPlaceHintId = `${birthPlaceId}-hint`;
	const storageErrorId = `${formId}-storage-error`;

	const locationErrorMessage =
		errors.location?.message ?? errors.birthPlace?.message;

	const onSubmit = handleSubmit((values) => {
		setStorageError(null);

		try {
			const draft = createBirthChartDraft({
				name: values.name,
				birthDate: values.birthDate,
				birthTime: values.birthTime,
				birthPlace: values.birthPlace,
				location: values.location,
			});
			saveBirthChartDraft(draft);
			router.push("/dogum-haritasi/sonuc");
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Bilgilerin kaydedilemedi. Lütfen tekrar dene.";
			setStorageError(message);
		}
	});

	return (
		<form
			onSubmit={onSubmit}
			noValidate
			className={cn("space-y-5 overflow-visible", className)}
			aria-describedby={storageError ? storageErrorId : undefined}
		>
			<div className="grid min-w-0 gap-5 overflow-visible sm:grid-cols-2">
				<div className={cn("min-w-0 space-y-2", variant === "full" && "sm:col-span-2")}>
					<label htmlFor={nameId} className="block text-sm font-medium text-foreground">
						İsim <span className="font-normal text-foreground/50">(isteğe bağlı)</span>
					</label>
					<Input
						id={nameId}
						type="text"
						autoComplete="name"
						placeholder="İsminiz"
						{...register("name")}
						hasError={Boolean(errors.name)}
						aria-describedby={errors.name ? nameErrorId : undefined}
					/>
					<FieldError id={nameErrorId} message={errors.name?.message} />
				</div>

				<div className="min-w-0 space-y-2 overflow-visible">
					<label
						htmlFor={birthDateId}
						className="block text-sm font-medium text-foreground"
					>
						Doğum Tarihi
					</label>
					<Controller
						name="birthDate"
						control={control}
						render={({ field }) => (
							<DatePicker
								id={birthDateId}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								hasError={Boolean(errors.birthDate)}
								describedBy={
									errors.birthDate ? birthDateErrorId : undefined
								}
							/>
						)}
					/>
					<FieldError id={birthDateErrorId} message={errors.birthDate?.message} />
				</div>

				<div className="min-w-0 space-y-2 overflow-visible">
					<span
						id={`${birthTimeId}-label`}
						className="block text-sm font-medium text-foreground"
					>
						Doğum Saati
					</span>
					<Controller
						name="birthTime"
						control={control}
						render={({ field }) => (
							<TimePicker
								key={field.value || "empty-time"}
								id={birthTimeId}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								hasError={Boolean(errors.birthTime)}
								describedBy={
									errors.birthTime ? birthTimeErrorId : undefined
								}
							/>
						)}
					/>
					<FieldError id={birthTimeErrorId} message={errors.birthTime?.message} />
				</div>

				<div className={cn("min-w-0 overflow-visible", variant === "full" && "sm:col-span-2")}>
					<Controller
						name="birthPlace"
						control={control}
						render={({ field: birthPlaceField }) => (
							<Controller
								name="location"
								control={control}
								render={({ field: locationField }) => (
									<LocationCombobox
										id={birthPlaceId}
										label="Doğum Yeri"
										value={birthPlaceField.value}
										selectedLocation={locationField.value}
										hasError={Boolean(locationErrorMessage)}
										describedBy={
											locationErrorMessage
												? `${birthPlaceHintId} ${birthPlaceErrorId}`
												: birthPlaceHintId
										}
										onBusyChange={setIsLocationBusy}
										onQueryChange={(nextValue) => {
											birthPlaceField.onChange(nextValue);
											if (locationField.value) {
												locationField.onChange(null);
											}
										}}
										onLocationChange={(location) => {
											locationField.onChange(location);
											if (location) {
												birthPlaceField.onChange(location.displayName);
											}
										}}
									/>
								)}
							/>
						)}
					/>
					<p
						id={birthPlaceHintId}
						className="mt-2 flex gap-2 rounded-xl border border-border/70 bg-muted/60 px-3 py-2.5 text-xs leading-relaxed text-foreground/70 sm:text-sm"
					>
						<span
							className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-primary"
							aria-hidden="true"
						>
							<Info className="h-4 w-4" strokeWidth={1.75} />
						</span>
						<span>
							Yükselen ve ev hesaplamasının daha hassas olması için yalnızca
							şehri değil, doğduğun ilçe veya en yakın yerleşim yerini seç.
						</span>
					</p>
					<FieldError id={birthPlaceErrorId} message={locationErrorMessage} />
				</div>
			</div>

			{showTimeInfo ? <BirthTimeInfo /> : null}

			{storageError ? (
				<p
					id={storageErrorId}
					role="alert"
					className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
				>
					{storageError}
				</p>
			) : null}

			<div
				className={cn(
					"flex",
					variant === "compact" ? "justify-center" : "justify-start",
				)}
			>
				<Button
					type="submit"
					size="lg"
					data-mobile-target="submit"
					disabled={isSubmitting || isLocationBusy}
					className="w-full cursor-pointer sm:w-auto"
				>
					{isSubmitting ? "Hazırlanıyor…" : "Doğum Haritamı Hazırla"}
				</Button>
			</div>
		</form>
	);
}
