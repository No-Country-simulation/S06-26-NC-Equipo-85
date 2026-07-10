import { useTranslations } from "next-intl";
import { Button } from "@app/ui";
import { Link } from "@/i18n/navigation";

// TODO: si en el futuro la landing necesita ocultar "Ingresar/Crear cuenta"
// para usuarios ya autenticados, leer useUserStore().token
// (apps/web/src/store/user-store.ts) y redirigir a /dashboard.
export function LandingHeader() {
  const t = useTranslations("common.landing.header");

  return (
    <header className="flex items-center gap-3 py-6">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracota font-heading text-base font-bold text-white">
        B
      </div>
      <span className="font-heading text-lg font-semibold text-cacao">BiT</span>
      <div className="flex-1" />
      <Link href="/login">
        <Button variant="ghost">{t("login")}</Button>
      </Link>
      <Link href="/register">
        <Button>{t("register")}</Button>
      </Link>
    </header>
  );
}
