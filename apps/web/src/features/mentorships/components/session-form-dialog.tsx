"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Spinner,
} from "@app/ui";
import { ApiErrorState } from "@/components/api-error-state";
import { useCreateSession } from "../hooks/use-mentorships";
import {
  SESSION_DEFAULT_VALUES,
  sessionSchema,
} from "../schemas/session.schema";
import { localInputToIso } from "../utils/session-options";
import type { SessionFormValues } from "../types/mentorships.types";

type SessionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Diálogo para publicar un slot de sesión disponible (solo MENTOR). Convierte
 * `scheduleDate` local → ISO 8601 al enviar; el backend deriva el mentor del
 * token y devuelve la sesión ya en estado `AVAILABLE`.
 */
export function SessionFormDialog({ open, onOpenChange }: SessionFormDialogProps) {
  const t = useTranslations("common.mentorships.form");
  const create = useCreateSession();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: SESSION_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  function onSubmit(values: SessionFormValues) {
    create.mutate(
      {
        title: values.title.trim(),
        scheduleDate: localInputToIso(values.scheduleDate),
        practice: values.practice,
      },
      {
        onSuccess: () => {
          toast.success(t("created"));
          reset(SESSION_DEFAULT_VALUES);
          onOpenChange(false);
        },
        onError: () => toast.error(t("create_error")),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("create_title")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="session-title">{t("title_label")}</Label>
            <Input id="session-title" {...register("title")} />
            {errors.title ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="session-datetime">{t("datetime_label")}</Label>
            <Input
              id="session-datetime"
              type="datetime-local"
              {...register("scheduleDate")}
            />
            {errors.scheduleDate ? (
              <p role="alert" className="text-sm text-destructive">
                {errors.scheduleDate.message}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="practice"
              render={({ field }) => (
                <Checkbox
                  id="session-practice"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              )}
            />
            <Label htmlFor="session-practice" className="font-normal">
              {t("practice_label")}
            </Label>
          </div>

          {create.error ? (
            <ApiErrorState error={create.error} onRetry={() => create.reset()} />
          ) : null}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {t("saving")}
                </>
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
