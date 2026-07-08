"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Play } from "lucide-react";
import { Button, Card, CardContent, Spinner } from "@app/ui";
import type { ExperienceListItem } from "@/services/experiences/experiences.types";

type ExperiencesGridProps = {
  experiences: ExperienceListItem[];
  isLoading: boolean;
  onSelect: (id: string) => void;
};

/**
 * Grilla de experiencias (listado). Cada card resume la experiencia y abre el
 * detalle (`GET /{id}`) al seleccionar. Los datos vienen del listado liviano,
 * sin descripción ni skills (esos solo están en el detalle).
 */
export function ExperiencesGrid({
  experiences,
  isLoading,
  onSelect,
}: ExperiencesGridProps) {
  const t = useTranslations("common.experiences");
  const locale = useLocale();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner label={t("loading")} />
      </div>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((exp) => (
        <Card key={exp.id} className="flex flex-col">
          <CardContent className="flex flex-1 flex-col gap-3 p-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-terracota-soft px-2.5 py-0.5 text-xs font-medium text-cacao">
                {t(`types.${exp.type}`)}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-cacao line-clamp-2">
              {exp.title}
            </h3>

            <p className="text-xs text-topo">
              {exp.speaker_name}
              {exp.speaker_role ? ` · ${exp.speaker_role}` : ""}
            </p>

            {exp.date_time ? (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                {dateFormatter.format(new Date(exp.date_time))}
              </p>
            ) : null}

            <Button
              variant="outline"
              size="sm"
              className="mt-auto w-full"
              onClick={() => onSelect(exp.id)}
            >
              <Play className="mr-2 size-3.5" aria-hidden="true" />
              {t("view")}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
