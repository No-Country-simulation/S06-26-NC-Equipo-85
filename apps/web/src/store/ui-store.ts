import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "light" | "dark";
export type Locale = "es" | "pt";

type UIState = {
  theme: Theme;
  locale: Locale;
  sidebarOpen: boolean;
  activeModal: string | null;
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
};

export const UI_STORE_KEY = "bit-ui";

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "light",
      locale: "es",
      sidebarOpen: false,
      activeModal: null,
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
    }),
    {
      name: UI_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      // UI transitoria (sidebar, modal) nunca sobrevive a un reload.
      partialize: (state) => ({ theme: state.theme, locale: state.locale }),
      skipHydration: true,
    }
  )
);
