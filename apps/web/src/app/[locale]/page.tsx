import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { LandingView } from "@/features/landing/components/landing-view";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LandingView locale={locale} />;
}