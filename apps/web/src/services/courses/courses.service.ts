import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type { Course, CourseFilters } from "./courses.types";

const MOCK_DELAY_MS = 300;

const MOCK_COURSES: Course[] = [
  {
    id: "google-ux",
    title: "Google UX Design",
    provider: "google",
    level: "principiante",
    area: "frontend",
    duration: "6 meses",
    videoUrl: "https://www.youtube.com/watch?v=wT4oaX2lNT8",
    description: "Aprendé los fundamentos del diseño UX: investigación, wireframes, prototipos y testing con usuarios.",
    skills: ["Investigación UX", "Wireframing", "Prototipado", "Figma"],
  },
  {
    id: "google-data",
    title: "Google Data Analytics",
    provider: "google",
    level: "principiante",
    area: "data",
    duration: "6 meses",
    videoUrl: "https://www.youtube.com/watch?v=kiTZP1H8H5A",
    description: "Descubrí cómo transformar datos en decisiones: SQL, hojas de cálculo, Tableau y R.",
    skills: ["SQL", "Hojas de cálculo", "Tableau", "R"],
  },
  {
    id: "oracle-sql",
    title: "Oracle SQL Basics",
    provider: "oracle",
    level: "intermedio",
    area: "data",
    duration: "4 semanas",
    description: "Bases de datos relacionales: consultas SQL, joins, subqueries y optimización.",
    skills: ["SQL", "Joins", "Subqueries", "Índices"],
  },
  {
    id: "aws-cloud",
    title: "AWS Cloud Practitioner",
    provider: "aws",
    level: "principiante",
    area: "fullstack",
    duration: "4 semanas",
    videoUrl: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    description: "Fundamentos de la nube AWS: computación, almacenamiento, redes y seguridad.",
    skills: ["EC2", "S3", "VPC", "IAM"],
  },
  {
    id: "aws-architect",
    title: "AWS Solutions Architect",
    provider: "aws",
    level: "avanzado",
    area: "fullstack",
    duration: "12 semanas",
    description: "Diseño de arquitecturas escalables y resilientes en AWS.",
    skills: ["Arquitectura AWS", "Alta disponibilidad", "Microservicios"],
  },
  {
    id: "microsoft-azure",
    title: "Microsoft Azure Fundamentals",
    provider: "microsoft",
    level: "principiante",
    area: "fullstack",
    duration: "4 semanas",
    videoUrl: "https://www.youtube.com/watch?v=NKEFWyqJcBY",
    description: "Conceptos básicos de Azure: servicios en la nube, seguridad, privacidad y compliance.",
    skills: ["Azure", "Cloud computing", "Seguridad en nube"],
  },
  {
    id: "fcc-responsive",
    title: "Responsive Web Design",
    provider: "freecodecamp",
    level: "principiante",
    area: "frontend",
    duration: "300 horas",
    videoUrl: "https://www.youtube.com/watch?v=srvUrASNj0s",
    description: "HTML5, CSS3, Flexbox, Grid y diseño responsive desde cero.",
    skills: ["HTML", "CSS", "Flexbox", "CSS Grid", "Responsive Design"],
  },
  {
    id: "fcc-javascript",
    title: "JavaScript Algorithms and Data Structures",
    provider: "freecodecamp",
    level: "intermedio",
    area: "frontend",
    duration: "300 horas",
    videoUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    description: "Fundamentos de JS: variables, funciones, objetos, arrays, algoritmos y estructuras de datos.",
    skills: ["JavaScript", "ES6", "Algoritmos", "Estructuras de datos"],
  },
  {
    id: "fcc-python",
    title: "Scientific Computing with Python",
    provider: "freecodecamp",
    level: "intermedio",
    area: "data",
    duration: "300 horas",
    videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    description: "Python desde cero hasta análisis de datos: listas, bucles, diccionarios, clases y NumPy.",
    skills: ["Python", "NumPy", "POO", "Análisis de datos"],
  },
  {
    id: "fcc-frontend-libs",
    title: "Frontend Development Libraries",
    provider: "freecodecamp",
    level: "intermedio",
    area: "frontend",
    duration: "300 horas",
    description: "React, Redux, Bootstrap, jQuery y SASS para construir interfaces modernas.",
    skills: ["React", "Redux", "Bootstrap", "SASS"],
  },
  {
    id: "fcc-data-viz",
    title: "Data Visualization",
    provider: "freecodecamp",
    level: "intermedio",
    area: "data",
    duration: "300 horas",
    description: "D3.js, visualización de datos, gráficos interactivos y dashboards.",
    skills: ["D3.js", "Visualización de datos", "SVG", "Chart.js"],
  },
  {
    id: "oracle-java",
    title: "Oracle Java Foundations",
    provider: "oracle",
    level: "principiante",
    area: "backend",
    duration: "8 semanas",
    videoUrl: "https://www.youtube.com/watch?v=eIrMbAQSU34",
    description: "Introducción a Java: sintaxis, POO, herencia, interfaces y colecciones.",
    skills: ["Java", "POO", "Herencia", "Colecciones"],
  },
  {
    id: "oracle-cloud",
    title: "Oracle Cloud Infrastructure",
    provider: "oracle",
    level: "avanzado",
    area: "fullstack",
    duration: "12 semanas",
    description: "Administración de OCI: redes, almacenamiento, bases de datos y seguridad.",
    skills: ["OCI", "Redes en nube", "Bases de datos", "Seguridad"],
  },
  {
    id: "google-project-mgmt",
    title: "Google Project Management",
    provider: "google",
    level: "principiante",
    area: "fullstack",
    duration: "6 meses",
    description: "Metodologías ágiles, Scrum, gestión de equipos y herramientas de proyecto.",
    skills: ["Scrum", "Ágil", "Liderazgo", "Asana"],
  },
  {
    id: "microsoft-power",
    title: "Microsoft Power Platform",
    provider: "microsoft",
    level: "intermedio",
    area: "fullstack",
    duration: "6 semanas",
    description: "Power Apps, Power Automate, Power BI y Power Virtual Agents.",
    skills: ["Power Apps", "Power Automate", "Power BI", "Virtual Agents"],
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyFilters(courses: Course[], filters?: CourseFilters): Course[] {
  if (!filters) return courses;
  return courses.filter((course) => {
    if (filters.provider && course.provider !== filters.provider) return false;
    if (filters.level && course.level !== filters.level) return false;
    if (filters.area && course.area !== filters.area) return false;
    return true;
  });
}

export async function getCourses(filters?: CourseFilters): Promise<Course[]> {
  if (!getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    return applyFilters(MOCK_COURSES, filters);
  }

  const params = new URLSearchParams();
  if (filters?.provider) params.set("provider", filters.provider);
  if (filters?.level) params.set("level", filters.level);
  if (filters?.area) params.set("area", filters.area);

  const query = params.toString();
  return apiRequest<Course[]>(`/cursos${query ? `?${query}` : ""}`);
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (!getApiBaseUrl()) {
    await wait(MOCK_DELAY_MS);
    return MOCK_COURSES.find((c) => c.id === id) ?? null;
  }

  return apiRequest<Course>(`/cursos/${id}`);
}