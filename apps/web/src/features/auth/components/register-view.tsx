import { useTranslations } from "next-intl";
import { AuthCard } from "./auth-card";
import { RegisterForm } from "./register-form";

/**
 * Vista de registro: shell `AuthCard` (panel de marca + formulario).
 * Server component; resuelve el copy del panel de marca por i18n.
 */
export function RegisterView() {
  const t = useTranslations("common.auth.register");

  return (
    <AuthCard
      brand={{
        title: t("brand.title"),
        bullets: [t("brand.bullet1"), t("brand.bullet2"), t("brand.bullet3")],
      }}
    >
      <RegisterForm />
    </AuthCard>
  );
}
