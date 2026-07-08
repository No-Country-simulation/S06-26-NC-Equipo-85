import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MentorshipsPage } from "@/features/mentorships/components/mentorships-page";

export const metadata: Metadata = {
  title: "Mentorías",
  description:
    "Agendá prácticas con mentores reales y ganá confianza antes de postularte.",
};

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <MentorshipsPage />
    </Suspense>
  );
}
