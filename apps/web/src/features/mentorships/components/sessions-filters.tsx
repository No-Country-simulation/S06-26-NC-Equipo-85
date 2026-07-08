"use client";

import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import { SESSION_STATUSES } from "../utils/session-options";

const SELECT_CLASS =
  "h-9 rounded-lg border border-input bg-background px-2.5 text-sm";

/**
 * Filtros del catálogo de sesiones (`GET /sessions`), vía nuqs.
 *
 * El backend, sin `status`, devuelve `AVAILABLE`: por eso el filtro de estado no
 * tiene opción "todos" (no es posible listar todos los estados de una) y el
 * valor vacío equivale a `AVAILABLE`. `practice` filtra prácticas vs. reales y
 * `date` acota a un día.
 */
export function SessionsFilters() {
  const t = useTranslations("common.mentorships.filters");
  const tStatus = useTranslations("common.mentorships.status");
  const [status, setStatus] = useQueryState("status");
  const [practice, setPractice] = useQueryState("practice");
  const [date, setDate] = useQueryState("date");

  const hasFilters = !!status || !!practice || !!date;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={status ?? "AVAILABLE"}
        onChange={(event) => setStatus(event.target.value || null)}
        className={SELECT_CLASS}
        aria-label={t("status_label")}
      >
        {SESSION_STATUSES.map((value) => (
          <option key={value} value={value}>
            {tStatus(value)}
          </option>
        ))}
      </select>

      <select
        value={practice ?? ""}
        onChange={(event) => setPractice(event.target.value || null)}
        className={SELECT_CLASS}
        aria-label={t("practice_label")}
      >
        <option value="">{t("all_practice")}</option>
        <option value="true">{t("practice_only")}</option>
        <option value="false">{t("real_only")}</option>
      </select>

      <input
        type="date"
        value={date ?? ""}
        onChange={(event) => setDate(event.target.value || null)}
        className={SELECT_CLASS}
        aria-label={t("date_label")}
      />

      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            void setStatus(null);
            void setPractice(null);
            void setDate(null);
          }}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("clear")}
        </button>
      ) : null}
    </div>
  );
}
