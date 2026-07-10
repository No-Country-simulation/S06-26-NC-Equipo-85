import {
  Briefcase,
  CirclePlay,
  GraduationCap,
  Heart,
  MessageCircle,
} from "lucide-react";
import type { LandingService, LandingStat } from "../types/landing.types";

/**
 * Los 5 servicios del landing. El `accent` sigue la tabla "Aplicación por
 * módulo" del design system: Formaciones (ámbar), Empleabilidad/Experiencias
 * (terracota), Mentorías/Salud (azul-horizonte — confianza/calma).
 */
export const LANDING_SERVICES = [
  { key: "formaciones", icon: GraduationCap, accent: "ambar" },
  { key: "empleabilidad", icon: Briefcase, accent: "terracota" },
  { key: "experiencias", icon: CirclePlay, accent: "terracota" },
  { key: "mentorias", icon: MessageCircle, accent: "azul-horizonte" },
  { key: "salud", icon: Heart, accent: "azul-horizonte" },
] as const satisfies readonly LandingService[];

/**
 * Métricas de prueba social.
 *
 * TODO: estos números (+12.000, 240, 85%, 5) son copy estático del mockup;
 * cuando exista un endpoint de métricas públicas (no definido en
 * appbit-backend-plan.md), reemplazar por fetch real o dejar como contenido
 * editorial fijo si el equipo de producto lo confirma.
 */
export const LANDING_STATS = [
  { value: "+12.000", labelKey: "users" },
  { value: "240", labelKey: "courses" },
  { value: "85%", labelKey: "matchImprovement" },
  { value: "5", labelKey: "services" },
] as const satisfies readonly LandingStat[];
