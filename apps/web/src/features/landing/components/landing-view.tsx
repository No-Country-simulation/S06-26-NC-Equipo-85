import type { Locale } from "@/i18n/routing";
import { LandingCta } from "./landing-cta";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { LandingServices } from "./landing-services";
import { LandingStats } from "./landing-stats";

type LandingViewProps = {
  locale: Locale;
};

/**
 * Vista pública del landing (Hero B).
 *
 * Componente server-first que compone las secciones de la página. Toda la
 * interactividad se delega a `<Link>`/`<Button>`; no requiere estado cliente.
 */
export function LandingView({ locale }: LandingViewProps) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6">
      <LandingHeader />
      <LandingHero />
      <LandingServices />
      <LandingStats />
      <LandingCta />
      <LandingFooter locale={locale} />
    </main>
  );
}
