import { useTranslations } from "next-intl";
import { Button } from "@app/ui";
import { Link } from "@/i18n/navigation";

export function LandingCta() {
  const t = useTranslations("common.landing.cta");

  return (
    <section className="my-14 text-center">
      <h2 className="mb-4.5 font-heading text-2xl font-semibold sm:text-3xl">
        {t("title")}
      </h2>
      <Link href="/register">
        <Button size="lg" className="bg-coral hover:bg-coral/90">
          {t("button")}
        </Button>
      </Link>
    </section>
  );
}
