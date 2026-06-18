import { useTranslations } from "next-intl";
import { cn } from "@app/ui";
import type { Locale } from "@/i18n/routing";

type LandingFooterProps = {
  locale: Locale;
};

// TODO: links de Privacidad/Términos/Contacto sin rutas definidas aún en el
// plan de fases; dejar como <span> hasta que existan /privacidad, /terminos,
// /contacto.
export function LandingFooter({ locale }: LandingFooterProps) {
  const t = useTranslations("common.landing.footer");

  return (
    <footer className="flex flex-wrap items-center gap-6 border-t border-arena py-8">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-terracota font-heading text-sm font-bold text-white">
          B
        </div>
        <div>
          <div className="font-heading text-sm font-semibold">BiT</div>
          <div className="text-[11px] text-muted-foreground">
            {t("copyright")}
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex gap-5 text-sm text-muted-foreground">
        <span>{t("privacy")}</span>
        <span>{t("terms")}</span>
        <span>{t("contact")}</span>
      </div>
      {/* TODO: integrar con un LocaleSwitcher reutilizable (no existe aún en
      la app); este toggle ES/PT hoy es solo visual y refleja el locale
      activo vía la ruta `/[locale]`, sin cambiar de idioma al hacer click. */}
      <div className="flex overflow-hidden rounded-full border border-arena text-xs font-semibold">
        <span className={cn("px-2.5 py-1", locale === "es" && "bg-arena")}>
          ES
        </span>
        <span className={cn("px-2.5 py-1", locale === "pt" && "bg-arena")}>
          PT
        </span>
      </div>
    </footer>
  );
}
