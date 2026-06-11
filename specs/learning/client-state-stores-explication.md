# Stores Zustand en `apps/web` — Explicación

> Configuración de `userStore`, `uiStore` y `healthStore` con `persist` selectivo.
> Qué hace cada uno, qué estado de UI maneja, y cómo funciona la hidratación bajo App Router.

---

## El principio que ordena todo

Estos tres stores guardan **solo estado de UI, sesión y datos locales**. Nada que venga del servidor (cursos, vacantes, mentores) vive aquí: eso es territorio de TanStack Query desde la Fase 2. La razón es evitar duplicar el estado del servidor en dos sitios, que es la causa número uno de bugs de "datos que no coinciden". Zustand maneja lo que el cliente posee; TanStack Query maneja lo que el servidor posee.

Con eso claro, lo que de verdad distingue a cada store es **qué persiste a localStorage y qué no**:

| Store | En memoria | Persiste a localStorage |
|---|---|---|
| userStore | token, borrador onboarding, perfil confirmado | solo token + borrador |
| uiStore | theme, locale, sidebar, modal activo | solo theme + locale |
| healthStore | check-in del día, historial semanal, flag CVV | todo |

La columna de la derecha es el corazón de la configuración.

---

## userStore

Mantiene tres cosas en memoria: el `token` de sesión, el `draft` del onboarding (el paso actual + los datos que el usuario ya escribió) y el `profile` confirmado.

Pero `partialize` solo persiste `token` y `draft`:

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      token: null,
      draft: { step: 0, data: {} },   // borrador del wizard
      profile: null,                  // perfil confirmado

      setDraft: (draft) => set({ draft }),
      setProfile: (profile) => set({ profile }),

      reset: () => {
        set({ token: null, draft: { step: 0, data: {} }, profile: null });
        useUserStore.persist.clearStorage(); // borra la entrada de localStorage
      },
    }),
    {
      name: "bit-user",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ token: s.token, draft: s.draft }), // solo esto se guarda
      skipHydration: true,
    }
  )
);
```

Lo importante de entender: **el perfil confirmado no se persiste a propósito**. Una vez que el usuario termina el onboarding, su perfil real vive en el servidor y lo traes con TanStack Query (`useProfile`). Persistirlo aquí sería duplicarlo y arriesgarte a mostrar una versión vieja. El `draft`, en cambio, sí se persiste porque mientras no se envía es puramente local: si el usuario cierra el browser a medio wizard, al volver retoma en el mismo paso con sus datos. Eso es lo que cubre el escenario "Onboarding draft persists across sessions".

El `reset()` hace dos cosas, no una: vuelve el estado en memoria a los valores por defecto **y** borra la entrada de localStorage con `clearStorage()`. Si solo hicieras `set(defaults)`, el token quedaría borrado en memoria pero seguiría escrito en disco, y al recargar reaparecería. Por eso el logout tiene que tocar las dos capas.

---

## uiStore

Estos son los estados de UI exactos que maneja:

- `theme` — `'light' | 'dark' | 'system'`
- `locale` — `'pt' | 'es'`
- `sidebarOpen` — `boolean`
- `activeModalId` — `string | null` (qué modal está abierto, o ninguno)

De estos cuatro, **solo `theme` y `locale` persisten**. El sidebar y el modal son transitorios: representan "dónde está el usuario ahora mismo", no una preferencia.

```ts
partialize: (s) => ({ theme: s.theme, locale: s.locale }),
```

La razón es de UX, no técnica. Imagina que persistieras `activeModalId`: el usuario abre un modal, recarga la página por cualquier motivo, y el modal reaparece solo, sin que él haya hecho nada. Se sentiría roto. El tema y el idioma sí son preferencias que deben sobrevivir, porque el usuario espera que la app recuerde cómo le gusta verla. Eso cubre el escenario "Transient UI is not persisted": tras recargar no hay modal activo, pero el tema y el idioma siguen ahí.

---

## healthStore

Mantiene el check-in del día (`mood` + `date`), el `weeklyHistory` local y un flag `cvvAlert`. Aquí persiste todo.

```ts
{
  todayCheckIn: { mood: null, date: null }, // ej. { mood: 'cansado', date: '2026-06-11' }
  weeklyHistory: [],
  cvvAlert: false,
}
```

El escenario "una vez al día" funciona guardando la **fecha** del check-in, no solo el ánimo. Un selector compara la fecha guardada con la de hoy:

```ts
const isCheckedInToday = (s) =>
  s.todayCheckIn.date === format(new Date(), "yyyy-MM-dd");
```

Si coincide, la app sabe que ya hizo check-in hoy y muestra el ánimo guardado en vez de pedirlo otra vez, incluso si cerró y volvió a abrir.

### Sobre `cvvAlert` — quién decide la crisis

Este flag es un **mecanismo de consumo**, no el lugar donde se decide la crisis. El spec dice "cuando la nota semanal baja de 4, `cvvAlert` se pone en `true`". La pregunta clave es *quién* evalúa ese "baja de 4".

Para algo tan delicado, eso debería venir decidido en la respuesta de `POST /salud` y el store solo guardar el resultado:

```ts
set({ cvvAlert: respuesta.alerta });
```

El store refleja la decisión del servidor; no la toma. Si el umbral se calcula en el cliente, esa lógica puede fallar o saltarse. El modal de la Fase 3 lee este flag, pero el flag no debería nacer del frontend.

---

## skipHydration: el patrón que evita los warnings de hidratación

Este es el detalle más sutil y el que más problemas da con App Router. El problema es así:

1. El servidor renderiza la página con el estado **por defecto** del store (en el servidor no hay localStorage).
2. El primer render del cliente tiene que coincidir exactamente con lo que mandó el servidor.
3. Pero el middleware `persist`, por defecto, lee localStorage de forma síncrona al crear el store. Entonces el primer render del cliente trae ya los valores persistidos, que **no coinciden** con el render del servidor. React lo detecta y lanza el warning de hidratación.

`skipHydration: true` rompe ese choque: le dice al middleware que **no** rehidrate solo al crear el store. Así el primer render del cliente arranca con los defaults, igual que el servidor, y coinciden. Después, ya montado el componente, tú disparas la rehidratación a mano:

```ts
"use client";
useEffect(() => {
  useUserStore.persist.rehydrate();
  useUiStore.persist.rehydrate();
  useHealthStore.persist.rehydrate();
}, []);
```

El orden queda:

```
render servidor (defaults)
  → render cliente (defaults, coinciden, sin warning)
    → useEffect corre
      → rehidrata desde localStorage
        → re-render con los valores guardados
```

El usuario ve un parpadeo mínimo o nulo, y la consola queda limpia. Eso es exactamente el escenario "No hydration mismatch".

Conviene meter ese `useEffect` en un componente cliente que envuelva la app (junto a tus providers), para hacerlo una sola vez.

---

## La regla de borde

El último escenario del spec ("Server data stays out of Zustand") no es código, es una regla de revisión: si abres cualquiera de los tres stores y encuentras una lista de cursos, vacantes o mentores, está mal. Esos datos los pide y cachea TanStack Query. Zustand se queda con sesión, preferencias de UI y el check-in. Mantener esa frontera limpia es lo que hace que el modelo de estado no se vuelva un nudo más adelante.

---

## Resumen

| Decisión | Por qué |
|---|---|
| Solo UI/sesión/local en Zustand | Evita duplicar estado del servidor (eso es TanStack Query) |
| `partialize` en userStore (token + draft) | El perfil confirmado vive en el servidor; el draft es local hasta enviarse |
| `reset()` con `clearStorage()` | El logout debe limpiar memoria **y** disco, o el token reaparece al recargar |
| `partialize` en uiStore (theme + locale) | Sidebar y modal son transitorios; persistirlos rompería la UX al recargar |
| Fecha en el check-in | Permite saber si ya hubo check-in hoy comparando con la fecha actual |
| `cvvAlert` viene del servidor | La decisión de crisis no debe nacer en el cliente |
| `skipHydration` + `rehydrate()` en `useEffect` | Iguala el primer render cliente/servidor y elimina los warnings de hidratación |
