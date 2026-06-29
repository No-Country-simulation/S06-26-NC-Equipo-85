import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JobsPage as JobsView } from "@/features/jobs/components/jobs-page";

export const metadata: Metadata = {
  title: "Empleabilidad",
  description: "Vacantes compatibles ordenadas por match con tu perfil actual.",
};

type JobsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function JobsPage({ params }: JobsPageProps) {
  const { locale } = await params;
  // test deploy temp.
  setRequestLocale(locale);

  return <JobsView />;
}
