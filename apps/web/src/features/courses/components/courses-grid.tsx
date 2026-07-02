"use client";

import { useTranslations } from "next-intl";
import { Button, CourseCard, Spinner } from "@app/ui";
import type { Course } from "@/services/courses/courses.types";
import { isEmbeddableVideoUrl } from "../utils/course-media";

type CoursesGridProps = {
  courses: Course[];
  isLoading?: boolean;
  onSelect?: (course: Course) => void;
};

/** `CourseCard` de `@app/ui` es agnóstica de Next: usa su propio enum en español. */
const LEVEL_TO_UI_LEVEL: Record<Course["level"], "principiante" | "intermedio" | "avanzado"> = {
  BEGINNER: "principiante",
  INTERMEDIATE: "intermedio",
  ADVANCED: "avanzado",
};

export function CoursesGrid({ courses, isLoading, onSelect }: CoursesGridProps) {
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
      {courses.map((course) => {
        const embeddable = isEmbeddableVideoUrl(course.url);

        return (
          <CourseCard
            key={course.id}
            course={{
              id: course.id,
              title: course.name,
              provider: course.provider,
              level: LEVEL_TO_UI_LEVEL[course.level],
            }}
            action={
              embeddable ? (
                <Button variant="secondary" onClick={() => onSelect?.(course)}>
                  {t("watch_video")}
                </Button>
              ) : (
                <Button variant="secondary" asChild>
                  <a href={course.url} target="_blank" rel="noopener noreferrer">
                    {t("see_course")}
                  </a>
                </Button>
              )
            }
          />
        );
      })}
    </div>
  );
}
