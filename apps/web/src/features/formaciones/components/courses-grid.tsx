"use client";

import { CourseCard } from "@app/ui";
import type { Course } from "@/services/courses/courses.types";
import { Spinner } from "@app/ui";

type CoursesGridProps = {
  courses: Course[];
  isLoading?: boolean;
  onSelect?: (course: Course) => void;
};

export function CoursesGrid({ courses, isLoading, onSelect }: CoursesGridProps) {
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
            title: course.title,
            provider: course.provider,
            level: course.level,
          }}
          ctaLabel={course.videoUrl ? "Ver video" : "Ver curso"}
          onAction={() => onSelect?.(course)}
        />
      ))}
    </div>
  );
}