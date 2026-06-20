"use client";

import { useQueryState } from "nuqs";
import type { CourseProvider, CourseLevel, CourseArea } from "@/services/courses/courses.types";

const PROVIDERS: { value: CourseProvider; label: string }[] = [
  { value: "google", label: "Google" },
  { value: "oracle", label: "Oracle" },
  { value: "aws", label: "AWS" },
  { value: "microsoft", label: "Microsoft" },
  { value: "freecodecamp", label: "freeCodeCamp" },
];

const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
];

const AREAS: { value: CourseArea; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Full Stack" },
  { value: "data", label: "Datos" },
  { value: "qa", label: "QA" },
];

export function CoursesFilters() {
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
        aria-label="Filtrar por proveedor"
      >
        <option value="">Todos los proveedores</option>
        {PROVIDERS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <select
        value={level ?? ""}
        onChange={(e) => setLevel(e.target.value || null)}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        aria-label="Filtrar por nivel"
      >
        <option value="">Todos los niveles</option>
        {LEVELS.map((l) => (
          <option key={l.value} value={l.value}>{l.label}</option>
        ))}
      </select>

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
          Limpiar filtros
        </button>
      )}
    </div>
  );
}