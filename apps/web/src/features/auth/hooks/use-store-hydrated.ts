"use client";

import { useSyncExternalStore } from "react";
import { useUserStore } from "@/store/user-store";

/**
 * Indica si el userStore persistido ya terminó de rehidratarse.
 *
 * El store usa `skipHydration: true` y la rehidratación se dispara desde
 * `StoreHydration` tras el montaje. Hasta que termina, `token` vale `null`
 * aunque exista sesión en `localStorage`; por eso los guards deben esperar este
 * flag antes de decidir un redirect (si no, rebotarían a un usuario logueado en
 * cada refresh).
 *
 * Se modela como store externo con `useSyncExternalStore`: el snapshot lee
 * `hasHydrated()` y la suscripción reacciona a `onFinishHydration`. El snapshot
 * del servidor es `false` (no hay storage en SSR).
 */
export function useStoreHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => useUserStore.persist.onFinishHydration(onStoreChange),
    () => useUserStore.persist.hasHydrated(),
    () => false,
  );
}
