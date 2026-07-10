"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { CalendarDays, Check, Sparkles } from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@app/ui";
import { getRoleFromToken } from "@/lib/jwt";
import { useUserStore } from "@/store/user-store";
import { ApiErrorState } from "@/components/api-error-state";
import {
  useBookSession,
  useCancelSession,
  useCompleteSession,
  useSession,
} from "../hooks/use-mentorships";
import {
  getSessionActions,
  SESSION_STATUS_VARIANT,
} from "../utils/session-options";
import type {
  SessionAction,
  SessionContext,
} from "../utils/session-options";

type SessionDetailDialogProps = {
  sessionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Contexto desde el que se abrió (define qué acciones ofrecer). */
  context: SessionContext;
};

/**
 * Detalle de una sesión (`GET /sessions/{id}`) en diálogo, con las acciones
 * disponibles según rol/estado/contexto. Cada acción usa su propio hook para
 * mostrar loading y cerrar el diálogo al confirmar; el cancelar pide
 * confirmación en dos pasos.
 */
export function SessionDetailDialog({
  sessionId,
  open,
  onOpenChange,
  context,
}: SessionDetailDialogProps) {
  const t = useTranslations("common.mentorships");
  const locale = useLocale();
  const token = useUserStore((state) => state.token);
  const isMentor = getRoleFromToken(token) === "MENTOR";
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const { data, isLoading, error, refetch } = useSession(
    open ? sessionId : null,
  );
  const book = useBookSession();
  const complete = useCompleteSession();
  const cancel = useCancelSession();

  const isPending = book.isPending || complete.isPending || cancel.isPending;

  function runAction(action: SessionAction, id: string) {
    const mutation =
      action === "book" ? book : action === "complete" ? complete : cancel;
    const successMsg =
      action === "book"
        ? t("actions.booked")
        : action === "complete"
          ? t("actions.completed")
          : t("actions.canceled");
    const errorMsg =
      action === "book"
        ? t("actions.book_error")
        : action === "complete"
          ? t("actions.complete_error")
          : t("actions.cancel_error");

    mutation.mutate(id, {
      onSuccess: () => {
        toast.success(successMsg);
        setConfirmingCancel(false);
        onOpenChange(false);
      },
      onError: () => toast.error(errorMsg),
    });
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  });

  const actions = data
    ? getSessionActions(data.status, isMentor, context)
    : [];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setConfirmingCancel(false);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
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
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={SESSION_STATUS_VARIANT[data.status]}>
                {t(`status.${data.status}`)}
              </Badge>
              {data.is_practice_invitation ? (
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="size-3" aria-hidden="true" />
                  {t("practice")}
                </Badge>
              ) : null}
            </div>

            {data.schedule_date ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" aria-hidden="true" />
                {dateFormatter.format(new Date(data.schedule_date))}
              </p>
            ) : null}

            {actions.length > 0 ? (
              <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
                {confirmingCancel ? (
                  <>
                    <span className="mr-auto text-sm text-muted-foreground">
                      {t("actions.confirm_cancel")}
                    </span>
                    <Button
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => setConfirmingCancel(false)}
                    >
                      {t("actions.keep")}
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={isPending}
                      onClick={() => runAction("cancel", data.id)}
                    >
                      {cancel.isPending ? (
                        <Spinner size="sm" className="mr-2" />
                      ) : null}
                      {t("actions.confirm_cancel_cta")}
                    </Button>
                  </>
                ) : (
                  actions.map((action) =>
                    action === "cancel" ? (
                      <Button
                        key={action}
                        variant="outline"
                        disabled={isPending}
                        onClick={() => setConfirmingCancel(true)}
                      >
                        {t("actions.cancel")}
                      </Button>
                    ) : (
                      <Button
                        key={action}
                        disabled={isPending}
                        onClick={() => runAction(action, data.id)}
                      >
                        {(action === "book" && book.isPending) ||
                        (action === "complete" && complete.isPending) ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : action === "complete" ? (
                          <Check className="mr-1.5 size-4" aria-hidden="true" />
                        ) : null}
                        {t(`actions.${action}`)}
                      </Button>
                    ),
                  )
                )}
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
