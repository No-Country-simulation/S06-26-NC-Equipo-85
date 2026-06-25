"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCourses } from "../hooks/use-courses";
import { CoursesToolbar } from "./courses-toolbar";
import { CoursesGrid } from "./courses-grid";
import { CoursesTable } from "./courses-table";
import { CourseVideoDialog } from "./course-video-dialog";
import { EmptyState } from "@/features/shared/components/empty-state";
import { AlertCircle } from "lucide-react";
import type { Course } from "@/services/courses/courses.types";

export function CoursesPage() {
  const t = useTranslations("common.courses");
  const [view, setView] = useState<"grid" | "table">("grid");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const { data: courses, isLoading, error, refetch } = useCourses();

  function handleSelect(course: Course) {
    setSelectedCourse(course);
    if (course.videoUrl) {
      setVideoOpen(true);
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-sm text-muted-foreground">{t("load_error")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <CoursesToolbar view={view} onViewChange={setView} />

      {view === "grid" ? (
        <CoursesGrid courses={courses ?? []} isLoading={isLoading} onSelect={handleSelect} />
      ) : (
        <CoursesTable courses={courses ?? []} isLoading={isLoading} />
      )}

      {!isLoading && courses?.length === 0 && (
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
