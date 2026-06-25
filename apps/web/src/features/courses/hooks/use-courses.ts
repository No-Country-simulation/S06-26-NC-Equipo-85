import { useQuery } from "@tanstack/react-query";
import { getCourses, getCourseById } from "@/services/courses/courses.service";
import type { CourseFilters } from "@/services/courses/courses.types";

export function useCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: ["courses", filters],
    queryFn: () => getCourses(filters),
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });
}