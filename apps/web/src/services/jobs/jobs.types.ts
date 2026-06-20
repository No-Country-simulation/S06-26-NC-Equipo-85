import type { CompatibleJob } from "@/services/orientation/orientation.types";

export type Job = CompatibleJob & {
  area: string;
  location?: string;
  salary?: string;
  description: string;
  requirements: string[];
  recommendedCourses?: string[];
};

export type JobFilters = {
  area?: string;
  matchScoreMin?: number;
};