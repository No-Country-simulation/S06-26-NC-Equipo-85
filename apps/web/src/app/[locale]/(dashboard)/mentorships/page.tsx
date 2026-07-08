import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { MentoriasPage } from "@/features/mentorias/components/mentorias-page";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <MentoriasPage />
    </Suspense>
  );
}