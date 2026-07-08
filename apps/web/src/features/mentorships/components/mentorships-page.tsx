"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button, cn, EmptyState } from "@app/ui";
import { getRoleFromToken } from "@/lib/jwt";
import { useUserStore } from "@/store/user-store";
import { ApiErrorState } from "@/components/api-error-state";
import {
  useBookSession,
  useCancelSession,
  useCompleteSession,
  useMySessions,
  useSessions,
} from "../hooks/use-mentorships";
import { SessionsFilters } from "./sessions-filters";
import { SessionsGrid } from "./sessions-grid";
import { SessionDetailDialog } from "./session-detail-dialog";
import { SessionFormDialog } from "./session-form-dialog";
import type { SessionAction } from "../utils/session-options";
import type { SessionStatus } from "@/services/mentorships/mentorships.types";

type Tab = "explore" | "mine";

/**
 * Vista de Mentorías (`/mentorships`).
 *
 * "Explorar sesiones": catálogo con filtros (estado/práctica/fecha); el MENTEE
 * reserva slots disponibles. "Mis sesiones": las del usuario, donde el mentor
 * completa/cancela y el mentee cancela. El MENTOR además publica slots nuevos.
 * El rol se lee del claim `role` del JWT; la autorización final la valida el
 * backend.
 */
export function MentorshipsPage() {
  const t = useTranslations("common.mentorships");
  const token = useUserStore((state) => state.token);
  const isMentor = getRoleFromToken(token) === "MENTOR";

  const [tab, setTab] = useState<Tab>("explore");

  const [status] = useQueryState("status");
  const [practice] = useQueryState("practice");
  const [date] = useQueryState("date");

  const exploreFilters = {
    status: (status as SessionStatus | null) ?? "AVAILABLE",
    practice:
      practice === "true" ? true : practice === "false" ? false : undefined,
    date: date ?? undefined,
  };

  const explore = useSessions(exploreFilters);
  const mine = useMySessions();
  const active = tab === "explore" ? explore : mine;

  const book = useBookSession();
  const complete = useCompleteSession();
  const cancel = useCancelSession();

  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  function openDetail(id: string) {
    setDetailId(id);
    setDetailOpen(true);
  }

  /** Dispara la mutación de una acción sobre una card (explorar/mis sesiones). */
  function handleAction(action: SessionAction, id: string) {
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

    setPendingActionId(id);
    mutation.mutate(id, {
      onSuccess: () => toast.success(successMsg),
      onError: () => toast.error(errorMsg),
      onSettled: () => setPendingActionId(null),
    });
  }

  const emptyTitle =
    tab === "explore" ? t("empty_explore_title") : t("empty_mine_title");
  const emptyBody =
    tab === "explore" ? t("empty_explore_body") : t("empty_mine_body");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {isMentor ? (
          <Button
            type="button"
            onClick={() => setFormOpen(true)}
            className="shrink-0"
          >
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {t("create")}
          </Button>
        ) : null}
      </div>

      <div
        role="tablist"
        aria-label={t("title")}
        className="flex w-fit gap-1 rounded-lg bg-muted p-1"
      >
        {(["explore", "mine"] as const).map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            type="button"
            onClick={() => setTab(value)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              tab === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`tabs.${value}`)}
          </button>
        ))}
      </div>

      {tab === "explore" ? <SessionsFilters /> : null}

      {active.error ? (
        <ApiErrorState error={active.error} onRetry={() => active.refetch()} />
      ) : (
        <>
          {!active.isLoading && active.data?.length === 0 ? (
            <EmptyState title={emptyTitle} description={emptyBody} />
          ) : null}

          <SessionsGrid
            sessions={active.data ?? []}
            isLoading={active.isLoading}
            context={tab}
            onSelect={openDetail}
            onAction={handleAction}
            pendingActionId={pendingActionId}
          />
        </>
      )}

      <SessionDetailDialog
        sessionId={detailId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        context={tab}
      />

      <SessionFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
