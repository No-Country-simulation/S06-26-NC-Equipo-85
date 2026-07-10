# Storybook en `@app/ui` — Guía práctica y rápida

> Cómo levantar, ver, testear y depurar componentes de la librería UI.
> Storybook **10** con `@storybook/react-vite` + Tailwind v4, viviendo en
> `packages/ui`. Todo lo de aquí asume que ya corriste `pnpm install` en la raíz.

---

## Qué es Storybook (en una frase)

Un banco de pruebas aislado para componentes: cada componente se renderiza solo,
fuera de la app, en todos sus estados (variantes, tamaños, estados de error),
para que lo veas, lo pruebes y audites su accesibilidad sin tener que navegar la
app real. En App BiT es la **fuente de verdad visual** del design system "Amanecer".

---

## 1. Levantar

```bash
# Dev server con hot-reload, en http://localhost:6006
pnpm --filter @app/ui storybook
```

El `--filter @app/ui` le dice a pnpm que corra el script solo en `packages/ui`
(ahí vive Storybook, no en `apps/web`). Se abre solo en el navegador; si no, abrí
`http://localhost:6006` a mano.

```bash
# Build estático (lo que se publicaría/desplegaría). Cacheado por turbo.
pnpm --filter @app/ui build-storybook   # genera packages/ui/storybook-static/
```

> El build estático está declarado como tarea en `turbo.json` (`build-storybook`,
> con `dependsOn: ["^build"]`), así que turbo lo cachea: si no tocaste nada, la
> segunda corrida es instantánea.

---

## 2. Visualizar — cómo leer la interfaz

Cuando abrís `:6006`:

- **Sidebar izquierdo** — el árbol de stories. Se organiza por el `title` de cada
  archivo: `Atoms/Button`, `Molecules/MoodBanner`, etc. Cada entrada hija (Primary,
  Secondary, AllVariants…) es una *story* = un estado concreto del componente.
- **Canvas (centro)** — el componente renderizado en vivo.
- **Toolbar (arriba)** — incluye el selector de **fondos** del proyecto:
  `crema #FAF1E6`, `arena #EFDFC4`, `cacao #2B1E16`. Sirve para verificar que un
  componente se ve bien sobre los tres neutros de Amanecer (configurado en
  `.storybook/preview.ts`).
- **Panel inferior** — pestañas clave:
  - **Controls** — editás las props en vivo (cambiar `variant`, `size`, texto…)
    sin tocar código. Los controles salen de los `argTypes` de la story.
  - **Accessibility** — el reporte del addon a11y (ver sección 4).
  - **Interactions** — el paso a paso de las `play` functions (ver sección 3).

Detalle del proyecto: un *decorator global* (`withTheme` en `.storybook/preview.ts`)
envuelve **toda** story con `font-sans text-foreground p-6`, así que ves la
tipografía Inter/Fraunces y un padding cómodo sin configurarlo por componente.
Las fuentes se cargan vía `.storybook/preview-head.html` (Google Fonts) — esto
sustituye a `next/font`, que no existe dentro de Storybook.

---

## 3. Testear — interaction tests con `play`

Storybook no solo muestra: **prueba**. Las *interaction tests* viven dentro de la
propia story en una función `play` que simula al usuario (clicks, teclado) y hace
aserciones. Las utilidades vienen de `storybook/test` (son core desde Storybook 9+;
no hay que instalar nada).

Ejemplo real, de `src/atoms/emoji-check-in/emoji-check-in.stories.tsx`:

```tsx
import { expect, fn, userEvent, within } from "storybook/test";

export const SelectByClick: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const triste = canvas.getByRole("radio", { name: "Triste" });

    await userEvent.click(triste);

    await expect(triste).toHaveAttribute("aria-checked", "true");
    await expect(args.onChange).toHaveBeenCalledWith("triste");
  },
};
```

Cómo se prueba esto en la práctica:

1. Abrí la story `Atoms/EmojiCheckIn → SelectByClick`.
2. Mirá el panel **Interactions**: Storybook ejecuta el `play` y muestra cada paso
   (click, assert) con un ✓ verde o un ✗ rojo. Podés rebobinar paso a paso.
3. Si una aserción falla, el paso queda rojo y te dice exactamente qué esperaba vs.
   qué obtuvo.

Convenciones del proyecto para `play`:
- `getByRole(...)` en vez de selectores por clase → si el test encuentra el rol, el
  componente es accesible (doble beneficio: testeás comportamiento *y* semántica).
- `args.onChange` se declara con `fn()` en el `meta` para poder espiar las llamadas.
- Patrones de teclado: `userEvent.keyboard("{ArrowRight}{Enter}")` — clave para
  componentes con navegación por flechas (radios, menús).

> **Nota:** hoy las interactions se corren **visualmente** en el navegador (panel
> Interactions). No hay un `test-runner` headless ni el addon de Vitest cableados
> en `.storybook/main.ts`. Si en una fase futura se quiere correr todas las stories
> en CI de un tirazo, se agregaría `@storybook/test-runner` (o el addon Vitest); por
> ahora, la verificación es abrir la story y mirar el panel.

---

## 4. Ver errores de accesibilidad (a11y)

El addon `@storybook/addon-a11y` corre **axe-core** sobre cada story y reporta en la
pestaña **Accessibility**. Está declarado en `.storybook/main.ts` y la regla
`color-contrast` está explícitamente activada en `.storybook/preview.ts` (objetivo
WCAG 2.1 AA, contraste ≥ 4.5:1 de Amanecer).

Cómo leer el reporte:

- **Violations** (rojo) — fallos reales que hay que corregir. Cada uno trae el nodo
  DOM culpable, la regla violada y un link a la explicación de Deque.
- **Passes** (verde) — chequeos que pasaron.
- **Incomplete** — axe no pudo decidir solo; revisar a mano.

El caso más común que vas a ver acá es **contraste**: si pintás texto sobre un fondo
que no llega a 4.5:1, salta en Violations. Por eso existen los fondos crema/arena/
cacao en la toolbar — para probar el componente sobre cada neutro y cazar el
contraste antes de que llegue a la app. Regla de Amanecer relacionada: **`ámbar`
nunca lleva texto blanco** (usar `cacao`); si lo violás, el addon te lo marca.

Flujo recomendado al crear/editar un componente: abrí su story → pestaña
Accessibility → que no haya ninguna *Violation* crítica. Eso es el paso 5 del
checklist de `packages/ui/README.md`.

---

## 5. Crear un componente nuevo (con su story)

El flujo canónico (idéntico al de `packages/ui/README.md`, resumido):

```
packages/ui/src/atoms/<nombre>/
├── <nombre>.tsx          # el componente (agnóstico de Next: nada de next/*)
├── <nombre>.stories.tsx  # las stories
└── index.ts              # export * from "./<nombre>"
```

1. **Componente** — `src/atoms/<nombre>/<nombre>.tsx`. Usá `cn` desde `../../lib/utils`
   e importá primitivos por ruta relativa. Prohibido `next/*` y `next-intl` (lo
   bloquea ESLint); los textos van como props con default en español.

2. **Story** — `src/atoms/<nombre>/<nombre>.stories.tsx`. Estructura mínima
   (basada en `button.stories.tsx`):

   ```tsx
   import type { Meta, StoryObj } from "@storybook/react-vite";
   import { MiComponente } from "./mi-componente";

   const meta = {
     title: "Atoms/MiComponente",        // define dónde aparece en el sidebar
     component: MiComponente,
     parameters: { layout: "centered" }, // "centered" | "padded" | "fullscreen"
     tags: ["autodocs"],                 // genera la página de Docs automática
     argTypes: {
       variant: { control: "select", options: ["default", "secondary"] },
     },
   } satisfies Meta<typeof MiComponente>;

   export default meta;
   type Story = StoryObj<typeof meta>;

   export const Primary: Story = { args: { children: "Continuar" } };
   ```

   Reglas del proyecto:
   - `title` con el prefijo correcto: `Atoms/…` o `Molecules/…`.
   - Una story **por cada variante** (Primary, Secondary, Ghost, Destructive…) +
     una `AllVariants` que las muestre juntas con un `render`.
   - `tags: ["autodocs"]` siempre → Storybook arma la página de documentación sola.
   - Componentes interactivos → agregar una `play` (sección 3).

3. **Barrel local** — `src/atoms/<nombre>/index.ts`:
   ```ts
   export * from "./<nombre>";
   ```

4. **Barrel raíz** — agregar la línea en `src/index.ts` para que la app lo importe
   desde `@app/ui`:
   ```ts
   export * from "./atoms/<nombre>";
   ```

5. **Verificar** — la story aparece sola en el sidebar (gracias al glob
   `../src/**/*.stories.@(...)` de `.storybook/main.ts`); revisá Controls,
   Interactions y Accessibility.

> **shadcn CLI:** `pnpm dlx shadcn@latest add <comp>` desde `packages/ui` genera un
> archivo *plano*. Después hay que moverlo a `src/atoms/<comp>/<comp>.tsx`, crear su
> `index.ts` y sumarlo al barrel — el CLI no respeta la convención de carpetas.

---

## 6. Depurar problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| La story no aparece en el sidebar | El archivo no matchea el glob o el `title` está mal | Que sea `*.stories.tsx` bajo `src/**` y tenga `export default meta` con `title` |
| "No se ven los estilos / Tailwind" | El plugin de Tailwind no compiló | Tailwind v4 entra por `viteFinal` en `.storybook/main.ts`; reiniciá el server |
| Las fuentes se ven genéricas | Storybook no usa `next/font` | Se cargan en `.storybook/preview-head.html`; verificá esa etiqueta `<link>` |
| El componente importa `next/*` y rompe | Violación de la regla "agnóstico de framework" | Sacá el import; pasá el dato/acción por props (ESLint lo bloquea igual) |
| Controls vacío | Faltan `argTypes` o el componente no tipa sus props | Definí `argTypes` en el `meta` y tipá las props del componente |
| Cambios no se reflejan | Caché de Vite colgada | Cortá con Ctrl+C y relanzá `pnpm --filter @app/ui storybook` |

---

## Resumen

| Acción | Comando / lugar |
|---|---|
| Levantar dev | `pnpm --filter @app/ui storybook` → `:6006` |
| Build estático | `pnpm --filter @app/ui build-storybook` |
| Ver props en vivo | Panel **Controls** |
| Probar interacción | Función `play` + panel **Interactions** |
| Auditar a11y | Panel **Accessibility** (addon a11y + axe) |
| Probar sobre neutros | Selector de **fondos** crema/arena/cacao (toolbar) |
| Config global | `.storybook/main.ts` (addons, glob, Tailwind) y `preview.ts` (tema, fondos, a11y) |
| Crear componente | carpeta `<nombre>/` con `.tsx` + `.stories.tsx` + `index.ts`, luego barrel raíz |

Documentación oficial: https://storybook.js.org/docs
