import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

type UserState = {
  token: string | null;
  onboardingDraft: OnboardingDraft;
  isOnboardingCompleted: boolean;
  profile: UserProfile | null;
  setToken: (token: string | null) => void;
  setDraftStep: (step: number) => void;
  updateDraftData: (data: Record<string, unknown>) => void;
  setProfile: (profile: UserProfile | null) => void;
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
 * Mantiene estado local de sesión, perfil y draft del onboarding.
 * La hidratación se hace manualmente para evitar hydration mismatch en App Router.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      onboardingDraft: createInitialDraft(),
      isOnboardingCompleted: false,
      profile: null,

      setToken: (token) => set({ token }),

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
          onboardingDraft: createInitialDraft(),
          isOnboardingCompleted: false,
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
        onboardingDraft: state.onboardingDraft,
        isOnboardingCompleted: state.isOnboardingCompleted,
        profile: state.profile,
      }),
      skipHydration: true,
    },
  ),
);