import { useTranslations } from "next-intl";
import { Button } from "@app/ui";
import { Link } from "@/i18n/navigation";

export function LandingHero() {
  const t = useTranslations("common.landing.hero");

  return (
    <section
      className="rounded-3xl px-7 py-12 text-center text-white sm:py-18"
      style={{
        background:
          "linear-gradient(150deg, var(--bit-terracota), var(--bit-coral) 70%, var(--bit-ambar))",
      }}
    >
      <span className="mb-5 inline-block rounded-full bg-white/18 px-3.5 py-1.5 text-xs font-bold">
        {t("badge")}
      </span>
      <h1 className="mx-auto mb-4.5 max-w-3xl font-heading text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
        {t("title")}
      </h1>
      <p className="mx-auto mb-7 max-w-xl text-base leading-relaxed opacity-92 sm:text-lg">
        {t("subtitle")}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/register">
          <Button size="lg" className="bg-white text-coral hover:bg-white/90">
            {t("ctaPrimary")}
          </Button>
        </Link>
        <Link href="/login">
          <Button
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/14 text-white hover:bg-white/20"
          >
            {t("ctaSecondary")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
