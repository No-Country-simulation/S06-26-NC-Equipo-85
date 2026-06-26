"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button, Input, Label, Spinner } from "@app/ui";
import { Link, useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api";
import {
  getProfile,
  PROFILE_QUERY_KEY,
} from "@/services/profile/profile.service";
import { useUserStore } from "@/store/user-store";
import { useLogin } from "../hooks/use-login";
import { LOGIN_DEFAULT_VALUES, loginSchema } from "../schemas/auth.schema";
import type { LoginFormValues } from "../types/auth.types";

/**
 * Mapea el error de la API a una clave de traducción bajo
 * `common.auth.login.*`. El back devuelve 401 en credenciales inválidas y 429
 * por rate-limit (Bucket4j); el resto cae en el mensaje genérico.
 */
function getErrorKey(
  error: unknown,
): "errorInvalid" | "errorRateLimit" | "errorGeneric" {
  if (error instanceof ApiError) {
    if (error.status === 401) return "errorInvalid";
    if (error.status === 429) return "errorRateLimit";
  }

  return "errorGeneric";
}

/**
 * Formulario de login.
 *
 * Valida con Zod (loginSchema), autentica vía `useLogin`
 * (`POST /api/v1/auth/login`), guarda el token y deriva según el estado del
 * perfil.
 */
export function LoginForm() {
  const t = useTranslations("common.auth.login");
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useUserStore((state) => state.setSession);
  const setProfile = useUserStore((state) => state.setProfile);
  const updateDraftData = useUserStore((state) => state.updateDraftData);
  const isOnboardingCompleted = useUserStore(
    (state) => state.isOnboardingCompleted,
  );
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

      setSession({ token: result.token, refreshToken: result.refreshToken });

      // Disponible para el onboarding si el perfil está incompleto (el email
      // no se vuelve a pedir). Ver onboarding-wizard → getSessionEmail.
      updateDraftData({ email: values.email });

      toast.success(t("successTitle"), {
        description:
          result.source === "mock" ? t("successMock") : t("successApi"),
      });

      // El perfil del back decide el redirect: si existe (GET 200) el onboarding
      // ya se completó → dashboard; si no (404 → null) → onboarding. Si la
      // consulta falla, se cae al flag local del store.
      let hasProfile = isOnboardingCompleted;

      try {
        const profile = await queryClient.fetchQuery({
          queryKey: PROFILE_QUERY_KEY,
          queryFn: getProfile,
        });

        if (profile) {
          // El backend usa `user.id` como PK del perfil, que el front no
          // decodifica del JWT; el email identifica al usuario en el store
          // (mismo criterio que el onboarding → completeOnboarding). Esto deja
          // el nombre/área disponibles para el dashboard (sidebar).
          setProfile({
            id: values.email,
            name: profile.name,
            email: values.email,
            area: profile.techArea,
          });
        }

        hasProfile = Boolean(profile);
      } catch {
        // Se mantiene el fallback local (hasProfile = isOnboardingCompleted).
      }

      router.push(hasProfile ? "/dashboard" : "/onboarding");
    } catch (error) {
      toast.error(t("errorTitle"), { description: t(getErrorKey(error)) });
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
