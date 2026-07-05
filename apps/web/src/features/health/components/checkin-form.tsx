"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Button,
  cn,
  DEFAULT_MOODS,
  EmojiCheckIn,
  Label,
  type Mood,
  type MoodOption,
  Spinner,
  Textarea,
} from "@app/ui";
import {
  CHECKIN_DEFAULT_VALUES,
  checkinSchema,
} from "../schemas/checkin.schema";
import { RATING_VALUES } from "../utils/mood";
import type { CheckinFormValues } from "../types/health.types";

type CheckinFormProps = {
  /** Envía el check-in ya validado. El mapeo mood→emoji ocurre en la page. */
  onSubmit: (values: CheckinFormValues) => void;
  isPending: boolean;
};

/**
 * Formulario de check-in emocional.
 *
 * Captura las tres señales que pide el contrato: `mood` (emoji), `rating` 1–5
 * (control explícito, señal independiente del emoji) y `context` opcional.
 * Valida con Zod; los controles a medida (`EmojiCheckIn`, escala de rating) se
 * integran con react-hook-form vía `Controller`.
 */
export function CheckinForm({ onSubmit, isPending }: CheckinFormProps) {
  const t = useTranslations("common.health.form");

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckinFormValues>({
    resolver: zodResolver(checkinSchema),
    defaultValues: CHECKIN_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  // Labels localizados sin perder ids/emojis del picker de `@app/ui`.
  const moods: MoodOption[] = DEFAULT_MOODS.map((option) => ({
    ...option,
    label: t(`moods.${option.id}`),
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6" noValidate>
      <div className="grid gap-2">
        <Label>{t("mood_label")}</Label>
        <Controller
          control={control}
          name="mood"
          render={({ field }) => (
            <EmojiCheckIn
              label={t("mood_label")}
              moods={moods}
              value={field.value as Mood | undefined}
              onChange={field.onChange}
            />
          )}
        />
        {errors.mood ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.mood.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label>{t("rating_label")}</Label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <div
              role="radiogroup"
              aria-label={t("rating_label")}
              className="flex flex-wrap gap-2"
            >
              {RATING_VALUES.map((value) => {
                const isSelected = field.value === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={t(`rating_levels.${value}`)}
                    onClick={() => field.onChange(value)}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full border-2 text-base font-semibold transition-colors outline-none",
                      "focus-visible:ring-3 focus-visible:ring-ring/50",
                      isSelected
                        ? "border-azul-horizonte bg-azul-horizonte-soft text-azul-horizonte"
                        : "border-transparent bg-muted text-muted-foreground hover:bg-arena",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          )}
        />
        <p className="text-xs text-muted-foreground">{t("rating_hint")}</p>
        {errors.rating ? (
          <p role="alert" className="text-sm text-destructive">
            {errors.rating.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="checkin-context">{t("context_label")}</Label>
        <Textarea
          id="checkin-context"
          rows={3}
          placeholder={t("context_placeholder")}
          {...register("context")}
        />
      </div>

      <Button type="submit" disabled={isPending} className="justify-self-start">
        {isPending ? (
          <>
            <Spinner size="sm" className="mr-2" />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
