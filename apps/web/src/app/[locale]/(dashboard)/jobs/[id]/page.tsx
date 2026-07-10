import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JobDetailView } from "@/features/jobs/components/job-detail-view";

export const metadata: Metadata = {
  title: "Detalle de vacante",
  description: "Información ampliada de la vacante: match, descripción y skills requeridas.",
};

type JobDetailPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { locale, id } = await params;

  setRequestLocale(locale);

  return <JobDetailView jobId={id} />;
}
