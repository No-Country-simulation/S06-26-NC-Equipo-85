"use client";

import { useTranslations } from "next-intl";
import { Spinner } from "@app/ui";
import { getRoleFromToken } from "@/lib/jwt";
import { useUserStore } from "@/store/user-store";
import { SessionCard } from "./session-card";
import { getSessionActions } from "../utils/session-options";
import type {
  SessionAction,
  SessionContext,
} from "../utils/session-options";
import type { Session } from "@/services/mentorships/mentorships.types";

type SessionsGridProps = {
  sessions: Session[];
  isLoading: boolean;
  context: SessionContext;
  onSelect: (id: string) => void;
  onAction: (action: SessionAction, id: string) => void;
  /** Id de la sesión con una acción en curso (deshabilita sus botones). */
  pendingActionId: string | null;
};

/**
 * Grilla de sesiones. Calcula las acciones de cada card según el rol (claim del
 * JWT) + estado + contexto; los datos y la lógica de acciones viven fuera del
 * render (utils), la grilla solo orquesta.
 */
export function SessionsGrid({
  sessions,
  isLoading,
  context,
  onSelect,
  onAction,
  pendingActionId,
}: SessionsGridProps) {
  const t = useTranslations("common.mentorships");
  const token = useUserStore((state) => state.token);
  const isMentor = getRoleFromToken(token) === "MENTOR";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label={t("loading")} />
      </div>
    );
  }

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          actions={getSessionActions(session.status, isMentor, context)}
          onSelect={onSelect}
          onAction={onAction}
          pendingAction={pendingActionId === session.id}
        />
      ))}
    </div>
  );
}
