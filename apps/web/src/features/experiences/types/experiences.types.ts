import type { z } from "zod";
import type { experienceSchema } from "../schemas/experience.schema";

/** Valores del formulario de crear/editar experiencia (inferidos del schema). */
export type ExperienceFormValues = z.infer<typeof experienceSchema>;
