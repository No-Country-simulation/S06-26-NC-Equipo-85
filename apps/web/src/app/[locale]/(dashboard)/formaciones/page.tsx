import { setRequestLocale } from "next-intl/server";
import { CoursesPage } from "@/features/formaciones/components/courses-page";

export default async function FormacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CoursesPage />;
}