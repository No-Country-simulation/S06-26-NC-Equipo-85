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
  profile: UserProfile | null;
  setToken: (token: string | null) => void;
  setDraftStep: (step: number) => void;
  updateDraftData: (data: Record<string, unknown>) => void;
  setProfile: (profile: UserProfile | null) => void;
  /** Limpia el estado y la entrada persistida (logout). */
  reset: () => void;
};

const initialDraft: OnboardingDraft = { step: 0, data: {} };

export const USER_STORE_KEY = "bit-user";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      onboardingDraft: initialDraft,
      profile: null,
      setToken: (token) => set({ token }),
      setDraftStep: (step) =>
        set((s) => ({ onboardingDraft: { ...s.onboardingDraft, step } })),
      updateDraftData: (data) =>
        set((s) => ({
          onboardingDraft: {
            ...s.onboardingDraft,
            data: { ...s.onboardingDraft.data, ...data },
          },
        })),
      setProfile: (profile) => set({ profile }),
      reset: () => {
        set({ token: null, onboardingDraft: initialDraft, profile: null });
        void useUserStore.persist.clearStorage();
      },
    }),
    {
      name: USER_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Sólo persistimos token + draft del onboarding.
      partialize: (state) => ({
        token: state.token,
        onboardingDraft: state.onboardingDraft,
      }),
      // Patrón anti-hydration-mismatch (App Router): rehidratar tras montar.
      skipHydration: true,
    }
  )
);
