"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button, Input, Label, Spinner } from "@app/ui";
import { Link, useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/store/user-store";
import { useLogin } from "../hooks/use-login";
import { LOGIN_DEFAULT_VALUES, loginSchema } from "../schemas/auth.schema";
import type { LoginFormValues } from "../types/auth.types";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado al iniciar sesión.";
}

/**
 * Formulario de login.
 *
 * Valida con Zod (loginSchema), autentica vía `useLogin` (`POST /auth/login`),
 * guarda el token y deriva según el estado del perfil.
 */
export function LoginForm() {
  const t = useTranslations("common.auth.login");
  const router = useRouter();
  const setToken = useUserStore((state) => state.setToken);
  const updateDraftData = useUserStore((state) => state.updateDraftData);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const isSubmitting = loginMutation.isPending;

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await loginMutation.mutateAsync(values);

      setToken(result.token);

      // Disponible para el onboarding si el perfil está incompleto (el email
      // no se vuelve a pedir). Ver onboarding-wizard → getSessionEmail.
      updateDraftData({ email: values.email });

      toast.success(t("successTitle"), {
        description:
          result.source === "mock" ? t("successMock") : t("successApi"),
      });

      // Perfil incompleto → onboarding; completo → dashboard. La fuente de
      // verdad es `profileCompleted` de la API (hoy mock); ver auth.types.
      router.push(result.profileCompleted ? "/dashboard" : "/onboarding");
    } catch (error) {
      // TODO: el back aplica rate-limit (Bucket4j) → HTTP 429 en ApiError.status.
      // Mapear a un mensaje "demasiados intentos" diferenciado del de credenciales.
      toast.error(t("errorTitle"), { description: getErrorMessage(error) });
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-cacao">
        {t("title")}
      </h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>

      <form
        className="flex flex-col gap-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-1.5">
          <Label htmlFor="login-email">{t("emailLabel")}</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">{t("passwordLabel")}</Label>
            {/* TODO: ruta /recuperar-contrasena (POST /auth/forgot) no definida
            aún en el plan de fases; dejar como botón inerte por ahora. */}
            <button
              type="button"
              className="text-xs font-semibold text-terracota"
            >
              {t("forgot")}
            </button>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-1 h-11">
          {isSubmitting ? <Spinner size="sm" /> : null}
          {t("submit")}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-semibold text-terracota">
          {t("registerLink")}
        </Link>
      </p>
    </div>
  );
}
