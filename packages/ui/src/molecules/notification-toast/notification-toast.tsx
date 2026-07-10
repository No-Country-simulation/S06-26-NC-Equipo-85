"use client";

import { toast, Toaster, type ExternalToast } from "sonner";

import { cn } from "../../lib/utils";

// Presets de notificación sobre sonner siguiendo la paleta Amanecer.
// Regla crítica: `critical` (granate) se reserva al flujo CVV / errores críticos.
const TONES = {
  success: "border-oliva/30 bg-oliva-soft text-oliva", // éxito → oliva
  info: "border-azul-horizonte/30 bg-azul-horizonte-soft text-azul-horizonte",
  error: "border-ambar/40 bg-ambar-soft text-cacao", // ámbar: texto cacao, nunca blanco
  critical: "border-granate/40 bg-granate-soft text-granate", // granate: solo CVV/críticos
} as const;

type ToneKey = keyof typeof TONES;

function emit(tone: ToneKey, message: string, options?: ExternalToast) {
  return toast(message, {
    ...options,
    className: cn(TONES[tone], options?.className),
  });
}

const notify = {
  success: (message: string, options?: ExternalToast) =>
    emit("success", message, options),
  info: (message: string, options?: ExternalToast) =>
    emit("info", message, options),
  error: (message: string, options?: ExternalToast) =>
    emit("error", message, options),
  critical: (message: string, options?: ExternalToast) =>
    emit("critical", message, options),
};

export { notify, Toaster, toast };
export type { ExternalToast };
