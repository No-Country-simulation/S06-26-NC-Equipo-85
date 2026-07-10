"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Spinner,
  Textarea,
} from "@app/ui";
import { useSkills } from "@/features/courses/hooks/use-skills";
import { ApiErrorState } from "@/components/api-error-state";
import {
  useCreateExperience,
  useUpdateExperience,
} from "../hooks/use-experiences";
import {
  EXPERIENCE_DEFAULT_VALUES,
  experienceSchema,
} from "../schemas/experience.schema";
import {
  EXPERIENCE_TYPES,
  isoToLocalInput,
  localInputToIso,
} from "../utils/experience-options";
import type { ExperienceFormValues } from "../types/experiences.types";
import type { ExperienceDetail } from "@/services/experiences/experiences.types";

type ExperienceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `null` = crear; con detalle = editar (prellena el form). */
  experience: ExperienceDetail | null;
};

/**
 * Diálogo de crear/editar experiencia (solo MENTOR / mentor dueño).
 *
 * En modo edición prellena desde el detalle (mapeando las claves snake_case de
 * la respuesta a las camelCase del body). Convierte `dateTime` local ↔ ISO 8601
 * al prellenar/enviar. Invalida listado y detalle vía los hooks de mutación.
 */
export function ExperienceFormDialog({
  open,
  onOpenChange,
  experience,
}: ExperienceFormDialogProps) {
  const t = useTranslations("common.experiences.form");
  const tTypes = useTranslations("common.experiences.types");
  const { data: skills } = useSkills();
  const create = useCreateExperience();
  const update = useUpdateExperience();

  const isEditing = experience !== null;
  const isPending = create.isPending || update.isPending;
  const mutationError = create.error ?? update.error;

  // Valores del form según modo. RHF los re-sincroniza cuando cambia la
  // experiencia (patrón `values`), sin pisar la edición mientras el diálogo
  // sigue abierto sobre la misma experiencia.
  const formValues = useMemo<ExperienceFormValues>(() => {
    if (!experience) {
      return EXPERIENCE_DEFAULT_VALUES;
    }

    return {
      title: experience.title,
      description: experience.description,
      speakerRole: experience.speaker_role,
      type: experience.type,
      contentUrl: experience.content_url,
      dateTime: isoToLocalInput(experience.date_time),
      skillIds: experience.skills.map((skill) => skill.id),
    };
  }, [experience]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    values: formValues,
    mode: "onSubmit",
  });

  function onSubmit(values: ExperienceFormValues) {
    const body = {
      title: values.title.trim(),
      description: values.description.trim(),
      speakerRole: values.speakerRole.trim(),
      type: values.type,
      contentUrl: values.contentUrl.trim(),
      dateTime: localInputToIso(values.dateTime),
      skillIds: values.skillIds,
    };

    const onSuccess = () => {
      toast.success(isEditing ? t("updated") : t("created"));
      onOpenChange(false);
    };
    const onError = () =>
      toast.error(isEditing ? t("update_error") : t("create_error"));

    if (isEditing) {
      update.mutate({ id: experience.id, body }, { onSuccess, onError });
    } else {
      create.mutate(body, { onSuccess, onError });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("edit_title") : t("create_title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="exp-title">{t("title_label")}</Label>
            <Input id="exp-title" {...register("title")} />
            {errors.title ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="exp-type">{t("type_label")}</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <select
                    id="exp-type"
                    value={field.value}
                    onChange={field.onChange}
                    className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm"
                  >
                    {EXPERIENCE_TYPES.map((value) => (
                      <option key={value} value={value}>
                        {tTypes(value)}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="exp-datetime">{t("datetime_label")}</Label>
              <Input
                id="exp-datetime"
                type="datetime-local"
                {...register("dateTime")}
              />
              {errors.dateTime ? (
                <p role="alert" className="text-sm text-destructive">
                  {errors.dateTime.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exp-speaker-role">{t("speaker_role_label")}</Label>
            <Input id="exp-speaker-role" {...register("speakerRole")} />
            {errors.speakerRole ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.speakerRole.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exp-content-url">{t("content_url_label")}</Label>
            <Input
              id="exp-content-url"
              type="url"
              placeholder="https://…"
              {...register("contentUrl")}
            />
            {errors.contentUrl ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.contentUrl.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exp-description">{t("description_label")}</Label>
            <Textarea id="exp-description" rows={4} {...register("description")} />
            {errors.description ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label>{t("skills_label")}</Label>
            <Controller
              control={control}
              name="skillIds"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {(skills ?? []).map((skill) => {
                    const selected = field.value.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          field.onChange(
                            selected
                              ? field.value.filter((id) => id !== skill.id)
                              : [...field.value, skill.id],
                          )
                        }
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          selected
                            ? "border-terracota bg-terracota-soft text-cacao"
                            : "border-input bg-background text-muted-foreground hover:bg-arena",
                        )}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          {mutationError ? (
            <ApiErrorState
              error={mutationError}
              onRetry={() => {
                create.reset();
                update.reset();
              }}
            />
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {t("saving")}
                </>
              ) : isEditing ? (
                t("save")
              ) : (
                t("create")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
