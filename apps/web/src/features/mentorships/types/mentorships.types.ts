import type { z } from "zod";
import type { sessionSchema } from "../schemas/session.schema";

/** Valores del formulario de crear sesión (inferidos del schema). */
export type SessionFormValues = z.infer<typeof sessionSchema>;
