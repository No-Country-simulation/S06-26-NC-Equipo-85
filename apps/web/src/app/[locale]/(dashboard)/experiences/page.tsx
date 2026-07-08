import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ExperiencesPage } from "@/features/experiences/components/experiences-page";

export const metadata: Metadata = {
  title: "Experiencias",
  description:
    "Charlas, workshops y experiencias de mentores para acompañar tu camino en tecnología.",
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <ExperiencesPage />
    </Suspense>
  );
}
