import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type { Job, JobFilters } from "./jobs.types";

const MOCK_DELAY_MS = 300;

/**
 * Fuerza el uso de mocks para empleos: el backend aún no expone `/vacantes`.
 * Mientras tanto, auth y onboarding sí consumen el backend real (este flag es
 * local a este service). Cuando exista el endpoint, poner en `false`.
 */
const USE_MOCKS = true;

const MOCK_JOBS: Job[] = [
  {
    id: "frontend-trainee",
    title: "Frontend Trainee",
    company: "BiT Partner",
    area: "frontend",
    location: "Remoto",
    salary: "$800.000 - $1.000.000 ARS",
    matchScore: 76,
    missingRequirements: ["React avanzado", "Testing básico"],
    description: "Buscamos un trainee frontend para sumarse al equipo de producto. Aprendizaje constante y mentorship incluido.",
    requirements: ["HTML/CSS", "JavaScript básico", "React avanzado", "Testing básico", "Git"],
    recommendedCourses: ["fcc-responsive", "fcc-javascript", "fcc-frontend-libs"],
  },
  {
    id: "web-ui-junior",
    title: "Web UI Junior",
    company: "Impact Tech",
    area: "frontend",
    location: "Híbrido - CABA",
    salary: "$1.000.000 - $1.300.000 ARS",
    matchScore: 71,
    missingRequirements: ["Accesibilidad", "Consumo de APIs"],
    description: "Desarrollador/a UI para construir interfaces accesibles y responsivas. Trabajo en equipo ágil.",
    requirements: ["HTML/CSS avanzado", "JavaScript", "Accesibilidad", "Consumo de APIs REST", "Figma"],
    recommendedCourses: ["fcc-responsive", "fcc-javascript"],
  },
  {
    id: "backend-trainee",
    title: "Backend Trainee",
    company: "BiT Partner",
    area: "backend",
    location: "Remoto",
    salary: "$800.000 - $1.100.000 ARS",
    matchScore: 68,
    missingRequirements: ["Bases de datos", "APIs REST"],
    description: "Oportunidad para crecer como backend developer en un equipo con buenas prácticas. Full remoto.",
    requirements: ["Java o Python básico", "Bases de datos SQL", "APIs REST", "Git"],
    recommendedCourses: ["oracle-java", "oracle-sql"],
  },
  {
    id: "fullstack-trainee",
    title: "Full Stack Trainee",
    company: "Impact Tech",
    area: "fullstack",
    location: "Remoto",
    salary: "$900.000 - $1.200.000 ARS",
    matchScore: 73,
    missingRequirements: ["Arquitectura frontend", "APIs REST"],
    description: "Programa de formación full stack con rotación por equipo frontend y backend.",
    requirements: ["HTML/CSS", "JavaScript", "Node.js básico", "Arquitectura frontend", "APIs REST"],
    recommendedCourses: ["fcc-javascript", "aws-cloud", "fcc-frontend-libs"],
  },
  {
    id: "qa-trainee",
    title: "QA Manual Trainee",
    company: "BiT Partner",
    area: "qa",
    location: "Remoto",
    salary: "$750.000 - $950.000 ARS",
    matchScore: 79,
    missingRequirements: ["Casos de prueba", "Reporte de bugs"],
    description: "Iniciate en calidad de software con manual testing. Te enseñamos metodologías y herramientas.",
    requirements: ["Fundamentos de testing", "Casos de prueba", "Reporte de bugs", "SQL básico"],
  },
  {
    id: "data-trainee",
    title: "Data Analyst Trainee",
    company: "Impact Tech",
    area: "data",
    location: "Híbrido - CABA",
    salary: "$850.000 - $1.100.000 ARS",
    matchScore: 66,
    missingRequirements: ["SQL", "Visualización de datos"],
    description: "Analizá datos para tomar decisiones de negocio. Trabajo con equipos de producto y marketing.",
    requirements: ["Excel avanzado", "SQL", "Visualización de datos", "Python básico"],
    recommendedCourses: ["google-data", "oracle-sql", "fcc-data-viz"],
  },
  {
    id: "frontend-sr",
    title: "Frontend Semi-Senior",
    company: "TechFlow",
    area: "frontend",
    location: "Remoto",
    salary: "$2.500.000 - $3.200.000 ARS",
    matchScore: 45,
    missingRequirements: ["React avanzado", "TypeScript avanzado", "Testing", "Next.js"],
    description: "Buscamos frontend con experiencia para liderar features y mentorar trainees.",
    requirements: ["React avanzado", "TypeScript", "Testing", "Next.js", "Arquitectura frontend"],
    recommendedCourses: ["fcc-frontend-libs", "fcc-javascript"],
  },
  {
    id: "data-analyst-junior",
    title: "Data Analyst Junior",
    company: "DataWise",
    area: "data",
    location: "Remoto",
    salary: "$1.200.000 - $1.600.000 ARS",
    matchScore: 54,
    missingRequirements: ["SQL avanzado", "Python para datos", "Tableau"],
    description: "Analizá y visualizá datos para potenciar decisiones del negocio. Equipo joven y dinámico.",
    requirements: ["SQL avanzado", "Python", "Tableau", "Estadística básica"],
    recommendedCourses: ["google-data", "oracle-sql", "fcc-python"],
  },
  {
    id: "backend-java-junior",
    title: "Backend Java Junior",
    company: "Oracle Partner",
    area: "backend",
    location: "Remoto",
    salary: "$1.300.000 - $1.800.000 ARS",
    matchScore: 52,
    missingRequirements: ["Java avanzado", "Spring Boot", "Bases de datos", "APIs REST"],
    description: "Desarrollá APIs y microservicios con Java y Spring Boot en un equipo consolidado.",
    requirements: ["Java", "Spring Boot", "Bases de datos SQL", "APIs REST", "Git"],
    recommendedCourses: ["oracle-java", "oracle-sql"],
  },
  {
    id: "cloud-trainee",
    title: "Cloud Trainee",
    company: "CloudFirst",
    area: "fullstack",
    location: "Remoto",
    salary: "$900.000 - $1.200.000 ARS",
    matchScore: 61,
    missingRequirements: ["Cloud fundamentals", "Linux básico", "Redes"],
    description: "Iniciate en cloud computing con AWS. Ideal para quienes quieren certificarse.",
    requirements: ["Cloud fundamentals", "Linux básico", "Redes", "Inglés técnico"],
    recommendedCourses: ["aws-cloud", "aws-architect"],
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(jobs: Job[], filters?: JobFilters): Job[] {
  if (!filters) return jobs;
  return jobs.filter((job) => {
    if (filters.area && job.area !== filters.area) return false;
    if (filters.matchScoreMin !== undefined && job.matchScore < filters.matchScoreMin) return false;
    return true;
  });
}

export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  if (USE_MOCKS || !getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    return applyFilters(MOCK_JOBS, filters);
  }

  const params = new URLSearchParams();
  if (filters?.area) params.set("area", filters.area);
  if (filters?.matchScoreMin !== undefined) params.set("matchScoreMin", String(filters.matchScoreMin));

  const query = params.toString();
  return apiRequest<Job[]>(`/vacantes${query ? `?${query}` : ""}`);
}

export async function getJobById(id: string): Promise<Job | null> {
  if (USE_MOCKS || !getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    return MOCK_JOBS.find((j) => j.id === id) ?? null;
  }

  return apiRequest<Job>(`/vacantes/${id}`);
}