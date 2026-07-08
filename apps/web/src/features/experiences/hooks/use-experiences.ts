import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExperience,
  deleteExperience,
  getExperienceById,
  getExperiences,
  updateExperience,
} from "@/services/experiences/experiences.service";
import type {
  ExperienceFilters,
  ExperienceUpsertRequest,
} from "@/services/experiences/experiences.types";

/** Clave raíz del listado; se invalida tras crear/editar/borrar. */
export const EXPERIENCES_KEY = ["experiences"] as const;

/** Listado con filtros opcionales (`GET /api/v1/experiences`). */
export function useExperiences(filters?: ExperienceFilters) {
  return useQuery({
    queryKey: [...EXPERIENCES_KEY, filters ?? {}],
    queryFn: () => getExperiences(filters),
  });
}

/** Detalle de una experiencia (`GET /api/v1/experiences/{id}`). */
export function useExperience(id: string | null) {
  return useQuery({
    queryKey: ["experience", id],
    queryFn: () => getExperienceById(id as string),
    enabled: !!id,
  });
}

/** Crea una experiencia (MENTOR) e invalida el listado. */
export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ExperienceUpsertRequest) => createExperience(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_KEY });
    },
  });
}

/** Actualiza una experiencia (mentor dueño) e invalida listado + detalle. */
export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: ExperienceUpsertRequest;
    }) => updateExperience(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_KEY });
      queryClient.invalidateQueries({ queryKey: ["experience", id] });
    },
  });
}

/** Elimina una experiencia (mentor dueño) e invalida el listado. */
export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_KEY });
    },
  });
}
