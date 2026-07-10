import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HealthPage as HealthView } from "@/features/health/components/health-page";

export const metadata: Metadata = {
  title: "Salud mental",
  description:
    "Check-in emocional diario con acompañamiento empático y seguimiento de tu bienestar.",
};

type HealthPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HealthPage({ params }: HealthPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HealthView />;
}
