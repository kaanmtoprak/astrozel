"use client";

import type {
	Control,
	FieldErrors,
	UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { MoonStar, Stars } from "lucide-react";
import { LocationCombobox } from "@/features/location/components/location-combobox";
import type {
	SynastryFormSchemaInput,
	SynastryFormSchemaOutput,
} from "@/features/synastry/schemas/synastry-form-schema";
import { DatePicker } from "@/components/ui/date-picker";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";

type PersonKey = "personA" | "personB";

export type PersonBirthFieldsProps = {
	personKey: PersonKey;
	title: string;
	helper?: string;
	formId: string;
	register: UseFormRegister<SynastryFormSchemaInput>;
	control: Control<
		SynastryFormSchemaInput,
		unknown,
		SynastryFormSchemaOutput
	>;
	errors: FieldErrors<SynastryFormSchemaInput>;
	onLocationBusyChange: (busy: boolean) => void;
};

export function PersonBirthFields({
	personKey,
	title,
	helper,
	formId,
	register,
	control,
	errors,
	onLocationBusyChange,
}: PersonBirthFieldsProps) {
	const personErrors = errors[personKey];
	const nameId = `${formId}-${personKey}-name`;
	const birthDateId = `${formId}-${personKey}-birth-date`;
	const birthTimeId = `${formId}-${personKey}-birth-time`;
	const birthPlaceId = `${formId}-${personKey}-birth-place`;
	const birthPlaceHintId = `${birthPlaceId}-hint`;
	const birthPlaceErrorId = `${birthPlaceId}-error`;
	const isPersonA = personKey === "personA";
	const Icon = isPersonA ? MoonStar : Stars;

	const locationErrorMessage =
		personErrors?.location?.message ?? personErrors?.birthPlace?.message;

	return (
		<section
			className={`synastry-person-card min-w-0 rounded-3xl border border-border/80 p-5 shadow-sm sm:p-6 ${
				isPersonA
					? "bg-[linear-gradient(165deg,color-mix(in_srgb,var(--lavender)_28%,white),white_72%)]"
					: "bg-[linear-gradient(165deg,color-mix(in_srgb,var(--sky-blue)_28%,white),white_72%)]"
			}`}
		>
			<header className="flex items-start gap-3 border-b border-border/50 pb-4">
				<span
					className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
						isPersonA
							? "bg-[color-mix(in_srgb,var(--lavender)_55%,white)] text-primary"
							: "bg-[color-mix(in_srgb,var(--sky-blue)_55%,white)] text-primary"
					}`}
					aria-hidden="true"
				>
					<Icon className="h-4 w-4" strokeWidth={1.75} />
				</span>
				<div className="min-w-0">
					<h2 className="font-serif text-xl tracking-tight text-foreground sm:text-2xl">
						{title}
					</h2>
					{helper ? (
						<p className="mt-1 text-xs text-foreground/55">{helper}</p>
					) : null}
				</div>
			</header>

			<div className="mt-5 space-y-4 overflow-visible">
				<div className="min-w-0 space-y-2">
					<label htmlFor={nameId} className="block text-sm font-medium text-foreground">
						İsim{" "}
						<span className="font-normal text-foreground/50">(isteğe bağlı)</span>
					</label>
					{/* Chrome iOS may inject __gcruniqueid before React hydration.
					    Suppression is intentionally limited to this exact form/input surface. */}
					<Input
						id={nameId}
						type="text"
						autoComplete="nickname"
						placeholder="İsim"
						{...register(`${personKey}.name`)}
						hasError={Boolean(personErrors?.name)}
						aria-describedby={
							personErrors?.name ? `${nameId}-error` : undefined
						}
						suppressHydrationWarning
					/>
					<FieldError id={`${nameId}-error`} message={personErrors?.name?.message} />
				</div>

				<div className="min-w-0 space-y-2 overflow-visible">
					<label
						htmlFor={birthDateId}
						className="block text-sm font-medium text-foreground"
					>
						Doğum tarihi
					</label>
					<Controller
						control={control}
						name={`${personKey}.birthDate`}
						render={({ field }) => (
							<DatePicker
								id={birthDateId}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								hasError={Boolean(personErrors?.birthDate)}
								describedBy={
									personErrors?.birthDate ? `${birthDateId}-error` : undefined
								}
							/>
						)}
					/>
					<FieldError
						id={`${birthDateId}-error`}
						message={personErrors?.birthDate?.message}
					/>
				</div>

				<div className="min-w-0 space-y-2 overflow-visible">
					<span
						id={`${birthTimeId}-label`}
						className="block text-sm font-medium text-foreground"
					>
						Doğum saati
					</span>
					<Controller
						control={control}
						name={`${personKey}.birthTime`}
						render={({ field }) => (
							<TimePicker
								key={field.value || `empty-time-${personKey}`}
								id={birthTimeId}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								hasError={Boolean(personErrors?.birthTime)}
								describedBy={
									personErrors?.birthTime ? `${birthTimeId}-error` : undefined
								}
							/>
						)}
					/>
					<FieldError
						id={`${birthTimeId}-error`}
						message={personErrors?.birthTime?.message}
					/>
				</div>

				<div className="min-w-0 overflow-visible">
					<Controller
						control={control}
						name={`${personKey}.birthPlace`}
						render={({ field: birthPlaceField }) => (
							<Controller
								control={control}
								name={`${personKey}.location`}
								render={({ field: locationField }) => (
									<LocationCombobox
										id={birthPlaceId}
										label="Doğum yeri"
										value={birthPlaceField.value}
										selectedLocation={locationField.value}
										hasError={Boolean(locationErrorMessage)}
										describedBy={
											locationErrorMessage
												? `${birthPlaceHintId} ${birthPlaceErrorId}`
												: birthPlaceHintId
										}
										suppressBrowserHydrationWarning
										onBusyChange={onLocationBusyChange}
										onQueryChange={(nextValue) => {
											birthPlaceField.onChange(nextValue);
											if (
												locationField.value &&
												nextValue !== locationField.value.displayName
											) {
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
					<p id={birthPlaceHintId} className="mt-2 text-xs text-foreground/55">
						Arama sonuçlarından bir konum seç.
					</p>
					<FieldError id={birthPlaceErrorId} message={locationErrorMessage} />
				</div>
			</div>
		</section>
	);
}
