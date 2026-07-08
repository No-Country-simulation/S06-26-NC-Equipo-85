"use client";

import { useLocale, useTranslations } from "next-intl";
import { EmptyState, Spinner } from "@app/ui";
import { ApiErrorState } from "@/components/api-error-state";
import { emojiGlyph } from "../utils/mood";
import type { CheckinDetail } from "@/services/health/health.types";

type CheckinHistoryProps = {
  checkins: CheckinDetail[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  /** Abre el detalle (`GET /api/v1/health/checkins/{id}`) del item elegido. */
  onSelect: (id: string) => void;
};

/**
 * Historial de check-ins del usuario.
 *
 * Maneja los cuatro estados (cargando / error / vacío / con datos) con los
 * mismos primitivos que el resto de las features. Renderiza el emoji del
 * backend con el glifo del picker para mantener coherencia visual. Cada item es
 * un botón que abre su detalle vía `onSelect`.
 */
export function CheckinHistory({
  checkins,
  isLoading,
  error,
  onRetry,
  onSelect,
}: CheckinHistoryProps) {
  const t = useTranslations("common.health.history");
  const locale = useLocale();

  if (error) {
    return <ApiErrorState error={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label={t("loading")} />
      </div>
    );
  }

  if (!checkins || checkins.length === 0) {
    return <EmptyState title={t("empty_title")} description={t("empty_body")} />;
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ul className="grid gap-3">
      {checkins.map((checkin) => (
        <li key={checkin.id}>
          <button
            type="button"
            onClick={() => onSelect(checkin.id)}
            aria-label={t("view_detail")}
            className="flex w-full items-start gap-3 rounded-xl border border-arena bg-crema/60 p-4 text-left transition-colors outline-none hover:bg-crema focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              {emojiGlyph(checkin.emoji)}
            </span>
            <div className="grid flex-1 gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-cacao">
                  {t("rating", { value: checkin.rating })}
                </span>
                <time
                  dateTime={checkin.created_at}
                  className="text-xs text-muted-foreground"
                >
                  {dateFormatter.format(new Date(checkin.created_at))}
                </time>
              </div>
              {checkin.context ? (
                <p className="text-sm text-cacao/90">{checkin.context}</p>
              ) : null}
              {checkin.suggested_action ? (
                <p className="text-sm text-muted-foreground">
                  {t("suggested_action", { action: checkin.suggested_action })}
                </p>
              ) : null}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
