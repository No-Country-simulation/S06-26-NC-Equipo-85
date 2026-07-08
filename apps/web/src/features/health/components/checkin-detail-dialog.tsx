"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Spinner,
} from "@app/ui";
import { ApiErrorState } from "@/components/api-error-state";
import { useCheckin } from "../hooks/use-health";
import { emojiGlyph } from "../utils/mood";
import { CvvAlert } from "./cvv-alert";

type CheckinDetailDialogProps = {
  /** Id del check-in a mostrar; `null` mantiene el diálogo cerrado. */
  checkinId: string | null;
  onClose: () => void;
};

/**
 * Detalle de un check-in (`GET /api/v1/health/checkins/{id}`).
 *
 * Aunque el historial ya trae cada `CheckinDetail`, este diálogo consulta el
 * endpoint por id a propósito: es el único punto de la UI que lo ejercita.
 * Maneja los cuatro estados (cargando / error / no encontrado / con datos) y,
 * si el backend marca `derive_cvv`, antepone la {@link CvvAlert}.
 */
export function CheckinDetailDialog({
  checkinId,
  onClose,
}: CheckinDetailDialogProps) {
  const t = useTranslations("common.health.detail");
  const tHistory = useTranslations("common.health.history");
  const locale = useLocale();

  const { data: checkin, isPending, error, refetch } = useCheckin(checkinId);

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Dialog
      open={checkinId !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("card_title")}</DialogTitle>
          <DialogDescription>{t("subtitle")}</DialogDescription>
        </DialogHeader>

        {error ? (
          <ApiErrorState error={error} onRetry={() => refetch()} />
        ) : isPending ? (
          <div className="flex justify-center py-8">
            <Spinner label={t("loading")} />
          </div>
        ) : !checkin ? (
          <EmptyState
            title={t("not_found_title")}
            description={t("not_found_body")}
          />
        ) : (
          <div className="grid gap-4">
            {checkin.derive_cvv ? <CvvAlert /> : null}

            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="text-3xl leading-none">
                {emojiGlyph(checkin.emoji)}
              </span>
              <div className="grid gap-0.5">
                <span className="text-sm font-medium text-cacao">
                  {tHistory("rating", { value: checkin.rating })}
                </span>
                <time
                  dateTime={checkin.created_at}
                  className="text-xs text-muted-foreground"
                >
                  {dateFormatter.format(new Date(checkin.created_at))}
                </time>
              </div>
            </div>

            {checkin.context ? (
              <div className="grid gap-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("context_label")}
                </p>
                <p className="text-sm leading-6 text-cacao/90">
                  {checkin.context}
                </p>
              </div>
            ) : null}

            {checkin.suggested_action ? (
              <div className="rounded-xl border border-arena bg-crema p-4">
                <p className="text-sm font-medium text-cacao">
                  {t("suggested_action")}
                </p>
                <p className="mt-1 text-sm text-cacao/90">
                  {checkin.suggested_action}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
