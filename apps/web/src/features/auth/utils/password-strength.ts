import type { PasswordStrength } from "../types/auth.types";

const MIN_LENGTH = 8;

/**
 * Calcula la fuerza de una contraseña con heurística simple (solo orientativa
 * para la UI; la validación dura vive en `registerSchema`).
 *
 * Suma señales: longitud mínima, mezcla de mayúsculas/minúsculas, y dígitos o
 * símbolos. El resultado se mapea a 3 niveles con su clave de traducción.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, labelKey: "weak" };
  }

  let signals = 0;

  if (password.length >= MIN_LENGTH) signals += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) signals += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) signals += 1;

  if (signals >= 3) {
    return { score: 3, labelKey: "strong" };
  }

  if (signals === 2) {
    return { score: 2, labelKey: "medium" };
  }

  return { score: 1, labelKey: "weak" };
}
