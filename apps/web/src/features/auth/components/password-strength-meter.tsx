"use client";

import { useTranslations } from "next-intl";
import { cn } from "@app/ui";
import { getPasswordStrength } from "../utils/password-strength";

type PasswordStrengthMeterProps = {
  password: string;
};

const BAR_BY_SCORE: Record<number, string> = {
  1: "w-1/3 bg-coral",
  2: "w-2/3 bg-ambar",
  3: "w-full bg-oliva",
};

const TEXT_BY_SCORE: Record<number, string> = {
  1: "text-coral",
  2: "text-cacao",
  3: "text-oliva",
};

/**
 * Medidor visual de fuerza de contraseña (solo se muestra con contenido).
 * La lógica de scoring vive en `utils/password-strength`.
 */
export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const t = useTranslations("common.auth.register.strength");

  if (!password) {
    return null;
  }

  const { score, labelKey } = getPasswordStrength(password);

  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-arena">
        <div
          className={cn("h-full rounded-full transition-all", BAR_BY_SCORE[score])}
        />
      </div>
      <span className={cn("text-xs font-semibold", TEXT_BY_SCORE[score])}>
        {t(labelKey)}
      </span>
    </div>
  );
}
