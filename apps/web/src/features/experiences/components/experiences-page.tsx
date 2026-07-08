"use client";

import { useState } from "react";
import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Button, EmptyState } from "@app/ui";
import { getRoleFromToken } from "@/lib/jwt";
import { useUserStore } from "@/store/user-store";
import { ApiErrorState } from "@/components/api-error-state";
import { useExperiences } from "../hooks/use-experiences";
import { ExperiencesFilters } from "./experiences-filters";
import { ExperiencesGrid } from "./experiences-grid";
import { ExperienceDetailDialog } from "./experience-detail-dialog";
import { ExperienceFormDialog } from "./experience-form-dialog";
import type {
  ExperienceDetail,
  ExperienceType,
} from "@/services/experiences/experiences.types";

/**
 * Vista de Experiencias (`/experiences`).
 *
 * MENTEE: explora el listado (filtros por tipo/skill) y abre el detalle.
 * MENTOR: además puede crear; sobre sus propias experiencias (detalle con
 * `owner`), editar y borrar. El rol se lee del claim `role` del JWT.
 */
export function ExperiencesPage() {
  const t = useTranslations("common.experiences");
  const token = useUserStore((state) => state.token);
  const isMentor = getRoleFromToken(token) === "MENTOR";

  const [type] = useQueryState("type");
  const [skillId] = useQueryState("skillId");

  const filters = {
    type: (type as ExperienceType | null) ?? undefined,
    skillId: skillId ?? undefined,
  };
  const { data: experiences, isLoading, error, refetch } =
    useExperiences(filters);

  // Detalle abierto (por id) y form (crear = null; editar = detalle cargado).
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ExperienceDetail | null>(null);

  function openDetail(id: string) {
    setDetailId(id);
    setDetailOpen(true);
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(experience: ExperienceDetail) {
    setDetailOpen(false);
    setEditing(experience);
    setFormOpen(true);
  }

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
          <Button type="button" onClick={openCreate} className="shrink-0">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {t("create")}
          </Button>
        ) : null}
      </div>

      <ExperiencesFilters />

      {error ? (
        <ApiErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <>
          {!isLoading && experiences?.length === 0 ? (
            <EmptyState
              title={t("empty_title")}
              description={t("empty_body")}
            />
          ) : null}

          <ExperiencesGrid
            experiences={experiences ?? []}
            isLoading={isLoading}
            onSelect={openDetail}
          />
        </>
      )}

      <ExperienceDetailDialog
        experienceId={detailId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={openEdit}
      />

      <ExperienceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        experience={editing}
      />
    </div>
  );
}
