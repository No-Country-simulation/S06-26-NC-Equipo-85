"use client";

import { useTranslations } from "next-intl";
import { LifeBuoy } from "lucide-react";

/**
 * Alerta de derivación a la línea de ayuda (CVV).
 *
 * Se muestra cuando el backend marca `derivar_cvv`/`derive_cvv`. Es el único
 * flujo donde la paleta usa `granate` (regla de CLAUDE.md): comunica una
 * situación crítica sin alarmar de más. El número de la línea vive en i18n
 * porque difiere por región (AR/BR).
 */
export function CvvAlert() {
  const t = useTranslations("common.health.cvv");

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-granate/40 bg-granate-soft p-4 text-granate"
    >
      <LifeBuoy className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="grid gap-1">
        <p className="font-heading text-base font-medium">{t("title")}</p>
        <p className="text-sm opacity-90">{t("body")}</p>
        <p className="mt-1 text-sm font-semibold">{t("line")}</p>
      </div>
    </div>
  );
}
