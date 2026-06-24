import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CoursesPage as CoursesView } from "@/features/formaciones/components/courses-page";

export const metadata: Metadata = {
  title: "Formaciones",
  description:
    "Cursos gratuitos y rutas sugeridas para cerrar tus brechas de skills.",
};

type CoursesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CoursesPage({ params }: CoursesPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return <CoursesView />;
}
