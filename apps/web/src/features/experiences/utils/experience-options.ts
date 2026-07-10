import type { ExperienceType } from "@/services/experiences/experiences.types";

/**
 * Tipos de experiencia disponibles (enum del backend). Data estática separada
 * de la presentación: el label se resuelve con i18n en el componente vía la
 * clave `common.experiences.types.<value>`.
 */
export const EXPERIENCE_TYPES: readonly ExperienceType[] = [
  "WORKSHOP",
  "BOOTCAMP",
  "WEBINAR",
  "JOB_EXPERIENCE",
] as const;

const EMBEDDABLE_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "vimeo.com",
  "www.vimeo.com",
];

/**
 * Determina si `content_url` apunta a un video embebible (YouTube/Vimeo, los
 * que soporta `react-player`). El contrato expone `content_url` genérico: puede
 * ser un video o un enlace externo, así que la UI decide entre reproducir o
 * linkear afuera (mismo criterio que `courses/utils/course-media.ts`).
 */
export function isEmbeddableVideoUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return EMBEDDABLE_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

/**
 * Convierte un ISO 8601 del backend al formato que espera un input
 * `datetime-local` (`YYYY-MM-DDTHH:mm`, en hora local). Devuelve `""` si la
 * fecha no es parseable, para no romper el form al prellenar en modo edición.
 */
export function isoToLocalInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/**
 * Convierte el valor de un input `datetime-local` (hora local) a ISO 8601 para
 * enviarlo al backend. Ante un valor inválido devuelve el string original.
 */
export function localInputToIso(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}
