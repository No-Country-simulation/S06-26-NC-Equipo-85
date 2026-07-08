/**
 * Contratos del módulo de experiencias — `/api/v1/experiences` 🔒.
 *
 * Fuente de verdad: OpenAPI (`App BiT API v1`). El contrato mezcla camelCase y
 * snake_case de forma inconsistente y se respeta **tal cual** lo devuelve el
 * backend (no se renombra): el listado usa `mentorProfileId` pero el detalle
 * `mentor_profile_id`; ambos usan `speaker_name`, `speaker_role`, `date_time`,
 * `content_url`. El body de create/update, en cambio, es camelCase
 * (`speakerRole`, `contentUrl`, `dateTime`, `skillIds`).
 */

export type ExperienceType =
  | "WORKSHOP"
  | "BOOTCAMP"
  | "WEBINAR"
  | "JOB_EXPERIENCE";

/** Skill embebida en el detalle (forma reducida `{ id, name }`). */
export type ExperienceSkill = {
  id: string;
  name: string;
};

/**
 * Elemento del listado (`GET /api/v1/experiences`).
 *
 * Más liviano que el detalle: sin `description`, `skills` ni `owner`.
 */
export type ExperienceListItem = {
  id: string;
  mentorProfileId: string;
  title: string;
  type: ExperienceType;
  createdAt: string;
  updatedAt: string;
  speaker_name: string;
  speaker_role: string;
  /** ISO 8601 de la fecha/hora de la experiencia. */
  date_time: string;
  content_url: string;
};

/**
 * Detalle (`GET /api/v1/experiences/{id}`) y respuesta de create/update.
 *
 * `owner` indica si el usuario autenticado es el mentor dueño → habilita las
 * acciones de editar/borrar en la UI.
 */
export type ExperienceDetail = {
  id: string;
  title: string;
  owner: boolean;
  description: string;
  type: ExperienceType;
  skills: ExperienceSkill[];
  createdAt: string;
  updatedAt: string;
  mentor_profile_id: string;
  speaker_name: string;
  speaker_role: string;
  content_url: string;
  date_time: string;
};

/**
 * Body de `POST /api/v1/experiences` y `PUT /api/v1/experiences/{id}`.
 *
 * No incluye `speakerName`: el backend lo deriva del perfil del mentor. Las
 * claves van en camelCase (a diferencia de la respuesta).
 */
export type ExperienceUpsertRequest = {
  title: string;
  description: string;
  speakerRole: string;
  type: ExperienceType;
  contentUrl: string;
  /** ISO 8601. */
  dateTime: string;
  skillIds: string[];
};

/** Filtros opcionales del listado (query params). */
export type ExperienceFilters = {
  skillId?: string;
  type?: ExperienceType;
};
