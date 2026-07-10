import { useTranslations } from "next-intl";
import { AuthCard } from "./auth-card";
import { LoginForm } from "./login-form";

/**
 * Vista de login: shell `AuthCard` (panel de marca + formulario).
 * Server component; resuelve el copy del panel de marca por i18n.
 */
export function LoginView() {
  const t = useTranslations("common.auth.login");

  return (
    <AuthCard
      brand={{
        title: t("brand.title"),
        subtitle: t("brand.subtitle"),
      }}
    >
      <LoginForm />
    </AuthCard>
  );
}
