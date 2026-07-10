"use client";

import { useTranslations } from "next-intl";
import { Button, CourseCard, Spinner } from "@app/ui";
import type { Course } from "@/services/courses/courses.types";
import { Link } from "@/i18n/navigation";

type CoursesGridProps = {
  courses: Course[];
  isLoading?: boolean;
};

/** `CourseCard` de `@app/ui` es agnóstica de Next: usa su propio enum en español. */
const LEVEL_TO_UI_LEVEL: Record<Course["level"], "principiante" | "intermedio" | "avanzado"> = {
  BEGINNER: "principiante",
  INTERMEDIATE: "intermedio",
  ADVANCED: "avanzado",
};

export function CoursesGrid({ courses, isLoading }: CoursesGridProps) {
  const t = useTranslations("common.courses");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={{
            id: course.id,
            title: course.name,
            provider: course.provider,
            level: LEVEL_TO_UI_LEVEL[course.level],
          }}
          action={
            <Button variant="secondary" asChild>
              <Link href={`/courses/${course.id}`}>{t("see_detail")}</Link>
            </Button>
          }
        />
      ))}
    </div>
  );
}
