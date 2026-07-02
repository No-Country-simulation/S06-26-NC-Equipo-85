"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useCourses } from "../hooks/use-courses";
import { CoursesToolbar } from "./courses-toolbar";
import { CoursesGrid } from "./courses-grid";
import { CoursesTable } from "./courses-table";
import { CourseVideoDialog } from "./course-video-dialog";
import { filterCourses, getAvailableProviders } from "../utils/course-filters";
import { isEmbeddableVideoUrl } from "../utils/course-media";
import { ApiErrorState } from "@/components/api-error-state";
import { EmptyState } from "@app/ui";
import type { Course, CourseLevel } from "@/services/courses/courses.types";
import type { SkillCategory } from "@/services/skills/skills.types";

export function CoursesPage() {
  const t = useTranslations("common.courses");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const { data: courses, isLoading, error, refetch } = useCourses();

  const [provider] = useQueryState("provider");
  const [level] = useQueryState("level");
  const [skillCategory] = useQueryState("skillCategory");

  const providers = useMemo(
    () => getAvailableProviders(courses ?? []),
    [courses],
  );

  const filteredCourses = useMemo(
    () =>
      filterCourses(courses ?? [], {
        provider: provider ?? undefined,
        level: (level as CourseLevel | null) ?? undefined,
        skillCategory: (skillCategory as SkillCategory | null) ?? undefined,
      }),
    [courses, provider, level, skillCategory],
  );

  function handleSelect(course: Course) {
    if (isEmbeddableVideoUrl(course.url)) {
      setSelectedCourse(course);
      setVideoOpen(true);
      return;
    }

    if (typeof window !== "undefined") {
      window.open(course.url, "_blank", "noopener,noreferrer");
    }
  }

  if (error) {
    return <ApiErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <CoursesToolbar view={view} onViewChange={setView} providers={providers} />

      {view === "grid" ? (
        <CoursesGrid courses={filteredCourses} isLoading={isLoading} onSelect={handleSelect} />
      ) : (
        <CoursesTable courses={filteredCourses} isLoading={isLoading} onSelect={handleSelect} />
      )}

      {!isLoading && filteredCourses.length === 0 && (
        <EmptyState title={t("no_results")} />
      )}

      <CourseVideoDialog
        course={selectedCourse}
        open={videoOpen}
        onOpenChange={setVideoOpen}
      />
    </div>
  );
}
