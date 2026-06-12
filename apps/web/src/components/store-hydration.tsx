"use client";

import { useEffect } from "react";

import { useHealthStore } from "@/store/health-store";
import { useUIStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";

/**
 * Rehidrata los stores persistidos después del montaje en cliente.
 * Los stores usan `skipHydration: true`, de modo que el primer render del
 * servidor y el primer render del cliente coinciden (sin hydration mismatch).
 */
export function StoreHydration() {
  useEffect(() => {
    void useUserStore.persist.rehydrate();
    void useUIStore.persist.rehydrate();
    void useHealthStore.persist.rehydrate();
  }, []);

  return null;
}
