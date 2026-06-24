"use client";

import dynamic from "next/dynamic";
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

export function CourseVideoDialog({ course, open, onOpenChange }: CourseVideoDialogProps) {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
        </DialogHeader>

        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          {course.videoUrl ? (
            <ReactPlayer
              url={course.videoUrl}
              width="100%"
              height="100%"
              controls
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Preview no disponible para este curso
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{course.description}</p>
          <div className="flex flex-wrap gap-2">
            {course.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}