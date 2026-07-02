"use client";

import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import type { CourseLevel } from "@/services/courses/courses.types";
import type { SkillCategory } from "@/services/skills/skills.types";

type CoursesFiltersProps = {
  /** Proveedores presentes en el catálogo cargado (`getAvailableProviders`). */
  providers: string[];
};

const LEVELS: CourseLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const SKILL_CATEGORIES: SkillCategory[] = [
  "BACKEND",
  "FRONTEND",
  "MOBILE",
  "DATA_SCIENCE",
  "DESIGN_UX_UI",
  "SOFT_SKILLS",
];

export function CoursesFilters({ providers }: CoursesFiltersProps) {
  const t = useTranslations("common.courses");
  const tSkills = useTranslations("common.skills.categories");
  const [provider, setProvider] = useQueryState("provider");
  const [level, setLevel] = useQueryState("level");
  const [skillCategory, setSkillCategory] = useQueryState("skillCategory");

  const hasFilters = provider || level || skillCategory;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={provider ?? ""}
        onChange={(e) => setProvider(e.target.value || null)}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        aria-label={t("filters.by_provider")}
      >
        <option value="">{t("filters.all_providers")}</option>
        {providers.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        value={level ?? ""}
        onChange={(e) => setLevel(e.target.value || null)}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        aria-label={t("filters.by_level")}
      >
        <option value="">{t("filters.all_levels")}</option>
        {LEVELS.map((value) => (
          <option key={value} value={value}>{t(`levels.${value}`)}</option>
        ))}
      </select>

      <select
        value={skillCategory ?? ""}
        onChange={(e) => setSkillCategory(e.target.value || null)}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        aria-label={t("filters.by_skill_category")}
      >
        <option value="">{t("filters.all_skill_categories")}</option>
        {SKILL_CATEGORIES.map((value) => (
          <option key={value} value={value}>{tSkills(value)}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setProvider(null);
            setLevel(null);
            setSkillCategory(null);
          }}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
        >
          {t("clear_filters")}
        </button>
      )}
    </div>
  );
}
