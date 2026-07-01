import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type { Experience, ExperienceFilters } from "./experiencias.types";

const MOCK_DELAY_MS = 300;

const MOCK_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    title: "De auxiliar administrativa a desarrolladora frontend",
    speakerName: "Camila R.",
    speakerRole: "Desarrolladora Frontend en Mercado Libre",
    area: "FRONTEND",
    experienceType: "JOB_EXPERIENCE",
    videoUrl: "https://www.youtube.com/watch?v=wT4oaX2lNT8",
    duration: "4:32",
    description: "Camila trabajaba en administración y estudiaba de noche. En 18 meses completó el curso de Google UX Design y consiguió su primer empleo como desarrolladora.",
  },
  {
    id: "exp-2",
    title: "Bootcamp intensivo: de cero a backend en 12 semanas",
    speakerName: "Lautaro M.",
    speakerRole: "Desarrollador Backend en Auth0",
    area: "BACKEND",
    experienceType: "BOOTCAMP",
    videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
    duration: "5:10",
    description: "Lautaro dejó su trabajo en gastronomía para hacer un bootcamp. Hoy trabaja en una empresa de autenticación global.",
  },
  {
    id: "exp-3",
    title: "Workshop: cómo armar tu portfolio técnico",
    speakerName: "Sofía G.",
    speakerRole: "Tech Recruiter en Google",
    area: "SOFT_SKILLS",
    experienceType: "WORKSHOP",
    videoUrl: "https://www.youtube.com/watch?v=srvUrASNj0s",
    duration: "8:15",
    description: "Tips prácticos para mostrar tus proyectos, escribir tu perfil de LinkedIn y destacar en entrevistas técnicas.",
  },
  {
    id: "exp-4",
    title: "Migrando a datos: mi historia con Google Data Analytics",
    speakerName: "Martín P.",
    speakerRole: "Analista de Datos en Telecom",
    area: "DATA_SCIENCE",
    experienceType: "JOB_EXPERIENCE",
    videoUrl: "https://www.youtube.com/watch?v=kiTZP1H8H5A",
    duration: "3:45",
    description: "Martín era contador y se certificó en Google Data Analytics. Ahora trabaja en el equipo de datos de una telecomunicaciones.",
  },
  {
    id: "exp-5",
    title: "Webinar: Mujeres en tecnología — rompiendo brechas",
    speakerName: "Valentina L.",
    speakerRole: "Engineering Manager en Globant",
    area: "SOFT_SKILLS",
    experienceType: "WEBINAR",
    videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    duration: "12:00",
    description: "Valentina comparte su experiencia liderando equipos de ingeniería y cómo las mujeres pueden construir carrera en tech.",
  },
  {
    id: "exp-6",
    title: "Bootcamp de testing: de QA manual a automatización",
    speakerName: "Diego F.",
    speakerRole: "QA Automation en Accenture",
    area: "FRONTEND",
    experienceType: "BOOTCAMP",
    videoUrl: "https://www.youtube.com/watch?v=NKEFWyqJcBY",
    duration: "6:20",
    description: "Diego empezó como tester manual sin título técnico. Un bootcamp de automatización le abrió las puertas a una consultora global.",
  },
  {
    id: "exp-7",
    title: "Diseño UX sin título universitario: mi camino",
    speakerName: "Lucía N.",
    speakerRole: "UX Designer en Despegar",
    area: "DESIGN_UX_UI",
    experienceType: "JOB_EXPERIENCE",
    videoUrl: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    duration: "4:50",
    description: "Lucía armó su portfolio con proyectos freelance mientras estudiaba cursos gratuitos. Hoy diseña para una de las plataformas de viajes más grandes de LATAM.",
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(
  experiences: Experience[],
  filters?: ExperienceFilters,
): Experience[] {
  if (!filters) return experiences;
  return experiences.filter((exp) => {
    if (filters.area && exp.area !== filters.area) return false;
    if (filters.experienceType && exp.experienceType !== filters.experienceType) return false;
    return true;
  });
}

export async function getExperiencias(
  filters?: ExperienceFilters,
): Promise<Experience[]> {
  if (!getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    return applyFilters(MOCK_EXPERIENCES, filters);
  }

  const params = new URLSearchParams();
  if (filters?.area) params.set("area", filters.area);
  if (filters?.experienceType) params.set("experienceType", filters.experienceType);

  const query = params.toString();
  return apiRequest<Experience[]>(`/api/experiencias${query ? `?${query}` : ""}`);
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  if (!getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    return MOCK_EXPERIENCES.find((exp) => exp.id === id) ?? null;
  }

  return apiRequest<Experience>(`/api/experiencias/${id}`);
}