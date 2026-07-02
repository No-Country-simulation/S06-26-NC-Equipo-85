import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { setAuthTokenGetter } from "@/lib/api";
import type { OrientationResponse } from "@/services/orientation/orientation.types";

export type OnboardingDraft = {
  step: number;
  data: Record<string, unknown>;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  area?: string;
};

/** Par de JWT que mantiene viva la sesión (access + refresh). */
export type Session = {
  token: string;
  refreshToken: string | null;
};

type UserState = {
  token: string | null;
  refreshToken: string | null;
  onboardingDraft: OnboardingDraft;
  isOnboardingCompleted: boolean;
  orientationResult: OrientationResponse | null;
  profile: UserProfile | null;
  /** Persiste el par de JWT tras register/login/refresh. */
  setSession: (session: Session) => void;
  setDraftStep: (step: number) => void;
  updateDraftData: (data: Record<string, unknown>) => void;
  setProfile: (profile: UserProfile | null) => void;
  setOrientationResult: (result: OrientationResponse | null) => void;
  completeOnboarding: (profile: UserProfile) => void;
  resetOnboardingDraft: () => void;
  /** Limpia el estado y la entrada persistida. Usar en logout o reinicio total. */
  reset: () => void;
};

export const USER_STORE_KEY = "bit-user";

/**
 * Crea un draft nuevo para evitar reutilizar referencias del estado inicial.
 */
function createInitialDraft(): OnboardingDraft {
  return { step: 0, data: {} };
}

/**
 * Store global del usuario.
 *
 * Mantiene estado local de sesión, perfil, draft del onboarding y resultado
 * inicial de orientación.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      onboardingDraft: createInitialDraft(),
      isOnboardingCompleted: false,
      orientationResult: null,
      profile: null,

      setSession: ({ token, refreshToken }) => set({ token, refreshToken }),

      setDraftStep: (step) =>
        set((state) => ({
          onboardingDraft: {
            ...state.onboardingDraft,
            step,
          },
        })),

      updateDraftData: (data) =>
        set((state) => ({
          onboardingDraft: {
            ...state.onboardingDraft,
            data: {
              ...state.onboardingDraft.data,
              ...data,
            },
          },
        })),

      setProfile: (profile) => set({ profile }),

      setOrientationResult: (result) => set({ orientationResult: result }),

      completeOnboarding: (profile) =>
        set({
          profile,
          isOnboardingCompleted: true,
          onboardingDraft: createInitialDraft(),
        }),

      resetOnboardingDraft: () =>
        set({
          onboardingDraft: createInitialDraft(),
        }),

      reset: () => {
        set({
          token: null,
          refreshToken: null,
          onboardingDraft: createInitialDraft(),
          isOnboardingCompleted: false,
          orientationResult: null,
          profile: null,
        });

        void useUserStore.persist.clearStorage();
      },
    }),
    {
      name: USER_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        onboardingDraft: state.onboardingDraft,
        isOnboardingCompleted: state.isOnboardingCompleted,
        orientationResult: state.orientationResult,
        profile: state.profile,
      }),
      skipHydration: true,
    },
  ),
);

// Inyecta el access token a la capa HTTP sin acoplar `lib/api` al store.
// `apiRequest` lo lee en cada request, así sigue vigente tras login/refresh.
setAuthTokenGetter(() => useUserStore.getState().token);