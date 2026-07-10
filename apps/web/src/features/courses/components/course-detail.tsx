"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ArrowLeft, Clock, ExternalLink } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@app/ui";
import { Link } from "@/i18n/navigation";
import { useCourse } from "../hooks/use-courses";
import { isEmbeddableVideoUrl } from "../utils/course-media";
import { ApiErrorState } from "@/components/api-error-state";

const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  { ssr: false },
) as React.ComponentType<{
  url: string;
  width: string;
  height: string;
  controls: boolean;
}>;

type CourseDetailProps = {
  courseId: string;
};

/** Nivel de curso → variante de badge (nunca `destructive`/granate). */
const LEVEL_VARIANT = {
  BEGINNER: "success",
  INTERMEDIATE: "warning",
  ADVANCED: "secondary",
} as const;

/**
 * Vista de detalle de un curso (`/courses/[id]`).
 *
 * Muestra la data real (nombre, proveedor) + los campos mock (nivel, duración,
 * descripción, skills, video/enlace). Si `url` es embebible reproduce el video
 * inline; si no, ofrece el enlace externo. Maneja loading/error/not-found.
 */
export function CourseDetail({ courseId }: CourseDetailProps) {
  const t = useTranslations("common.courses");
  const tSkills = useTranslations("common.skills.categories");
  const { data: course, isLoading, error, refetch } = useCourse(courseId);

  const backLink = (
    <Link
      href="/courses"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
    >
      <ArrowLeft className="size-4" />
      {t("detail.back")}
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        <ApiErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col gap-6">
        {backLink}
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-muted-foreground">{t("detail.not_found")}</p>
        </div>
      </div>
    );
  }

  const embeddable = course.url ? isEmbeddableVideoUrl(course.url) : false;

  return (
    <div className="flex flex-col gap-6">
      {backLink}

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{course.provider}</Badge>
          <Badge variant={LEVEL_VARIANT[course.level]}>
            {t(`levels.${course.level}`)}
          </Badge>
          {course.durationHours > 0 && (
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="size-4" />
              {t("detail.duration", { hours: course.durationHours })}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold text-foreground">{course.name}</h1>
      </header>

      {embeddable && (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <ReactPlayer url={course.url} width="100%" height="100%" controls />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {course.description && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t("detail.about")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {course.description}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("detail.skills_label")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {course.skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("detail.no_skills")}
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <li key={skill.name}>
                    <Badge variant="outline" title={tSkills(skill.category)}>
                      {skill.name}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}

            {course.url && (
              <Button asChild variant={embeddable ? "outline" : "default"}>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="size-4" />
                  {embeddable ? t("detail.open_source") : t("detail.go_to_course")}
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
