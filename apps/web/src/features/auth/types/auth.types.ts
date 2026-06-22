import type { z } from "zod";
import type { loginSchema } from "../schemas/auth.schema";

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Valores del formulario de registro.
 *
 * `acceptTerms` es `boolean` en el form (arranca sin marcar); el `registerSchema`
 * exige `true` al enviar. Se define explícito en vez de `z.infer` para evitar
 * la fricción del refine booleano con los `defaultValues` de React Hook Form.
 */
export type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

/** Nivel de fuerza de contraseña calculado en `utils/password-strength`. */
export type PasswordStrength = {
  /** 0 = vacío, 1 = débil, 2 = media, 3 = fuerte. */
  score: 0 | 1 | 2 | 3;
  /** Clave de traducción del label bajo `common.auth.register.strength.*`. */
  labelKey: "weak" | "medium" | "strong";
};
