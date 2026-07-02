"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@app/ui";
import type { JobSkill } from "@/services/jobs/jobs.types";

type RequirementsChecklistProps = {
  skills: JobSkill[];
};

/**
 * Lista de skills requeridas por la vacante.
 *
 * El contrato real (`Job.skills`) no informa cumplido/pendiente por skill (a
 * diferencia del mock anterior), así que ya no es un checklist: solo lista
 * las skills requeridas.
 *
 * TODO(backend): si se agrega el detalle de qué skills ya cumple el usuario
 * (cruzando con su perfil), este componente puede volver a distinguir
 * cumplido/pendiente como antes.
 */
export function RequirementsChecklist({ skills }: RequirementsChecklistProps) {
  const t = useTranslations("common.jobs");
  const tSkills = useTranslations("common.skills.categories");

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{t("requirements")}</p>
      {skills.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("no_requirements")}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li key={skill.id}>
              <Badge variant="outline" title={tSkills(skill.category)}>
                {skill.name}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
