"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Badge, Button, Label, Spinner, Textarea } from "@app/ui";
import { ApiErrorState } from "@/components/api-error-state";
import { useTextAnalysis } from "../hooks/use-health";
import {
  MAX_DESCRIPTION_LENGTH,
  TEXT_ANALYSIS_DEFAULT_VALUES,
  textAnalysisSchema,
} from "../schemas/text-analysis.schema";
import type { TextAnalysisFormValues } from "../types/health.types";

/**
 * Análisis por IA de un texto libre de estado emocional (mock temporal).
 *
 * Complementa el check-in estructurado: en vez de emoji + rating, el usuario
 * escribe cómo se siente y la IA devuelve un mensaje empático. Sin persistencia
 * (no toca el historial). Paleta calma (azul-horizonte).
 */
export function TextAnalysis() {
  const t = useTranslations("common.health.text_analysis");
  const analysis = useTextAnalysis();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TextAnalysisFormValues>({
    resolver: zodResolver(textAnalysisSchema),
    defaultValues: TEXT_ANALYSIS_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  // Contador en vivo sin `watch` (que el React Compiler no puede memoizar):
  // se compone sobre el `onChange` del propio `register`.
  const [used, setUsed] = useState(0);
  const descriptionField = register("description");

  return (
    <div className="grid gap-4">
      <form
        onSubmit={handleSubmit((values) => analysis.mutate(values))}
        className="grid gap-3"
        noValidate
      >
        <div className="grid gap-2">
          <Label htmlFor="text-analysis-description">{t("label")}</Label>
          <Textarea
            id="text-analysis-description"
            rows={4}
            maxLength={MAX_DESCRIPTION_LENGTH}
            placeholder={t("placeholder")}
            aria-describedby="text-analysis-description-count"
            {...descriptionField}
            onChange={(event) => {
              void descriptionField.onChange(event);
              setUsed(event.target.value.length);
            }}
          />
          <div className="flex items-center justify-between">
            <span
              id="text-analysis-description-count"
              className="text-xs text-muted-foreground"
            >
              {t("counter", { used, max: MAX_DESCRIPTION_LENGTH })}
            </span>
            {errors.description ? (
              <span role="alert" className="text-sm text-destructive">
                {errors.description.message}
              </span>
            ) : null}
          </div>
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={analysis.isPending}
          className="justify-self-start"
        >
          {analysis.isPending ? (
            <>
              <Spinner size="sm" className="mr-2" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 size-4" aria-hidden="true" />
              {t("submit")}
            </>
          )}
        </Button>
      </form>

      {analysis.error ? (
        <ApiErrorState error={analysis.error} onRetry={() => analysis.reset()} />
      ) : analysis.data ? (
        <div className="grid gap-2 rounded-xl border border-azul-horizonte/30 bg-azul-horizonte-soft p-4 text-azul-horizonte">
          {analysis.data.status ? (
            <Badge className="w-fit bg-azul-horizonte text-white">
              {analysis.data.status}
            </Badge>
          ) : null}
          <p className="text-sm leading-6">{analysis.data.message}</p>
        </div>
      ) : null}
    </div>
  );
}
