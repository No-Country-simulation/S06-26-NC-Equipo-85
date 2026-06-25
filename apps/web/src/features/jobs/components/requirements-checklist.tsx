"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, GraduationCap } from "lucide-react";
import { cn } from "@app/ui";
import { Link } from "@/i18n/navigation";

type RequirementsChecklistProps = {
  requirements: string[];
  missing: string[];
  area?: string;
};

export function RequirementsChecklist({
  requirements,
  missing,
  area,
}: RequirementsChecklistProps) {
  const t = useTranslations("common.jobs");

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{t("requirements")}</p>
      <ul className="space-y-2">
        {requirements.map((req) => {
          const isPending = missing.includes(req);
          return (
            <li key={req} className="flex items-start gap-3">
              {isPending ? (
                <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              ) : (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-oliva" />
              )}
              <div className="flex flex-1 items-start justify-between gap-2">
                <span
                  className={cn(
                    "text-sm",
                    isPending ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {req}
                </span>
                {isPending && (
                  <Link
                    href={area ? `/courses?area=${area}` : "/courses"}
                    className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    <GraduationCap className="size-3" />
                    {t("see_course_short")}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
