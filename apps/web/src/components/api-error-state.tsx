"use client";

import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { cn } from "@app/ui";
import { ApiError } from "@/lib/api";

type ApiErrorStateProps = {
  /** Error capturado por TanStack Query (`useQuery`/`useMutation`). */
  error: unknown;
  /** Reintenta la operación fallida (`refetch` o `mutate` de nuevo). */
  onRetry: () => void;
  className?: string;
};

/**
 * Estado de error compartido para queries/mutations contra la API.
 *
 * Distingue el 408 por cold start de Render (el back duerme en el plan free)
 * de cualquier otro error, mostrando en ambos casos un mensaje traducido con
 * botón de reintento accesible (`aria-describedby`). Patrón único reutilizado
 * por jobs, courses y orientación en vez de duplicar el JSX de error en cada
 * página.
 */
export function ApiErrorState({ error, onRetry, className }: ApiErrorStateProps) {
  const t = useTranslations("common.errors");
  const isColdStart = error instanceof ApiError && error.status === 408;
  const message = isColdStart ? t("cold_start") : t("something_went_wrong");
  const messageId = "api-error-message";

  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-4 py-16 text-center", className)}
    >
      <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
      <p id={messageId} className="text-sm text-muted-foreground">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        aria-describedby={messageId}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("retry")}
      </button>
    </div>
  );
}
