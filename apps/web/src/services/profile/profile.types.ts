/**
 * Contratos del perfil del usuario autenticado.
 *
 * Fuente de verdad: OpenAPI del backend (`ProfileUpsertRequest` /
 * `ProfileResponse`). El `Profile` comparte PK con el `User`
 * (`profile.id == user.id`), por eso los endpoints operan sobre el usuario del
 * JWT y no llevan id en la ruta.
 */

export type Gender = "MASCULINE" | "FEMININE" | "OTHER";

export type Education =
  | "HIGH_SCHOOL"
  | "TECHNICAL"
  | "UNDERGRADUATE"
  | "POSTGRADUATE"
  | "SELF_TAUGHT";

export type ProfessionalLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type LocationDto = {
  continent?: string;
  country?: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
};

export type ContactDto = {
  /** Patrón backend: `^\+?[0-9]{7,15}$` (solo dígitos y `+` opcional). */
  whatsapp?: string;
};

/** Body de `PUT /api/v1/profile` (UPSERT). El back solo exige `name`. */
export type ProfileUpsertRequest = {
  name: string;
  birthDate?: string;
  gender?: Gender;
  education?: Education;
  professionalLevel?: ProfessionalLevel;
  techArea?: string;
  objective?: string;
  location?: LocationDto;
  contact?: ContactDto;
};

/** Respuesta de `GET`/`PUT /api/v1/profile`. */
export type ProfileResponse = ProfileUpsertRequest;
