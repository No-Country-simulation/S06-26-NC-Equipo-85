"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@app/ui";
import type { Course } from "@/services/courses/courses.types";

const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  { ssr: false }
) as React.ComponentType<{ url: string; width: string; height: string; controls: boolean }>;

type CourseVideoDialogProps = {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Reproduce el contenido de un curso embebible (YouTube/Vimeo).
 *
 * `courses-page` solo abre este dialog cuando `isEmbeddableVideoUrl(course.url)`
 * es verdadero; el resto de los cursos se abren en una pestaña nueva sin pasar
 * por acá, así que no hace falta un estado de "preview no disponible".
 */
export function CourseVideoDialog({ course, open, onOpenChange }: CourseVideoDialogProps) {
  const tSkills = useTranslations("common.skills.categories");

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{course.name}</DialogTitle>
        </DialogHeader>

        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <ReactPlayer url={course.url} width="100%" height="100%" controls />
        </div>

        <div className="flex flex-wrap gap-2">
          {course.skills.map((skill) => (
            <span
              key={skill.id}
              title={tSkills(skill.category)}
              className="rounded-md border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
