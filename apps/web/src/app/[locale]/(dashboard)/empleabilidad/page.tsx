import { setRequestLocale } from "next-intl/server";
import { JobsPage } from "@/features/empleabilidad/components/jobs-page";

export default async function EmpleabilidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <JobsPage />;
}