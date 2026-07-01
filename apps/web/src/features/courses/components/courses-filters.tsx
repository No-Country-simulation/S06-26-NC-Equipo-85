"use client";

import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import type { CourseProvider, CourseLevel, CourseArea } from "@/services/courses/courses.types";

const PROVIDERS: { value: CourseProvider; label: string }[] = [
  { value: "google", label: "Google" },
  { value: "oracle", label: "Oracle" },
  { value: "aws", label: "AWS" },
  { value: "microsoft", label: "Microsoft" },
  { value: "freecodecamp", label: "freeCodeCamp" },
];

const LEVELS: CourseLevel[] = ["principiante", "intermedio", "avanzado"];

const AREAS: CourseArea[] = ["frontend", "backend", "fullstack", "data", "qa"];

export function CoursesFilters() {
  const t = useTranslations("common.courses");
  const [provider, setProvider] = useQueryState("provider");
  const [level, setLevel] = useQueryState("level");
  const [area, setArea] = useQueryState("area");

  const hasFilters = provider || level || area;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={provider ?? ""}
        onChange={(e) => setProvider(e.target.value || null)}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        aria-label={t("filters.by_provider")}
      >
        <option value="">{t("filters.all_providers")}</option>
        {PROVIDERS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
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
        value={area ?? ""}
        onChange={(e) => setArea(e.target.value || null)}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        aria-label={t("filters.by_area")}
      >
        <option value="">{t("filters.all_areas")}</option>
        {AREAS.map((value) => (
          <option key={value} value={value}>{t(`areas.${value}`)}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setProvider(null);
            setLevel(null);
            setArea(null);
          }}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
        >
          {t("clear_filters")}
        </button>
      )}
    </div>
  );
}
