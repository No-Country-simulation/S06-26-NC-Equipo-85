import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresá tu correo electrónico.")
    .email("Ingresá un correo válido."),
  password: z.string().min(1, "Ingresá tu contraseña."),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Ingresá tu correo electrónico.")
      .email("Ingresá un correo válido."),
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        "La contraseña debe tener al menos 8 caracteres.",
      ),
    confirmPassword: z.string().min(1, "Repetí la contraseña."),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "Necesitás aceptar los términos para continuar.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const LOGIN_DEFAULT_VALUES = {
  email: "",
  password: "",
} satisfies z.infer<typeof loginSchema>;

export const REGISTER_DEFAULT_VALUES = {
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};
