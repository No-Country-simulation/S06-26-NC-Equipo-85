export type DashboardModuleAccent =
  | "amber"
  | "terracotta"
  | "coral"
  | "blue"
  | "olive";

export type DashboardModule = {
  id: string;
  title: string;
  description: string;
  href: string;
  accent: DashboardModuleAccent;
};

export const DASHBOARD_MODULES = [
  {
    id: "formaciones",
    title: "Formaciones",
    description:
      "Cursos gratuitos y rutas sugeridas para cerrar tus brechas de skills.",
    href: "/courses",
    accent: "amber",
  },
  {
    id: "empleabilidad",
    title: "Empleabilidad",
    description:
      "Vacantes compatibles ordenadas por match con tu perfil actual.",
    href: "/jobs",
    accent: "terracotta",
  },
  {
    id: "experiencias",
    title: "Experiencias",
    description:
      "Historias de personas que ya recorrieron el camino que estás empezando.",
    href: "/experiencias",
    accent: "coral",
  },
  {
    id: "mentorias",
    title: "Mentorías",
    description:
      "Prácticas y encuentros con mentores para ganar confianza antes de postular.",
    href: "/mentorias",
    accent: "blue",
  },
  {
    id: "salud",
    title: "Salud mental",
    description:
      "Check-in diario, seguimiento emocional y acompañamiento empático.",
    href: "/salud",
    accent: "blue",
  },
] as const satisfies readonly DashboardModule[];