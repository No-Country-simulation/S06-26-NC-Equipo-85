import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PROFILE_QUERY_KEY,
  upsertProfile,
} from "@/services/profile/profile.service";
import type {
  ProfileResponse,
  ProfileUpsertRequest,
} from "@/services/profile/profile.types";

/**
 * Mutation de UPSERT del perfil (`PUT /api/v1/profile`).
 *
 * Centraliza la persistencia del onboarding para que el wizard no conozca
 * detalles HTTP. Al guardar, cachea el perfil bajo `PROFILE_QUERY_KEY` para que
 * el redirect post-login (que lee `GET /profile`) lo encuentre fresco.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, Error, ProfileUpsertRequest>({
    mutationKey: ["profile", "upsert"],
    mutationFn: upsertProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, profile);
    },
  });
}
