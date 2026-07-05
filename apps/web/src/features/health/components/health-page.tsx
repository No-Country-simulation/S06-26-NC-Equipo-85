"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type Mood,
} from "@app/ui";
import { ApiErrorState } from "@/components/api-error-state";
import { useCheckins, useSubmitCheckin } from "../hooks/use-health";
import { MOOD_TO_EMOJI } from "../utils/mood";
import { CheckinForm } from "./checkin-form";
import { CheckinHistory } from "./checkin-history";
import { CheckinResponse } from "./checkin-response";
import type { CheckinFormValues } from "../types/health.types";
import type { CheckinResponse as CheckinResponseData } from "@/services/health/health.types";

/**
 * Vista de Salud mental (`/health`).
 *
 * Orquesta el flujo de check-in: formulario → respuesta empática de la IA →
 * historial. Consume `GET/POST /api/v1/health/checkins` vía los hooks de la
 * feature; el usuario se infiere del token, así que no hay estado de sesión que
 * resolver acá. Paleta calma (azul-horizonte); `granate` solo aparece en la
 * derivación a CVV.
 */
export function HealthPage() {
  const t = useTranslations("common.health");
  const {
    data: checkins,
    isLoading,
    error,
    refetch,
  } = useCheckins();
  const submit = useSubmitCheckin();

  // Resultado del último envío + mood elegido (el POST no devuelve el emoji).
  const [lastResult, setLastResult] = useState<{
    response: CheckinResponseData;
    mood: Mood;
  } | null>(null);

  // Historial más reciente primero (el orden del backend no está garantizado).
  const sortedCheckins = useMemo(
    () =>
      checkins
        ? [...checkins].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
        : undefined,
    [checkins],
  );

  function handleSubmit(values: CheckinFormValues) {
    const mood = values.mood;
    submit.mutate(
      {
        emoji: MOOD_TO_EMOJI[mood],
        rating: values.rating,
        context: values.context?.trim() || undefined,
      },
      {
        onSuccess: (response) => setLastResult({ response, mood }),
        onError: () =>
          toast.error(t("form.error_title"), {
            description: t("form.error_body"),
          }),
      },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-azul-horizonte-soft/50">
          <CardHeader className="pb-2">
            <CardTitle>
              {lastResult ? t("response.card_title") : t("form.card_title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastResult ? (
              <CheckinResponse
                response={lastResult.response}
                mood={lastResult.mood}
                onReset={() => setLastResult(null)}
              />
            ) : submit.error ? (
              <ApiErrorState
                error={submit.error}
                onRetry={() => submit.reset()}
              />
            ) : (
              <CheckinForm onSubmit={handleSubmit} isPending={submit.isPending} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("history.card_title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckinHistory
              checkins={sortedCheckins}
              isLoading={isLoading}
              error={error}
              onRetry={() => refetch()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
