"use client";

import { useTranslations } from "next-intl";
import { cn } from "@app/ui";

type MatchScoreBarProps = {
  score: number;
  showLabel?: boolean;
  className?: string;
};

function getColor(score: number) {
  if (score >= 70) return "bg-oliva";
  if (score >= 50) return "bg-ambar";
  return "bg-granate";
}

export function MatchScoreBar({ score, showLabel = true, className }: MatchScoreBarProps) {
  const t = useTranslations("common.jobs");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", getColor(score))}
          style={{ width: `${score}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("match_aria", { score })}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">{score}%</span>
      )}
    </div>
  );
}
