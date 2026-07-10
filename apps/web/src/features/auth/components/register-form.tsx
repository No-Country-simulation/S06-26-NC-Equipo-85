"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button, Checkbox, Input, Label, Spinner } from "@app/ui";
import { Link, useRouter } from "@/i18n/navigation";
import { useUserStore } from "@/store/user-store";
import { useRegister } from "../hooks/use-register";
import {
  REGISTER_DEFAULT_VALUES,
  registerSchema,
} from "../schemas/auth.schema";
import type { RegisterFormValues } from "../types/auth.types";
import { PasswordStrengthMeter } from "./password-strength-meter";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado al crear la cuenta.";
}

/**
 * Formulario de registro.
 *
 * Valida con Zod (registerSchema), crea la cuenta vía `useRegister`
 * (`POST /api/v1/auth/register`, que ya devuelve el JWT), guarda el token y
 * deriva al onboarding.
 */
export function RegisterForm() {
  const t = useTranslations("common.auth.register");
  const router = useRouter();
  const setSession = useUserStore((state) => state.setSession);
  const updateDraftData = useUserStore((state) => state.updateDraftData);
  const registerMutation = useRegister();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: REGISTER_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const isSubmitting = registerMutation.isPending;

  async function onSubmit(values: RegisterFormValues) {
    try {
      const result = await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      setSession({ token: result.token, refreshToken: result.refreshToken });

      // El email no se vuelve a pedir en el onboarding: se guarda en el draft
      // para que el wizard lo tenga disponible (ver getSessionEmail).
      updateDraftData({ email: values.email });

      // Registro → siempre onboarding: el Profile recién creado está incompleto.
      toast.success(t("successTitle"), { description: t("successApi") });

      router.push("/onboarding");
    } catch (error) {
      // TODO: el back devuelve 409 si el email ya existe (ApiError.status).
      // Mapear a un error inline en el campo email en vez de toast genérico.
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
          <Label htmlFor="register-email">{t("emailLabel")}</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="register-password">{t("passwordLabel")}</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="register-confirm">{t("confirmLabel")}</Label>
          <Input
            id="register-confirm"
            type="password"
            autoComplete="new-password"
            placeholder={t("confirmPlaceholder")}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="grid gap-1.5">
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field }) => (
              <Label
                htmlFor="register-terms"
                className="items-start text-[13px] font-normal leading-snug text-muted-foreground"
              >
                <Checkbox
                  id="register-terms"
                  className="mt-0.5"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={Boolean(errors.acceptTerms) || undefined}
                />
                {/* TODO: links reales a /terminos y /privacidad cuando existan
                esas rutas (mismo pendiente que el footer del landing). */}
                <span>
                  {t.rich("terms", {
                    terms: (chunks) => (
                      <b className="font-semibold text-terracota">{chunks}</b>
                    ),
                  })}
                </span>
              </Label>
            )}
          />
          {errors.acceptTerms ? (
            <p className="text-xs font-medium text-destructive">
              {errors.acceptTerms.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-1 h-11">
          {isSubmitting ? <Spinner size="sm" /> : null}
          {t("submit")}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-semibold text-terracota">
          {t("loginLink")}
        </Link>
      </p>
    </div>
  );
}
