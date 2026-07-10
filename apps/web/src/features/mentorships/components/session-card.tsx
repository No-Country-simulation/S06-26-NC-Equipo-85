"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Check, Sparkles } from "lucide-react";
import { Badge, Button, Card, CardContent, Spinner } from "@app/ui";
import { SESSION_STATUS_VARIANT } from "../utils/session-options";
import type { SessionAction } from "../utils/session-options";
import type { Session } from "@/services/mentorships/mentorships.types";

type SessionCardProps = {
  session: Session;
  actions: SessionAction[];
  onSelect: (id: string) => void;
  onAction: (action: SessionAction, id: string) => void;
  pendingAction: boolean;
};

/**
 * Card de una sesión de mentoría. Muestra estado, si es práctica y la fecha, y
 * ofrece las acciones que le pasan (calculadas en la página según rol/estado).
 * El cancelar pide confirmación en dos pasos (patrón destructivo del proyecto).
 */
export function SessionCard({
  session,
  actions,
  onSelect,
  onAction,
  pendingAction,
}: SessionCardProps) {
  const t = useTranslations("common.mentorships");
  const locale = useLocale();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={SESSION_STATUS_VARIANT[session.status]}>
            {t(`status.${session.status}`)}
          </Badge>
          {session.is_practice_invitation ? (
            <Badge variant="outline" className="gap-1">
              <Sparkles className="size-3" aria-hidden="true" />
              {t("practice")}
            </Badge>
          ) : null}
        </div>

        <h3 className="text-sm font-semibold text-cacao line-clamp-2">
          {session.title}
        </h3>

        {session.schedule_date ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {dateFormatter.format(new Date(session.schedule_date))}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect(session.id)}
          >
            {t("actions.view")}
          </Button>

          {confirmingCancel ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                disabled={pendingAction}
                onClick={() => onAction("cancel", session.id)}
              >
                {pendingAction ? (
                  <Spinner size="sm" className="mr-2" />
                ) : null}
                {t("actions.confirm_cancel_cta")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={pendingAction}
                onClick={() => setConfirmingCancel(false)}
              >
                {t("actions.keep")}
              </Button>
            </>
          ) : (
            actions.map((action) =>
              action === "cancel" ? (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmingCancel(true)}
                >
                  {t("actions.cancel")}
                </Button>
              ) : (
                <Button
                  key={action}
                  size="sm"
                  disabled={pendingAction}
                  onClick={() => onAction(action, session.id)}
                >
                  {pendingAction ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : action === "complete" ? (
                    <Check className="mr-1.5 size-3.5" aria-hidden="true" />
                  ) : null}
                  {t(`actions.${action}`)}
                </Button>
              ),
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
