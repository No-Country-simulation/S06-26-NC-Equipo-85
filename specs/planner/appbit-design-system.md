# App BiT — Design System "Amanecer"

> Fusión de las propuestas Raíz (armonía análoga cálida) y Horizonte (complementaria dividida)
> 10 colores · dominante cálida · cada color asignado a una sensación/emoción

---

## Concepto

La paleta recorre un amanecer: la noche azul (Horizonte) cediendo ante la terracota, el coral y el ámbar del alba (Raíz), sobre una base de arena y crema. La metáfora conecta directamente con la misión del producto: cada check-in diario es un nuevo comienzo, y la app acompaña el paso de la incertidumbre (azul, calma, sostén) hacia la acción y la oportunidad (cálidos, energía, avance).

---

## Fundamento de teoría del color

**Estructura armónica: análoga cálida con acento complementario.**

Los colores de marca cálidos ocupan un segmento análogo contiguo del círculo cromático (~12° a ~45°: terracota, coral, ámbar). El azul horizonte (~222°) se sitúa casi exactamente en el complemento de ese segmento, actuando como contrapunto frío único. Esta estructura tiene dos efectos:

1. **Cohesión sin monotonía** — la base análoga garantiza que la interfaz se sienta unificada y serena (mínima tensión entre tonos vecinos), mientras el complementario introduce el contraste justo donde se necesita.
2. **El azul gana poder por escasez** — al ser el único color frío, cada aparición del azul se percibe con más peso. Por eso se reserva para los momentos de confianza y calma: el agente de salud mental, las mentorías, la privacidad.

**Regla de proporción 60 · 30 · 10:**

| Proporción | Familia | Función emocional |
|---|---|---|
| 60% | Neutros cálidos (crema, arena, cacao, topo) | Ambiente: seguridad, acogida, descanso visual |
| 30% | Marca cálida (terracota, coral, ámbar) | Identidad y acción: energía humana, avance |
| 10% | Contrapunto frío + semánticos (azul, oliva, granate) | Calma, estados y protección |

---

## Los 10 colores — mapeo emocional

| # | Color | Hex | Emoción / sensación | Rol | Uso en la app |
|---|---|---|---|---|---|
| 1 | **Terracota** | `#A8442A` | Pertenencia · calidez — "estás en casa" | Primario | Botones primarios, navegación activa, identidad de marca |
| 2 | **Coral** | `#CC4A2E` | Motivación · impulso — energía para actuar | Acento de acción | CTAs clave ("Cerrar el gap", "Registrar check-in"), progreso activo |
| 3 | **Ámbar** | `#D98E32` | Optimismo · logro — celebrar avances | Logro / warning suave | Badges de match (70%), hitos de trayectoria, gamificación |
| 4 | **Azul horizonte** | `#2C4E9E` | Confianza · calma — sostén emocional | Contrapunto frío | Módulo de salud mental, mensajes del agente IA, mentorías, privacidad |
| 5 | **Verde oliva** | `#5F7E3F` | Crecimiento · esperanza — progreso real | Éxito | Skills adquiridos, cursos completados, confirmaciones |
| 6 | **Granate** | `#9E2235` | Protección · urgencia — cuidado inmediato | Crítico | **Exclusivo** del flujo CVV y errores críticos |
| 7 | **Arena** | `#EFDFC4` | Serenidad · abrigo — descanso visual | Fondo suave | Fondos de tarjetas destacadas, secciones de bienestar |
| 8 | **Crema** | `#FAF1E6` | Acogida · respiro — espacio seguro | Fondo base | Fondo general de toda la app |
| 9 | **Cacao** | `#2B1E16` | Solidez · arraigo — voz estable | Texto principal | Titulares y cuerpo de texto |
| 10 | **Topo** | `#7A6557` | Equilibrio · discreción — jerarquía silenciosa | Texto secundario | Texto de apoyo, iconos inactivos, bordes |

Cada color de marca y semántico tiene una variante *soft* (tinte ~15% del mismo tono) para fondos de chips, bubbles y estados hover. No cuentan como colores adicionales — son el mismo tono desaturado:

| Color | Soft |
|---|---|
| Terracota | `#F4DCCB` |
| Coral | `#FBE2DA` |
| Ámbar | `#F6E3C0` |
| Azul horizonte | `#DDE7F8` |
| Verde oliva | `#E4ECD7` |
| Granate | `#F7DDE1` |

---

## Accesibilidad — contrastes verificados (WCAG 2.1)

Todos los pares de uso real cumplen AA. El coral original de Horizonte (`#D85537`, 4.0:1) fue oscurecido a `#CC4A2E` para superar el umbral de 4.5:1 con texto blanco.

| Par de uso | Ratio | Nivel |
|---|---|---|
| Terracota / blanco | 5.9:1 | AA texto normal |
| Coral / blanco | 4.6:1 | AA texto normal |
| Azul horizonte / blanco | 7.8:1 | AAA |
| Verde oliva / blanco | 4.6:1 | AA texto normal |
| Granate / blanco | 7.7:1 | AAA |
| Cacao / crema | 14.4:1 | AAA |
| Topo / crema | 4.9:1 | AA texto normal |
| Cacao oscuro (`#4A2B10`) / ámbar | 4.8:1 | AA texto normal |

**Reglas duras:**
- El ámbar **nunca** lleva texto blanco — siempre texto oscuro de su propia familia (`#4A2B10`).
- Arena y crema son exclusivamente fondos; nunca texto.
- Verificar cualquier par nuevo con la auditoría `@axe-core/react` ya prevista desde Fase 1.

---

## Aplicación por módulo (los 5 servicios)

| Módulo | Colores dominantes | Razonamiento emocional |
|---|---|---|
| Onboarding | Crema + terracota + ámbar | Acogida desde el primer segundo; el avance del wizard se celebra en ámbar |
| Formaciones | Ámbar + verde oliva | El aprendizaje como logro; lo completado florece en verde |
| Empleabilidad | Terracota + coral + ámbar | El módulo de mayor acción: gap, match y CTA viven aquí |
| Mentorías | Azul horizonte + terracota | Confianza primero (azul), conexión humana después (terracota) |
| Experiencias | Terracota + arena | Historias contadas en tono cálido, sin estridencia |
| Salud mental | Azul horizonte dominante + crema | El único módulo donde el frío domina: aquí se viene a calmarse, no a actuar |

---

## Regla especial — flujo CVV

El granate `#9E2235` está **reservado exclusivamente** para el modal de crisis y errores críticos:

- Ningún otro componente de la app puede usar granate (ni botones, ni badges, ni decoración).
- El modal CVV usa granate + blanco + crema únicamente — sin colores de marca que distraigan.
- Razonamiento: al mantener el granate fuera del lenguaje visual cotidiano, su aparición señala inequívocamente "esto es serio" sin necesidad de texto adicional. La distinción cromática respecto a terracota (ladrillo apagado, matiz ~15°) y coral (naranja saturado) es clara: el granate es un carmesí profundo (~350°) con el doble de contraste (7.7:1).

---

## Tokens — integración con Fase 0 del plan de frontend

Estos tokens reemplazan la tarea "Paleta BiT en CSS variables" de la Fase 0.

### CSS variables (`globals.css`)

```css
:root {
  /* Marca */
  --bit-terracota: #A8442A;
  --bit-terracota-soft: #F4DCCB;
  --bit-coral: #CC4A2E;
  --bit-coral-soft: #FBE2DA;
  --bit-ambar: #D98E32;
  --bit-ambar-soft: #F6E3C0;
  --bit-azul: #2C4E9E;
  --bit-azul-soft: #DDE7F8;

  /* Semánticos */
  --bit-oliva: #5F7E3F;
  --bit-oliva-soft: #E4ECD7;
  --bit-granate: #9E2235;
  --bit-granate-soft: #F7DDE1;

  /* Neutros */
  --bit-arena: #EFDFC4;
  --bit-crema: #FAF1E6;
  --bit-cacao: #2B1E16;
  --bit-topo: #7A6557;
}
```

### Tailwind (`tailwind.config.ts`)

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        terracota: { DEFAULT: "#A8442A", soft: "#F4DCCB" },
        coral:     { DEFAULT: "#CC4A2E", soft: "#FBE2DA" },
        ambar:     { DEFAULT: "#D98E32", soft: "#F6E3C0" },
        horizonte: { DEFAULT: "#2C4E9E", soft: "#DDE7F8" },
        oliva:     { DEFAULT: "#5F7E3F", soft: "#E4ECD7" },
        granate:   { DEFAULT: "#9E2235", soft: "#F7DDE1" },
        arena: "#EFDFC4",
        crema: "#FAF1E6",
        cacao: "#2B1E16",
        topo:  "#7A6557",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
};
export default config;
```

En shadcn/ui, mapear `primary` → terracota, `secondary` → ámbar, `destructive` → granate, `muted` → arena/topo en el bloque de variables HSL que genera el CLI.

---

## Modo oscuro

Los neutros invierten manteniendo la temperatura cálida (nunca grises fríos); los colores de marca suben un paso de luminosidad para conservar contraste AA sobre fondos oscuros:

| Token | Modo claro | Modo oscuro |
|---|---|---|
| Fondo base | `#FAF1E6` | `#201812` |
| Superficie | `#FFFFFF` | `#2A211A` |
| Texto principal | `#2B1E16` | `#F3E9DD` |
| Texto secundario | `#7A6557` | `#BCA897` |
| Terracota | `#A8442A` | `#D27A5C` |
| Coral | `#CC4A2E` | `#E8765A` |
| Ámbar | `#D98E32` | `#E8AC5C` |
| Azul horizonte | `#2C4E9E` | `#7D9BD6` |
| Verde oliva | `#5F7E3F` | `#97B271` |
| Granate | `#9E2235` | `#D16A7A` |

---

## Tipografía

| Uso | Fuente | Justificación |
|---|---|---|
| Display / titulares | **Fraunces** (variable, Google Fonts) | Serif humanista con calidez editorial — herencia de Raíz, refuerza el tono "verdaderamente humano" del producto |
| UI / cuerpo | **Inter** (variable, Google Fonts) | Legibilidad máxima en tamaños pequeños, soporte amplio de pesos, estándar en interfaces accesibles |

Cargar ambas vía `next/font/google` con `display: swap` (cero layout shift, sin FOIT).

---

## Do & Don't

**Do**
- Mantener la proporción 60-30-10: si una pantalla se siente "muy naranja", falta crema/arena.
- Usar el azul solo donde la emoción objetivo sea calma o confianza.
- Celebrar logros en ámbar y verde — son los colores de la dopamina del producto.
- Texto cacao sobre crema como par por defecto de toda la app.

**Don't**
- No usar granate fuera del flujo CVV — sin excepciones.
- No poner texto blanco sobre ámbar ni sobre arena/crema.
- No introducir un segundo color frío (violetas, teales): rompería la estructura complementaria.
- No usar terracota y coral juntos en el mismo componente al mismo nivel jerárquico — coral es acción puntual, terracota es identidad.

---

## Trazabilidad de la fusión

| Elemento | Origen |
|---|---|
| Terracota, ámbar, arena, crema, cacao, topo | Raíz (análoga cálida) |
| Azul horizonte, coral (oscurecido a `#CC4A2E`), estructura complementaria | Horizonte (complementaria dividida) |
| Verde oliva | Raíz (semántico) |
| Granate | Nuevo — necesario para distinguir crisis de los rojos cálidos de marca |
| Fraunces + Inter | Raíz (tipografía) |
