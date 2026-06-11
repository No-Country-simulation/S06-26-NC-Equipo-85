# Atomic Design en `@app/ui` — Arquitectura de la librería UI

> Por qué los componentes se organizan en `atoms/` y `molecules/`, por qué cada uno
> es una carpeta con su `index.ts`, cómo eso impacta el desarrollo profesional, y
> cómo seguir la convención sin perderse. Aplicado al paquete real `packages/ui`.

---

## La idea: construir UI como química

**Atomic Design** (de Brad Frost) propone pensar la interfaz no como "pantallas",
sino como un sistema de piezas que se componen, de menor a mayor complejidad:

```
átomos  →  moléculas  →  organismos  →  templates  →  páginas
```

App BiT usa los primeros niveles, que son los que viven en una librería reutilizable:

| Nivel | Qué es | Ejemplos reales en el repo |
|---|---|---|
| **Átomo** | Primitivo indivisible. No se puede descomponer en algo UI más chico y seguir siendo útil. | `Button`, `Input`, `Badge`, `Avatar`, `Spinner`, `Label`, `Textarea`, `EmojiCheckIn` |
| **Molécula** | Composición de átomos con un propósito concreto. Presentacional (recibe datos por props). | `CourseCard`, `JobCard`, `MentorCard`, `MoodBanner`, `NotificationToast` |
| **Organismo** | Sección compleja que combina moléculas. | *(reservado para fases posteriores)* |

> La regla práctica para decidir el nivel: si lo podés usar en cualquier pantalla sin
> contexto, es un **átomo**. Si junta varios átomos para resolver *una cosa* del
> dominio (mostrar un curso, un banner de ánimo), es una **molécula**. Un `JobCard`
> es molécula porque combina `Card` + `Badge` + `Button`.

Cómo se ve en disco (`packages/ui/src/`):

```
src/
├── atoms/
│   ├── button/
│   │   ├── button.tsx
│   │   ├── button.stories.tsx
│   │   └── index.ts
│   ├── input/  …
│   └── …
├── molecules/
│   ├── course-card/
│   │   ├── course-card.tsx
│   │   ├── course-card.stories.tsx
│   │   └── index.ts
│   └── …
├── lib/utils.ts        # cn()
├── styles/index.css    # tokens --bit-*, mapeo shadcn
└── index.ts            # barrel público (@app/ui)
```

`organisms/` aún no existe: está reservado. No lo crees hasta que haya un organismo
real que ubicar (la convención está documentada así en `packages/ui/README.md`).

---

## Por qué cada componente es **una carpeta** (no un archivo suelto)

Podrías tener `button.tsx` suelto. En vez de eso, cada componente es una carpeta
`button/` con tres archivos. La razón es **colocation** (co-ubicación): todo lo que
pertenece a un componente vive junto.

```
button/
├── button.tsx          # implementación
├── button.stories.tsx  # documentación + interaction tests
└── index.ts            # puerta de entrada pública del componente
```

Beneficios concretos:

- **Todo lo del componente en un solo lugar.** Para entender `Button` abrís *una*
  carpeta y ves su código, su doc y sus tests juntos. No hay que cazar el story en
  otro árbol de directorios.
- **Escala sin desordenar.** El día que `Button` necesite un test unitario
  (`button.test.tsx`), un sub-componente (`button-group.tsx`) o un hook
  (`use-button.ts`), entra en la misma carpeta sin tocar nada de afuera. Un archivo
  suelto no te da ese espacio.
- **Mover o borrar es atómico.** ¿Renombrás o eliminás el componente? Movés/borrás
  *la carpeta*. No quedan archivos huérfanos desperdigados.

---

## Por qué cada carpeta tiene su `index.ts` (el patrón *barrel*)

Cada componente expone un `index.ts` mínimo:

```ts
// src/atoms/button/index.ts
export * from "./button";
```

Y hay un **barrel raíz** que reúne todos (`src/index.ts`):

```ts
export * from "./atoms/button";
export * from "./atoms/input";
// … todos los átomos
export * from "./molecules/job-card";
export * from "./molecules/course-card";
// … todas las moléculas
export { cn } from "./lib/utils";
```

Esto crea **dos niveles de barrel** y cada uno cumple una función distinta:

### 1. El `index.ts` de cada carpeta = la API pública del componente

Es la **fachada**. Dice "esto es lo que el componente ofrece al mundo". El detalle de
que la implementación está en `button.tsx` queda oculto: quien importa usa la carpeta,
no el archivo interno.

```ts
import { Button } from "@app/ui/atoms/button";   // ✅ usa el index.ts
//                                  ↑ no necesita saber que es button.tsx
```

Esto te da **libertad de refactor**: mañana partís `button.tsx` en tres archivos
internos y, mientras el `index.ts` siga exportando `Button`, *nadie afuera se entera
ni se rompe nada*. La frontera pública es estable aunque el interior cambie.

### 2. El `index.ts` raíz = la API pública del paquete `@app/ui`

Es lo que permite que la app escriba imports limpios:

```tsx
// En apps/web — un solo origen para todo:
import { Button, JobCard, cn } from "@app/ui";
```

en lugar de rutas largas y frágiles (`@app/ui/src/atoms/button/button`). El
`package.json` de `@app/ui` formaliza estas puertas con su mapa de `exports`:

```jsonc
"exports": {
  ".":            "./src/index.ts",          // @app/ui
  "./atoms/*":    "./src/atoms/*/index.ts",  // @app/ui/atoms/button
  "./molecules/*":"./src/molecules/*/index.ts",
  "./lib/*":      "./src/lib/*.ts",
  "./styles.css": "./src/styles/index.css"
}
```

Fijate que `./atoms/*` apunta a `…/atoms/*/index.ts`: el mapa de exports **depende**
de que cada componente tenga su `index.ts`. Por eso no es opcional — es lo que hace
que `@app/ui/atoms/button` resuelva.

---

## Cómo impacta en el desarrollo profesional

Esta estructura no es decoración; cambia cómo trabaja un equipo:

- **Imports estables = refactors baratos.** Como todo entra por barrels, podés
  reorganizar el interior de `packages/ui` sin un find-and-replace masivo en la app.
  La superficie de import (`@app/ui`) no se mueve. En un equipo de hackathon con
  varias manos, esto evita los conflictos de merge por rutas.
- **Onboarding rápido.** Un dev nuevo no necesita un mapa: "los primitivos están en
  `atoms/`, las composiciones en `molecules/`, cada uno con su story". La estructura
  *enseña* dónde va cada cosa.
- **Reutilización forzada por diseño.** La convención del proyecto es tajante: *los
  componentes reutilizables viven en `packages/ui`, no se recrean primitivos en
  `apps/web`*. Eso evita el anti-patrón clásico de tener tres botones distintos en
  tres pantallas. Hay un solo `Button`, y es el de Amanecer.
- **Consistencia del design system.** Cada átomo carga las reglas de Amanecer una
  vez (p. ej. `destructive → granate`, reservado a CVV). Si todos componen desde esos
  átomos, el design system se respeta solo, sin que cada dev tenga que recordar la
  paleta.
- **Testeo y documentación garantizados.** Como el `.stories.tsx` está *en la misma
  carpeta*, la regla "todo componente trae su story" es visible y fácil de exigir en
  review: si una carpeta no tiene `.stories.tsx`, salta a la vista.
- **Agnóstico de framework = portable.** Ningún archivo de `src/` puede importar
  `next/*` ni `next-intl` (lo bloquea ESLint). Esto mantiene la librería pura: se
  podría consumir desde otra app no-Next sin tocar nada. Es disciplina de librería
  profesional, no de "carpeta de componentes de una app".

---

## Recomendaciones para continuar la arquitectura (y no perderse)

Una **checklist** para cada componente nuevo, derivada de `packages/ui/README.md`:

1. **Decidí el nivel correcto.** ¿Primitivo sin contexto → `atoms/`. ¿Compone átomos
   para algo del dominio → `molecules/`. Ante la duda, empezá en `atoms/`; promovés a
   molécula cuando empiece a juntar piezas.
2. **Carpeta + 3 archivos, siempre el mismo molde:**
   ```
   <nombre>/
   ├── <nombre>.tsx
   ├── <nombre>.stories.tsx
   └── index.ts   →  export * from "./<nombre>"
   ```
   Usá `kebab-case` para carpeta y archivo (`mood-banner/mood-banner.tsx`),
   `PascalCase` para el componente (`MoodBanner`).
3. **Re-exportá en el barrel raíz** (`src/index.ts`). Si te lo saltás, el componente
   existe pero la app no lo puede importar desde `@app/ui`. Es el error de despiste
   más común.
4. **Importá hacia adentro por ruta relativa, hacia afuera por barrel.** Dentro del
   paquete, `import { cn } from "../../lib/utils"`; un átomo dentro de una molécula,
   por ruta relativa también. La app, en cambio, importa de `@app/ui`.
5. **Story con `title` correcto** (`Atoms/…` o `Molecules/…`), `tags: ["autodocs"]`,
   una story por variante, y `play` si es interactivo (ver `specs/learning/storybook.md`).
6. **Respetá la frontera de framework.** Nada de `next/*`/`next-intl`. Textos → props
   con default en español; navegación → slot `onAction`/`action` que la app rellena
   con su `<Link>`; datos → por props (las moléculas son presentacionales).
7. **Pasá el addon a11y** antes de dar por hecho el componente.

### Errores a evitar

| Anti-patrón | Por qué duele |
|---|---|
| Crear un primitivo en `apps/web` | Rompe la fuente única; aparecen botones duplicados |
| Componente sin `index.ts` | El mapa de `exports` no lo resuelve; imports rotos |
| Olvidar el re-export en `src/index.ts` | El componente es invisible desde `@app/ui` |
| Importar `next/*` en `packages/ui` | ESLint lo bloquea; mata la portabilidad |
| Meter lógica de datos/fetch en una molécula | Deben ser presentacionales; los datos llegan por props (TanStack Query los alimenta desde la app) |
| Saltar de átomo a "página" sin molécula | Perdés el nivel reutilizable intermedio |

---

## Resumen

| Decisión | Por qué |
|---|---|
| `atoms/` vs `molecules/` | Separa primitivos reutilizables de composiciones del dominio |
| Carpeta por componente | Colocation: código + story + tests juntos; escala sin desorden |
| `index.ts` por carpeta | Fachada estable → refactor interno libre sin romper imports |
| Barrel raíz `src/index.ts` | Una sola puerta: `import { … } from "@app/ui"` |
| `exports` en package.json | Formaliza las puertas; depende de los `index.ts` |
| Agnóstico de Next | Librería portable y pura (lo refuerza ESLint) |
| Moléculas presentacionales | Datos por props; el estado de servidor vive en TanStack Query |
| `organisms/` reservado | No se crea hasta tener un organismo real |

Referencia del proyecto: `packages/ui/README.md` · Atomic Design (Brad Frost):
https://atomicdesign.bradfrost.com/
