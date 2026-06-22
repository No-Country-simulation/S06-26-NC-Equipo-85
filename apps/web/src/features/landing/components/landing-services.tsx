import { useTranslations } from "next-intl";
import { ServiceCard } from "@app/ui";
import { LANDING_SERVICES } from "../utils/landing-content";

export function LandingServices() {
  const t = useTranslations("common.landing.services");

  return (
    <section className="mt-14">
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-heading text-2xl font-semibold sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto max-w-lg text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {LANDING_SERVICES.map((service) => {
          const Icon = service.icon;

          return (
            <ServiceCard
              key={service.key}
              icon={<Icon size={24} />}
              title={t(`${service.key}.title`)}
              description={t(`${service.key}.description`)}
              accentColor={service.accent}
            />
          );
        })}
      </div>
    </section>
  );
}
