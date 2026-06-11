# Arquitectura Turborepo — Por qué, cómo escala y cómo impacta

> Por qué App BiT es un monorepo con Turborepo + pnpm workspaces, cómo está cableado
> el pipeline real (`turbo.json`), cómo escala a más paquetes y apps, y qué cambia en
> el día a día del desarrollo. Aplicado a la estructura concreta del repo.

---

## El punto de partida: qué es un monorepo aquí

Un **monorepo** es un solo repositorio que contiene varios paquetes que se publican o
consumen entre sí. App BiT tiene una app y tres paquetes internos:

```
.
├── apps/
│   └── web/            # Next.js 16 — la aplicación (consume todo lo demás)
├── packages/
│   ├── config/         # @app/config — ESLint + Prettier + tsconfig compartidos
│   ├── env/            # @app/env   — validación de env vars (@t3-oss/env + Zod)
│   └── ui/             # @app/ui    — librería "Amanecer" + Storybook
├── turbo.json          # el pipeline (dev/build/lint/type-check/format)
└── pnpm-workspace.yaml # declara dónde viven los paquetes
```

Dos herramientas distintas, dos trabajos distintos:

- **pnpm workspaces** resuelve *dependencias*: hace que `apps/web` pueda hacer
  `import { Button } from "@app/ui"` aunque `@app/ui` no esté publicado en npm. En el
  `package.json` se referencia con `"@app/ui": "workspace:*"` (aparece como `"*"`).
- **Turborepo** orquesta *tareas*: corre `build`/`lint`/`type-check`/etc. a través de
  todos los paquetes, en el orden correcto, en paralelo, y con caché.

> pnpm = "quién depende de quién". Turbo = "en qué orden corro las tareas y qué puedo
> saltarme porque no cambió".

---

## Por qué esta arquitectura (y no una sola carpeta)

Las tres razones que la justifican en App BiT:

1. **Fronteras explícitas con reglas propias.** `@app/ui` no puede importar `next/*`
   (lo bloquea ESLint) → la librería es portable. `@app/env` centraliza la validación
   de variables de entorno en un lugar testeado. Cada paquete tiene un contrato claro.
   En una carpeta `src/` gigante esas fronteras se difuminan y todo termina
   importando todo.

2. **Reutilización sin publicar a npm.** `@app/config` define una vez ESLint, Prettier
   y `tsconfig`; los demás paquetes lo consumen con `workspace:*`. Cambiás una regla
   de lint en un solo lugar y aplica a todo el monorepo. Sin monorepo, copiarías el
   config en cada repo y se desincronizarían.

3. **Crecer sin fricción.** El plan de App BiT son 6 fases. Cuando aparezca, por
   ejemplo, un paquete de tipos de API compartidos o una segunda app (un panel admin),
   entra en `apps/` o `packages/` y el pipeline lo absorbe sin reconfigurar nada.

---

## El pipeline real: anatomía de `turbo.json`

Este es el `turbo.json` del repo, comentado:

```jsonc
{
  "tasks": {
    "dev": {
      "cache": false,        // dev nunca se cachea: es un proceso vivo
      "persistent": true     // se queda corriendo (no "termina")
    },
    "build": {
      "dependsOn": ["^build"],              // 1º buildea mis dependencias internas
      "outputs": [".next/**", "!.next/cache/**"]  // qué guardar en caché
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    },
    "lint":       { "dependsOn": ["^lint"] },
    "type-check": { "dependsOn": ["^type-check"] },
    "format":     { "cache": false }
  }
}
```

Tres conceptos hacen todo el trabajo:

### El `^` (orden topológico)

`"dependsOn": ["^build"]` significa: **"antes de buildearme a mí, buildeá los
paquetes de los que dependo"**. El `^` = "mis dependencias primero". Como `apps/web`
depende de `@app/ui`, `@app/env` y `@app/config`, turbo arma el grafo y corre las
tareas en el orden correcto solo. Vos nunca escribís "primero ui, después web": turbo
lo deduce del grafo de dependencias de pnpm.

### `outputs` (qué cachear)

`build` declara `[".next/**", "!.next/cache/**"]`: turbo guarda el resultado del build
(menos la caché interna de Next). La próxima vez que corras `build` sin haber tocado
los inputs de ese paquete, turbo **no rebuildea**: restaura el output desde caché en
milisegundos y te muestra `cache hit, replaying logs`.

### `cache: false` / `persistent: true`

`dev` no se cachea (es un servidor vivo, no un artefacto) y es `persistent` (no
"termina", se queda escuchando). `format` tampoco se cachea porque reescribe archivos.

---

## Cómo se ejecutan los comandos

Los scripts raíz (`package.json`) son finos: delegan en turbo.

```jsonc
"scripts": {
  "dev":        "turbo dev",
  "build":      "turbo build",
  "lint":       "turbo lint",
  "type-check": "turbo type-check",
  "format":     "prettier --write \"**/*.{js,jsx,ts,tsx,json,md,yml,yaml,css}\""
}
```

Cuando corrés `pnpm build`, turbo:

1. Lee el grafo de dependencias (de pnpm workspaces).
2. Resuelve el orden con los `dependsOn` (`^build` → deps primero).
3. Corre en **paralelo** todo lo que no tenga dependencias entre sí.
4. **Saltea** (cache hit) lo que no cambió desde la última corrida.

Para correr una tarea en un solo paquete, se usa el filtro de pnpm (no turbo):

```bash
pnpm --filter @app/ui storybook   # solo packages/ui
```

---

## Cómo escala

La propiedad clave de esta arquitectura es que **el costo de una tarea crece con lo
que cambiaste, no con el tamaño del repo**. Dos motores lo logran:

### 1. Caché por contenido

Turbo hashea las entradas de cada tarea (archivos fuente, deps, config). Si el hash no
cambió, restaura el output cacheado en lugar de recalcular. Consecuencias al crecer:

- Tocás solo `@app/ui` → turbo rebuildea `ui` y `web` (que depende de `ui`), pero
  `@app/env` y `@app/config` salen de caché. No pagás por lo que no tocaste.
- En CI, esto se multiplica: con **remote caching** (Vercel u otro backend), la caché
  se comparte entre la máquina de cada dev y el CI. Si un compañero ya buildeó ese
  commit, vos restaurás su resultado en vez de rebuildearlo. Una corrida "fría" de 5
  minutos pasa a segundos.

### 2. Paralelismo guiado por el grafo

Turbo corre en paralelo todo lo independiente y serializa solo lo que de verdad
depende. Con 3 paquetes hoy se nota poco; con 10 paquetes y 2 apps, la diferencia
entre "todo en serie" y "el grafo en paralelo" son minutos por corrida.

### Añadir un paquete (lo que NO hay que reconfigurar)

Para sumar, por ejemplo, `@app/api-types`:

1. Creás `packages/api-types/` con su `package.json` (`"name": "@app/api-types"`).
2. Quien lo use lo agrega como `"@app/api-types": "workspace:*"`.
3. `pnpm install` para que pnpm lo enlace.

Y listo: las tareas (`build`, `lint`, `type-check`) **ya aplican** porque están
definidas a nivel de pipeline, no por paquete. El `^build` lo ubica solo en el orden
correcto. No tocaste `turbo.json`. *Eso* es escalar sin fricción.

---

## Cómo impacta a nivel de desarrollo

| Aspecto | Sin monorepo / sin turbo | Con esta arquitectura |
|---|---|---|
| Cambiar un componente compartido | Publicar paquete, bump de versión, actualizar la app | Editás `@app/ui`, la app lo ve al instante (source, sin build) |
| Config de lint/TS | Copiada y desincronizada por repo | Una sola en `@app/config`, consumida por todos |
| Build repetido sin cambios | Se rebuildea entero cada vez | Cache hit: se saltea |
| Orden de build | Manual y frágil | Deducido del grafo (`^build`) |
| CI lento | Crece con el repo | Crece con el *cambio* (caché + remote cache) |
| Onboarding | "Cloná estos 4 repos y enlazálos" | `git clone` + `pnpm install` y está todo |

Cosas que cambian en tu día a día concreto:

- **Un solo `pnpm install`** en la raíz instala y enlaza todo. No hay `npm link`
  manual entre paquetes.
- **`@app/ui` se consume como fuente TypeScript, sin build.** `apps/web` lo transpila
  vía `transpilePackages: ["@app/ui"]`. Editás un átomo y la app lo refleja al toque,
  sin un paso de compilación de la librería. (Por eso `@app/ui` no tiene script
  `build`: no lo necesita.)
- **El chequeo pre-push es una línea** y aprovecha caché:
  ```bash
  pnpm lint && pnpm type-check && pnpm build
  ```
  La segunda vez, lo que no tocaste sale de caché y termina en segundos.
- **Cuidado con los límites de paquete.** El precio de las fronteras es respetarlas:
  no metas código de app en `@app/ui`, no importes `next/*` en la librería. ESLint lo
  refuerza, pero la disciplina es tuya. Es el trade-off consciente de la arquitectura.

> **Nota de entorno:** pnpm 11 requiere Node 22+. El Dockerfile usa `node:22-alpine`.
> Si tu Node local es 20, usá `npx pnpm@9`, `nvm use 22` o Docker.

---

## Resumen

| Pieza | Rol |
|---|---|
| **pnpm workspaces** | Resuelve dependencias internas (`workspace:*`); un solo install enlaza todo |
| **Turborepo** | Orquesta tareas: orden topológico + paralelismo + caché |
| `apps/web` | La app Next.js; consume los paquetes |
| `@app/ui` / `@app/env` / `@app/config` | Librería UI / validación de env / configs compartidas |
| `dependsOn: ["^build"]` | "Mis dependencias internas primero" — el orden lo deduce turbo |
| `outputs` | Qué guarda turbo en caché para saltarse rebuilds |
| `cache: false` + `persistent` (dev) | dev es un proceso vivo, no un artefacto cacheable |
| Escala porque | El costo crece con el *cambio*, no con el tamaño del repo (caché + grafo) |
| Impacto | Config única, refactors baratos, CI rápido, onboarding de un comando |

Documentación oficial: https://turbo.build/repo/docs · pnpm workspaces:
https://pnpm.io/workspaces
