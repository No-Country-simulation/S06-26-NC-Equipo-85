# `@axe-core/react` — Guía de accesibilidad en runtime

> Auditoría automática de accesibilidad (a11y) mientras desarrollás, directo en la
> consola del navegador. Cómo funciona, cómo se identifican bugs y cómo arrancar.
> En App BiT vive en `apps/web/src/components/axe-core.tsx` y corre **solo en dev**.

> El nombre real del paquete es `@axe-core/react`;

---

## Qué es y por qué existe

**axe-core** es el motor de reglas de accesibilidad más usado de la industria (de
Deque): un conjunto de chequeos que detectan violaciones de WCAG — contraste
insuficiente, inputs sin label, botones sin nombre accesible, roles ARIA mal
puestos, etc. `@axe-core/react` es el adaptador que lo engancha a React: cada vez
que React renderiza, vuelve a auditar el DOM vivo y **escribe las violaciones como
warnings en la consola** del navegador.

La idea de fondo: la accesibilidad no es una fase al final, es un feedback loop
constante. App BiT apunta a **WCAG 2.1 AA** (contraste ≥ 4.5:1, foco visible,
roles/nombres correctos) porque el MVP es para grupos sub-representados; que un
lector de pantalla o el teclado funcionen no es opcional. axe te avisa en el momento,
no en una auditoría tardía.

---

## Cómo funciona en este proyecto

El componente entero, en `apps/web/src/components/axe-core.tsx`:

```tsx
"use client";
import { useEffect } from "react";

export function AxeCore() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;   // (1) solo en dev

    void (async () => {
      try {
        const [{ default: React }, ReactDOM, { default: axe }] =
          await Promise.all([
            import("react"),
            import("react-dom"),
            import("@axe-core/react"),                      // (2) import dinámico
          ]);
        await axe(React, ReactDOM, 1000);                  // (3) audita cada 1000ms
      } catch (error) {
        console.warn(
          "[a11y] @axe-core/react no pudo inicializar (React 19). " +
            "La auditoría de a11y se cubre vía Storybook.",
          error                                            // (4) fallback tolerado
        );
      }
    })();
  }, []);

  return null;   // no pinta nada; solo conecta axe
}
```

Y se monta una sola vez, en el layout raíz (`apps/web/src/app/[locale]/layout.tsx`):

```tsx
{process.env.NODE_ENV === "development" && <AxeCore />}
```

Las cuatro decisiones de diseño:

1. **Solo en desarrollo** (`NODE_ENV !== "development"` → return). axe es pesado y
   no debe correr para usuarios reales; solo te asiste a vos mientras codeás.
2. **Import dinámico** (`import("@axe-core/react")` dentro de la función). Así la
   librería **nunca entra al bundle de producción**: como el componente solo se monta
   en dev y el import es perezoso, el build de prod ni la incluye.
3. **`axe(React, ReactDOM, 1000)`** — el `1000` es el *debounce* en ms: tras cada
   tanda de renders, espera 1s y audita el DOM resultante. Evita auditar 50 veces
   en medio de una animación.
4. **try/catch con fallback** — ver la nota de React 19 abajo. Si axe no arranca, no
   rompe la app: avisa y delega la cobertura a Storybook.

---

## La nota de React 19 (importante)

`@axe-core/react` tiene soporte oficial hasta **React 18**. App BiT usa **React 19**,
donde la API de `react-dom` cambió, y la inicialización **puede fallar**. Por eso el
`try/catch`: si falla, no es un bug del proyecto, es la incompatibilidad conocida
(documentada como "design D7"). El plan de contingencia es explícito:

> La auditoría de a11y **fiable** recae en el **addon a11y de Storybook**
> (`@storybook/addon-a11y`, que usa el mismo motor axe-core sobre cada componente).
> `@axe-core/react` en la app es un *extra best-effort* para dev.

O sea: no confíes únicamente en la consola de la app. La red de seguridad real de
a11y por-componente es Storybook (ver `specs/learning/storybook.md`, sección 4). axe
en la app cubre la página *completa* y compuesta cuando logra arrancar.

---

## Cómo se identifican los bugs (leer un reporte)

Cuando axe arranca bien, abrís la consola del navegador (F12 → Console) en
`http://localhost:3000` y ves algo así por cada violación:

```
New axe issues
  serious: Elements must have sufficient color contrast  (color-contrast)
    <button class="bg-ambar text-white">Continuar</button>
    Fix: https://dequeuniversity.com/rules/axe/.../color-contrast
```

Cómo interpretarlo:

| Campo | Qué te dice |
|---|---|
| **Severidad** | `minor` → `moderate` → `serious` → `critical`. Atacá critical/serious primero. |
| **Regla** (`color-contrast`, `label`, `button-name`…) | Qué chequeo WCAG falló |
| **Nodo DOM** | El elemento exacto culpable — lo podés inspeccionar al toque |
| **Link Deque** | Explicación + cómo arreglarlo |

Las violaciones más frecuentes que vas a ver en App BiT y su arreglo típico:

- **`color-contrast`** — texto que no llega a 4.5:1. Es el caso estrella por la
  paleta cálida. Ejemplo Amanecer: `ámbar` con texto blanco viola contraste → usar
  `cacao` como foreground (ya está mapeado en `--secondary-foreground`).
- **`label` / `form-field-multiple-labels`** — un input sin `<label>` asociado.
  Arreglo: `<Label htmlFor>` apuntando al `id` del input.
- **`button-name`** — un botón con solo un ícono y sin texto accesible. Arreglo:
  `aria-label` descriptivo.
- **`aria-*`** — roles/atributos ARIA inconsistentes. Arreglo: usar el rol nativo
  (un `<button>` real en vez de un `<div onClick>`).

> Mensajes de error de la app siempre con `aria-describedby` y foco visible — es
> convención del proyecto, y axe te marca si te lo saltás.

---

## Guía de inicio (verificar que funciona)

1. **Levantá la app en dev:**
   ```bash
   pnpm dev          # http://localhost:3000
   ```
2. **Abrí la consola** del navegador (F12 → pestaña Console).
3. **Buscá la salida de axe.** Tres escenarios:
   - Ves `New axe issues …` → axe arrancó; corregí lo que reporte.
   - Ves la consola limpia (sin warnings de axe) → arrancó y no hay violaciones en
     esa página. 
   - Ves `[a11y] @axe-core/react no pudo inicializar (React 19)` → es la
     incompatibilidad esperada; pasá a auditar en Storybook.
4. **Auditá por componente en Storybook** (la vía fiable):
   ```bash
   pnpm --filter @app/ui storybook   # :6006 → pestaña Accessibility
   ```

### Probar que detecta algo (sanity check)

Si querés convencerte de que axe está vivo, meté temporalmente una violación obvia
en una página — por ejemplo un botón solo-ícono sin `aria-label`, o texto gris claro
sobre fondo crema — guardá, y mirá si aparece en consola. Después revertilo. Si
aparece, el loop funciona; si no, probablemente estás en el caso React 19 y la
cobertura está en Storybook.

---

## Dónde encaja en la estrategia de a11y de App BiT

| Capa | Herramienta | Cubre | Estado |
|---|---|---|---|
| Por componente | `@storybook/addon-a11y` (axe) | cada átomo/molécula aislado | **fiable**, desde Fase 1 |
| Página completa (dev) | `@axe-core/react` | la app compuesta, en runtime | best-effort (React 19) |
| Tokens de contraste | fondos crema/arena/cacao en Storybook | combinaciones de paleta | manual, visual |
| Fase 5 | tests e2e (Playwright) + axe en CI | flujos completos | planificado |

La regla mental: **axe te ayuda, no te certifica solo**. Detecta lo automatizable
(≈ 30-50% de los problemas WCAG). Lo demás — orden de tabulación lógico, textos
alternativos con sentido, que el foco no se pierda en un modal — sigue siendo
revisión humana. El flujo CVV (modal de crisis no-dismissable) es justo el tipo de
cosa que axe *no* valida del todo y que exige cuidado manual.

---

## Resumen

| Idea | Detalle |
|---|---|
| Qué hace | Audita el DOM en cada render y escribe violaciones WCAG en consola |
| Dónde vive | `apps/web/src/components/axe-core.tsx`, montado en el layout raíz |
| Cuándo corre | **Solo en dev** (`NODE_ENV === "development"`) |
| Por qué no pesa en prod | Import dinámico → fuera del bundle de producción |
| El `1000` | Debounce en ms entre auditorías |
| Caveat React 19 | Puede no inicializar; `try/catch` + fallback a Storybook |
| Red de seguridad real | `@storybook/addon-a11y` (mismo motor axe, por componente) |
| Lo que NO cubre | ~50-70% de WCAG necesita revisión humana (foco, orden, alt con sentido) |

Documentación oficial: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react
· Reglas axe: https://dequeuniversity.com/rules/axe
