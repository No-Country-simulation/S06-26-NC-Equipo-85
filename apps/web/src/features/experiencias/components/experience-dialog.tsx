"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@app/ui";
import { AlertCircle, ExternalLink } from "lucide-react";
import type { Experience } from "@/services/experiencias/experiencias.types";

const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  { ssr: false },
) as React.ComponentType<{
  url: string;
  width: string;
  height: string;
  controls: boolean;
   onError?: () => void;
}>;

type ExperienceDialogProps = {
  experience: Experience | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ExperienceDialog({
  experience,
  open,
  onOpenChange,
}: ExperienceDialogProps) {
  const [videoError, setVideoError] = useState(false);

  if (!experience) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{experience.title}</DialogTitle>
        </DialogHeader>

        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          {videoError ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <AlertCircle className="size-8 text-destructive" />
              <p className="text-sm text-white">No se pudo cargar el video</p>
              <a
                href={experience.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="size-3.5" />
                Ver en YouTube
              </a>
            </div>
          ) : (
            <ReactPlayer
              url={experience.videoUrl}
              width="100%"
              height="100%"
              controls
              onError={() => setVideoError(true)}
            />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-terracota-soft px-2.5 py-0.5 text-xs font-medium text-cacao">
              {experience.area}
            </span>
            <span className="rounded-full bg-arena px-2.5 py-0.5 text-xs font-medium text-topo">
              {experience.experienceType}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{experience.description}</p>
          <p className="text-xs text-topo">
            {experience.speakerName} · {experience.speakerRole}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}