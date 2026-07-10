import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CourseDetail } from "@/features/courses/components/course-detail";

export const metadata: Metadata = {
  title: "Detalle de formación",
  description: "Información ampliada del curso: nivel, contenido y skills que aporta.",
};

type CourseDetailPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { locale, id } = await params;

  setRequestLocale(locale);

  return <CourseDetail courseId={id} />;
}
