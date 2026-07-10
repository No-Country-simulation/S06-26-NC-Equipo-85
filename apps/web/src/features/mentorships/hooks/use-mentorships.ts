import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookSession,
  cancelSession,
  completeSession,
  createSession,
  getMySessions,
  getSessionById,
  getSessions,
} from "@/services/mentorships/mentorships.service";
import type {
  SessionCreateRequest,
  SessionFilters,
} from "@/services/mentorships/mentorships.types";

/** Claves raíz; se invalidan tras cualquier mutación de sesiones. */
export const SESSIONS_KEY = ["mentorship-sessions"] as const;
export const MY_SESSIONS_KEY = ["mentorship-my-sessions"] as const;

/** Listado de sesiones con filtros opcionales (`GET /sessions`). */
export function useSessions(filters?: SessionFilters) {
  return useQuery({
    queryKey: [...SESSIONS_KEY, filters ?? {}],
    queryFn: () => getSessions(filters),
  });
}

/** Sesiones del usuario autenticado (`GET /my-sessions`). */
export function useMySessions() {
  return useQuery({
    queryKey: MY_SESSIONS_KEY,
    queryFn: () => getMySessions(),
  });
}

/** Detalle de una sesión (`GET /sessions/{id}`). */
export function useSession(id: string | null) {
  return useQuery({
    queryKey: ["mentorship-session", id],
    queryFn: () => getSessionById(id as string),
    enabled: !!id,
  });
}

/**
 * Invalida ambos listados (explorar + mis sesiones); las mutaciones pueden
 * cambiar de qué lado aparece una sesión, así que se refrescan los dos.
 */
function useInvalidateSessions() {
  const queryClient = useQueryClient();
  return (id?: string) => {
    queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
    queryClient.invalidateQueries({ queryKey: MY_SESSIONS_KEY });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["mentorship-session", id] });
    }
  };
}

/** Crea un slot de sesión (MENTOR) e invalida los listados. */
export function useCreateSession() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (body: SessionCreateRequest) => createSession(body),
    onSuccess: () => invalidate(),
  });
}

/** Reserva una sesión disponible (MENTEE). */
export function useBookSession() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (id: string) => bookSession(id),
    onSuccess: (_data, id) => invalidate(id),
  });
}

/** Marca una sesión como completada (mentor dueño). */
export function useCompleteSession() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (id: string) => completeSession(id),
    onSuccess: (_data, id) => invalidate(id),
  });
}

/** Cancela una sesión (mentor o mentee asignado). */
export function useCancelSession() {
  const invalidate = useInvalidateSessions();
  return useMutation({
    mutationFn: (id: string) => cancelSession(id),
    onSuccess: (_data, id) => invalidate(id),
  });
}
