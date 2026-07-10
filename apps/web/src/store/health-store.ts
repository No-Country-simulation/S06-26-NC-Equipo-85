import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Mood } from "@app/ui";

// Puntaje 1–5 por mood para el seguimiento de bienestar.
export const MOOD_SCORE: Record<Mood, number> = {
  feliz: 5,
  cansado: 4,
  triste: 2,
  ansioso: 2,
  sobrecargado: 1,
};

export type CheckIn = {
  /** Fecha local YYYY-MM-DD. */
  date: string;
  mood: Mood;
  score: number;
};

type HealthState = {
  today: CheckIn | null;
  /** Historial de los últimos 7 días. */
  history: CheckIn[];
  /** Bandera para el modal de crisis (Fase 3). */
  cvvAlert: boolean;
  registerCheckIn: (mood: Mood, date?: string) => void;
  isCheckedInToday: (date?: string) => boolean;
  reset: () => void;
};

const todayStr = () => new Date().toISOString().slice(0, 10);

export const HEALTH_STORE_KEY = "bit-health";

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      today: null,
      history: [],
      cvvAlert: false,
      registerCheckIn: (mood, date = todayStr()) => {
        const entry: CheckIn = { date, mood, score: MOOD_SCORE[mood] };
        const history = [
          ...get().history.filter((c) => c.date !== date),
          entry,
        ]
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-7);

        const weeklyAvg =
          history.reduce((sum, c) => sum + c.score, 0) / history.length;

        set({
          today: entry,
          history,
          // CVV: el promedio semanal cae por debajo de 4.
          cvvAlert: weeklyAvg < 4,
        });
      },
      isCheckedInToday: (date = todayStr()) => get().today?.date === date,
      reset: () => {
        set({ today: null, history: [], cvvAlert: false });
        void useHealthStore.persist.clearStorage();
      },
    }),
    {
      name: HEALTH_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        today: state.today,
        history: state.history,
        cvvAlert: state.cvvAlert,
      }),
      skipHydration: true,
    }
  )
);
