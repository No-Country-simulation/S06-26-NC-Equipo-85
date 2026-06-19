import type { LucideIcon } from "lucide-react";
import type { ServiceCardAccent } from "@app/ui";

/**
 * Clave de cada servicio. Coincide con la subkey de traducción bajo
 * `common.landing.services.*` (title + description).
 */
export type LandingServiceKey =
  | "formaciones"
  | "empleabilidad"
  | "experiencias"
  | "mentorias"
  | "salud";

/**
 * Definición estática de un servicio del landing. No incluye texto: el copy
 * vive en i18n y se resuelve por `key`. El `accent` mapea al color del módulo
 * destino según el design system "Amanecer".
 */
export type LandingService = {
  key: LandingServiceKey;
  icon: LucideIcon;
  accent: ServiceCardAccent;
};

/**
 * Métrica de prueba social. `labelKey` apunta a `common.landing.stats.*`;
 * el `value` es copy estático del mockup (ver TODO en landing-content).
 */
export type LandingStat = {
  value: string;
  labelKey: string;
};
