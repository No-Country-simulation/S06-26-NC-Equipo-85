import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@app/ui";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

const MODULES = [
  "courses",
  "jobs",
  "experiences",
  "mentorship",
  "wellness",
] as const;

function DashboardGrid() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-semibold text-foreground">
          {t("nav.dashboard")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Resumen inicial del perfil y módulos principales del MVP.
        </p>
      </div>

      <DashboardOverview />

      <section aria-labelledby="dashboard-modules-title" className="space-y-4">
        <h3
          id="dashboard-modules-title"
          className="text-xl font-semibold text-foreground"
        >
          Servicios disponibles
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((mod) => (
            <Card key={mod}>
              <CardHeader>
                <CardTitle className="text-lg">{t(`nav.${mod}`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Placeholder</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <DashboardGrid />;
}