import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMentores, getSlotsByMentor, agendar } from "@/services/mentorias/mentorias.service";
import type { BookingRequest } from "@/services/mentorias/mentorias.types";

export function useMentores() {
  return useQuery({
    queryKey: ["mentores"],
    queryFn: () => getMentores(),
  });
}

export function useSlotsByMentor(mentorId: string | null) {
  return useQuery({
    queryKey: ["slots", mentorId],
    queryFn: () => getSlotsByMentor(mentorId!),
    enabled: !!mentorId,
  });
}

export function useAgendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: BookingRequest) => agendar(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}