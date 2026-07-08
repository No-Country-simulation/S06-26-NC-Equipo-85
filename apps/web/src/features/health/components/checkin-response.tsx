"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Button, MoodBanner, Spinner, type Mood } from "@app/ui";
import { ApiErrorState } from "@/components/api-error-state";
import { useEmpathicResponse } from "../hooks/use-health";
import { CvvAlert } from "./cvv-alert";
import type { CheckinResponse as CheckinResponseData } from "@/services/health/health.types";

type CheckinResponseProps = {
  response: CheckinResponseData;
  /** Mood elegido, para el banner (el POST no devuelve el emoji). */
  mood: Mood;
  /** Vuelve al formulario para registrar otro check-in. */
  onReset: () => void;
};

/**
 * Resultado de un check-in recién enviado.
 *
 * Muestra el mensaje empático y la acción sugerida por la IA; si el backend
 * marca `derivar_cvv`, antepone la {@link CvvAlert}. Permite pedir —bajo
 * demanda— una respuesta empática extendida (`empathic-response`), sin
 * dispararla automáticamente.
 */
export function CheckinResponse({
  response,
  mood,
  onReset,
}: CheckinResponseProps) {
  const t = useTranslations("common.health.response");
  const empathic = useEmpathicResponse();

  return (
    <div className="grid gap-4">
      {response.derivar_cvv ? <CvvAlert /> : null}

      <MoodBanner
        mood={mood}
        content={{ [mood]: { title: t("title"), message: response.mensaje } }}
      />

      {response.accion_sugerida ? (
        <div className="rounded-xl border border-arena bg-crema p-4">
          <p className="text-sm font-medium text-cacao">
            {t("suggested_action")}
          </p>
          <p className="mt-1 text-sm text-cacao/90">
            {response.accion_sugerida}
          </p>
        </div>
      ) : null}

      <div className="grid gap-3">
        {empathic.data ? (
          <div className="rounded-xl border border-azul-horizonte/30 bg-azul-horizonte-soft p-4 text-azul-horizonte">
            <p className="text-sm leading-6">{empathic.data.response}</p>
          </div>
        ) : empathic.error ? (
          <ApiErrorState
            error={empathic.error}
            onRetry={() => empathic.mutate(response.checkinId)}
          />
        ) : (
          <Button
            type="button"
            variant="secondary"
            disabled={empathic.isPending}
            onClick={() => empathic.mutate(response.checkinId)}
            className="justify-self-start"
          >
            {empathic.isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {t("empathic_loading")}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" aria-hidden="true" />
                {t("empathic_cta")}
              </>
            )}
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          className="justify-self-start"
        >
          {t("new_checkin")}
        </Button>
      </div>
    </div>
  );
}
