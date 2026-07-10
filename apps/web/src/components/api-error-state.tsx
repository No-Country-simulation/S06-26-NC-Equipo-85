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
 * Detecta un error de límite de tasa ("demasiadas solicitudes").
 *
 * Cubre dos formas: un 429 directo (rate-limit propio del backend, p. ej.
 * Bucket4j) y el caso del proveedor de IA (Gemini) que el backend envuelve en
 * un 500 con el mensaje crudo `"429 Too Many Requests from POST https://…"`.
 * En ambos mostramos un texto amable en vez de filtrar la URL interna de Gemini.
 */
function isRateLimitError(apiError: ApiError | null): boolean {
  if (!apiError) {
    return false;
  }

  if (apiError.status === 429) {
    return true;
  }

  return (
    typeof apiError.backendMessage === "string" &&
    /\b429\b|too many requests/i.test(apiError.backendMessage)
  );
}

/**
 * Estado de error compartido para queries/mutations contra la API.
 *
 * Renderiza el cuerpo de error estándar del backend
 * (`{ status, message, fieldErrors[] }`): el 408 por cold start de Render se
 * traduce; un rate-limit (429 propio o Gemini envuelto en 500) muestra un texto
 * amable sin filtrar internals; el resto muestra el `message` del backend
 * (fallback a texto genérico), y un 400 con `fieldErrors` lista cada campo.
 * Mensaje y reintento accesibles (`role="alert"`, `aria-describedby`). Patrón
 * único reutilizado por jobs, courses, orientación y salud.
 */
export function ApiErrorState({ error, onRetry, className }: ApiErrorStateProps) {
  const t = useTranslations("common.errors");
  const apiError = error instanceof ApiError ? error : null;
  const isColdStart = apiError?.status === 408;
  const isRateLimit = isRateLimitError(apiError);
  const fieldErrors = apiError?.fieldErrors;
  const messageId = "api-error-message";

  const message = isColdStart
    ? t("cold_start")
    : isRateLimit
      ? t("rate_limit")
      : (apiError?.backendMessage ?? t("something_went_wrong"));

  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center gap-4 py-16 text-center", className)}
    >
      <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
      <p id={messageId} className="text-sm text-muted-foreground">
        {message}
      </p>

      {fieldErrors && fieldErrors.length > 0 ? (
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{t("field_errors_title")}</p>
          <ul className="mt-1 space-y-1">
            {fieldErrors.map((fieldError) => (
              <li key={fieldError.field || fieldError.message}>
                {fieldError.field ? (
                  <span className="font-medium">{fieldError.field}: </span>
                ) : null}
                {fieldError.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
