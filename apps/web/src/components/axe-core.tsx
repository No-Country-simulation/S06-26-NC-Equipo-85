"use client";

import { useEffect } from "react";

/**
 * Inicializa @axe-core/react SOLO en desarrollo, vía import dinámico, para que
 * las violaciones de accesibilidad se registren como warnings en consola.
 *
 * Nota (design D7): @axe-core/react tiene soporte oficial hasta React 18. Con
 * React 19 la API de `react-dom` cambió y la inicialización puede fallar; por
 * eso se envuelve en try/catch y, si no reporta, la cobertura de a11y recae en
 * el addon a11y de Storybook hasta la Fase 5. El import dinámico mantiene la
 * librería fuera del bundle de producción (este componente sólo se monta en dev).
 */
export function AxeCore() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    void (async () => {
      try {
        const [{ default: React }, ReactDOM, { default: axe }] =
          await Promise.all([
            import("react"),
            import("react-dom"),
            import("@axe-core/react"),
          ]);
        await axe(React, ReactDOM, 1000);
      } catch (error) {
        // React 19 incompatibility tolerated; ver nota arriba.
        console.warn(
          "[a11y] @axe-core/react no pudo inicializar (React 19). " +
            "La auditoría de a11y se cubre vía Storybook.",
          error
        );
      }
    })();
  }, []);

  return null;
}
