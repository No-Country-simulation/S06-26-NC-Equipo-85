import { useQuery } from "@tanstack/react-query";
import { getJobs, getJobById } from "@/services/jobs/jobs.service";
import type { JobFilters } from "@/services/jobs/jobs.types";

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => getJobs(filters),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
}