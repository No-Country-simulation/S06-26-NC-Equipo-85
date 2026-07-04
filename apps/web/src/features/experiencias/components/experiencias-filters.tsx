"use client";

import { useQueryState } from "nuqs";
import type { ExperienceArea, ExperienceType } from "@/services/experiencias/experiencias.types";

const AREAS: { value: ExperienceArea; label: string }[] = [
  { value: "BACKEND", label: "Backend" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "MOBILE", label: "Mobile" },
  { value: "DATA_SCIENCE", label: "Data Science" },
  { value: "DESIGN_UX_UI", label: "Diseño UX/UI" },
  { value: "SOFT_SKILLS", label: "Soft Skills" },
];

const TYPES: { value: ExperienceType; label: string }[] = [
  { value: "WORKSHOP", label: "Workshop" },
  { value: "BOOTCAMP", label: "Bootcamp" },
  { value: "WEBINAR", label: "Webinar" },
  { value: "JOB_EXPERIENCE", label: "Experiencia laboral" },
];

export function ExperienciasFilters() {
  const [area, setArea] = useQueryState("area");
  const [type, setType] = useQueryState("type");

  const hasFilters = area || type;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={area ?? ""}
        onChange={(e) => setArea(e.target.value || null)}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        aria-label="Filtrar por área"
      >
        <option value="">Todas las áreas</option>
        {AREAS.map((a) => (
          <option key={a.value} value={a.value}>{a.label}</option>
        ))}
      </select>

      <select
        value={type ?? ""}
        onChange={(e) => setType(e.target.value || null)}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        aria-label="Filtrar por tipo"
      >
        <option value="">Todos los tipos</option>
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setArea(null);
            setType(null);
          }}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}