"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { CalendarDays, ExternalLink, Pencil, Trash2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@app/ui";
import { ApiErrorState } from "@/components/api-error-state";
import { useDeleteExperience, useExperience } from "../hooks/use-experiences";
import { isEmbeddableVideoUrl } from "../utils/experience-options";
import type { ExperienceDetail } from "@/services/experiences/experiences.types";

const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  { ssr: false },
) as React.ComponentType<{
  url: string;
  width: string;
  height: string;
  controls: boolean;
}>;

type ExperienceDetailDialogProps = {
  experienceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Abre el form de edición con el detalle ya cargado (solo dueño). */
  onEdit: (experience: ExperienceDetail) => void;
};

/**
 * Detalle de una experiencia (`GET /{id}`) en diálogo.
 *
 * Muestra el contenido (embebe video si `content_url` es embebible; si no,
 * linkea afuera), metadatos, descripción y skills. Si `owner` es verdadero,
 * ofrece editar y borrar (borrado con confirmación en dos pasos).
 */
export function ExperienceDetailDialog({
  experienceId,
  open,
  onOpenChange,
  onEdit,
}: ExperienceDetailDialogProps) {
  const t = useTranslations("common.experiences");
  const locale = useLocale();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data, isLoading, error, refetch } = useExperience(
    open ? experienceId : null,
  );
  const remove = useDeleteExperience();

  function handleDelete() {
    if (!data) return;
    remove.mutate(data.id, {
      onSuccess: () => {
        toast.success(t("detail.deleted"));
        setConfirmingDelete(false);
        onOpenChange(false);
      },
      onError: () => toast.error(t("detail.delete_error")),
    });
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setConfirmingDelete(false);
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{data?.title ?? t("detail.title")}</DialogTitle>
        </DialogHeader>

        {error ? (
          <ApiErrorState error={error} onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner label={t("loading")} />
          </div>
        ) : !data ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {t("detail.not_found")}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              {isEmbeddableVideoUrl(data.content_url) ? (
                <ReactPlayer
                  url={data.content_url}
                  width="100%"
                  height="100%"
                  controls
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-sm text-white">{t("detail.external")}</p>
                  <a
                    href={data.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    {t("detail.open_link")}
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-terracota-soft px-2.5 py-0.5 text-xs font-medium text-cacao">
                {t(`types.${data.type}`)}
              </span>
              {data.date_time ? (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {dateFormatter.format(new Date(data.date_time))}
                </span>
              ) : null}
            </div>

            <p className="text-sm text-muted-foreground">{data.description}</p>

            <p className="text-xs text-topo">
              {data.speaker_name}
              {data.speaker_role ? ` · ${data.speaker_role}` : ""}
            </p>

            {data.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-md border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : null}

            {data.owner ? (
              <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
                {confirmingDelete ? (
                  <>
                    <span className="mr-auto text-sm text-muted-foreground">
                      {t("detail.confirm_delete")}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setConfirmingDelete(false)}
                      disabled={remove.isPending}
                    >
                      {t("detail.cancel")}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={remove.isPending}
                    >
                      {remove.isPending ? (
                        <Spinner size="sm" className="mr-2" />
                      ) : (
                        <Trash2 className="mr-2 size-4" aria-hidden="true" />
                      )}
                      {t("detail.confirm_delete_cta")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onEdit(data)}
                    >
                      <Pencil className="mr-2 size-4" aria-hidden="true" />
                      {t("detail.edit")}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setConfirmingDelete(true)}
                    >
                      <Trash2 className="mr-2 size-4" aria-hidden="true" />
                      {t("detail.delete")}
                    </Button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
