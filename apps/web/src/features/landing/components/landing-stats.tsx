import { useTranslations } from "next-intl";
import { LANDING_STATS } from "../utils/landing-content";

export function LandingStats() {
  const t = useTranslations("common.landing.stats");

  return (
    <section className="mt-14 rounded-3xl bg-arena p-7 sm:p-11">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {LANDING_STATS.map((stat) => (
          <div key={stat.labelKey} className="text-center">
            <div className="font-heading text-3xl font-semibold text-terracota sm:text-4xl">
              {stat.value}
            </div>
            <div className="text-xs font-semibold text-muted-foreground">
              {t(stat.labelKey)}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-white p-6 text-center">
        <p className="mb-4 font-heading text-lg italic leading-relaxed sm:text-xl">
          &ldquo;{t("testimonial.quote")}&rdquo;
        </p>
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ambar text-sm font-semibold text-cacao">
            CR
          </div>
          <div className="text-left">
            <div className="text-sm font-bold">{t("testimonial.name")}</div>
            <div className="text-xs text-muted-foreground">
              {t("testimonial.meta")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
