"use client";

import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import { useSkills } from "@/features/courses/hooks/use-skills";
import { EXPERIENCE_TYPES } from "../utils/experience-options";

const SELECT_CLASS =
  "h-9 rounded-lg border border-input bg-background px-2.5 text-sm";

/**
 * Filtros del listado por `type` y `skillId` (query params, vía nuqs).
 *
 * El catálogo de skills se reutiliza de `useSkills` (query key `["skills"]`
 * compartida con Formaciones), así el segundo consumidor sale de caché.
 */
export function ExperiencesFilters() {
  const t = useTranslations("common.experiences");
  const { data: skills } = useSkills();
  const [type, setType] = useQueryState("type");
  const [skillId, setSkillId] = useQueryState("skillId");

  const hasFilters = !!type || !!skillId;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={type ?? ""}
        onChange={(event) => setType(event.target.value || null)}
        className={SELECT_CLASS}
        aria-label={t("filters.type_label")}
      >
        <option value="">{t("filters.all_types")}</option>
        {EXPERIENCE_TYPES.map((value) => (
          <option key={value} value={value}>
            {t(`types.${value}`)}
          </option>
        ))}
      </select>

      <select
        value={skillId ?? ""}
        onChange={(event) => setSkillId(event.target.value || null)}
        className={SELECT_CLASS}
        aria-label={t("filters.skill_label")}
      >
        <option value="">{t("filters.all_skills")}</option>
        {(skills ?? []).map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            void setType(null);
            void setSkillId(null);
          }}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("filters.clear")}
        </button>
      ) : null}
    </div>
  );
}
